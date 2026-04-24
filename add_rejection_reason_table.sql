-- ============================================
-- SQL Migration: Add rejection reason to clinic_requests
-- ============================================

ALTER TABLE clinic_requests ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
