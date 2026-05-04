# Project Structure

## Directory Overview

- `app/`: Primary application source code.
    - `api/`: Backend service (Go).
        - `cmd/`: Entry points for applications (e.g., `server/main.go`).
        - `internal/`: Private library code, including handlers, models, and business logic.
        - `db/`: Database migrations or initialization scripts.
    - `web/`: Frontend web application (React/TypeScript).
        - `src/`: React components, pages, hooks, and assets.
        - `public/`: Static assets.
    - `mobile/`: Mobile application (placeholder or early stage).
    - `nginx/`: Nginx configurations for deployment.
    - `scripts/`: Helper scripts for development or deployment.
- `src/`: Legacy or prototype React/JSX files (outside the modern `app/web` structure).
- `tema_connexo/`: Design assets and branding related files.
- `docs/`: Project documentation.
- `.agent/`: Agent-specific skills and configurations (GSD system).
- `.planning/`: GSD planning and codebase intelligence data.

## Key Files
- `app/docker-compose.yml`: Orchestrates local development services.
- `app/Makefile`: Centralized command execution for building and running services.
- `app/web/vite.config.ts`: Configuration for the frontend build pipeline.
- `app/api/go.mod`: Backend dependency management.
