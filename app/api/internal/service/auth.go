package service

import (
	"context"
	"errors"
	"strings"
	"time"

	"app/api/internal/domain"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

// ErrInvalidCredentials é retornado quando email/senha não conferem.
var ErrInvalidCredentials = errors.New("credenciais inválidas")

// ErrEmailAlreadyExists é retornado quando o email já está cadastrado.
var ErrEmailAlreadyExists = errors.New("email já cadastrado")

// ErrInvalidRegister é retornado quando os dados de cadastro são inválidos.
var ErrInvalidRegister = errors.New("dados de cadastro inválidos")

// ErrUnauthorized é retornado quando o usuário não tem permissão.
var ErrUnauthorized = errors.New("acesso não autorizado")

// generateSlug cria um slug a partir do nome para o perfil público.
func generateSlug(name string) string {
	slug := strings.Map(func(r rune) rune {
		if (r >= 'a' && r <= 'z') || (r >= '0' && r <= '9') {
			return r
		}
		if r == ' ' || r == '-' {
			return '-'
		}
		if r >= 'A' && r <= 'Z' {
			return r + 32 // lowercase
		}
		return -1
	}, name)
	slug = strings.Trim(slug, "-")
	if slug == "" {
		slug = "perfil"
	}
	return slug
}

// RegisterInput agrupa os dados de cadastro de um novo usuário.
type RegisterInput struct {
	Name  string
	Email string
	Phone string
	Pass  string
	Role  domain.Role
}

// AuthResult é retornado após login ou registro bem-sucedido.
type AuthResult struct {
	User  *domain.User
	Token string
}

// AuthService concentra os casos de uso de autenticação.
type AuthService struct {
	users       domain.UserRepository
	lawyers     domain.LawyerRepository
	accountants domain.AccountantRepository
	jwtMaker    JWTMaker
	audit       domain.AuditRepository
}

// NewAuthService constrói um AuthService.
func NewAuthService(
	users domain.UserRepository,
	lawyers domain.LawyerRepository,
	accountants domain.AccountantRepository,
	jwtMaker JWTMaker,
	audit domain.AuditRepository,
) *AuthService {
	return &AuthService{
		users:       users,
		lawyers:     lawyers,
		accountants: accountants,
		jwtMaker:    jwtMaker,
		audit:       audit,
	}
}

func isRegisterRole(role domain.Role) bool {
	switch role {
	case domain.RoleAdvogado, domain.RoleContador, domain.RoleCliente:
		return true
	default:
		return false
	}
}

// Register cria um novo usuário e, se for advogado, um perfil de Lawyer.
func (s *AuthService) Register(ctx context.Context, in RegisterInput, ip string) (*AuthResult, error) {
	in.Name = strings.TrimSpace(in.Name)
	in.Email = strings.ToLower(strings.TrimSpace(in.Email))
	in.Phone = strings.TrimSpace(in.Phone)
	if in.Name == "" || in.Email == "" || !strings.Contains(in.Email, "@") || len(in.Pass) < 8 || !isRegisterRole(in.Role) {
		return nil, ErrInvalidRegister
	}

	// Verificar duplicidade de e-mail
	existing, _ := s.users.FindByEmail(ctx, in.Email)
	if existing != nil {
		return nil, ErrEmailAlreadyExists
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(in.Pass), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	u := &domain.User{
		ID:           uuid.New(),
		Email:        in.Email,
		PasswordHash: string(hash),
		Role:         in.Role,
		Name:         in.Name,
		Phone:        in.Phone,
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}

	if err := s.users.Create(ctx, u); err != nil {
		return nil, err
	}

	// Criar perfil automaticamente conforme o tipo
	if in.Role == domain.RoleAdvogado {
		lawyer := &domain.Lawyer{
			ID:                 uuid.New(),
			UserID:             u.ID,
			SubscriptionStatus: "trial",
			CreatedAt:          time.Now(),
		}
		if err := s.lawyers.Create(ctx, lawyer); err != nil {
			return nil, err
		}
	}
	if in.Role == domain.RoleContador {
		slug := generateSlug(in.Name)
		acc := &domain.Accountant{
			ID:        uuid.New(),
			UserID:    u.ID,
			Slug:      slug,
			IsPublic:  false,
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		}
		if err := s.accountants.Create(ctx, acc); err != nil {
			return nil, err
		}
	}

	token, err := s.jwtMaker.Generate(u.ID, u.Role)
	if err != nil {
		return nil, err
	}

	_ = s.audit.Log(ctx, &domain.AuditLog{
		ID:        uuid.New(),
		UserID:    &u.ID,
		Action:    "user.register",
		IPAddress: ip,
		CreatedAt: time.Now(),
	})

	return &AuthResult{User: u, Token: token}, nil
}

// Login autentica um usuário por email e senha.
func (s *AuthService) Login(ctx context.Context, email, pass, ip string) (*AuthResult, error) {
	u, err := s.users.FindByEmail(ctx, email)
	if err != nil || u == nil {
		return nil, ErrInvalidCredentials
	}

	if err := bcrypt.CompareHashAndPassword([]byte(u.PasswordHash), []byte(pass)); err != nil {
		return nil, ErrInvalidCredentials
	}

	token, err := s.jwtMaker.Generate(u.ID, u.Role)
	if err != nil {
		return nil, err
	}

	_ = s.audit.Log(ctx, &domain.AuditLog{
		ID:        uuid.New(),
		UserID:    &u.ID,
		Action:    "user.login",
		IPAddress: ip,
		CreatedAt: time.Now(),
	})

	return &AuthResult{User: u, Token: token}, nil
}

// UpdateProfile atualiza nome e telefone do usuário autenticado.
func (s *AuthService) UpdateProfile(ctx context.Context, userID uuid.UUID, name, phone string) (*domain.User, error) {
	u, err := s.users.FindByID(ctx, userID)
	if err != nil || u == nil {
		return nil, ErrUnauthorized
	}
	name = strings.TrimSpace(name)
	if name == "" {
		return nil, ErrInvalidRegister
	}
	u.Name = name
	if phone != "" {
		u.Phone = strings.TrimSpace(phone)
	}
	u.UpdatedAt = time.Now()
	if err := s.users.Update(ctx, u); err != nil {
		return nil, err
	}
	return u, nil
}
