# Tech Stack

## Core Technologies
- **Backend**: Go 1.22.0
- **Frontend Web**: React 18.3.1 (Vite, TypeScript)
- **Styling**: Tailwind CSS 3.4.14
- **Database Architecture**: PostgreSQL (inferred from `lib/pq` and `sqlx`)

## Backend Dependencies (Go)
- `github.com/jmoiron/sqlx`: Relational database operations.
- `github.com/golang-jwt/jwt/v5`: Authentication and session management.
- `github.com/google/uuid`: Unique identifier generation.
- `golang.org/x/crypto`: Password hashing and cryptographic utilities.

## Frontend Dependencies (Web)
- `axios`: HTTP client for API communication.
- `react-router-dom`: Client-side routing.
- `zod`: Schema validation.
- `vite`: Build tool and dev server.
- `typescript`: Language for type safety.

## Infrastructure
- **Containerization**: Docker (Dockerfiles in api/ and web/, docker-compose.yml in app/)
- **Proxy/Web Server**: Nginx (configurations found in app/nginx and app/web)
- **CI/CD / Automation**: Makefile in app/
