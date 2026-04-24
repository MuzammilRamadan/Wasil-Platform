-- ============================================
-- WASIL — add diseases table
-- ============================================
-- Run this script in your Supabase SQL Editor
-- to add support for dynamic diseases.

CREATE TABLE IF NOT EXISTS diseases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    default_severity TEXT DEFAULT 'moderate',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE diseases ENABLE ROW LEVEL SECURITY;

-- Anyone can read active diseases
CREATE POLICY "Anyone can read diseases"
    ON diseases FOR SELECT
    USING (true);

-- Only admins can manage diseases
CREATE POLICY "Admins can insert diseases"
    ON diseases FOR INSERT
    WITH CHECK (
        EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
    );

CREATE POLICY "Admins can update diseases"
    ON diseases FOR UPDATE
    USING (
        EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
    );

CREATE POLICY "Admins can delete diseases"
    ON diseases FOR DELETE
    USING (
        EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
    );

-- Insert default diseases
INSERT INTO diseases (name, default_severity) VALUES
('Cholera', 'critical'),
('Typhoid', 'high'),
('Dengue Fever', 'moderate'),
('Malaria', 'low')
ON CONFLICT (name) DO NOTHING;
