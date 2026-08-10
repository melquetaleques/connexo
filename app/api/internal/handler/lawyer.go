package handler

import (
	"encoding/json"
	"log"
	"net/http"

	"app/api/internal/domain"
	"app/api/internal/service"
	"github.com/google/uuid"
)

type LawyerHandler struct {
	svc *service.LawyerService
}

func NewLawyerHandler(svc *service.LawyerService) *LawyerHandler {
	return &LawyerHandler{svc: svc}
}

// GET /api/adv/dashboard
func (h *LawyerHandler) Dashboard(w http.ResponseWriter, r *http.Request) {
	claims := claimsFromContext(r.Context())
	data, err := h.svc.GetDashboardData(r.Context(), claims.UserID)
	if err != nil {
		respondErr(w, http.StatusInternalServerError, "erro ao carregar dashboard")
		return
	}
	respond(w, http.StatusOK, data)
}

// GET /api/adv/clients
func (h *LawyerHandler) ListClients(w http.ResponseWriter, r *http.Request) {
	claims := claimsFromContext(r.Context())
	clients, err := h.svc.ListClients(r.Context(), claims.UserID)
	if err != nil {
		respondErr(w, http.StatusInternalServerError, "erro ao listar clientes")
		return
	}
	respond(w, http.StatusOK, clients)
}

// GET /api/adv/clients/{id}
func (h *LawyerHandler) GetClient(w http.ResponseWriter, r *http.Request) {
	claims := claimsFromContext(r.Context())
	idStr := r.PathValue("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		respondErr(w, http.StatusBadRequest, "id inválido")
		return
	}

	client, err := h.svc.GetClient(r.Context(), claims.UserID, id)
	if err != nil {
		respondErr(w, http.StatusNotFound, "cliente não encontrado")
		return
	}
	respond(w, http.StatusOK, client)
}

// POST /api/adv/clients
func (h *LawyerHandler) CreateClient(w http.ResponseWriter, r *http.Request) {
	claims := claimsFromContext(r.Context())
	var client domain.Client
	if err := json.NewDecoder(r.Body).Decode(&client); err != nil {
		respondErr(w, http.StatusBadRequest, "corpo inválido")
		return
	}

	if err := h.svc.CreateClient(r.Context(), claims.UserID, &client); err != nil {
		respondErr(w, http.StatusInternalServerError, "erro ao criar cliente")
		return
	}
	respond(w, http.StatusCreated, client)
}

// GET /api/adv/processes
func (h *LawyerHandler) ListProcesses(w http.ResponseWriter, r *http.Request) {
	claims := claimsFromContext(r.Context())
	processes, err := h.svc.ListProcesses(r.Context(), claims.UserID)
	if err != nil {
		respondErr(w, http.StatusInternalServerError, "erro ao listar processos")
		return
	}
	respond(w, http.StatusOK, processes)
}

// POST /api/adv/processes
func (h *LawyerHandler) CreateProcess(w http.ResponseWriter, r *http.Request) {
	claims := claimsFromContext(r.Context())
	var proc domain.Process
	if err := json.NewDecoder(r.Body).Decode(&proc); err != nil {
		respondErr(w, http.StatusBadRequest, "corpo inválido")
		return
	}

	if err := h.svc.CreateProcess(r.Context(), claims.UserID, &proc); err != nil {
		switch err {
		case service.ErrDuplicateProcessNumber:
			respondErr(w, http.StatusConflict, err.Error())
		case service.ErrUnauthorized:
			respondErr(w, http.StatusForbidden, "cliente não encontrado")
		default:
			log.Printf("CreateProcess: %v", err)
			respondErr(w, http.StatusInternalServerError, "erro ao criar processo")
		}
		return
	}
	respond(w, http.StatusCreated, proc)
}

// GET /api/adv/processes/{id}
func (h *LawyerHandler) GetProcess(w http.ResponseWriter, r *http.Request) {
	claims := claimsFromContext(r.Context())
	idStr := r.PathValue("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		respondErr(w, http.StatusBadRequest, "id inválido")
		return
	}

	process, err := h.svc.GetProcess(r.Context(), claims.UserID, id)
	if err != nil {
		respondErr(w, http.StatusNotFound, "processo não encontrado")
		return
	}
	respond(w, http.StatusOK, process)
}

type timelineEntry struct {
	Action string `json:"action"`
	Time   string `json:"time"`
	User   string `json:"user"`
}

// GetProcessTimeline godoc
// GET /api/adv/processes/{id}/timeline
func (h *LawyerHandler) GetProcessTimeline(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		respondErr(w, http.StatusBadRequest, "id inválido")
		return
	}

	claims := claimsFromContext(r.Context())
	process, err := h.svc.GetProcess(r.Context(), claims.UserID, id)
	if err != nil || process == nil {
		respondErr(w, http.StatusNotFound, "processo não encontrado")
		return
	}

	entries := []timelineEntry{
		{Action: "Processo cadastrado", Time: process.CreatedAt.Format("02/01/2006"), User: "Sistema"},
	}
	if process.UpdatedAt.After(process.CreatedAt) {
		entries = append(entries, timelineEntry{
			Action: "Processo atualizado",
			Time:   process.UpdatedAt.Format("02/01/2006"),
			User:   "Sistema",
		})
	}

	respond(w, http.StatusOK, entries)
}

