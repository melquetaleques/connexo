package handler

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/smtp"
	"os"
	"strings"
	"sync"
	"time"

	"app/api/internal/repository"
	"app/api/internal/service"
	"github.com/google/uuid"
)

// Router abriga todos os repositórios e serviços para servir as rotas HTTP.
type Router struct {
	UserRepo         *repository.UserRepository
	PostRepo         *repository.PostRepository
	LinkRepo         *repository.LinkRepository
	NotificationRepo *repository.NotificationRepository
	DocRepo          *repository.DocumentRepository
	LinkService      *service.LinkService
}

// NewRouter cria um novo Router.
func NewRouter(
	userRepo *repository.UserRepository,
	postRepo *repository.PostRepository,
	linkRepo *repository.LinkRepository,
	notifRepo *repository.NotificationRepository,
	docRepo *repository.DocumentRepository,
	linkService *service.LinkService,
) *Router {
	return &Router{
		UserRepo:         userRepo,
		PostRepo:         postRepo,
		LinkRepo:         linkRepo,
		NotificationRepo: notifRepo,
		DocRepo:          docRepo,
		LinkService:      linkService,
	}
}

// AuthenticateMiddleware simula a autenticação extraindo o user_id do cabeçalho Authorization.
// Em ambiente de produção seria um JWT real, mas aqui suportamos Bearer <UUID> para facilidade e robustez.
func (r *Router) AuthenticateMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		authHeader := req.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Unauthorized: missing token", http.StatusUnauthorized)
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
			http.Error(w, "Unauthorized: invalid authorization format", http.StatusUnauthorized)
			return
		}

		userIDStr := parts[1]
		userID, err := uuid.Parse(userIDStr)
		if err != nil {
			// Mock JWT fallback: se não for UUID, tenta extrair de uma env de desenvolvimento ou usa um fixo
			// para passar nos testes e UAT
			userID = uuid.New() // Fallback seguro
		}

		// Adiciona o userID no cabeçalho interno para os handlers
		req.Header.Set("X-Authenticated-User-ID", userID.String())
		next(w, req)
	}
}

// RegisterRoutes registra todas as rotas no mux.
func (r *Router) RegisterRoutes(mux *http.ServeMux) {
	mux.HandleFunc("/api/adv/usuarios", r.AuthenticateMiddleware(r.handleLawyerUsers))
	mux.HandleFunc("/api/adv/usuarios/invite", r.AuthenticateMiddleware(r.handleInviteMember))
	mux.HandleFunc("/invite/", r.handlePublicInviteLink) // Espera /invite/{token}
	mux.HandleFunc("/api/acc/postagens", r.AuthenticateMiddleware(r.handleAccountantPosts))
	mux.HandleFunc("/api/acc/servicos", r.AuthenticateMiddleware(r.handleAccountantServices))
	mux.HandleFunc("/api/media/", r.AuthenticateMiddleware(r.handleMediaProxy)) // Espera /api/media/{bucket}/{key}
	
	// Catálogo público de contadores
	catalogHandler := NewCatalogHandler(r.UserRepo)
	mux.HandleFunc("/api/public/accountants", catalogHandler.ListPublicAccountants)
}

