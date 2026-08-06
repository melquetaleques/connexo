-- 004_reviews
-- Avaliações do contador pelo cliente, após conclusão do vínculo.

CREATE TABLE IF NOT EXISTS accountant_reviews (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    accountant_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    client_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    link_id       UUID NOT NULL REFERENCES process_accountant_links(id) ON DELETE CASCADE,
    rating        INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment       TEXT NOT NULL DEFAULT '',
    reply_text    TEXT,
    submitted_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    replied_at    TIMESTAMPTZ,
    CONSTRAINT uq_accountant_reviews_link UNIQUE (link_id)
);

CREATE INDEX IF NOT EXISTS idx_accountant_reviews_accountant_id ON accountant_reviews(accountant_id);
CREATE INDEX IF NOT EXISTS idx_accountant_reviews_client_id ON accountant_reviews(client_id);
