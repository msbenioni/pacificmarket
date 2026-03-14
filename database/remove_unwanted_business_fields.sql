-- Remove unwanted business fields
-- Migration script to drop columns from businesses and business_insights tables

-- Drop columns from businesses table
ALTER TABLE businesses 
DROP COLUMN IF EXISTS business_operating_status,
DROP COLUMN IF EXISTS business_age,
DROP COLUMN IF EXISTS employs_anyone,
DROP COLUMN IF EXISTS employs_family_community;

-- Drop columns from business_insights table  
ALTER TABLE business_insights
DROP COLUMN IF EXISTS business_operating_status,
DROP COLUMN IF EXISTS business_age,
DROP COLUMN IF EXISTS employs_anyone,
DROP COLUMN IF EXISTS employs_family_community;

-- Note: business_registered field is kept as it may be useful for other purposes
