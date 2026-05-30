package domain

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"
)

// LinkStatus representa os possíveis estados do vínculo entre cliente/processo e contador.
type LinkStatus string

const (
	LinkStatusPendente              LinkStatus = "pendente"
	LinkStatusAceito                LinkStatus = "aceito"
	LinkStatusRecusado              LinkStatus = "recusado"
	LinkStatusAtivo                 LinkStatus = "ativo"
	LinkStatusEmAndamento           LinkStatus = "em_andamento"
	LinkStatusEntregue              LinkStatus = "entregue"
	LinkStatusRevisaoSolicitada     LinkStatus = "revisao_solicitada"
	LinkStatusConcluido             LinkStatus = "concluido"
	LinkStatusCancelamentoSolicitado LinkStatus = "cancelamento_solicitado"
	LinkStatusCancelado             LinkStatus = "cancelado"
)

// ProcessAccountantLink representa a entidade de vínculo entre cliente/processo e contador.
type ProcessAccountantLink struct {
	ID           uuid.UUID  `db:"id" json:"id"`
	ClientID     uuid.UUID  `db:"client_id" json:"client_id"`
	AccountantID uuid.UUID  `db:"accountant_id" json:"accountant_id"`
	Status       LinkStatus `db:"status" json:"status"`
	CreatedAt    time.Time  `db:"created_at" json:"created_at"`
	UpdatedAt    time.Time  `db:"updated_at" json:"updated_at"`
}

// Deliverable representa um entregável enviado pelo contador.
type Deliverable struct {
	ID            uuid.UUID  `db:"id" json:"id"`
	LinkID        uuid.UUID  `db:"link_id" json:"link_id"`
	SubmittedBy   uuid.UUID  `db:"submitted_by" json:"submitted_by"`
	ContentText   string     `db:"content_text" json:"content_text"`
	FileName      string     `db:"file_name" json:"file_name"`
	FileSize      int64      `db:"file_size" json:"file_size"`
	Status        string     `db:"status" json:"status"`
	ReviewComment string     `db:"review_comment" json:"review_comment"`
	SubmittedAt   time.Time  `db:"submitted_at" json:"submitted_at"`
	ReviewedAt    *time.Time `db:"reviewed_at" json:"reviewed_at"`
	CreatedAt     time.Time  `db:"created_at" json:"created_at"`
}

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
