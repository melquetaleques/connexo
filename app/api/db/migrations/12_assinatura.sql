-- Migration: 12_assinatura
-- Description: Add subscription columns to users table for Phase 12 (Landing Page + Assinatura)

-- Adicionar colunas de assinatura na tabela users (MVP: usar campos existentes no usuário, sem nova tabela)
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'ativo' CHECK (subscription_status IN ('ativo', 'expirado', 'cancelado'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Índice para consultas de assinatura por advogado
CREATE INDEX IF NOT EXISTS idx_users_subscription_status ON users(subscription_status);
