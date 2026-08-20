# TAREFAS — Ciclo 8 (temperatura e vida)

## BASELINE (medido pelo juiz em 2026-08-20, antes do ciclo)

| Métrica | Valor |
|---|---|
| `npm run build` | exit **0** |
| `npx tsc --noEmit` | **3** erros (AccountantProcessDetail — não são da landing) |
| `node --test tests/*.test.mjs` | **8** testes, exit **0** |
| `go test ./...` em `app/api` | ok (db, handler, repository) |
| 3 cores dominantes da página | **76.3%** (modelo: 39.8%) |
| Proporção escura (58 faixas) | **19%** (modelo: 26%; faixa aceita 20–35%) |
| Hue mediano do campo do hero | frio (250–320°) — modelo: quente (340–20°) |
| Rótulos caixa alta no `mock-ferramenta` | **3** (pedia ≥4) |
| Largura do CTA do `mock-ferramenta` | **86%** (pedia ≥90%) |

---

## T1 — Temperatura: a página esquenta

**Fazer:**
1. Token novo `mg-vinho` ≈ `#40101E` (vinho dos títulos do modelo; pode calibrar
   ±10% de luminosidade). Todos os `<h2>` de seção clara passam de quase-preto
   para `mg-vinho`.
2. O campo do hero (`landing-field-hero`) refeito **quente**: base `mg-ink` no
   topo esmaecendo para bordô profundo (~`#3A1218`) e rosa/salmão (~`#C97563`,
   `mg-warm` serve) na metade inferior. Nada de roxo/indigo no hero.
3. O fecho (`mag-fecho`) ganha o mesmo tratamento quente (modelo: banda
   bordô→rosa no "Be Magnific").
4. Indigo `#5060E0` continua **apenas dentro dos mocks** (sliders, toggles,
   botão de painel) — nas superfícies de marketing, os acentos são
   `mg-magenta` e o vinho.

**Êxito (o juiz mede no PNG e no computed style):**
1. Hue mediano dos pixels saturados (S>15%) do hero está em **[330°,360°]∪[0°,25°]**.
2. `getComputedStyle` de todos os `<h2>` em seção `bg-mg-ivory`: cor com hue
   330–350 e L < 30% (não `#141414`, não preto puro).
3. `grep` de classes `indigo|violet|purple` em `MagHero*`, `MagFecho`,
   `landing-field-hero` = 0 usos de indigo fora de mocks.
4. Fecho: hue mediano do campo também quente ([330,360]∪[0,25]).

## T2 — Hero recomposto nas formas do modelo

**Fazer:**
1. `mag-hero-lista`: as cápsulas pretas morrem. Viram **linhas de texto**
   grandes (≥1.6rem), sem background, brancas; a ativa com opacidade 1 e
   marcador **▶ magenta** à esquerda; as demais a ~35–55% de opacidade. O ciclo
   de ativação (M1) continua.
2. Faixa de confiança **dentro do hero**: `data-testid="mag-hero-confianca"`,
   na base da seção, com a frase de tração + os 4 selos (CRC, LGPD, OAB, laudo
   versionado) em texto/monograma esmaecido sobre o campo — como a fila de
   logos do modelo. O `mag-confianca` externo (a faixa abaixo do hero) **sai da
   página** e seu testid é reaproveitado se quiser, mas a ordem das seções
   passa a ser: `mag-hero` (contendo `mag-hero-confianca`) → `mag-tabs` → …
3. O badge "Ranked #1…" do modelo vira um badge equivalente do Connexo acima do
   `<h1>` (pill translúcido com texto curto).

**Êxito:**
1. Itens de `mag-hero-lista`: `background-color` computado com alpha < 0.1;
   font-size ≥ 1.55rem; item ativo contém marcador com cor `mg-magenta`.
2. `mag-hero-confianca` existe, é descendente de `[data-testid="landing-hero"]`
   e tem ≥4 selos.
3. M1 (ciclo automático) segue: com página parada, o item ativo muda sozinho.
4. Badge acima do `<h1>` presente (elemento antes do h1 dentro do hero).

## T3 — Superfícies vivas (mata a planura)

**Fazer:**
1. Classe `mag-field`: campo de cor com **≥3 paradas** (radial/conic sobreposto)
   e camada `mag-grain` (SVG `feTurbulence` inline como data-URI, opacidade
   0.04–0.10, `background-repeat`). Aplicar aos: hero, fecho, card
   `mag-vitrine-grande`, cards do bento, tiles do showcase, e um véu de grain
   sutil sobre as grandes áreas ivory.
2. Nenhuma seção pode ser um retângulo de cor única de viewport inteira: toda
   seção clara tem cards, mocks ou campo com variação.

**Êxito:**
1. Soma das 3 cores dominantes da captura de página inteira (com reveals
   disparados) ≤ **55%**.
2. `mag-grain` aparece ≥6 vezes no DOM.
3. `mag-field` aparece ≥6 vezes no DOM.

## T4 — Bento habitado e colorido (como "Start simple")

