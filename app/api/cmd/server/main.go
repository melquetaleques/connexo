package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	migrations "app/api/db"
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

	// Apply pending SQL migrations (db/migrations/*.sql) before anything else
	// touches the schema.
	migrationCtx, cancelMigrations := context.WithTimeout(context.Background(), 2*time.Minute)
	applied, err := migrations.Migrate(migrationCtx, db)
	cancelMigrations()
	if err != nil {
		log.Fatalf("Migration failed: %v", err)
	}
	if len(applied) > 0 {
		log.Printf("Applied %d migration(s): %v", len(applied), applied)
	} else {
		log.Print("Schema up to date, no migrations applied")
	}

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

	domainUserRepo := repository.NewDomainUserRepo(repoDB)
	domainLawyerRepo := repository.NewLawyerRepository(repoDB)
	domainAccountantRepo := repository.NewAccountantRepository(repoDB)
	domainClientRepo := repository.NewClientRepository(repoDB)
	domainProcessRepo := repository.NewProcessRepository(repoDB)
	domainAuditRepo := repository.NewAuditRepository(repoDB)
	domainLinkRepo := repository.NewLinkRepositoryDomain(repoDB)

	// JWT secret: JWT_SECRET preferred; CONNEXO_JWT_SECRET accepted as alias.
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = os.Getenv("CONNEXO_JWT_SECRET")
	}
	if jwtSecret == "" {
		if os.Getenv("APP_ENV") == "production" {
			log.Fatal("JWT_SECRET (or CONNEXO_JWT_SECRET) must be set in production")
		}
		jwtSecret = "connexo-dev-secret"
	}
	jwtMaker := service.NewJWTMaker(jwtSecret, 24*time.Hour)

	authSvc := service.NewAuthService(domainUserRepo, domainLawyerRepo, domainAccountantRepo, jwtMaker, domainAuditRepo)
	authHandler := handler.NewAuthHandler(authSvc)

	lawyerSvc := service.NewLawyerService(domainLawyerRepo, domainClientRepo, domainProcessRepo, domainAuditRepo)
	lawyerHandler := handler.NewLawyerHandler(lawyerSvc)

	// Initialize router (JWT required on all protected product routes)
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
		jwtMaker,
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
	mux.HandleFunc("GET /api/adv/clients", jwtMW(lawyerHandler.ListClients))
	mux.HandleFunc("POST /api/adv/clients", jwtMW(lawyerHandler.CreateClient))
	mux.HandleFunc("GET /api/adv/clients/{id}", jwtMW(lawyerHandler.GetClient))
	mux.HandleFunc("/api/adv/processes", jwtMW(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			lawyerHandler.CreateProcess(w, r)
		} else {
			lawyerHandler.ListProcesses(w, r)
		}
	}))
	mux.HandleFunc("GET /api/adv/processes/{id}", jwtMW(lawyerHandler.GetProcess))
	mux.HandleFunc("/api/adv/dashboard", jwtMW(lawyerHandler.Dashboard))
	mux.HandleFunc("GET /api/adv/processes/{id}/timeline", jwtMW(router.HandleProcessTimeline))

	// userMW carrega o usuário do banco no contexto, para os handlers que
	// operam sobre *domain.User.
	userMW := func(h http.HandlerFunc) http.HandlerFunc {
		return handler.JWTAuthUser(jwtMaker, domainUserRepo, h)
	}

	// Client panel routes
	clientHandler := handler.NewClientHandler(
		domainProcessRepo,
		domainLinkRepo,
		domainClientRepo,
		domainUserRepo,
		linkService,
	)
	mux.HandleFunc("GET /api/cli/processes", userMW(clientHandler.ListProcesses))
	mux.HandleFunc("POST /api/cli/vincular-contador", userMW(clientHandler.BindAccountant))
	mux.HandleFunc("GET /api/cli/notifications", jwtMW(router.HandleListNotifications))

	// Accountant panel routes
	accountantHandler := handler.NewAccountantHandler(
		domainAccountantRepo,
		domainClientRepo,
		domainLinkRepo,
		domainProcessRepo,
	)
	mux.HandleFunc("GET /api/acc/dashboard", userMW(accountantHandler.Dashboard))
	mux.HandleFunc("GET /api/acc/profile", userMW(accountantHandler.GetProfile))
	mux.HandleFunc("PUT /api/acc/profile", userMW(accountantHandler.UpdateProfile))
	mux.HandleFunc("GET /api/acc/processes", userMW(accountantHandler.ListProcesses))
	mux.HandleFunc("GET /api/acc/processes/{id}", userMW(accountantHandler.GetProcess))

	// Document routes — só existem com MinIO disponível.
	if docRepo != nil {
		documentHandler := handler.NewDocumentHandler(docRepo, domainProcessRepo, domainLinkRepo, domainLawyerRepo)
		mux.HandleFunc("/api/adv/processes/{id}/documents", userMW(documentHandler.HandleProcessDocuments))
		mux.HandleFunc("PUT /api/adv/documents/{id}/visibility", userMW(documentHandler.ToggleVisibility))
	} else {
		log.Print("Warning: document routes disabled (MinIO unavailable)")
	}

	router.LawyerHandler = lawyerHandler
	router.ClientRepo = domainClientRepo
	router.LawyerRepo = domainLawyerRepo
	router.AccountantServiceRepo = repository.NewAccountantServiceRepository(repoDB)

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
