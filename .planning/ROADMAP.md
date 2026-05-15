# Roadmap: Connexo

---

## Milestone 1.0 — Fundação e Features Core
*Status: Complete — 2026-05-11*

### Phase 1: Fundação e Migração Essencial
Fluxo de cadastro de clientes e processos pelo advogado funcional.

- [x] **Plan 1.1**: Migração de Autenticação e Layout Base (MIGR-01, MIGR-02)
- [x] **Plan 1.2**: Gestão de Clientes e Processos no Frontend (LAWY-02, MIGR-03)
- [x] **Plan 1.3**: Sincronização de Tipos entre API e Web (MIGR-05)

**Status: Complete** ✅

### Phase 2: Marketplace de Contadores
Catálogo estilo "app store" para o cliente escolher o contador.

- [x] **Plan 2.1**: UI do Catálogo/Marketplace (MARK-01, MARK-02)
- [x] **Plan 2.2**: Landing Pages e Fluxo de Escolha (MARK-03, MARK-04, CLNT-02)

**Status: Complete** ✅

### Phase 3: Portal do Contador e Vínculos
Interface do contador e regras de ativação do vínculo.

- [x] **Plan 3.1**: Dashboard e Perfil do Contador (ACCT-01, ACCT-02)
- [x] **Plan 3.2**: Aceite de Vínculo e Segurança de Acesso (SEC-01, ACCT-05)

**Status: Complete** ✅

### Phase 4: Painel do Cliente e Documentação
Área do cliente e fluxo de troca de documentos.

- [x] **Plan 4.1**: Painel do Cliente (CLNT-01, CLNT-04)
- [x] **Plan 4.2**: Upload e Análise de Documentos (ACCT-03, CLNT-03)

**Status: Complete** ✅

### Phase 5: Refinamento e Auditoria
Polimento UI (Sovereign Gilded) e logs de conformidade LGPD.

- [x] **Plan 5.1**: Logs de Auditoria e Conformidade (SEC-02, SEC-03)
- [x] **Plan 5.2**: Notificações e UI Polish (LAWY-04, LAWY-05, MIGR-04)

**Status: Complete** ✅

### Phase 6: Correção de Flags e Integração
Resolver os 14 flags de verificação das fases 2-5.

- [x] **Plan 6.1**: Flags Críticos
- [x] **Plan 6.2**: Flags Médios
- [x] **Plan 6.3**: Flags Baixos

**Status: Complete** ✅ — All 14 flags resolved. Build PASS.

---

## Milestone 1.1 — MVP Completo para Produção
*Status: In Planning — 2026-05-14*

**Objetivo:** Fechar todos os gaps entre o que foi planejado e o que está funcional, implementar o fluxo de vínculo completo, avaliações, LGPD obrigatório, e landing page comercial. Plataforma pronta para produção real.

---

### Phase 7: Completar Fundação Quebrada
**Goal:** Zero funcionalidade quebrada — todos os endpoints existem, todos os formulários estão conectados à API.

**Requirements:** FOND-01, FOND-02, FOND-03, FOND-04, FOND-05, FOND-06, FOND-07, FOND-08, MIGR-04 (completar), MARK-02 (completar)

**Success criteria:**
1. `GET /api/adv/usuarios` retorna lista real da equipe do advogado.
2. `GET /api/acc/postagens` retorna posts do contador; `POST` cria post.
3. ServicesPage — "Cadastrar Serviço" salva via API e aparece na lista.
4. PostsPage — "Publicar" cria post via API e aparece no grid.
5. Catálogo — filtros de cidade e especialidade filtram resultados reais.
6. Notificação criada automaticamente quando vínculo é solicitado/aceito/recusado.

**UI hint:** yes

**Plans:**
- Plan 7.1: Backend — endpoints faltantes e notificações automáticas
- Plan 7.2: Frontend — wiring de formulários e filtros do catálogo

---

### Phase 8: Fluxo de Vínculo Completo + Entregáveis
**Goal:** Ciclo de vida do vínculo ponta a ponta — do pedido do cliente até a conclusão aprovada pelo advogado.

**Requirements:** LINK-01, LINK-02, LINK-03, LINK-04, LINK-05, LINK-06, LINK-07, LAWY-03, DELIV-01, DELIV-02, DELIV-03, ACCT-04, CLNT-05..06

**Success criteria:**
1. Advogado vê, por processo, qual contador foi escolhido e em qual estado está o vínculo.
2. Contador pode marcar vínculo como "em andamento" e submeter entrega (texto + arquivo).
3. Advogado pode aprovar entrega ou solicitar revisão com comentário.
4. Advogado pode cancelar vínculo — acesso do contador encerra imediatamente.
5. Timeline do processo exibe cada mudança de estado com data e responsável.
6. Cliente vê status do vínculo e nome do contador no painel de processo.

**UI hint:** yes

**Plans:**
- Plan 8.1: Backend — extensão de estados de vínculo, endpoints de entregáveis e aprovação
- Plan 8.2: Frontend Advogado — processo com contador + aprovação de entregas
- Plan 8.3: Frontend Contador — submissão de entregas e estados de vínculo
- Plan 8.4: Frontend Cliente — status do vínculo no painel de processo

