---
gsd_state_version: 1.0
milestone: v1.1
milestone_name: MVP Completo para Produção
status: planning
last_updated: "2026-05-30T01:32:18.455Z"
progress:
  total_phases: 13
  completed_phases: 0
  total_plans: 2
  completed_plans: 0
  percent: 0
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-05-14)

**Core value:** Facilitar a conexão transparente, segura e ética entre clientes jurídicos e contadores.
**Current focus:** Phase 07 — completar-fundacao-quebrada

## Milestone History

- **Milestone 1.0** (Fases 1-6): ✅ Complete — 2026-05-11. Fundação implementada, 6 fases concluídas, build PASS.
- **Milestone 1.1** (Fases 7-13): 🔄 In Planning — 2026-05-14. MVP completo para produção.

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

| Phase | Status | Flags |
|-------|--------|-------|
| 7. Completar Fundação Quebrada | 📋 Planned | — |
| 8. Fluxo de Vínculo Completo | 📋 Planned | — |
| 9. Perfil Rico do Contador | 📋 Planned | — |
| 10. Avaliações e Reviews | 📋 Planned | — |
| 11. LGPD + Documentação Avançada | 📋 Planned | — |
| 12. Landing Page + Assinatura | 📋 Planned | — |
| 13. Verificação E2E + Produção | 📋 Planned | — |

## Gaps Identificados em 2026-05-14

### Backend faltando (frontend chama → 404)

- `GET /api/adv/usuarios` — UsersPage
- `GET /api/acc/postagens` — PostsPage
- `POST /api/acc/postagens` — PostsPage "Publicar"

### Frontend não conectado (forms estáticos)

- ServicesPage — criar serviço sem onSubmit
- PostsPage — "Publicar" sem handler API
- LawyerSubscriptionPage — 100% estática
- UsersPage — "Convidar" estático

### Features projetadas mas não implementadas

- Fluxo de vínculo: somente 3 estados de 11 planejados
- Advogado sem visibilidade do contador escolhido (LAWY-03)
- Sem entregáveis/pareceres do contador (ACCT-04)
- Sem avaliações (REV-*)
- Sem consentimento LGPD (SEC-03)
- Sem gestão de permissão por documento
- Sem landing page comercial
- Sem assinatura funcional

## Decisões Técnicas (v1.1)

| Decisão | Motivo |
|---------|--------|
| Novos estados de vínculo via ENUM no banco | Preservar type-safety e queries existentes |
| Media upload via multipart para perfil do contador | Padrão já existente no módulo de documentos |
| Consentimento como tabela separada (`ClientConsent`) | Auditabilidade LGPD — nunca deletar registro |
| Landing page como rota pública `/` | Substituir redirect atual que vai direto ao login |
| Assinatura v1 sem Stripe | Basic plan table — Stripe em v2 |

## Metadata

- **GSD Version**: 1.40.0
- **Milestone 1.0 Initialized**: 2026-05-04
- **Milestone 1.1 Initialized**: 2026-05-14
- **Last Verified (M1.0)**: 2026-05-11
