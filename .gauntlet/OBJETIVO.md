# OBJETIVO — Ciclo 3: fechar a lacuna com o tema (landing inteira + login/cadastro + internas)

O ciclo 2 portou o **topo** da landing literalmente e passou na auditoria
estrutural. O usuário olhou o resultado e apontou três coisas, todas
confirmadas com medição pelo juiz:

1. **A lista do hero está desalinhada e pula.** Três posições de texto
   distintas (767 / 737 / 770 px) porque o marcador `▶` entra e sai do
   fluxo conforme a animação troca o item ativo.
2. **Da metade da página para baixo o porte parou.** As 18 seções do
   modelo existem, mas (a) sobraram 4 blocos legados que o modelo não
   tem, deixando a página com 15.463px contra 9.132px do modelo (69% a
   mais), e (b) onde o modelo mostra **mockup da UI do produto**, o app
   mostra **foto de banco de imagem**.
3. **Login e cadastro não foram portados** — foram só repintados com a
   paleta nova, mantendo a estrutura antiga.

Além disso o juiz achou um bug não relatado: **o indicador das abas é
desenhado sobre a aba errada**.

Este ciclo fecha essas lacunas e estende o porte literal para as telas
internas.

## Método (igual ao ciclo 2, que funcionou)

Fonte de verdade: `.gauntlet/mockup-dom/*.html` — DOM real renderizado
das 9 páginas do tema, com todo `style="..."` inline preservado.

- Ignorar o primeiro bloco de cada arquivo (`data-dc-tpl="7"`, os links
  `Landing / Login / Cadastro / ...`): é o seletor de página da
  ferramenta de design, não faz parte do design.
- Converter `style="a: b"` → `style={{ a: 'b' }}` (camelCase),
  preservando valores literais (px, cor, gradiente, raio).
- Ler com `grep -n` + `sed -n '<ini>,<fim>p'`, nunca despejar o arquivo
  inteiro no console.
- **Atenção ao encoding:** o console desta máquina corrompe UTF-8. Texto
  em português (acento, `ç`, `—`) deve ser escrito direto no arquivo
  `.tsx`, nunca copiado através de saída de terminal. Conferir depois
  com `grep` que não sobrou mojibake (`Ã`, `Â`, `�`).

## Decisões já tomadas pelo usuário (não reabrir)

- **Blocos legados: REMOVER.** As seções `landing-personas` ("Três
  papéis, o mesmo processo" + Cliente/Advogado/Contador), `landing-rito`
  / "O expediente da perícia", "O rito completo, no painel" e "O que o
  expediente segura" saem. A landing passa a ter exatamente as seções do
  modelo.
- **Foto → mockup do produto.** Nos cards de "Comece simples" e "Da
  nomeação ao trânsito em julgado", entra mockup de UI (o repo já tem
  `MockShell`/`Mock*` em `components/landing/`), como no modelo. Foto de
  banco de imagem sobra só onde o modelo usa foto (hero; conferir o
  fecho no DOM antes de decidir).

## Escopo

Pode editar:
- `app/web/src/components/landing/**`
- `app/web/src/pages/LandingPage.tsx`
- `app/web/src/pages/LoginPage.tsx`, `RegisterPage.tsx`
- `app/web/src/components/layout/AppShell.tsx`
- `app/web/src/components/ui/connexo-primitives.tsx`, `connexo-icons.tsx`
- `app/web/src/components/dashboard/**`
- `app/web/src/pages/LawyerDashboard.tsx`, `AccountantDashboard.tsx`, `ClientDashboard.tsx`
- `app/web/src/pages/ClientsPage.tsx`, `ClientDetailPage.tsx`
- `app/web/src/pages/ProcessPage.tsx`, `LawyerProcessesPage.tsx`, `AccountantProcessesPage.tsx`
- `app/web/src/pages/adv/**`, `app/web/src/pages/acc/**`
- `app/web/src/pages/cli/CatalogPage.tsx`, `app/web/src/pages/ClientProcessDetail.tsx`
- `app/web/src/pages/public/AccountantPublicProfile.tsx`
- `app/web/src/index.css`
- `app/web/tests/landing-*.test.mjs` (ajuste justificado — ver T12)
- `app/web/public/landing/**` (só remover foto que deixou de ser usada, se for o caso)

NÃO pode editar:
- `.git/`, `.gauntlet/**` (inclusive `mockup-dom/`, que é referência), `.env*`, segredos
- `app/web/src/App.tsx`, `main.tsx`, `services/**`, `hooks/useAuth.tsx`, `app/api/**`
- `app/web/vite.config.ts` — **está temporariamente apontando o proxy para
  `https://connexo.ad.vlog.br` para o usuário conferir as telas internas.
  Não commitar, não "consertar" de volta, não tocar.**
- Arquivos de página duplicados/mortos: `pages/AccountantCatalogPage.tsx`,
  `pages/AccountantProcessDetail.tsx`, `pages/AccountantProfileEdit.tsx`,
  `pages/AccountantPublicProfile.tsx`, `pages/cli/ClientProcessDetail.tsx`,
  `pages/DashboardPage.tsx`

## Critérios de êxito globais

- [ ] `cd app/web && npx tsc --noEmit` — no máximo os 3 erros baseline de `pages/AccountantProcessDetail.tsx` (arquivo morto)
- [ ] `cd app/web && npm run build` — exit 0
- [ ] `cd app/web && node --test tests/*.test.mjs` — 0 falhas
- [ ] `git diff -- app/web/src/App.tsx app/web/src/main.tsx app/web/vite.config.ts 'app/web/src/services/**' 'app/api/**' app/web/src/hooks/useAuth.tsx` **vazio**
- [ ] Nenhum handler de submit/fetch/estado alterado nas telas internas — só apresentação
- [ ] Nenhum mojibake introduzido: `grep -rn 'Ã\|Â\|�' app/web/src --include=*.tsx` sem resultado novo

## Fora de escopo

- Não tocar rotas, API, auth, contratos de serviço
- Não adicionar dependência nova
- Não mudar as fontes já definidas (`theme-body` Hanken Grotesk / `theme-display` Figtree)
