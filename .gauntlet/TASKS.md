# TAREFAS — Ciclo 3

Baseline atual (medido pelo juiz agora, com o app rodando em
`localhost:5173` e o tema em `localhost:8931`):

- `node --test` 12/12 verdes · `tsc` 3 erros baseline (arquivo morto) · `build` exit 0
- Altura da landing: **app 15.463px** vs **modelo 9.132px**
- Fotos em uso na landing: 11 elementos apontando para `/landing/*.jpg`
- Modelo usa: **1** background-image (hero 1265×760) + 11 `<img>` que são
  **mockups de UI do produto**, não fotografia

## APROVADO NO CICLO 2 — não refazer, não regredir

Raio (`.landing-pill` 8px / `.landing-capsule` 999px), nav dentro do hero
não-sticky, texto do hero (pill CPC 465, headline, parágrafo, CTAs), 7
itens da lista, trust strip com os 6 escritórios, 5 abas, paleta e fontes,
`AppShell` com raio ajustado, `StatCard` compartilhado nos 3 dashboards.

---

## F1 — Alinhamento da lista do hero

**Fazer:** hoje o texto dos 7 itens assume **três** posições diferentes e
**pula** quando a animação troca o item ativo, porque o marcador `▶` entra
e sai do fluxo. Medido agora no app:

| item | textLeft | padding-left |
|---|---|---|
| Cadastrar o perito (ativo no instante da medição) | **767** | 0 |
| Vincular com base legal | 737 | 0 |
| Controlar prazos | 737 | 0 |
| Redigir o laudo | 737 | 0 |
| Responder quesitos | **770** | 33px |
| Assinar e entregar | 770 | 33px |
| Publicar a vitrine | 770 | 33px |

O modelo (`01-landing-dom-body.html`, `data-dc-tpl` 56→63) tem só **duas**
posições, estáticas: itens 1–3 rentes à esquerda; item 4 é um flex com o
`▶` (gap 14px) e itens 5–7 com `padding-left: 33px` — ou seja, o texto dos
itens 4–7 alinha 33px à direita dos itens 1–3, e **nada se move**.

Manter a animação de destaque (é a "funcionalidade sobre o HTML"), mas o
marcador tem que viver numa calha de largura reservada, aparecendo e
sumindo por opacidade — nunca empurrando o texto.

**Êxito:** com o app rodando, medir `getBoundingClientRect().left` do
elemento de texto dos 7 itens em **dois instantes diferentes** (≥1,5s de
intervalo, para o item ativo ter trocado):
1. Em cada instante, os 7 valores assumem **exatamente 2 valores
   distintos**: itens 1–3 num valor `L`, itens 4–7 em `L + 33` (±1px).
2. Os valores do primeiro instante são **idênticos** aos do segundo — o
   texto não se move quando o item ativo troca.

**Verificar com:** snippet no browser medindo os 7 `left` duas vezes.

## F2 — Indicador das abas na aba errada

**Fazer:** em `MagTabs.tsx` o indicador (a pílula escura) é desenhado
sobre a aba errada. Medido agora: indicador em `left: 384, width: 86`,
mas a aba ativa é **LGPD** em `left: 804, width: 81`. Resultado visual:
"Vínculo" fica com texto escuro sobre pílula escura, ilegível, e a aba
ativa não tem realce. Causa provável: `baseW`/`offsetLeft` capturados em
`useLayoutEffect` antes de fonte/layout assentarem, e nunca recalculados.

**Êxito:**
1. Na carga da página, o retângulo do indicador coincide com o da aba
   ativa (diferença ≤2px em `left` e em `width`).
2. Clicando cada uma das 5 abas, o indicador acompanha (mesma tolerância).
3. Nenhum rótulo de aba fica com contraste < 4.5:1 contra o fundo que
   está atrás dele (o caso "texto escuro sobre pílula escura" não volta).

