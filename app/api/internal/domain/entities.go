package domain

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"
)

// Role representa o papel de um usuário no sistema.
type Role string

const (
	RoleAdvogado Role = "advogado"
	RoleContador Role = "contador"
	RoleCliente  Role = "cliente"
	RoleAdmin    Role = "admin"
)

type User struct {
	ID           uuid.UUID `db:"id" json:"id"`
	Email        string    `db:"email" json:"email"`
	PasswordHash string    `db:"password_hash" json:"-"`
	Role         Role      `db:"role" json:"role"`
	Name         string    `db:"name" json:"name"`
	Phone        string    `db:"phone" json:"phone"`
	CreatedAt    time.Time `db:"created_at" json:"created_at"`
	UpdatedAt    time.Time `db:"updated_at" json:"updated_at"`
}

type Lawyer struct {
	ID                    uuid.UUID  `db:"id" json:"id"`
	UserID                uuid.UUID  `db:"user_id" json:"user_id"`
	OABNumber             string     `db:"oab_number" json:"oab_number"`
	OABState              string     `db:"oab_state" json:"oab_state"`
	OfficeName            string     `db:"office_name" json:"office_name"`
	SubscriptionStatus    string     `db:"subscription_status" json:"subscription_status"`
	SubscriptionExpiresAt *time.Time `db:"subscription_expires_at" json:"subscription_expires_at"`
	CreatedAt             time.Time  `db:"created_at" json:"created_at"`
}

type Client struct {
	ID        uuid.UUID  `db:"id" json:"id"`
	LawyerID  uuid.UUID  `db:"lawyer_id" json:"lawyer_id"`
	UserID    *uuid.UUID `db:"user_id" json:"user_id"`
	Name      string     `db:"name" json:"name"`
	Document  string     `db:"document" json:"document"`
	Email     string     `db:"email" json:"email"`
	Phone     string     `db:"phone" json:"phone"`
	Type      string     `db:"type" json:"type"`
	Status    string     `db:"status" json:"status"`
	Notes     string     `db:"notes" json:"notes"`
	CreatedAt time.Time  `db:"created_at" json:"created_at"`
	UpdatedAt time.Time  `db:"updated_at" json:"updated_at"`
}

type Process struct {
	ID        uuid.UUID `db:"id" json:"id"`
	LawyerID  uuid.UUID `db:"lawyer_id" json:"lawyer_id"`
	ClientID  uuid.UUID `db:"client_id" json:"client_id"`
	Number    string    `db:"number" json:"number"`
	Type      string    `db:"type" json:"type"`
	Court     string    `db:"court" json:"court"`
	Stage     string    `db:"stage" json:"stage"`
	Status    string    `db:"status" json:"status"`
	CreatedAt time.Time `db:"created_at" json:"created_at"`
	UpdatedAt time.Time `db:"updated_at" json:"updated_at"`
}

type Accountant struct {
	ID             uuid.UUID `db:"id" json:"id"`
	UserID         uuid.UUID `db:"user_id" json:"user_id"`
	CRCNumber      string    `db:"crc_number" json:"crc_number"`
	CRCState       string    `db:"crc_state" json:"crc_state"`
	Bio            string    `db:"bio" json:"bio"`
	Specialties    []string  `db:"specialties" json:"specialties"`
	City           string    `db:"city" json:"city"`
	State          string    `db:"state" json:"state"`
	Slug           string    `db:"slug" json:"slug"`
	IsPublic       bool      `db:"is_public" json:"is_public"`
	Rating         float64   `db:"rating" json:"rating"`
	CompletedCases int       `db:"completed_cases" json:"completed_cases"`
	CreatedAt      time.Time `db:"created_at" json:"created_at"`
	UpdatedAt      time.Time `db:"updated_at" json:"updated_at"`
}

type Document struct {
	ID                  uuid.UUID `db:"id" json:"id"`
	ProcessID           uuid.UUID `db:"process_id" json:"process_id"`
	UploadedBy          uuid.UUID `db:"uploaded_by" json:"uploaded_by"`
	Name                string    `db:"name" json:"name"`
	SizeBytes           int64     `db:"size_bytes" json:"size_bytes"`
	MimeType            string    `db:"mime_type" json:"mime_type"`
	Bucket              string    `db:"bucket" json:"-"`
	ObjectKey           string    `db:"object_key" json:"-"`
	StoragePath         string    `db:"storage_path" json:"storage_path"`
	VisibleToAccountant bool      `db:"visible_to_accountant" json:"visible_to_accountant"`
	CreatedAt           time.Time `db:"created_at" json:"created_at"`
}

