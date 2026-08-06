package handler

import (
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"app/api/internal/domain"
	"app/api/internal/repository"
	"github.com/google/uuid"
)

// maxUploadBytes limita o tamanho de um upload de documento (25 MB).
const maxUploadBytes = 25 << 20

// DocumentHandler gerencia o ciclo de vida de documentos dos processos.
type DocumentHandler struct {
	docs      *repository.DocumentRepository
	processes domain.ProcessRepository
	links     domain.LinkRepository
}

// NewDocumentHandler constroi um DocumentHandler.
func NewDocumentHandler(
	docRepo *repository.DocumentRepository,
	processRepo domain.ProcessRepository,
	linkRepo domain.LinkRepository,
) *DocumentHandler {
	return &DocumentHandler{
		docs:      docRepo,
		processes: processRepo,
		links:     linkRepo,
	}
}

// canAccessProcess verifica se o usuário pode ver ou enviar documentos de um
// processo: advogado dono, ou contador com vínculo vigente.
func (h *DocumentHandler) canAccessProcess(r *http.Request, processID uuid.UUID, user *domain.User) bool {
	switch user.Role {
	case domain.RoleAdvogado, domain.RoleAdmin:
		process, err := h.processes.FindByID(r.Context(), processID)
		return err == nil && process != nil && process.LawyerID == user.ID
	case domain.RoleContador:
		link, err := h.links.FindActiveByProcess(r.Context(), processID)
		return err == nil && link != nil && link.AccountantID == user.ID
	default:
		return false
	}
}

// segmentAfter extrai o UUID que segue um segmento nomeado do path.
// Ex.: segmentAfter("/api/adv/processes/{id}/documents", "processes").
func segmentAfter(path, segment string) (uuid.UUID, bool) {
	parts := strings.Split(strings.Trim(path, "/"), "/")
	for i, p := range parts {
		if p == segment && i+1 < len(parts) {
			id, err := uuid.Parse(parts[i+1])
			return id, err == nil
		}
	}
	return uuid.Nil, false
}

// HandleProcessDocuments atende GET e POST em /api/adv/processes/{id}/documents.
func (h *DocumentHandler) HandleProcessDocuments(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		h.ListByProcess(w, r)
	case http.MethodPost:
		h.Upload(w, r)
	default:
		respondErr(w, http.StatusMethodNotAllowed, "método não permitido")
	}
}

// Upload godoc
// POST /api/adv/processes/{id}/documents
func (h *DocumentHandler) Upload(w http.ResponseWriter, r *http.Request) {
	user := userFromContext(r.Context())
	if user == nil {
		respondErr(w, http.StatusUnauthorized, "não autenticado")
		return
	}

	pID, ok := segmentAfter(r.URL.Path, "processes")
	if !ok {
		respondErr(w, http.StatusBadRequest, "id do processo inválido")
		return
	}

	if !h.canAccessProcess(r, pID, user) {
		respondErr(w, http.StatusForbidden, "você não possui vínculo com este processo")
		return
	}

	if err := r.ParseMultipartForm(maxUploadBytes); err != nil {
		respondErr(w, http.StatusBadRequest, "formulário inválido ou arquivo muito grande")
		return
	}

	file, header, err := r.FormFile("file")
	if err != nil {
		respondErr(w, http.StatusBadRequest, "arquivo não enviado")
		return
	}
	defer file.Close()

	if header.Size > maxUploadBytes {
		respondErr(w, http.StatusRequestEntityTooLarge, "arquivo excede o limite de 25MB")
		return
	}

	contentType := header.Header.Get("Content-Type")
	if contentType == "" {
		contentType = "application/octet-stream"
	}

	bucket, key, url, err := h.docs.Upload(r.Context(), file, header.Size, header.Filename, contentType)
	if err != nil {
		respondErr(w, http.StatusBadGateway, "erro ao armazenar o arquivo")
		return
	}

	name := r.FormValue("name")
	if name == "" {
		name = header.Filename
	}

	doc := &domain.Document{
		ID:          uuid.New(),
		ProcessID:   pID,
		UploadedBy:  user.ID,
		Name:        name,
		SizeBytes:   header.Size,
		MimeType:    contentType,
		Bucket:      bucket,
		ObjectKey:   key,
		StoragePath: url,
		// Documento enviado pelo contador já nasce visível a ele; enviado pelo
		// advogado nasce restrito até liberação explícita (LGPD, escopo §5).
		VisibleToAccountant: user.Role == domain.RoleContador,
		CreatedAt:           time.Now(),
	}

	if err := h.docs.Create(r.Context(), doc); err != nil {
		respondErr(w, http.StatusInternalServerError, "erro ao salvar documento")
		return
	}

	respond(w, http.StatusCreated, doc)
}

// ListByProcess godoc
// GET /api/adv/processes/{id}/documents
func (h *DocumentHandler) ListByProcess(w http.ResponseWriter, r *http.Request) {
	user := userFromContext(r.Context())
	if user == nil {
		respondErr(w, http.StatusUnauthorized, "não autenticado")
		return
	}

	pID, ok := segmentAfter(r.URL.Path, "processes")
	if !ok {
		respondErr(w, http.StatusBadRequest, "id do processo inválido")
		return
	}

	if !h.canAccessProcess(r, pID, user) {
		respondErr(w, http.StatusForbidden, "você não possui acesso a este processo")
		return
	}

	forAccountant := user.Role == domain.RoleContador
	list, err := h.docs.ListByProcess(r.Context(), pID, forAccountant)
	if err != nil {
		respondErr(w, http.StatusInternalServerError, "erro ao listar documentos")
		return
	}

	respond(w, http.StatusOK, list)
}

// ToggleVisibility godoc
// PUT /api/adv/documents/{id}/visibility
func (h *DocumentHandler) ToggleVisibility(w http.ResponseWriter, r *http.Request) {
	user := userFromContext(r.Context())
	if user == nil {
		respondErr(w, http.StatusUnauthorized, "não autenticado")
		return
	}

	if user.Role != domain.RoleAdvogado && user.Role != domain.RoleAdmin {
		respondErr(w, http.StatusForbidden, "apenas advogados podem alterar visibilidade de documentos")
		return
	}

	id, ok := segmentAfter(r.URL.Path, "documents")
	if !ok {
		respondErr(w, http.StatusBadRequest, "id do documento inválido")
		return
	}

	doc, err := h.docs.GetByID(r.Context(), id)
	if err != nil || doc == nil {
		respondErr(w, http.StatusNotFound, "documento não encontrado")
		return
	}

	// O documento precisa pertencer a um processo do advogado.
	process, err := h.processes.FindByID(r.Context(), doc.ProcessID)
	if err != nil || process == nil || process.LawyerID != user.ID {
		respondErr(w, http.StatusForbidden, "este documento não pertence a você")
		return
	}

	var body struct {
		Visible *bool `json:"visible"`
	}
	_ = json.NewDecoder(r.Body).Decode(&body)

	visible := r.URL.Query().Get("visible") == "true"
	if body.Visible != nil {
		visible = *body.Visible
	}

	if err := h.docs.SetAccountantVisibility(r.Context(), id, visible); err != nil {
		respondErr(w, http.StatusInternalServerError, "erro ao atualizar visibilidade")
		return
	}

	respond(w, http.StatusOK, map[string]any{
		"message": "visibilidade atualizada",
		"visible": visible,
	})
}
