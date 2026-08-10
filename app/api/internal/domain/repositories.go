package domain

import (
	"context"

	"github.com/google/uuid"
)

// UserRepository define operações de persistência de usuários.
type UserRepository interface {
	Create(ctx context.Context, u *User) error
	FindByEmail(ctx context.Context, email string) (*User, error)
	FindByID(ctx context.Context, id uuid.UUID) (*User, error)
}

// LawyerRepository define operações de persistência de advogados.
type LawyerRepository interface {
	Create(ctx context.Context, l *Lawyer) error
	FindByUserID(ctx context.Context, userID uuid.UUID) (*Lawyer, error)
}

// ClientRepository define operações de persistência de clientes.
type ClientRepository interface {
	Create(ctx context.Context, c *Client) error
	Update(ctx context.Context, c *Client) error
	FindByID(ctx context.Context, id uuid.UUID) (*Client, error)
	// ListByUser lista os cadastros de cliente associados a um usuário do
	// painel. Um mesmo usuário pode ser cliente de mais de um advogado.
	ListByUser(ctx context.Context, userID uuid.UUID) ([]Client, error)
	ListByLawyer(ctx context.Context, lawyerID uuid.UUID) ([]Client, error)
	Delete(ctx context.Context, id uuid.UUID) error
	// SetUserID vincula o cadastro de cliente a uma conta de usuário do
	// portal, permitindo que ele passe a acessar seus processos.
	SetUserID(ctx context.Context, id, userID uuid.UUID) error
}

// ProcessRepository define operações de persistência de processos.
type ProcessRepository interface {
	Create(ctx context.Context, p *Process) error
	Update(ctx context.Context, p *Process) error
	FindByID(ctx context.Context, id uuid.UUID) (*Process, error)
	ListByLawyer(ctx context.Context, lawyerID uuid.UUID) ([]Process, error)
	ListByClient(ctx context.Context, clientID uuid.UUID) ([]Process, error)
}

// AccountantRepository define operações de persistência de contadores.
type AccountantRepository interface {
	Create(ctx context.Context, a *Accountant) error
	Update(ctx context.Context, a *Accountant) error
	FindByUserID(ctx context.Context, userID uuid.UUID) (*Accountant, error)
	FindBySlug(ctx context.Context, slug string) (*Accountant, error)
	ListPublic(ctx context.Context, filter AccountantFilter) ([]Accountant, error)
}

// AccountantFilter é o filtro para o catálogo público de contadores.
type AccountantFilter struct {
	Specialty string
	City      string
	State     string
	Query     string
	Limit     int
	Offset    int
}

// LinkRepository define operações de persistência de vínculos processo↔contador.
type LinkRepository interface {
	Create(ctx context.Context, l *ProcessAccountantLink) error
	Update(ctx context.Context, l *ProcessAccountantLink) error
	FindByID(ctx context.Context, id uuid.UUID) (*ProcessAccountantLink, error)
	FindActiveByProcess(ctx context.Context, processID uuid.UUID) (*ProcessAccountantLink, error)
	ListByAccountant(ctx context.Context, accountantID uuid.UUID) ([]ProcessAccountantLink, error)
	ListPendingByAccountant(ctx context.Context, accountantID uuid.UUID) ([]ProcessAccountantLink, error)
}

// DocumentRepository define operações de persistência de documentos.
type DocumentRepository interface {
	Create(ctx context.Context, d *Document) error
	ListByProcess(ctx context.Context, processID uuid.UUID, forAccountant bool) ([]Document, error)
	SetAccountantVisibility(ctx context.Context, docID uuid.UUID, visible bool) error
}

// AccountantServiceRepository define operações de serviços do contador.
type AccountantServiceRepository interface {
	ListByAccountant(ctx context.Context, accountantID uuid.UUID) ([]AccountantService, error)
	Create(ctx context.Context, s *AccountantService) error
	Update(ctx context.Context, s *AccountantService) error
	Delete(ctx context.Context, id uuid.UUID) error
}

// NotificationRepository define operações de notificações.
type NotificationRepository interface {
	Create(ctx context.Context, n *Notification) error
	ListByUser(ctx context.Context, userID uuid.UUID, unreadOnly bool) ([]Notification, error)
	MarkRead(ctx context.Context, notifID uuid.UUID) error
	MarkAllRead(ctx context.Context, userID uuid.UUID) error
}

// AuditRepository define operações de log de auditoria.
type AuditRepository interface {
	Log(ctx context.Context, entry *AuditLog) error
}
