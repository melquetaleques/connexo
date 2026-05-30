---
phase: 7
plan: "07-PLAN"
type: standard
wave: 1
depends_on: []
files_modified:
  - app/web/src/pages/ServicesPage.tsx
  - app/web/src/pages/PostsPage.tsx
  - app/web/src/pages/UsersPage.tsx
  - app/web/src/services/posts.ts
  - app/web/src/services/users.ts
  - app/api/internal/handler/routes.go
  - app/api/internal/handler/catalog.go
  - app/api/internal/service/link.go
  - app/api/internal/repository/link.go
  - app/api/internal/repository/notification.go
  - app/api/internal/repository/post.go
  - app/api/internal/repository/user.go
  - app/api/internal/repository/document.go
  - docker-compose.yml
autonomous: true
requirements:
  - FOND-01
  - FOND-02
  - FOND-03
  - FOND-04
  - FOND-05
  - FOND-06
  - FOND-07
  - FOND-08
  - MIGR-04
  - MARK-02
user_setup: []
must_haves:
  truths:
    - "Advogado pode listar todos os membros da sua equipe"
    - "Advogado pode convidar um novo membro da equipe via e-mail e receber link de convite válido por 72h"
    - "Contador pode criar e publicar artigos imediatamente no portal"
    - "Vínculos entre clientes e contadores disparam notificações automáticas em tempo real para os envolvidos"
    - "Busca do catálogo permite filtrar contadores de forma funcional por especialidade, cidade, estado e texto"
    - "Os formulários de serviços, posts e usuários no frontend salvam dados reais no banco de dados com feedback visual apropriado"
    - "Documentos enviados pelo cliente são persistidos e servidos de forma real e segura através do MinIO"
  artifacts:
    - path: "app/api/internal/service/link.go"
      provides: "LinkService com lógica de negócio de vínculo e disparos de notificações"
    - path: "app/api/internal/handler/routes.go"
      provides: "Novos endpoints para usuários do advogado, convites, postagens e MinIO proxy"
    - path: "app/api/internal/handler/catalog.go"
      provides: "Listagem de contadores do catálogo usando filtros funcionais no banco de dados"
    - path: "app/api/internal/repository/post.go"
      provides: "Repositório do CRUD de postagens do contador no banco"
    - path: "app/web/src/pages/ServicesPage.tsx"
      provides: "Wiring de formulário com chamada ao POST /api/acc/servicos"
    - path: "app/web/src/pages/PostsPage.tsx"
      provides: "Wiring de formulário com chamada ao POST /api/acc/postagens"
    - path: "app/web/src/pages/UsersPage.tsx"
      provides: "Visualização e wiring de convites de usuários via API"
    - path: "docker-compose.yml"
      provides: "Definição do serviço do MinIO para storage local"
  key_links:
    - from: "app/web/src/pages/ServicesPage.tsx"
      to: "/api/acc/servicos"
      via: "API POST call in onSubmit"
    - from: "app/web/src/pages/PostsPage.tsx"
      to: "/api/acc/postagens"
      via: "API POST call in onSubmit"
    - from: "app/web/src/pages/UsersPage.tsx"
      to: "/api/adv/usuarios"
      via: "API GET call inside loadUsers"
    - from: "app/api/internal/handler/routes.go"
      to: "app/api/internal/service/link.go"
      via: "LinkService injected in handlers"
---

# Phase 7: Completar Fundação Quebrada - Plan

**Phase:** 7
**Status:** Draft
**Mode:** standard

## 📋 Objectives
1. Eliminar endpoints inexistentes e corrigir todos os retornos 404 mapeando-os para controllers do backend.
2. Integrar o MinIO ao fluxo local de arquivos, fornecendo persistência robusta sob proxy reverso seguro.
3. Consolidar a modelagem de equipe e convites com disparo de e-mails via SMTP genérico.
4. Implementar o LinkService no backend e automatizar o dispatch de notificações internas para alteração de vínculo.
5. Realizar o wiring completo dos formulários de Serviços, Postagens e Equipe no frontend React com tratamento visual de erros e sucesso.

