package handler

import (
	"context"
	"encoding/json"
	"net/http"

	"app/api/internal/domain"
	"github.com/google/uuid"
)

// AccountantHandler gerencia as operações do portal do contador.
type AccountantHandler struct {
	accountants domain.AccountantRepository
	clients     domain.ClientRepository
	links       domain.LinkRepository
	processes   domain.ProcessRepository
}

// NewAccountantHandler constrói um AccountantHandler.
func NewAccountantHandler(
	accRepo domain.AccountantRepository,
	clientRepo domain.ClientRepository,
	linkRepo domain.LinkRepository,
	procRepo domain.ProcessRepository,
) *AccountantHandler {
	return &AccountantHandler{
		accountants: accRepo,
		clients:     clientRepo,
		links:       linkRepo,
		processes:   procRepo,
	}
}

type dashboardResponse struct {
	Stats struct {
		PendingLinks    int     `json:"pending_links"`
		ActiveProcesses int     `json:"active_processes"`
		CompletedCases  int     `json:"completed_cases"`
		Rating          float64 `json:"rating"`
	} `json:"stats"`
	PendingRequests []pendingRequest `json:"pending_requests"`
}

type pendingRequest struct {
	ID            uuid.UUID `json:"id"`
	ProcessNumber string    `json:"process_number"`
	ProcessType   string    `json:"process_type"`
	ClientName    string    `json:"client_name"`
	CreatedAt     string    `json:"created_at"`
}

// Dashboard godoc
// GET /api/acc/dashboard
func (h *AccountantHandler) Dashboard(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value(userContextKey).(*domain.User)

	acc, err := h.accountants.FindByUserID(r.Context(), user.ID)
	if err != nil || acc == nil {
		respondErr(w, http.StatusNotFound, "perfil de contador não encontrado")
		return
	}

	pendingLinks, err := h.links.ListPendingByAccountant(r.Context(), acc.ID)
	if err != nil {
		respondErr(w, http.StatusInternalServerError, "erro ao buscar solicitações pendentes")
		return
	}

	allLinks, err := h.links.ListByAccountant(r.Context(), acc.ID)
	if err != nil {
		respondErr(w, http.StatusInternalServerError, "erro ao buscar vínculos")
		return
	}

	activeCount := 0
	for _, l := range allLinks {
		if l.Status == "ativo" {
			activeCount++
		}
	}

	resp := dashboardResponse{}
	resp.Stats.PendingLinks = len(pendingLinks)
	resp.Stats.ActiveProcesses = activeCount
	resp.Stats.CompletedCases = acc.CompletedCases
	resp.Stats.Rating = acc.Rating

	resp.PendingRequests = []pendingRequest{}
	for _, l := range pendingLinks {
		p, _ := h.processes.FindByID(r.Context(), l.ProcessID)
		if p != nil {
			resp.PendingRequests = append(resp.PendingRequests, pendingRequest{
				ID:            l.ID,
				ProcessNumber: p.Number,
				ProcessType:   p.Type,
				ClientName:    h.clientName(r.Context(), p.ClientID),
				CreatedAt:     l.ChosenAt.Format("2006-01-02T15:04:05Z"),
			})
		}
	}

	respond(w, http.StatusOK, resp)
}

// AcceptLink godoc
// POST /api/acc/links/{id}/accept
func (h *AccountantHandler) AcceptLink(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value(userContextKey).(*domain.User)

	idStr := r.PathValue("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		respondErr(w, http.StatusBadRequest, "id inválido")
		return
	}

	link, err := h.links.FindByID(r.Context(), id)
	if err != nil || link == nil {
		respondErr(w, http.StatusNotFound, "vínculo não encontrado")
		return
	}

	acc, err := h.accountants.FindByUserID(r.Context(), user.ID)
	if err != nil || acc == nil {
		respondErr(w, http.StatusNotFound, "perfil de contador não encontrado")
		return
	}

	if link.AccountantID != acc.ID {
		respondErr(w, http.StatusForbidden, "este vínculo não pertence a você")
		return
	}

	link.Status = "ativo"
	if err := h.links.Update(r.Context(), link); err != nil {
		respondErr(w, http.StatusInternalServerError, "erro ao aceitar vínculo")
		return
	}

	respond(w, http.StatusOK, map[string]string{"message": "vínculo aceito"})
}

// RejectLink godoc
// POST /api/acc/links/{id}/reject
func (h *AccountantHandler) RejectLink(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value(userContextKey).(*domain.User)

	idStr := r.PathValue("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		respondErr(w, http.StatusBadRequest, "id inválido")
		return
	}

	link, err := h.links.FindByID(r.Context(), id)
	if err != nil || link == nil {
		respondErr(w, http.StatusNotFound, "vínculo não encontrado")
		return
	}

	acc, err := h.accountants.FindByUserID(r.Context(), user.ID)
	if err != nil || acc == nil {
		respondErr(w, http.StatusNotFound, "perfil de contador não encontrado")
		return
	}

	if link.AccountantID != acc.ID {
		respondErr(w, http.StatusForbidden, "este vínculo não pertence a você")
		return
	}

	link.Status = "recusado"
	if err := h.links.Update(r.Context(), link); err != nil {
		respondErr(w, http.StatusInternalServerError, "erro ao recusar vínculo")
		return
	}

	respond(w, http.StatusOK, map[string]string{"message": "vínculo recusado"})
}

