-- Business Insights Database Migration (Simplified)
-- Fixes missing columns for BusinessInsightsAccordion form fields

-- ====================================================================
-- STEP 1: Add missing columns to business_insights table
-- ====================================================================

-- Business-specific fields that were missing from the schema
ALTER TABLE business_insights 
ADD COLUMN IF NOT EXISTS business_description TEXT,
ADD COLUMN IF NOT EXISTS growth_stage TEXT,
ADD COLUMN IF NOT EXISTS goals_next_12_months_array TEXT[],
ADD COLUMN IF NOT EXISTS collaboration_interest BOOLEAN,
ADD COLUMN IF NOT EXISTS mentorship_offering BOOLEAN,
ADD COLUMN IF NOT EXISTS open_to_future_contact BOOLEAN;

-- Additional business model fields (referenced in form state)
ALTER TABLE business_insights 
ADD COLUMN IF NOT EXISTS business_model TEXT,
ADD COLUMN IF NOT EXISTS family_involvement BOOLEAN,
ADD COLUMN IF NOT EXISTS customer_region TEXT,
ADD COLUMN IF NOT EXISTS sales_channels JSONB;

-- ====================================================================
-- STEP 2: Verify the columns were added
-- ====================================================================

-- Check that new columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'business_insights' 
AND column_name IN (
    'business_description', 'growth_stage', 'goals_next_12_months_array',
    'collaboration_interest', 'mentorship_offering', 'open_to_future_contact',
    'business_model', 'family_involvement', 'customer_region', 'sales_channels'
)
ORDER BY column_name;

-- ====================================================================
-- STEP 3: Add performance indexes (optional but recommended)
-- ====================================================================

CREATE INDEX IF NOT EXISTS idx_business_insights_growth_stage ON business_insights(growth_stage);
CREATE INDEX IF NOT EXISTS idx_business_insights_collaboration ON business_insights(collaboration_interest);

-- ====================================================================
-- MIGRATION COMPLETE
-- ====================================================================

-- All BusinessInsightsAccordion form fields should now have proper database mapping
-- The form should be able to INSERT, SELECT, UPDATE, and DELETE all fields correctly
