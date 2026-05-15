# Phase 9: Perfil Rico do Contador - Context

**Gathered:** 2026-05-15
**Status:** Ready for planning

<domain>
## Phase Boundary

Contador tem perfil completo, funcional e atrativo — logo, fotos, status de disponibilidade, posts reais (criados na Fase 7), visíveis no perfil público e no catálogo. Backend serve como proxy para todos os arquivos MinIO — nenhuma URL de MinIO é exposta diretamente ao frontend.

Entregas:
- Backend: Extensão do `Accountant` com `logo_url`, `photo_urls[]`, `availability` ENUM
- Backend: Endpoint de upload de media via proxy (`POST /api/acc/media/logo`, `POST /api/acc/media/photo`)
- Backend: Endpoint proxy para servir arquivos (`GET /api/media/{bucket}/{key}`)
- Frontend: `AccountantProfileEdit` com upload de logo/fotos e toggle de disponibilidade
- Frontend: `AccountantPublicProfile` com seções completas: Header → Especialidades → Serviços → Posts

</domain>

<decisions>
## Implementation Decisions

### Media Upload e Storage
- **D-01:** MinIO armazena todos os arquivos (documentos, entregáveis, fotos, logo). URLs diretas do MinIO NUNCA são expostas ao frontend.
- **D-02:** Backend serve como proxy obrigatório: `GET /api/media/{bucket}/{key}` → backend busca no MinIO e faz stream da resposta ao client.
- **D-03:** Campos no `Accountant`: `logo_url TEXT` (path do objeto no MinIO, ex: `logos/{accountant_id}/logo.jpg`) e `photo_urls TEXT[]` (array de paths, até 5 fotos).
- **D-04:** Upload endpoints: `POST /api/acc/media/logo` (multipart/form-data) e `POST /api/acc/media/photo` (multipart/form-data). Backend faz upload ao MinIO e salva o path no perfil.
- **D-05:** Bucket: `connexo-media` para fotos e logos (separado de `connexo-docs` para documentos e `connexo-deliverables` para entregáveis).

### Status de Disponibilidade
- **D-06:** Enum TEXT no Postgres com 3 valores: `'disponivel'`, `'parcial'`, `'indisponivel'`.
- **D-07:** Coluna `availability TEXT DEFAULT 'disponivel'` adicionada ao `accountants` table via migration.
- **D-08:** `GET /api/public/accountants?availability=disponivel` filtra pelo campo. Catálogo exibe badge de disponibilidade nos cards.
- **D-09:** `parcial` exibido no catálogo como "Disponibilidade Limitada" (em português, badge âmbar).

### Perfil Público — Seções e Ordem
- **D-10:** Ordem das seções no `AccountantPublicProfile`:
  1. **Header**: foto + logo + nome + CRC + cidade/estado + availability badge + CTA "Contratar"
  2. **Bio**: texto descritivo
  3. **Especialidades**: chips/tags
  4. **Serviços**: cards de `AccountantService` com preço e prazo
  5. **Posts**: grid de posts publicados (da tabela `posts` via `GET /api/public/accountants/{slug}/posts`)
  6. **Avaliações**: placeholder "Em breve" (implementado na Fase 10)
- **D-11:** CTA "Contratar" sempre visível (sticky no header ou botão flutuante em mobile).

### Atualização do Proxy para Fases Anteriores
- **D-12:** A decisão de proxy MinIO (D-01 a D-02) afeta TODAS as fases com storage:
  - **Fase 7**: `GET /api/media/{bucket}/{key}` criado ao integrar MinIO. Documentos existentes com URL fake são legacy (sem migração retroativa para MVP).
  - **Fase 8**: Entregáveis também servidos via proxy no mesmo endpoint.
  - Esta fase (9): Fotos/logo via proxy.

### Claude's Discretion
- Limite de tamanho de arquivo de media: 5MB para logo, 10MB por foto
- Formato aceito: JPEG e PNG (sem SVG para evitar XSS)
- Número máximo de fotos: 5 (array com até 5 elementos)
- Ordem de exibição de fotos: por índice do array
- URL gerada para o frontend: `/api/media/connexo-media/{path}` (prefixo fixo)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requisitos
- `.planning/REQUIREMENTS.md` — PROF-01, PROF-02, PROF-03, PROF-04, ACCT-01 (completar)
- `.planning/ROADMAP.md` §Phase 9 — Goal, success criteria, planos 9.1 a 9.3

### Código Existente
- `app/api/internal/domain/entities.go` — `Accountant` struct (campos a adicionar)
- `app/api/internal/handler/accountant.go` — `GetProfile`, `UpdateProfile` (a estender)
- `app/api/internal/repository/accountant_service.go` — padrão para `PostRepository`
- `app/web/src/pages/AccountantProfileEdit.tsx` — página existente a estender com upload
- `app/web/src/pages/AccountantPublicProfile.tsx` — página existente a estender com seções
- `.planning/phases/07-completar-fundacao-quebrada/07-CONTEXT.md` — MinIO SDK, env vars, bucket `connexo-docs`
- `.planning/phases/08-fluxo-vinculo-completo/08-CONTEXT.md` — bucket `connexo-deliverables`

### Design System
- `.planning/phases/01-fundacao-migracao/01-CONTEXT.md` — Sovereign Gilded, primitivos UI

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `GET /api/acc/profile` + `PUT /api/acc/profile` — base para extensão com media
- `GET /api/public/accountants/{slug}` — retorna perfil público; estender com `logo_url`, `photo_urls`, `availability`, `posts`
- `app/web/src/services/accountant.ts` — `getMyProfile`, `updateAccountantProfile` — a estender
- MinIO SDK disponível após Fase 7 — `minio.Client` injetado via DI no server

### Established Patterns
- Upload de arquivo: handler recebe multipart, valida tipo/tamanho, envia para MinIO, salva path
- `NamedExecContext` para UPDATE de perfil
- Frontend: `FormData` para upload multipart

### Integration Points
- `GET /api/public/accountants` — catálogo deve incluir `logo_url` e `availability` na resposta
- `AccountantCatalogPage` — cards precisam mostrar foto/logo e badge de disponibilidade (modificação in Phase 9)
- `PostsPage` existente (Fase 7) — posts publicados pelo contador aparecem no perfil via API

</code_context>

<specifics>
## Specific Ideas
- Backend como proxy MinIO: nenhuma credential ou URL interna do MinIO vaza ao frontend
- `GET /api/media/{bucket}/{key}` — endpoint genérico de proxy, protegido por auth onde necessário (fotos de perfil público: sem auth; documentos: com auth)
- Perfil público: seção de avaliações como placeholder "Em breve" com teaser visual

</specifics>

<deferred>
## Deferred Ideas
- Recorte/crop de imagem no frontend antes do upload — UX refinada para Fase 13+
- Ordem personalizada de fotos (drag & drop) — posterior
- Video de apresentação do contador — posterior
- CDN na frente do MinIO proxy — infraestrutura de produção avançada

</deferred>

---

*Phase: 09-perfil-rico-contador*
*Context gathered: 2026-05-15*
