package handler

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"strings"
	"unicode"

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
	user := userFromContext(r.Context())
	if user == nil {
		respondErr(w, http.StatusUnauthorized, "não autenticado")
		return
	}

	acc, err := h.accountants.FindByUserID(r.Context(), user.ID)
	if err != nil || acc == nil {
		respondErr(w, http.StatusNotFound, "perfil de contador não encontrado")
		return
	}

	pendingLinks, err := h.links.ListPendingByAccountant(r.Context(), user.ID)
	if err != nil {
		respondErr(w, http.StatusInternalServerError, "erro ao buscar solicitações pendentes")
		return
	}

	allLinks, err := h.links.ListByAccountant(r.Context(), user.ID)
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
				CreatedAt:     l.CreatedAt.Format("2006-01-02T15:04:05Z"),
			})
		}
	}

	respond(w, http.StatusOK, resp)
}

// GetProfile godoc
// GET /api/acc/profile
func (h *AccountantHandler) GetProfile(w http.ResponseWriter, r *http.Request) {
	user := userFromContext(r.Context())
	if user == nil {
		respondErr(w, http.StatusUnauthorized, "não autenticado")
		return
	}

	acc, err := h.accountants.FindByUserID(r.Context(), user.ID)
	if err != nil || acc == nil {
		log.Printf("GetProfile: user.ID=%s user.Role=%s err=%v acc=%v", user.ID, user.Role, err, acc)
		respondErr(w, http.StatusNotFound, "perfil de contador nao encontrado")
		return
	}

	// domain.Accountant não guarda nome/e-mail (vivem em users); o formulário
	// de edição de perfil precisa dos dois, então a resposta os embute aqui.
	respond(w, http.StatusOK, map[string]any{
		"id":              acc.ID,
		"user_id":         acc.UserID,
		"name":            user.Name,
		"email":           user.Email,
		"crc_number":      acc.CRCNumber,
		"crc_state":       acc.CRCState,
		"bio":             acc.Bio,
		"specialties":     acc.Specialties,
		"city":            acc.City,
		"cities":          acc.Cities,
		"state":           acc.State,
		"slug":            acc.Slug,
		"is_public":       acc.IsPublic,
		"rating":          acc.Rating,
		"completed_cases": acc.CompletedCases,
		"created_at":      acc.CreatedAt,
		"updated_at":      acc.UpdatedAt,
	})
}

// UpdateProfile godoc
// PUT /api/acc/profile
func (h *AccountantHandler) UpdateProfile(w http.ResponseWriter, r *http.Request) {
	user := userFromContext(r.Context())
	if user == nil {
		respondErr(w, http.StatusUnauthorized, "não autenticado")
		return
	}

	acc, err := h.accountants.FindByUserID(r.Context(), user.ID)
	if err != nil || acc == nil {
		respondErr(w, http.StatusNotFound, "perfil de contador não encontrado")
		return
	}

	var input struct {
		Bio         string   `json:"bio"`
		City        string   `json:"city"`
		Cities      []string `json:"cities"`
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
	if input.Cities != nil {
		normalized := normalizeCities(input.Cities)
		acc.Cities = normalized
		if len(normalized) > 0 {
			acc.City = normalized[0]
		}
	} else if input.City != "" {
		acc.City = normalizeCity(input.City)
	}
	if input.State != "" {
		acc.State = normalizeUF(input.State)
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
		acc.CRCState = normalizeUF(input.CRCState)
	}

	if err := h.accountants.Update(r.Context(), acc); err != nil {
		respondErr(w, http.StatusInternalServerError, "erro ao atualizar perfil")
		return
	}

	respond(w, http.StatusOK, acc)
}

// validUFs são as siglas de estado reconhecidas no Brasil (26 estados + DF).
var validUFs = map[string]bool{
	"AC": true, "AL": true, "AP": true, "AM": true, "BA": true, "CE": true,
	"DF": true, "ES": true, "GO": true, "MA": true, "MT": true, "MS": true,
	"MG": true, "PA": true, "PB": true, "PR": true, "PE": true, "PI": true,
	"RJ": true, "RN": true, "RS": true, "RO": true, "RR": true, "SC": true,
	"SP": true, "SE": true, "TO": true,
}

// normalizeUF garante a sigla em maiúsculas; entradas inválidas (não uma UF
// brasileira reconhecida) são descartadas em vez de salvas quebradas.
func normalizeUF(uf string) string {
	uf = strings.ToUpper(strings.TrimSpace(uf))
	if !validUFs[uf] {
		return ""
	}
	return uf
}

// normalizeCity capitaliza cada palavra do nome do município
// ("são paulo" -> "São Paulo"), preservando preposições curtas em minúsculo.
func normalizeCity(city string) string {
	city = strings.TrimSpace(city)
	if city == "" {
		return ""
	}
	lowerWords := map[string]bool{"de": true, "da": true, "do": true, "das": true, "dos": true, "e": true}
	words := strings.Fields(strings.ToLower(city))
	for i, w := range words {
		if i > 0 && lowerWords[w] {
			continue
		}
		r := []rune(w)
		r[0] = unicode.ToUpper(r[0])
		words[i] = string(r)
	}
	return strings.Join(words, " ")
}

// normalizeCities normaliza e deduplica a lista de cidades de atuação,
// descartando entradas vazias.
func normalizeCities(cities []string) []string {
	seen := map[string]bool{}
	out := make([]string, 0, len(cities))
	for _, c := range cities {
		nc := normalizeCity(c)
		if nc == "" || seen[nc] {
			continue
		}
		seen[nc] = true
		out = append(out, nc)
	}
	return out
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
	user := userFromContext(r.Context())
	if user == nil {
		respondErr(w, http.StatusUnauthorized, "não autenticado")
		return
	}

	acc, err := h.accountants.FindByUserID(r.Context(), user.ID)
	if err != nil || acc == nil {
		respondErr(w, http.StatusNotFound, "perfil de contador não encontrado")
		return
	}

	links, err := h.links.ListByAccountant(r.Context(), user.ID)
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
	user := userFromContext(r.Context())
	if user == nil {
		respondErr(w, http.StatusUnauthorized, "não autenticado")
		return
	}

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
		// Aceita tanto o id do vínculo quanto o id do processo.
		link, err = h.links.FindActiveByProcess(r.Context(), id)
		if err != nil || link == nil {
			respondErr(w, http.StatusNotFound, "vinculo nao encontrado")
			return
		}
	}

	if link.AccountantID != user.ID {
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
