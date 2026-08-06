-- 005_lgpd
-- Consentimento LGPD, permissão por documento e solicitações de documento.
--
-- Registros de consentimento e permissão nunca são deletados: revogação é
-- marcada com revoked_at para preservar a trilha de auditoria.

CREATE TABLE IF NOT EXISTS client_consents (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    link_id       UUID NOT NULL REFERENCES process_accountant_links(id) ON DELETE CASCADE,
    consented_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ip_address    TEXT NOT NULL DEFAULT '',
    user_agent    TEXT NOT NULL DEFAULT '',
    text_version  TEXT NOT NULL DEFAULT 'lgpd-v1.0'
);

CREATE INDEX IF NOT EXISTS idx_client_consents_client_id ON client_consents(client_id);
CREATE INDEX IF NOT EXISTS idx_client_consents_link_id ON client_consents(link_id);

CREATE TABLE IF NOT EXISTS doc_permissions (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    link_id     UUID NOT NULL REFERENCES process_accountant_links(id) ON DELETE CASCADE,
    granted_by  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    granted_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    revoked_at  TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_doc_permissions_document_id ON doc_permissions(document_id);
CREATE INDEX IF NOT EXISTS idx_doc_permissions_link_id ON doc_permissions(link_id);
CREATE INDEX IF NOT EXISTS idx_doc_permissions_active
    ON doc_permissions(document_id, link_id) WHERE revoked_at IS NULL;

CREATE TABLE IF NOT EXISTS document_requests (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    process_id   UUID NOT NULL REFERENCES processes(id) ON DELETE CASCADE,
    requested_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    client_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    description  TEXT NOT NULL,
    status       TEXT NOT NULL DEFAULT 'pendente'
                   CHECK (status IN ('pendente','atendido','cancelado')),
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_document_requests_client_id ON document_requests(client_id);
CREATE INDEX IF NOT EXISTS idx_document_requests_process_id ON document_requests(process_id);
CREATE INDEX IF NOT EXISTS idx_document_requests_status ON document_requests(status);

-- ============================================================
-- LOG DE ACESSO INDIVIDUAL A DOCUMENTO (escopo §5)
-- ============================================================
CREATE TABLE IF NOT EXISTS document_access_logs (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ip_address  TEXT NOT NULL DEFAULT '',
    accessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_document_access_logs_doc ON document_access_logs(document_id, accessed_at DESC);
CREATE INDEX IF NOT EXISTS idx_document_access_logs_user ON document_access_logs(user_id);
