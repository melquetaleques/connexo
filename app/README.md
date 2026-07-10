# Connexo

Monorepo: API em Go, web em React e app mobile em Expo, com referência ao protótipo em `../src` e ao design em `../tema_connexo`.

## Requisitos

- Go 1.22+
- Node.js 20+ e pnpm ou npm
- Docker e Docker Compose (opcional, para stack completa)

## Início rápido

```bash
cd app
make dev-api    # API em :8080
make dev-web    # outro terminal — Vite em :5173
# GNU Make: make -j2 dev-api dev-web
```

Variáveis úteis da web: copie `web/.env.example` para `web/.env`.

## Estrutura

| Pasta | Função |
|-------|--------|
| `api/` | Backend Go: `cmd/`, `internal/`, `db/`, `bin/`, `scripts/` |
| `web/` | Frontend: `components/` (Shadcn), `pages/`, `hooks/`, `services/`, `lib/` |
| `mobile/` | Expo/React Native |
| `docs/` | Documentação, inclusive mapeamento protótipo → produto |
| `nginx/` | Proxy reverso para produção |
| `scripts/` | Automação e QA globais |

## Fonte de verdade das telas

1. **Comportamento e dados mock:** arquivos em `../src` (`app.jsx` define rotas; `data.jsx` define entidades; telas em `auth.jsx`, `clients.jsx`, etc.).
2. **Visual e padrões ausentes no protótipo:** `../tema_connexo` (HTML de referência + `skill/DESIGN.md`).

Detalhes em [docs/prototipo-fonte.md](docs/prototipo-fonte.md).

## Docker

```bash
docker compose up -d
```

Ajuste portas e credenciais em `docker-compose.yml` conforme o ambiente.

Com Docker Compose, a interface fica em **http://localhost:3000** (Nginx servindo o build estático; `/api` e `/health` são encaminhados à API). A API direta: **http://localhost:8080**.
