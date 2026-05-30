-- Migration: 11_accountant_reviews
-- Description: Create accountant_reviews table and add rating column to users

-- 1. Criar tabela de avaliações
CREATE TABLE IF NOT EXISTS accountant_reviews (
    id UUID PRIMARY KEY,
    accountant_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    link_id UUID NOT NULL REFERENCES client_accountant_links(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    reply_text TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    replied_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT uq_accountant_reviews_link UNIQUE (link_id)
);

CREATE INDEX IF NOT EXISTS idx_accountant_reviews_accountant_id ON accountant_reviews(accountant_id);
CREATE INDEX IF NOT EXISTS idx_accountant_reviews_client_id ON accountant_reviews(client_id);

-- 2. Adicionar coluna de rating médio na tabela users
ALTER TABLE users ADD COLUMN IF NOT EXISTS rating NUMERIC(3,2) DEFAULT 0.00;
