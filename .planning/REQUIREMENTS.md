# Requirements: Connexo

**Defined:** 2026-05-04  
**Revised:** 2026-05-14 — escopo expandido para MVP completo de produção  
**Core Value:** Facilitar a conexão transparente, segura e ética entre clientes jurídicos e contadores, centralizando a gestão de processos e documentos em conformidade com OAB/LGPD.

---

## Status dos Requisitos v1 (Milestone 1.0)

### 🎨 Migração e UI
- [x] **MIGR-01**: Login e Registro migrados com design system Sovereign Gilded. ✅
- [x] **MIGR-02**: Dashboards por role (advogado, contador, cliente) migrados. ✅
- [x] **MIGR-03**: Páginas de Clientes e Detalhes de Processo migradas. ✅
- [ ] **MIGR-04**: Postagens, Serviços e Usuários — páginas existem mas sem backend funcional. ⚠️ Parcial
- [x] **MIGR-05**: Dados mockados substituídos por chamadas reais à API. ✅

### ⚖️ Painel do Advogado
- [ ] **LAWY-01**: Advogado gerencia assinatura da plataforma. ❌ Não implementado
- [x] **LAWY-02**: Advogado cadastra e gerencia clientes e processos. ✅
- [ ] **LAWY-03**: Advogado visualiza contador escolhido + status do vínculo por processo. ❌ Zero
- [ ] **LAWY-04**: Advogado configura permissões de acesso do contador por processo. ⚠️ Parcial (toggle visibility apenas)
- [x] **LAWY-05**: Advogado recebe notificações sobre movimentações. ✅

### 📊 Portal do Contador
- [ ] **ACCT-01**: Contador edita perfil profissional completo (incl. logo/fotos). ⚠️ Parcial (sem media)
- [x] **ACCT-02**: Contador visualiza processos vinculados autorizados. ✅
- [x] **ACCT-03**: Contador faz upload de documentos no processo. ✅
- [ ] **ACCT-04**: Contador registra pareceres e entregas técnicas no processo. ❌ Não implementado
- [x] **ACCT-05**: Contador recebe notificações de novos vínculos e pendências. ✅

### 🛒 Catálogo e Marketplace
- [x] **MARK-01**: Cliente navega em catálogo estilo "app store". ✅
- [ ] **MARK-02**: Cliente aplica filtros (especialidade, localização, disponibilidade). ⚠️ UI existe, backend sem filtros
- [x] **MARK-03**: Cliente visualiza landing page detalhada do contador. ✅
- [x] **MARK-04**: Cliente escolhe contador para processo específico com confirmação. ✅

### 👤 Painel do Cliente
- [x] **CLNT-01**: Cliente visualiza lista de processos cadastrados pelo advogado. ✅
- [x] **CLNT-02**: Cliente realiza escolha do contador via catálogo. ✅
- [x] **CLNT-03**: Cliente envia documentos solicitados. ✅
- [x] **CLNT-04**: Cliente recebe notificações sobre andamento e pendências. ✅

### 🔒 Segurança e Conformidade
- [x] **SEC-01**: Contador só acessa processos com vínculo "Ativo". ✅
- [x] **SEC-02**: Logs de auditoria para acessos, uploads e alterações. ✅
- [ ] **SEC-03**: Consentimento explícito do cliente antes de vincular contador. ❌ Zero
- [ ] **SEC-04**: Separação ética de interfaces e fluxos financeiros (OAB). ⚠️ Roles separadas, sem fluxo financeiro explícito

---

## Requisitos v1.1 (Milestone 2 — MVP Completo para Produção)

### 🔧 Fundação — Fechar Broken (Fase 7)

