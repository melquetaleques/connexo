package handler

import (
	"encoding/json"
	"net/http"

	"app/api/internal/domain"
	"app/api/internal/service"
	"github.com/google/uuid"
)

// ClientHandler gerencia as operações do painel do cliente.
type ClientHandler struct {
	processes   domain.ProcessRepository
	links       domain.LinkRepository
	clients     domain.ClientRepository
	users       domain.UserRepository
	linkService *service.LinkService
}

// NewClientHandler constrói um ClientHandler.
func NewClientHandler(
	processes domain.ProcessRepository,
	links domain.LinkRepository,
	clients domain.ClientRepository,
	users domain.UserRepository,
	linkService *service.LinkService,
) *ClientHandler {
	return &ClientHandler{
		processes:   processes,
		links:       links,
		clients:     clients,
		users:       users,
		linkService: linkService,
	}
}

type clientProcessItem struct {
	domain.Process
	AccountantID   *uuid.UUID `json:"accountant_id"`
	AccountantName string     `json:"accountant_name"`
	LinkID         *uuid.UUID `json:"link_id"`
	LinkStatus     string     `json:"link_status"`
}

// ListProcesses godoc
// GET /api/cli/processes
//
// Lista os processos dos cadastros de cliente associados ao usuário logado,
// junto do vínculo vigente de cada processo.
func (h *ClientHandler) ListProcesses(w http.ResponseWriter, r *http.Request) {
	user := userFromContext(r.Context())
	if user == nil {
		respondErr(w, http.StatusUnauthorized, "não autenticado")
		return
	}

	clients, err := h.clients.ListByUser(r.Context(), user.ID)
	if err != nil {
		respondErr(w, http.StatusInternalServerError, "erro ao buscar cadastro do cliente")
		return
	}

	items := []clientProcessItem{}
	for _, c := range clients {
		list, err := h.processes.ListByClient(r.Context(), c.ID)
		if err != nil {
			respondErr(w, http.StatusInternalServerError, "erro ao listar processos")
			return
		}
		for _, p := range list {
			item := clientProcessItem{Process: p}
			if link, err := h.links.FindActiveByProcess(r.Context(), p.ID); err == nil && link != nil {
				accountantID := link.AccountantID
				linkID := link.ID
				item.AccountantID = &accountantID
				item.LinkID = &linkID
				item.LinkStatus = string(link.Status)
				if acc, err := h.users.FindByID(r.Context(), accountantID); err == nil && acc != nil {
					item.AccountantName = acc.Name
				}
			}
			items = append(items, item)
		}
	}

	respond(w, http.StatusOK, items)
}

type bindRequest struct {
	ProcessID    string `json:"process_id"`
	AccountantID string `json:"accountant_id"`
}

// BindAccountant godoc
// POST /api/cli/vincular-contador
//
// Registra a escolha do contador pelo cliente para um processo específico. A
// criação do vínculo, a validação de exclusividade e a notificação do contador
// ficam a cargo do LinkService.
func (h *ClientHandler) BindAccountant(w http.ResponseWriter, r *http.Request) {
	user := userFromContext(r.Context())
	if user == nil {
		respondErr(w, http.StatusUnauthorized, "não autenticado")
		return
	}

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

	// O processo precisa pertencer a um cadastro de cliente deste usuário.
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

	link, err := h.linkService.RequestLink(r.Context(), pID, user.ID, accID)
	if err != nil {
		respondErr(w, http.StatusConflict, err.Error())
		return
	}

	respond(w, http.StatusCreated, map[string]any{
		"message": "solicitação de vínculo enviada com sucesso",
		"link_id": link.ID,
		"status":  link.Status,
	})
}
