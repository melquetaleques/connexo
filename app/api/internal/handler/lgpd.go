package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"app/api/internal/repository"
	"github.com/google/uuid"
)

// LGPDHandler lida com as rotas de LGPD e gestão documental avançada.
type LGPDHandler struct {
	LGPDRepo *repository.LGPDRepository
	UserRepo *repository.UserRepository
	LinkRepo *repository.LinkRepository
	NotifRepo *repository.NotificationRepository
}

// NewLGPDHandler cria uma nova instância de LGPDHandler.
func NewLGPDHandler(lgpdRepo *repository.LGPDRepository, userRepo *repository.UserRepository, linkRepo *repository.LinkRepository, notifRepo *repository.NotificationRepository) *LGPDHandler {
	return &LGPDHandler{
		LGPDRepo: lgpdRepo,
		UserRepo: userRepo,
		LinkRepo: linkRepo,
		NotifRepo: notifRepo,
	}
}

// ---------------------------------------------------------------------------
// Consentimento LGPD
// ---------------------------------------------------------------------------

// handleClientConsent registra o consentimento LGPD do cliente.
// POST /api/cli/consent
func (h *LGPDHandler) handleClientConsent(w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	userIDStr := req.Header.Get("X-Authenticated-User-ID")
	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		http.Error(w, "Usuário não autenticado", http.StatusUnauthorized)
		return
	}

	// Verificar se o usuário é cliente
	user, err := h.UserRepo.GetByID(req.Context(), userID)
	if err != nil || user == nil {
		http.Error(w, "Usuário não encontrado", http.StatusUnauthorized)
		return
	}
	if user.Role != "cliente" {
		http.Error(w, "Apenas clientes podem registrar consentimento LGPD", http.StatusForbidden)
		return
	}

	var body struct {
		LinkID string `json:"link_id"`
	}
	if err := json.NewDecoder(req.Body).Decode(&body); err != nil {
		http.Error(w, "Body inválido", http.StatusBadRequest)
		return
	}

	if body.LinkID == "" {
		http.Error(w, "link_id é obrigatório", http.StatusBadRequest)
		return
	}

	linkUUID, err := uuid.Parse(body.LinkID)
	if err != nil {
		http.Error(w, "link_id inválido", http.StatusBadRequest)
		return
	}

	// Verificar se o vínculo pertence ao cliente
	link, err := h.LinkRepo.FindByID(req.Context(), linkUUID)
	if err != nil {
		http.Error(w, "Erro ao buscar vínculo: "+err.Error(), http.StatusInternalServerError)
		return
	}
	if link == nil {
		http.Error(w, "Vínculo não encontrado", http.StatusNotFound)
		return
	}
	if link.ClientID != userID {
		http.Error(w, "Este vínculo não pertence a você", http.StatusForbidden)
		return
	}

	// Capturar IP e User-Agent do request
	ipAddress := req.Header.Get("X-Real-IP")
	if ipAddress == "" {
		ipAddress = req.RemoteAddr
	}
	userAgent := req.Header.Get("User-Agent")

	// Registrar consentimento
	consent := &repository.ConsentRecord{
		ClientID:    userID,
		LinkID:      linkUUID,
		IPAddress:   ipAddress,
		UserAgent:   userAgent,
		TextVersion: "lgpd-v1.0",
	}

	if err := h.LGPDRepo.CreateConsent(req.Context(), consent); err != nil {
		http.Error(w, "Erro ao registrar consentimento: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success":  true,
		"consent":  consent,
	})
}

// handleCheckConsent verifica se existe consentimento para um vínculo.
// GET /api/cli/consent/check/{link_id}
func (h *LGPDHandler) handleCheckConsent(w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Extrair link_id do path: /api/cli/consent/check/{link_id}
	pathParts := strings.Split(strings.TrimSuffix(req.URL.Path, "/"), "/")
	// [ "", "api", "cli", "consent", "check", "{link_id}" ]
	if len(pathParts) < 6 || pathParts[5] == "" {
		http.Error(w, "link_id não fornecido na URL", http.StatusBadRequest)
		return
	}

	linkID, err := uuid.Parse(pathParts[5])
	if err != nil {
		http.Error(w, "link_id inválido", http.StatusBadRequest)
		return
	}

	has, err := h.LGPDRepo.HasConsent(req.Context(), uuid.Nil, linkID)
	if err != nil {
		http.Error(w, "Erro ao verificar consentimento: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"has_consent": has,
	})
}

