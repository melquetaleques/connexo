# Architecture

## System Overview
The Connexo platform is built as a distributed application with a clear separation between frontend and backend.

## Backend Architecture (Go)
The backend follows a **Layered Architecture** pattern, emphasizing separation of concerns:

1. **Handlers (Delivery Layer)**: Manage HTTP requests and responses. Defined in `app/api/internal/handler`.
2. **Services (Business Logic Layer)**: Orchestrate business rules and coordinate between repositories and other services. Defined in `app/api/internal/service`.
3. **Repositories (Data Access Layer)**: Abstract database interactions using `sqlx`. Defined in `app/api/internal/repository`.
4. **Domain**: Contains core business entities and shared types.

### Key Architectural Patterns:
- **Dependency Injection**: Dependencies are injected manually in `main.go`.
- **RBAC (Role-Based Access Control)**: Middleware ensures users have the necessary roles (Advogado, Contador, Cliente, Admin) to access specific endpoints.
- **Structured Logging**: Uses `log/slog` for consistent JSON logging.

## Frontend Architecture (React)
The frontend is a modern Single Page Application (SPA) built with Vite and TypeScript.

- **Component-Based UI**: Utilizes React components for modularity.
- **State Management**: Likely using React hooks (Context API or local state) as no specific state library like Redux was found in `package.json`.
- **Validation**: Uses `zod` for client-side and form validation.
- **Routing**: Client-side routing managed by `react-router-dom`.

## Data Flow
1. User interacts with the React frontend.
2. Frontend sends authenticated (JWT) HTTP requests to the Go API.
3. API Handlers validate request input and session.
4. Services process business logic and call Repositories.
5. Repositories interact with the PostgreSQL database.
6. Data is returned through the layers as JSON.
