package handler

import (
	"encoding/json"
	"net/http"

	"app/api/internal/domain"
)

type contextKey string

const claimsKey contextKey = "claims"

func respond(w http.ResponseWriter, status int, body any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(body)
}

func respondErr(w http.ResponseWriter, status int, msg string) {
	respond(w, status, map[string]string{"error": msg})
}

func roleFromString(s string) domain.Role {
	return domain.Role(s)
}
