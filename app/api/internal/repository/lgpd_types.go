package repository

import (
	"time"

	"github.com/google/uuid"
)

// ConsentRecord representa o consentimento LGPD no banco de dados.
type ConsentRecord struct {
	ID          uuid.UUID `db:"id" json:"id"`
	ClientID    uuid.UUID `db:"client_id" json:"client_id"`
	LinkID      uuid.UUID `db:"link_id" json:"link_id"`
	ConsentedAt time.Time `db:"consented_at" json:"consented_at"`
	IPAddress   string    `db:"ip_address" json:"ip_address"`
	UserAgent   string    `db:"user_agent" json:"user_agent"`
	TextVersion string    `db:"text_version" json:"text_version"`
}

// DocPerm representa permissão de acesso a um documento no banco de dados.
type DocPerm struct {
	ID         uuid.UUID  `db:"id" json:"id"`
	DocumentID uuid.UUID  `db:"document_id" json:"document_id"`
	LinkID     uuid.UUID  `db:"link_id" json:"link_id"`
	GrantedBy  uuid.UUID  `db:"granted_by" json:"granted_by"`
	GrantedAt  time.Time  `db:"granted_at" json:"granted_at"`
	RevokedAt  *time.Time `db:"revoked_at" json:"revoked_at"`
}

// DocReq representa uma solicitação de documento no banco de dados.
type DocReq struct {
	ID          uuid.UUID `db:"id" json:"id"`
	ProcessID   uuid.UUID `db:"process_id" json:"process_id"`
	RequestedBy uuid.UUID `db:"requested_by" json:"requested_by"`
	ClientID    uuid.UUID `db:"client_id" json:"client_id"`
	Description string    `db:"description" json:"description"`
	Status      string    `db:"status" json:"status"`
	CreatedAt   time.Time `db:"created_at" json:"created_at"`
	UpdatedAt   time.Time `db:"updated_at" json:"updated_at"`
}
