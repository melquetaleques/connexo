-- Migration: 07_law_firms_and_posts
-- Description: Create tables for law firms, members, invite tokens, and posts

CREATE TABLE IF NOT EXISTS law_firms (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    owner_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS law_firm_members (
    firm_id UUID NOT NULL REFERENCES law_firms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    role VARCHAR(50) NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (firm_id, user_id)
);

CREATE TABLE IF NOT EXISTS invite_tokens (
    token UUID PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    firm_id UUID NOT NULL REFERENCES law_firms(id) ON DELETE CASCADE,
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY,
    accountant_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    tag VARCHAR(100) NOT NULL,
    cover_url VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'publicado',
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
