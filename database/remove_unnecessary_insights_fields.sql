-- Remove specified fields from business_insights table
-- Migration script to drop fields that are no longer needed

-- Drop specified columns from business_insights table  
ALTER TABLE business_insights
DROP COLUMN IF EXISTS expansion_plans,
DROP COLUMN IF EXISTS support_needed_next_array,
DROP COLUMN IF EXISTS current_support_sources_array,
DROP COLUMN IF EXISTS hiring_intentions,
DROP COLUMN IF EXISTS current_funding_source,
DROP COLUMN IF EXISTS funding_amount_needed,
DROP COLUMN IF EXISTS funding_purpose,
DROP COLUMN IF EXISTS investment_stage,
DROP COLUMN IF EXISTS investment_exploration,
DROP COLUMN IF EXISTS community_impact_areas_array,
DROP COLUMN IF EXISTS industry; -- duplicate field, industry remains in businesses table

-- Note: These fields have been removed from the codebase and are no longer needed
