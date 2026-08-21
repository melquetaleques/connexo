# TAREFAS — Reforma visual do painel

Baseline medido (2026-08-20): `node --test` 11/11 verdes; `tsc --noEmit` 3
erros pré-existentes (todos em `pages/AccountantProcessDetail.tsx`, arquivo
morto fora de rota). Nenhuma tarefa abaixo pode piorar esses números.

Paleta de referência (extraída por inspeção real do navegador nos mockups
`tema/Connexo paginas/*.html` — os arquivos são bundles gigantes, não abra
como texto; se precisar reabrir, sirva com um servidor local e inspecione
via devtools/computed style):

- Fundo/paper: cream `rgb(243,241,237)` ≈ `#F3F1ED` (perto do `mg-ivory` já existente)
- Ink/texto: `rgb(28,27,26)` ≈ `#1C1B1A` (perto do `mg-ink` já existente)
- Wine/chrome escuro (sidebar, headers, botão primário): `rgb(74,15,27)` ≈ `#4A0F1B` (família do `mg-vinho` já existente, `#40101E`)
- Accent marrom/dourado suave: `rgb(154,90,43)` ≈ `#9A5A2B`
- Accent magenta/flare (destaque, badges, links ativos): `rgb(193,30,99)`/`rgb(255,77,141)` (família do `mg-magenta` já existente)
- Accent azul (links, badges informativos): `rgb(43,78,168)` (família do `mg-indigo` já existente)
- Bordas/superfícies neutras: `rgb(234,231,226)`, `rgb(228,226,222)`
- Raios de borda observados: `8px`, `12px`, `14px`, `16px`, `20px`, `24px`, pílulas `999px`

Regra geral de todas as tarefas: **reusar os tokens `mg-*` já definidos em
`tailwind.config.js` como fonte dos novos valores de `primary/secondary/
surface/outline/paper/ink`** em vez de inventar hex novos soltos — mantém
uma única fonte de paleta no repo. Aplicar o tema é copiar cor/estrutura
real do mockup correspondente, não estilizar "no espírito de".

Toda tarefa de página (T2 em diante) inclui, nesta ordem: **1) tema**
(cor/tipografia/estrutura do mockup), **2) animação** (hover, transição de
estado, entrada/reveal — o que o mockup sugere ou, quando o mockup é
estático, o padrão já usado na landing: `transition`, `hover:scale`,
reveal on-mount), sempre respeitando `prefers-reduced-motion` como a
landing já faz (ver `mag-*` em `index.css` para o padrão). **3)
componentização**: se o mesmo padrão visual aparece em outra tarefa,
extrair para um componente compartilhado em vez de duplicar.

## T1 — Fundação: paleta, tipografia e primitivos compartilhados

**Fazer:**
1. Em `tailwind.config.js`, trocar os valores hex de `primary`,
   `secondary`, `surface`, `surface-1`, `surface-2`, `on-surface-variant`,
   `outline`, `paper`, `ink` para a família wine/cream acima (reaproveitando
   `mg-vinho`/`mg-ivory`/`mg-ink`/`mg-magenta`/`mg-indigo` como base).
2. Adicionar Hanken Grotesk (corpo) e Figtree (headings) via Google
   Fonts/Fontshare em `index.html` (mesmo padrão de `<link rel="preconnect">`
   já usado) e registrar em `tailwind.config.js` como novas entradas de
   `fontFamily` (não remover `sans`/`display` atuais — a landing depende
   delas).
3. Reskinar `app/web/src/components/ui/connexo-primitives.tsx` (`Icon`,
   `Avatar`, `Card`, `GoldButton`, `GhostButton` e qualquer outro
   primitivo — inputs, badges, se existirem) e `connexo-icons.tsx`:
   nova paleta, novas fontes, vocabulário visual do mockup (glass sutil,
   raios generosos, sombras suaves), transições `hover`/`active` nos
   elementos interativos (botão, card clicável) — sem mudar nome de
   nenhuma prop, export ou `data-testid`.

**Êxito:**
1. `git diff app/web/tailwind.config.js` mostra os 9 tokens de cor com
   novos valores hex (nenhuma chave removida) + no máximo 2 novas entradas
   de `fontFamily` adicionadas (nenhuma das existentes removida).
