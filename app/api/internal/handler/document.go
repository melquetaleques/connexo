package handler

import (
	"net/http"
	"time"

	"app/api/internal/domain"
	"github.com/google/uuid"
)

// DocumentHandler gerencia o ciclo de vida de documentos dos processos.
type DocumentHandler struct {
	docs      domain.DocumentRepository
	processes domain.ProcessRepository
	links     domain.LinkRepository
}

// NewDocumentHandler constroi um DocumentHandler.
func NewDocumentHandler(
	docRepo domain.DocumentRepository,
	processRepo domain.ProcessRepository,
	linkRepo domain.LinkRepository,
) *DocumentHandler {
	return &DocumentHandler{
		docs:      docRepo,
		processes: processRepo,
		links:     linkRepo,
	}
}

// Upload godoc
// POST /api/docs/upload
func (h *DocumentHandler) Upload(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value(userContextKey).(*domain.User)

	processIDStr := r.FormValue("process_id")
	pID, err := uuid.Parse(processIDStr)
	if err != nil {
		respondErr(w, http.StatusBadRequest, "id do processo invalido")
		return
	}

	// Validar vinculo ativo: apenas advogado dono ou contador vinculado
	if user.Role == domain.RoleAdvogado || user.Role == domain.RoleAdmin {
		process, err := h.processes.FindByID(r.Context(), pID)
		if err != nil || process == nil || process.LawyerID != user.ID {
			respondErr(w, http.StatusForbidden, "voce nao possui vinculo com este processo")
			return
		}
	} else if user.Role == domain.RoleContador {
		link, err := h.links.FindActiveByProcess(r.Context(), pID)
		if err != nil || link == nil || link.AccountantID != user.ID {
			respondErr(w, http.StatusForbidden, "voce nao possui vinculo ativo com este processo")
			return
		}
	} else {
		respondErr(w, http.StatusForbidden, "perfil nao autorizado para upload de documentos")
		return
	}

	docName := r.FormValue("name")
	if docName == "" {
		docName = "Documento Sem Nome"
	}

	doc := &domain.Document{
		ID:                  uuid.New(),
		ProcessID:           pID,
		UploadedBy:          user.ID,
		Name:                docName,
		SizeBytes:           1024 * 5,
		MimeType:            "application/pdf",
		StoragePath:         "https://storage.connexo.com.br/docs/" + uuid.New().String() + ".pdf",
		VisibleToAccountant: user.Role == domain.RoleAdvogado || user.Role == domain.RoleAdmin,
		CreatedAt:           time.Now(),
	}

	if err := h.docs.Create(r.Context(), doc); err != nil {
		respondErr(w, http.StatusInternalServerError, "erro ao salvar documento")
		return
	}

	respond(w, http.StatusCreated, doc)
}

// ListByProcess godoc
// GET /api/docs/process/{id}
func (h *DocumentHandler) ListByProcess(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value(userContextKey).(*domain.User)
	idStr := r.PathValue("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		respondErr(w, http.StatusBadRequest, "id invalido")
		return
	}

	// Validar acesso ao processo
	process, err := h.processes.FindByID(r.Context(), id)
	if err != nil || process == nil {
		respondErr(w, http.StatusNotFound, "processo nao encontrado")
		return
	}

	hasAccess := false
	if user.Role == domain.RoleAdvogado || user.Role == domain.RoleAdmin {
		hasAccess = process.LawyerID == user.ID
	} else if user.Role == domain.RoleContador {
		link, err := h.links.FindActiveByProcess(r.Context(), id)
		hasAccess = err == nil && link != nil && link.AccountantID == user.ID
	}

	if !hasAccess {
		respondErr(w, http.StatusForbidden, "voce nao possui acesso a este processo")
		return
	}

	forAccountant := user.Role == domain.RoleContador
	list, err := h.docs.ListByProcess(r.Context(), id, forAccountant)
	if err != nil {
		respondErr(w, http.StatusInternalServerError, "erro ao listar documentos")
		return
	}

	respond(w, http.StatusOK, list)
}

// ToggleVisibility godoc
// PATCH /api/docs/{id}/visibility
func (h *DocumentHandler) ToggleVisibility(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value(userContextKey).(*domain.User)
	idStr := r.PathValue("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		respondErr(w, http.StatusBadRequest, "id invalido")
		return
	}

	// Apenas advogados/admin podem alterar visibilidade
	if user.Role != domain.RoleAdvogado && user.Role != domain.RoleAdmin {
		respondErr(w, http.StatusForbidden, "apenas advogados podem alterar visibilidade de documentos")
		return
	}

	visible := r.URL.Query().Get("visible") == "true"

	if err := h.docs.SetAccountantVisibility(r.Context(), id, visible); err != nil {
		respondErr(w, http.StatusInternalServerError, "erro ao atualizar visibilidade")
		return
	}

	respond(w, http.StatusOK, map[string]string{"message": "visibilidade atualizada"})
}
