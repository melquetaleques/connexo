-- ============================================================
-- MÚLTIPLAS CIDADES DE ATUAÇÃO DO CONTADOR
-- ============================================================
-- `city` era uma cidade única; um contador pode atender vários
-- municípios dentro do seu estado de registro (crc_state/state).
ALTER TABLE accountants ADD COLUMN IF NOT EXISTS cities TEXT[] NOT NULL DEFAULT '{}';

-- Migra o valor único existente para o array, se houver.
UPDATE accountants SET cities = ARRAY[city] WHERE city <> '' AND cities = '{}';
