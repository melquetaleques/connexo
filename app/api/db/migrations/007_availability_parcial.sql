-- 007_availability_parcial
-- O painel do contador usa "parcial" para disponibilidade limitada.
-- A constraint original só aceitava disponivel/ocupado/indisponivel.
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_availability_check;
ALTER TABLE users ADD CONSTRAINT users_availability_check
  CHECK (availability IN ('disponivel', 'parcial', 'indisponivel', 'ocupado'));
