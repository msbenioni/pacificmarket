-- Add back cultural_identity and languages_spoken columns to businesses table
-- These were accidentally removed during the business profile refactor

-- Add cultural_identity column
ALTER TABLE businesses 
ADD COLUMN cultural_identity TEXT;

-- Add languages_spoken column  
ALTER TABLE businesses 
ADD COLUMN languages_spoken TEXT;

-- Add comments to document the columns
COMMENT ON COLUMN businesses.cultural_identity IS 'Cultural identity information for the business (re-added from duplicate table)';
COMMENT ON COLUMN businesses.languages_spoken IS 'Languages spoken by the business (re-added from duplicate table)';
