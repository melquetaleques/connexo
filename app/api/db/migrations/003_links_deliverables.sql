-- 003_links_deliverables
-- Vínculo processo ↔ contador, entregáveis e timeline de eventos.
--
-- Regra de negócio (escopo §6): o vínculo é POR PROCESSO. Um mesmo cliente pode
-- escolher contadores diferentes para processos diferentes, por isso process_id
-- é obrigatório e a unicidade é (process_id, accountant_id).
--
-- client_id e accountant_id apontam para users(id) — são os atores que recebem
-- notificações e cujo acesso é autorizado pelo vínculo.

CREATE TABLE IF NOT EXISTS process_accountant_links (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    process_id    UUID NOT NULL REFERENCES processes(id) ON DELETE CASCADE,
    client_id     UUID NOT NULL REFERENCES users(id),
    accountant_id UUID NOT NULL REFERENCES users(id),
    status        TEXT NOT NULL DEFAULT 'pendente'
                    CHECK (status IN (
                      'pendente',
                      'solicitado',
                      'aceito',
                      'recusado',
                      'ativo',
                      'em_andamento',
                      'entregue',
                      'revisao_solicitada',
                      'concluido',
                      'cancelamento_solicitado',
                      'cancelado'
                    )),
    accepted_at   TIMESTAMPTZ,
    ended_at      TIMESTAMPTZ,
    end_reason    TEXT NOT NULL DEFAULT '',
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (process_id, accountant_id)
);

CREATE INDEX IF NOT EXISTS idx_links_process ON process_accountant_links(process_id);
CREATE INDEX IF NOT EXISTS idx_links_accountant ON process_accountant_links(accountant_id);
CREATE INDEX IF NOT EXISTS idx_links_client ON process_accountant_links(client_id);
CREATE INDEX IF NOT EXISTS idx_links_status ON process_accountant_links(status);

-- Um processo só pode ter um vínculo vigente por vez (escopo §6).
CREATE UNIQUE INDEX IF NOT EXISTS idx_links_one_active_per_process
    ON process_accountant_links(process_id)
    WHERE status NOT IN ('recusado','cancelado','concluido');

-- ============================================================
-- ENTREGÁVEIS
-- ============================================================
CREATE TABLE IF NOT EXISTS deliverables (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    link_id        UUID NOT NULL REFERENCES process_accountant_links(id) ON DELETE CASCADE,
    submitted_by   UUID NOT NULL REFERENCES users(id),
    content_text   TEXT NOT NULL DEFAULT '',
    file_name      TEXT NOT NULL DEFAULT '',
    file_size      BIGINT NOT NULL DEFAULT 0,
    status         TEXT NOT NULL DEFAULT 'entregue'
                     CHECK (status IN ('entregue','aprovado','revisao_solicitada')),
    review_comment TEXT NOT NULL DEFAULT '',
    submitted_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reviewed_at    TIMESTAMPTZ,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_deliverables_link_id ON deliverables(link_id);
CREATE INDEX IF NOT EXISTS idx_deliverables_status ON deliverables(status);

-- ============================================================
-- TIMELINE DO PROCESSO
-- ============================================================
CREATE TABLE IF NOT EXISTS process_events (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    process_id UUID NOT NULL REFERENCES processes(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    actor_id   UUID REFERENCES users(id) ON DELETE SET NULL,
    actor_role TEXT NOT NULL DEFAULT '',
    metadata   JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_process_events_process ON process_events(process_id, created_at);
