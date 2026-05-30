package handler

import (
	"encoding/json"
	"net/http"
	"strings"
	"sync"

	"golang.org/x/time/rate"
)

// IPRateLimiter manages per-IP rate limits using token buckets.
type IPRateLimiter struct {
	mu       sync.RWMutex
	visitors map[string]*rate.Limiter
	rate     rate.Limit
	burst    int
}

// NewIPRateLimiter creates a new IP-based rate limiter.
// r: requests per second, burst: maximum burst size.
func NewIPRateLimiter(r rate.Limit, burst int) *IPRateLimiter {
	return &IPRateLimiter{
		visitors: make(map[string]*rate.Limiter),
		rate:     r,
		burst:    burst,
	}
}

// GetLimiter returns the rate limiter for the given IP, creating one if needed.
func (l *IPRateLimiter) GetLimiter(ip string) *rate.Limiter {
	l.mu.RLock()
	limiter, exists := l.visitors[ip]
	l.mu.RUnlock()

	if exists {
		return limiter
	}

	l.mu.Lock()
	defer l.mu.Unlock()

	// Double-check after acquiring write lock
	if limiter, exists = l.visitors[ip]; exists {
		return limiter
	}

	limiter = rate.NewLimiter(l.rate, l.burst)
	l.visitors[ip] = limiter
	return limiter
}

// CleanupVisitors removes old entries from the visitors map.
// Should be called periodically in production.
func (l *IPRateLimiter) CleanupVisitors() {
	l.mu.Lock()
	defer l.mu.Unlock()

	// In a production system, we'd track last access time per visitor.
	// For MVP, we reset the map periodically.
	l.visitors = make(map[string]*rate.Limiter)
}

// RateLimiter is the main rate limiting middleware for the API.
type RateLimiter struct {
	global *IPRateLimiter // 60 req/min global
	auth   *IPRateLimiter // 10 req/min for auth endpoints
}

// NewRateLimiter creates a new RateLimiter with default limits.
func NewRateLimiter() *RateLimiter {
	return &RateLimiter{
		global: NewIPRateLimiter(1, 60),   // 60 requests per minute (1 per second, burst 60)
		auth:   NewIPRateLimiter(1, 10),    // 10 requests per minute for auth routes
	}
}

// extractIP extracts the client IP from the request, respecting proxy headers.
func extractIP(r *http.Request) string {
	// Try X-Forwarded-For first (for reverse proxy setups)
	if xff := r.Header.Get("X-Forwarded-For"); xff != "" {
		parts := strings.Split(xff, ",")
		return strings.TrimSpace(parts[0])
	}

	// Try X-Real-IP
	if xri := r.Header.Get("X-Real-IP"); xri != "" {
		return xri
	}

	// Fall back to RemoteAddr (remove port)
	addr := r.RemoteAddr
	if idx := strings.LastIndex(addr, ":"); idx != -1 {
		return addr[:idx]
	}
	return addr
}

// isAuthRoute checks if the request path is an auth endpoint.
func isAuthRoute(path string) bool {
	return path == "/api/auth/login" || path == "/api/auth/register" ||
		strings.HasPrefix(path, "/api/auth/login") ||
		strings.HasPrefix(path, "/api/auth/register")
}

// Middleware wraps an HTTP handler with rate limiting.
func (rl *RateLimiter) Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ip := extractIP(r)

		// Apply stricter rate limit for auth endpoints
		limiter := rl.global.GetLimiter(ip)

		if isAuthRoute(r.URL.Path) {
			authLimiter := rl.auth.GetLimiter(ip)
			if !authLimiter.Allow() {
				writeRateLimitResponse(w)
				return
			}
		}

		// Global rate limit check
		if !limiter.Allow() {
			writeRateLimitResponse(w)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// writeRateLimitResponse writes a 429 Too Many Requests response.
func writeRateLimitResponse(w http.ResponseWriter) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Retry-After", "60")
	w.WriteHeader(http.StatusTooManyRequests)
	json.NewEncoder(w).Encode(map[string]string{
		"error": "muitas requisições, tente novamente em breve",
	})
}

// CORSMiddleware wraps an HTTP handler with CORS headers.
func CORSMiddleware(next http.Handler, allowedOrigin string) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", allowedOrigin)
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
		w.Header().Set("Access-Control-Allow-Credentials", "true")
		w.Header().Set("Access-Control-Max-Age", "86400")

		// Handle preflight requests
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}
