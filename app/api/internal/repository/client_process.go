package repository

import (
	"context"
	"database/sql"
	"errors"

	"app/api/internal/domain"
	"github.com/google/uuid"
)

type clientRepo struct {
	db *DB
}

func NewClientRepository(db *DB) domain.ClientRepository {
	return &clientRepo{db: db}
}

func (r *clientRepo) Create(ctx context.Context, c *domain.Client) error {
	query := `
		INSERT INTO clients (id, lawyer_id, user_id, name, document, email, phone, type, status, notes, created_at, updated_at)
		VALUES (:id, :lawyer_id, :user_id, :name, :document, :email, :phone, :type, :status, :notes, :created_at, :updated_at)`
	_, err := r.db.NamedExecContext(ctx, query, c)
	return err
}

func (r *clientRepo) Update(ctx context.Context, c *domain.Client) error {
	query := `
		UPDATE clients SET 
			name = :name, document = :document, email = :email, phone = :phone, 
			type = :type, status = :status, notes = :notes, updated_at = :updated_at
		WHERE id = :id`
	_, err := r.db.NamedExecContext(ctx, query, c)
	return err
}

func (r *clientRepo) FindByID(ctx context.Context, id uuid.UUID) (*domain.Client, error) {
	var c domain.Client
	query := `SELECT * FROM clients WHERE id = $1`
	err := r.db.GetContext(ctx, &c, query, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return &c, nil
}

func (r *clientRepo) ListByUser(ctx context.Context, userID uuid.UUID) ([]domain.Client, error) {
	var clients []domain.Client
	query := `SELECT * FROM clients WHERE user_id = $1 ORDER BY created_at DESC`
	err := r.db.SelectContext(ctx, &clients, query, userID)
	return clients, err
}

func (r *clientRepo) ListByLawyer(ctx context.Context, lawyerID uuid.UUID) ([]domain.Client, error) {
	var clients []domain.Client
	query := `SELECT * FROM clients WHERE lawyer_id = $1 ORDER BY name ASC`
	err := r.db.SelectContext(ctx, &clients, query, lawyerID)
	return clients, err
}

func (r *clientRepo) Delete(ctx context.Context, id uuid.UUID) error {
	query := `DELETE FROM clients WHERE id = $1`
	_, err := r.db.ExecContext(ctx, query, id)
	return err
}

type processRepo struct {
	db *DB
}

func NewProcessRepository(db *DB) domain.ProcessRepository {
	return &processRepo{db: db}
}

func (r *processRepo) Create(ctx context.Context, p *domain.Process) error {
	query := `
		INSERT INTO processes (id, lawyer_id, client_id, number, type, court, stage, status, created_at, updated_at)
		VALUES (:id, :lawyer_id, :client_id, :number, :type, :court, :stage, :status, :created_at, :updated_at)`
	_, err := r.db.NamedExecContext(ctx, query, p)
	return err
}

func (r *processRepo) Update(ctx context.Context, p *domain.Process) error {
	query := `
		UPDATE processes SET 
			number = :number, type = :type, court = :court, stage = :stage, status = :status, updated_at = :updated_at
		WHERE id = :id`
	_, err := r.db.NamedExecContext(ctx, query, p)
	return err
}

func (r *processRepo) FindByID(ctx context.Context, id uuid.UUID) (*domain.Process, error) {
	var p domain.Process
	query := `SELECT * FROM processes WHERE id = $1`
	err := r.db.GetContext(ctx, &p, query, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return &p, nil
}

func (r *processRepo) ListByLawyer(ctx context.Context, lawyerID uuid.UUID) ([]domain.Process, error) {
	var processes []domain.Process
	query := `SELECT * FROM processes WHERE lawyer_id = $1 ORDER BY updated_at DESC`
	err := r.db.SelectContext(ctx, &processes, query, lawyerID)
	return processes, err
}

func (r *processRepo) ListByClient(ctx context.Context, clientID uuid.UUID) ([]domain.Process, error) {
	var processes []domain.Process
	query := `SELECT * FROM processes WHERE client_id = $1 ORDER BY updated_at DESC`
	err := r.db.SelectContext(ctx, &processes, query, clientID)
	return processes, err
}
