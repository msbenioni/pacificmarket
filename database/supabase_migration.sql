-- Database Migration: Add Business Acquisition Interest Field
-- Purpose: Add business_acquisition_interest field to relevant tables
-- Date: 2026-03-15
-- Instructions: Run this in Supabase SQL Editor

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

-- Check if fields were added successfully
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
-- MIGRATION COMPLETE
-- ============================================================================

-- Summary:
-- ✅ Added business_acquisition_interest to businesses table
-- ✅ Added business_acquisition_interest to business_insights table
-- ✅ Set default value to FALSE for existing records
-- ✅ Created backup tables for safety