## 🛠️ Tasks

<tasks>

<task type="auto">
  <name>Task 1: Modelagem do Banco de Dados e Equipe do Advogado</name>
  <files>
    - app/api/db/migrations/07_law_firms_and_posts.sql
    - app/api/internal/repository/user.go
    - app/api/internal/repository/post.go
  </files>
  <read_first>
    - .planning/phases/07-completar-fundacao-quebrada/07-CONTEXT.md
    - .planning/codebase/STRUCTURE.md
  </read_first>
  <action>
    Criar a migration SQL com a definição das tabelas:
    - law_firms (id UUID PRIMARY KEY, name VARCHAR, owner_id UUID REFERENCES users(id), created_at TIMESTAMP)
    - law_firm_members (firm_id UUID REFERENCES law_firms(id), user_id UUID REFERENCES users(id), role VARCHAR, joined_at TIMESTAMP)
    - invite_tokens (token UUID PRIMARY KEY, email VARCHAR, firm_id UUID REFERENCES law_firms(id), expires_at TIMESTAMP, used_at TIMESTAMP)
    - posts (id UUID PRIMARY KEY, accountant_id UUID REFERENCES users(id), title VARCHAR, excerpt TEXT, content TEXT, tag VARCHAR, cover_url VARCHAR, status VARCHAR, published_at TIMESTAMP, created_at TIMESTAMP)

    Implementar a lógica na criação de usuário na camada de repositório/serviço (UserRegistry):
    - Se o usuário registrando tiver role = 'advogado', criar entrada correspondente em law_firms e vinculá-lo em law_firm_members como owner.
  </action>
  <acceptance_criteria>
    - O arquivo 07_law_firms_and_posts.sql contém "CREATE TABLE law_firms" e "CREATE TABLE posts"
    - O backend compila sem erros ao inicializar as novas interfaces do repositório
  </acceptance_criteria>
</task>

<task type="auto">
  <name>Task 2: Endpoints faltantes, LinkService e SMTP de Convites</name>
  <files>
    - app/api/internal/handler/routes.go
    - app/api/internal/service/link.go
    - app/api/internal/repository/link.go
  </files>
  <read_first>
    - .planning/phases/07-completar-fundacao-quebrada/07-CONTEXT.md
    - app/api/internal/handler/routes.go
  </read_first>
  <action>
    Registrar e implementar os seguintes handlers e lógica de negócio:
    1. GET /api/adv/usuarios -> Lista membros do law_firm associado ao advogado autenticado.
    2. POST /api/adv/usuarios/invite -> Gera o token UUID em invite_tokens (expira em 72h) e envia e-mail com link mágico contendo as variáveis SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM.
    3. GET /invite/{token} -> Rota pública que valida o token, marcando-o como usado e redireciona para a tela de registro com o e-mail pré-preenchido.
    4. GET/POST /api/acc/postagens -> CRUD de postagens imediatas (status='publicado').
    5. LinkService (app/api/internal/service/link.go) -> Encapsula chamadas de bind do cliente e aceitação/rejeição do contador, inserindo notificações no banco:
       - Vínculo solicitado: notifica contador.
       - Vínculo aceito: notifica cliente e advogado.
       - Vínculo recusado: notifica cliente.
  </action>
  <acceptance_criteria>
    - O routes.go contém as definições funcionais para "/api/adv/usuarios" e "/api/acc/postagens"
    - O link.go implementa chamadas ao repositório de notificações
  </acceptance_criteria>
</task>

