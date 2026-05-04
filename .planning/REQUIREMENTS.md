# Requirements: Connexo

**Defined:** 2026-05-04
**Core Value:** Facilitar a conexão transparente, segura e ética entre clientes jurídicos e contadores, centralizando a gestão de processos e documentos.

## v1 Requirements

### 🎨 Migração e UI (Sovereign Gilded)
- [ ] **MIGR-01**: Migrar as páginas de Login e Registro do protótipo legacy para `app/web/src` com design system Sovereign Gilded.
- [ ] **MIGR-02**: Migrar o Dashboard principal do protótipo legacy para `app/web/src`.
- [ ] **MIGR-03**: Migrar as páginas de Clientes e Detalhes de Processo seguindo o mapeamento de `prototipo-fonte.md`.
- [ ] **MIGR-04**: Implementar as páginas de Postagens, Serviços e Configurações no frontend moderno.
- [ ] **MIGR-05**: Substituir dados mockados de `data.jsx` por chamadas reais à API em Go ou novos modelos TS.

### ⚖️ Painel do Advogado
- [ ] **LAWY-01**: Advogado pode gerenciar sua assinatura da plataforma.
- [ ] **LAWY-02**: Advogado pode cadastrar e gerenciar clientes e seus respectivos processos.
- [ ] **LAWY-03**: Advogado visualiza o contador escolhido pelo cliente para cada processo e o status do vínculo.
- [ ] **LAWY-04**: Advogado pode configurar permissões e acessos específicos para o contador em cada processo.
- [ ] **LAWY-05**: Advogado recebe notificações sobre movimentações feitas pelo contador ou cliente.

### 📊 Portal do Contador
- [ ] **ACCT-01**: Contador pode cadastrar e editar seu perfil profissional e configurar sua landing page pública.
- [ ] **ACCT-02**: Contador visualiza uma lista de processos aos quais foi vinculado e autorizada sua atuação.
- [ ] **ACCT-03**: Contador pode realizar upload de documentos fiscais e contábeis relacionados ao processo.
- [ ] **ACCT-04**: Contador pode registrar pareceres e relatórios técnicos no painel do processo.
- [ ] **ACCT-05**: Contador recebe notificações de novos vínculos e pendências documentais.

### 🛒 Catálogo e Marketplace
- [ ] **MARK-01**: Cliente pode navegar em um catálogo estilo "app store" para visualizar contadores disponíveis.
- [ ] **MARK-02**: Cliente pode aplicar filtros de busca (especialidade, localização) no catálogo.
- [ ] **MARK-03**: Cliente pode visualizar a landing page detalhada de cada contador parceiro.
- [ ] **MARK-04**: Cliente pode escolher/contratar um contador para um processo específico com confirmação em tela.

### 👤 Painel do Cliente
- [ ] **CLNT-01**: Cliente pode visualizar a lista de seus processos cadastrados pelo advogado.
- [ ] **CLNT-02**: Cliente pode realizar a escolha do contador através do catálogo integrado.
- [ ] **CLNT-03**: Cliente pode enviar documentos solicitados pelo advogado ou contador.
- [ ] **CLNT-04**: Cliente recebe notificações sobre o andamento de seus processos e pendências.

### 🔒 Segurança e Conformidade (LGPD/OAB)
- [ ] **SEC-01**: Controle rígido de acesso: contador só acessa processos onde o vínculo está "Ativo".
- [ ] **SEC-02**: Implementar logs de auditoria para todos os acessos, uploads e alterações em documentos.
- [ ] **SEC-03**: Implementar fluxo de consentimento explícito do cliente para compartilhamento de dados com o contador.
- [ ] **SEC-04**: Separação clara de interfaces e fluxos financeiros para evitar conflitos éticos (mercantilização).

## v2 Requirements
- **FIN-01**: Integração de pagamentos recorrentes e split de faturamento.
- **DOC-01**: Assinatura digital de documentos integrada à plataforma.
- **AI-01**: Análise automatizada de documentos fiscais por IA.

## Out of Scope
| Feature | Reason |
|---------|--------|
| Mobile App Nativo | Foco inicial em Web Responsivo/PWA para agilidade de lançamento. |
| Chat em Tempo Real | Notificações e comentários nos processos suprem a necessidade inicial. |

## Traceability
| Requirement | Phase | Status |
|-------------|-------|--------|
| MIGR-01 | Phase 1 | Pending |
| MIGR-02 | Phase 1 | Pending |
| LAWY-02 | Phase 1 | Pending |
| MARK-01 | Phase 2 | Pending |
| MARK-04 | Phase 2 | Pending |
| CLNT-02 | Phase 2 | Pending |
| ACCT-01 | Phase 3 | Pending |
| ACCT-02 | Phase 3 | Pending |
| SEC-01 | Phase 3 | Pending |
| MIGR-05 | Phase 4 | Pending |
| SEC-02 | Phase 4 | Pending |
| LAWY-04 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 26 total
- Mapped to phases: 12 (Core features)
- Unmapped: 14 (Sub-features/refinements)
