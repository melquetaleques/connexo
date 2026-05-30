package repository

import (
	"context"
	"encoding/json"
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

// ProcessEvent representa um evento na timeline de um processo.
type ProcessEvent struct {
	ID        uuid.UUID       `db:"id" json:"id"`
	ProcessID uuid.UUID       `db:"process_id" json:"process_id"`
	EventType string          `db:"event_type" json:"event_type"`
	ActorID   uuid.UUID       `db:"actor_id" json:"actor_id"`
	ActorRole string          `db:"actor_role" json:"actor_role"`
	Metadata  json.RawMessage `db:"metadata" json:"metadata"`
	CreatedAt time.Time       `db:"created_at" json:"created_at"`
}

// ProcessEventsRepository gerencia a persistência de eventos de processo.
type ProcessEventsRepository struct {
	db *sqlx.DB
}

// NewProcessEventsRepository cria uma nova instância de ProcessEventsRepository.
func NewProcessEventsRepository(db *sqlx.DB) *ProcessEventsRepository {
	return &ProcessEventsRepository{db: db}
}

// Create insere um novo evento de processo no banco de dados.
func (r *ProcessEventsRepository) Create(ctx context.Context, event *ProcessEvent) error {
	if event.ID == uuid.Nil {
		event.ID = uuid.New()
	}
	if event.CreatedAt.IsZero() {
		event.CreatedAt = time.Now()
	}
	if event.Metadata == nil {
		event.Metadata = json.RawMessage("{}")
	}

	query := `
		INSERT INTO process_events (id, process_id, event_type, actor_id, actor_role, metadata, created_at)
		VALUES (:id, :process_id, :event_type, :actor_id, :actor_role, :metadata, :created_at)
	`
	_, err := r.db.NamedExecContext(ctx, query, event)
	return err
}

// ListByProcess lista todos os eventos associados a um processo.
func (r *ProcessEventsRepository) ListByProcess(ctx context.Context, processID uuid.UUID) ([]*ProcessEvent, error) {
	var events []*ProcessEvent
	query := `
		SELECT id, process_id, event_type, actor_id, actor_role, metadata, created_at
		FROM process_events
		WHERE process_id = $1
		ORDER BY created_at ASC
	`
	err := r.db.SelectContext(ctx, &events, query, processID)
	if err != nil {
		return nil, err
	}
	return events, nil
}