2. `grep -c "mg-vinho\|mg-ivory\|mg-ink\|mg-magenta\|mg-indigo" tailwind.config.js` no diff evidencia reuso (não hex soltos novos fora dessa família nos 9 tokens de cor).
3. `index.html` ganha `<link>`/`<style>` de Hanken Grotesk e Figtree seguindo o mesmo padrão de preconnect já existente; nenhum link de fonte atual foi removido.
4. `Icon`, `Avatar`, `Card`, `GoldButton`, `GhostButton` continuam exportados com a mesma assinatura de props (`grep -n "export function"` antes/depois idêntico em nomes e parâmetros).
5. Pelo menos `GoldButton`/`GhostButton`/`Card` (quando clicável) têm classe `transition` + estado `hover:`/`active:` visível (inspeção do JSX).
6. `tsc --noEmit` não piora (ver critério global).

**Verificar com:** `cd app/web && npx tsc --noEmit && git diff tailwind.config.js index.html src/components/ui/connexo-primitives.tsx src/components/ui/connexo-icons.tsx`

## T2 — AppShell (sidebar e topbar dos 3 papéis + admin)

**Fazer:** reskinar `app/web/src/components/layout/AppShell.tsx` para a
estrutura dos mockups `04 Painel do advogado.html` / `05 Painel do
perito.html`: sidebar escura (wine) com branding, nav com pílulas/ícones,
cartão de plano, avatar+nome no rodapé; topbar clara com busca e saudação.
Aplicar para os 4 papéis (`advogado`, `contador`, `cliente`, `admin`) —
cliente e admin não têm mockup dedicado, adequar ao mesmo vocabulário
(mesma sidebar wine, mesmos componentes, cores/labels do papel mantidos).
Aplicar transição no item de nav ativo/hover (destaque suave, não só
mudança abrupta de cor) e microtransição no logout/avatar, respeitando
`prefers-reduced-motion`.

**Êxito:**
1. `NAV` (itens de navegação por papel) e `ROLE_LABELS` continuam com as
   mesmas entradas `to=`/rotas de hoje — `git diff` só muda className/JSX
   de apresentação, não a lista de rotas nem `useAuth()`/`logout`.
2. Sidebar renderiza com fundo da família wine (`bg-primary` após T1, ou
   classe equivalente) nas 3 rotas de teste manual: `/adv/dashboard`,
   `/acc/dashboard`, `/cli/dashboard` (verificar via browser/dev server).
3. Nenhum item de nav sumiu (mesmo `.length` de `NAV[role]` antes/depois).
4. Item de nav ativo/hover tem `transition` no className; com
   `prefers-reduced-motion: reduce` simulado no browser, a transição
   desaparece mas o item continua visível/clicável.

**Verificar com:** `cd app/web && git diff src/components/layout/AppShell.tsx` + inspeção visual no dev server nas 3 rotas.

## T3 — Login e Cadastro

**Fazer:** reskinar `app/web/src/pages/LoginPage.tsx` e `RegisterPage.tsx`
seguindo `02 Login.html`/`03 Cadastro.html`: split screen com painel de
marca à esquerda (stats "320+ Perícias entregues" etc. viram dados reais
ou genéricos do app, não hardcode fictício se já existir dado real) e
formulário à direita em cartão claro. Manter todos os `<input>`,
`name`/`type`, validação, chamadas a `useAuth`/serviços de login/registro
intactas — só JSX de apresentação. Aplicar transição de foco em input e
estado de loading do botão de submit (se já existir estado de loading no
componente, só estilizar; não criar estado novo).

**Êxito:**
1. `git diff` nesses 2 arquivos não toca nenhuma chamada a hook de auth,
   `fetch`/`axios`, `onSubmit`, nem remove nenhum campo de formulário
   existente (mesmo conjunto de `name=`/`type=` de inputs antes/depois).
2. Fluxo de login continua funcional: digitar credencial e submeter dispara
   a mesma função de submit de antes (checar visualmente no dev server:
   erro de credencial inválida ainda aparece).

