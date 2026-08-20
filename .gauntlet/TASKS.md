# TAREFAS — Ciclo 11 (2 pontos de contraste, e mais nada)

## APROVADO NO CICLO 10 — NÃO refazer, NÃO regredir

10 fotos no lugar certo, M7-M10 (ken-burns, hover-zoom, parallax, marquee),
reduced-motion limpo, temperatura, h2 vinho, CTAs ink, ordem das seções,
11 testes, glass 44, ctrl 17.

## F1 — Véu local sob `mag-hero-lista`

**Fazer:** os itens de texto da lista do hero (`Catálogo com CRC`, `Timeline
do rito`, etc.) caem sobre a região clara do céu na foto — quase ilegíveis.
Reforçar véu escuro **local** atrás da lista (não a página toda — o hero já
está com hue e escuridão corretos).

**Êxito:** contraste por pixel de cada item da lista ≥4.5:1, medido sobre
qualquer trecho da foto atrás (inclusive a faixa clara do céu).

## F2 — Legibilidade de "Quem autoriza o dado" e vizinhos na borda do bento

**Fazer:** rótulo `Quem autoriza o dado` (e qualquer rótulo irmão na mesma
borda de transição salmão-claro) está com texto quase invisível — claro sobre
claro. Escurecer o fundo local ou trocar a cor do texto.

**Êxito:** contraste ≥4.5:1 medido no ponto exato.

## Fora de escopo

Fotos, movimento, temperatura, bento, showcase, testes — todos aprovados e
congelados. Não tocar.

---

# (histórico) TAREFAS — Ciclo 10 (fotografia e movimento)

## E1 — Fotos no lugar (mapa do OBJETIVO)

**Êxito:** o juiz confere no DOM: `img`/`background-image` com
`/landing/hero-campo.jpg` no hero; `painel-retrato.jpg` no `mag-painel`; os 4
`tile-*.jpg` no showcase; `bento-advogado.jpg` e `bento-contador.jpg` nos
bentos; `fecho-campo.jpg` no fecho. ≥8 das 10 fotos em uso. Texto sobre foto
sempre com véu (contraste ≥4.5:1 por pixel).

## E2 — Movimento M7–M10

**Êxito por interação/inspeção:**
1. M7: hero/fecho/painel com animação CSS de scale (o juiz lê `animation` no
   computed style e vê transform mudar entre dois instantes).
2. M8: hover num tile muda `transform` da foto (scale >1.02).
3. M9: scroll de 300px desloca a camada do campo do hero (transform translate).
4. M10: marquee dos selos com `animation` contínua.
5. Com `reduced-motion`: as quatro param (animation none/paused), nada some.

## E3 — Proporção escura ∈ [20,35]% (pendente do c9)

**Êxito:** 58 faixas, limiar 0.25, entre 20 e 35% — com hue quente preservado.

## E4 — Contraste: zerar a lista do VEREDITO-9

**Êxito:** re-medição (2×, k-means, clipados fora): nenhum texto legível
< 4.5:1 (3:1 se ≥24px/ícone). Lista nominal no `cycle-9/VEREDITO.md`.

## E5 — Teste novo

`landing-fotos.test.mjs`: as 10 fotos existem em `public/landing/`; os TSX
referenciam ≥8; `CREDITS.md` presente; nenhuma URL `http` externa de imagem
nos TSX da landing. **Êxito:** `node --test` ≥11 verdes.

## Congelado (não tocar, não regredir)

Temperatura (hero/fecho quentes), h2 vinho, CTAs ink, bento 4 cores, ordem das
seções, testids, M1/M3/M5, glass ≥21, ctrl ≥14, 10 testes existentes.

---

# (histórico) TAREFAS — Ciclo 10 anterior (abortado a pedido do usuário)

## APROVADO ATÉ O CICLO 9 — NÃO refazer, NÃO regredir

Temperatura (hero 354.8°, fecho 357.4°), top-3 22.7%, h2 vinho `#40101E`,
CTAs de marketing ink, bento colorido com mocks, tiles do showcase, hero
recomposto, 10 testes, glass 40, ctrl 17, M1/M3/M5 verificados por interação.

