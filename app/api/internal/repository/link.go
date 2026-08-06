package repository

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

// Link representa o vínculo entre um processo e um contador.
//
// ClientID e AccountantID apontam para users(id) — são os atores notificados e
// autorizados pelo vínculo. ProcessID é obrigatório: o vínculo é sempre por
// processo, de modo que um cliente pode escolher contadores diferentes para
// processos diferentes.
type Link struct {
	ID           uuid.UUID `db:"id" json:"id"`
	ProcessID    uuid.UUID `db:"process_id" json:"process_id"`
	ClientID     uuid.UUID `db:"client_id" json:"client_id"`
	AccountantID uuid.UUID `db:"accountant_id" json:"accountant_id"`
	Status       string    `db:"status" json:"status"`
	CreatedAt    time.Time `db:"created_at" json:"created_at"`
	UpdatedAt    time.Time `db:"updated_at" json:"updated_at"`
}

const linkColumns = `id, process_id, client_id, accountant_id, status, created_at, updated_at`

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
		INSERT INTO process_accountant_links (id, process_id, client_id, accountant_id, status, created_at, updated_at)
		VALUES (:id, :process_id, :client_id, :accountant_id, :status, :created_at, :updated_at)
	`
	_, err := r.db.NamedExecContext(ctx, query, link)
	return err
}

// Update atualiza o status de um vínculo.
func (r *LinkRepository) Update(ctx context.Context, link *Link) error {
	link.UpdatedAt = time.Now()
	query := `
		UPDATE process_accountant_links
		SET status = :status, updated_at = :updated_at
		WHERE id = :id
	`
	_, err := r.db.NamedExecContext(ctx, query, link)
	return err
}

// UpdateStatus atualiza apenas o status de um vínculo.
func (r *LinkRepository) UpdateStatus(ctx context.Context, id uuid.UUID, status string) error {
	query := `
		UPDATE process_accountant_links
		SET status = $1, updated_at = $2
		WHERE id = $3
	`
	_, err := r.db.ExecContext(ctx, query, status, time.Now(), id)
	return err
}

// FindByID busca um vínculo pelo seu ID.
func (r *LinkRepository) FindByID(ctx context.Context, id uuid.UUID) (*Link, error) {
	var link Link
	query := `SELECT ` + linkColumns + ` FROM process_accountant_links WHERE id = $1`
	err := r.db.GetContext(ctx, &link, query, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return &link, nil
}

// FindByProcessAndAccountant busca o vínculo de um processo com um contador.
func (r *LinkRepository) FindByProcessAndAccountant(ctx context.Context, processID, accountantID uuid.UUID) (*Link, error) {
	var link Link
	query := `
		SELECT ` + linkColumns + `
		FROM process_accountant_links
		WHERE process_id = $1 AND accountant_id = $2
		LIMIT 1
	`
	err := r.db.GetContext(ctx, &link, query, processID, accountantID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return &link, nil
}

// FindVigenteByProcess busca o vínculo vigente de um processo, se houver.
//
// Vigente = qualquer estado que ainda concede ou pode conceder acesso ao
// contador. Vínculos recusados, cancelados ou concluídos não são vigentes.
func (r *LinkRepository) FindVigenteByProcess(ctx context.Context, processID uuid.UUID) (*Link, error) {
	var link Link
	query := `
		SELECT ` + linkColumns + `
		FROM process_accountant_links
		WHERE process_id = $1
		  AND status NOT IN ('recusado','cancelado','concluido')
		ORDER BY created_at DESC
		LIMIT 1
	`
	err := r.db.GetContext(ctx, &link, query, processID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return &link, nil
}

// ListByAccountant lista os vínculos de um contador.
func (r *LinkRepository) ListByAccountant(ctx context.Context, accountantID uuid.UUID) ([]Link, error) {
	var links []Link
	query := `
		SELECT ` + linkColumns + `
		FROM process_accountant_links
		WHERE accountant_id = $1
		ORDER BY created_at DESC
	`
	err := r.db.SelectContext(ctx, &links, query, accountantID)
	return links, err
}

// ListByClient lista os vínculos de um cliente.
func (r *LinkRepository) ListByClient(ctx context.Context, clientID uuid.UUID) ([]Link, error) {
	var links []Link
	query := `
		SELECT ` + linkColumns + `
		FROM process_accountant_links
		WHERE client_id = $1
		ORDER BY created_at DESC
	`
	err := r.db.SelectContext(ctx, &links, query, clientID)
	return links, err
}