// ---------------------------------------------------------------------------
// Permissões de Documento (Advogado)
// ---------------------------------------------------------------------------

// handleToggleDocPermission concede ou revoga permissão de um documento para um vínculo.
// POST /api/adv/documents/{id}/permissions/{link_id}
func (h *LGPDHandler) handleToggleDocPermission(w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodPost && req.Method != http.MethodPut {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	userIDStr := req.Header.Get("X-Authenticated-User-ID")
	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		http.Error(w, "Usuário não autenticado", http.StatusUnauthorized)
		return
	}

	// Verificar se é advogado
	user, err := h.UserRepo.GetByID(req.Context(), userID)
	if err != nil || user == nil {
		http.Error(w, "Usuário não encontrado", http.StatusUnauthorized)
		return
	}
	if user.Role != "advogado" {
		http.Error(w, "Apenas advogados podem gerenciar permissões de documentos", http.StatusForbidden)
		return
	}

	// Extrair document_id e link_id do path: /api/adv/documents/{id}/permissions/{link_id}
	pathParts := strings.Split(strings.TrimSuffix(req.URL.Path, "/"), "/")
	// [ "", "api", "adv", "documents", "{id}", "permissions", "{link_id}" ]
	if len(pathParts) < 7 || pathParts[4] == "" || pathParts[6] == "" {
		http.Error(w, "document_id ou link_id não fornecidos na URL", http.StatusBadRequest)
		return
	}

	documentID, err := uuid.Parse(pathParts[4])
	if err != nil {
		http.Error(w, "document_id inválido", http.StatusBadRequest)
		return
	}

	linkID, err := uuid.Parse(pathParts[6])
	if err != nil {
		http.Error(w, "link_id inválido", http.StatusBadRequest)
		return
	}

	// Toggle permissão
	granted, err := h.LGPDRepo.TogglePermission(req.Context(), documentID, linkID, userID)
	if err != nil {
		http.Error(w, "Erro ao alterar permissão: "+err.Error(), http.StatusInternalServerError)
		return
	}

	status := "concedida"
	if !granted {
		status = "revogada"
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success":      true,
		"granted":      granted,
		"status":       status,
		"document_id":  documentID.String(),
		"link_id":      linkID.String(),
	})
}

// handleListDocPermissions lista permissões ativas de documentos para um vínculo.
// GET /api/adv/links/{id}/permissoes
func (h *LGPDHandler) handleListDocPermissions(w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Extrair link_id do path: /api/adv/links/{id}/permissoes
	pathParts := strings.Split(strings.TrimSuffix(req.URL.Path, "/"), "/")
	// [ "", "api", "adv", "links", "{id}", "permissoes" ]
	if len(pathParts) < 6 || pathParts[4] == "" {
		http.Error(w, "link_id não fornecido na URL", http.StatusBadRequest)
		return
	}

	linkID, err := uuid.Parse(pathParts[4])
	if err != nil {
		http.Error(w, "link_id inválido", http.StatusBadRequest)
		return
	}

	perms, err := h.LGPDRepo.ListPermissionsByLink(req.Context(), linkID)
	if err != nil {
		http.Error(w, "Erro ao listar permissões: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"permissions": perms,
	})
}

// handleListDocPermissionsByDoc lista permissões de um documento específico.
// GET /api/adv/documents/{id}/permissoes
func (h *LGPDHandler) handleListDocPermissionsByDoc(w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Extrair document_id do path: /api/adv/documents/{id}/permissoes
	pathParts := strings.Split(strings.TrimSuffix(req.URL.Path, "/"), "/")
	if len(pathParts) < 5 || pathParts[4] == "" {
		http.Error(w, "document_id não fornecido na URL", http.StatusBadRequest)
		return
	}

	documentID, err := uuid.Parse(pathParts[4])
	if err != nil {
		http.Error(w, "document_id inválido", http.StatusBadRequest)
		return
	}

	perms, err := h.LGPDRepo.ListPermissionsByDocument(req.Context(), documentID)
	if err != nil {
		http.Error(w, "Erro ao listar permissões: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"permissions": perms,
	})
}

