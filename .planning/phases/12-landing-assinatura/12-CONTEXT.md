# Phase 12: Landing Page + Assinatura do Advogado - Context

**Gathered:** 2026-05-15
**Status:** Ready for planning

<domain>
## Phase Boundary

Landing page comercial pública em `/` e gestão básica de assinatura do advogado. Trial automático de 30 dias no cadastro. Sem Stripe — controle manual pelo admin para ativação pós-trial. Advogado com assinatura expirada vê banner de aviso sem bloqueio forçado.

Entregas:
- Frontend: Landing page pública em `/` com 4 seções (Hero, Como Funciona, Planos, FAQ)
- Backend: Trial de 30 dias criado automaticamente no registro do advogado
- Backend: `GET /api/adv/subscription` retorna plano atual, status e data de expiração
- Backend: Endpoint admin para ativar/renovar assinatura manualmente
- Frontend: `LawyerSubscriptionPage` com dados reais (sem mock)
- Frontend: Banner de aviso quando assinatura expirada (sem bloqueio forçado)

</domain>

<decisions>
## Implementation Decisions

### Landing Page
- **D-01:** Rota pública `/` exibe landing page (substituir redirect atual para `/login`).
- **D-02:** 4 seções obrigatórias:
  1. **Hero**: headline impactante + subtítulo + CTA primário "Cadastrar Escritório" → `/register?role=advogado`
  2. **Como Funciona**: 3 passos (Advogado cadastra → Cliente escolhe contador → Contador entrega)
  3. **Planos e Preços**: cards com features por plano, CTA por plano
  4. **FAQ**: 5-7 perguntas sobre conformidade OAB, LGPD, segurança, preços
- **D-03:** Design system Sovereign Gilded — mesmas cores/fontes do app (Midnight Navy + Burnished Gold, Plus Jakarta Sans).
- **D-04:** Landing page tem link "Já tenho conta → Entrar" apontando para `/login`.
- **D-05:** Separação ética explícita (SEC-04 / OAB): contador recebe por serviço prestado, NUNCA por indicação. Mencionar na seção de planos ou FAQ.

### Modelo de Assinatura MVP
- **D-06:** Trial automático: ao registrar advogado (role=advogado), criar registro em `lawyer_subscriptions` (id, lawyer_id, plan TEXT DEFAULT 'trial', status TEXT DEFAULT 'ativo', expires_at = NOW() + 30 days, created_at).
- **D-07:** Planos para MVP: `trial` (30 dias), `basico` (mensal), `profissional` (mensal). Sem valores hardcoded no código — configuráveis via admin.
- **D-08:** `GET /api/adv/subscription` retorna: plan, status (`ativo`|`expirado`|`cancelado`), expires_at, days_remaining.
- **D-09:** Endpoint admin: `POST /api/admin/subscriptions/{lawyer_id}/activate` — body: `{plan, expires_at}`. Protegido por `role=admin`.
- **D-10:** `Lawyer.subscription_status` e `Lawyer.subscription_expires_at` já existem no schema — migrar para nova tabela `lawyer_subscriptions` OU simplesmente usar os campos existentes. **Decisão: usar campos existentes do Lawyer para MVP** (evitar migration desnecessária).

### Expiração e UX
- **D-11:** Frontend verifica `subscription.status === 'expirado'` e exibe banner no topo do AppShell do advogado: "Sua assinatura expirou em [data]. [Renovar agora →]".
- **D-12:** Sem bloqueio forçado para MVP — advogado pode continuar usando o sistema com o banner visível.
- **D-13:** Banner link aponta para `LawyerSubscriptionPage` (`/adv/subscription`).
- **D-14:** `LawyerSubscriptionPage` exibe dados reais do `GET /api/adv/subscription` — sem mock. Exibe plano atual, data de expiração e CTA de contato/renovação.

### Claude's Discretion
- Conteúdo textual das seções da landing page (copywriting) — Claude propõe baseado na proposta de valor do Connexo
- Valores de preços dos planos na landing page — usar placeholders "A partir de R$ XX/mês" até definição comercial
- Número e conteúdo exato das FAQs — Claude propõe baseado em conformidade OAB/LGPD
- Animações/transições na landing page — CSS simples, sem lib de animação adicional

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requisitos
- `.planning/REQUIREMENTS.md` — SUB-01, SUB-02, SUB-03, SUB-04, LAWY-01, SEC-04
- `.planning/ROADMAP.md` §Phase 12 — Goal, success criteria, planos 12.1 a 12.3

### Código Existente
- `app/api/internal/domain/entities.go` — `Lawyer` struct com `subscription_status` e `subscription_expires_at` (usar esses campos para MVP)
- `app/api/internal/handler/lawyer.go` — dashboard handler existente; padrão para subscription endpoint
- `app/web/src/pages/LawyerSubscriptionPage.tsx` — página existente, 100% estática a ser conectada
- `app/web/src/components/layout/AppShell.tsx` — onde o banner de expiração será inserido
- `app/web/src/App.tsx` — onde rota `/` será configurada para landing page
- `.planning/phases/01-fundacao-migracao/01-CONTEXT.md` — design system Sovereign Gilded

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `Lawyer.subscription_status` e `Lawyer.subscription_expires_at` — usar sem nova tabela
- `lawyerMW` — middleware para rota `/api/adv/subscription`
- Primitivos UI: `Card`, `GoldButton`, `GhostButton`, `PageContainer` — reutilizar na landing page
- `app/web/index.html` + `app/web/src/index.css` — estilos globais disponíveis na landing

### Established Patterns
- `lawyer.Dashboard` handler — padrão para `lawyer.GetSubscription`
- Frontend: `useEffect` + `api.get` + `useState` — padrão de carregamento de dados
- `AppShell.tsx` — ponto de inserção para banner global de expiração

### Integration Points
- `App.tsx`: rota `/` → `LandingPage` (novo componente) em vez de redirect para `/login`
- `auth.Register` (Fase 7 estendido): ao registrar advogado, setar `subscription_status='trial'` e `subscription_expires_at=NOW()+30d`
- `AppShell` do advogado: checar `subscription.status` e renderizar banner condicionalmente

</code_context>

<specifics>
## Specific Ideas
- Trial de 30 dias automático no cadastro — sem ação admin necessária para fase inicial
- Banner de expiração: não intrusivo, mas visível — no topo do layout, cor âmbar, link para renovação
- Landing page: separação ética OAB explícita (contador pago por serviço, não por indicação) deve aparecer na seção de planos ou FAQ

</specifics>

<deferred>
## Deferred Ideas
- Integração Stripe para pagamento automático — v2
- Email de aviso 7 dias antes da expiração — Fase posterior
- Bloqueio forçado após X dias expirado — posterior (MVP usa apenas banner)
- Página de admin para gestão de assinaturas com UI — posterior (admin usa endpoint direto)

</deferred>

---

*Phase: 12-landing-assinatura*
*Context gathered: 2026-05-15*