type AccountantService struct {
	ID           uuid.UUID `db:"id" json:"id"`
	AccountantID uuid.UUID `db:"accountant_id" json:"accountant_id"`
	Title        string    `db:"title" json:"title"`
	Description  string    `db:"description" json:"description"`
	Icon         string    `db:"icon" json:"icon"`
	Areas        []string  `db:"areas" json:"areas"`
	PriceFrom    float64   `db:"price_from" json:"price_from"`
	AvgDays      int       `db:"avg_days" json:"avg_days"`
	IsVisible    bool      `db:"is_visible" json:"is_visible"`
	CreatedAt    time.Time `db:"created_at" json:"created_at"`
}

type Notification struct {
	ID        uuid.UUID       `db:"id" json:"id"`
	UserID    uuid.UUID       `db:"user_id" json:"user_id"`
	Kind      string          `db:"kind" json:"kind"`
	Title     string          `db:"title" json:"title"`
	Body      string          `db:"body" json:"body"`
	Read      bool            `db:"read" json:"read"`
	Payload   json.RawMessage `db:"payload" json:"payload"`
	CreatedAt time.Time       `db:"created_at" json:"created_at"`
}

type AuditLog struct {
	ID           uuid.UUID       `db:"id" json:"id"`
	UserID       *uuid.UUID      `db:"user_id" json:"user_id"`
	Action       string          `db:"action" json:"action"`
	ResourceType string          `db:"resource_type" json:"resource_type"`
	ResourceID   *uuid.UUID      `db:"resource_id" json:"resource_id"`
	Metadata     json.RawMessage `db:"metadata" json:"metadata"`
	IPAddress    string          `db:"ip_address" json:"ip_address"`
	CreatedAt    time.Time       `db:"created_at" json:"created_at"`
}

// ClientConsent representa o consentimento LGPD registrado.
type ClientConsent struct {
	ID           uuid.UUID `db:"id" json:"id"`
	ClientID     uuid.UUID `db:"client_id" json:"client_id"`
	LinkID       uuid.UUID `db:"link_id" json:"link_id"`
	ConsentedAt  time.Time `db:"consented_at" json:"consented_at"`
	IPAddress    string    `db:"ip_address" json:"ip_address"`
	UserAgent    string    `db:"user_agent" json:"user_agent"`
	TextVersion  string    `db:"text_version" json:"text_version"`
}

// DocPermission representa a permissão de acesso a um documento por vínculo.
type DocPermission struct {
	ID         uuid.UUID  `db:"id" json:"id"`
	DocumentID uuid.UUID  `db:"document_id" json:"document_id"`
	LinkID     uuid.UUID  `db:"link_id" json:"link_id"`
	GrantedBy  uuid.UUID  `db:"granted_by" json:"granted_by"`
	GrantedAt  time.Time  `db:"granted_at" json:"granted_at"`
	RevokedAt  *time.Time `db:"revoked_at" json:"revoked_at"`
}

// DocumentRequest representa uma solicitação de documento do advogado ao cliente.
type DocumentRequest struct {
	ID          uuid.UUID `db:"id" json:"id"`
	ProcessID   uuid.UUID `db:"process_id" json:"process_id"`
	RequestedBy uuid.UUID `db:"requested_by" json:"requested_by"`
	ClientID    uuid.UUID `db:"client_id" json:"client_id"`
	Description string    `db:"description" json:"description"`
	Status      string    `db:"status" json:"status"`
	CreatedAt   time.Time `db:"created_at" json:"created_at"`
	UpdatedAt   time.Time `db:"updated_at" json:"updated_at"`
}

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

// ProcessAccountantLink representa o vínculo entre um processo e um contador.
//
// ClientID e AccountantID referenciam users(id): são os atores notificados e
// autorizados pelo vínculo.
type ProcessAccountantLink struct {
	ID           uuid.UUID  `db:"id" json:"id"`
	ProcessID    uuid.UUID  `db:"process_id" json:"process_id"`
	ClientID     uuid.UUID  `db:"client_id" json:"client_id"`
	AccountantID uuid.UUID  `db:"accountant_id" json:"accountant_id"`
	Status       LinkStatus `db:"status" json:"status"`
	AcceptedAt   *time.Time `db:"accepted_at" json:"accepted_at"`
	EndedAt      *time.Time `db:"ended_at" json:"ended_at"`
	EndReason    string     `db:"end_reason" json:"end_reason"`
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