**Fazer:** os 3 cards de persona do bento hoje são branco/preto chapados. No
modelo, cada card do bento tem **cor própria e um mock dentro**. Recompor:

- `bento-claro` (cliente): cinza-claro/ivory, contém `MockConsentimento` em
  miniatura (scale/clip) com chip de rótulo sobreposto.
- `bento-ink` (o card largo escuro): preto, contém o mock com traço de fluxo —
  reaproveitar `MockTimeline`, com rótulos flutuantes coloridos (chips magenta
  e indigo como os cursores "Paolo"/"Marina" do modelo).
- `bento-vinho` (advogado): fundo bordô profundo (`#3A1218`~), texto claro,
  mini-mock dentro.
- `bento-teal` (contador): fundo azul-petróleo (~`#1C6D8C`, calibrável), com
  `MockVitrine` e um pill de destaque contornado em magenta (o "RUN APP").

Conteúdo dos personas (dor, benefício, funcionalidades, CTAs e os 20
`data-testid` de persona) **preservado** — redistribuído nesses cards.

**Êxito:**
1. Os 4 testids `bento-*` existem dentro de `mag-bento`.
2. Cada um contém um descendente `data-testid^="mock-"` ou mock real da pasta
   `landing/` (o juiz confere por DOM).
3. Backgrounds dos 4 diferem: ΔHue par-a-par ≥ 25° ou ΔL ≥ 30% (medido).
4. Os 20 testids de persona + 3 CTAs de rota continuam presentes.

## T5 — Showcase como grade de tiles com rótulo (como "From product shot")

**Fazer:** `mag-showcase` vira grade assimétrica de tiles (2 grandes + 1 largo,
ou 3+1): cada tile é um `mag-field` (paletas distintas — bordô, azul, ink,
rosa) contendo um mini-mock e um **pill de rótulo sobreposto no canto
inferior-esquerdo** (como "Advertising", "Product shots" do modelo).

**Êxito:**
1. ≥4 tiles; cada tile tem `mag-field` e um pill posicionado absoluto no
   quadrante inferior-esquerdo (o juiz mede `getBoundingClientRect`).
2. Hues dos tiles: pelo menos 3 hues distintos (Δ ≥ 25°).

## T6 — Fechar os marginais do ciclo 7

**Fazer:**
1. `mock-ferramenta`: 4º rótulo em caixa alta (letter-spacing ≥0.08em); CTA a
   ≥90% da largura do painel.
2. Proporção escura da página de volta à faixa **20–35%** (hoje 19%) — o bento
   escuro/vinho/teal do T4 já deve resolver; conferir.
3. Os 4 textos medidos a 4.48:1 sobem folgados de 4.5:1 (subir opacidade/peso).

**Êxito:** juiz remede os três números: rótulos=4, CTA≥90%, escuro∈[20,35],
zero texto <4.5:1.

## T7 — Preservar o aprovado do ciclo 7 (NÃO refazer, NÃO regredir)

**Êxito:**
1. Ordem das seções no DOM: `mag-hero` → `mag-tabs` → `mag-painel` →
   `mag-strip` → `mag-bento` → `mag-ferramentas` → `mag-showcase` →
   `mag-vitrine-grande` → `mag-planos` → `mag-faq` → `mag-fecho` → `mag-rodape`
   (com `mag-hero-confianca` dentro do hero; seções `landing-rito`,
   `landing-quebra-clara` continuam entre showcase e planos como hoje).
2. Animações M1–M6 por interação real; `reduced-motion` limpo.
3. `backdrop-filter` ≥ 21; `data-ctrl` ≥ 14; chips ≥ 17; painéis ≥ 100.
4. Base clara `#F0F0E8` e escura `#141414` continuam as duas cores de fundo.
5. Geist; `font-sans` e `GoldButton` intocados; zero ouro na landing.
6. Os 8 testes existentes verdes, sem edição.

## T8 — Teste do tom

**Fazer:** `app/web/tests/landing-tom.test.mjs`, teste
`"landing usa a temperatura e as superficies do modelo"`, sobre o fonte:

1. `mg-vinho` existe no tailwind config.
2. `mag-field` e `mag-grain` definidos em `index.css` e usados ≥6 vezes nos TSX.
3. `mag-hero-confianca` e os 4 `bento-*` presentes nos TSX.
4. Zero cápsula: `MagHeroLista` não contém classes `bg-mg-ink`/`bg-black` em
   itens de lista.
5. `feTurbulence` presente em `index.css` (o grain é real, não cor chapada).

**Êxito:** `node --test tests/*.test.mjs` exit 0 com **≥ 9** testes.

## T9 — DESIGN-PLAN

**Fazer:** adicionar ao `.gauntlet/DESIGN-PLAN.md` as seções `## Temperatura
(ciclo 8)` — mapa de onde cada família de cor pode aparecer — e `## Campos de
cor` — receita do `mag-field`/`mag-grain`.

**Êxito:** os dois títulos presentes.