<task type="auto">
  <name>Task 3: Integração de Storage Real com MinIO</name>
  <files>
    - docker-compose.yml
    - app/api/internal/repository/document.go
    - app/api/internal/handler/routes.go
  </files>
  <read_first>
    - docker-compose.yml
    - .planning/phases/07-completar-fundacao-quebrada/07-CONTEXT.md
  </read_first>
  <action>
    1. Adicionar o serviço minio (imagem minio/minio:latest) no docker-compose.yml, mapeando as portas 9000 e 9001.
    2. Integrar o SDK "github.com/minio/minio-go/v7" no repositório de documentos (app/api/internal/repository/document.go) para efetuar o upload real para o bucket "connexo-docs" sob as credenciais MINIO_ENDPOINT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY.
    3. Criar a rota no backend GET /api/media/{bucket}/{key} que atua como proxy reverso: verifica autenticação do usuário, baixa o binário correspondente do MinIO de forma interna e o retorna no response stream sem expor a URL interna do MinIO ao cliente.
  </action>
  <acceptance_criteria>
    - docker-compose.yml contém o container do MinIO
    - O endpoint /api/media/ realiza stream autenticado de arquivos
  </acceptance_criteria>
</task>

<task type="auto">
  <name>Task 4: Wiring de UI e Filtros Funcionais do Catálogo</name>
  <files>
    - app/web/src/pages/ServicesPage.tsx
    - app/web/src/pages/PostsPage.tsx
    - app/web/src/pages/UsersPage.tsx
    - app/api/internal/handler/catalog.go
  </files>
  <read_first>
    - .planning/phases/07-completar-fundacao-quebrada/07-UI-SPEC.md
    - app/web/src/pages/ServicesPage.tsx
    - app/web/src/pages/PostsPage.tsx
    - app/web/src/pages/UsersPage.tsx
  </read_first>
  <action>
    Realizar a conexão frontend-backend dos formulários seguindo os padrões descritos em 07-UI-SPEC.md:
    1. ServicesPage.tsx -> Ligar o formulário ao POST /api/acc/servicos. Adicionar estado disabled=true e spinner de loading ao salvar.
    2. PostsPage.tsx -> Integrar o submit com o POST /api/acc/postagens. Validar campos requeridos e expor o erro inline com estilo (bg-rose-50 border-rose-200 text-rose-700).
    3. UsersPage.tsx -> Listar membros do escritório via GET /api/adv/usuarios. wired o formulário de convite ao POST /api/adv/usuarios/invite. Mostrar banner de sucesso temporário por 6s.
    4. catalog.go / AccountantCatalogPage.tsx -> Atualizar a rota GET /api/public/accountants de forma que a query SQL do repositório utilize clauses WHERE funcionais baseadas em specialty, city, state e busca de texto.
  </action>
  <acceptance_criteria>
    - ServicesPage.tsx executa o createService ao submeter o formulário
    - PostsPage.tsx e UsersPage.tsx possuem os respectivos tratamentos e classes CSS de erro/sucesso listados em 07-UI-SPEC.md
    - O catálogo funciona com os filtros dinâmicos
  </acceptance_criteria>
</task>

</tasks>

## 🔒 Threat Model
- **Vulnerabilidade de Convites Repetidos (Rate Limit)**: Implementar controle de IP ou rate limit no endpoint /api/adv/usuarios/invite para mitigar flooding de e-mails.
- **Acesso Direto ao MinIO (Document Leak)**: Proibir terminantemente o tráfego direto de URLs públicas do MinIO. Todo o acesso a mídias e documentos deve passar pelo proxy de autenticação do backend (/api/media).

## ✅ Verification Strategy
- **Automatizado**:
  - Execução de testes de integração na rota de convites (/api/adv/usuarios/invite) e proxy de mídia (/api/media).
  - Rodar o build do frontend Vite (`npm run build`) para assegurar conformidade do Typescript após as alterações de wiring.
- **Manual UAT**:
  - Acessar o portal do advogado e simular o envio de um convite; verificar se o token é registrado e se o e-mail de teste simula o link correto.
  - Acessar o catálogo, preencher filtros de especialidade e cidade, e validar se os resultados no grid são filtrados corretamente de acordo com o banco de dados.

## 📅 Roadmap Context
- **Depends on**: N/A (Phase 1 summary complete)
- **Requirement IDs**: FOND-01, FOND-02, FOND-03, FOND-04, FOND-05, FOND-06, FOND-07, FOND-08, MIGR-04, MARK-02