**Verificar com:** medição dos dois retângulos no browser, na carga e após clicar cada aba.

## F3 — Remover os 4 blocos legados

**Fazer:** o usuário decidiu que a landing tem que ficar igual ao modelo.
Remover de `LandingPage.tsx` (e apagar os componentes que ficarem órfãos):

- `landing-personas` — "Três papéis, o mesmo processo" + cards Cliente / Advogado / Contador
- `landing-rito` — "O expediente da perícia" e seus 4 capítulos (`RitoChapter`)
- "O rito completo, no painel"
- "O que o expediente segura" — "Dado com dono" / "Três no mesmo rito" / "Honorários separados"

**Êxito:** a lista de `h1/h2/h3` da landing renderizada bate **exatamente**
com a do modelo, nesta ordem:

```
O laudo que a tese precisa. O cliente no meio.
Um só lugar para todo o rito
A trilha do consentimento.Registrada do início ao fim.
Integrado a tudo que o rito exige
Comece simples.Escale quando o rito exigir
Cada ferramenta, pronta para usar
Todo o processo em uma só linha do tempo
Um caso, o time inteiro
Modelo de laudo em um clique
Escolha um módulo, comece o rito
Da nomeação ao trânsito em julgado
Feito no Connexo
Planos feitos para escritórios que trabalham com perícia
Todos os módulos em um só painel
Usuários ilimitados, custo por caso
Governança pensada para escala
Respostas às perguntas mais comuns
Entre no expediente
```

**Verificar com:** extrair os headings no browser e comparar 1:1 com o modelo.

## F4 — Altura da página

**Fazer:** consequência de F3 + F5. Sem seção sobrando e com o
espaçamento vertical do modelo (`padding: 120px 40px 0px` nos blocos, ver
`data-dc-tpl` 73/142/170/214/264/299/320), a página tem que encolher para
perto do modelo.

**Êxito:** `document.body.scrollHeight` da landing entre **8.200 e
10.100 px** (modelo = 9.132; margem de ±10% para diferença de fonte).
Hoje são 15.463.

**Verificar com:** `document.body.scrollHeight` no browser, viewport 1440px.

## F5 — Foto → mockup do produto

**Fazer:** trocar a fotografia de banco de imagem por mockup de UI nos
lugares onde o modelo mostra o produto. Hoje o app usa foto em 11 pontos;
o modelo usa foto **só no hero** e mockup de UI no resto.

Pontos confirmados pelo juiz (foto onde o modelo tem mockup):

| Seção | Foto hoje |
|---|---|
| Comece simples | `painel-retrato.jpg`, `tile-vitrine.jpg`, `tile-advocacia.jpg`, `tile-laudo.jpg` |
| Da nomeação ao trânsito em julgado | `tile-advocacia.jpg`, `tile-laudo.jpg`, `tile-consentimento.jpg`, `tile-vitrine.jpg`, `tile-suave.jpg` |

Reaproveitar os componentes de mockup que já existem em
`components/landing/` (`MockShell`, `MockCatalogo`, `MockConsentimento`,
etc.) — o modelo mostra painel do advogado, painel do perito, cadastro de
cliente, timeline "Vale Norte × Banco Meridional" e o painel grande de
"Feito no Connexo". Não criar mockup novo do zero se já houver equivalente.

**Êxito:**
1. Nas seções "Comece simples" e "Da nomeação ao trânsito em julgado",
   nenhum elemento tem `background-image` ou `<img src>` apontando para
   `/landing/*.jpg`.
2. Cada card dessas duas seções contém um mockup de UI (elemento com
   `data-testid` começando em `mock-`, ou markup de painel equivalente).
3. O hero continua com a foto (`hero-campo.jpg`) — não regredir o ciclo 10.

**Verificar com:** varredura de `background-image`/`img[src]` por seção no browser.

## F6 — Login (porte literal)

