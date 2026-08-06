-- 001_core_schema
-- Núcleo do Connexo: identidades, perfis, clientes, processos e documentos.
--
-- Convenção: atores (advogado, cliente, contador) são sempre referenciados por
-- users(id). As tabelas lawyers/clients/accountants guardam dados de perfil
-- adicionais e nunca substituem users(id) como chave de ator.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- USERS — identidade de todas as personas
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email                   TEXT NOT NULL UNIQUE,
    password_hash           TEXT NOT NULL,
    role                    TEXT NOT NULL DEFAULT 'cliente'
                              CHECK (role IN ('advogado','cliente','contador','admin')),
    name                    TEXT NOT NULL,
    phone                   TEXT NOT NULL DEFAULT '',

    -- Perfil público do contador (denormalizado em users por decisão de MVP).
    bio                     TEXT NOT NULL DEFAULT '',
    specialty               TEXT NOT NULL DEFAULT '',
    city                    TEXT NOT NULL DEFAULT '',
    state                   TEXT NOT NULL DEFAULT '',
    logo_url                TEXT NOT NULL DEFAULT '',
    photo_urls              TEXT[] NOT NULL DEFAULT '{}',
    availability            TEXT NOT NULL DEFAULT 'disponivel'
                              CHECK (availability IN ('disponivel','ocupado','indisponivel')),
    rating                  NUMERIC(3,2) NOT NULL DEFAULT 0.00,

    -- Assinatura do advogado.
    subscription_status     TEXT NOT NULL DEFAULT 'ativo'
                              CHECK (subscription_status IN ('ativo','expirado','cancelado')),
    subscription_expires_at TIMESTAMPTZ,

    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_catalog ON users(role, availability, state, city);
CREATE INDEX IF NOT EXISTS idx_users_subscription_status ON users(subscription_status);

-- ============================================================
-- PERFIL DE ADVOGADO
-- ============================================================
CREATE TABLE IF NOT EXISTS lawyers (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    oab_number              TEXT NOT NULL DEFAULT '',
    oab_state               TEXT NOT NULL DEFAULT '',
    office_name             TEXT NOT NULL DEFAULT '',
    subscription_status     TEXT NOT NULL DEFAULT 'trial'
                              CHECK (subscription_status IN ('trial','ativo','active','suspended','cancelled','expirado','cancelado')),
    subscription_expires_at TIMESTAMPTZ,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lawyers_user_id ON lawyers(user_id);

-- ============================================================
-- PERFIL DE CONTADOR
-- ============================================================
CREATE TABLE IF NOT EXISTS accountants (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    crc_number      TEXT NOT NULL DEFAULT '',
    crc_state       TEXT NOT NULL DEFAULT '',
    bio             TEXT NOT NULL DEFAULT '',
    specialties     TEXT[] NOT NULL DEFAULT '{}',
    city            TEXT NOT NULL DEFAULT '',
    state           TEXT NOT NULL DEFAULT '',
    slug            TEXT UNIQUE,
    is_public       BOOLEAN NOT NULL DEFAULT true,
    rating          NUMERIC(3,2) NOT NULL DEFAULT 0,
    completed_cases INTEGER NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_accountants_user_id ON accountants(user_id);
CREATE INDEX IF NOT EXISTS idx_accountants_public ON accountants(is_public, state, city);

-- ============================================================
-- CLIENTES DO ADVOGADO
-- ============================================================
CREATE TABLE IF NOT EXISTS clients (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lawyer_id  UUID NOT NULL REFERENCES lawyers(id) ON DELETE CASCADE,
    user_id    UUID REFERENCES users(id),  -- NULL quando o cliente não tem acesso ao painel
    name       TEXT NOT NULL,
    document   TEXT NOT NULL DEFAULT '',
    email      TEXT NOT NULL DEFAULT '',
    phone      TEXT NOT NULL DEFAULT '',
    type       TEXT NOT NULL DEFAULT 'PF' CHECK (type IN ('PF','PJ')),
    status     TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo','atencao','encerrado')),
    notes      TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_clients_lawyer_id ON clients(lawyer_id);
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);

-- ============================================================
-- PROCESSOS
-- ============================================================
CREATE TABLE IF NOT EXISTS processes (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lawyer_id  UUID NOT NULL REFERENCES lawyers(id) ON DELETE CASCADE,
    client_id  UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    number     TEXT NOT NULL,
    type       TEXT NOT NULL DEFAULT '',
    court      TEXT NOT NULL DEFAULT '',
    stage      TEXT NOT NULL DEFAULT '',
    status     TEXT NOT NULL DEFAULT 'em_andamento'
                 CHECK (status IN ('em_andamento','em_pericia','aguardando','concluido','arquivado')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (lawyer_id, number)
);

CREATE INDEX IF NOT EXISTS idx_processes_lawyer_id ON processes(lawyer_id);
CREATE INDEX IF NOT EXISTS idx_processes_client_id ON processes(client_id);

-- ============================================================
-- SERVIÇOS DO CONTADOR (catálogo)
-- ============================================================
CREATE TABLE IF NOT EXISTS accountant_services (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    accountant_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title         TEXT NOT NULL,
    description   TEXT NOT NULL DEFAULT '',
    icon          TEXT NOT NULL DEFAULT '',
    areas         TEXT[] NOT NULL DEFAULT '{}',
    price_from    NUMERIC(12,2) NOT NULL DEFAULT 0,
    avg_days      INTEGER NOT NULL DEFAULT 7,
    is_visible    BOOLEAN NOT NULL DEFAULT true,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_accountant_services_accountant ON accountant_services(accountant_id);

-- ============================================================
-- DOCUMENTOS DOS PROCESSOS
-- ============================================================
CREATE TABLE IF NOT EXISTS documents (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    process_id            UUID NOT NULL REFERENCES processes(id) ON DELETE CASCADE,
    uploaded_by           UUID NOT NULL REFERENCES users(id),
    name                  TEXT NOT NULL,
    size_bytes            BIGINT NOT NULL DEFAULT 0,
    mime_type             TEXT NOT NULL DEFAULT 'application/octet-stream',
    bucket                TEXT NOT NULL DEFAULT '',
    object_key            TEXT NOT NULL DEFAULT '',
    storage_path          TEXT NOT NULL DEFAULT '',
    visible_to_accountant BOOLEAN NOT NULL DEFAULT false,
    created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_documents_process_id ON documents(process_id);

-- ============================================================
-- NOTIFICAÇÕES
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title      TEXT NOT NULL DEFAULT '',
    message    TEXT NOT NULL DEFAULT '',
    read       BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, read);

-- ============================================================
-- LOG DE AUDITORIA
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID REFERENCES users(id),
    action        TEXT NOT NULL,
    resource_type TEXT NOT NULL DEFAULT '',
    resource_id   UUID,
    metadata      JSONB,
    ip_address    TEXT NOT NULL DEFAULT '',
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
