---
phase: 8
plan: "08-PLAN"
type: standard
wave: 1
depends_on:
  - 7
files_modified:
  - app/api/db/migrations/08_vinculo_estados.sql
  - app/api/internal/domain/entities.go
  - app/api/internal/service/link.go
  - app/api/internal/repository/link.go
  - app/api/internal/repository/deliverable.go
  - app/api/internal/handler/routes.go
  - app/api/internal/handler/link.go
  - app/api/internal/handler/deliverable.go
  - app/api/internal/repository/process_events.go
  - docker-compose.yml
  - app/web/src/pages/adv/LawyerProcessDetail.tsx
  - app/web/src/pages/acc/AccountantProcessDetail.tsx
  - app/web/src/pages/cli/ClientProcessDetail.tsx
autonomous: true
requirements:
  - LINK-01
  - LINK-02
  - LINK-03
  - LINK-04
  - LINK-05
  - LINK-06
  - LINK-07
  - DELIV-01
  - DELIV-02
  - DELIV-03
  - ACCT-04
  - LAWY-03
  - CLNT-05
  - CLNT-06
---

# Phase 8: Fluxo de Vínculo Completo + Entregáveis - Plan

## Tasks

<tasks>

<task type="auto">
  <name>Task 1: Migração SQL — novos estados + tabelas process_events e deliverables</name>
  <files>
    - app/api/db/migrations/08_vinculo_estados.sql
    - app/api/internal/domain/entities.go
  </files>
  <action>
    Criar migration SQL (08_vinculo_estados.sql) que:
    1. Atualiza estados existentes: 'escolha_pendente' → 'pendente', 'encerrado'/'expirado' → 'cancelado'
    2. Adiciona novos estados: 'em_andamento', 'entregue', 'revisao_solicitada', 'concluido', 'cancelamento_solicitado'
    3. Cria tabela `deliverables` (id UUID, link_id UUID REFERENCES process_accountant_links(id), submitted_by UUID REFERENCES users(id), content_text TEXT, file_name VARCHAR, file_size BIGINT, status VARCHAR DEFAULT 'entregue' NOT NULL, review_comment TEXT, submitted_at TIMESTAMP, reviewed_at TIMESTAMP, created_at TIMESTAMP DEFAULT now())
    4. Cria tabela `process_events` (id UUID, process_id UUID REFERENCES processes(id) NOT NULL, event_type VARCHAR NOT NULL, actor_id UUID REFERENCES users(id), actor_role VARCHAR, metadata JSONB, created_at TIMESTAMP DEFAULT now())
    Em entities.go: atualizar constantes LinkStatus com novos valores.
  </action>
  <verify>
    cd app/api && go build -v ./...
  </verify>
  <done>
    Migration SQL com 2 novas tabelas, atualização de estados, e compilação Go sem erros (D-01, D-02, D-13, D-19).
  </done>
</task>

<task type="auto">
  <name>Task 2: Backend — Transições de estado no LinkService + endpoints</name>
  <files>
    - app/api/internal/service/link.go
    - app/api/internal/repository/link.go
    - app/api/internal/repository/process_events.go
    - app/api/internal/handler/link.go
    - app/api/internal/handler/routes.go
  </files>
  <action>
    No LinkService (service/link.go): implementar método TransitionStatus(linkID, newStatus, actorID, actorRole) que:
    1. Busca o link atual e valida a transição conforme regras (D-05 a D-12)
    2. Atualiza status no banco via repository/link.go
    3. Insere evento em process_events (D-20) via novo repository/process_events.go
    4. Dispara notificação via NotificationRepository.Create

    Regras de transição:
    - aceito→ativo: somente contador (D-05)
    - ativo→em_andamento: somente contador (D-06)
    - em_andamento→entregue: somente contador (D-07)
    - entregue→concluido: somente advogado (D-08)
    - entregue→revisao_solicitada: somente advogado (D-09)
    - revisao_solicitada→entregue: somente contador (D-10)
    - *→cancelamento_solicitado: somente advogado (D-11)
    - cancelamento_solicitado→cancelado: automático 48h ou contador confirma (D-12)

    Em handler/link.go: criar/atualizar handlers POST /api/adv/links/{id}/transicao, POST /api/acc/links/{id}/transicao
    Em routes.go: registrar handlers.
    Em repository/process_events.go: Create, ListByProcess.
  </action>
  <verify>
    cd app/api && go build -v ./...
  </verify>
  <done>
    LinkService com transições de estado validadas por role, eventos registrados em process_events, notificações disparadas, endpoints registrados (D-05 a D-12, D-20, D-21).
  </done>
