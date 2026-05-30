package repository

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

// Link representa o vínculo entre um cliente e um contador.
type Link struct {
	ID           uuid.UUID `db:"id" json:"id"`
	ClientID     uuid.UUID `db:"client_id" json:"client_id"`
	AccountantID uuid.UUID `db:"accountant_id" json:"accountant_id"`
	Status       string    `db:"status" json:"status"` // solicitado, aceito, recusado
	CreatedAt    time.Time `db:"created_at" json:"created_at"`
	UpdatedAt    time.Time `db:"updated_at" json:"updated_at"`
}

// LinkRepository gerencia a persistência de vínculos.
type LinkRepository struct {
	db *sqlx.DB
}

// NewLinkRepository cria uma nova instância de LinkRepository.
func NewLinkRepository(db *sqlx.DB) *LinkRepository {
	return &LinkRepository{db: db}
}

// Create insere um novo vínculo no banco de dados.
func (r *LinkRepository) Create(ctx context.Context, link *Link) error {
	if link.ID == uuid.Nil {
		link.ID = uuid.New()
	}
	link.CreatedAt = time.Now()
	link.UpdatedAt = time.Now()

	query := `
		INSERT INTO client_accountant_links (id, client_id, accountant_id, status, created_at, updated_at)
		VALUES (:id, :client_id, :accountant_id, :status, :created_at, :updated_at)
	`
	_, err := r.db.NamedExecContext(ctx, query, link)
	return err
}

// Update atualiza o status de um vínculo.
func (r *LinkRepository) Update(ctx context.Context, link *Link) error {
	link.UpdatedAt = time.Now()
	query := `
		UPDATE client_accountant_links 
		SET status = :status, updated_at = :updated_at 
		WHERE id = :id
	`
	_, err := r.db.NamedExecContext(ctx, query, link)
	return err
}

// UpdateStatus atualiza apenas o status de um vínculo.
func (r *LinkRepository) UpdateStatus(ctx context.Context, id uuid.UUID, status string) error {
	query := `
		UPDATE client_accountant_links 
		SET status = $1, updated_at = $2 
		WHERE id = $3
	`
	_, err := r.db.ExecContext(ctx, query, status, time.Now(), id)
	return err
}

// GetProcessIDByClientID busca o process_id associado ao client_id na tabela processes.
func (r *LinkRepository) GetProcessIDByClientID(ctx context.Context, clientID uuid.UUID) (uuid.UUID, error) {
	var processID uuid.UUID
	query := `SELECT id FROM processes WHERE client_id = $1 LIMIT 1`
	err := r.db.GetContext(ctx, &processID, query, clientID)
	return processID, err
}

// FindByID busca um vínculo por ID.
func (r *LinkRepository) FindByID(ctx context.Context, id uuid.UUID) (*Link, error) {
	var link Link
	query := `
		SELECT id, client_id, accountant_id, status, created_at, updated_at 
		FROM client_accountant_links 
		WHERE id = $1
	`
	err := r.db.GetContext(ctx, &link, query, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return &link, nil
}

// FindByClientAndAccountant busca um vínculo entre um cliente e um contador.
func (r *LinkRepository) FindByClientAndAccountant(ctx context.Context, clientID, accountantID uuid.UUID) (*Link, error) {
	var link Link
	query := `
		SELECT id, client_id, accountant_id, status, created_at, updated_at 
		FROM client_accountant_links 
		WHERE client_id = $1 AND accountant_id = $2
		LIMIT 1
	`
	err := r.db.GetContext(ctx, &link, query, clientID, accountantID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return &link, nil
}
