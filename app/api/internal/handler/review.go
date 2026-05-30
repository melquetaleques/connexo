package handler

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"app/api/internal/repository"

	"github.com/google/uuid"
)

// ReviewHandler lida com rotas de avaliações.
type ReviewHandler struct {
	ReviewRepo *repository.ReviewRepository
	LinkRepo   *repository.LinkRepository
	UserRepo   *repository.UserRepository
}

// NewReviewHandler cria uma nova instância de ReviewHandler.
func NewReviewHandler(reviewRepo *repository.ReviewRepository, linkRepo *repository.LinkRepository, userRepo *repository.UserRepository) *ReviewHandler {
	return &ReviewHandler{
		ReviewRepo: reviewRepo,
		LinkRepo:   linkRepo,
		UserRepo:   userRepo,
	}
}

// CreateReview lida com POST /api/cli/reviews
// Valida: role=cliente, link.status=concluido, sem review existente
func (h *ReviewHandler) CreateReview(w http.ResponseWriter, req *http.Request) {
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
		http.Error(w, "Apenas clientes podem criar avaliações", http.StatusForbidden)
		return
	}

	var body struct {
		LinkID  string `json:"link_id"`
		Rating  int    `json:"rating"`
		Comment string `json:"comment"`
	}

	if err := json.NewDecoder(req.Body).Decode(&body); err != nil {
		http.Error(w, "Body inválido", http.StatusBadRequest)
		return
	}

	linkUUID, err := uuid.Parse(body.LinkID)
	if err != nil {
		http.Error(w, "link_id inválido", http.StatusBadRequest)
		return
	}

	// Validar rating
	if body.Rating < 1 || body.Rating > 5 {
		http.Error(w, "rating deve estar entre 1 e 5", http.StatusBadRequest)
		return
	}

	// Buscar link e verificar se pertence ao cliente
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
	if link.Status != "concluido" {
		http.Error(w, "Apenas vínculos concluídos podem ser avaliados", http.StatusBadRequest)
		return
	}

	// Verificar se já existe review para este link
	existing, err := h.ReviewRepo.FindByLink(req.Context(), linkUUID)
	if err != nil {
		http.Error(w, "Erro ao verificar review existente: "+err.Error(), http.StatusInternalServerError)
		return
	}
	if existing != nil {
		http.Error(w, "Você já avaliou este vínculo", http.StatusConflict)
		return
	}

	review := &repository.Review{
		AccountantID: link.AccountantID,
		ClientID:     userID,
		LinkID:       linkUUID,
		Rating:       body.Rating,
		Comment:      body.Comment,
	}

	if err := h.ReviewRepo.Create(req.Context(), review); err != nil {
		http.Error(w, "Erro ao salvar avaliação: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"review":  review,
	})
}

// ReviewWithClientName estende Review com o nome do cliente.
type ReviewWithClientName struct {
	*repository.Review
	ClientName string `json:"client_name"`
}

