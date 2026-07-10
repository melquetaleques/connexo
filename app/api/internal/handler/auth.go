package handler

import (
	"encoding/json"
	"net/http"

	"app/api/internal/service"
)

// AuthHandler expõe os endpoints de autenticação.
type AuthHandler struct {
	svc *service.AuthService
}

// NewAuthHandler constrói um AuthHandler.
func NewAuthHandler(svc *service.AuthService) *AuthHandler {
	return &AuthHandler{svc: svc}
}

// Register godoc
// POST /api/auth/register
func (h *AuthHandler) Register(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Name  string `json:"name"`
		Email string `json:"email"`
		Phone string `json:"phone"`
		Pass  string `json:"password"`
		Role  string `json:"role"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		respondErr(w, http.StatusBadRequest, "corpo inválido")
		return
	}

	result, err := h.svc.Register(r.Context(), service.RegisterInput{
		Name:  body.Name,
		Email: body.Email,
		Phone: body.Phone,
		Pass:  body.Pass,
		Role:  roleFromString(body.Role),
	}, r.RemoteAddr)
	if err != nil {
		switch err {
		case service.ErrEmailAlreadyExists:
			respondErr(w, http.StatusConflict, err.Error())
		default:
			respondErr(w, http.StatusInternalServerError, "erro interno")
		}
		return
	}

	respond(w, http.StatusCreated, map[string]any{
		"token": result.Token,
		"user": map[string]any{
			"id":    result.User.ID,
			"name":  result.User.Name,
			"email": result.User.Email,
			"role":  result.User.Role,
		},
	})
}

// Login godoc
// POST /api/auth/login
func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Email string `json:"email"`
		Pass  string `json:"password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		respondErr(w, http.StatusBadRequest, "corpo inválido")
		return
	}

	result, err := h.svc.Login(r.Context(), body.Email, body.Pass, r.RemoteAddr)
	if err != nil {
		respondErr(w, http.StatusUnauthorized, "credenciais inválidas")
		return
	}

	respond(w, http.StatusOK, map[string]any{
		"token": result.Token,
		"user": map[string]any{
			"id":    result.User.ID,
			"name":  result.User.Name,
			"email": result.User.Email,
			"role":  result.User.Role,
		},
	})
}

// Me godoc
// GET /api/auth/me
func (h *AuthHandler) Me(w http.ResponseWriter, r *http.Request) {
	claims := claimsFromContext(r.Context())
	respond(w, http.StatusOK, map[string]any{
		"id":   claims.UserID,
		"role": claims.Role,
	})
}