**Fazer:** `LoginPage.tsx` hoje é o design antigo repintado. Portar de
`02-login-dom-body.html`. Divergências que o juiz mediu na comparação
lado a lado:

| | Modelo | App hoje |
|---|---|---|
| Logo | quadrado branco pequeno com "c" + "Connexo" | quadrado magenta grande com ícone de balança + "CONNEXO" |
| Headline | "A precisão contábil a serviço da causa" — branco, cor única, 2 linhas | quebra em 4 linhas com metade em magenta |
| Fundo do painel esquerdo | gradiente vinho | vinho chapado quase preto |
| Kicker | não existe | "ACESSO À PLATAFORMA" em magenta |
| Labels | "E-mail profissional", caixa-baixa | "E-MAIL PROFISSIONAL", caixa-alta espaçada |
| Inputs | limpos, sem ícone | ícone de envelope/cadeado dentro + olho |
| Botão | preto/ink, "Acessar painel →" | vinho, "→ ACESSAR PAINEL" caixa-alta |
| Stats | "Perícias entregues" caixa-baixa | caixa-alta em 2 linhas |
| Fundo da página | cinza quente liso | marca-d'água gigante "CONNEXO" / "EST. 2002" |
| Rodapé do card | link "Solicitar acesso" | régua + "Solicitar acesso ao escritório" |

**Preservar intacto:** todos os `<input>` (mesmo `name`/`type`), a
validação, o `onSubmit`, a chamada de autenticação e a exibição de erro.
Só a apresentação muda.

**Êxito:**
1. `git diff` de `LoginPage.tsx` não altera nenhuma linha com
   `useAuth`, `onSubmit`, `fetch`/serviço, nem remove campo de formulário
   (mesmo conjunto de `name=`/`type=` antes e depois).
2. Os 10 itens da tabela acima batem com o modelo na inspeção do juiz.
3. Submeter credencial inválida continua exibindo a mensagem de erro.

**Verificar com:** `git diff src/pages/LoginPage.tsx` + screenshot 1440×1000 contra `02 Login.html`.

## F7 — Cadastro (porte literal)

**Fazer:** portar `RegisterPage.tsx` de `03-cadastro-dom-body.html`. O
modelo **não tem painel escuro lateral**: é um card central (~840px) com
barra de etapa ("Etapa 2 de 2" / "Credenciais"), título "Conta do
perito", 4 campos em grade 2×2, linha de aceite LGPD com fundo rosa
destacado, e rodapé "← Etapa anterior" / "Finalizar cadastro →". O app
hoje tem o split com painel escuro e labels em caixa-alta.

Manter o fluxo de etapas real que o app já tem (se hoje são 2 etapas com
campos diferentes, preservar a lógica e os campos — só o invólucro visual
vira o do modelo).

**Êxito:** nenhum campo de formulário some, nenhuma validação muda; o
card central sem painel escuro, com a barra de etapas e o bloco de aceite
LGPD destacado como no modelo.

**Verificar com:** `git diff src/pages/RegisterPage.tsx` + screenshot contra `03 Cadastro.html`.

## F8 — Painel do advogado

**Fazer:** portar de `04-painel-do-advogado-dom-body.html` —
`LawyerDashboard.tsx` e o que o `AppShell` precisar. Estrutura do modelo:
saudação "Olá, <nome>", linha de stats (Total de clientes / Processos
totais / Peritos vinculados), tabela "Próximos prazos" (Processo / Ato /
Prazo com pílulas D-3, D-9, D-14), "Ações rápidas", "Peritos vinculados"
com avatares, e o banner "Vitrine de peritos".

**Êxito:** dados continuam vindo do estado carregado da API (nenhum
número virou texto fixo); nenhuma chamada de serviço no diff; estrutura e
raio batendo com o modelo.

**Verificar com:** `git diff src/pages/LawyerDashboard.tsx` + screenshot de `/adv/dashboard`.

## F9 — Painel do perito (= papel contador)

