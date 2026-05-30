package handler

import (
	"encoding/json"
	"net/http"

	"app/api/internal/repository"
)

// CatalogHandler lida com listagens e buscas no catálogo público de contadores.
type CatalogHandler struct {
	UserRepo *repository.UserRepository
}

// NewCatalogHandler cria uma nova instância de CatalogHandler.
func NewCatalogHandler(userRepo *repository.UserRepository) *CatalogHandler {
	return &CatalogHandler{UserRepo: userRepo}
}

// ListPublicAccountants lida com a rota GET /api/public/accountants
func (h *CatalogHandler) ListPublicAccountants(w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	q := req.URL.Query().Get("q")
	specialty := req.URL.Query().Get("specialty")
	city := req.URL.Query().Get("city")
	state := req.URL.Query().Get("state")
	availability := req.URL.Query().Get("availability")

	accountants, err := h.UserRepo.ListPublicAccountants(req.Context(), specialty, city, state, q)
	if err != nil {
		http.Error(w, "Erro ao buscar catálogo: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Filtrar por availability no Go level (já que o SQL pode ficar complexo com param opcionais)
	if availability != "" {
		filtered := make([]*repository.Accountant, 0)
		for _, acc := range accountants {
			if acc.Availability == availability {
				filtered = append(filtered, acc)
			}
		}
		accountants = filtered
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(accountants)
}
