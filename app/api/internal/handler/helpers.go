package handler

import (
	"encoding/json"
	"net/http"
	"reflect"

	"app/api/internal/domain"
)

type contextKey string

const claimsKey contextKey = "claims"

func respond(w http.ResponseWriter, status int, body any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(normalizeEmptySlice(body))
}

// normalizeEmptySlice troca um slice nil por um slice vazio.
//
// sqlx deixa o slice nil quando a query não retorna linhas, e encoding/json
// serializa isso como `null`. O frontend itera direto sobre as respostas de
// lista (.filter, .map), então um `null` vira erro de runtime na tela em vez
// de estado vazio. Normalizar aqui garante `[]` em toda resposta de lista.
func normalizeEmptySlice(body any) any {
	if body == nil {
		return body
	}
	v := reflect.ValueOf(body)
	if v.Kind() == reflect.Slice && v.IsNil() {
		return reflect.MakeSlice(v.Type(), 0, 0).Interface()
	}
	return body
}

func respondErr(w http.ResponseWriter, status int, msg string) {
	respond(w, status, map[string]string{"error": msg})
}

func roleFromString(s string) domain.Role {
	return domain.Role(s)
}
