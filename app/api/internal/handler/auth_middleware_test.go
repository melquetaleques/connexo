package handler_test

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"app/api/internal/domain"
	"app/api/internal/handler"
	"app/api/internal/service"

	"github.com/google/uuid"
)

// TestAuthenticateMiddleware_JWTPath drives the shipped Router.AuthenticateMiddleware
// with the real JWTMaker used by login (HMAC JWT). Mock Bearer-UUID must fail.
func TestAuthenticateMiddleware_JWTPath(t *testing.T) {
	secret := "test-only-jwt-secret-not-for-production"
	maker := service.NewJWTMaker(secret, time.Hour)
	r := handler.NewRouter(nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, maker)

	var gotUserID string
	protected := r.AuthenticateMiddleware(func(w http.ResponseWriter, req *http.Request) {
		gotUserID = req.Header.Get("X-Authenticated-User-ID")
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_ = json.NewEncoder(w).Encode(map[string]string{"ok": "true"})
	})

	t.Run("missing token returns 401", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/api/adv/subscription", nil)
		rec := httptest.NewRecorder()
		protected(rec, req)
		if rec.Code != http.StatusUnauthorized {
			t.Fatalf("status = %d, want 401", rec.Code)
		}
	})

	t.Run("invalid token returns 401", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/api/adv/subscription", nil)
		req.Header.Set("Authorization", "Bearer not-a-valid-jwt")
		rec := httptest.NewRecorder()
		protected(rec, req)
		if rec.Code != http.StatusUnauthorized {
			t.Fatalf("status = %d, want 401", rec.Code)
		}
	})

	t.Run("raw UUID bearer is rejected", func(t *testing.T) {
		// Legacy mock path accepted Bearer <uuid>; real JWT path must reject.
		raw := uuid.New().String()
		req := httptest.NewRequest(http.MethodGet, "/api/adv/subscription", nil)
		req.Header.Set("Authorization", "Bearer "+raw)
		rec := httptest.NewRecorder()
		protected(rec, req)
		if rec.Code != http.StatusUnauthorized {
			t.Fatalf("status = %d, want 401 (UUID mock must not work)", rec.Code)
		}
	})

	t.Run("valid JWT returns 200 and sets user id", func(t *testing.T) {
		uid := uuid.New()
		token, err := maker.Generate(uid, domain.RoleAdvogado)
		if err != nil {
			t.Fatalf("Generate: %v", err)
		}
		gotUserID = ""
		req := httptest.NewRequest(http.MethodGet, "/api/adv/subscription", nil)
		req.Header.Set("Authorization", "Bearer "+token)
		rec := httptest.NewRecorder()
		protected(rec, req)
		if rec.Code != http.StatusOK {
			t.Fatalf("status = %d, want 200 body=%s", rec.Code, rec.Body.String())
		}
		if gotUserID != uid.String() {
			t.Fatalf("user id header = %q, want %q", gotUserID, uid.String())
		}
	})
}

// TestJWTAuth_ShippedMiddleware exercises the standalone JWTAuth used by /api/auth/me.
func TestJWTAuth_ShippedMiddleware(t *testing.T) {
	secret := "test-only-jwt-secret-not-for-production"
	maker := service.NewJWTMaker(secret, time.Hour)

	h := handler.JWTAuth(maker, func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte(`{"ok":true}`))
	})

	req := httptest.NewRequest(http.MethodGet, "/api/auth/me", nil)
	rec := httptest.NewRecorder()
	h(rec, req)
	if rec.Code != http.StatusUnauthorized {
		t.Fatalf("no token: status = %d, want 401", rec.Code)
	}

	uid := uuid.New()
	token, err := maker.Generate(uid, domain.RoleCliente)
	if err != nil {
		t.Fatal(err)
	}
	req = httptest.NewRequest(http.MethodGet, "/api/auth/me", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	rec = httptest.NewRecorder()
	h(rec, req)
	if rec.Code != http.StatusOK {
		t.Fatalf("valid jwt: status = %d, want 200", rec.Code)
	}
}