// GetProfile godoc
// GET /api/acc/profile
func (h *AccountantHandler) GetProfile(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value(userContextKey).(*domain.User)

	acc, err := h.accountants.FindByUserID(r.Context(), user.ID)
	if err != nil || acc == nil {
		respondErr(w, http.StatusNotFound, "perfil de contador nao encontrado")
		return
	}

	respond(w, http.StatusOK, acc)
}

// UpdateProfile godoc
// PUT /api/acc/profile
func (h *AccountantHandler) UpdateProfile(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value(userContextKey).(*domain.User)

	acc, err := h.accountants.FindByUserID(r.Context(), user.ID)
	if err != nil || acc == nil {
		respondErr(w, http.StatusNotFound, "perfil de contador não encontrado")
		return
	}

	var input struct {
		Bio         string   `json:"bio"`
		City        string   `json:"city"`
		State       string   `json:"state"`
		Slug        string   `json:"slug"`
		IsPublic    *bool    `json:"is_public"`
		Specialties []string `json:"specialties"`
		CRCNumber   string   `json:"crc_number"`
		CRCState    string   `json:"crc_state"`
	}
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		respondErr(w, http.StatusBadRequest, "body inválido")
		return
	}

	if input.Bio != "" {
		acc.Bio = input.Bio
	}
	if input.City != "" {
		acc.City = input.City
	}
	if input.State != "" {
		acc.State = input.State
	}
	if input.Slug != "" {
		acc.Slug = input.Slug
	}
	if input.IsPublic != nil {
		acc.IsPublic = *input.IsPublic
	}
	if input.Specialties != nil {
		acc.Specialties = input.Specialties
	}
	if input.CRCNumber != "" {
		acc.CRCNumber = input.CRCNumber
	}
	if input.CRCState != "" {
		acc.CRCState = input.CRCState
	}

	if err := h.accountants.Update(r.Context(), acc); err != nil {
		respondErr(w, http.StatusInternalServerError, "erro ao atualizar perfil")
		return
	}

	respond(w, http.StatusOK, acc)
}

type processItem struct {
	ID             uuid.UUID `json:"id"`
	ProcessID      uuid.UUID `json:"process_id"`
	ProcessNumber  string    `json:"process_number"`
	ProcessType    string    `json:"process_type"`
	Court          string    `json:"court"`
	Status         string    `json:"status"`
	ClientName     string    `json:"client_name"`
}

// ListProcesses godoc
// GET /api/acc/processes
func (h *AccountantHandler) ListProcesses(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value(userContextKey).(*domain.User)

	acc, err := h.accountants.FindByUserID(r.Context(), user.ID)
	if err != nil || acc == nil {
		respondErr(w, http.StatusNotFound, "perfil de contador não encontrado")
		return
	}

	links, err := h.links.ListByAccountant(r.Context(), acc.ID)
	if err != nil {
		respondErr(w, http.StatusInternalServerError, "erro ao buscar processos")
		return
	}

	items := make([]processItem, 0, len(links))
	for _, l := range links {
		p, _ := h.processes.FindByID(r.Context(), l.ProcessID)
		if p != nil {
			items = append(items, processItem{
				ID:            l.ID,
				ProcessID:     p.ID,
				ProcessNumber: p.Number,
				ProcessType:   p.Type,
				Court:         p.Court,
				Status:        string(l.Status),
				ClientName:    h.clientName(r.Context(), p.ClientID),
			})
		}
	}

	respond(w, http.StatusOK, items)
}

type processDetailResponse struct {
	ID            uuid.UUID `json:"id"`
	ProcessID     uuid.UUID `json:"process_id"`
	ProcessNumber string    `json:"process_number"`
	ProcessType   string    `json:"process_type"`
	Court         string    `json:"court"`
	Stage         string    `json:"stage"`
	Status        string    `json:"status"`
	ClientName    string    `json:"client_name"`
	LawyerName    string    `json:"lawyer_name"`
	CreatedAt     string    `json:"created_at"`
}

// GetProcess godoc
// GET /api/acc/processes/{id}
func (h *AccountantHandler) GetProcess(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value(userContextKey).(*domain.User)

	acc, err := h.accountants.FindByUserID(r.Context(), user.ID)
	if err != nil || acc == nil {
		respondErr(w, http.StatusNotFound, "perfil de contador nao encontrado")
		return
	}

	idStr := r.PathValue("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		respondErr(w, http.StatusBadRequest, "id invalido")
		return
	}

	link, err := h.links.FindByID(r.Context(), id)
	if err != nil || link == nil {
		respondErr(w, http.StatusNotFound, "vinculo nao encontrado")
		return
	}

	if link.AccountantID != acc.ID {
		respondErr(w, http.StatusForbidden, "este processo nao pertence a voce")
		return
	}

	p, err := h.processes.FindByID(r.Context(), link.ProcessID)
	if err != nil || p == nil {
		respondErr(w, http.StatusNotFound, "processo nao encontrado")
		return
	}

	resp := processDetailResponse{
		ID:            link.ID,
		ProcessID:     p.ID,
		ProcessNumber: p.Number,
		ProcessType:   p.Type,
		Court:         p.Court,
		Stage:         p.Stage,
		Status:        string(link.Status),
		ClientName:    h.clientName(r.Context(), p.ClientID),
		LawyerName:    p.LawyerID.String(),
		CreatedAt:     p.CreatedAt.Format("2006-01-02T15:04:05Z"),
	}

	respond(w, http.StatusOK, resp)
}

func (h *AccountantHandler) clientName(ctx context.Context, clientID uuid.UUID) string {
	c, err := h.clients.FindByID(ctx, clientID)
	if err != nil || c == nil {
		return "Cliente"
	}
	return c.Name
}