// ListReviews lida com GET /api/public/accountants/{slug}/reviews
// Lista paginada de avaliações de um contador.
func (h *ReviewHandler) ListReviews(w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Extrair slug do path: /api/public/accountants/{slug}/reviews
	pathParts := strings.Split(strings.TrimSuffix(req.URL.Path, "/"), "/")
	// [ "", "api", "public", "accountants", "{slug}", "reviews" ]
	var slug string
	if len(pathParts) >= 5 {
		slug = pathParts[4]
	}
	// Também suporta /api/public/accountants/reviews/{slug}
	if slug == "" && len(pathParts) >= 6 {
		slug = pathParts[5]
	}
	if slug == "" {
		http.Error(w, "slug não fornecido", http.StatusBadRequest)
		return
	}

	// Buscar contador pelo slug
	profile, err := h.UserRepo.GetPublicProfileBySlug(req.Context(), slug)
	if err != nil || profile == nil {
		http.Error(w, "Contador não encontrado", http.StatusNotFound)
		return
	}

	// Paginação
	limitStr := req.URL.Query().Get("limit")
	offsetStr := req.URL.Query().Get("offset")
	limit := 10
	offset := 0
	if l, err := strconv.Atoi(limitStr); err == nil && l > 0 && l <= 50 {
		limit = l
	}
	if o, err := strconv.Atoi(offsetStr); err == nil && o >= 0 {
		offset = o
	}

	reviews, err := h.ReviewRepo.ListByAccountant(req.Context(), profile.ID, limit, offset)
	if err != nil {
		http.Error(w, "Erro ao buscar avaliações: "+err.Error(), http.StatusInternalServerError)
		return
	}

	total, err := h.ReviewRepo.CountByAccountant(req.Context(), profile.ID)
	if err != nil {
		total = len(reviews)
	}

	// Enriquecer com nome do cliente
	result := make([]ReviewWithClientName, 0, len(reviews))
	for _, r := range reviews {
		clientName := ""
		client, err := h.UserRepo.GetByID(req.Context(), r.ClientID)
		if err == nil && client != nil {
			clientName = client.Name
		}
		result = append(result, ReviewWithClientName{
			Review:     r,
			ClientName: clientName,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"reviews": result,
		"total":   total,
		"limit":   limit,
		"offset":  offset,
	})
}

// ReplyToReview lida com PUT /api/acc/reviews/{id}/reply
func (h *ReviewHandler) ReplyToReview(w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodPut && req.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	userIDStr := req.Header.Get("X-Authenticated-User-ID")
	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		http.Error(w, "Usuário não autenticado", http.StatusUnauthorized)
		return
	}

	// Verificar se é contador
	user, err := h.UserRepo.GetByID(req.Context(), userID)
	if err != nil || user == nil {
		http.Error(w, "Usuário não encontrado", http.StatusUnauthorized)
		return
	}
	if user.Role != "contador" {
		http.Error(w, "Apenas contadores podem responder avaliações", http.StatusForbidden)
		return
	}

	// Extrair ID do review do path: /api/acc/reviews/{id}/reply
	pathParts := strings.Split(strings.TrimSuffix(req.URL.Path, "/"), "/")
	// [ "", "api", "acc", "reviews", "{id}", "reply" ]
	if len(pathParts) < 6 || pathParts[5] != "reply" {
		http.Error(w, "URL inválida", http.StatusBadRequest)
		return
	}

	reviewID, err := uuid.Parse(pathParts[4])
	if err != nil {
		http.Error(w, "ID da avaliação inválido", http.StatusBadRequest)
		return
	}

	var body struct {
		ReplyText string `json:"reply_text"`
	}
	if err := json.NewDecoder(req.Body).Decode(&body); err != nil {
		http.Error(w, "Body inválido", http.StatusBadRequest)
		return
	}

	if body.ReplyText == "" {
		http.Error(w, "reply_text é obrigatório", http.StatusBadRequest)
		return
	}

	// Buscar review e verificar se pertence a este contador
	review, err := h.ReviewRepo.FindByID(req.Context(), reviewID)
	if err != nil {
		http.Error(w, "Erro ao buscar avaliação: "+err.Error(), http.StatusInternalServerError)
		return
	}
	if review == nil {
		http.Error(w, "Avaliação não encontrada", http.StatusNotFound)
		return
	}
	if review.AccountantID != userID {
		http.Error(w, "Esta avaliação não pertence a você", http.StatusForbidden)
		return
	}

	if err := h.ReviewRepo.UpdateReply(req.Context(), reviewID, body.ReplyText); err != nil {
		http.Error(w, "Erro ao salvar resposta: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Recarregar para retornar dados atualizados
	updated, _ := h.ReviewRepo.FindByID(req.Context(), reviewID)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"review":  updated,
	})
}

// GetClientReviewStatus lida com GET /api/cli/reviews/check/{link_id}
// Retorna se o cliente já avaliou o link e quais links concluídos estão sem review.
func (h *ReviewHandler) GetClientReviewStatus(w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Extrair link_id do path: /api/cli/reviews/check/{link_id}
	pathParts := strings.Split(strings.TrimSuffix(req.URL.Path, "/"), "/")
	if len(pathParts) < 6 {
		http.Error(w, "URL inválida", http.StatusBadRequest)
		return
	}

	linkID, err := uuid.Parse(pathParts[5])
	if err != nil {
		http.Error(w, "link_id inválido", http.StatusBadRequest)
		return
	}

	review, err := h.ReviewRepo.FindByLink(req.Context(), linkID)
	if err != nil {
		http.Error(w, "Erro ao verificar avaliação: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if review != nil {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"has_review": true,
			"review":     review,
		})
	} else {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"has_review": false,
			"review":     nil,
		})
	}
}

// RegisterReviewRoutes registra todas as rotas de avaliação no Router.
func (r *Router) RegisterReviewRoutes(mux *http.ServeMux) {
	reviewHandler := NewReviewHandler(r.ReviewRepo, r.LinkRepo, r.UserRepo)

	// Cliente cria avaliação (autenticado)
	mux.HandleFunc("/api/cli/reviews", r.AuthenticateMiddleware(reviewHandler.CreateReview))

	// Cliente verifica status de avaliação de um link
	mux.HandleFunc("/api/cli/reviews/check/", r.AuthenticateMiddleware(reviewHandler.GetClientReviewStatus))

	// Lista pública de avaliações de um contador
	// NOTA: /api/public/accountants/{slug}/reviews é roteado dentro de handlePublicAccountantProfile
	mux.HandleFunc("/api/public/reviews/", reviewHandler.ListReviews)

	// Contador responde avaliação
	mux.HandleFunc("/api/acc/reviews/", r.AuthenticateMiddleware(func(w http.ResponseWriter, req *http.Request) {
		path := req.URL.Path
		// /api/acc/reviews/{id}/reply
		if strings.HasSuffix(path, "/reply") || strings.HasSuffix(path, "/reply/") {
			reviewHandler.ReplyToReview(w, req)
			return
		}
		http.Error(w, "Rota não encontrada", http.StatusNotFound)
	}))
}
