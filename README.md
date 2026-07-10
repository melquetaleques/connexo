# Connexo

Plataforma integrada de gestão jurídica e marketplace de contadores. Advogados assinam a plataforma, cadastram clientes e processos. Clientes escolhem contadores num catálogo interno com consentimento LGPD explícito. Contadores atuam em painel próprio com acesso auditado aos documentos autorizados por processo.

> Conformidade com o Código de Ética da OAB e a LGPD é arquitetural — não opcional.

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Backend | Go 1.22, sqlx, JWT, net/http |
| Banco | PostgreSQL 16 |
| Cache | Redis 7 |
| Storage | MinIO (S3-compatível) |
| Frontend | React 18, Vite, TypeScript, Tailwind CSS |
| Infra | Docker Compose, Nginx |

## Fluxo Principal

```
Advogado assina → cadastra clientes e processos
  → cliente acessa catálogo → escolhe contador
    → consentimento LGPD explícito
      → contador aceita/recusa vínculo
        → contador acessa documentos autorizados → entrega serviço
          → advogado aprova entrega → cliente avalia contador
```

## Roles

| Role | Acesso |
|------|--------|
| `advogado` | Clientes, processos, documentos, aprovação de entregas |
| `contador` | Processos vinculados (escopo restrito), entregas, perfil público |
| `cliente` | Catálogo, vínculo com contador, acompanhamento de status |
| `admin` | Gestão da plataforma |

## Início Rápido

### Pré-requisitos

- Go 1.22+
- Node.js 20+
- Docker e Docker Compose

### Com Docker (recomendado — caminho canônico)

```bash
cd app
docker compose up -d --build
```

Sobe Postgres, Redis, MinIO, API e Web com defaults de desenvolvimento local (não usar em produção).

- Web: http://localhost:3000
- API: http://localhost:8080
- MinIO console: http://localhost:9001

### Desenvolvimento local

```bash
cd app

# Infraestrutura (db + redis + minio)
docker compose up -d db redis minio

# Terminal 1 — API
make dev-api   # :8080

# Terminal 2 — Web
make dev-web   # :5173
```

### Variáveis de ambiente

```bash
cp app/api/.env.example app/api/.env
# Edite conforme seu ambiente — nunca commite `.env` com segredos reais
```

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `CONNEXO_HTTP_ADDR` | `:8080` | Endereço da API |
| `CONNEXO_DATABASE_URL` | `postgres://...` | URL do PostgreSQL |
| `CONNEXO_REDIS_URL` | `redis://localhost:6380` | URL do Redis (compose local) |
| `JWT_SECRET` | dev only | **Obrigatório em produção** (alias: `CONNEXO_JWT_SECRET`) |
| `MINIO_ENDPOINT` | `localhost:9000` | MinIO endpoint (alias: `CONNEXO_STORAGE_ENDPOINT`) |
| `MINIO_ACCESS_KEY` / `MINIO_SECRET_KEY` | local defaults | Credenciais de storage |
| `CORS_ALLOWED_ORIGIN` | `*` | Origem CORS (domínio em produção) |

## Estrutura

```
app/
├── api/                    # Backend Go
│   ├── cmd/server/         # Entrypoint HTTP
│   ├── cmd/worker/         # Worker de background
│   ├── internal/
│   │   ├── domain/         # Entidades e tipos
│   │   ├── handler/        # HTTP handlers + middleware
│   │   ├── repository/     # Acesso ao banco (sqlx)
│   │   └── service/        # Lógica de negócio
│   └── db/migrations/      # Migrations SQL
├── web/                    # Frontend React
│   └── src/
│       ├── components/     # Design system (Sovereign Gilded)
│       ├── pages/          # Páginas por role
│       ├── services/       # Clientes de API
│       └── hooks/          # React hooks
└── docker-compose.yml
```

## Comandos

```bash
make dev-api        # API em modo desenvolvimento
make dev-web        # Web em modo desenvolvimento
make build          # Build completo (API + Web)
make test-api       # Testes Go
make tidy           # go mod tidy
make docker-up      # docker compose up -d --build
make docker-down    # docker compose down
```

## Conformidade

- **OAB**: Cliente escolhe o contador (não o advogado) para evitar indicação vedada pelo Código de Ética.
- **LGPD**: Consentimento explícito antes de qualquer vínculo. Logs de acesso por documento. Revogação automática ao cancelar vínculo. Tabela de consentimentos imutável para auditoria.

## Design System

**Sovereign Gilded** — Midnight Navy `#0D1B2A` + Burnished Gold `#C59D5C` + Plus Jakarta Sans.

Componentes em [`app/web/src/components/ui/connexo-primitives.tsx`](app/web/src/components/ui/connexo-primitives.tsx).

## Licença

Proprietário — © 2026 Connexo. Todos os direitos reservados.
