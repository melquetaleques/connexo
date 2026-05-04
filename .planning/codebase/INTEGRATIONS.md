# Integrations

## Internal Integrations
- **PostgreSQL**: The primary data store, integrated via `sqlx` and `lib/pq`.
- **JWT (JSON Web Tokens)**: Used for secure session management and authentication between the frontend and backend.

## External Integrations
*No major external third-party service integrations (like payment gateways, cloud storage, or notification services) were identified in the core service layer.*

## API Endpoints Summary
- `/api/health`: System health check.
- `/api/auth/*`: Registration, login, and session validation.
- `/api/public/accountants/*`: Publicly accessible catalog of accountants.
- `/api/adv/*`: Private endpoints for lawyers (Dashboard, Clients, Processes).
- `/api/cont/*`: (Planned) Private endpoints for accountants.
- `/api/cli/*`: (Planned) Private endpoints for clients.
