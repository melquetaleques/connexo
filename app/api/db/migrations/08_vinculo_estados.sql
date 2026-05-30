-- Migration: 08_vinculo_estados
-- Description: Update link status and create deliverables and process_events tables

-- 1. Atualizar estados existentes no client_accountant_links
UPDATE client_accountant_links SET status = 'pendente' WHERE status = 'escolha_pendente';
UPDATE client_accountant_links SET status = 'cancelado' WHERE status IN ('encerrado', 'expirado');

-- 2. Criar tabela de entregáveis (deliverables)
CREATE TABLE IF NOT EXISTS deliverables (
    id UUID PRIMARY KEY,
    link_id UUID REFERENCES client_accountant_links(id) ON DELETE CASCADE,
    submitted_by UUID REFERENCES users(id) ON DELETE SET NULL,
    content_text TEXT,
    file_name VARCHAR(255),
    file_size BIGINT,
    status VARCHAR(50) DEFAULT 'entregue' NOT NULL,
    review_comment TEXT,
    submitted_at TIMESTAMP,
    reviewed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Criar tabela de eventos de processo (process_events)
CREATE TABLE IF NOT EXISTS process_events (
    id UUID PRIMARY KEY,
    process_id UUID REFERENCES processes(id) NOT NULL,
    event_type VARCHAR(255) NOT NULL,
    actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    actor_role VARCHAR(100),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
