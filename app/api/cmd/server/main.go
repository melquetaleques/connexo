package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"app/api/internal/handler"
	"app/api/internal/repository"
	"app/api/internal/service"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

func main() {
	// Read environment variables with defaults
	databaseURL := os.Getenv("CONNEXO_DATABASE_URL")
	if databaseURL == "" {
		databaseURL = os.Getenv("DATABASE_URL")
	}
	if databaseURL == "" {
		databaseURL = "postgres://postgres:postgrespassword@localhost:5432/connexo?sslmode=disable"
	}

	httpAddr := os.Getenv("CONNEXO_HTTP_ADDR")
	if httpAddr == "" {
		httpAddr = ":8080"
	}

	// Connect to database
	db, err := sqlx.Connect("postgres", databaseURL)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	// Configure connection pool
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(10)
	db.SetConnMaxLifetime(5 * time.Minute)

	// Initialize repositories
	userRepo := repository.NewUserRepository(db)

	docRepo, err := repository.NewDocumentRepository(db)
	if err != nil {
		log.Printf("Warning: MinIO not available, document features disabled: %v", err)
		docRepo = nil
	}

	postRepo := repository.NewPostRepository(db)
	notificationRepo := repository.NewNotificationRepository(db)
	linkRepo := repository.NewLinkRepository(db)
	processEventsRepo := repository.NewProcessEventsRepository(db)
	deliverableRepo, err := repository.NewDeliverableRepository(db)
	if err != nil {
		log.Printf("Warning: Deliverable repository initialization error: %v", err)
		deliverableRepo = nil
	}
	reviewRepo := repository.NewReviewRepository(db)

	mediaRepo, err := repository.NewMediaRepository()
	if err != nil {
		log.Printf("Warning: Media repository initialization error: %v", err)
		mediaRepo = nil
	}

	lgpdRepo := repository.NewLGPDRepository(db)

	// Initialize services
	linkService := service.NewLinkService(
		linkRepo,
		notificationRepo,
		userRepo,
		processEventsRepo,
		lgpdRepo,
	)

	// New-arch domain repos for services
	repoDB := &repository.DB{DB: db}

	// Run schema migrations using the canonical schema
	if err := repoDB.AutoMigrate(); err != nil {
		log.Fatalf("Migration failed: %v", err)
	}
	domainUserRepo := repository.NewDomainUserRepo(repoDB)
	domainLawyerRepo := repository.NewLawyerRepository(repoDB)
	domainAccountantRepo := repository.NewAccountantRepository(repoDB)
	domainClientRepo := repository.NewClientRepository(repoDB)
	domainProcessRepo := repository.NewProcessRepository(repoDB)
	domainAuditRepo := repository.NewAuditRepository(repoDB)

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		if os.Getenv("APP_ENV") == "production" {
			log.Fatal("JWT_SECRET must be set in production")
		}
		jwtSecret = "connexo-dev-secret"
	}
	jwtMaker := service.NewJWTMaker(jwtSecret, 24*time.Hour)

	authSvc := service.NewAuthService(domainUserRepo, domainLawyerRepo, domainAccountantRepo, jwtMaker, domainAuditRepo)
	authHandler := handler.NewAuthHandler(authSvc)

	lawyerSvc := service.NewLawyerService(domainLawyerRepo, domainClientRepo, domainProcessRepo, domainAuditRepo)
	lawyerHandler := handler.NewLawyerHandler(lawyerSvc)

	// Initialize router
	router := handler.NewRouter(
		userRepo,
		postRepo,
		linkRepo,
		notificationRepo,
		docRepo,
		deliverableRepo,
		processEventsRepo,
		reviewRepo,
		linkService,
		mediaRepo,
		lgpdRepo,
	)

	// Create mux and register routes
	mux := http.NewServeMux()

	// Health check (no auth required, no rate limit)
	mux.HandleFunc("/api/health", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}
		// Check database connectivity
		dbStatus := "ok"
		if err := db.PingContext(r.Context()); err != nil {
			dbStatus = fmt.Sprintf("error: %v", err)
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		fmt.Fprintf(w, `{"status":"ok","database":"%s","timestamp":"%s"}`, dbStatus, time.Now().Format(time.RFC3339))
	})

	// Auth routes
	mux.HandleFunc("/api/auth/register", authHandler.Register)
	mux.HandleFunc("/api/auth/login", authHandler.Login)
	mux.HandleFunc("/api/auth/me", handler.JWTAuth(jwtMaker, authHandler.Me))

	// Lawyer routes (JWT protected)
	jwtMW := func(h http.HandlerFunc) http.HandlerFunc { return handler.JWTAuth(jwtMaker, h) }
	mux.HandleFunc("/api/adv/clients", jwtMW(lawyerHandler.ListClients))
	mux.HandleFunc("/api/adv/clients/", jwtMW(lawyerHandler.GetClient))
	mux.HandleFunc("/api/adv/processes", jwtMW(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			lawyerHandler.CreateProcess(w, r)
		} else {
			lawyerHandler.ListProcesses(w, r)
		}
	}))
	mux.HandleFunc("/api/adv/dashboard", jwtMW(lawyerHandler.Dashboard))

	router.LawyerHandler = lawyerHandler

	// Register all other routes
	router.RegisterRoutes(mux)

	// Wrap with rate limiter and CORS
	var h http.Handler = mux

	// Rate limiting
	rateLimiter := handler.NewRateLimiter()
	h = rateLimiter.Middleware(h)

	// CORS
	allowedOrigin := os.Getenv("CORS_ALLOWED_ORIGIN")
	if allowedOrigin == "" {
		allowedOrigin = "*"
	}
	h = handler.CORSMiddleware(h, allowedOrigin)

	// Start server
	server := &http.Server{
		Addr:         httpAddr,
		Handler:      h,
		ReadTimeout:  30 * time.Second,
		WriteTimeout: 30 * time.Second,
		IdleTimeout:  120 * time.Second,
	}

	log.Printf("Connexo API starting on %s", httpAddr)
	if err := server.ListenAndServe(); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}

