package repository

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

// User representa a entidade de usuário no banco de dados.
type User struct {
	ID        uuid.UUID `db:"id"`
	Email     string    `db:"email"`
	Password  string    `db:"password"`
	Name      string    `db:"name"`
	Role      string    `db:"role"` // advogado, contador, cliente, admin
	CreatedAt time.Time `db:"created_at"`
}

// LawFirm representa o escritório de advocacia criado automaticamente para o advogado.
type LawFirm struct {
	ID        uuid.UUID `db:"id"`
	Name      string    `db:"name"`
	OwnerID   uuid.UUID `db:"owner_id"`
	CreatedAt time.Time `db:"created_at"`
}

// LawFirmMember representa o vínculo de um membro ao escritório.
type LawFirmMember struct {
	FirmID   uuid.UUID `db:"firm_id"`
	UserID   uuid.UUID `db:"user_id"`
	Role     string    `db:"role"`
	JoinedAt time.Time `db:"joined_at"`
}

// UserRepository gerencia a persistência de usuários.
type UserRepository struct {
	db *sqlx.DB
}

// NewUserRepository cria uma nova instância de UserRepository.
func NewUserRepository(db *sqlx.DB) *UserRepository {
	return &UserRepository{db: db}
}

// Create insere um novo usuário no banco de dados. Se a role for "advogado",
// ele cria automaticamente um law_firm correspondente e o vincula na law_firm_members como owner.
func (r *UserRepository) Create(ctx context.Context, user *User) error {
	if user.ID == uuid.Nil {
		user.ID = uuid.New()
	}
	user.CreatedAt = time.Now()

	// Inicia transação para garantir atomicidade
	tx, err := r.db.BeginTxx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()

	// 1. Inserir o usuário
	queryUser := `
		INSERT INTO users (id, email, password, name, role, created_at)
		VALUES (:id, :email, :password, :name, :role, :created_at)
	`
	_, err = tx.NamedExecContext(ctx, queryUser, user)
	if err != nil {
		return err
	}

	// 2. Se a role for 'advogado', criar a law_firm e vincular o owner
	if user.Role == "advogado" {
		firmID := uuid.New()
		firm := &LawFirm{
			ID:        firmID,
			Name:      "Escritório de " + user.Name,
			OwnerID:   user.ID,
			CreatedAt: time.Now(),
		}

		queryFirm := `
			INSERT INTO law_firms (id, name, owner_id, created_at)
			VALUES (:id, :name, :owner_id, :created_at)
		`
		_, err = tx.NamedExecContext(ctx, queryFirm, firm)
		if err != nil {
			return err
		}

		member := &LawFirmMember{
			FirmID:   firmID,
			UserID:   user.ID,
			Role:     "owner",
			JoinedAt: time.Now(),
		}

		queryMember := `
			INSERT INTO law_firm_members (firm_id, user_id, role, joined_at)
			VALUES (:firm_id, :user_id, :role, :joined_at)
		`
		_, err = tx.NamedExecContext(ctx, queryMember, member)
		if err != nil {
			return err
		}
	}

	// Commita a transação
	return tx.Commit()
}

// GetByID busca um usuário por ID.
func (r *UserRepository) GetByID(ctx context.Context, id uuid.UUID) (*User, error) {
	var user User
	query := `SELECT id, email, password, name, role, created_at FROM users WHERE id = $1`
	err := r.db.GetContext(ctx, &user, query, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}
