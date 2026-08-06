-- 002_law_firms_posts
-- Escritórios (equipe do advogado), convites e postagens do contador.

CREATE TABLE IF NOT EXISTS law_firms (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name       TEXT NOT NULL,
    owner_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_law_firms_owner ON law_firms(owner_id);

CREATE TABLE IF NOT EXISTS law_firm_members (
    firm_id   UUID NOT NULL REFERENCES law_firms(id) ON DELETE CASCADE,
    user_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role      TEXT NOT NULL DEFAULT 'member',
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (firm_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_law_firm_members_user ON law_firm_members(user_id);

CREATE TABLE IF NOT EXISTS invite_tokens (
    token      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email      TEXT NOT NULL,
    firm_id    UUID NOT NULL REFERENCES law_firms(id) ON DELETE CASCADE,
    expires_at TIMESTAMPTZ NOT NULL,
    used_at    TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_invite_tokens_firm ON invite_tokens(firm_id);

CREATE TABLE IF NOT EXISTS posts (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    accountant_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title         TEXT NOT NULL,
    excerpt       TEXT NOT NULL DEFAULT '',
    content       TEXT NOT NULL DEFAULT '',
    tag           TEXT NOT NULL DEFAULT '',
    cover_url     TEXT NOT NULL DEFAULT '',
    status        TEXT NOT NULL DEFAULT 'publicado'
                    CHECK (status IN ('rascunho','publicado','arquivado')),
    published_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_posts_accountant ON posts(accountant_id, created_at DESC);
