# Phase 11: LGPD + Gestão Documental Avançada - Context

**Gathered:** 2026-05-15
**Status:** Ready for planning

<domain>
## Phase Boundary

Consentimento explícito LGPD do cliente antes de confirmar vínculo com contador, permissão granular por documento (toggle por doc no processo), log de acesso individual por documento, e solicitação de documento apenas pelo advogado ao cliente.

Entregas:
- Backend: Tabela `client_consents` + flow de consentimento antes do vínculo
- Backend: Tabela `doc_permissions` (por documento por vínculo)
- Backend: Log de acesso por documento integrado ao `audit_logs` existente
- Backend: Endpoint de solicitação de documento (advogado → cliente)
- Frontend: Modal de consentimento no fluxo de binding do cliente
- Frontend: Painel de permissões de documentos no processo (advogado)
- Frontend: Notificação de solicitação de documento (cliente)

</domain>

<decisions>
## Implementation Decisions

### Consentimento LGPD
- **D-01:** Modal aparece para o CLIENTE ao confirmar vínculo (fluxo: cliente escolhe contador → modal LGPD → confirma → vínculo criado).
- **D-02:** Texto fixo para MVP: "Ao prosseguir, autorizo [Nome do Contador] a acessar meus documentos neste processo para fins contábeis, conforme termos de uso e política de privacidade do Connexo."
- **D-03:** Checkbox "Li e aceito" obrigatório — sem aceite, botão de confirmar desabilitado.
- **D-04:** Nova tabela `client_consents` (id, client_id, link_id, consented_at, ip_address, user_agent, text_version). `text_version` é string fixa para MVP (ex: `"v1.0"`). NUNCA deletar registros.
- **D-05:** Backend valida: ao criar vínculo via `POST /api/cli/vincular-contador`, exigir `consent_token` ou criar consent inline. Sem consent registrado → 403.
- **D-06:** Nota: advogado como procurador tem autoridade legal (OAB), mas o modal de transparência é mantido para o cliente.

### Permissões por Documento
- **D-07:** Nova tabela `doc_permissions` (id, document_id, link_id, granted_by UUID, granted_at TIMESTAMP, revoked_at TIMESTAMP NULL).
- **D-08:** Default: documento NÃO visível ao contador após vínculo criado. Advogado deve marcar explicitamente "visível ao contador" por documento.
- **D-09:** `GET /api/acc/processes/{id}` exclui documentos sem permissão (join com `doc_permissions` onde `revoked_at IS NULL`). Retorna 403 em acesso direto sem permissão.
- **D-10:** `PUT /api/adv/documents/{id}/permissions/{link_id}` — toggle (concede se não existe, revoga se existe).
- **D-11:** Cancelamento de vínculo (Fase 8) revoga automaticamente todas as `doc_permissions` do link (UPDATE doc_permissions SET revoked_at = NOW() WHERE link_id = ?).

### Log de Acesso por Documento
- **D-12:** Reusar tabela `audit_logs` existente. Ao contador acessar documento via proxy MinIO, registrar: action = `document_access`, resource_type = `document`, resource_id = doc_id, user_id = contador, metadata = `{ip, process_id}`.
- **D-13:** Handler proxy de media (`GET /api/media/{bucket}/{key}`) registra acesso ao `audit_logs` quando `bucket = 'connexo-docs'`.

### Solicitação de Documento
- **D-14:** Apenas advogado pode solicitar documento ao cliente (não contador diretamente).
- **D-15:** `POST /api/adv/processes/{id}/solicitar-doc` — body: `{description: string, client_id: UUID}`. Cria notificação para o cliente.
- **D-16:** Nova tabela `document_requests` (id, process_id, requested_by, client_id, description, status `pendente|atendido|cancelado`, created_at, updated_at).
- **D-17:** Cliente atende solicitação fazendo upload de documento vinculado ao processo (endpoint existente `POST /api/docs/upload` com `request_id` opcional).

### Claude's Discretion
- IP e user_agent no consent capturados do request HTTP (header `X-Real-IP` ou `RemoteAddr`)
- `text_version` no consent: constante `"lgpd-v1.0"` hardcoded no handler para MVP
- Exibição de doc_requests no painel do cliente como lista com botão "Enviar Documento"

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requisitos
- `.planning/REQUIREMENTS.md` — LGPD-01, LGPD-02, LGPD-03, LGPD-04, LGPD-05, DOC-ADV-01, SEC-03, LAWY-04
- `.planning/ROADMAP.md` §Phase 11 — Goal, success criteria, planos 11.1 e 11.2

### Código Existente
- `app/api/internal/handler/client.go` — `BindAccountant` (onde consent deve ser validado)
- `app/api/internal/handler/document.go` — `Upload`, `ListByProcess` (a estender com permissions)
- `app/api/internal/repository/audit_accountant.go` — padrão de log para reusar em doc_access
- `.planning/phases/07-completar-fundacao-quebrada/07-CONTEXT.md` — proxy MinIO (`GET /api/media/{bucket}/{key}`)
- `.planning/phases/08-fluxo-vinculo-completo/08-CONTEXT.md` — cancelamento de vínculo revoga permissões
- `app/api/internal/repository/migration.go` — schema atual para referência

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `audit_logs` table + `AuditLog` entity — log de acesso a documentos sem nova tabela
- `notificationRepo.Create` — notificar cliente sobre solicitação de documento
- `clientMW` / `lawyerMW` — middlewares de role para novos endpoints

### Established Patterns
- Toggle de visibilidade já existe: `Document.VisibleToAccountant` BOOL (simplificar/substituir por doc_permissions)
- `client.BindAccountant` handler: ponto de inserção para validação de consent

### Integration Points
- `BindAccountant` → validar consent antes de criar link
- Proxy MinIO → registrar em audit_logs quando bucket = connexo-docs
- Cancelamento de vínculo (LinkService) → revogar doc_permissions

</code_context>

<specifics>
## Specific Ideas
- `client_consents` nunca deletado (requisito LGPD de rastreabilidade)
- `doc_permissions` usa `revoked_at` nullable em vez de deleção (auditabilidade)
- Modal de consentimento no frontend: título "Autorização de Acesso a Dados", texto fixo, checkbox, botão "Confirmar e Vincular"

</specifics>

<deferred>
## Deferred Ideas
- Texto de consentimento configurável por escritório — Fase posterior
- Exportar log de acessos em PDF (relatório LGPD) — Fase posterior
- Contador solicitar doc diretamente ao cliente — redesign do fluxo, posterior

</deferred>

---

*Phase: 11-lgpd-documentacao*
*Context gathered: 2026-05-15*
