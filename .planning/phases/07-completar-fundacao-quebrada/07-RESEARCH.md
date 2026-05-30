# Phase 7: Completar Fundação Quebrada - Research

**Researched:** 2026-05-30
**Scope:** FOND-01, FOND-02, FOND-03, FOND-04, FOND-05, FOND-06, FOND-07, FOND-08, MIGR-04, MARK-02

## 1. Gestão de Equipe do Advogado (FOND-01, FOND-02, FOND-07)
A tela de gestão de equipe (`UsersPage.tsx`) requer endpoints funcionais no backend.

### Estrutura de Banco de Dados
- **Tabela `law_firms`**:
  - `id` (UUID, Primary Key)
  - `name` (VARCHAR, Razão Social ou nome fantasia)
  - `owner_id` (UUID, Foreign Key para `users.id`)
  - `created_at` (TIMESTAMP)
- **Tabela `law_firm_members`**:
  - `firm_id` (UUID, Foreign Key para `law_firms.id`)
  - `user_id` (UUID, Foreign Key para `users.id`)
  - `role` (VARCHAR, ex: 'admin', 'advogado_junior')
  - `joined_at` (TIMESTAMP)
- **Tabela `invite_tokens`**:
  - `token` (UUID, Primary Key)
  - `email` (VARCHAR, e-mail convidado)
  - `firm_id` (UUID, Foreign Key para `law_firms.id`)
  - `expires_at` (TIMESTAMP, expiração em 72h)
  - `used_at` (TIMESTAMP, NULL se ativo)

### Lógica de Registro Automatizado
- Ao registrar um usuário com `role = 'advogado'`, um hook/trigger no serviço de autenticação (`auth.go`) criará automaticamente um registro em `law_firms` com o advogado como `owner`, e inserirá uma entrada em `law_firm_members` vinculando-o ao escritório.

### Fluxo de Convite
1. O advogado envia um e-mail através de `POST /api/adv/usuarios/invite` informando o e-mail do convidado.
2. O backend gera um token UUID em `invite_tokens`, configurado para expirar em 72h.
3. Um e-mail contendo o link mágico (`https://connexo.com.br/invite/{token}`) é despachado via SMTP utilizando as configurações do ambiente (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`).
4. A rota pública `GET /invite/{token}` valida a expiração do token e o redireciona para a página `/register` com o e-mail pré-preenchido e o ID do escritório correspondente.

## 2. Entidade Postagem do Contador (FOND-03, FOND-06)
A página `PostsPage.tsx` precisa listar e publicar posts na API.

### Estrutura de Banco de Dados (`posts`)
- `id` (UUID, Primary Key)
- `accountant_id` (UUID, Foreign Key para `users.id`)
- `title` (VARCHAR)
- `excerpt` (TEXT)
- `content` (TEXT)
- `tag` (VARCHAR)
- `cover_url` (VARCHAR)
- `status` (VARCHAR, default 'publicado' no MVP)
- `published_at` (TIMESTAMP)
- `created_at` (TIMESTAMP)

### Endpoints
- `GET /api/acc/postagens`: Retorna postagens criadas pelo contador logado (com paginação `limit/offset` padrão 20).
- `POST /api/acc/postagens`: Cria uma nova postagem imediatamente como "publicado". Campos obrigatórios: `title`, `tag`, `content`, `cover_url`, `excerpt`.

## 3. Lógica de Vínculo e Notificações (FOND-04)
Atualmente os Handlers de vínculo chamam o repositório diretamente, sem enviar notificações.

### Introdução do `LinkService`
- Criar `LinkService` em `app/api/internal/service/link.go`.
- Encapsular a lógica de alteração de vínculo e chamar `domain.NotificationRepository.Create` para despachar notificações internas.
- Eventos mapeados:
  - **Vínculo Solicitado**: Cria notificação para o `contador`.
  - **Vínculo Aceito**: Cria notificação para o `cliente` e o `advogado`.
  - **Vínculo Recusado**: Cria notificação para o `cliente`.

## 4. Integração Real com MinIO Storage (D-14 a D-18)
Substituir URLs estáticas fakes por armazenamento real no MinIO.

### Configuração do Container
- Adicionar o serviço `minio` baseado em `minio/minio:latest` ao `docker-compose.yml`.
- Configurar portas de API (`9000`) e console (`9001`).

### Armazenamento de Arquivos
- Usar a biblioteca oficial Go `github.com/minio/minio-go/v7`.
- Substituir o upload mock em `document.go` por uploads reais para o bucket `connexo-docs`.
- Configurações via env: `MINIO_ENDPOINT`, `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY`.

### Proxy de Segurança
- URLs do MinIO nunca são expostas ao frontend.
- Criar rota no Go `GET /api/media/{bucket}/{key}` que valida o JWT do usuário, busca o objeto no MinIO por baixo dos panos e faz stream do arquivo na resposta HTTP com os headers corretos.

## 5. Wiring do Frontend (FOND-05, FOND-06, FOND-07, FOND-08)
Conectar formulários existentes às novas APIs seguindo o `07-UI-SPEC.md`.

### Componentes de UI e Padrões
- **ServicesPage.tsx**: Formulário de criação de serviços deve executar `onSubmit` e disparar o hook `createService` para `POST /api/acc/servicos`. Mostrar estado de carregamento desabilitando o botão e exibindo um spinner.
- **PostsPage.tsx**: Formulário de criação de posts deve disparar `POST /api/acc/postagens` com todos os campos obrigatórios.
- **UsersPage.tsx**: Listar equipe via `GET /api/adv/usuarios` e enviar convites via `POST /api/adv/usuarios/invite`. Exibir toast de sucesso que desaparece após 6s.
- **AccountantCatalogPage.tsx**: A barra de filtros deve atualizar os parâmetros de busca (`specialty`, `city`, `state`, `q`) e refazer a query SQL `ListPublic` no banco de dados usando filtros `WHERE` funcionais.

---