</task>

<task type="auto">
  <name>Task 3: Backend — Entregáveis endpoints + MinIO</name>
  <files>
    - app/api/internal/repository/deliverable.go
    - app/api/internal/handler/deliverable.go
    - app/api/internal/handler/routes.go
    - app/api/internal/repository/document.go
  </files>
  <action>
    Em repository/deliverable.go: Create, GetByID, ListByLink, UpdateReview.

    Em handler/deliverable.go:
    - POST /api/acc/links/{id}/entregas — multipart form (content_text + file opcional). Upload do arquivo para MinIO bucket "connexo-deliverables" (D-14, D-15).
    - PUT /api/adv/links/{id}/entregas/{eid}/aprovar — advogado aprova, transita link para 'concluido' (D-16).
    - PUT /api/adv/links/{id}/entregas/{eid}/revisar — advogado solicita revisão com review_comment, transita link para 'revisao_solicitada' (D-17).
    - GET /api/adv/processes/{id} — retorna histórico de entregas do processo (D-18).

    Em document.go: reutilizar padrão MinIO SDK (minio-go/v7) para upload no bucket connexo-deliverables.

    Em routes.go: registrar novos handlers.

    Verificação lazy de 48h: no GET do processo, se status=cancelamento_solicitado e now() > requested_at + 48h, auto-transitar para cancelado (D-23).
  </action>
  <verify>
    cd app/api && go build -v ./... && go vet ./...
  </verify>
  <done>
    CRUD de entregáveis com upload MinIO real, aprovação/revisão por advogado, e verificação lazy de cancelamento 48h (D-13 a D-18, D-22, D-23).
  </done>
</task>

<task type="auto">
  <name>Task 4: Frontend — UI de estado, entregáveis e timeline</name>
  <files>
    - app/web/src/pages/adv/LawyerProcessDetail.tsx
    - app/web/src/pages/acc/AccountantProcessDetail.tsx
    - app/web/src/pages/cli/ClientProcessDetail.tsx
  </files>
  <action>
    Seguir padrão UI existente (connexo-primitives, bg-rose-50 para erros, spinners de loading).

    LawyerProcessDetail.tsx:
    1. Exibir estado atual do vínculo com badge colorido
    2. Botão "Aprovar Entrega" e "Solicitar Revisão" para cada deliverable pendente (D-16, D-17)
    3. Botão "Solicitar Cancelamento" com motivo (D-22)
    4. Timeline visual com eventos de process_events (D-21)

    AccountantProcessDetail.tsx:
    1. Botões de transição: "Iniciar Serviço" (ativo), "Em Andamento", "Entregar" (upload multipart) (D-05, D-06, D-07, D-15)
    2. Formulário de submissão de entrega com campo texto + upload de arquivo
    3. Exibir feedback de revisão quando advogado solicitar

    ClientProcessDetail.tsx:
    1. Exibição do contador vinculado + estado atual (read-only)
    2. Timeline do processo (read-only)

    Loading states: disabled=true + spinner ao salvar.
    Error states: bg-rose-50 border-rose-200 text-rose-700.
    Success: banner temporário por 6s.
  </action>
  <verify>
    cd app/web && npm run build
  </verify>
  <done>
    UI dos 3 perfis integrada com backend: transições de estado, timeline, entregas, cancelamento — com loading, erro e sucesso (D-05 a D-24).
  </done>
</task>

</tasks>

## Verificação
- Backend: cd app/api && go build -v ./... && go vet ./...
- Frontend: cd app/web && npm run build
- MinIO: docker-compose config (verificar bucket connexo-deliverables)
