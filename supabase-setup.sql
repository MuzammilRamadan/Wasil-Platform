-- ============================================
-- WASIL — Complete Supabase Tables & RLS Setup
-- ============================================
-- Run this entire script in your Supabase SQL Editor:
--   1. Go to https://supabase.com/dashboard
--   2. Select your project (vuzcmbfzgxbtpvceyigf)
--   3. Click "SQL Editor" in the left sidebar
--   4. Paste this entire script and click "Run"
-- ============================================

-- ═══════════════════════════════════════════
-- 1. ADMIN PROFILES
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS admin_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL DEFAULT 'Admin',
    email TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

-- Admin can read their own profile
CREATE POLICY "Admins can read own profile"
    ON admin_profiles FOR SELECT
    USING (auth.uid() = id);

-- Allow authenticated users to check if they are admin (for login verification)
CREATE POLICY "Authenticated users can check admin status"
    ON admin_profiles FOR SELECT
    USING (auth.role() = 'authenticated');

-- ═══════════════════════════════════════════
-- 2. ORGANIZATION PROFILES
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS organization_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    org_name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE organization_profiles ENABLE ROW LEVEL SECURITY;

-- Orgs can read/insert their own profile
CREATE POLICY "Users can insert own org profile"
    ON organization_profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can read own org profile"
    ON organization_profiles FOR SELECT
    USING (auth.uid() = id);

-- Admin can read ALL org profiles (for System Users page)
CREATE POLICY "Admins can read all org profiles"
    ON organization_profiles FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
    );

-- ═══════════════════════════════════════════
-- 3. COMMUNITY PROFILES
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS community_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    location TEXT,
    reported_disease TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE community_profiles ENABLE ROW LEVEL SECURITY;

-- Community users can insert/read their own profile
CREATE POLICY "Users can insert own community profile"
    ON community_profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can read own community profile"
    ON community_profiles FOR SELECT
    USING (auth.uid() = id);

-- Admin can read ALL community profiles
CREATE POLICY "Admins can read all community profiles"
    ON community_profiles FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
    );

-- Allow phone-based login lookup (any authenticated user can search by phone)
CREATE POLICY "Authenticated can lookup by phone"
    ON community_profiles FOR SELECT
    USING (auth.role() = 'authenticated');

-- ═══════════════════════════════════════════
-- 4. CLINIC REQUESTS
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS clinic_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_name TEXT,
    clinic_name TEXT,
    target_area TEXT,
    capacity INTEGER,
    diseases TEXT[],          -- array of disease names
    schedule TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT now(),
    org_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

ALTER TABLE clinic_requests ENABLE ROW LEVEL SECURITY;

-- Authenticated users can create clinic requests
CREATE POLICY "Authenticated users can insert clinic requests"
    ON clinic_requests FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Anyone authenticated can read clinic requests
CREATE POLICY "Authenticated users can read clinic requests"
    ON clinic_requests FOR SELECT
    USING (auth.role() = 'authenticated');

-- Admin can update clinic requests (approve/reject)
CREATE POLICY "Admins can update clinic requests"
    ON clinic_requests FOR UPDATE
    USING (
        EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
    );

-- ═══════════════════════════════════════════
-- 5. CLINICS (active deployed clinics for community view)
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS clinics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    location TEXT,
    capacity TEXT,
    vaccines TEXT[],          -- array of vaccine/service names
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can read clinics
CREATE POLICY "Authenticated users can read clinics"
    ON clinics FOR SELECT
    USING (auth.role() = 'authenticated');

-- Admin can manage clinics
CREATE POLICY "Admins can manage clinics"
    ON clinics FOR ALL
    USING (
        EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
    );

-- ═══════════════════════════════════════════
-- 6. CASES (epidemic case reports)
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location TEXT,
    disease TEXT,
    severity TEXT CHECK (severity IN ('critical', 'high', 'moderate', 'low')),
    description TEXT,
    reporter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE cases ENABLE ROW LEVEL SECURITY;

-- Authenticated users can create cases
CREATE POLICY "Authenticated users can insert cases"
    ON cases FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Authenticated users can read cases
CREATE POLICY "Authenticated users can read cases"
    ON cases FOR SELECT
    USING (auth.role() = 'authenticated');

-- ═══════════════════════════════════════════
-- 7. SERVICE REQUESTS
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS service_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_type TEXT,
    location TEXT,
    requester_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;

-- Authenticated users can create service requests
CREATE POLICY "Authenticated users can insert service requests"
    ON service_requests FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Authenticated users can read service requests
CREATE POLICY "Authenticated users can read service requests"
    ON service_requests FOR SELECT
    USING (auth.role() = 'authenticated');

-- ═══════════════════════════════════════════
-- 8. ASSIGNMENTS (org clinic assignments)
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    target_areas TEXT[],      -- array of area names
    supplies TEXT,
    deployment_date DATE,
    org_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;

-- Authenticated users can create assignments
CREATE POLICY "Authenticated users can insert assignments"
    ON assignments FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Authenticated users can read assignments
CREATE POLICY "Authenticated users can read assignments"
    ON assignments FOR SELECT
    USING (auth.role() = 'authenticated');

-- ═══════════════════════════════════════════
-- 9. (OPTIONAL) PROFILES — generic fallback table
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    phone TEXT,
    email TEXT,
    location TEXT,
    role TEXT DEFAULT 'community',
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
    ON profiles FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
    );

-- ═══════════════════════════════════════════
-- 10. ENABLE REALTIME for service_requests
-- ═══════════════════════════════════════════
ALTER PUBLICATION supabase_realtime ADD TABLE service_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE cases;

-- Add notes column to service_requests (stores contact info, vaccine type, case type)
-- Run this if the table already exists:
-- ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS notes TEXT;

-- ═══════════════════════════════════════════
-- 11. ADMIN DELETE POLICIES (user removal)
-- ═══════════════════════════════════════════
-- Allow admins to delete organization profiles
CREATE POLICY "Admins can delete org profiles"
    ON organization_profiles FOR DELETE
    USING (
        EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
    );

-- Allow admins to delete community profiles
CREATE POLICY "Admins can delete community profiles"
    ON community_profiles FOR DELETE
    USING (
        EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
    );

-- Allow admins to delete from generic profiles
CREATE POLICY "Admins can delete profiles"
    ON profiles FOR DELETE
    USING (
        EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
    );

-- ═══════════════════════════════════════════
-- DONE! All tables and RLS policies are set up.
-- ═══════════════════════════════════════════
-- NEXT STEP: Create your admin user.
-- 1. Sign up with an email/password through your app (or Supabase Auth dashboard)
-- 2. Then run this SQL (replace the values):
--
--   INSERT INTO admin_profiles (id, full_name, email)
--   VALUES (
--     'YOUR-USER-UUID-HERE',   -- get this from Supabase Auth > Users
--     'Admin Name',
--     'admin@example.com'
--   );
-- ═══════════════════════════════════════════
