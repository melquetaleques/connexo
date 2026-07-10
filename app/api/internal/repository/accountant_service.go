package repository

import (
	"context"
	"database/sql"
	"errors"

	"app/api/internal/domain"
	"github.com/google/uuid"
)

type accountantServiceRepo struct {
	db *DB
}

func NewAccountantServiceRepository(db *DB) domain.AccountantServiceRepository {
	return &accountantServiceRepo{db: db}
}

func (r *accountantServiceRepo) ListByAccountant(ctx context.Context, accountantID uuid.UUID) ([]domain.AccountantService, error) {
	var services []domain.AccountantService
	query := `SELECT * FROM accountant_services WHERE accountant_id = $1 ORDER BY created_at DESC`
	err := r.db.SelectContext(ctx, &services, query, accountantID)
	if err != nil {
		return nil, err
	}
	if services == nil {
		services = []domain.AccountantService{}
	}
	return services, nil
}

func (r *accountantServiceRepo) Create(ctx context.Context, s *domain.AccountantService) error {
	query := `
		INSERT INTO accountant_services (id, accountant_id, title, description, icon, areas, price_from, avg_days, is_visible, created_at)
		VALUES (:id, :accountant_id, :title, :description, :icon, :areas, :price_from, :avg_days, :is_visible, :created_at)`
	_, err := r.db.NamedExecContext(ctx, query, s)
	return err
}

func (r *accountantServiceRepo) Update(ctx context.Context, s *domain.AccountantService) error {
	query := `
		UPDATE accountant_services SET
			title = :title, description = :description, icon = :icon, areas = :areas,
			price_from = :price_from, avg_days = :avg_days, is_visible = :is_visible
		WHERE id = :id`
	_, err := r.db.NamedExecContext(ctx, query, s)
	return err
}

func (r *accountantServiceRepo) Delete(ctx context.Context, id uuid.UUID) error {
	result, err := r.db.ExecContext(ctx, `DELETE FROM accountant_services WHERE id = $1`, id)
	if err != nil {
		return err
	}
	n, _ := result.RowsAffected()
	if n == 0 {
		return errors.New("serviço não encontrado")
	}
	return nil
}

// NoRows helper
func noRows(err error) bool {
	return errors.Is(err, sql.ErrNoRows)
}