---

### Phase 9: Perfil Rico do Contador
**Goal:** Contador tem perfil completo, funcional e atrativo — logo, fotos, posts reais, disponibilidade.

**Requirements:** PROF-01, PROF-02, PROF-03, PROF-04, ACCT-01 (completar)

**Success criteria:**
1. Contador faz upload de logo e foto — aparecem no perfil público e no catálogo.
2. Contador alterna status de disponibilidade — catálogo reflete em tempo real.
3. Contador publica post via PostsPage — aparece no perfil público imediatamente.
4. Perfil público exibe: logo, fotos, bio, especialidades, serviços, posts e disponibilidade.
5. Catálogo filtra por disponibilidade.

**UI hint:** yes

**Plans:**
- Plan 9.1: Backend — media upload, posts CRUD, campo availability no perfil
- Plan 9.2: Frontend Perfil Público — foto/logo, posts, disponibilidade
- Plan 9.3: Frontend Painel Contador — edição de foto/logo, PostsPage funcional

---

### Phase 10: Avaliações e Reviews
**Goal:** Cliente avalia contador após conclusão; nota média visível no catálogo e perfil.

**Requirements:** REV-01, REV-02, REV-03, REV-04

**Success criteria:**
1. Cliente com vínculo `concluido` vê botão "Avaliar" no painel de processo.
2. Formulário de avaliação (1-5 estrelas + comentário) salva via API.
3. Tentativa de avaliar sem vínculo concluído retorna erro 403.
4. Perfil público exibe nota média, quantidade de avaliações e últimos comentários.
5. Catálogo ordena/exibe nota média nos cards dos contadores.
6. Contador pode responder avaliação — resposta aparece abaixo do comentário.

**UI hint:** yes

**Plans:**
- Plan 10.1: Backend — `AccountantReview` entity, endpoints POST/GET reviews, cálculo de média
- Plan 10.2: Frontend — avaliação no ClientProcessDetail, rating no catálogo e perfil

---

### Phase 11: LGPD + Gestão Documental Avançada
**Goal:** Consentimento explícito LGPD, permissão por documento, log de acesso individual.

**Requirements:** LGPD-01, LGPD-02, LGPD-03, LGPD-04, LGPD-05, DOC-ADV-01, SEC-03, LAWY-04 (completar)

**Success criteria:**
1. Modal de consentimento aparece antes do cliente confirmar vínculo — sem aceite, vínculo não é criado.
2. Advogado pode marcar documentos como "visível ao contador" ou "restrito" por processo.
3. Contador sem permissão explícita recebe 403 ao tentar acessar documento restrito.
4. Todo acesso individual a documento gera registro (user_id, doc_id, timestamp, IP).
5. Cancelamento de vínculo revoga todas as permissões de documento automaticamente.
6. Advogado ou contador pode solicitar documento ao cliente com motivo — cliente recebe notificação.

**UI hint:** yes

**Plans:**
- Plan 11.1: Backend — consent flow, document permissions table, per-document access log
- Plan 11.2: Frontend — modal consentimento, painel de permissões de docs, solicitação de doc

---

### Phase 12: Landing Page + Assinatura do Advogado
**Goal:** Landing page comercial funcional e gestão básica de assinatura.

**Requirements:** SUB-01, SUB-02, SUB-03, SUB-04, LAWY-01, SEC-04

**Success criteria:**
1. Rota pública `/` exibe landing page com proposta de valor, planos, FAQ e CTA.
2. Landing page converte para `/register?role=advogado` no CTA principal.
3. Backend retorna plano atual, data de vencimento e status do advogado logado.
4. LawyerSubscriptionPage exibe dados reais — sem dados mockados.
5. Advogado com assinatura expirada vê tela de bloqueio com CTA de renovação.
6. Separação ética explícita: contador recebe por serviço prestado, nunca por indicação.

**UI hint:** yes

**Plans:**
- Plan 12.1: Landing page pública (rota `/` ou `/home`)
- Plan 12.2: Backend assinatura — plano, vencimento, status
- Plan 12.3: Frontend — LawyerSubscriptionPage com dados reais + tela de expiração

---

### Phase 13: Verificação E2E e Preparação para Produção
**Goal:** Plataforma verificada end-to-end por todos os roles, dockerizada e pronta para deploy.

**Requirements:** Todos os anteriores validados em produção.

**Success criteria:**
1. Cold start: docker-compose up → API health check retorna OK em < 5s.
2. Fluxo completo testado: advogado cria processo → cliente escolhe contador → contador entrega → advogado aprova → cliente avalia.
3. Fluxo LGPD testado: consentimento exigido, acesso revogado ao cancelar vínculo.
4. Zero endpoints retornando 404 ou 500 nos fluxos principais.
5. Build frontend sem warnings de TypeScript.
6. Variáveis de ambiente documentadas em `.env.example`.

**Plans:**
- Plan 13.1: UAT completo (todos os roles e fluxos críticos)
- Plan 13.2: Hardening — variáveis de ambiente, CORS de produção, rate limiting básico
- Plan 13.3: Docker + deploy + health checks + documentação de operação
