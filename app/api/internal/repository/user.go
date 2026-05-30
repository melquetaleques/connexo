package repository

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
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

// InviteToken representa o token gerado para convite de novos membros.
type InviteToken struct {
	Token     uuid.UUID  `db:"token" json:"token"`
	Email     string     `db:"email" json:"email"`
	FirmID    uuid.UUID  `db:"firm_id" json:"firm_id"`
	ExpiresAt time.Time  `db:"expires_at" json:"expires_at"`
	UsedAt    *time.Time `db:"used_at" json:"used_at"`
}

// GetFirmByOwnerID busca o escritório do advogado dono.
func (r *UserRepository) GetFirmByOwnerID(ctx context.Context, ownerID uuid.UUID) (*LawFirm, error) {
	var firm LawFirm
	query := `SELECT id, name, owner_id, created_at FROM law_firms WHERE owner_id = $1`
	err := r.db.GetContext(ctx, &firm, query, ownerID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return &firm, nil
}

// ListMembers lista os membros do escritório ao qual o usuário pertence.
func (r *UserRepository) ListMembers(ctx context.Context, userID uuid.UUID) ([]*User, error) {
	var users []*User
	query := `
		SELECT u.id, u.email, u.password, u.name, u.role, u.created_at
		FROM users u
		JOIN law_firm_members lfm ON u.id = lfm.user_id
		WHERE lfm.firm_id = (
			SELECT firm_id FROM law_firm_members WHERE user_id = $1 LIMIT 1
		)
		ORDER BY u.name ASC
	`
	err := r.db.SelectContext(ctx, &users, query, userID)
	if err != nil {
		return nil, err
	}
	return users, nil
}

// CreateInviteToken insere um novo token de convite.
func (r *UserRepository) CreateInviteToken(ctx context.Context, invite *InviteToken) error {
	if invite.Token == uuid.Nil {
		invite.Token = uuid.New()
	}
	if invite.ExpiresAt.IsZero() {
		invite.ExpiresAt = time.Now().Add(72 * time.Hour)
	}

	query := `
		INSERT INTO invite_tokens (token, email, firm_id, expires_at, used_at)
		VALUES (:token, :email, :firm_id, :expires_at, :used_at)
	`
	_, err := r.db.NamedExecContext(ctx, query, invite)
	return err
}

// GetInviteToken busca um convite pelo token.
func (r *UserRepository) GetInviteToken(ctx context.Context, token uuid.UUID) (*InviteToken, error) {
	var invite InviteToken
	query := `SELECT token, email, firm_id, expires_at, used_at FROM invite_tokens WHERE token = $1`
	err := r.db.GetContext(ctx, &invite, query, token)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return &invite, nil
}

// MarkInviteTokenUsed marca o token de convite como utilizado.
func (r *UserRepository) MarkInviteTokenUsed(ctx context.Context, token uuid.UUID) error {
	now := time.Now()
	query := `UPDATE invite_tokens SET used_at = $1 WHERE token = $2`
	_, err := r.db.ExecContext(ctx, query, now, token)
	return err
}

// AddMemberToFirm adiciona um usuário como membro de um escritório.
func (r *UserRepository) AddMemberToFirm(ctx context.Context, firmID uuid.UUID, userID uuid.UUID, role string) error {
	member := &LawFirmMember{
		FirmID:   firmID,
		UserID:   userID,
		Role:     role,
		JoinedAt: time.Now(),
	}
	query := `
		INSERT INTO law_firm_members (firm_id, user_id, role, joined_at)
		VALUES (:firm_id, :user_id, :role, :joined_at)
	`
	_, err := r.db.NamedExecContext(ctx, query, member)
	return err
}

// Accountant representa a entidade resumida de um contador para exibição no catálogo público.
type Accountant struct {
	ID        uuid.UUID `db:"id" json:"id"`
	Email     string    `db:"email" json:"email"`
	Name      string    `db:"name" json:"name"`
	Role      string    `db:"role" json:"role"`
	Specialty string    `db:"specialty" json:"specialty"`
	City      string    `db:"city" json:"city"`
	State     string    `db:"state" json:"state"`
}

// ListPublicAccountants busca e filtra contadores com especialidade, cidade, estado e busca de texto.
func (r *UserRepository) ListPublicAccountants(ctx context.Context, specialty, city, state, search string) ([]*Accountant, error) {
	var accountants []*Accountant
	query := `
		SELECT id, email, name, role, 
		       COALESCE(specialty, '') as specialty, 
		       COALESCE(city, '') as city, 
		       COALESCE(state, '') as state
		FROM users
		WHERE role = 'contador'
	`
	var args []interface{}
	placeholderIdx := 1

	if specialty != "" {
		query += fmt.Sprintf(" AND specialty = $%d", placeholderIdx)
		args = append(args, specialty)
		placeholderIdx++
	}
	if city != "" {
		query += fmt.Sprintf(" AND city = $%d", placeholderIdx)
		args = append(args, city)
		placeholderIdx++
	}
	if state != "" {
		query += fmt.Sprintf(" AND state = $%d", placeholderIdx)
		args = append(args, state)
		placeholderIdx++
	}
	if search != "" {
		query += fmt.Sprintf(" AND (name ILIKE $%d OR email ILIKE $%d)", placeholderIdx, placeholderIdx)
		args = append(args, "%"+search+"%")
		placeholderIdx++
	}

	query += " ORDER BY name ASC"

	err := r.db.SelectContext(ctx, &accountants, query, args...)
	if err != nil {
		return nil, err
	}
	return accountants, nil
}


