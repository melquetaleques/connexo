package repository

import "fmt"

const schemaSQL = `
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'cliente',
    name TEXT NOT NULL,
    phone TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lawyers (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    oab_number TEXT NOT NULL DEFAULT '',
    oab_state TEXT NOT NULL DEFAULT '',
    office_name TEXT NOT NULL DEFAULT '',
    subscription_status TEXT NOT NULL DEFAULT 'ativo',
    subscription_expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY,
    lawyer_id UUID NOT NULL REFERENCES lawyers(id),
    user_id UUID REFERENCES users(id),
    name TEXT NOT NULL,
    document TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL DEFAULT '',
    phone TEXT NOT NULL DEFAULT '',
    type TEXT NOT NULL DEFAULT 'PF',
    status TEXT NOT NULL DEFAULT 'ativo',
    notes TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS processes (
    id UUID PRIMARY KEY,
    lawyer_id UUID NOT NULL REFERENCES lawyers(id),
    client_id UUID NOT NULL REFERENCES clients(id),
    number TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT '',
    court TEXT NOT NULL DEFAULT '',
    stage TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'ativo',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS accountants (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    crc_number TEXT NOT NULL DEFAULT '',
    crc_state TEXT NOT NULL DEFAULT '',
    bio TEXT NOT NULL DEFAULT '',
    specialties TEXT[] NOT NULL DEFAULT '{}',
    city TEXT NOT NULL DEFAULT '',
    state TEXT NOT NULL DEFAULT '',
    slug TEXT NOT NULL DEFAULT '',
    is_public BOOLEAN NOT NULL DEFAULT false,
    rating FLOAT NOT NULL DEFAULT 0,
    completed_cases INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS process_accountant_links (
    id UUID PRIMARY KEY,
    process_id UUID NOT NULL REFERENCES processes(id),
    accountant_id UUID NOT NULL REFERENCES accountants(id),
    chosen_by UUID NOT NULL REFERENCES users(id),
    status TEXT NOT NULL DEFAULT 'escolha_pendente',
    chosen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    accepted_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    end_reason TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY,
    process_id UUID NOT NULL REFERENCES processes(id),
    uploaded_by UUID NOT NULL REFERENCES users(id),
    name TEXT NOT NULL,
    size_bytes BIGINT NOT NULL DEFAULT 0,
    mime_type TEXT NOT NULL DEFAULT 'application/octet-stream',
    storage_path TEXT NOT NULL DEFAULT '',
    visible_to_accountant BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS accountant_services (
    id UUID PRIMARY KEY,
    accountant_id UUID NOT NULL REFERENCES accountants(id),
    title TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    icon TEXT NOT NULL DEFAULT '',
    areas TEXT[] NOT NULL DEFAULT '{}',
    price_from FLOAT NOT NULL DEFAULT 0,
    avg_days INT NOT NULL DEFAULT 7,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    kind TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL DEFAULT '',
    read BOOLEAN NOT NULL DEFAULT false,
    payload JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id UUID,
    metadata JSONB,
    ip_address TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_lawyers_user_id ON lawyers(user_id);
CREATE INDEX IF NOT EXISTS idx_clients_lawyer_id ON clients(lawyer_id);
CREATE INDEX IF NOT EXISTS idx_processes_lawyer_id ON processes(lawyer_id);
CREATE INDEX IF NOT EXISTS idx_processes_client_id ON processes(client_id);
CREATE INDEX IF NOT EXISTS idx_accountants_user_id ON accountants(user_id);
CREATE INDEX IF NOT EXISTS idx_accountants_slug ON accountants(slug);
CREATE INDEX IF NOT EXISTS idx_links_process_id ON process_accountant_links(process_id);
CREATE INDEX IF NOT EXISTS idx_links_accountant_id ON process_accountant_links(accountant_id);
CREATE INDEX IF NOT EXISTS idx_documents_process_id ON documents(process_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
`

// AutoMigrate executa a criacao das tabelas se ainda nao existirem.
func (db *DB) AutoMigrate() error {
	_, err := db.Exec(schemaSQL)
	if err != nil {
		return fmt.Errorf("erro ao executar migracao: %w", err)
	}
	return nil
}
