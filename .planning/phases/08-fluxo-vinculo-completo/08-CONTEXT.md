# Phase 8: Fluxo de Vínculo Completo + Entregáveis - Context

**Gathered:** 2026-05-14
**Status:** Ready for planning

<domain>
## Phase Boundary

Ciclo de vida do vínculo processo↔contador ponta a ponta — do pedido do cliente até a conclusão aprovada pelo advogado. Nova entidade `deliverables` com upload via MinIO (já disponível após Fase 7). Timeline de processo como entidade `process_events`.

Entregas:
- Backend: Extensão do `LinkStatus` com novos estados; migration SQL
- Backend: `LinkService` (criado em Fase 7) estendido com transições de estado e validação por role
- Backend: Nova entidade `deliverables` + endpoints de submissão/aprovação
- Backend: Nova tabela `process_events` + registro automático em cada mudança de estado
- Frontend (Advogado): Painel de processo com contador atual, estado do vínculo, aprovação de entregas
- Frontend (Contador): Submissão de entregas e mudança de estados
- Frontend (Cliente): Exibição de contador vinculado + estado do vínculo no painel de processo

</domain>

<decisions>
## Implementation Decisions

### Migração dos Estados de Vínculo
- **D-01:** Renomear estados via migration SQL: `UPDATE process_accountant_links SET status='pendente' WHERE status='escolha_pendente'`; `UPDATE ... SET status='cancelado' WHERE status IN ('encerrado', 'expirado')`.
- **D-02:** Novos estados adicionados: `em_andamento`, `entregue`, `revisao_solicitada`, `concluido`, `cancelamento_solicitado`, `cancelado`.
- **D-03:** Ciclo completo: `pendente → aceito → ativo → em_andamento → entregue → [concluido | revisao_solicitada → entregue] | [cancelamento_solicitado → cancelado]`.
- **D-04:** Estado `cancelamento_solicitado`: período de 48h onde contador pode entregar pendências antes do cancelamento efetivar.

### Regras de Transição (enforcement no LinkService)
- **D-05:** `aceito → ativo`: somente contador (ao aceitar formalmente o início do serviço)
- **D-06:** `ativo → em_andamento`: somente contador
- **D-07:** `em_andamento → entregue`: somente contador (ao submeter entrega)
- **D-08:** `entregue → concluido`: somente advogado (aprovação)
- **D-09:** `entregue → revisao_solicitada`: somente advogado (pedido de revisão com comentário)
- **D-10:** `revisao_solicitada → entregue`: somente contador (resubmissão)
- **D-11:** `* → cancelamento_solicitado`: somente advogado
- **D-12:** `cancelamento_solicitado → cancelado`: automático após 48h OU confirmação manual do contador

### Entidade Entregável (Deliverable)
- **D-13:** Nova tabela `deliverables` (id, link_id, submitted_by, content_text, file_path, file_name, file_size, status, review_comment, submitted_at, reviewed_at, created_at).
- **D-14:** `file_path` referencia objeto no MinIO bucket `connexo-deliverables` (MinIO já disponível após Fase 7).
- **D-15:** `POST /api/acc/links/{id}/entregas` — multipart: texto + arquivo opcional.
- **D-16:** `PUT /api/adv/links/{id}/entregas/{eid}/aprovar` — advogado aprova.
- **D-17:** `PUT /api/adv/links/{id}/entregas/{eid}/revisar` — advogado solicita revisão com `review_comment`.
- **D-18:** `GET /api/adv/processes/{id}` (ou sub-rota) retorna histórico de entregas do processo.

### Timeline do Processo
- **D-19:** Nova tabela `process_events` (id, process_id, event_type TEXT, actor_id UUID, actor_role TEXT, metadata JSONB, created_at TIMESTAMP).
- **D-20:** Registrar evento em cada: mudança de estado de vínculo, submissão de entrega, aprovação/revisão, cancelamento.
- **D-21:** `GET /api/adv/processes/{id}/timeline` já existe — estender para incluir events de vínculo além dos atuais.