// ---------------------------------------------------------------------------
// Solicitação de Documento (Advogado → Cliente)
// ---------------------------------------------------------------------------

// handleSolicitarDoc permite ao advogado solicitar um documento ao cliente.
// POST /api/adv/processes/{id}/solicitar-doc
func (h *LGPDHandler) handleSolicitarDoc(w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	userIDStr := req.Header.Get("X-Authenticated-User-ID")
	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		http.Error(w, "Usuário não autenticado", http.StatusUnauthorized)
		return
	}

	// Verificar se é advogado
	user, err := h.UserRepo.GetByID(req.Context(), userID)
	if err != nil || user == nil {
		http.Error(w, "Usuário não encontrado", http.StatusUnauthorized)
		return
	}
	if user.Role != "advogado" {
		http.Error(w, "Apenas advogados podem solicitar documentos", http.StatusForbidden)
		return
	}

	// Extrair process_id do path: /api/adv/processes/{id}/solicitar-doc
	pathParts := strings.Split(strings.TrimSuffix(req.URL.Path, "/"), "/")
	// [ "", "api", "adv", "processes", "{id}", "solicitar-doc" ]
	if len(pathParts) < 6 || pathParts[4] == "" {
		http.Error(w, "process_id não fornecido na URL", http.StatusBadRequest)
		return
	}

	processID, err := uuid.Parse(pathParts[4])
	if err != nil {
		http.Error(w, "process_id inválido", http.StatusBadRequest)
		return
	}

	var body struct {
		Description string `json:"description"`
		ClientID    string `json:"client_id"`
	}
	if err := json.NewDecoder(req.Body).Decode(&body); err != nil {
		http.Error(w, "Body inválido", http.StatusBadRequest)
		return
	}

	if body.Description == "" {
		http.Error(w, "description é obrigatório", http.StatusBadRequest)
		return
	}
	if body.ClientID == "" {
		http.Error(w, "client_id é obrigatório", http.StatusBadRequest)
		return
	}

	clientUUID, err := uuid.Parse(body.ClientID)
	if err != nil {
		http.Error(w, "client_id inválido", http.StatusBadRequest)
		return
	}

	// Criar solicitação de documento
	docReq := &repository.DocReq{
		ProcessID:   processID,
		RequestedBy: userID,
		ClientID:    clientUUID,
		Description: body.Description,
	}

	if err := h.LGPDRepo.CreateDocumentRequest(req.Context(), docReq); err != nil {
		http.Error(w, "Erro ao solicitar documento: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Notificar o cliente
	notification := &repository.Notification{
		UserID:  clientUUID,
		Title:   "Documento Solicitado",
		Message: fmt.Sprintf("Seu advogado solicitou o seguinte documento: %s", body.Description),
	}
	_ = h.NotifRepo.Create(req.Context(), notification)

	w.WriteHeader(http.StatusCreated)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"request": docReq,
	})
}

// handleListDocumentRequestsByClient lista solicitações de documento do cliente autenticado.
// GET /api/cli/solicitacoes
func (h *LGPDHandler) handleListDocumentRequestsByClient(w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	userIDStr := req.Header.Get("X-Authenticated-User-ID")
	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		http.Error(w, "Usuário não autenticado", http.StatusUnauthorized)
		return
	}

	// Verificar se é cliente
	user, err := h.UserRepo.GetByID(req.Context(), userID)
	if err != nil || user == nil {
		http.Error(w, "Usuário não encontrado", http.StatusUnauthorized)
		return
	}
	if user.Role != "cliente" {
		http.Error(w, "Apenas clientes podem ver suas solicitações de documentos", http.StatusForbidden)
		return
	}

	reqs, err := h.LGPDRepo.ListDocumentRequestsByClient(req.Context(), userID, 50, 0)
	if err != nil {
		http.Error(w, "Erro ao listar solicitações: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"requests": reqs,
	})
}

