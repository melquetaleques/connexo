# TAREFAS — Ciclo 2 (porte literal do HTML do tema)

Baseline: `node --test` 11/11 antes desta rodada (pode mudar — ver
Critérios de êxito globais no OBJETIVO.md). `tsc --noEmit` 3 erros
pré-existentes (arquivo morto). Ciclo 1 (painel) já aprovado e mantido
como base — não regredir paleta (`primary/secondary/surface/paper/ink` em
`tailwind.config.js`) nem a componentização (`StatCard`, `PageHeader`,
etc.).

Regra de leitura do mockup em toda tarefa abaixo: usar
`.gauntlet/mockup-dom/<arquivo>-dom-body.html`. Ignorar o primeiro bloco
(`data-dc-tpl="7"`, seletor de página da ferramenta). O design real
começa no `<section data-dc-tpl="20"...>` (ou equivalente nas outras
páginas). Converter `style="a: b; c: d"` → `style={{ a: 'b', c: 'd' }}`
(camelCase), preservando valores literais.

## T1 — Corrigir raio de borda global da landing (`.landing-pill`)

**Fazer:** em `app/web/src/index.css`, mudar `.landing-pill` de
`border-radius: 999px` para o raio que o modelo usa nos elementos
equivalentes (badges/botões/busca): **8px** (conferir em
`01-landing-dom-body.html` — elementos como o pill do topo do hero, os
botões `Acessar o expediente`/`Criar conta`, a caixa de busca usam
`border-radius: 8px`; só elementos genuinamente circulares, como o
quadrado do logo "C" que usa `border-radius: 7px` — não é pílula — e
avatares redondos de verdade, ficam com raio total). Auditar os outros
componentes `landing-glass*`/`mag-*` em `index.css` pelo mesmo critério
(comparar contra o mockup, não assumir).

**Êxito:** `grep -n "landing-pill" app/web/src/index.css` mostra
`border-radius: 8px` (ou o valor literal correto medido no mockup, com
comentário citando de onde veio); inspeção visual no dev server mostra
botões/badges da landing com cantos discretos, não pílula, exceto onde o
mockup usa pílula de fato.

**Verificar com:** `cd app/web && git diff src/index.css` + captura de tela do hero.

## T2 — Hero + nav (fundir, portar literal)

**Fazer:** em `01-landing-dom-body.html`, a partir do `<section
id="landing">`: o **nav real do site fica dentro do hero** (logo Connexo,
links `Expediente / Peritos / Recursos / Escritórios / Planos`, pílula de
busca "Buscar processo", `Entrar`, botão `Criar conta`) — não é uma barra
fixa/sticky separada. Portar essa estrutura para dentro de
`HeroSection()` em `LandingPage.tsx`, substituindo a `<MagNav />` atual
(fixa/sticky, com labels diferentes: `Produto/Papéis/Planos/Perguntas`).
Ligar cada item a uma rota/âncora real do app (Entrar→`/login`, Criar
conta→`/register` ou `#landing-personas` se não houver cadastro público
direto — usar o que já existe hoje), mantendo o texto/estrutura visual do
modelo. `MagNav.tsx` pode ser removido se não sobrar nenhum uso, ou
mantido só se outra página o importar (conferir com `grep -rn "MagNav"
app/web/src`).

**Êxito:** hero renderiza com nav integrado ao bloco vinho (não há barra
separada fixa no topo da landing); todos os 5 links + busca + Entrar +
Criar conta presentes; `git diff` não quebra nenhuma rota existente.

**Verificar com:** captura de tela em 1440×900 comparando com
`.gauntlet/mockup-dom/01-landing-dom-body.html` renderizado (pode servir
com `python -m http.server` a partir de `tema/Connexo paginas/` e abrir
`01 Landing.html` para conferir visualmente, ou usar a screenshot já
tirada pelo juiz como referência).

## T3 — Conteúdo e altura do hero

**Fazer:** portar do mockup: pílula do hero (`Perícia contábil judicial ·
CPC art. 465 →` — hoje é `Expediente com CRC à vista`), parágrafo
(`Todo o rito da prova pericial em um só lugar...` — hoje é texto
diferente), CTAs (`Acessar o expediente` + `▶ Por que Connexo?` — hoje é
`Escolher meu papel`/`Já tenho conta`; manter os `href`/`to` que já
funcionam no app, só trocar rótulo/estilo pro do modelo, a menos que o
rótulo atual já corresponda a uma ação real que o modelo não tem — nesse
caso manter o rótulo funcional e aplicar só o estilo). Altura do bloco
vinho: `min-height: 760px` (fixo, não `92vh`) no container do hero.

**Êxito:** textos batem com o mockup (ou justificativa registrada no
VEREDITO se um CTA precisou ficar funcional-diferente); `min-height` do
hero é um valor fixo em px, não unidade de viewport.

**Verificar com:** `git diff` do `HeroSection`/`MagHero.tsx`.

## T4 — Lista de capacidades do hero (coluna direita)

**Fazer:** `MagHeroLista.tsx` hoje mostra 5 itens de **produto**
(Catálogo com CRC, Consentimento LGPD, Timeline do rito, Laudo
versionado, Vitrine pública), ciclando a cada 1300ms. O modelo mostra 7
itens de **processo/rito** (Cadastrar o perito, Vincular com base legal,
Controlar prazos, **Redigir o laudo** [destacado], Responder quesitos,
Assinar e entregar, Publicar a vitrine — os 3 últimos com leve
indentação). Trocar o conteúdo do array `CAPS` para os 7 itens do modelo,
mantendo a lógica de ciclo/animação existente (isso conta como "aplicar
funcionalidade" sobre o HTML estático do modelo — pode manter a
auto-troca, não precisa virar estático).

