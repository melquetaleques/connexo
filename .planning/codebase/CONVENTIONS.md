# Conventions

## General Conventions
- **Language**: Source code comments and logs are primarily in **Portuguese (BR)**.
- **Project Structure**: Follows a modular approach with separate `app/` and `src/` (legacy) directories.

## Backend (Go)
- **Error Handling**: Explicit error checking after almost every function call (Standard Go practice).
- **Naming**: Use of camelCase for internal variables and PascalCase for exported identifiers.
- **Logging**: Use of structured JSON logging via `log/slog`.
- **Project Layout**: Follows the `cmd/` and `internal/` pattern to prevent exposure of implementation details.
- **Database**: Use of `sqlx` for database mapping and `postgres` as the dialect.

## Frontend (React/TypeScript)
- **Naming**:
    - Components and Pages use **PascalCase** (e.g., `ClientDetailPage.tsx`).
    - Standard hooks and utilities use **camelCase**.
- **Styling**: **Tailwind CSS** for all UI components.
- **Type Safety**: Strong use of TypeScript interfaces and types.
- **API Communication**: Centralized via `axios`.
- **Validation**: `zod` for data and form validation.

## Git & Commits
- Commit messages should be descriptive and typically follow the project's evolution (as seen in GSD context).
