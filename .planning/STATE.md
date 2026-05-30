---
gsd_state_version: 1.0
milestone: v1.1
milestone_name: MVP Completo para Produção
status: planning
last_updated: "2026-05-30T03:00:00.000Z"
progress:
  total_phases: 13
  completed_phases: 10
  total_plans: 10
  completed_plans: 10
  percent: 77
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-05-14)

**Core value:** Facilitar a conexão transparente, segura e ética entre clientes jurídicos e contadores.
**Current focus:** Phase 13 — Verificação E2E e Preparação para Produção

## Milestone History

- **Milestone 1.0** (Fases 1-6): ✅ Complete — 2026-05-11. Fundação implementada, 6 fases concluídas, build PASS.
- **Milestone 1.1** (Fases 7-13): 🔄 In Progress — 2026-05-30. MVP completo para produção.

## Milestone 1.0 — Legado (resumo)

| Phase | Status | Notas |
|-------|--------|-------|
| 1. Fundação e Migração | ✅ Complete | Auth, layout, clientes, processos |
| 2. Marketplace | ✅ Complete | Catálogo, bind accountant |
| 3. Portal do Contador | ✅ Complete | Perfil, accept/reject links |
| 4. Painel Cliente/Docs | ✅ Complete | Upload, list, visibility |
| 5. Refinamento/Auditoria | ✅ Complete | Logs, notificações, UI polish |
| 6. Correção de Flags | ✅ Complete | 14 flags resolvidos |

## Milestone 1.1 — Status Atual (Fases 7-13)

| Phase | Status | Notas |
|-------|--------|-------|
| 7. Completar Fundação Quebrada | ✅ Complete | Tasks 1-4 implementadas: migrations, endpoints, LinkService, MinIO, UI wiring |
| 8. Fluxo de Vínculo Completo | ✅ Complete | Tasks 1-4: migrations, LinkService transitions, deliverables MinIO, UI 3 perfis |
| 9. Perfil Rico do Contador | ✅ Complete | Tasks 1-5: migrations, media upload, profile edit, public profile, catalog |
| 10. Avaliações e Reviews | ✅ Complete | Backend + migration + frontend |
| 11. LGPD + Documentação Avançada | ✅ Complete | Consent flow, permissões, log de acesso |
| 12. Landing Page + Assinatura | ✅ Complete | Landing page pública, backend subscription, frontend assinatura |
| 13. Verificação E2E + Produção | 🔄 Em Progresso | Rate limiting (60/10 req/min), CORS env var, docker-compose.prod.yml, .env.example, server entry point, Dockerfiles |

## Decisões Técnicas (v1.1)

| Decisão | Motivo |
|---------|--------|
| Novos estados de vínculo via ENUM no banco | Preservar type-safety e queries existentes |
| Media upload via multipart para perfil do contador | Padrão já existente no módulo de documentos |
| Consentimento como tabela separada (`ClientConsent`) | Auditabilidade LGPD — nunca deletar registro |
| Landing page como rota pública `/` | Substituir redirect atual que vai direto ao login |
| Assinatura v1 sem Stripe | Basic plan table — Stripe em v2 |
| Rate limiting via IP com token bucket (`x/time/rate`) | Leve, sem dependência externa, 60 req/min global / 10 req/min auth |
| CORS lido de `CORS_ALLOWED_ORIGIN` env var | Flexível para dev (`*`) e produção (`https://connexo.com.br`) |
| `docker-compose.prod.yml` sem portas DB/MinIO expostas | Segurança — acesso somente via Docker network interna |

## Phase 13 — Deliverables Implementados

### Backend
- ✅ Server entry point (`app/api/cmd/server/main.go`) — conecta DB, inicializa repositórios/serviços, registra rotas
- ✅ Rate limiting middleware com `golang.org/x/time/rate` — 60 req/min global, 10 req/min em `/api/auth/*`
- ✅ CORS middleware lê `CORS_ALLOWED_ORIGIN` env var (fallback `*`)
- ✅ Resposta 429 com body `{"error": "muitas requisições, tente novamente em breve"}` + header `Retry-After`
- ✅ Health check endpoint inclui DB ping

### Infraestrutura
- ✅ `docker-compose.prod.yml` — postgres, redis, minio, api, web
- ✅ MinIO interno (sem porta exposta externamente)
- ✅ Volumes persistentes nomeados (`connexo-pgdata`, `connexo-redisdata`, `connexo-miniodata`)
- ✅ Health checks para db, redis e minio
- ✅ Dockerfile para API (multi-stage build Go 1.20 alpine)
- ✅ Dockerfile para Web (React → nginx)
- ✅ nginx.conf para servir SPA + proxy reverso API
- ✅ `.env.example` com todas as variáveis documentadas

## Known Gaps

- Frontend não tem `package.json` — web Dockerfile não compila sem dependências instaladas
- `golang-jwt/jwt/v5` declarado no STACK.md mas não no go.mod (auth ainda usa mock UUID)
- Cobertura de testes automatizados — v2

## Metadata

- **GSD Version**: 1.40.0
- **Milestone 1.0 Initialized**: 2026-05-04
- **Milestone 1.1 Initialized**: 2026-05-14
- **Last Verified (M1.1 Phase 13)**: 2026-05-30
