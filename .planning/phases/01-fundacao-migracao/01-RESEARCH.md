# Phase 1: Fundação e Migração Essencial - Research

**Researched:** 2026-05-04
**Scope:** MIGR-01, MIGR-02, MIGR-03, LAWY-02, MIGR-05

## 1. Mapeamento de Autenticação (MIGR-01)
O protótipo legado em `src/auth.jsx` define duas telas principais: `LoginScreen` e `RegisterScreen`.

### Login
- **Visual:** Layout split-screen (primário à esquerda com branding, formulário à direita).
- **Branding:** Mensagens como "A precisão contábil a serviço da causa" e marcas d'água "CONNEXO", "EST. 2002".
- **Campos:** E-mail, Senha (com toggle de visibilidade), Manter conectado.
- **Transição:** Ao submeter, navega para `dashboard`.

### Registro
- **Fluxo:** Wizard de 3 etapas.
  1. Dados do Escritório (Razão Social, CNPJ, CRC).
  2. Conta Administrador (Nome, E-mail, Senha).
  3. Plano (Essencial, Profissional, Escritório).

### Implementação Recomendada
- Criar `LoginPage.tsx` e `RegisterPage.tsx` em `app/web/src/pages`.
- Utilizar componentes de `connexo-primitives` (Card, GoldButton) e Tailwind para o layout split.
- Integrar com `POST /api/auth/login` e `POST /api/auth/register`.

## 2. Layout Base e Dashboard (MIGR-02)
O `DashboardPage.tsx` atual já está bem estruturado com o design Sovereign Gilded.

### Melhorias Necessárias
- Extrair o `Sidebar` e `Header` para componentes globais se ainda não forem (atualmente o `PageContainer` parece lidar com o padding, mas a navegação precisa ser centralizada no `App.tsx`).
- Substituir o mock `KPI` por dados vindos de `GET /api/adv/dashboard`.

## 3. Gestão de Clientes e Processos (LAWY-02, MIGR-03)
Páginas identificadas para migração: `ClientsPage.tsx` e `ProcessPage.tsx`.

### Entidades Envolvidas
- `Client`: Name, Document, Email, Phone, Type (PF/PJ).
- `Process`: Number, Type, Court, Stage, Status.

### Fluxo de Criação
- O backend já possui `POST /api/adv/clients` e `POST /api/adv/processes`.
- Implementar Modais de cadastro no frontend que enviem os dados via JSON para a API Go.

## 4. Sincronização de Tipos (MIGR-05)
Devemos criar um diretório `@/types` ou usar o `@/lib/api` para definir interfaces que espelhem o Go.

### Tipos TS Essenciais:
```typescript
export type Role = 'advogado' | 'cliente' | 'contador' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export interface Client {
  id: string;
  name: string;
  document: string;
  email: string;
  phone: string;
  type: string;
  status: string;
}
```

## 5. Próximos Passos para Planejamento
- Definir as tarefas de criação de componentes de layout.
- Sequenciar a migração: Layout -> Auth -> Dashboard API -> Clientes.
- Configurar o Axios (ou Fetch) com interceptors para o JWT.

## 6. Riscos e Dependências
- **CORS:** Já configurado no backend, mas validar o domínio do frontend Vite (geralmente :5173).
- **Tipagem:** Garantir que o UUID do Go seja tratado como string no TS.
