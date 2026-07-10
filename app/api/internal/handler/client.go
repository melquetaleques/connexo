package handler

import (
	"encoding/json"
	"net/http"

	"app/api/internal/domain"
	"github.com/google/uuid"
)

// ClientHandler gerencia as operações do painel do cliente.
type ClientHandler struct {
	processes   domain.ProcessRepository
	links       domain.LinkRepository
	accountants domain.AccountantRepository
	clients     domain.ClientRepository
}

// NewClientHandler constrói um ClientHandler.
func NewClientHandler(
	processes domain.ProcessRepository,
	links domain.LinkRepository,
	accountants domain.AccountantRepository,
	clients domain.ClientRepository,
) *ClientHandler {
	return &ClientHandler{
		processes:   processes,
		links:       links,
		accountants: accountants,
		clients:     clients,
	}
}

// ListProcesses godoc
// GET /api/cli/processes
func (h *ClientHandler) ListProcesses(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value(userContextKey).(*domain.User)

	// TODO: No futuro, associar User ao Client para buscar o ClientID real.
	list, err := h.processes.ListByClient(r.Context(), user.ID)
	if err != nil {
		respondErr(w, http.StatusInternalServerError, "erro ao listar processos")
		return
	}

	respond(w, http.StatusOK, list)
}

type bindRequest struct {
	ProcessID    string `json:"process_id"`
	AccountantID string `json:"accountant_id"`
}

// BindAccountant godoc
// POST /api/cli/vincular-contador
func (h *ClientHandler) BindAccountant(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value(userContextKey).(*domain.User)

	var req bindRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondErr(w, http.StatusBadRequest, "payload inválido")
		return
	}

	pID, err := uuid.Parse(req.ProcessID)
	if err != nil {
		respondErr(w, http.StatusBadRequest, "id do processo inválido")
		return
	}

	accID, err := uuid.Parse(req.AccountantID)
	if err != nil {
		respondErr(w, http.StatusBadRequest, "id do contador inválido")
		return
	}

	// 1. Verificar se o processo pertence ao cliente
	process, err := h.processes.FindByID(r.Context(), pID)
	if err != nil || process == nil {
		respondErr(w, http.StatusNotFound, "processo não encontrado")
		return
	}

	client, err := h.clients.FindByID(r.Context(), process.ClientID)
	if err != nil || client == nil {
		respondErr(w, http.StatusNotFound, "cliente não encontrado")
		return
	}
	if client.UserID == nil || *client.UserID != user.ID {
		respondErr(w, http.StatusForbidden, "este processo não pertence a você")
		return
	}

	// 2. Criar o vínculo
	link := &domain.ProcessAccountantLink{
		ID:           uuid.New(),
		ProcessID:    pID,
		AccountantID: accID,
		Status:       "pendente",
	}

	if err := h.links.Create(r.Context(), link); err != nil {
		respondErr(w, http.StatusInternalServerError, "erro ao criar vínculo")
		return
	}

	respond(w, http.StatusCreated, map[string]string{"message": "solicitação de vínculo enviada com sucesso"})
}