**Verificar com:** `cd app/web && git diff src/pages/LoginPage.tsx src/pages/RegisterPage.tsx` + teste manual de submit no dev server.

## T4 — Dashboards (advogado, contador, cliente)

**Fazer:** reskinar `LawyerDashboard.tsx`, `AccountantDashboard.tsx`,
`ClientDashboard.tsx` (e `components/dashboard/ActivityChart.tsx` se
usado) seguindo o padrão dos mockups 04/05: saudação, cards de estatística
em grade, tabela "próximos prazos", "ações rápidas", lista de
vínculos/peritos, banner de vitrine. `ClientDashboard` não tem mockup —
usar o mesmo vocabulário de cards/stat/tabela adequado ao papel cliente.
Extrair o card de estatística ("Total de clientes", "38", etc.) como
componente compartilhado (ex. `StatCard` em `connexo-primitives.tsx` ou
`components/dashboard/`) reusado pelos 3 dashboards — não duplicar o
mesmo JSX 3 vezes. Aplicar reveal leve de entrada nos cards (fade/translate
curto, tipo já usado no bento da landing) respeitando `prefers-reduced-motion`.

**Êxito:**
1. Toda chamada a serviço/hook de dados (`useEffect`, chamadas a
   `services/*`) permanece idêntica — `git diff` só no JSX de apresentação
   e classes.
2. Os números/dados exibidos continuam vindo do estado carregado (não
   hardcoded) — nenhum `useState`/prop de dado real foi substituído por
   texto fixo.
3. Visual: cards de estatística com cantos arredondados e paleta wine/cream, sidebar do AppShell (T2) coerente.
4. Existe um componente de card de estatística importado pelos 3
   dashboards (`grep -rn "StatCard\|from.*dashboard" src/pages/*Dashboard.tsx` mostra o mesmo import nos 3 arquivos) — não 3 implementações JSX inline divergentes.

**Verificar com:** `cd app/web && git diff src/pages/LawyerDashboard.tsx src/pages/AccountantDashboard.tsx src/pages/ClientDashboard.tsx src/components/dashboard` + inspeção visual.

## T5 — Clientes (lista e detalhe)

**Fazer:** reskinar `ClientsPage.tsx` e `ClientDetailPage.tsx` seguindo
`06 Clientes.html` (tabela/lista de clientes com busca, cartão de
detalhe com processos vinculados). Aplicar hover de linha na tabela e
transição no campo de busca/filtro.

**Êxito:** `git diff` só altera classes/estrutura visual; toda função de
busca/filtro/paginação e toda chamada a API permanece com o mesmo
comportamento (testar digitando na busca no dev server e conferindo que
filtra igual a antes).

**Verificar com:** `cd app/web && git diff src/pages/ClientsPage.tsx src/pages/ClientDetailPage.tsx` + teste manual de busca.

## T6 — Processos (lista e detalhe, 3 papéis)

**Fazer:** reskinar `ProcessPage.tsx`, `LawyerProcessesPage.tsx`,
`AccountantProcessesPage.tsx`, `adv/LawyerProcessDetail.tsx`,
`acc/AccountantProcessDetail.tsx`, `ClientProcessDetail.tsx` seguindo
`07 Processo.html` (timeline do rito, quesitos, versões de laudo, cards de
prazo). Manter consistência visual entre os 3 papéis (mesma estrutura de
timeline/cards, cores de estado iguais entre telas) — extrair o card de
prazo/timeline como componente compartilhado reusado nos 3 papéis, não
triplicado. Aplicar transição na troca de versão do laudo/timeline (o que
já existir de estado de UI, só animar a troca visual).

**Êxito:** `git diff` preserva toda lógica de fetch/mutação (upload de
laudo, resposta de quesito, mudança de status) — só classes/estrutura
visual mudam. Nenhum handler de clique/submit removido (mesma contagem de
`onClick=`/`onSubmit=` por arquivo antes/depois, salvo se um vira outro
elemento semanticamente equivalente — justificar no VERIFY).

