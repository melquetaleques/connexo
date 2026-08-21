# OBJETIVO — Porte literal do HTML do tema (landing + ajuste de painel)

**Mudança de método em relação ao ciclo 1.** O ciclo 1 reimplementou o
painel em Tailwind "no espírito do" mockup — passou na auditoria estrutural,
mas o usuário, ao comparar a landing (obra de 11 ciclos anteriores) lado a
lado com o modelo, viu que a reinterpretação livre diverge visualmente do
tema real (raio de borda, nav, conteúdo da lista do hero, escala
tipográfica). Instrução explícita do usuário: **"não é para reescrever o
tema, é para usar o HTML do tema e aplicar as funcionalidades."**

A partir de agora: **portar a estrutura DOM + estilos inline do mockup
literalmente** para os componentes React (mesma hierarquia de elementos,
mesmos valores de `style`, convertidos para JSX), e só então plugar a
parte funcional (rotas reais via `react-router`, dados reais, handlers,
estado) por cima — sem reinventar layout, raio, espaçamento ou cópia de
texto por conta própria.

## Contexto técnico — como ler o mockup

Os arquivos-fonte em `tema/Connexo paginas/*.html` são exports de uma
ferramenta de design (bundle JS de ~1-4MB, com um blob de fontes
base64 e um payload JSON gigante) — **não têm HTML estático legível**; o
DOM real só existe depois do JS rodar num browser. Não adianta abrir com
`cat`/`Read`.

Por isso, o DOM real de cada uma das 9 páginas já foi extraído (renderizado
num Chrome headless com `--dump-dom`, cortado para conter só o
`<body>`) e salvo em `**.gauntlet/mockup-dom/*.html`**. Estes são a fonte
de verdade — **HTML real, com todo `style="..."` inline preservado**,
sem lixo de fonte/bundler:

| Arquivo | Página |
|---|---|
| `01-landing-dom-body.html` | Landing |
| `02-login-dom-body.html` | Login |
| `03-cadastro-dom-body.html` | Cadastro |
| `04-painel-do-advogado-dom-body.html` | Painel do advogado |
| `05-painel-do-perito-dom-body.html` | Painel do perito (= papel **contador** no app) |
| `06-clientes-dom-body.html` | Clientes |
| `07-processo-dom-body.html` | Processo |
| `08-catalogo-dom-body.html` | Catálogo |
| `09-perfil-publico-dom-body.html` | Perfil público |

**Atenção ao primeiro bloco de cada arquivo:** o `<div data-dc-tpl="7"
style="position: sticky; ...">` logo no início, contendo os links
`Landing / Login / Cadastro / Painel do advogado / ...`, é o **seletor de
página da própria ferramenta de design** (compara com os 9 nomes de
arquivo) — **não faz parte do design real, ignorar**. O design de verdade
começa no `<section data-dc-tpl="20" id="...">` seguinte.

Como ler: `grep`/`sed` para achar a seção relevante pelo `id=` ou por
texto âncora (ex.: `grep -n 'id="landing"'`), depois `sed -n
'<inicio>,<fim>p'` para extrair o trecho. Cada elemento tem um atributo
`data-dc-tpl="N"` (marcador da ferramenta, pode ser removido ou mantido
como comentário — não precisa virar prop React) e um `style="..."` que
deve virar `style={{ ... }}` em camelCase (`background-color` →
`backgroundColor`), preservando os valores literais (cor, px, radius,
gradiente) — não arredondar para um valor "parecido" de um token
Tailwind existente a menos que o valor já bata exatamente.

## O que já foi corrigido (achado nesta sessão, não refazer)

Uma causa raiz de alto impacto já identificada: `.landing-pill` em
`app/web/src/index.css` usa `border-radius: 999px` (pílula total) em
**tudo** — botões, badges, busca. O modelo usa **~7-8px** de raio na
maioria desses elementos (só elementos claramente circulares, como o
avatar/logo "C", usam raio total). Ver T1.

## Escopo

Pode editar:
- `app/web/src/components/landing/**` (todos os `Mag*.tsx`, `RitoChapter.tsx`, `MockShell.tsx`, `controls/**`) — **landing deixa de estar congelada**
- `app/web/src/pages/LandingPage.tsx`
- `app/web/src/index.css` (classes `.landing-*`/`.mag-*`, incluindo a correção de raio)
- `app/web/src/components/layout/AppShell.tsx`, `app/web/src/components/ui/connexo-primitives.tsx`, `app/web/src/components/ui/connexo-icons.tsx` (ajustes pontuais de raio/spacing pra bater com `04-`/`05-painel-do-*-dom-body.html`, **sem desfazer** a paleta/componentização do ciclo 1 — ver T9)
- Páginas de painel já tocadas no ciclo 1 (mesma lista do `OBJETIVO.md` anterior, arquivo `.gauntlet/cycle-1/prompt.md` tem a lista completa se precisar reconferir)
- `.gauntlet/mockup-dom/**` (só leitura — não editar, é a referência)

NÃO pode editar:
- `.git/`, `.gauntlet/OBJETIVO.md`, `.gauntlet/TASKS.md`, `.env*`, segredos
- `app/web/src/App.tsx`, `main.tsx`, `services/**`, `hooks/useAuth.tsx`, `app/api/**` — nenhuma rota, contrato de API ou lógica de auth muda
- `data-testid` existentes — não remover (pode adicionar novos)
- Arquivos de página duplicados/mortos (mesma lista do `OBJETIVO.md` do ciclo 1)

## Critérios de êxito globais

- [ ] `cd app/web && npx tsc --noEmit` — no máximo os 3 erros baseline já conhecidos (arquivo morto)
- [ ] `cd app/web && npm run build` — exit 0
- [ ] `cd app/web && node --test tests/*.test.mjs` — **os testes atuais podem precisar de ajuste já que o conteúdo da landing muda de propósito** (ex.: lista do hero passa a ter 7 itens de processo, não 5 de produto) — se um teste antigo checa um comportamento que o modelo explicitamente contradiz, ajuste o teste e documente por quê no VEREDITO; não é permitido apagar um teste sem substituir pela asserção equivalente atualizada
- [ ] Nenhum `data-testid` removido
- [ ] `git diff -- app/web/src/App.tsx app/web/src/main.tsx 'app/web/src/services/**' 'app/api/**'` vazio
- [ ] Raio de borda: nenhum elemento não-circular da landing usa `border-radius: 999px`/`rounded-full` onde o mockup correspondente usa ~7-8px (checagem por amostragem do juiz, comparando contra `.gauntlet/mockup-dom/01-landing-dom-body.html`)

## Fora de escopo (não fazer)

- Não mudar fonte global além do que já foi decidido (Hanken Grotesk/Figtree como `theme-body`/`theme-display`, já disponíveis desde o ciclo 1)
- Não tocar rotas, API, auth
- Não apagar `.gauntlet/mockup-dom/**` — é referência viva para os próximos ciclos
