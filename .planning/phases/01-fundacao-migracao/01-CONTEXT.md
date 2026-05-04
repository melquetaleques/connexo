# Phase 1: Fundação e Migração Essencial - Context

**Gathered:** 2026-05-04
**Status:** Ready for planning
**Source:** Autonomous consolidation of `escopo.md` and `prototipo-fonte.md` (Discussion skipped by USER)

<domain>
## Phase Boundary
Esta fase foca em trazer a base do protótipo para a estrutura moderna (app/web/src), migrar as rotas críticas de autenticação e garantir que o fluxo de gestão de clientes e processos pelo advogado esteja funcional.

Entregas:
- Migração de Autenticação (Login/Registro)
- Layout Base (Sidebar, Header, Layout persistente)
- Gestão de Clientes e Processos no Frontend
- Sincronização de Tipos (TS) com a API Go
</domain>

<decisions>
## Implementation Decisions

### Estilo Visual e Design System
- **Tema:** Adotar o padrão **Sovereign Gilded** definido em `PROJECT.md`.
- **Cores:** Midnight Navy (`#000830`) como fundo principal/sidebar e Burnished Gold (`#C59D5C`) para acentos, botões e elementos de destaque.
- **Tipografia:** Plus Jakarta Sans.
- **Login/Registro:** Adaptar o layout do tema legado (`tema_connexo/login/code.html`) para usar os componentes de UI modernos já existentes em `DashboardPage.tsx` (Cards, GoldButton), garantindo consistência visual.

### Arquitetura Frontend
- **Framework:** React + Vite + TypeScript.
- **Componentização:** Continuar evoluindo o diretório `@/components/ui/connexo-primitives` para componentes reutilizáveis.
- **Autenticação:** Integrar com o backend Go via JWT. O frontend deve gerenciar o token no localStorage/Cookies e proteger as rotas privadas.

### Integração com API
- **Estratégia:** Começar a substituir os dados mockados de `connexo-data.ts` pelos endpoints reais conforme documentado em `app/api/internal/handler/routes.go`.
- **Endpoints Chave:** `/api/auth/login`, `/api/auth/me`, `/api/adv/dashboard`, `/api/adv/clients`.

### Gestão de Clientes e Processos
- **Funcionalidade:** Implementar listagem (DataTable) e modal de criação simplificada de clientes integrada ao backend.
- **Processos:** Visualização de lista de processos vinculados ao cliente.

### the agent's Discretion
- Escolha da biblioteca de ícones (Material Symbols conforme usado no Dashboard).
- Estrutura de pastas interna de `app/web/src/pages` seguindo o padrão atual.
</decisions>

<canonical_refs>
## Canonical References
**Downstream agents MUST read these before planning or implementing.**

### Core Specs
- [escopo.md](file:///c:/Projetos/escritorio/connexo/docs/escopo.md) — Regras de negócio e visão geral.
- [prototipo-fonte.md](file:///c:/Projetos/escritorio/connexo/app/docs/prototipo-fonte.md) — Mapeamento de arquivos legados vs modernos.

### Technical Refs
- [PROJECT.md](file:///c:/Projetos/escritorio/connexo/.planning/PROJECT.md) — Design System e Visão Geral.
- [REQUIREMENTS.md](file:///c:/Projetos/escritorio/connexo/.planning/REQUIREMENTS.md) — Lista de requisitos (MIGR-01, MIGR-02, MIGR-03, LAWY-02, MIGR-05).
- [routes.go](file:///c:/Projetos/escritorio/connexo/app/api/internal/handler/routes.go) — Definição dos endpoints da API.
</canonical_refs>

<specifics>
## Specific Ideas
- Usar o componente `PageContainer` para todas as telas internas.
- Manter o efeito de "EST. 1994" no fundo do Dashboard como marca d'água de prestígio.
</specifics>

<deferred>
## Deferred Ideas
- Marketplace de Contadores (Fase 2).
- Logs de Auditoria LGPD detalhados (Fase 5).
</deferred>

---
*Phase: 01-fundacao-migracao*
*Context gathered: 2026-05-04 via Autonomous consolidation*
