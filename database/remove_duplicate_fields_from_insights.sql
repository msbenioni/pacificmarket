-- Remove duplicate fields from business_insights table
-- Migration script to drop duplicate columns that are already in businesses table

-- Drop duplicate columns from business_insights table  
ALTER TABLE business_insights
DROP COLUMN IF EXISTS team_size_band,
DROP COLUMN IF EXISTS revenue_band;

-- Note: These fields remain in the businesses table as the single source of truth
