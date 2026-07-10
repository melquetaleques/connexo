package repository

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	"app/api/internal/domain"
	"github.com/google/uuid"
)


type auditRepo struct {
	db *DB
}

func NewAuditRepository(db *DB) domain.AuditRepository {
	return &auditRepo{db: db}
}

func (r *auditRepo) Log(ctx context.Context, entry *domain.AuditLog) error {
	query := `
		INSERT INTO audit_logs (id, user_id, action, resource_type, resource_id, metadata, ip_address, created_at)
		VALUES (:id, :user_id, :action, :resource_type, :resource_id, :metadata, :ip_address, :created_at)`
	_, err := r.db.NamedExecContext(ctx, query, entry)
	return err
}

type accountantRepo struct {
	db *DB
}

func NewAccountantRepository(db *DB) domain.AccountantRepository {
	return &accountantRepo{db: db}
}

func (r *accountantRepo) Create(ctx context.Context, a *domain.Accountant) error {
	query := `
		INSERT INTO accountants (id, user_id, crc_number, crc_state, bio, city, state, slug, is_public, rating, completed_cases, created_at, updated_at)
		VALUES (:id, :user_id, :crc_number, :crc_state, :bio, :city, :state, :slug, :is_public, :rating, :completed_cases, :created_at, :updated_at)`
	_, err := r.db.NamedExecContext(ctx, query, a)
	return err
}

func (r *accountantRepo) Update(ctx context.Context, a *domain.Accountant) error {
	query := `
		UPDATE accountants SET 
			bio = :bio, city = :city, state = :state, slug = :slug, 
			is_public = :is_public, rating = :rating, completed_cases = :completed_cases, updated_at = :updated_at
		WHERE id = :id`
	_, err := r.db.NamedExecContext(ctx, query, a)
	return err
}

func (r *accountantRepo) FindByUserID(ctx context.Context, userID uuid.UUID) (*domain.Accountant, error) {
	var a domain.Accountant
	query := `SELECT * FROM accountants WHERE user_id = $1`
	err := r.db.GetContext(ctx, &a, query, userID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return &a, nil
}

func (r *accountantRepo) FindBySlug(ctx context.Context, slug string) (*domain.Accountant, error) {
	var a domain.Accountant
	query := `SELECT * FROM accountants WHERE slug = $1`
	err := r.db.GetContext(ctx, &a, query, slug)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return &a, nil
}

func (r *accountantRepo) ListPublic(ctx context.Context, filter domain.AccountantFilter) ([]domain.Accountant, error) {
	var accountants []domain.Accountant
	// Construção simples de query dinâmica para o catálogo
	query := `SELECT * FROM accountants WHERE is_public = true`
	args := []any{}

	if filter.Specialty != "" {
		// Nota: specialties é um array no schema. Aqui estamos simplificando a busca.
		query += ` AND $1 = ANY(specialties)`
		args = append(args, filter.Specialty)
	}

	if filter.City != "" {
		query += fmt.Sprintf(` AND city = $%d`, len(args)+1)
		args = append(args, filter.City)
	}

	if filter.State != "" {
		query += fmt.Sprintf(` AND state = $%d`, len(args)+1)
		args = append(args, filter.State)
	}

	query += ` ORDER BY rating DESC, completed_cases DESC LIMIT 30`

	err := r.db.SelectContext(ctx, &accountants, query, args...)
	return accountants, err
}