**Êxito:** 7 itens presentes, textos batem com o modelo; animação
existente preservada (`prefers-reduced-motion` continua respeitado).

**Verificar com:** `git diff src/components/landing/MagHeroLista.tsx`.

## T5 — Trust strip do hero

**Fazer:** trocar as 4 badges atuais (`CRC LGPD OAB LAUDO`) pelos 6 nomes
de escritório do modelo (`Machado, Pereira & Costa, Duarte, Ribeiro
Perícias, Vale Norte, Aurora`) com o texto "Usado por 47 escritórios de
advocacia e contabilidade" acima — ver `MagConfianca.tsx`.

**Êxito:** texto e 6 nomes batem com o modelo.

**Verificar com:** `git diff src/components/landing/MagConfianca.tsx`.

## T6 — Seção "Um só lugar para todo o rito" / trilha LGPD

**Fazer:** localizar no mockup (`grep -n` por "Um só lugar" ou "trilha do
consentimento" em `01-landing-dom-body.html`) a seção com abas
(Vínculo/Prazos/Laudo Novo/Vitrine/LGPD no modelo — hoje `MagTabs.tsx` tem
`Catálogo/Consentimento/Timeline`, 3 abas em vez de 5) e o card escuro
com a demonstração de consentimento (campos "Escopo de documentos",
"Prazo de retenção", "Trilha de auditoria", "Revogação pelo cliente",
mini-preview de UI). Portar estrutura/raio/espaçamento; manter os dados
mockados que o componente atual já usa se forem equivalentes, só ajustar
para bater com os rótulos/quantidade de abas do modelo.

**Êxito:** 5 abas presentes com os rótulos do modelo; card de
demonstração com a mesma estrutura de campos.

**Verificar com:** `git diff src/components/landing/MagTabs.tsx src/components/landing/RitoChapter.tsx` (ou onde essa seção viver).

## T7 — Integrações, planos, módulos, FAQ, rodapé

**Fazer:** para cada seção restante do mockup (integrações
PJe/e-SAJ/Projudi/ICP-Brasil/Gov.br/CFC/OAB/Receita; "Comece simples,
escale quando o rito exigir"; grade de módulos; planos; FAQ; rodapé),
comparar a versão atual (`MagFerramentas.tsx`, `MagShowcase.tsx`,
`MagPlanos.tsx`, `MagFaq.tsx`, `MagRodape.tsx`, `MagPainel.tsx`,
`MagBento.tsx`) contra a seção correspondente em
`01-landing-dom-body.html` e portar raio/espaçamento/tipografia onde
divergir visivelmente (não precisa ser pixel-perfect, mas o raio de 8px
de T1 deve se propagar a todo canto/botão que hoje usa `landing-pill`
indevidamente).

**Êxito:** nenhuma seção da landing usa `border-radius: 999px` fora dos
casos genuinamente circulares do modelo (mesmo critério de T1).

**Verificar com:** `git diff src/components/landing/` completo + captura de tela da página inteira.

## T8 — Testes da landing

**Fazer:** os testes em `app/web/tests/landing-*.test.mjs` foram escritos
para a versão reinterpretada (ex.: podem checar que a lista do hero tem 5
itens de produto, não 7 de processo). Ajustar as asserções que ficaram
obsoletas pela mudança de conteúdo de T3/T4/T5/T6, **sem apagar
cobertura** — cada asserção removida precisa de uma equivalente nova no
lugar, checando o conteúdo/estrutura correta pós-porte.

**Êxito:** `node --test tests/*.test.mjs` verde; nenhum teste removido
sem substituto; diff de teste justificado linha por linha no VEREDITO.

**Verificar com:** `cd app/web && node --test tests/*.test.mjs` + `git diff tests/`.

## T9 — Ajuste do painel (raio/spacing, não recomeçar)

**Fazer:** o painel do ciclo 1 já está com a paleta e componentização
certas (não mexer nisso). Comparar `AppShell.tsx`,
`connexo-primitives.tsx` (Card/GoldButton/GhostButton) e o dashboard do
advogado/contador contra `04-painel-do-advogado-dom-body.html` /
`05-painel-do-perito-dom-body.html` — mesmo critério de raio de borda (o
modelo do painel provavelmente também usa cantos discretos, não pílula,
em cards/botões — conferir, não assumir) e espaçamento de sidebar/topbar.
Ajustar só o que divergir visivelmente; preservar toda prop/rota/lógica
do ciclo 1.

**Êxito:** raio de card/botão do painel bate com o mockup 04/05; nenhuma
regressão nas 9 tarefas já aprovadas no ciclo 1 (conferir `git diff` não
muda `NAV`/rotas/dados).

**Verificar com:** `git diff src/components/layout/AppShell.tsx src/components/ui/connexo-primitives.tsx` + captura de tela do painel.

## T10 — Regressão e integridade

**Fazer:** nada de novo — checagem contínua.

**Êxito:**
1. `cd app/web && npx tsc --noEmit` → só os 3 erros baseline.
2. `cd app/web && npm run build` → exit 0.
3. `cd app/web && node --test tests/*.test.mjs` → verde (conteúdo pode
   ter mudado por T8, mas 0 falhas).
4. `git diff -- app/web/src/App.tsx app/web/src/main.tsx 'app/web/src/services/**' 'app/api/**'` vazio.
5. Nenhum `data-testid` removido.
6. Amostragem de raio de borda (T1/T7/T9) confirmada pelo juiz, não só
   pelo executor.

**Verificar com:** os comandos acima, rodados pelo juiz.
