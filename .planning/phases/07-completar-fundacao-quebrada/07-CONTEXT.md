# Phase 7: Completar Fundação Quebrada - Context

**Gathered:** 2026-05-14
**Status:** Ready for planning

<domain>
## Phase Boundary

Zero funcionalidade quebrada. Todos os endpoints que retornam 404 são implementados; todos os formulários estáticos são wired à API. Entidades novas (`law_firms`, `postagens`) são criadas com schema mínimo funcional. Notificações automáticas de vínculo são disparadas via service layer.

Entregas:
- Backend: `GET/POST /api/adv/usuarios` + `POST /api/adv/usuarios/invite` (com link mágico SMTP)
- Backend: `GET/POST /api/acc/postagens` (nova entidade, publicação imediata)
- Backend: `law_firms` table + memberships auto-criados no registro de advogado
- Backend: LinkService com dispatch de notificações automáticas
- Backend: Catálogo com filtros funcionais no SQL (`specialty`, `city`, `state`, `q`)
- Backend: **MinIO integrado** — storage real para documentos (substituir URL fake); MinIO adicionado ao docker-compose
- Frontend: ServicesPage form `onSubmit` → `POST /api/acc/servicos`
- Frontend: PostsPage "Publicar" → `POST /api/acc/postagens`

</domain>

<decisions>
## Implementation Decisions

### Modelo de Equipe do Advogado
- **D-01:** Criar tabela `law_firms` (id, name, owner_id, created_at) e `law_firm_members` (firm_id, user_id, role, joined_at).
- **D-02:** Ao registrar usuário com `role=advogado`, o sistema cria automaticamente um `law_firm` e vincula o advogado como `owner`.
- **D-03:** `GET /api/adv/usuarios` retorna todos os membros do `law_firm` do advogado autenticado.

