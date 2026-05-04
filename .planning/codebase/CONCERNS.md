# Concerns

## Technical Concerns
1. **Lack of Automated Tests**: The project currently has zero automated test coverage. This increases the risk of regressions as the codebase grows.
2. **Legacy/Redundant Files**: The `src/` directory at the root contains `.jsx` files that seem to conflict with or duplicate the modern React/TypeScript implementation in `app/web/src`. This can cause confusion for developers.
3. **Empty Mobile Project**: The `app/mobile` directory is largely empty/placeholder, despite mentions of mobile implementation in project history.
4. **Hardcoded Configuration**: Some environment variables have defaults in `main.go` that might be insecure for production (e.g., `CONNEXO_JWT_SECRET`).

## Security Concerns
1. **JWT Secret Management**: The secret used for signing tokens should be managed strictly via environment variables and never committed.
2. **CORS Configuration**: The current CORS middleware in `routes.go` allows all origins (`*`). This should be restricted to the frontend domain in production.

## Maintainability Concerns
1. **Language Consistency**: While comments are in Portuguese, mixing English identifiers with Portuguese logic descriptions can sometimes lead to inconsistencies.
2. **Database Migrations**: No explicit migration tool (like `golang-migrate` or `goose`) was identified, which might make database schema synchronization difficult across environments.
