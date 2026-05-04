# Phase 1: Fundação e Migração Essencial - Plan

**Phase:** 1
**Status:** Draft
**Mode:** standard

## 📋 Objectives
1. Migrar as telas de Login e Registro do protótipo legado para a estrutura moderna.
2. Estabelecer o Layout base persistente (Sidebar/Header) no frontend.
3. Implementar a gestão básica de clientes e processos vinculada à API Go.
4. Sincronizar tipos TypeScript com as entidades do backend.

## 🛠️ Tasks

### Plan 1.1: Migração de Autenticação e Layout Base
- [ ] **Task 1.1.1**: Criar `LoginPage.tsx` em `app/web/src/pages` baseada em `src/auth.jsx` e `tema_connexo/login/code.html`.
  - Aplicar design Sovereign Gilded.
  - Integrar com `POST /api/auth/login`.
- [ ] **Task 1.1.2**: Criar `RegisterPage.tsx` com o wizard de 3 etapas (Escritório, Administrador, Plano).
  - Integrar com `POST /api/auth/register`.
- [ ] **Task 1.1.3**: Refatorar `App.tsx` para incluir um componente `Layout` persistente.
  - Implementar `Sidebar` (Midnight Navy) e `Header` com perfil do usuário.
  - Configurar `ProtectedRoute` para validar o JWT.

### Plan 1.2: Implementação da Gestão de Clientes e Processos
- [ ] **Task 1.2.1**: Implementar `ClientsPage.tsx` com listagem de clientes.
  - Consumir `GET /api/adv/clients`.
  - Usar componente de Tabela moderna.
- [ ] **Task 1.2.2**: Criar Modal de cadastro de novo cliente.
  - Integrar com `POST /api/adv/clients`.
- [ ] **Task 1.2.3**: Implementar `ProcessPage.tsx` (ou similar) para visualização de processos de um cliente.
  - Integrar com `GET /api/adv/processes`.

### Plan 1.3: Sincronização de Tipos e Modelos
- [ ] **Task 1.3.1**: Criar diretório `app/web/src/types` e definir interfaces TS para `User`, `Client`, `Process`, `Accountant`.
- [ ] **Task 1.3.2**: Configurar cliente Axios global em `app/web/src/lib/api.ts` com interceptors de Auth.
- [ ] **Task 1.3.3**: Substituir referências ao mock `connexo-data.ts` no `DashboardPage.tsx` por chamadas à API.

## 🔒 Threat Model
- **Token Leakage:** Armazenar JWT de forma segura (Cookies HttpOnly preferencialmente, ou localStorage com limpeza em logout).
- **Broken Access Control:** Validar Roles no frontend, embora o backend já realize o RequireRole.

## ✅ Verification Strategy
- **Automated:**
  - `npm run build` no diretório `app/web` para validar tipos TS.
  - Testes unitários para utilitários de Auth (se aplicável).
- **Manual UAT:**
  - Realizar fluxo completo de Login.
  - Cadastrar um cliente e validar se aparece na lista.
  - Verificar se o Dashboard carrega dados da API (vazio ou populado).

## 📅 Roadmap Context
- **Depends on:** N/A (Phase 1)
- **Requirement IDs:** MIGR-01, MIGR-02, MIGR-03, LAWY-02, MIGR-05
