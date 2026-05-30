package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"app/api/internal/repository"
	"app/api/internal/service"
	"github.com/google/uuid"
)

// DeliverableHandler lida com as rotas de entregáveis.
type DeliverableHandler struct {
	DeliverableRepo *repository.DeliverableRepository
	LinkService     *service.LinkService
}

// NewDeliverableHandler cria uma nova instância de DeliverableHandler.
func NewDeliverableHandler(deliverableRepo *repository.DeliverableRepository, linkService *service.LinkService) *DeliverableHandler {
	return &DeliverableHandler{
		DeliverableRepo: deliverableRepo,
		LinkService:     linkService,
	}
}

// handleDeliverableCreate lida com POST /api/acc/links/{id}/entregas
func (r *Router) handleDeliverableCreate(w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Extrair ID do vínculo da URL
	pathParts := strings.Split(req.URL.Path, "/")
	// /api/acc/links/{id}/entregas -> parts: ["", "api", "acc", "links", "{id}", "entregas"]
	if len(pathParts) < 6 || pathParts[4] == "" {
		http.Error(w, "link_id não fornecido na URL", http.StatusBadRequest)
		return
	}
	linkID, err := uuid.Parse(pathParts[4])
	if err != nil {
		http.Error(w, "link_id inválido", http.StatusBadRequest)
		return
	}

	userIDStr := req.Header.Get("X-Authenticated-User-ID")
	userID, _ := uuid.Parse(userIDStr)

	// Parse multipart form (max 32MB)
	err = req.ParseMultipartForm(32 << 20)
	if err != nil {
		http.Error(w, "Erro ao processar formulário: "+err.Error(), http.StatusBadRequest)
		return
	}

	contentText := req.FormValue("content_text")

	// Criar entregável
	deliverable := &repository.Deliverable{
		LinkID:      linkID,
		SubmittedBy: userID,
		ContentText: contentText,
		Status:      "entregue",
	}

	// Upload de arquivo opcional
	file, header, err := req.FormFile("file")
	if err == nil {
		defer file.Close()

		// Detectar content type
		contentType := header.Header.Get("Content-Type")
		if contentType == "" {
			contentType = "application/octet-stream"
		}

		// Upload para MinIO
		key, err := r.DeliverableRepo.Upload(req.Context(), file, header.Size, header.Filename, contentType)
		if err != nil {
			http.Error(w, "Erro ao fazer upload do arquivo: "+err.Error(), http.StatusInternalServerError)
			return
		}

		deliverable.FileName = key
		deliverable.FileSize = header.Size
	} else {
		// Sem arquivo, tudo bem - apenas conteúdo textual
		if contentText == "" {
			http.Error(w, "É necessário fornecer um texto ou um arquivo", http.StatusBadRequest)
			return
		}
	}

	// Salvar no banco
	err = r.DeliverableRepo.Create(req.Context(), deliverable)
	if err != nil {
		http.Error(w, "Erro ao salvar entregável: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Transicionar status do vínculo para 'entregue'
	err = r.LinkService.TransitionStatus(req.Context(), linkID, "entregue", userID, "contador")
	if err != nil {
		// Loga o erro mas não falha a resposta - o entregável foi criado
		fmt.Printf("Erro ao transicionar status para entregue: %v\n", err)
	}

	w.WriteHeader(http.StatusCreated)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(deliverable)
}

// handleDeliverableApprove lida com PUT /api/adv/links/{id}/entregas/{eid}/aprovar
func (r *Router) handleDeliverableApprove(w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodPut {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	pathParts := strings.Split(req.URL.Path, "/")
	// /api/adv/links/{id}/entregas/{eid}/aprovar -> parts: ["", "api", "adv", "links", "{id}", "entregas", "{eid}", "aprovar"]
	if len(pathParts) < 8 || pathParts[4] == "" || pathParts[6] == "" {
		http.Error(w, "link_id ou entrega_id não fornecido na URL", http.StatusBadRequest)
		return
	}

	linkID, err := uuid.Parse(pathParts[4])
	if err != nil {
		http.Error(w, "link_id inválido", http.StatusBadRequest)
		return
	}

	deliverableID, err := uuid.Parse(pathParts[6])
	if err != nil {
		http.Error(w, "entrega_id inválido", http.StatusBadRequest)
		return
	}

	userIDStr := req.Header.Get("X-Authenticated-User-ID")
	userID, _ := uuid.Parse(userIDStr)

	// Atualizar deliverable.status = 'aprovado'
	err = r.DeliverableRepo.UpdateReview(req.Context(), deliverableID, "aprovado", "")
	if err != nil {
		http.Error(w, "Erro ao aprovar entregável: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Transicionar status do vínculo para 'concluido'
	err = r.LinkService.TransitionStatus(req.Context(), linkID, "concluido", userID, "advogado")
	if err != nil {
		http.Error(w, "Erro ao concluir vínculo: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"message": "Entregável aprovado e vínculo concluído",
	})
}

// handleDeliverableRequestReview lida com PUT /api/adv/links/{id}/entregas/{eid}/revisar
func (r *Router) handleDeliverableRequestReview(w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodPut {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	pathParts := strings.Split(req.URL.Path, "/")
	// /api/adv/links/{id}/entregas/{eid}/revisar
	if len(pathParts) < 8 || pathParts[4] == "" || pathParts[6] == "" {
		http.Error(w, "link_id ou entrega_id não fornecido na URL", http.StatusBadRequest)
		return
	}

	linkID, err := uuid.Parse(pathParts[4])
	if err != nil {
		http.Error(w, "link_id inválido", http.StatusBadRequest)
		return
	}

	deliverableID, err := uuid.Parse(pathParts[6])
	if err != nil {
		http.Error(w, "entrega_id inválido", http.StatusBadRequest)
		return
	}

	userIDStr := req.Header.Get("X-Authenticated-User-ID")
	userID, _ := uuid.Parse(userIDStr)

	// Ler body para comentário
	var body struct {
		ReviewComment string `json:"review_comment"`
	}
	if err := json.NewDecoder(req.Body).Decode(&body); err != nil {
		http.Error(w, "Body inválido: esperado review_comment", http.StatusBadRequest)
		return
	}

	if body.ReviewComment == "" {
		http.Error(w, "review_comment é obrigatório para solicitar revisão", http.StatusBadRequest)
		return
	}

	// Atualizar deliverable.status = 'revisao_solicitada' com o comentário
	err = r.DeliverableRepo.UpdateReview(req.Context(), deliverableID, "revisao_solicitada", body.ReviewComment)
	if err != nil {
		http.Error(w, "Erro ao solicitar revisão do entregável: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Transicionar status do vínculo para 'revisao_solicitada'
	err = r.LinkService.TransitionStatus(req.Context(), linkID, "revisao_solicitada", userID, "advogado")
	if err != nil {
		http.Error(w, "Erro ao transicionar status: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"message": "Revisão solicitada com sucesso",
	})
}

// handleDeliverableCancelRequest lida com POST /api/adv/links/{id}/cancelar
func (r *Router) handleDeliverableCancelRequest(w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	pathParts := strings.Split(req.URL.Path, "/")
	// /api/adv/links/{id}/cancelar
	if len(pathParts) < 6 || pathParts[4] == "" {
		http.Error(w, "link_id não fornecido na URL", http.StatusBadRequest)
		return
	}

	linkID, err := uuid.Parse(pathParts[4])
	if err != nil {
		http.Error(w, "link_id inválido", http.StatusBadRequest)
		return
	}

	userIDStr := req.Header.Get("X-Authenticated-User-ID")
	userID, _ := uuid.Parse(userIDStr)

	err = r.LinkService.TransitionStatus(req.Context(), linkID, "cancelamento_solicitado", userID, "advogado")
	if err != nil {
		http.Error(w, "Erro ao solicitar cancelamento: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"message": "Cancelamento solicitado com sucesso",
	})
}

// handleLinkTransitions lida com transições de estado genéricas (para contador)
// POST /api/acc/links/{id}/status
func (r *Router) handleLinkTransitions(w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	pathParts := strings.Split(req.URL.Path, "/")
	// /api/acc/links/{id}/status
	if len(pathParts) < 6 || pathParts[4] == "" {
		http.Error(w, "link_id não fornecido na URL", http.StatusBadRequest)
		return
	}

	linkID, err := uuid.Parse(pathParts[4])
	if err != nil {
		http.Error(w, "link_id inválido", http.StatusBadRequest)
		return
	}

	var body struct {
		Status string `json:"status"`
	}
	if err := json.NewDecoder(req.Body).Decode(&body); err != nil {
		http.Error(w, "Body inválido: esperado status", http.StatusBadRequest)
		return
	}

	if body.Status == "" {
		http.Error(w, "status é obrigatório", http.StatusBadRequest)
		return
	}

	userIDStr := req.Header.Get("X-Authenticated-User-ID")
	userID, _ := uuid.Parse(userIDStr)

	err = r.LinkService.TransitionStatus(req.Context(), linkID, body.Status, userID, "contador")
	if err != nil {
		http.Error(w, "Erro ao transicionar status: "+err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"message": "Status atualizado para " + body.Status,
	})
}

// handleLinkDetails busca detalhes do vínculo + deliverables + process_events
// GET /api/adv/links/{id} e GET /api/acc/links/{id} e GET /api/cli/links/{id}
func (r *Router) handleLinkDetails(w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	pathParts := strings.Split(req.URL.Path, "/")
	// /api/{role}/links/{id} -> parts: ["", "api", "{role}", "links", "{id}"]
	if len(pathParts) < 5 || pathParts[4] == "" {
		http.Error(w, "link_id não fornecido na URL", http.StatusBadRequest)
		return
	}

	linkID, err := uuid.Parse(pathParts[4])
	if err != nil {
		http.Error(w, "link_id inválido", http.StatusBadRequest)
		return
	}

	// Buscar vínculo
	link, err := r.LinkRepo.FindByID(req.Context(), linkID)
	if err != nil {
		http.Error(w, "Erro ao buscar vínculo: "+err.Error(), http.StatusInternalServerError)
		return
	}
	if link == nil {
		http.Error(w, "Vínculo não encontrado", http.StatusNotFound)
		return
	}

	// Buscar entregáveis
	deliverables, err := r.DeliverableRepo.ListByLink(req.Context(), linkID)
	if err != nil {
		deliverables = []repository.Deliverable{}
	}

	// Buscar process_events via LinkService (precisamos do processID)
	processID, err := r.LinkRepo.GetProcessIDByClientID(req.Context(), link.ClientID)
	var processEvents []*repository.ProcessEvent
	if err == nil && processID != uuid.Nil {
		// Usar o ProcessEventsRepo se disponível no Router
		if r.ProcessEventsRepo != nil {
			events, err := r.ProcessEventsRepo.ListByProcess(req.Context(), processID)
			if err == nil {
				processEvents = events
			}
		}
	}
	if processEvents == nil {
		processEvents = []*repository.ProcessEvent{}
	}

	// Buscar cliente e contador
	client, _ := r.UserRepo.GetByID(req.Context(), link.ClientID)
	accountant, _ := r.UserRepo.GetByID(req.Context(), link.AccountantID)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"link":           link,
		"deliverables":   deliverables,
		"process_events": processEvents,
		"client":         client,
		"accountant":     accountant,
	})
}
