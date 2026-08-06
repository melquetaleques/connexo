package repository

import (
	"context"
	"database/sql"
	"errors"

	"app/api/internal/domain"
	"github.com/google/uuid"
)

type userRepo struct {
	db *DB
}

func NewDomainUserRepo(db *DB) domain.UserRepository {
	return &userRepo{db: db}
}

func (r *userRepo) Create(ctx context.Context, u *domain.User) error {
	query := `
		INSERT INTO users (id, email, password_hash, role, name, phone, created_at, updated_at)
		VALUES (:id, :email, :password_hash, :role, :name, :phone, :created_at, :updated_at)`
	_, err := r.db.NamedExecContext(ctx, query, u)
	return err
}

func (r *userRepo) FindByEmail(ctx context.Context, email string) (*domain.User, error) {
	var u domain.User
	query := `SELECT id, email, password_hash, role, name, phone, created_at, updated_at FROM users WHERE email = $1`
	err := r.db.GetContext(ctx, &u, query, email)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return &u, nil
}

func (r *userRepo) FindByID(ctx context.Context, id uuid.UUID) (*domain.User, error) {
	var u domain.User
	query := `SELECT id, email, password_hash, role, name, phone, created_at, updated_at FROM users WHERE id = $1`
	err := r.db.GetContext(ctx, &u, query, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return &u, nil
}

type lawyerRepo struct {
	db *DB
}

func NewLawyerRepository(db *DB) domain.LawyerRepository {
	return &lawyerRepo{db: db}
}

func (r *lawyerRepo) Create(ctx context.Context, l *domain.Lawyer) error {
	query := `
		INSERT INTO lawyers (id, user_id, oab_number, oab_state, office_name, subscription_status, subscription_expires_at, created_at)
		VALUES (:id, :user_id, :oab_number, :oab_state, :office_name, :subscription_status, :subscription_expires_at, :created_at)`
	_, err := r.db.NamedExecContext(ctx, query, l)
	return err
}

func (r *lawyerRepo) FindByUserID(ctx context.Context, userID uuid.UUID) (*domain.Lawyer, error) {
	var l domain.Lawyer
	query := `SELECT * FROM lawyers WHERE user_id = $1`
	err := r.db.GetContext(ctx, &l, query, userID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return &l, nil
}