// handleListDocumentRequestsByProcess lista solicitações de documento de um processo (advogado).
// GET /api/adv/processes/{id}/solicitacoes
func (h *LGPDHandler) handleListDocumentRequestsByProcess(w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	userIDStr := req.Header.Get("X-Authenticated-User-ID")
	_, err := uuid.Parse(userIDStr)
	if err != nil {
		http.Error(w, "Usuário não autenticado", http.StatusUnauthorized)
		return
	}

	// Extrair process_id do path: /api/adv/processes/{id}/solicitacoes
	pathParts := strings.Split(strings.TrimSuffix(req.URL.Path, "/"), "/")
	// [ "", "api", "adv", "processes", "{id}", "solicitacoes" ]
	if len(pathParts) < 6 || pathParts[4] == "" {
		http.Error(w, "process_id não fornecido na URL", http.StatusBadRequest)
		return
	}

	processID, err := uuid.Parse(pathParts[4])
	if err != nil {
		http.Error(w, "process_id inválido", http.StatusBadRequest)
		return
	}

	reqs, err := h.LGPDRepo.ListDocumentRequestsByProcess(req.Context(), processID)
	if err != nil {
		http.Error(w, "Erro ao listar solicitações: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"requests": reqs,
	})
}

// ---------------------------------------------------------------------------
// Registration
// ---------------------------------------------------------------------------

// RegisterLGPDRoutes registra todas as rotas LGPD no Router.
func (r *Router) RegisterLGPDRoutes(mux *http.ServeMux) {
	lgpdHandler := NewLGPDHandler(r.LGPDRepo, r.UserRepo, r.LinkRepo, r.NotificationRepo)

	// Consentimento LGPD (cliente)
	mux.HandleFunc("/api/cli/consent", r.AuthenticateMiddleware(lgpdHandler.handleClientConsent))
	mux.HandleFunc("/api/cli/consent/check/", r.AuthenticateMiddleware(lgpdHandler.handleCheckConsent))

	// Permissões de documento (advogado)
	mux.HandleFunc("/api/adv/documents/", r.AuthenticateMiddleware(func(w http.ResponseWriter, req *http.Request) {
		path := req.URL.Path
		// /api/adv/documents/{id}/permissions/{link_id}
		if strings.Contains(path, "/permissions/") {
			lgpdHandler.handleToggleDocPermission(w, req)
			return
		}
		// /api/adv/documents/{id}/permissoes
		if strings.HasSuffix(path, "/permissoes") || strings.HasSuffix(path, "/permissoes/") {
			lgpdHandler.handleListDocPermissionsByDoc(w, req)
			return
		}
		http.Error(w, "Rota não encontrada", http.StatusNotFound)
	}))

	// Listar permissões de vínculo (advogado)
	mux.HandleFunc("/api/adv/links/", r.AuthenticateMiddleware(func(w http.ResponseWriter, req *http.Request) {
		path := req.URL.Path
		// /api/adv/links/{id}/permissoes
		if strings.HasSuffix(path, "/permissoes") || strings.HasSuffix(path, "/permissoes/") {
			lgpdHandler.handleListDocPermissions(w, req)
			return
		}
		http.Error(w, "Rota não encontrada", http.StatusNotFound)
	}))

	// Solicitação de documento (advogado → cliente)
	mux.HandleFunc("/api/adv/processes/", r.AuthenticateMiddleware(func(w http.ResponseWriter, req *http.Request) {
		path := req.URL.Path
		// /api/adv/processes/{id}/solicitar-doc
		if strings.HasSuffix(path, "/solicitar-doc") || strings.HasSuffix(path, "/solicitar-doc/") {
			lgpdHandler.handleSolicitarDoc(w, req)
			return
		}
		// /api/adv/processes/{id}/solicitacoes
		if strings.HasSuffix(path, "/solicitacoes") || strings.HasSuffix(path, "/solicitacoes/") {
			lgpdHandler.handleListDocumentRequestsByProcess(w, req)
			return
		}
		http.Error(w, "Rota não encontrada", http.StatusNotFound)
	}))

	// Solicitações de documento (cliente)
	mux.HandleFunc("/api/cli/solicitacoes", r.AuthenticateMiddleware(lgpdHandler.handleListDocumentRequestsByClient))
}
