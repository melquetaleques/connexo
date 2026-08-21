# OBJETIVO — Aplicar o tema Connexo (painel e telas internas)

**Aplicar** — não reinventar — o tema definido em `tema/Connexo paginas/*.html`
em todo o app (painel do advogado, contador, cliente, login, cadastro,
clientes, processos, catálogo, perfil público e telas não mapeadas), na
estrutura de páginas/rotas atual. Depois de aplicado o visual, aplicar as
**animações** correspondentes (hover, transições, reveals) da mesma forma
que a landing já faz. Preservar 100% dos recursos programáticos (rotas,
chamadas de API, login/autenticação, lógica de negócio). Usar **princípios
SOLID e componentização** — extrair vocabulário repetido (cards, tabelas,
badges, cabeçalhos de página) em componentes reutilizáveis em vez de
duplicar JSX estilizado em cada página. Manter a segurança da aplicação
(não copiar `<script>`/HTML bruto do bundle do mockup, não usar
`dangerouslySetInnerHTML`, não expor segredo). Mudança **predominantemente
estética/UX/design** — zero alteração de rotas, API, autenticação ou
lógica de negócio.

## Contexto

- Referência de design (9 mockups HTML "bundled", grandes e não editáveis
  diretamente — servem só de referência visual): `tema/Connexo paginas/`:
  `01 Landing`, `02 Login`, `03 Cadastro`, `04 Painel do advogado`,
  `05 Painel do perito` (= papel **contador** no app), `06 Clientes`,
  `07 Processo`, `08 Catalogo`, `09 Perfil publico`.
- A landing (`LandingPage.tsx` + `components/landing/Mag*.tsx`) já foi
  retemada em 11 ciclos de gauntlet anteriores a partir do mesmo tema e
  **passa em 11/11 testes** (`app/web/tests/landing-*.test.mjs`). Ela fica
  **congelada** (não reabrir esse trabalho), mas os tokens de cor que ela
  cravou em `tailwind.config.js` (`mg-ink`, `mg-ivory`, `mg-vinho`,
  `mg-magenta`, `mg-indigo`) já são a paleta literal extraída do mesmo
  `tema/Connexo paginas/` — reusar esses hex é aplicar o tema, não
  reinterpretá-lo.
- Fonte do mockup (medida via browser real nos 9 arquivos): corpo em
  **Hanken Grotesk**, títulos/branding em **Figtree**. A landing não usa
  essas fontes (ficou em Plus Jakarta Sans/Cabinet Grotesk antes desta
  tarefa existir) — como ela está congelada, a inconsistência entre
  landing e painel é aceita por ora. Para todas as páginas **dentro do
  escopo desta tarefa**, aplicar Hanken Grotesk (corpo) e Figtree
  (headings/branding) como o mockup define — adicionar via Google
  Fonts/Fontshare (mesmo mecanismo de preconnect já usado em
  `index.html` para as fontes atuais) e configurar em
  `tailwind.config.js` como nova entrada de `fontFamily` (ex.:
  `theme-body`/`theme-display`), sem remover as entradas `sans`/`display`
  atuais (a landing ainda depende delas).
- O resto do app (painel/dashboard) hoje usa uma paleta **antiga e não
  relacionada** — navy `#000830` / dourado `#C59D5C` — definida em
  `theme.extend.colors.primary/secondary/surface/...` do
  `tailwind.config.js`. Esses tokens (`primary`, `secondary`, `surface`,
  `surface-1`, `surface-2`, `outline`, `paper`, `ink`) são usados por quase
  todo arquivo fora de `components/landing` (confirmado por grep: 40+
  arquivos). **Retemar essencialmente = trocar os valores hex desses
  tokens para a família wine/cream já validada na landing, sem renomear
  classes** — isso repinta a maior parte do app sem tocar em cada arquivo.
  Depois disso, ajustes estruturais pontuais (layout do `AppShell`,
  cards, tabelas, formulários) alinham cada tela ao mockup correspondente.
- Rotas reais (única fonte de verdade — `app/web/src/App.tsx`): há
  arquivos de página **duplicados e mortos** que NÃO são importados por
  `App.tsx` (ex.: `pages/AccountantProcessDetail.tsx` vs
  `pages/acc/AccountantProcessDetail.tsx` — só o segundo é usado; mesmo
  padrão para `AccountantCatalogPage.tsx`, `AccountantProfileEdit.tsx`,
  `AccountantPublicProfile.tsx`, `ClientProcessDetail.tsx`,
  `DashboardPage.tsx`). **Não editar os arquivos mortos** — perda de
  esforço e risco de "consertar" algo que nunca renderiza.
- Baseline medido nesta sessão (2026-08-20):
  - `node --test tests/*.test.mjs` → **11 passam, 0 falham**.
  - `npx tsc --noEmit` → **3 erros pré-existentes**, todos em
    `src/pages/AccountantProcessDetail.tsx` (arquivo morto, fora de rota).
    Não aumentar esse número; não é obrigatório zerá-lo (arquivo fora de
    escopo).
  - `npm run build` deve continuar funcionando (Vite).

## Escopo

Pode editar:
- `app/web/tailwind.config.js` (somente valores hex de
  `primary/secondary/surface/surface-1/surface-2/on-surface-variant/outline/paper/ink`;
  pode reaproveitar os hex já existentes de `mg-vinho/mg-ivory/mg-ink/mg-magenta/mg-indigo`)
