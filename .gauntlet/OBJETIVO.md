# OBJETIVO — Ciclo 8 (temperatura e vida das superfícies)

O ciclo 7 fechou paleta base, ordem das seções, animações e contraste. O usuário
olhou e disse: **ainda muito distante do modelo**. A auditoria visual lado a lado
explica por quê. Três distâncias restam, e nenhuma é de métrica de token — são de
**gestalt**:

## As três distâncias

### 1. Temperatura errada

O modelo (magnific.com) é **quente**. O hero é um campo bordô/rosa/salmão
(fotografia de campo ao entardecer); os títulos das seções claras são **vinho
escuro** (≈ `#40101E`), não preto; o bento tem cards bordô e azul-petróleo. A
nossa landing é **fria**: hero roxo/indigo/magenta, títulos quase-pretos,
gradientes azul/violeta por toda parte. Mesmo com `#F0F0E8` e `#141414`
idênticos, a página lê como outro produto.

O indigo `#5060E0` do vídeo é o acento **da UI do app** (sliders, botão
Generate) — vale dentro dos mocks. As superfícies de marketing do modelo são
bordô + magenta + preto + ivory.

### 2. Superfícies mortas

Modelo: 3 cores dominantes = 39.8% (tudo é atravessado por fotografia).
Connexo: 76.3% — ivory chapado e gradientes lisos. Sem poder usar imagem
externa, a saída é **campo de cor cinematográfico**: gradientes radiais
sobrepostos multi-parada + grain (SVG feTurbulence inline em data-URI) em toda
superfície grande, e cards sempre habitados por mocks/thumbnails.

### 3. Hero com formas erradas

No modelo, a lista de capacidades à direita é **texto grande e leve** (linhas
sem fundo, uma ativa com marcador ▶ magenta, as demais esmaecidas), e a faixa
de confiança ("Trusted by 1M+…" + logos) fica **dentro do hero**, na base,
sobre a fotografia. Na nossa, a lista virou cápsulas pretas gordas empilhadas —
a forma mais visível da página e a mais diferente do modelo.

## Escopo

Pode editar:
- `app/web/src/pages/LandingPage.tsx`
- `app/web/src/components/landing/**`
- `app/web/src/components/ui/connexo-icons.tsx`
- `app/web/tailwind.config.js`, `app/web/src/index.css`, `app/web/index.html`
- `app/web/tests/*.test.mjs` (novos; os 8 existentes não podem enfraquecer)
- `.gauntlet/DESIGN-PLAN.md`

NÃO pode editar:
- `.git/`, `.env*`, segredos; `.gauntlet/` exceto `DESIGN-PLAN.md`
- Qualquer arquivo Go; qualquer tela de painel; `app/web/dist/`
- `connexo-primitives.tsx`; a linha `sans` do tailwind
- Os 8 arquivos de teste existentes

## Critérios de êxito globais

- [ ] `npm run build` exit 0; `tsc` no máximo os 3 erros de baseline
- [ ] `node --test tests/*.test.mjs` exit 0 com **≥ 9** testes
- [ ] `go test ./...` (em `app/api`) exit 0
- [ ] Zero imagem externa, zero pacote npm novo (SVG inline/data-URI pode)
- [ ] Sem overflow em 375/768/1280; `<h1>` único; zero erro de console
- [ ] Nenhum texto abaixo de 4.5:1 por pixel (3:1 se ≥24px)
- [ ] Nenhum arquivo fora do Escopo em `git diff --name-only`

## Contrato de nomes (o juiz audita por estes)

- Classe CSS `mag-field` — campo de cor cinematográfico (gradiente multi-parada + grain)
- Classe CSS `mag-grain` — camada de grain
- `data-testid="mag-hero-confianca"` — faixa de confiança dentro do hero
- `data-testid="bento-claro" | "bento-ink" | "bento-vinho" | "bento-teal"` — os 4 cards do bento
- Token `mg-vinho` no tailwind — o tom de título das seções claras
- Todos os 15 `mag-*` do ciclo 7 continuam, na mesma ordem

## Fora de escopo

- Go, painéis, `GoldButton`, migrations, deploy, commit, push.
- Baixar imagem/vídeo ou instalar pacote.
