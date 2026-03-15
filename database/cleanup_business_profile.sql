-- Database Migration: Remove Founder Fields from Business Profile
-- Purpose: Clean up business profile form by removing founder-specific fields
-- Date: 2026-03-15
-- Connection: postgresql://postgres:MontBlanc3001@db.mnmisjprswpuvcojnbip.supabase.co:5432/postgres

-- ============================================================================
-- STEP 1: BACKUP TABLES (Safety First)
-- ============================================================================

-- Create backup tables
CREATE TABLE IF NOT EXISTS businesses_backup AS 
SELECT * FROM businesses;

-- ============================================================================
-- STEP 2: REMOVE FOUNDER-SPECIFIC FIELDS FROM BUSINESSES TABLE
-- ============================================================================

-- Remove founder-specific fields that don't belong in business profile
ALTER TABLE businesses 
DROP COLUMN IF EXISTS growth_stage,
DROP COLUMN IF EXISTS top_challenges_array,
DROP COLUMN IF EXISTS hiring_intentions,
DROP COLUMN IF EXISTS founder_role,
DROP COLUMN IF EXISTS founder_story,
DROP COLUMN IF EXISTS founder_motivation,
DROP COLUMN IF EXISTS gender,
DROP COLUMN IF EXISTS age_range,
DROP COLUMN IF EXISTS based_in_country,
DROP COLUMN IF EXISTS based_in_city,
DROP COLUMN IF EXISTS based_in_suburb,
DROP COLUMN IF EXISTS goals_next_12_months_array,
DROP COLUMN IF EXISTS goals_details;

-- Remove business insights fields that belong in business_insights table
ALTER TABLE businesses 
DROP COLUMN IF EXISTS business_stage,
DROP COLUMN IF EXISTS revenue_band,
DROP COLUMN IF EXISTS is_business_registered,
DROP COLUMN IF EXISTS current_funding_source,
DROP COLUMN IF EXISTS funding_amount_needed,
DROP COLUMN IF EXISTS funding_purpose,
DROP COLUMN IF EXISTS investment_stage,
DROP COLUMN IF EXISTS investment_exploration,
DROP COLUMN IF EXISTS community_impact_areas_array,
DROP COLUMN IF EXISTS support_needed_next_array,
DROP COLUMN IF EXISTS current_support_sources_array,
DROP COLUMN IF EXISTS expansion_plans,
DROP COLUMN IF EXISTS import_export_status,
DROP COLUMN IF EXISTS import_countries,
DROP COLUMN IF EXISTS export_countries;

-- ============================================================================
-- STEP 3: KEEP COMMUNITY FIELDS IN BUSINESSES TABLE
-- ============================================================================

-- These fields are appropriate for business profile:
-- - collaboration_interest (business collaboration)
-- - mentorship_offering (business mentorship)
-- - open_to_future_contact (business contact preferences)

-- ============================================================================
-- STEP 4: VERIFICATION
-- ============================================================================

-- Check businesses table current structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'businesses' 
ORDER BY ordinal_position;

-- ============================================================================
-- STEP 5: CLEANUP (OPTIONAL - Uncomment when ready)
-- ============================================================================

-- Uncomment this line only after verifying everything works correctly
-- DROP TABLE IF EXISTS businesses_backup;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- Summary of changes:
-- 1. Backed up businesses table
-- 2. Removed 15+ founder-specific fields from businesses table
-- 3. Removed 10+ business insights fields from businesses table
-- 4. Kept appropriate community fields for business profile

-- Post-migration steps:
-- 1. Test BusinessProfileForm component
-- 2. Verify business profile functionality
-- 3. Test user workflows end-to-end