## D1 — Proporção escura: 12.1% → [20, 35]%

**Fazer:** página clara demais. No modelo o hero é majoritariamente sombrio (a
fotografia é escura; o quente é rescaldo). Puxar as paradas escuras do
`landing-field-hero` para baixo — ink/bordô dominando até ~65% da altura,
salmão só como glow no pé; fecho idem; se precisar, aprofundar
`mag-vitrine-grande` e planos. **Sem** perder o hue quente (o juiz recheca
mediana em [330,360]∪[0,25]) e **sem** top-3 > 55%.

**Êxito:** 58 faixas de luminância, limiar 0.25 → escuro entre **20% e 35%**.

## D2 — Contraste: zerar a lista do VEREDITO-9

**Fazer:** subir para ≥4.5:1 por pixel: os 4 timestamps do rito (`08h17`,
`09h41`, `14h08`, `16h52`), `ABRIR VITRINE`, `Documento a documento…`,
`CRC 1SP-314567`, `4.7`/`4.9`, `Especialidade`, `Só concedidos`,
`Camila · OAB`, `Fila de processos recebidos`. Peso/opacidade/tom — não
esconder nem encolher: o juiz confere presença e visibilidade dos elementos.

**Êxito:** re-medição por pixel (2×, k-means, clipados fora) sem nenhum texto
legível < 4.5:1 (3:1 se ≥24px ou ícone).

---

# (histórico) TAREFAS — Ciclo 9 (destravar o campo colapsado)

## APROVADO NO CICLO 8 — NÃO refazer, NÃO regredir

T2 (hero recomposto: lista texto + ▶ magenta + badge + `mag-hero-confianca`),
T4 (bento colorido com mocks), T5 (tiles do showcase), T8 (9 testes), T9.
Rótulos caixa alta = 4 e CTA = 91% no `mock-ferramenta`. Glass 40, ctrl 17.

## C1 — Corrigir o colapso do `.mag-field` (causa raiz dos FAILs)

**Fazer:** `.mag-field` declara `position: relative` e vence o utilitário
`absolute` dos véus `mag-field ... absolute inset-0` — o juiz mediu
`.landing-field-hero` com `height: 0`. Remover o posicionamento da regra
`.mag-field` (mover para os usos-card) ou criar `.mag-veil` sem posicionamento
para os véus. O gradiente quente já escrito está correto — só não pinta.

**Êxito (o juiz mede):**
1. `.landing-field-hero` com `getBoundingClientRect().height` ≥ altura do hero.
2. Hue mediano dos pixels saturados do hero em [330,360]∪[0,25]; idem fecho.
3. Top-3 cores da página ≤ **55%**.
4. Proporção escura ∈ [20,35]%.

## C2 — `<h2>` de seção clara em `mg-vinho`

**Êxito:** cor computada de todos os `<h2>` sobre ivory com hue 330–350 e
L < 30% (hoje: `rgb(20,20,20)`).

## C3 — CTAs de marketing em ink (o indigo fica nos mocks)

**Fazer:** `MagBotao` primário nas superfícies de marketing (nav "Começar",
hero, bento, fecho) vira **preto/ink com texto branco** como o "Start creating"
do modelo; variante de contorno continua. Indigo `#5060E0` permanece só nos
controles dentro dos mocks.

**Êxito:** background computado de cada CTA de marketing sem hue em [220,250];
contraste do texto ≥4.5:1; os mocks continuam com seus controles indigo.

## C4 — Auditoria final (o juiz roda, o executor garante)

Contraste por pixel ≥4.5:1 (3:1 se ≥24px) em todos os textos; M3 (abas), M4
(comparador), M5 (carrossel) por interação; reduced-motion sem elemento
invisível; overflow 0 em 375/768/1280; zero erro de console; build 0; tsc ≤3;
`node --test` ≥9 verdes; go ok.

---

# (histórico) TAREFAS — Ciclo 8 (temperatura e vida)

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
