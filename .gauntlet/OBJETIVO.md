# OBJETIVO — Ciclo 10 (fotografia e movimento)

O usuário olhou o resultado do ciclo 9 e disse: *"onde no layout modelo tem esse
monte de degradê? não está respeitando textura; está pobre nas animações"*. Ele
tem razão nas três coisas, e a causa é uma só: **o modelo é fotografia** — o
hero é uma foto de campo ao entardecer, o bento tem fotos dentro, o showcase é
uma grade de fotos com rótulo. A proibição de imagem, herdada dos ciclos 1–7,
obrigou a substituir foto por gradiente. Isso acabou.

## A restrição caiu (com regras)

Existem **10 fotos locais** em `app/web/public/landing/` (licença Pexels, ver
`CREDITS.md`). Elas são o material deste ciclo. Regras:

- Usar **estas** fotos (`/landing/<nome>.jpg` no src). Não baixar nada novo.
- Todo gradiente que hoje simula fotografia **vira fotografia** com um véu de
  cor por cima (overlay bordô/ink multiply ou gradiente de legibilidade), como
  o modelo faz. `mag-field` continua existindo como fallback/moldura, não como
  protagonista.
- Grain continua por cima das fotos (o modelo tem textura de compressão).

## Mapa foto → lugar (contrato; o juiz confere por `src`)

| Foto | Onde entra |
|---|---|
| `hero-campo.jpg` | fundo full-bleed do hero, com véu escuro no topo p/ nav e texto (como a foto do modelo) |
| `painel-retrato.jpg` | conteúdo central do `mag-painel` — o "rosto" grande do painel do modelo, atrás do painel de ferramenta em glass |
| `tile-advocacia.jpg`, `tile-laudo.jpg`, `tile-consentimento.jpg`, `tile-vitrine.jpg` | tiles do `mag-showcase` (foto + pill de rótulo, como "Advertising"/"Product shots") |
| `bento-advogado.jpg` | dentro do `bento-vinho` (thumbnail/fundo parcial com véu bordô) |
| `bento-contador.jpg` | dentro do `bento-teal` (idem, véu petróleo) |
| `fecho-campo.jpg` | fundo do `mag-fecho` com véu quente |
| `tile-suave.jpg` | livre: `mag-vitrine-grande` ou faixa que precisar de vida |

## Movimento (pacote completo)

O modelo se move. Adicionar, respeitando `prefers-reduced-motion` (tudo vira
estático sob reduce):

- **M7 ken-burns**: as fotos grandes (hero, fecho, vitrine-grande, painel) com
  zoom lento contínuo (scale 1→1.06, ~18s, alternando direção).
- **M8 hover-zoom**: tiles do showcase e cards do bento: foto escala 1.04 e véu
  clareia no hover (transition ~400ms).
- **M9 parallax sutil** no hero: campo/foto desloca ~6–10px contra o scroll
  (transform, não background-attachment).
- **M10 marquee**: os selos de `mag-hero-confianca` deslizam em loop contínuo
  lento (como a fila de logos do modelo).
- Stagger real nos reveals do bento (delays incrementais).

## Os dois números pendentes do ciclo 9 (continuam valendo)

- **Proporção escura ∈ [20,35]%** — as fotos com véu escuro devem resolver.
- **Contraste**: zerar a lista do `cycle-9/VEREDITO.md` (timestamps do rito,
  microtextos de mock). ≥4.5:1 por pixel.

## Escopo

Pode editar:
- `app/web/src/pages/LandingPage.tsx`, `app/web/src/components/landing/**`
- `app/web/src/components/ui/connexo-icons.tsx`
- `app/web/tailwind.config.js`, `app/web/src/index.css`, `app/web/index.html`
- `app/web/tests/*.test.mjs` (novos; os 10 existentes não podem enfraquecer)
- `.gauntlet/DESIGN-PLAN.md`

NÃO pode: baixar/gerar imagem nova; deletar as 10 fotos; Go; painéis;
`connexo-primitives.tsx`; `GoldButton`; os 10 testes existentes; commit/push.

## Critérios de êxito globais

- [ ] build 0; tsc ≤3; `node --test` ≥10 verdes; go ok
- [ ] As 10 fotos referenciadas (≥8 em uso real no DOM)
- [ ] Zero fetch externo em runtime (fotos servidas de `/landing/`)
- [ ] Sem overflow 375/768/1280; `<h1>` único; zero erro console
- [ ] Reduced-motion: nada invisível, ken-burns/marquee/parallax parados
- [ ] Congelados do c9 intactos: hue quente hero/fecho, h2 vinho, CTAs ink,
      top-3 ≤55%, ordem das seções, testids, glass ≥21, ctrl ≥14