// runMigrations applies SQL migration files in order.
func runMigrations(db *sql.DB) error {
	migrations := []struct {
		Name string
		SQL  string
	}{
		// Migrations are organized in order of application.
		// Each migration should be idempotent (use IF NOT EXISTS / IF EXISTS).
		{
			Name: "01_initial_schema",
			SQL: `
				CREATE TABLE IF NOT EXISTS users (
					id UUID PRIMARY KEY,
					email TEXT UNIQUE NOT NULL,
					password TEXT NOT NULL,
					name TEXT NOT NULL,
					role TEXT NOT NULL DEFAULT 'cliente',
					created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
				);
			`,
		},
		{
			Name: "02_law_firms_and_posts",
			SQL: `
				CREATE TABLE IF NOT EXISTS law_firms (
					id UUID PRIMARY KEY,
					name TEXT NOT NULL,
					owner_id UUID REFERENCES users(id),
					created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
				);
				CREATE TABLE IF NOT EXISTS law_firm_members (
					firm_id UUID REFERENCES law_firms(id),
					user_id UUID REFERENCES users(id),
					role TEXT NOT NULL DEFAULT 'member',
					joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
					PRIMARY KEY (firm_id, user_id)
				);
				CREATE TABLE IF NOT EXISTS posts (
					id UUID PRIMARY KEY,
					accountant_id UUID REFERENCES users(id),
					title TEXT NOT NULL,
					content TEXT NOT NULL,
					tag TEXT NOT NULL DEFAULT 'geral',
					cover_url TEXT NOT NULL DEFAULT '',
					excerpt TEXT NOT NULL DEFAULT '',
					created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
				);
			`,
		},
		{
			Name: "03_links_and_events",
			SQL: `
				CREATE TABLE IF NOT EXISTS process_links (
					id UUID PRIMARY KEY,
					process_id UUID NOT NULL,
					client_id UUID REFERENCES users(id),
					accountant_id UUID REFERENCES users(id),
					status TEXT NOT NULL DEFAULT 'solicitado',
					created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
					updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
				);
				CREATE TABLE IF NOT EXISTS process_events (
					id UUID PRIMARY KEY,
					process_id UUID NOT NULL,
					event_type TEXT NOT NULL,
					description TEXT NOT NULL DEFAULT '',
					actor_id UUID REFERENCES users(id),
					created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
				);
			`,
		},
	}

	for _, m := range migrations {
		if _, err := db.Exec(m.SQL); err != nil {
			return fmt.Errorf("migration %s failed: %w", m.Name, err)
		}
		log.Printf("Migration %s applied successfully", m.Name)
	}

	return nil
}
