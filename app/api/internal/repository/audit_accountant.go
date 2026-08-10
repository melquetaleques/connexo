package repository

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"time"

	"app/api/internal/domain"
	"github.com/google/uuid"
	"github.com/lib/pq"
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
			bio = :bio, city = :city, cities = :cities, state = :state, slug = :slug,
			is_public = :is_public, rating = :rating, completed_cases = :completed_cases, updated_at = :updated_at
		WHERE id = :id`
	_, err := r.db.NamedExecContext(ctx, query, map[string]any{
		"bio":             a.Bio,
		"city":            a.City,
		"cities":          pq.Array(a.Cities),
		"state":           a.State,
		"slug":            a.Slug,
		"is_public":       a.IsPublic,
		"rating":          a.Rating,
		"completed_cases": a.CompletedCases,
		"updated_at":      a.UpdatedAt,
		"id":              a.ID,
	})
	return err
}

// accountantRow espelha a tabela accountants para o scan do driver. O
// database/sql padrão não sabe converter um TEXT[] do Postgres direto em
// []string — precisa do wrapper pq.StringArray, então o scan struct usa um
// tipo à parte e converte para domain.Accountant depois.
type accountantRow struct {
	ID             uuid.UUID      `db:"id"`
	UserID         uuid.UUID      `db:"user_id"`
	CRCNumber      string         `db:"crc_number"`
	CRCState       string         `db:"crc_state"`
	Bio            string         `db:"bio"`
	Specialties    pq.StringArray `db:"specialties"`
	City           string         `db:"city"`
	Cities         pq.StringArray `db:"cities"`
	State          string         `db:"state"`
	Slug           string         `db:"slug"`
	IsPublic       bool           `db:"is_public"`
	Rating         float64        `db:"rating"`
	CompletedCases int            `db:"completed_cases"`
	CreatedAt      time.Time      `db:"created_at"`
	UpdatedAt      time.Time      `db:"updated_at"`
}

func (row accountantRow) toDomain() domain.Accountant {
	return domain.Accountant{
		ID:             row.ID,
		UserID:         row.UserID,
		CRCNumber:      row.CRCNumber,
		CRCState:       row.CRCState,
		Bio:            row.Bio,
		Specialties:    []string(row.Specialties),
		City:           row.City,
		Cities:         []string(row.Cities),
		State:          row.State,
		Slug:           row.Slug,
		IsPublic:       row.IsPublic,
		Rating:         row.Rating,
		CompletedCases: row.CompletedCases,
		CreatedAt:      row.CreatedAt,
		UpdatedAt:      row.UpdatedAt,
	}
}

func (r *accountantRepo) FindByUserID(ctx context.Context, userID uuid.UUID) (*domain.Accountant, error) {
	var row accountantRow
	query := `SELECT * FROM accountants WHERE user_id = $1`
	err := r.db.GetContext(ctx, &row, query, userID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	a := row.toDomain()
	return &a, nil
}

func (r *accountantRepo) FindBySlug(ctx context.Context, slug string) (*domain.Accountant, error) {
	var row accountantRow
	query := `SELECT * FROM accountants WHERE slug = $1`
	err := r.db.GetContext(ctx, &row, query, slug)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	a := row.toDomain()
	return &a, nil
}

func (r *accountantRepo) ListPublic(ctx context.Context, filter domain.AccountantFilter) ([]domain.Accountant, error) {
	var rows []accountantRow
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

	if err := r.db.SelectContext(ctx, &rows, query, args...); err != nil {
		return nil, err
	}
	accountants := make([]domain.Accountant, len(rows))
	for i, row := range rows {
		accountants[i] = row.toDomain()
	}
	return accountants, nil
}