- `app/web/src/index.css` (regras globais fora do bloco `.mag-*`/`.landing-*`, que ficam congelados)
- `app/web/src/components/ui/connexo-primitives.tsx`
- `app/web/src/components/ui/connexo-icons.tsx`
- `app/web/src/components/layout/AppShell.tsx`
- `app/web/src/components/dashboard/**`
- `app/web/src/components/marketplace/**`
- `app/web/src/components/lgpd/**`
- `app/web/src/components/shared/**` (exceto `ErrorBoundary.tsx` — só classes visuais, não a lógica de captura de erro)
- `app/web/src/pages/LoginPage.tsx`, `RegisterPage.tsx`
- `app/web/src/pages/LawyerDashboard.tsx`, `AccountantDashboard.tsx`, `ClientDashboard.tsx`
- `app/web/src/pages/ClientsPage.tsx`, `ClientDetailPage.tsx`
- `app/web/src/pages/ProcessPage.tsx`, `LawyerProcessesPage.tsx`, `AccountantProcessesPage.tsx`
- `app/web/src/pages/adv/LawyerProcessDetail.tsx`, `adv/LawyerSubscriptionPage.tsx`
- `app/web/src/pages/acc/AccountantProcessDetail.tsx`, `acc/AccountantProfileEdit.tsx`
- `app/web/src/pages/cli/CatalogPage.tsx` (rota real de `/cli/catalogo` e `/acc/catálogo-equivalente`, confira `App.tsx`)
- `app/web/src/pages/ClientProcessDetail.tsx` (rota real de `/cli/processos/:id` — **não** `pages/cli/ClientProcessDetail.tsx`, que é morto), `ClientDocumentsPage.tsx`, `ClientNotificationsPage.tsx`
- `app/web/src/pages/public/AccountantPublicProfile.tsx`
- `app/web/src/pages/PostsPage.tsx`, `ServicesPage.tsx`, `UsersPage.tsx`, `SettingsPage.tsx`, `NotFoundPage.tsx`, `PagePlaceholder.tsx`

NÃO pode editar:
- `.git/`, `.gauntlet/`, `.env*`, segredos
- `app/web/src/components/landing/**`, `app/web/src/pages/LandingPage.tsx` (congelado, já aprovado)
- Qualquer classe/regra `.mag-*` ou `.landing-*` em `index.css`
- Tokens `mg-ink`, `mg-ivory`, `mg-vinho`, `mg-magenta`, `mg-indigo`, `mg-blue`, `mg-warm` em `tailwind.config.js` (só leitura/reuso de valor)
- Arquivos de página duplicados/mortos (não importados em `App.tsx`):
  `pages/AccountantCatalogPage.tsx`, `pages/AccountantProcessDetail.tsx`,
  `pages/AccountantProfileEdit.tsx`, `pages/AccountantPublicProfile.tsx`,
  `pages/cli/ClientProcessDetail.tsx`, `pages/DashboardPage.tsx`.
- Qualquer arquivo em `app/api/**`, `app/web/src/services/**`, `hooks/useAuth.tsx`, `App.tsx`, `main.tsx` — nenhuma rota, chamada de API, contexto de auth ou lógica muda
- `data-testid`, nomes de função exportada, assinaturas de props públicas — não remover nem renomear

## Critérios de êxito globais

- [ ] `cd app/web && npx tsc --noEmit` sai com no máximo os 3 erros pré-existentes de `pages/AccountantProcessDetail.tsx` (arquivo morto) — nenhum erro novo em outro arquivo
- [ ] `cd app/web && npm run build` sai com exit 0
- [ ] `cd app/web && node --test tests/*.test.mjs` continua 11/11 verdes (a landing não pode regredir)
- [ ] `git diff --name-only` não toca nenhum arquivo fora do Escopo acima
- [ ] `git diff -- app/web/src/App.tsx app/web/src/main.tsx 'app/web/src/services/**' 'app/api/**'` vazio — nenhuma rota, endpoint ou contrato de API muda
- [ ] Nenhum `data-testid` existente foi removido (`git diff` só pode adicionar/mover, não apagar `data-testid=`)
- [ ] As 3 sidebars de papel (advogado/contador/cliente) continuam com os mesmos itens de navegação e mesmos `to=` de rota do `AppShell.tsx` atual — só o visual muda
- [ ] Nenhum arquivo novo/editado usa `dangerouslySetInnerHTML`, `eval`, ou HTML colado literalmente do bundle do mockup (`grep -rn "dangerouslySetInnerHTML\|<script" app/web/src` restrito aos arquivos do diff, deve ficar vazio)
- [ ] Componentização: nenhum padrão visual usado em ≥3 páginas (card de estatística, cabeçalho de página com busca, badge de status, tabela de linhas) fica reimplementado do zero em cada arquivo — deve existir um componente compartilhado importado pelas páginas que o usam

## Fora de escopo (não fazer)

- Não re-tocar a landing — já aprovada, congelada (incluindo sua fonte atual)
- Não deletar os arquivos de página duplicados/mortos — fora do escopo desta tarefa, mesmo que pareçam lixo
- Não adicionar dependências de UI novas (sem libs de componente novas); fontes novas só via Google Fonts/Fontshare (mesmo mecanismo já usado), nunca arquivo binário de fonte copiado do bundle do mockup
- Não mudar comportamento de formulários (validação, submit, mensagens de erro) — só aparência
- Não mudar `useAuth`, `ProtectedRoute`, lógica de roles/permissão
- Não copiar `<script>`, JSON de bundler ou base64 de fonte/imagem embutido nos arquivos `tema/Connexo paginas/*.html` para dentro do app — eles são só referência visual (abrir num servidor local + browser/devtools para extrair cor/estrutura), nunca `cat`/colar o arquivo inteiro