### Fluxo de Convite (FOND-02)
- **D-04:** `POST /api/adv/usuarios/invite` envia email com link mágico via SMTP genérico.
- **D-05:** Configuração via variáveis de ambiente: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`.
- **D-06:** Token de convite único (UUID), expira em 72h, armazenado em tabela `invite_tokens` (token, email, firm_id, expires_at, used_at).
- **D-07:** Rota pública `GET /invite/{token}` valida token e redireciona para registro pré-preenchido.

### Entidade Postagem (FOND-03 / FOND-06)
- **D-08:** Nova tabela `posts` (id, accountant_id, title, excerpt, content, tag, cover_url, status, published_at, created_at).
- **D-09:** `POST /api/acc/postagens` cria post com `status = 'publicado'` imediatamente — sem workflow de rascunho para MVP.
- **D-10:** Campos obrigatórios: `title`, `tag`, `content`, `cover_url`, `excerpt`. Todos required na criação.

### Notificações Automáticas (FOND-04)
- **D-11:** Criar `LinkService` em `app/api/internal/service/link.go` encapsulando lógica de negócio de vínculo + dispatch de notificações.
- **D-12:** Eventos e destinatários:
  - Vínculo solicitado → notificação ao `contador` (alerta para aceitar/recusar)
  - Vínculo aceito → notificação ao `cliente` e ao `advogado`
  - Vínculo recusado → notificação ao `cliente`
- **D-13:** Handlers `client.go` e `accountant.go` delegam para `LinkService` em vez de acessar `linkRepo` diretamente.

### Storage MinIO (adiantado para esta fase)
- **D-14:** Integrar MinIO ao docker-compose como serviço `minio` (imagem `minio/minio:latest`).
- **D-15:** Substituir o storage fake em `document.go` (`"https://storage.connexo.com.br/docs/..."`) por upload real para MinIO bucket `connexo-docs`.
- **D-16:** SDK Go: `github.com/minio/minio-go/v7`. Configurar via env vars: `MINIO_ENDPOINT`, `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY`.
- **D-17 (ARQUITETURAL):** Backend é proxy obrigatório para MinIO — URLs internas do MinIO NUNCA expostas ao frontend. Criar endpoint `GET /api/media/{bucket}/{key}` que faz stream do objeto MinIO. Documentos servidos via este proxy (com auth).
- **D-18:** Buckets: `connexo-docs` (documentos), `connexo-deliverables` (entregáveis, Fase 8), `connexo-media` (fotos/logo, Fase 9).

### Claude's Discretion
- Estrutura SQL de `law_firms` e `law_firm_members` (campos extras como `cnpj`, `address` → desnecessários para MVP)
- Formato do email de convite (texto simples ou HTML mínimo)
- Implementação de pagination em `GET /api/acc/postagens` (limit/offset padrão 20)
- Slug gerado automaticamente para post a partir do título

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requisitos
- `.planning/REQUIREMENTS.md` — FOND-01 a FOND-08, MIGR-04 (completar), MARK-02 (completar)
- `.planning/ROADMAP.md` §Phase 7 — Goal, success criteria, planos 7.1 e 7.2

### API Existente
- `app/api/internal/handler/routes.go` — endpoints registrados (ver o que FALTA: /adv/usuarios, /acc/postagens)
- `app/api/internal/handler/catalog.go` — handler com filtros já parseados, precisa SQL funcional no repo
- `app/api/internal/handler/notification.go` — CRUD de notificações existente
- `app/api/internal/repository/notification.go` — `Create`, `ListByUser`, `MarkRead` implementados
- `app/api/internal/repository/link.go` — `Create`, `Update`, `FindByID` — base para LinkService

### Frontend (páginas com wiring pendente)
- `app/web/src/pages/ServicesPage.tsx` — form sem `onSubmit`; serviço `createService` em `acc-services.ts` existe
- `app/web/src/pages/PostsPage.tsx` — "Publicar" sem handler; serviço `posts.ts` só tem `listMyPosts`
- `app/web/src/pages/UsersPage.tsx` — chama `listUsers()` → `GET /api/adv/usuarios` (404)
- `app/web/src/services/users.ts` — `listUsers` apontando para `/adv/usuarios`
- `app/web/src/services/posts.ts` — só `listMyPosts`; precisa de `createPost`

### Design System
- `.planning/phases/01-fundacao-migracao/01-CONTEXT.md` — Sovereign Gilded, componentes primitivos

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `domain.NotificationRepository.Create` — já funcional, só precisa ser chamado no LinkService
- `domain.AccountantServiceRepository` — padrão reutilizável para criar `PostRepository`
- `app/web/src/services/acc-services.ts` — `createService()` pronto; padrão para `createPost()`
- `app/web/src/components/ui/connexo-primitives` — `Card`, `GoldButton`, `Field`, `PageContainer`

### Established Patterns
- Handlers seguem padrão: parse JSON body → validate → call repo → respond (ver `service.go`)
- Frontend services usam `api.get<T>(path)` / `api.post<T>(path, body)` via axios wrapper
- Repositórios implementam interfaces em `domain/repositories.go`

### Integration Points
- `auth.Register` precisa ser estendido para criar `law_firm` + `law_firm_member` quando `role=advogado`
- `client.BindAccountant` e `accountant.AcceptLink`/`RejectLink` devem delegar ao `LinkService`
- `catalog.go` `List` já parseia filtros; `accountant_service.go` `ListPublic` precisa de WHERE clauses
- Nova rota pública para validação de convite: `GET /invite/{token}`

</code_context>

<specifics>
## Specific Ideas
- SMTP genérico configurável via env vars — não hardcodar provider
- Link mágico de convite expira em 72h para segurança mínima
- Postagem publicada imediatamente — sem rascunho no MVP (pode ser adicionado depois)

</specifics>

<deferred>
## Deferred Ideas
- UI de gestão de escritório (editar nome, logo do firm) — Fase 9 ou posterior
- Rascunho de postagens — Fase 9 (PostsPage com draft/publish workflow)
- Templates de email HTML ricos — escopo de marketing, não de MVP
- Stripe/pagamentos no convite — Fase 12

</deferred>

---

*Phase: 07-completar-fundacao-quebrada*
*Context gathered: 2026-05-14*
