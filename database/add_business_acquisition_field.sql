-- Database Migration: Add Business Acquisition Interest Field
-- Purpose: Add business_acquisition_interest field to relevant tables
-- Date: 2026-03-15
-- Connection: postgresql://postgres:MontBlanc3001@db.mnmisjprswpuvcojnbip.supabase.co:5432/postgres

-- ============================================================================
-- STEP 1: BACKUP TABLES (Safety First)
-- ============================================================================

-- Create backup tables
CREATE TABLE IF NOT EXISTS businesses_backup AS 
SELECT * FROM businesses;

CREATE TABLE IF NOT EXISTS business_insights_backup AS 
SELECT * FROM business_insights;

-- ============================================================================
-- STEP 2: ADD BUSINESS_ACQUISITION_INTEREST FIELD TO BUSINESSES TABLE
-- ============================================================================

-- Add the new field to businesses table (for BusinessProfileForm)
ALTER TABLE businesses 
ADD COLUMN IF NOT EXISTS business_acquisition_interest BOOLEAN DEFAULT FALSE;

-- ============================================================================
-- STEP 3: ADD BUSINESS_ACQUISITION_INTEREST FIELD TO BUSINESS_INSIGHTS TABLE
-- ============================================================================

-- Add the new field to business_insights table (for BusinessInsightsAccordion)
ALTER TABLE business_insights 
ADD COLUMN IF NOT EXISTS business_acquisition_interest BOOLEAN DEFAULT FALSE;

-- ============================================================================
-- STEP 4: VERIFICATION
-- ============================================================================

-- Check businesses table current structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'businesses' 
AND column_name = 'business_acquisition_interest'
ORDER BY ordinal_position;

-- Check business_insights table current structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'business_insights' 
AND column_name = 'business_acquisition_interest'
ORDER BY ordinal_position;

-- Verify data types and defaults
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name IN ('businesses', 'business_insights')
AND column_name = 'business_acquisition_interest';

-- ============================================================================
-- STEP 5: CLEANUP (OPTIONAL - Uncomment when ready)
-- ============================================================================

-- Uncomment these lines only after verifying everything works correctly
-- DROP TABLE IF EXISTS businesses_backup;
-- DROP TABLE IF EXISTS business_insights_backup;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- Summary of changes:
-- 1. Backed up businesses and business_insights tables
-- 2. Added business_acquisition_interest BOOLEAN field to businesses table
-- 3. Added business_acquisition_interest BOOLEAN field to business_insights table
-- 4. Set default value to FALSE for existing records

-- Post-migration steps:
-- 1. Test BusinessProfileForm component with new field
-- 2. Test BusinessInsightsAccordion component with new field
-- 3. Verify data persistence and retrieval
-- 4. Test user workflows end-to-end
