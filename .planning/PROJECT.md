# Connexo

## What This Is
O Connexo é uma plataforma integrada de gestão para advogados que oferece um marketplace de contadores parceiros. O sistema permite que advogados gerenciem seus clientes e processos, enquanto os clientes finais têm a autonomia de escolher e contratar contadores através de um catálogo interno (estilo "app store") para atuar especificamente em seus casos jurídicos.

## Core Value
Facilitar a conexão transparente, segura e ética entre clientes jurídicos e contadores, centralizando a gestão de processos e documentos em uma plataforma que respeita a segregação de papéis e as normas da OAB/LGPD.

## Requirements

### Validated
<!-- Funcionalidades já identificadas na base de código atual -->
- ✓ Autenticação JWT e RBAC (Advogado, Contador, Cliente, Admin) — `app/api`
- ✓ Backend robusto em Go com arquitetura em camadas — `app/api`
- ✓ Endpoints iniciais para Catálogo de Contadores (público) — `/api/public/accountants`
- ✓ Gestão básica de clientes e processos para advogados no backend — `/api/adv`
- ✓ Frontend React/TS com estrutura básica de Login, Registro e Dashboard — `app/web`

### Active
<!-- Escopo a ser implementado com base em docs/escopo.md e app/docs/prototipo-fonte.md -->
- [ ] **Migração do Protótipo**: Migrar todas as rotas e UI do diretório `src/` legacy para `app/web/src` usando o design system **Sovereign Gilded**.
- [ ] **Painel do Advogado**: Implementar gestão de assinaturas, controle de permissões para contadores e histórico de movimentações.
- [ ] **Portal do Contador**: Implementar edição de perfil, configuração de landing page e gestão de processos vinculados (upload/pareceres).
- [ ] **Catálogo (Marketplace)**: Evoluir o catálogo para formato "app store" com filtros, comparação e botão de contratação pelo cliente.
- [ ] **Painel do Cliente**: Criar área para o cliente visualizar processos e realizar a escolha do contador.
- [ ] **Segurança e Conformidade**: Implementar logs de auditoria, controle rígido de acesso por processo e termos de consentimento (LGPD).

### Out of Scope
- [Mobile App Nativo] — O foco inicial é PWA/Web Responsivo.
- [Gestão Financeira Complexa] — Faturamento e contas a pagar/receber extensos (focar em taxas de manutenção de ativos primeiro).

## Context
O projeto está em transição de um protótipo funcional em JS/JSX para um produto escalável em Go e React/TS. Existe um diretório `tema_connexo` com referências visuais e um documento `prototipo-fonte.md` que serve de guia para a migração técnica.

## Constraints
- **Tech Stack**: Backend Go (sqlx), Frontend React (Vite/TS/Tailwind).
- **Design System**: Seguir estritamente o **Sovereign Gilded** (Midnight Navy, Burnished Gold, Plus Jakarta Sans).
- **Conformidade**: Adesão estrita ao Código de Ética da OAB e LGPD.

## Key Decisions
| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Go + React/TS | Escolha por performance no backend e tipagem forte no frontend. | ✓ Good |
| RBAC no Backend | Necessário para garantir que contadores acessem apenas processos autorizados. | ✓ Good |
| Marketplace de Contadores | Evitar mercantilização e garantir autonomia de escolha ao cliente (Ética OAB). | ✓ Good |

## Evolution
Este documento evolui a cada transição de fase e marco do projeto.
