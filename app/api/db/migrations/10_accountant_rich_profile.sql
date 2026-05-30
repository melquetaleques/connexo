-- Migration: 10_accountant_rich_profile
-- Description: Add availability, logo_url, and photo_urls columns to users table for accountant rich profile

-- 1. Add availability column with default 'disponivel'
ALTER TABLE users ADD COLUMN IF NOT EXISTS availability TEXT DEFAULT 'disponivel';

-- 2. Add logo_url column for MinIO path reference
ALTER TABLE users ADD COLUMN IF NOT EXISTS logo_url TEXT DEFAULT '';

-- 3. Add photo_urls column as TEXT array for up to 5 photos
ALTER TABLE users ADD COLUMN IF NOT EXISTS photo_urls TEXT[] DEFAULT '{}';