**Verificar com:** `cd app/web && git diff src/pages/ProcessPage.tsx src/pages/LawyerProcessesPage.tsx src/pages/AccountantProcessesPage.tsx src/pages/adv/LawyerProcessDetail.tsx src/pages/acc/AccountantProcessDetail.tsx src/pages/ClientProcessDetail.tsx`

## T7 — Catálogo e Perfil público

**Fazer:** reskinar `cli/CatalogPage.tsx` seguindo `08 Catalogo.html`
(grade de cartões de contador/perito com filtro) e
`public/AccountantPublicProfile.tsx` seguindo `09 Perfil publico.html`
(perfil com foto, credenciais CRC, avaliações, CTA de contato). Aplicar
hover-zoom nos cartões do catálogo (igual ao showcase da landing) e
transição no CTA de contato do perfil, respeitando `prefers-reduced-motion`.

**Êxito:** `git diff` preserva toda chamada a API de listagem/filtro e
toda lógica de roteamento por `slug`. Teste manual: abrir
`/cli/catalogo` e `/contadores/:slug` (com um slug real do backend/mock)
renderiza sem erro no console.

**Verificar com:** `cd app/web && git diff src/pages/cli/CatalogPage.tsx src/pages/public/AccountantPublicProfile.tsx` + teste manual nas 2 rotas, checar `read_console_messages` sem erro novo.

## T8 — Telas sem mockup dedicado

**Fazer:** adequar ao vocabulário visual já estabelecido em T1/T2 (cards,
botões, cores, radius) as telas que não têm mockup próprio:
`PostsPage.tsx`, `ServicesPage.tsx`, `UsersPage.tsx`, `SettingsPage.tsx`,
`NotFoundPage.tsx`, `acc/AccountantProfileEdit.tsx`,
`adv/LawyerSubscriptionPage.tsx`, `ClientDocumentsPage.tsx`,
`ClientNotificationsPage.tsx`. Sem mockup para copiar 1:1 — usar os
mesmos primitivos de T1 (`Card`, `GoldButton`, etc.) para que fiquem
visualmente da mesma família das telas mapeadas.

**Êxito:** cada uma dessas páginas usa pelo menos um primitivo de
`connexo-primitives.tsx` (import presente) em vez de HTML cru estilizado
do zero; nenhuma lógica de submit/fetch/estado alterada (`git diff` só
classes/JSX de apresentação).

**Verificar com:** `cd app/web && git diff src/pages/PostsPage.tsx src/pages/ServicesPage.tsx src/pages/UsersPage.tsx src/pages/SettingsPage.tsx src/pages/NotFoundPage.tsx src/pages/acc/AccountantProfileEdit.tsx src/pages/adv/LawyerSubscriptionPage.tsx src/pages/ClientDocumentsPage.tsx src/pages/ClientNotificationsPage.tsx`

## T9 — Regressão e integridade (checar em todo cycle, não só no fim)

**Fazer:** nada de novo — é checagem contínua do que as tarefas acima não
podem quebrar.

**Êxito:**
1. `cd app/web && npx tsc --noEmit` → só os 3 erros baseline de
   `pages/AccountantProcessDetail.tsx`.
2. `cd app/web && npm run build` → exit 0.
3. `cd app/web && node --test tests/*.test.mjs` → 11 passam, 0 falham.
4. `git diff --name-only` não inclui nenhum arquivo fora do Escopo do OBJETIVO.md.
5. `git diff -- app/web/src/App.tsx app/web/src/main.tsx 'app/web/src/services/**' 'app/api/**'` vazio.
6. Nenhuma linha `data-testid=` removida em relação ao commit de checkpoint (`git diff <checkpoint> | grep '^-.*data-testid'` vazio).
7. Segurança: `git diff <checkpoint> | grep -i "dangerouslySetInnerHTML\|<script"` vazio nos arquivos tocados.
8. Componentização: nenhum dos padrões repetidos (card de estatística, card de prazo/timeline, cabeçalho de página com busca) tem 3+ implementações JSX divergentes entre os arquivos tocados — checar por import compartilhado (ver Êxito de T4/T6).

**Verificar com:** os 8 comandos/checagens acima, rodados pelo juiz — não reaproveitar a alegação do executor.
