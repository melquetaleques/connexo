# Connexo

## What This Is

Plataforma integrada de gestão jurídica + marketplace de contadores. Advogados assinam a plataforma, cadastram clientes e processos. Clientes escolhem contadores num catálogo interno (estilo "app store"). Contadores têm perfil público, aceitam vínculos e atuam em painel próprio — com acesso limitado e auditado aos documentos autorizados por processo.

## Core Value

Facilitar a conexão transparente, segura e ética entre clientes jurídicos e contadores, centralizando gestão de processos e documentos em uma plataforma aderente ao Código de Ética da OAB e à LGPD.

## Fluxo Principal

```
Advogado assina plataforma
  → cadastra clientes e processos
    → cliente acessa catálogo e escolhe contador
      → cliente consente compartilhamento (LGPD)
        → contador recebe notificação e aceita/recusa
          → contador acessa documentos autorizados e entrega serviço
            → advogado aprova entrega
              → cliente avalia contador
```

## Requirements

### Validated (Milestone 1.0 — Concluído 2026-05-11)
- ✓ Autenticação JWT + RBAC: advogado, contador, cliente, admin
- ✓ Backend Go com arquitetura em camadas (handler → service → repository)
- ✓ Cadastro e gestão de clientes e processos pelo advogado
- ✓ Catálogo público de contadores com perfil detalhado
- ✓ Fluxo básico: cliente escolhe contador → contador aceita/recusa
- ✓ Upload de documentos por processo com controle de visibilidade
- ✓ Notificações e logs de auditoria
- ✓ Design system Sovereign Gilded (Midnight Navy + Burnished Gold)

### Active (Milestone 1.1 — Em planejamento 2026-05-14)

**Fase 7 — Fundação completa:**
- [ ] Endpoints faltantes: posts do contador, usuários do escritório
- [ ] Formulários wired à API: ServicesPage, PostsPage, UsersPage
- [ ] Filtros do catálogo funcionais (cidade, especialidade)
- [ ] Notificações automáticas em eventos de vínculo

**Fase 8 — Vínculo completo:**
- [ ] Ciclo de vida do vínculo: 11 estados (pendente → concluído)
- [ ] Advogado vê contador + status por processo
- [ ] Contador submete entregas técnicas por processo
- [ ] Advogado aprova/solicita revisão de entregas
- [ ] Cliente acompanha status do vínculo

**Fase 9 — Perfil rico do contador:**
- [ ] Upload de logo e fotos do perfil
- [ ] Status de disponibilidade visível no catálogo
- [ ] Posts/artigos funcionais no perfil público

**Fase 10 — Avaliações:**
- [ ] Cliente avalia contador após vínculo concluído
- [ ] Nota média no catálogo e perfil público

**Fase 11 — LGPD obrigatório:**
- [ ] Consentimento explícito antes de vincular contador
- [ ] Permissão por documento (advogado controla)
- [ ] Log de acesso individual por documento
- [ ] Revogação automática ao cancelar vínculo

**Fase 12 — Landing page + assinatura:**
- [ ] Landing page comercial pública para advogados
- [ ] Gestão básica de assinatura (plano, vencimento, status)

**Fase 13 — Produção:**
- [ ] UAT completo todos os roles
- [ ] Hardening e deploy

### Out of Scope
- Mobile app nativo (PWA suficiente para v1.1)
- Pagamento recorrente Stripe (v2 — landing captura leads)
- Assinatura digital de documentos (v2)
- Chat em tempo real (notificações cobrem necessidade)
- IA para análise de documentos (v2)

## Constraints
- **Tech Stack**: Go (sqlx) + React/Vite/TS/Tailwind — não mudar.
- **Design System**: Sovereign Gilded estrito — Midnight Navy `#0D1B2A`, Burnished Gold `#C59D5C`, Plus Jakarta Sans.
- **Conformidade**: Código de Ética OAB (sem mercantilização, autonomia do cliente na escolha do contador) + LGPD.
- **Arquitetura**: Não criar camadas paralelas. Seguir padrões existentes em `app/api/internal/`.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Go + React/TS | Performance backend + tipagem forte | ✓ Validado |
| RBAC no backend | Contadores só acessam processos autorizados | ✓ Validado |
| Marketplace de Contadores | Autonomia do cliente (Ética OAB) | ✓ Validado |
| Cliente escolhe contador (não advogado) | Evitar indicação indevida — OAB | ✓ Arquitetural |
| Consentimento como tabela imutável | Auditabilidade LGPD — nunca deletar | Planejado |
| Assinatura v1 sem Stripe | Speed-to-market — Stripe em v2 | Planejado |
| Landing page substitui redirect `/` | Entrada comercial antes do login | Planejado |

## Evolution

Este documento evolui a cada transição de fase e marco do projeto.

*Last updated: 2026-05-14 — Milestone 1.1 iniciado, escopo expandido para MVP completo.*
