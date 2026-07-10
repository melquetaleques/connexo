# Mapeamento: protótipo `src` → `web/src`

Este documento liga as rotas do protótipo (`../src/app.jsx`) às páginas do produto e aos HTMLs de referência em `../tema_connexo`.

## Rotas do protótipo

| Rota (`route`) | Arquivo(s) no protótipo | Página alvo (`web/src/pages/`) | Referência visual `tema_connexo` |
|----------------|-------------------------|--------------------------------|----------------------------------|
| `login` | `auth.jsx` | `LoginPage.tsx` | `login/code.html`, `login_mobile_*` |
| `register` | `auth.jsx` | `RegisterPage.tsx` | `cadastro_de_usu_rio_aureum_clarity/code.html`, `cadastro_mobile_*` |
| `dashboard` | `dashboard.jsx` | `DashboardPage.tsx` | `painel_principal/code.html`, `dashboard_principal_portal_do_contador/code.html` |
| `clients` | `clients.jsx` | `ClientsPage.tsx` | (composição com listagens do painel; detalhe em telas de cliente) |
| `client-detail` | `clients.jsx` (detalhe) | `ClientDetailPage.tsx` | Documentos/perfil conforme fluxo |
| `process` | `process.jsx` | `ProcessPage.tsx` | `detalhes_de_processo_aureum_clarity/code.html` |
| `posts` | `content.jsx` | `PostsPage.tsx` | Conteúdo editorial do protótipo |
| `services` | `content.jsx` | `ServicesPage.tsx` | Cards de serviço alinhados a `data.jsx` → `SERVICES` |
| `users` | `settings.jsx` / gestão | `UsersPage.tsx` | Fluxo administrativo |
| `settings` | `settings.jsx` | `SettingsPage.tsx` | `edi_o_de_perfil_aureum_clarity/code.html` |
| `public` | `public-profile.jsx` | `PublicProfilePage.tsx` | `perfil_publico/code.html` |

## Dados e UI compartilhados

| Protótipo | Uso no produto |
|-----------|----------------|
| `data.jsx` | Modelos e seeds até existir API; depois contratos em `api/internal` + tipos em `web/src/lib` |
| `ui.jsx` | Migrar para `web/src/components` (primitivos); adotar Shadcn onde couber, mantendo tokens do **Sovereign Gilded** (`tema_connexo/skill/DESIGN.md`) |
| `tweaks-panel.jsx` | Apenas desenvolvimento; não levar para produção |

## Documentos (futuro)

Telas de gestão documental no tema: `gest_o_de_documentos_aureum_clarity`, `gerenciamento_de_documentos_portal_do_contador`. Podem virar módulo `documents` quando o escopo da API incluir arquivos.

## Design system

Cores e tipografia: ver `../tema_connexo/skill/DESIGN.md` (Midnight Navy `#000830`, Burnished Gold `#C59D5C`, Plus Jakarta Sans, raios grandes, ghost borders).
