package handler

import (
	"net/http"

	"app/api/internal/domain"
	"github.com/google/uuid"
)

// NotificationHandler gerencia notificações do usuário autenticado.
type NotificationHandler struct {
	repo domain.NotificationRepository
}

func NewNotificationHandler(repo domain.NotificationRepository) *NotificationHandler {
	return &NotificationHandler{repo: repo}
}

// ListNotifications godoc
// GET /api/auth/me/notifications
func (h *NotificationHandler) ListNotifications(w http.ResponseWriter, r *http.Request) {
	claims := claimsFromContext(r.Context())
	if claims == nil {
		respondErr(w, http.StatusUnauthorized, "não autenticado")
		return
	}

	notifs, err := h.repo.ListByUser(r.Context(), claims.UserID, false)
	if err != nil {
		respondErr(w, http.StatusInternalServerError, "erro ao buscar notificações")
		return
	}

	respond(w, http.StatusOK, notifs)
}

// MarkRead godoc
// POST /api/auth/me/notifications/{id}/read
func (h *NotificationHandler) MarkRead(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		respondErr(w, http.StatusBadRequest, "id inválido")
		return
	}

	if err := h.repo.MarkRead(r.Context(), id); err != nil {
		respondErr(w, http.StatusInternalServerError, "erro ao marcar como lida")
		return
	}

	respond(w, http.StatusOK, map[string]string{"status": "ok"})
}

// MarkAllRead godoc
// POST /api/auth/me/notifications/read-all
func (h *NotificationHandler) MarkAllRead(w http.ResponseWriter, r *http.Request) {
	claims := claimsFromContext(r.Context())
	if claims == nil {
		respondErr(w, http.StatusUnauthorized, "não autenticado")
		return
	}

	if err := h.repo.MarkAllRead(r.Context(), claims.UserID); err != nil {
		respondErr(w, http.StatusInternalServerError, "erro ao marcar todas como lidas")
		return
	}

	respond(w, http.StatusOK, map[string]string{"status": "ok"})
}
