# Phase 13: Verificação E2E e Preparação para Produção - Context

**Gathered:** 2026-05-15
**Status:** Ready for planning

<domain>
## Phase Boundary

Plataforma verificada end-to-end por todos os roles, hardened para produção (CORS, rate limiting, variáveis de ambiente), dockerizada e pronta para deploy em VPS com domínio `connexo.com.br` e SSL via Let's Encrypt/nginx.

Entregas:
- UAT completo: fluxo principal + LGPD + cancelamento de vínculo
- Backend: Rate limiting middleware Go (60 req/min global, 10 req/min auth)
- Backend: CORS configurado para domínio de produção
- Docker Compose de produção com MinIO, postgres, redis, api, nginx
- nginx reverse proxy com SSL (Let's Encrypt)
- `.env.example` documentado com todas as variáveis
- Zero TypeScript warnings no build frontend

</domain>

<decisions>
## Implementation Decisions

### Ambiente de Produção
- **D-01:** VPS própria (DigitalOcean, Linode ou Hetzner) com Docker Compose.
- **D-02:** nginx como reverse proxy — já existe `app/nginx/` no repo. Configurar SSL via certbot/Let's Encrypt.
- **D-03:** Domínio: `connexo.com.br` (ou subdomínio de staging). CORS backend: `ALLOWED_ORIGIN=https://connexo.com.br`.
- **D-04:** `docker-compose.prod.yml` separado do `docker-compose.yml` de dev. Prod: sem porta expostas do DB/MinIO externamente, volumes persistentes.

### Rate Limiting
- **D-05:** Middleware Go usando `golang.org/x/time/rate` (já disponível no módulo Go).
- **D-06:** Limites: 60 req/min por IP para todas as rotas; 10 req/min por IP para `/api/auth/login` e `/api/auth/register`.
- **D-07:** Resposta 429 Too Many Requests com body `{"error": "muitas requisições, tente novamente em breve"}`.
- **D-08:** Implementado como middleware em `app/api/internal/handler/middleware.go`.

### CORS de Produção
- **D-09:** `CORS_ALLOWED_ORIGIN` env var. Desenvolvimento: `*`. Produção: `https://connexo.com.br`.
- **D-10:** Middleware CORS existente em `routes.go` atualizado para ler da env var.

### Variáveis de Ambiente
- **D-11:** `.env.example` documentado com TODOS os vars necessários:
  - Database: `CONNEXO_DATABASE_URL`
  - Redis: `CONNEXO_REDIS_URL`
  - Auth: `JWT_SECRET`, `JWT_EXPIRY_HOURS`
  - MinIO: `MINIO_ENDPOINT`, `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY`
  - SMTP: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`
  - CORS: `CORS_ALLOWED_ORIGIN`
  - App: `CONNEXO_HTTP_ADDR`, `APP_ENV` (development|production)

### UAT — Fluxos Obrigatórios
- **D-12:** Fluxo principal: advogado cria processo → cliente escolhe contador (consent LGPD) → contador entrega → advogado aprova → cliente avalia.
- **D-13:** Fluxo cancelamento: advogado solicita cancelamento → contador tem 48h → cancelamento efetiva → acesso encerrado.
- **D-14:** Fluxo LGPD: permissão por doc testada (contador vê só docs permitidos, 403 em restrito), log de acesso registrado.
- **D-15:** Cold start: `docker-compose up` → `GET /api/health` retorna 200 em < 5s.
- **D-16:** Zero endpoints retornando 404 nos fluxos principais.
- **D-17:** Build frontend sem TypeScript warnings (`tsc --noEmit` com exit 0).

### Claude's Discretion
- Configuração exata do nginx (worker_processes, gzip, proxy_pass headers)
- Health check endpoint já existe em `/api/health` — verificar se retorna DB status também
- Ordem de deploy: DB migrations → API → web
- Tamanho de VPS: 2GB RAM mínimo para rodar Postgres + Redis + MinIO + API + nginx

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requisitos
- `.planning/REQUIREMENTS.md` — todos os requisitos das Fases 7-12 validados em produção
- `.planning/ROADMAP.md` §Phase 13 — Goal, success criteria, planos 13.1 a 13.3

### Infraestrutura Existente
- `app/docker-compose.yml` — base para docker-compose.prod.yml (adicionar MinIO, ajustar volumes)
- `app/nginx/` — config nginx existente a estender com SSL e proxy rules
- `app/web/nginx.conf` — nginx do container web (servir SPA)
- `app/api/internal/handler/routes.go` — onde rate limiting e CORS middlewares são registrados
- `app/web/.env.example` — estender com todas as vars necessárias

### Contextos das Fases Anteriores
- `.planning/phases/07-completar-fundacao-quebrada/07-CONTEXT.md` — MinIO env vars (MINIO_*)
- `.planning/phases/07-completar-fundacao-quebrada/07-CONTEXT.md` — SMTP env vars
- `.planning/phases/11-lgpd-documentacao/11-CONTEXT.md` — fluxos LGPD para UAT

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `GET /api/health` — health check existente (verificar se inclui DB ping)
- `app/api/internal/handler/middleware.go` — onde adicionar rate limiting
- `app/docker-compose.yml` — base para prod compose (adicionar MinIO service, ajustar env)
- `app/Makefile` — verificar se tem targets úteis para deploy

### Established Patterns
- Middleware chain: `chain(authMW, auditMW, RequireRole(...))` — padrão para adicionar rateLimitMW
- `CONNEXO_*` prefix para env vars existentes

### Integration Points
- Rate limit middleware: inserir no início da chain em `routes.go` (antes de auth)
- CORS: ler `os.Getenv("CORS_ALLOWED_ORIGIN")` em vez de wildcard hardcoded
- nginx prod: `proxy_pass http://api:8080` para API; `root /usr/share/nginx/html` para SPA

</code_context>

<specifics>
## Specific Ideas
- VPS com Docker Compose — sem Kubernetes para MVP (overkill)
- `docker-compose.prod.yml` com MinIO não exposto externamente (acesso somente interno via Docker network)
- certbot + Let's Encrypt via `certbot/certbot` Docker image no nginx

</specifics>

<deferred>
## Deferred Ideas
- CI/CD pipeline (GitHub Actions para auto-deploy) — v2
- Monitoring/alerting (Grafana + Prometheus) — v2
- Backup automático do banco — v2
- CDN para assets do frontend — v2
- Testes automatizados E2E (Playwright/Cypress) — v2

</deferred>

---

*Phase: 13-verificacao-producao*
*Context gathered: 2026-05-15*
