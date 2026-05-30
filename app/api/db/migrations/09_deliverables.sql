-- Migration: Create deliverables table for Phase 8 Task 3
CREATE TABLE IF NOT EXISTS deliverables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    link_id UUID NOT NULL REFERENCES client_accountant_links(id) ON DELETE CASCADE,
    submitted_by UUID NOT NULL REFERENCES users(id),
    content_text TEXT,
    file_name VARCHAR(512),
    file_size BIGINT DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'entregue',
    review_comment TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_deliverables_link_id ON deliverables(link_id);
CREATE INDEX IF NOT EXISTS idx_deliverables_status ON deliverables(status);