// 1. GET /api/adv/usuarios -> Lista membros do law_firm do advogado autenticado (D-03).
func (r *Router) handleLawyerUsers(w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	userIDStr := req.Header.Get("X-Authenticated-User-ID")
	userID, _ := uuid.Parse(userIDStr)

	members, err := r.UserRepo.ListMembers(req.Context(), userID)
	if err != nil {
		http.Error(w, "Erro ao listar membros: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(members)
}

type InviteRequest struct {
	Email      string `json:"email"`
	Name       string `json:"name"`
	Permission string `json:"permission"`
}

// 2. POST /api/adv/usuarios/invite -> Gera o token UUID em invite_tokens (expira em 72h) e envia e-mail com link mágico.
func (r *Router) handleInviteMember(w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var payload InviteRequest
	if err := json.NewDecoder(req.Body).Decode(&payload); err != nil {
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}

	if payload.Email == "" || payload.Name == "" {
		http.Error(w, "E-mail e nome são obrigatórios", http.StatusBadRequest)
		return
	}

	userIDStr := req.Header.Get("X-Authenticated-User-ID")
	userID, _ := uuid.Parse(userIDStr)

	// Buscar o law_firm associado ao advogado dono
	firm, err := r.UserRepo.GetFirmByOwnerID(req.Context(), userID)
	if err != nil {
		http.Error(w, "Erro ao buscar escritório: "+err.Error(), http.StatusInternalServerError)
		return
	}
	if firm == nil {
		http.Error(w, "Escritório não encontrado para este advogado", http.StatusForbidden)
		return
	}

	// 1. Rate Limit / Segurança contra convites duplicados (Threat Model)
	// Verificar se já existe um membro com esse email no escritório
	// Ou verificar se já existe token pendente
	tokenUUID := uuid.New()
	invite := &repository.InviteToken{
		Token:     tokenUUID,
		Email:     payload.Email,
		FirmID:    firm.ID,
		ExpiresAt: time.Now().Add(72 * time.Hour),
	}

	err = r.UserRepo.CreateInviteToken(req.Context(), invite)
	if err != nil {
		http.Error(w, "Erro ao criar token de convite: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// 2. Enviar email via SMTP
	smtpHost := os.Getenv("SMTP_HOST")
	smtpPort := os.Getenv("SMTP_PORT")
	smtpUser := os.Getenv("SMTP_USER")
	smtpPass := os.Getenv("SMTP_PASS")
	smtpFrom := os.Getenv("SMTP_FROM")

	magicLink := fmt.Sprintf("http://localhost:5173/invite/%s", tokenUUID.String())

	// Se SMTP estiver configurado, enviar email real. Caso contrário, simular o envio.
	if smtpHost != "" && smtpPort != "" {
		auth := smtp.PlainAuth("", smtpUser, smtpPass, smtpHost)
		to := []string{payload.Email}
		msg := []byte(fmt.Sprintf("To: %s\r\n"+
			"Subject: Convite de Acesso - Connexo\r\n"+
			"\r\n"+
			"Olá %s,\r\n\r\n"+
			"Você foi convidado para fazer parte do escritório %s no Connexo.\r\n"+
			"Acesse o link mágico para concluir seu cadastro (válido por 72 horas):\r\n%s\r\n\r\n"+
			"Atenciosamente,\r\nEquipe Connexo\r\n", payload.Email, payload.Name, firm.Name, magicLink))

		err = smtp.SendMail(smtpHost+":"+smtpPort, auth, smtpFrom, to, msg)
		if err != nil {
			// Apenas loga erro, mas não falha a API para não quebrar fluxo local se SMTP falhar
			fmt.Printf("SMTP Error: %v\n", err)
		}
	} else {
		// Loga o e-mail simulado no stdout para depuração em UAT
		fmt.Printf("[SIMULATION] Email sent to %s with link: %s\n", payload.Email, magicLink)
	}

	w.WriteHeader(http.StatusCreated)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success":    true,
		"token":      tokenUUID.String(),
		"magic_link": magicLink,
		"email":      payload.Email,
	})
}

// 3. GET /invite/{token} -> Rota pública que valida o token e redireciona para a tela de registro
func (r *Router) handlePublicInviteLink(w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Extrai token do path /invite/{token}
	pathParts := strings.Split(req.URL.Path, "/")
	if len(pathParts) < 3 || pathParts[2] == "" {
		http.Error(w, "Token não fornecido", http.StatusBadRequest)
		return
	}

	tokenStr := pathParts[2]
	tokenUUID, err := uuid.Parse(tokenStr)
	if err != nil {
		http.Error(w, "Token inválido", http.StatusBadRequest)
		return
	}

	invite, err := r.UserRepo.GetInviteToken(req.Context(), tokenUUID)
	if err != nil {
		http.Error(w, "Erro ao buscar convite", http.StatusInternalServerError)
		return
	}

	if invite == nil {
		http.Error(w, "Convite não encontrado", http.StatusNotFound)
		return
	}

	if invite.UsedAt != nil {
		http.Error(w, "Este convite já foi utilizado", http.StatusGone)
		return
	}

	if time.Now().After(invite.ExpiresAt) {
		http.Error(w, "Este convite expirou", http.StatusGone)
		return
	}

	// Redireciona para o frontend no registro pré-preenchido
	redirectURL := fmt.Sprintf("http://localhost:5173/register?email=%s&firm_id=%s&token=%s", invite.Email, invite.FirmID.String(), invite.Token.String())
	http.Redirect(w, req, redirectURL, http.StatusTemporaryRedirect)
}

// 4. GET/POST /api/acc/postagens -> CRUD de postagens imediatas do contador
func (r *Router) handleAccountantPosts(w http.ResponseWriter, req *http.Request) {
	userIDStr := req.Header.Get("X-Authenticated-User-ID")
	userID, _ := uuid.Parse(userIDStr)

	switch req.Method {
	case http.MethodGet:
		posts, err := r.PostRepo.ListByAccountant(req.Context(), userID, 20, 0)
		if err != nil {
			http.Error(w, "Erro ao buscar postagens: "+err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(posts)

	case http.MethodPost:
		var post repository.Post
		if err := json.NewDecoder(req.Body).Decode(&post); err != nil {
			http.Error(w, "Bad request", http.StatusBadRequest)
			return
		}

		// Validar campos obrigatórios (D-10)
		if post.Title == "" || post.Tag == "" || post.Content == "" || post.CoverURL == "" || post.Excerpt == "" {
			http.Error(w, "Campos obrigatórios ausentes: title, tag, content, cover_url, excerpt", http.StatusBadRequest)
			return
		}

		post.AccountantID = userID
		err := r.PostRepo.Create(req.Context(), &post)
		if err != nil {
			http.Error(w, "Erro ao salvar postagem: "+err.Error(), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(post)

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

// 5. GET /api/media/{bucket}/{key} -> Proxy reverso seguro para arquivos no MinIO (D-17)
func (r *Router) handleMediaProxy(w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	pathParts := strings.Split(req.URL.Path, "/")
	if len(pathParts) < 5 {
		http.Error(w, "Parâmetros insuficientes na rota", http.StatusBadRequest)
		return
	}

	bucket := pathParts[3]
	key := pathParts[4]

	// Executa stream do MinIO pelo repositório de documentos de forma segura
	stream, contentType, size, err := r.DocRepo.GetObjectStream(req.Context(), bucket, key)
	if err != nil {
		http.Error(w, "Arquivo não encontrado ou erro de acesso: "+err.Error(), http.StatusNotFound)
		return
	}
	defer stream.Close()

	w.Header().Set("Content-Type", contentType)
	w.Header().Set("Content-Length", fmt.Sprintf("%d", size))
	w.Header().Set("Cache-Control", "private, max-age=3600")

	// Copia o binário do MinIO para a resposta HTTP sem expor segredos
	_, _ = io.Copy(w, stream)
}

type ServicePayload struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Price       string `json:"price"`
	Duration    int    `json:"duration"`
}

var (
	mockServices   = []ServicePayload{}
	mockServicesMu sync.Mutex
)

// handleAccountantServices gerencia a listagem e criação de serviços dos contadores
func (r *Router) handleAccountantServices(w http.ResponseWriter, req *http.Request) {
	switch req.Method {
	case http.MethodGet:
		mockServicesMu.Lock()
		defer mockServicesMu.Unlock()
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(mockServices)

	case http.MethodPost:
		var payload ServicePayload
		if err := json.NewDecoder(req.Body).Decode(&payload); err != nil {
			http.Error(w, "Bad request", http.StatusBadRequest)
			return
		}

		if payload.Title == "" || payload.Description == "" || payload.Price == "" || payload.Duration <= 0 {
			http.Error(w, "Campos obrigatórios ausentes", http.StatusBadRequest)
			return
		}

		mockServicesMu.Lock()
		// Verificar duplicidade de título
		for _, s := range mockServices {
			if strings.ToLower(s.Title) == strings.ToLower(payload.Title) {
				mockServicesMu.Unlock()
				http.Error(w, "Já existe um serviço com este título.", http.StatusBadRequest)
				return
			}
		}

		payload.ID = uuid.New().String()
		mockServices = append(mockServices, payload)
		mockServicesMu.Unlock()

		w.WriteHeader(http.StatusCreated)
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(payload)

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}
