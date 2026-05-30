package repository

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

// Notification representa uma notificação interna para o usuário.
type Notification struct {
	ID        uuid.UUID `db:"id" json:"id"`
	UserID    uuid.UUID `db:"user_id" json:"user_id"`
	Title     string    `db:"title" json:"title"`
	Message   string    `db:"message" json:"message"`
	Read      bool      `db:"read" json:"read"`
	CreatedAt time.Time `db:"created_at" json:"created_at"`
}

// NotificationRepository gerencia a persistência de notificações.
type NotificationRepository struct {
	db *sqlx.DB
}

// NewNotificationRepository cria uma nova instância de NotificationRepository.
func NewNotificationRepository(db *sqlx.DB) *NotificationRepository {
	return &NotificationRepository{db: db}
}

// Create insere uma nova notificação no banco de dados.
func (r *NotificationRepository) Create(ctx context.Context, notif *Notification) error {
	if notif.ID == uuid.Nil {
		notif.ID = uuid.New()
	}
	notif.CreatedAt = time.Now()
	notif.Read = false

	query := `
		INSERT INTO notifications (id, user_id, title, message, read, created_at)
		VALUES (:id, :user_id, :title, :message, :read, :created_at)
	`
	_, err := r.db.NamedExecContext(ctx, query, notif)
	return err
}

// ListByUser lista todas as notificações de um usuário.
func (r *NotificationRepository) ListByUser(ctx context.Context, userID uuid.UUID, limit, offset int) ([]*Notification, error) {
	if limit <= 0 {
		limit = 20
	}
	if offset < 0 {
		offset = 0
	}

	var notifications []*Notification
	query := `
		SELECT id, user_id, title, message, read, created_at
		FROM notifications
		WHERE user_id = $1
		ORDER BY created_at DESC
		LIMIT $2 OFFSET $3
	`
	err := r.db.SelectContext(ctx, &notifications, query, userID, limit, offset)
	if err != nil {
		return nil, err
	}

	return notifications, nil
}

// MarkAsRead marca uma notificação como lida.
func (r *NotificationRepository) MarkAsRead(ctx context.Context, id uuid.UUID) error {
	query := `UPDATE notifications SET read = true WHERE id = $1`
	_, err := r.db.ExecContext(ctx, query, id)
	return err
}