### Cancelamento e Acesso do Contador
- **D-22:** Ao criar `cancelamento_solicitado`: advogado envia motivo; contador notificado com prazo de 48h.
- **D-23:** Após 48h sem confirmação: job/check automático move para `cancelado` (ou verificação lazy no próximo request).
- **D-24:** Com status `cancelado` ou `cancelamento_solicitado`: `acc.GetProcess` e `acc.ListProcesses` excluem o processo do retorno do contador (acesso efetivamente encerrado).

### Claude's Discretion
- Implementação do "timer de 48h": verificação lazy (ao acessar) vs job periódico. Recomendado: verificação lazy para MVP.
- Formato de `metadata` JSONB em `process_events` (ex: `{"from_status": "ativo", "to_status": "em_andamento"}`)
- Bucket MinIO separado `connexo-deliverables` vs compartilhar `connexo-docs`

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requisitos
- `.planning/REQUIREMENTS.md` — LINK-01 a LINK-07, DELIV-01 a DELIV-03, ACCT-04, LAWY-03, CLNT-05..06
- `.planning/ROADMAP.md` §Phase 8 — Goal, success criteria, planos 8.1 a 8.4

### Código Existente Base
- `app/api/internal/domain/entities.go` — `LinkStatus`, `ProcessAccountantLink` (ver estados atuais)
- `app/api/internal/repository/link.go` — `Create`, `Update`, `FindActiveByProcess`, `ListByAccountant`
- `app/api/internal/handler/routes.go` — endpoints de vínculo existentes (acc.AcceptLink, acc.RejectLink, cli.BindAccountant)
- `app/api/internal/repository/migration.go` — schema atual (TEXT status, não ENUM — migração é UPDATE)
- `.planning/phases/07-completar-fundacao-quebrada/07-CONTEXT.md` — MinIO integrado na Fase 7 (bucket, SDK, env vars)

### Fase 7 (dependência)
- MinIO disponível após Fase 7: bucket `connexo-docs` e SDK `github.com/minio/minio-go/v7`
- `LinkService` criado na Fase 7 — esta fase estende ele com novos estados

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `domain.NotificationRepository.Create` — notificar contador/advogado/cliente em cada transição de estado
- `DocumentRepository` + MinIO (Fase 7) — padrão reutilizável para upload de entregáveis
- `audit_logs` — não reuso para timeline, mas padrão de inserção é referência para `process_events`

### Established Patterns
- Handlers verificam `user.Role` via `r.Context().Value(userContextKey)` para autorização
- `respondErr` / `respond` para respostas JSON padronizadas
- `NamedExecContext` para inserts, `GetContext`/`SelectContext` para reads

### Integration Points
- `LawyerProcessDetail` frontend — precisará mostrar entregáveis, estado do vínculo, contador atual
- `AccountantProcessDetail` frontend — botões de mudança de estado, submissão de entrega
- `ClientProcessDetail` frontend — exibição de contador e status (read-only)
- `GET /api/adv/processes/{id}/timeline` — estender retorno para incluir `process_events`

</code_context>

<specifics>
## Specific Ideas
- Cancelamento com período de 48h para contador confirmar/finalizar — estado `cancelamento_solicitado`
- Verificação lazy do timer de 48h: no próximo GET do processo, verificar `cancelamento_requested_at + 48h < now()`
- Entregáveis armazenados no MinIO bucket `connexo-deliverables` separado de documentos

</specifics>

<deferred>
## Deferred Ideas
- Notificação automática por email quando cancelamento é solicitado (requer SMTP, adicionado em Fase 7 para convites)
- Múltiplos arquivos por entregável — MVP aceita 1 arquivo por submissão
- Export PDF do histórico de entregas — Fase posterior

</deferred>

---

*Phase: 08-fluxo-vinculo-completo*
*Context gathered: 2026-05-14*
