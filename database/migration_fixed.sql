-- Corrected Database Migration Script
-- Purpose: Align database schema with simplified form structure
-- Date: 2026-03-15
-- Connection: postgresql://postgres:MontBlanc3001@db.mnmisjprswpuvcojnbip.supabase.co:5432/postgres

-- ============================================================================
-- STEP 1: BACKUP TABLES (Safety First)
-- ============================================================================

-- Create backup tables
CREATE TABLE IF NOT EXISTS founder_insights_backup AS 
SELECT * FROM founder_insights;

CREATE TABLE IF NOT EXISTS business_insights_backup AS 
SELECT * FROM business_insights;

-- ============================================================================
-- STEP 2: ADD NEW COLUMNS TO BUSINESS_INSIGHTS
-- ============================================================================

-- Add columns that are moving from founder_insights to business_insights
ALTER TABLE business_insights 
ADD COLUMN IF NOT EXISTS business_stage TEXT,
ADD COLUMN IF NOT EXISTS goals_next_12_months_array JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS goals_details TEXT;

-- ============================================================================
-- STEP 3: MIGRATE DATA FROM FOUNDER_INSIGHTS TO BUSINESS_INSIGHTS
-- ============================================================================

-- Note: Since founder_insights doesn't have business_id, we need to match by user_id
-- This assumes there's a 1:1 relationship between users and their businesses

-- Migrate business stage data
UPDATE business_insights 
SET business_stage = fi.business_stage
FROM founder_insights fi
WHERE business_insights.user_id = fi.user_id 
AND fi.business_stage IS NOT NULL;

-- Migrate goals array data
UPDATE business_insights 
SET goals_next_12_months_array = fi.goals_next_12_months_array
FROM founder_insights fi
WHERE business_insights.user_id = fi.user_id 
AND fi.goals_next_12_months_array IS NOT NULL;

-- Migrate goals details data
UPDATE business_insights 
SET goals_details = fi.goals_details
FROM founder_insights fi
WHERE business_insights.user_id = fi.user_id 
AND fi.goals_details IS NOT NULL;

-- ============================================================================
-- STEP 4: REMOVE COLUMNS FROM FOUNDER_INSIGHTS
-- ============================================================================

-- Remove financial section columns (if they exist)
ALTER TABLE founder_insights 
DROP COLUMN IF EXISTS current_funding_source,
DROP COLUMN IF EXISTS investment_stage,
DROP COLUMN IF EXISTS revenue_streams,
DROP COLUMN IF EXISTS financial_challenges,
DROP COLUMN IF EXISTS funding_amount_needed,
DROP COLUMN IF EXISTS funding_purpose,
DROP COLUMN IF EXISTS angel_investor_interest,
DROP COLUMN IF EXISTS investor_capacity;

-- Remove support section columns (if they exist)
ALTER TABLE founder_insights 
DROP COLUMN IF EXISTS support_needed_next_array,
DROP COLUMN IF EXISTS current_support_sources_array;

-- Remove growth section columns (moved to business_insights)
ALTER TABLE founder_insights 
DROP COLUMN IF EXISTS business_stage,
DROP COLUMN IF EXISTS goals_next_12_months_array,
DROP COLUMN IF EXISTS goals_details,
DROP COLUMN IF EXISTS hiring_intentions,
DROP COLUMN IF EXISTS expansion_plans;

-- Remove community section columns (if they exist)
ALTER TABLE founder_insights 
DROP COLUMN IF EXISTS community_impact_areas_array;

-- Remove business reality columns that belong in business insights
ALTER TABLE founder_insights 
DROP COLUMN IF EXISTS sales_channels;

-- ============================================================================
-- STEP 5: REMOVE COLUMNS FROM BUSINESS_INSIGHTS
-- ============================================================================

-- Remove financial section columns (if they exist)
ALTER TABLE business_insights
DROP COLUMN IF EXISTS current_funding_source,
DROP COLUMN IF EXISTS funding_amount_needed,
DROP COLUMN IF EXISTS investment_stage,
DROP COLUMN IF EXISTS financial_challenges;

-- Remove support section columns (if they exist)
ALTER TABLE business_insights
DROP COLUMN IF EXISTS support_needed_next_array;

-- Remove community section columns (if they exist)
ALTER TABLE business_insights
DROP COLUMN IF EXISTS community_impact_areas_array;

-- Remove growth section columns (if they exist)
ALTER TABLE business_insights
DROP COLUMN IF EXISTS growth_stage;

-- ============================================================================
-- STEP 6: UPDATE TABLE CONSTRAINTS AND INDEXES
-- ============================================================================

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_business_insights_business_stage ON business_insights(business_stage);
CREATE INDEX IF NOT EXISTS idx_business_insights_goals_array ON business_insights USING GIN(goals_next_12_months_array);

-- ============================================================================
-- STEP 7: VERIFICATION QUERIES
-- ============================================================================

-- Check founder_insights current structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'founder_insights' 
ORDER BY ordinal_position;

-- Check business_insights current structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'business_insights' 
ORDER BY ordinal_position;

-- Verify data migration
SELECT 
    COUNT(*) as total_businesses,
    COUNT(business_stage) as businesses_with_stage,
    COUNT(goals_next_12_months_array) as businesses_with_goals,
    COUNT(goals_details) as businesses_with_goals_details
FROM business_insights;

-- ============================================================================
-- STEP 8: CLEANUP (OPTIONAL - Uncomment when ready)
-- ============================================================================

-- Uncomment these lines only after verifying everything works correctly
-- DROP TABLE IF EXISTS founder_insights_backup;
-- DROP TABLE IF EXISTS business_insights_backup;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