**Fazer:** portar `AccountantDashboard.tsx` de
`05-painel-do-perito-dom-body.html`.

**Êxito:** mesmos critérios de F8.

## F10 — Clientes, Processo, Catálogo, Perfil público

**Fazer:** portar de `06-clientes-dom-body.html`,
`07-processo-dom-body.html`, `08-catalogo-dom-body.html`,
`09-perfil-publico-dom-body.html` para, respectivamente:
`ClientsPage.tsx`/`ClientDetailPage.tsx`, `ProcessPage.tsx` +
`adv/LawyerProcessDetail.tsx` + `acc/AccountantProcessDetail.tsx` +
`ClientProcessDetail.tsx`, `cli/CatalogPage.tsx`,
`public/AccountantPublicProfile.tsx`.

Onde um papel não tem tela no modelo, usar o mesmo vocabulário da tela
equivalente que tem.

**Êxito:** nenhuma lógica de busca/filtro/upload/mutação alterada
(`git diff` só apresentação); estrutura visual de cada tela batendo com o
mockup correspondente.

**Verificar com:** `git diff` dessas páginas + screenshot de cada rota.

## F11 — Telas sem mockup (coerência)

**Fazer:** `PostsPage`, `ServicesPage`, `UsersPage`, `SettingsPage`,
`NotFoundPage`, `acc/AccountantProfileEdit`, `adv/LawyerSubscriptionPage`,
`ClientDocumentsPage`, `ClientNotificationsPage` — não têm mockup. Só
garantir que seguem os primitivos e o raio do tema, sem divergir das
telas portadas.

**Êxito:** cada uma importa primitivo de `connexo-primitives.tsx`;
nenhum `rounded-full` em card/botão que deveria ser 8px.

## F12 — Testes

**Fazer:** F3 remove seções que vários testes checam. Arquivos afetados
(mapeados pelo juiz): `landing-personas.test.mjs` (o arquivo inteiro é
sobre a seção removida), `landing-craft.test.mjs` (`landing-personas`),
`landing-densidade.test.mjs` (`landing-rito`, `landing-quebra-clara`),
`landing-magnific.test.mjs` (`landing-personas`, `landing-fluxo`,
`landing-conexao`), `landing-glass.test.mjs` (`landing-conexao`),
`landing-fotos.test.mjs` (exige ≥8 fotos — conflita com F5).

Regra: **nenhuma asserção sai sem substituta**. Onde o modelo contradiz
o teste antigo, a asserção vira a equivalente sobre o conteúdo novo
(ex.: `landing-fotos` passa a exigir que a foto do hero exista e que as
seções de produto usem mockup). Se um arquivo inteiro perdeu sentido
(`landing-personas`), ele pode ser removido **desde que** o que ele
protegia de verdade (a landing falar dos três papéis em algum lugar, se
ainda falar) esteja coberto em outro teste — ou registre-se
explicitamente no relato que aquela cobertura foi aposentada junto com a
seção, por decisão do usuário.

**Êxito:** `node --test tests/*.test.mjs` com 0 falhas; para cada
asserção removida, ou existe substituta, ou há justificativa nominal no
`GAUNTLET-DONE.txt` dizendo qual era e por que morreu.

**Verificar com:** `node --test` + `git diff tests/` lido linha a linha pelo juiz.

## F13 — Regressão

**Êxito:**
1. `npx tsc --noEmit` → só os 3 erros baseline.
2. `npm run build` → exit 0.
3. `node --test tests/*.test.mjs` → 0 falhas.
4. `git diff -- app/web/src/App.tsx app/web/src/main.tsx app/web/vite.config.ts 'app/web/src/services/**' 'app/api/**' app/web/src/hooks/useAuth.tsx` → vazio.
5. `grep -rn 'Ã\|Â\|�' app/web/src --include=*.tsx` → sem mojibake novo.
6. Nenhum arquivo fora do Escopo no `git diff --name-only`.
