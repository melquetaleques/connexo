-- Migration: 001_initial_schema
-- Esquema inicial do Connexo

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- USERS (todas as personas)
-- ============================================================
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL CHECK (role IN ('advogado','cliente','contador','admin')),
  name          TEXT NOT NULL,
  phone         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- PERFIS DE ADVOGADO
-- ============================================================
CREATE TABLE lawyers (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  oab_number             TEXT,
  oab_state              TEXT,
  office_name            TEXT,
  subscription_status    TEXT NOT NULL DEFAULT 'trial'
                           CHECK (subscription_status IN ('trial','active','suspended','cancelled')),
  subscription_expires_at TIMESTAMPTZ,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- CLIENTES DOS ADVOGADOS
-- ============================================================
CREATE TABLE clients (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lawyer_id  UUID NOT NULL REFERENCES lawyers(id) ON DELETE CASCADE,
  user_id    UUID REFERENCES users(id),            -- NULL se não tiver acesso ao painel
  name       TEXT NOT NULL,
  document   TEXT,                                 -- CPF ou CNPJ
  email      TEXT,
  phone      TEXT,
  type       TEXT CHECK (type IN ('PF','PJ')),
  status     TEXT NOT NULL DEFAULT 'ativo'
               CHECK (status IN ('ativo','atencao','encerrado')),
  notes      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- PROCESSOS
-- ============================================================
CREATE TABLE processes (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lawyer_id  UUID NOT NULL REFERENCES lawyers(id) ON DELETE CASCADE,
  client_id  UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  number     TEXT NOT NULL,                        -- número CNJ
  type       TEXT,                                 -- Reclamação Trabalhista, Ação Cível…
  court      TEXT,
  stage      TEXT,
  status     TEXT NOT NULL DEFAULT 'em_andamento'
               CHECK (status IN ('em_andamento','em_pericia','aguardando','concluido','arquivado')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (lawyer_id, number)
);

-- ============================================================
-- PERFIS DE CONTADORES
-- ============================================================
CREATE TABLE accountants (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  crc_number      TEXT,
  crc_state       TEXT,
  bio             TEXT,
  specialties     TEXT[]  DEFAULT '{}',
  city            TEXT,
  state           TEXT,
  slug            TEXT UNIQUE,                     -- para URL pública /contadores/:slug
  is_public       BOOLEAN NOT NULL DEFAULT true,
  rating          NUMERIC(2,1) DEFAULT 0,
  completed_cases INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- VÍNCULOS PROCESSO ↔ CONTADOR
-- ============================================================
CREATE TABLE process_accountant_links (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  process_id       UUID NOT NULL REFERENCES processes(id) ON DELETE CASCADE,
  accountant_id    UUID NOT NULL REFERENCES accountants(id),
  chosen_by        UUID NOT NULL REFERENCES clients(id),        -- cliente que escolheu
  status           TEXT NOT NULL DEFAULT 'escolha_pendente'
                     CHECK (status IN (
                       'escolha_pendente',
                       'aceito',
                       'recusado',
                       'ativo',
                       'encerrado',
                       'expirado'
                     )),
  chosen_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  accepted_at      TIMESTAMPTZ,
  ended_at         TIMESTAMPTZ,
  end_reason       TEXT,
  UNIQUE (process_id, accountant_id)
);

-- ============================================================
-- SERVIÇOS DO CONTADOR (catálogo)
-- ============================================================
CREATE TABLE accountant_services (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  accountant_id UUID NOT NULL REFERENCES accountants(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  description   TEXT,
  icon          TEXT,
  areas         TEXT[] DEFAULT '{}',
  price_from    NUMERIC(12,2),
  avg_days      INTEGER,
  is_visible    BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- DOCUMENTOS DOS PROCESSOS
-- ============================================================
CREATE TABLE documents (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  process_id             UUID NOT NULL REFERENCES processes(id) ON DELETE CASCADE,
  uploaded_by            UUID NOT NULL REFERENCES users(id),
  name                   TEXT NOT NULL,
  size_bytes             BIGINT,
  mime_type              TEXT,
  storage_path           TEXT NOT NULL,
  visible_to_accountant  BOOLEAN NOT NULL DEFAULT false,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- CONSENTIMENTOS LGPD
-- ============================================================
CREATE TABLE consents (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id    UUID NOT NULL REFERENCES clients(id),
  link_id      UUID NOT NULL REFERENCES process_accountant_links(id),
  accepted     BOOLEAN NOT NULL,
  ip_address   TEXT,
  user_agent   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- NOTIFICAÇÕES
-- ============================================================
CREATE TABLE notifications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kind       TEXT NOT NULL,
  title      TEXT,
  body       TEXT NOT NULL,
  read       BOOLEAN NOT NULL DEFAULT false,
  payload    JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- LOG DE AUDITORIA
-- ============================================================
CREATE TABLE audit_logs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES users(id),
  action        TEXT NOT NULL,
  resource_type TEXT,
  resource_id   UUID,
  metadata      JSONB,
  ip_address    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ÍNDICES
-- ============================================================
CREATE INDEX idx_clients_lawyer         ON clients(lawyer_id);
CREATE INDEX idx_processes_lawyer       ON processes(lawyer_id);
CREATE INDEX idx_processes_client       ON processes(client_id);
CREATE INDEX idx_pal_process            ON process_accountant_links(process_id);
CREATE INDEX idx_pal_accountant         ON process_accountant_links(accountant_id);
CREATE INDEX idx_pal_status             ON process_accountant_links(status);
CREATE INDEX idx_documents_process      ON documents(process_id);
CREATE INDEX idx_notifications_user     ON notifications(user_id, read);
CREATE INDEX idx_audit_user             ON audit_logs(user_id);
CREATE INDEX idx_audit_resource         ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_accountants_public     ON accountants(is_public, state, city);
