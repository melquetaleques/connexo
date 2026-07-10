package handler

import (
	"encoding/json"
	"net/http"
	"time"

	"app/api/internal/domain"
	"github.com/google/uuid"
)

// ServiceHandler gerencia os servicos do contador.
type ServiceHandler struct {
	services     domain.AccountantServiceRepository
	accountants  domain.AccountantRepository
}

// NewServiceHandler constroi um ServiceHandler.
func NewServiceHandler(
	svcRepo domain.AccountantServiceRepository,
	accRepo domain.AccountantRepository,
) *ServiceHandler {
	return &ServiceHandler{
		services:    svcRepo,
		accountants: accRepo,
	}
}

// ListMyServices godoc
// GET /api/acc/servicos
func (h *ServiceHandler) ListMyServices(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value(userContextKey).(*domain.User)

	acc, err := h.accountants.FindByUserID(r.Context(), user.ID)
	if err != nil || acc == nil {
		respondErr(w, http.StatusNotFound, "perfil de contador nao encontrado")
		return
	}

	list, err := h.services.ListByAccountant(r.Context(), acc.ID)
	if err != nil {
		respondErr(w, http.StatusInternalServerError, "erro ao listar servicos")
		return
	}

	respond(w, http.StatusOK, list)
}

// CreateService godoc
// POST /api/acc/servicos
func (h *ServiceHandler) CreateService(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value(userContextKey).(*domain.User)

	acc, err := h.accountants.FindByUserID(r.Context(), user.ID)
	if err != nil || acc == nil {
		respondErr(w, http.StatusNotFound, "perfil de contador nao encontrado")
		return
	}

	var input struct {
		Title       string   `json:"title"`
		Description string   `json:"description"`
		Icon        string   `json:"icon"`
		Areas       []string `json:"areas"`
		PriceFrom   float64  `json:"price_from"`
		AvgDays     int      `json:"avg_days"`
		IsVisible   bool     `json:"is_visible"`
	}
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		respondErr(w, http.StatusBadRequest, "body invalido")
		return
	}

	svc := &domain.AccountantService{
		ID:           uuid.New(),
		AccountantID: acc.ID,
		Title:        input.Title,
		Description:  input.Description,
		Icon:         input.Icon,
		Areas:        input.Areas,
		PriceFrom:    input.PriceFrom,
		AvgDays:      input.AvgDays,
		IsVisible:    input.IsVisible,
		CreatedAt:    time.Now(),
	}

	if err := h.services.Create(r.Context(), svc); err != nil {
		respondErr(w, http.StatusInternalServerError, "erro ao criar servico")
		return
	}

	respond(w, http.StatusCreated, svc)
}
