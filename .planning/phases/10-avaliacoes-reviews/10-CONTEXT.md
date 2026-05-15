# Phase 10: Avaliações e Reviews - Context

**Gathered:** 2026-05-15
**Status:** Ready for planning

<domain>
## Phase Boundary

Sistema de avaliação pós-serviço: cliente avalia contador após conclusão, nota média visível no catálogo e perfil público, contador pode responder. Validação de elegibilidade no backend — apenas clientes com vínculo `concluido` podem avaliar.

Entregas:
- Backend: Entidade `AccountantReview` + endpoints POST/GET/reply
- Backend: Cálculo de nota média e atualização em `accountants.rating`
- Frontend: Formulário de avaliação no `ClientProcessDetail`
- Frontend: Exibição de nota média e reviews no catálogo e perfil público

</domain>

<decisions>
## Implementation Decisions

### Elegibilidade e Regras
- **D-01:** Somente cliente pode avaliar (não advogado).
- **D-02:** Pré-requisito: vínculo entre o cliente e o contador deve estar com status `concluido`.
- **D-03:** 1 avaliação por cliente por vínculo (unique constraint: `link_id`).
- **D-04:** Backend retorna 403 se: usuário não é cliente, ou vínculo não é `concluido`, ou avaliação já existe para o link.

### Entidade Review
- **D-05:** Nova tabela `accountant_reviews` (id, accountant_id, client_id, link_id, rating INT CHECK(1-5), comment TEXT NULL (max 1000 chars), reply_text TEXT NULL, submitted_at, replied_at).
- **D-06:** `rating` obrigatório (1-5, inteiro). `comment` opcional.
- **D-07:** `reply_text` campo na mesma tabela (não tabela separada). Contador edita via `PUT /api/acc/reviews/{id}/reply`.
- **D-08:** `rating` médio recalculado após cada nova review: `UPDATE accountants SET rating = (SELECT AVG(rating) FROM accountant_reviews WHERE accountant_id = ?)`.

### Endpoints
- **D-09:** `POST /api/cli/reviews` — cliente envia avaliação (body: link_id, rating, comment).
- **D-10:** `GET /api/public/accountants/{slug}/reviews` — lista pública de reviews com nota, comentário e resposta do contador.
- **D-11:** `PUT /api/acc/reviews/{id}/reply` — contador adiciona/edita resposta (body: reply_text).
- **D-12:** `GET /api/public/accountants` e `GET /api/public/accountants/{slug}` incluem `rating` e `review_count` no retorno.

### Frontend
- **D-13:** Formulário de avaliação aparece no `ClientProcessDetail` quando `link.status === 'concluido'` e não existe avaliação prévia.
- **D-14:** Perfil público: seção "Avaliações" exibe stars, comentário e resposta do contador (placeholder "Em breve" substituído por dados reais).
- **D-15:** Catálogo: card do contador exibe nota média (stars) e quantidade de avaliações.

### Claude's Discretion
- Componente de estrelas reutilizável para avaliação e exibição
- Paginação de reviews no perfil público (default: 10 por página)
- Ordenação: mais recentes primeiro

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requisitos
- `.planning/REQUIREMENTS.md` — REV-01, REV-02, REV-03, REV-04
- `.planning/ROADMAP.md` §Phase 10 — Goal, success criteria, planos 10.1 e 10.2

### Código Existente
- `app/api/internal/domain/entities.go` — `Accountant.rating` já existe (float64)
- `app/api/internal/repository/link.go` — `FindByID` para validar link_id e status
- `app/web/src/pages/ClientProcessDetail.tsx` — onde o form de avaliação será inserido
- `app/web/src/pages/AccountantPublicProfile.tsx` — seção de avaliações a completar
- `.planning/phases/08-fluxo-vinculo-completo/08-CONTEXT.md` — estados de vínculo (concluido = elegível)
- `.planning/phases/09-perfil-rico-contador/09-CONTEXT.md` — seções do perfil público

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `Accountant.rating` e `Accountant.completed_cases` — já existem, atualizar após review
- `clientMW` — middleware para rotas de cliente
- `accountantMW` — middleware para rotas do contador

### Established Patterns
- Validação de acesso via role no contexto do request
- `NamedExecContext` para inserts, `ExecContext` para updates pontuais
- Frontend: `api.post<T>(path, body)` com tratamento de erro 403

### Integration Points
- `ClientProcessDetail`: condicional para exibir form (link.status === 'concluido' && !review)
- `GET /api/public/accountants/{slug}`: enriquecer com `review_count` além do `rating`

</code_context>

<specifics>
## Specific Ideas
- Review form acessível direto no painel de processo do cliente — sem redirecionamento
- 1 resposta por review (campo na mesma tabela, editável pelo contador)
- Nota média arredondada para 1 casa decimal no frontend

</specifics>

<deferred>
## Deferred Ideas
- Moderação de reviews pelo admin — Fase posterior
- Denúncia de review imprópria — Fase posterior
- Filtro de reviews por nota no perfil público — posterior

</deferred>

---

*Phase: 10-avaliacoes-reviews*
*Context gathered: 2026-05-15*
