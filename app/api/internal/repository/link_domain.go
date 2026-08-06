package repository

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"app/api/internal/domain"
	"github.com/google/uuid"
)

// linkRepo implementa domain.LinkRepository sobre process_accountant_links.
type linkRepo struct {
	db *DB
}

// NewLinkRepositoryDomain cria a implementação de domain.LinkRepository.
func NewLinkRepositoryDomain(db *DB) domain.LinkRepository {
	return &linkRepo{db: db}
}

const domainLinkColumns = `id, process_id, client_id, accountant_id, status, accepted_at, ended_at, end_reason, created_at, updated_at`

// vigenteStatuses são os estados em que o vínculo ainda concede (ou pode
// conceder) acesso ao contador.
const vigenteFilter = `status NOT IN ('recusado','cancelado','concluido')`

func (r *linkRepo) Create(ctx context.Context, l *domain.ProcessAccountantLink) error {
	if l.ID == uuid.Nil {
		l.ID = uuid.New()
	}
	now := time.Now()
	if l.CreatedAt.IsZero() {
		l.CreatedAt = now
	}
	l.UpdatedAt = now

	query := `
		INSERT INTO process_accountant_links
			(id, process_id, client_id, accountant_id, status, accepted_at, ended_at, end_reason, created_at, updated_at)
		VALUES
			(:id, :process_id, :client_id, :accountant_id, :status, :accepted_at, :ended_at, :end_reason, :created_at, :updated_at)`
	_, err := r.db.NamedExecContext(ctx, query, l)
	return err
}

func (r *linkRepo) Update(ctx context.Context, l *domain.ProcessAccountantLink) error {
	l.UpdatedAt = time.Now()
	query := `
		UPDATE process_accountant_links SET
			status = :status,
			accepted_at = :accepted_at,
			ended_at = :ended_at,
			end_reason = :end_reason,
			updated_at = :updated_at
		WHERE id = :id`
	_, err := r.db.NamedExecContext(ctx, query, l)
	return err
}

func (r *linkRepo) FindByID(ctx context.Context, id uuid.UUID) (*domain.ProcessAccountantLink, error) {
	var l domain.ProcessAccountantLink
	query := `SELECT ` + domainLinkColumns + ` FROM process_accountant_links WHERE id = $1`
	if err := r.db.GetContext(ctx, &l, query, id); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return &l, nil
}

// FindActiveByProcess retorna o vínculo vigente do processo, se houver.
func (r *linkRepo) FindActiveByProcess(ctx context.Context, processID uuid.UUID) (*domain.ProcessAccountantLink, error) {
	var l domain.ProcessAccountantLink
	query := `
		SELECT ` + domainLinkColumns + `
		FROM process_accountant_links
		WHERE process_id = $1 AND ` + vigenteFilter + `
		ORDER BY created_at DESC
		LIMIT 1`
	if err := r.db.GetContext(ctx, &l, query, processID); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return &l, nil
}

func (r *linkRepo) ListByAccountant(ctx context.Context, accountantID uuid.UUID) ([]domain.ProcessAccountantLink, error) {
	var links []domain.ProcessAccountantLink
	query := `
		SELECT ` + domainLinkColumns + `
		FROM process_accountant_links
		WHERE accountant_id = $1
		ORDER BY created_at DESC`
	err := r.db.SelectContext(ctx, &links, query, accountantID)
	return links, err
}

func (r *linkRepo) ListPendingByAccountant(ctx context.Context, accountantID uuid.UUID) ([]domain.ProcessAccountantLink, error) {
	var links []domain.ProcessAccountantLink
	query := `
		SELECT ` + domainLinkColumns + `
		FROM process_accountant_links
		WHERE accountant_id = $1 AND status IN ('pendente','solicitado')
		ORDER BY created_at DESC`
	err := r.db.SelectContext(ctx, &links, query, accountantID)
	return links, err
}

// ListByClient lista os vínculos de um cliente (users.id).
func (r *linkRepo) ListByClient(ctx context.Context, clientID uuid.UUID) ([]domain.ProcessAccountantLink, error) {
	var links []domain.ProcessAccountantLink
	query := `
		SELECT ` + domainLinkColumns + `
		FROM process_accountant_links
		WHERE client_id = $1
		ORDER BY created_at DESC`
	err := r.db.SelectContext(ctx, &links, query, clientID)
	return links, err
}
