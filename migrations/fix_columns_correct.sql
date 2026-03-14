-- Fix business_insights column names based on actual database schema
-- The error shows 'top_challenges' exists, so we need to add the _array columns

-- Add the new _array columns
ALTER TABLE business_insights 
ADD COLUMN IF NOT EXISTS top_challenges_array TEXT[];

ALTER TABLE business_insights 
ADD COLUMN IF NOT EXISTS community_impact_areas_array TEXT[];

ALTER TABLE business_insights 
ADD COLUMN IF NOT EXISTS support_needed_next_array TEXT[];

ALTER TABLE business_insights 
ADD COLUMN IF NOT EXISTS current_support_sources_array TEXT[];

ALTER TABLE business_insights 
ADD COLUMN IF NOT EXISTS is_business_registered BOOLEAN;

-- Copy data from old columns to new columns
UPDATE business_insights 
SET top_challenges_array = top_challenges 
WHERE top_challenges IS NOT NULL;

UPDATE business_insights 
SET community_impact_areas_array = community_impact_areas 
WHERE community_impact_areas IS NOT NULL;

UPDATE business_insights 
SET support_needed_next_array = support_needed_next 
WHERE support_needed_next IS NOT NULL;

UPDATE business_insights 
SET current_support_sources_array = current_support_sources 
WHERE current_support_sources IS NOT NULL;

UPDATE business_insights 
SET is_business_registered = business_registered 
WHERE business_registered IS NOT NULL;

-- Show the results
SELECT 
    column_name, 
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'business_insights' 
AND column_name IN ('top_challenges', 'top_challenges_array', 'community_impact_areas', 'community_impact_areas_array', 'support_needed_next', 'support_needed_next_array', 'current_support_sources', 'current_support_sources_array', 'business_registered', 'is_business_registered')
ORDER BY column_name;
