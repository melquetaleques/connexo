package handler

import (
	"net/http"
	"strings"

	"app/api/internal/domain"
	"app/api/internal/service"
)

// JWTAuth wraps a handler requiring a valid JWT Bearer token.
func JWTAuth(jwtMaker service.JWTMaker, next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		auth := r.Header.Get("Authorization")
		if !strings.HasPrefix(auth, "Bearer ") {
			respondErr(w, http.StatusUnauthorized, "token ausente")
			return
		}
		token := strings.TrimSpace(strings.TrimPrefix(auth, "Bearer "))
		if token == "" {
			respondErr(w, http.StatusUnauthorized, "token ausente")
			return
		}
		claims, err := jwtMaker.Validate(token)
		if err != nil {
			respondErr(w, http.StatusUnauthorized, "token inválido")
			return
		}
		// Keep internal header in sync for handlers that still read it.
		r.Header.Set("X-Authenticated-User-ID", claims.UserID.String())
		ctx := contextWithClaims(r.Context(), claims)
		next(w, r.WithContext(ctx))
	}
}

// JWTAuthUser faz o mesmo que JWTAuth e ainda carrega o usuário do banco no
// contexto, para os handlers que operam sobre *domain.User.
func JWTAuthUser(jwtMaker service.JWTMaker, users domain.UserRepository, next http.HandlerFunc) http.HandlerFunc {
	return JWTAuth(jwtMaker, func(w http.ResponseWriter, r *http.Request) {
		claims := claimsFromContext(r.Context())
		if claims == nil {
			respondErr(w, http.StatusUnauthorized, "token inválido")
			return
		}

		user, err := users.FindByID(r.Context(), claims.UserID)
		if err != nil {
			respondErr(w, http.StatusInternalServerError, "erro ao carregar usuário")
			return
		}
		if user == nil {
			respondErr(w, http.StatusUnauthorized, "usuário não encontrado")
			return
		}

		next(w, r.WithContext(contextWithUser(r.Context(), user)))
	})
}