- [ ] **FOND-01**: `GET /api/adv/usuarios` — listar usuários do escritório do advogado.
- [ ] **FOND-02**: `POST /api/adv/usuarios/invite` — convidar membro para o escritório.
- [ ] **FOND-03**: `GET /api/acc/postagens` + `POST /api/acc/postagens` — CRUD de posts do contador.
- [ ] **FOND-04**: Notificações automáticas criadas no backend ao criar/aceitar/recusar vínculo.
- [ ] **FOND-05**: ServicesPage — formulário "Cadastrar Serviço" wired ao `POST /api/acc/servicos`.
- [ ] **FOND-06**: PostsPage — botão "Publicar" wired ao `POST /api/acc/postagens`.
- [ ] **FOND-07**: UsersPage — exibir dados reais via `GET /api/adv/usuarios`.
- [ ] **FOND-08**: Catálogo — filtros de especialidade e localização funcionais no backend (`GET /api/public/accountants?specialty=&city=`).

### 🔗 Fluxo de Vínculo Completo (Fase 8)

- [ ] **LINK-01**: Sistema implementa ciclo de vida completo: `pendente → aceito → ativo → em_andamento → entregue → revisao_solicitada → concluido → cancelado`.
- [ ] **LINK-02**: Advogado visualiza contador vinculado + status atual por processo no painel.
- [ ] **LINK-03**: Advogado pode cancelar/encerrar vínculo com histórico de alterações.
- [ ] **LINK-04**: Advogado pode aprovar entrega ou solicitar revisão do contador.
- [ ] **LINK-05**: Contador pode marcar processo como "em andamento" e submeter entrega.
- [ ] **LINK-06**: Cliente visualiza contador vinculado + status do vínculo no painel de processo.
- [ ] **LINK-07**: Timeline do processo reflete automaticamente cada mudança de estado do vínculo.

### 📦 Entregáveis e Serviço por Processo (Fase 8)

- [ ] **DELIV-01**: Contador registra parecer/entrega técnica vinculada a processo específico (texto + arquivo).
- [ ] **DELIV-02**: Advogado revisa entregas do contador e aprova ou pede revisão com comentário.
- [ ] **DELIV-03**: Histórico de entregas e revisões acessível por processo.

### 👤 Perfil Rico do Contador (Fase 9)

- [ ] **PROF-01**: Contador faz upload de logo e fotos do perfil/escritório.
- [ ] **PROF-02**: Contador configura status de disponibilidade (disponível/indisponível) visível no catálogo.
- [ ] **PROF-03**: Contador publica posts/artigos editoriais que aparecem no perfil público.
- [ ] **PROF-04**: Perfil público exibe logo, fotos, posts, serviços, especialidades e disponibilidade.

### ⭐ Avaliações e Reviews (Fase 10)

- [ ] **REV-01**: Cliente avalia contador após conclusão do serviço (nota 1-5 + comentário).
- [ ] **REV-02**: Perfil público e catálogo exibem nota média e quantidade de avaliações.
- [ ] **REV-03**: Sistema valida que somente clientes com vínculo `concluido` podem avaliar.
- [ ] **REV-04**: Contador pode responder a avaliações no perfil público.

### 🔒 LGPD + Gestão Documental Avançada (Fase 11)

- [ ] **LGPD-01**: Cliente assina termo de consentimento digital antes de confirmar vínculo com contador.
- [ ] **LGPD-02**: Advogado controla quais documentos do processo o contador pode acessar (permissão por documento).
- [ ] **LGPD-03**: Sistema registra log de acesso individual a cada documento (quem acessou, quando).
- [ ] **LGPD-04**: Revogação de acesso do contador encerra automaticamente todas as permissões de documento.
- [ ] **LGPD-05**: Cliente pode solicitar relatório de quem acessou seus dados (direito LGPD Art. 18).
- [ ] **DOC-ADV-01**: Advogado ou contador pode solicitar documento ao cliente com motivo e prazo.

### 🌐 Landing Page + Assinatura (Fase 12)

