package service

import (
	"errors"
	"time"

	"app/api/internal/domain"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

// JWTMaker é a interface de geração e validação de tokens JWT.
type JWTMaker interface {
	Generate(userID uuid.UUID, role domain.Role) (string, error)
	Validate(token string) (*Claims, error)
}

// Claims são os dados embutidos no JWT.
type Claims struct {
	UserID uuid.UUID   `json:"sub"`
	Role   domain.Role `json:"role"`
	jwt.RegisteredClaims
}

// jwtMaker é a implementação concreta usando HMAC-SHA256.
type jwtMaker struct {
	secret []byte
	ttl    time.Duration
}

// NewJWTMaker cria um JWTMaker com o segredo e TTL fornecidos.
func NewJWTMaker(secret string, ttl time.Duration) JWTMaker {
	return &jwtMaker{secret: []byte(secret), ttl: ttl}
}

func (m *jwtMaker) Generate(userID uuid.UUID, role domain.Role) (string, error) {
	claims := &Claims{
		UserID: userID,
		Role:   role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(m.ttl)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			ID:        uuid.NewString(),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(m.secret)
}

func (m *jwtMaker) Validate(tokenStr string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenStr, &Claims{}, func(t *jwt.Token) (any, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("método de assinatura inválido")
		}
		return m.secret, nil
	})
	if err != nil {
		return nil, err
	}
	claims, ok := token.Claims.(*Claims)
	if !ok || !token.Valid {
		return nil, errors.New("token inválido")
	}
	return claims, nil
}
