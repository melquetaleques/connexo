-- Migration: 11_lgpd_documentacao
-- Description: Create tables for LGPD consent, document permissions, and document requests

-- 1. Tabela de consentimento LGPD (nunca deletar registros - requisito LGPD de rastreabilidade)
CREATE TABLE IF NOT EXISTS client_consents (
    id UUID PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    link_id UUID NOT NULL REFERENCES client_accountant_links(id) ON DELETE CASCADE,
    consented_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    ip_address TEXT NOT NULL DEFAULT '',
    user_agent TEXT NOT NULL DEFAULT '',
    text_version TEXT NOT NULL DEFAULT 'lgpd-v1.0'
);

CREATE INDEX IF NOT EXISTS idx_client_consents_client_id ON client_consents(client_id);
CREATE INDEX IF NOT EXISTS idx_client_consents_link_id ON client_consents(link_id);

-- 2. Tabela de permissões por documento (revoked_at nullable para auditabilidade)
CREATE TABLE IF NOT EXISTS doc_permissions (
    id UUID PRIMARY KEY,
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    link_id UUID NOT NULL REFERENCES client_accountant_links(id) ON DELETE CASCADE,
    granted_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    granted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    revoked_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

CREATE INDEX IF NOT EXISTS idx_doc_permissions_document_id ON doc_permissions(document_id);
CREATE INDEX IF NOT EXISTS idx_doc_permissions_link_id ON doc_permissions(link_id);
CREATE INDEX IF NOT EXISTS idx_doc_permissions_active ON doc_permissions(document_id, link_id) WHERE revoked_at IS NULL;

-- 3. Tabela de solicitações de documento (advogado → cliente)
CREATE TABLE IF NOT EXISTS document_requests (
    id UUID PRIMARY KEY,
    process_id UUID NOT NULL REFERENCES processes(id) ON DELETE CASCADE,
    requested_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'atendido', 'cancelado')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_document_requests_client_id ON document_requests(client_id);
CREATE INDEX IF NOT EXISTS idx_document_requests_process_id ON document_requests(process_id);
CREATE INDEX IF NOT EXISTS idx_document_requests_status ON document_requests(status);