- [ ] **SUB-01**: Landing page comercial pública para advogados: proposta de valor, planos, FAQ, CTA de assinatura.
- [ ] **SUB-02**: Backend de assinatura: plano atual do advogado, data de vencimento, status ativo/inativo.
- [ ] **SUB-03**: LawyerSubscriptionPage exibe dados reais: plano, vencimento, histórico de pagamentos.
- [ ] **SUB-04**: Advogado sem assinatura ativa vê tela de expiração com CTA para renovar.

---

## v2 Requirements (próximo milestone — fora de escopo agora)

- **PAY-01**: Integração Stripe — pagamento recorrente de assinatura do advogado.
- **PAY-02**: Split de repasse ao contador por serviço concluído.
- **DOC-SIGN-01**: Assinatura digital de documentos integrada.
- **AI-01**: Análise automatizada de documentos fiscais por IA.
- **WORKER-01**: Jobs reais com Redis/filas para processamento assíncrono.
- **TEST-01**: Suite de testes automatizados (frontend + backend).

---

## Out of Scope
| Feature | Reason |
|---------|--------|
| Mobile App Nativo | Foco em Web Responsivo/PWA |
| Chat em Tempo Real | Notificações cobrem necessidade inicial |
| Pagamento Recorrente Completo | v2 após landing page de captação |
| Assinatura Digital de Docs | v2 |

---

## Traceability

### Milestone 1.0 (Fases 1-6)
| Requirement | Phase | Status |
|-------------|-------|--------|
| MIGR-01 | Phase 1 | ✅ Completed |
| MIGR-02 | Phase 1 | ✅ Completed |
| LAWY-02 | Phase 1 | ✅ Completed |
| MARK-01 | Phase 2 | ✅ Completed |
| MARK-04 | Phase 2 | ✅ Completed |
| CLNT-02 | Phase 2 | ✅ Completed |
| ACCT-01 | Phase 3 | ⚠️ Partial |
| ACCT-02 | Phase 3 | ✅ Completed |
| SEC-01 | Phase 3 | ✅ Completed |
| MIGR-05 | Phase 4 | ✅ Completed |
| SEC-02 | Phase 4 | ✅ Completed |
| LAWY-04 | Phase 5 | ⚠️ Partial |
| LAWY-05 | Phase 5 | ✅ Completed |
| ACCT-03 | Phase 4 | ✅ Completed |
| ACCT-05 | Phase 5 | ✅ Completed |
| MARK-03 | Phase 2 | ✅ Completed |
| CLNT-01 | Phase 4 | ✅ Completed |
| CLNT-03 | Phase 4 | ✅ Completed |
| CLNT-04 | Phase 5 | ✅ Completed |

### Milestone 1.1 (Fases 7-13) — pendente
| Requirement | Phase | Status |
|-------------|-------|--------|
| FOND-01..08 | Phase 7 | Planned |
| LINK-01..07 | Phase 8 | Planned |
| DELIV-01..03 | Phase 8 | Planned |
| PROF-01..04 | Phase 9 | Planned |
| REV-01..04 | Phase 10 | Planned |
| LGPD-01..05 | Phase 11 | Planned |
| DOC-ADV-01 | Phase 11 | Planned |
| SUB-01..04 | Phase 12 | Planned |
| MIGR-04 (completar) | Phase 7 | Planned |
| LAWY-01 | Phase 12 | Planned |
| LAWY-03 | Phase 8 | Planned |
| LAWY-04 (completar) | Phase 11 | Planned |
| ACCT-01 (completar) | Phase 9 | Planned |
| ACCT-04 | Phase 8 | Planned |
| MARK-02 (completar) | Phase 7 | Planned |
| SEC-03 | Phase 11 | Planned |
| SEC-04 | Phase 12 | Planned |
| CLNT-05..06 | Phase 8..10 | Planned |

**Coverage v1.1:**
- Novos requisitos: 34
- Total acumulado: 60 requisitos
- Em produção após fase 13: MVP completo
