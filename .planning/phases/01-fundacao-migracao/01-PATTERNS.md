# Phase 1: Fundação e Migração Essencial - Patterns

**Mapped:** 2026-05-04

## 1. UI Primitives (Frontend)
Os componentes base estão definidos em `@/components/ui/connexo-primitives.tsx`. Devem ser reutilizados para manter a consistência com o Dashboard.

### Reusable Components
- **Card**: Container base com sombra suave.
- **GoldButton**: Botão primário com gradiente dourado (`#C59D5C`).
- **Icon**: Wrapper para Material Symbols.
- **PageContainer**: Padding e largura máxima centralizada.
- **Field**: Input padrão com foco estilizado.

### Typography & Colors
- **Font:** `Plus Jakarta Sans`.
- **Primary:** `#000830` (Midnight Navy).
- **Secondary:** `#C59D5C` (Burnished Gold).

## 2. API Data Flow (Integration)
O fluxo de dados deve seguir a arquitetura definida no backend Go.

### Model Slicing (Go -> TS)
| Go Entity (domain) | TS Interface (@/types) | Data Flow |
|-------------------|----------------------|-----------|
| `User`            | `User`               | Auth Response |
| `Client`          | `Client`             | `GET /api/adv/clients` |
| `Process`         | `Process`            | `GET /api/adv/processes` |

### API Clients
- Usar Axios para chamadas à API.
- Configurar interceptor para incluir o Header `Authorization: Bearer <token>`.

## 3. Page Patterns
As novas páginas devem seguir a estrutura de `DashboardPage.tsx`.

### Composition
```tsx
import { PageContainer, SectionTitle, Card } from "@/components/ui/connexo-primitives";

export function NewPage() {
  return (
    <PageContainer>
      <SectionTitle title="Título" kicker="Categoria" />
      <div className="grid gap-6 md:grid-cols-2">
        <Card>Conteúdo</Card>
      </div>
    </PageContainer>
  );
}
```

## 4. Auth Pattern
A migração de `src/auth.jsx` deve converter o JSX legado para TSX, tipando os estados (`useState<string>`) e integrando com as rotas reais via `useNavigate`.
