package handler

import (
	"context"

	"app/api/internal/domain"
	"app/api/internal/service"
)

const userContextKey contextKey = "user"

// contextWithClaims armazena as claims no contexto.
func contextWithClaims(ctx context.Context, c *service.Claims) context.Context {
	return context.WithValue(ctx, claimsKey, c)
}

// claimsFromContext recupera as claims do contexto.
func claimsFromContext(ctx context.Context) *service.Claims {
	c, _ := ctx.Value(claimsKey).(*service.Claims)
	return c
}

// contextWithUser armazena o usuário no contexto.
func contextWithUser(ctx context.Context, u *domain.User) context.Context {
	return context.WithValue(ctx, userContextKey, u)
}

// userFromContext recupera o usuário do contexto.
func userFromContext(ctx context.Context) *domain.User {
	u, _ := ctx.Value(userContextKey).(*domain.User)
	return u
}
