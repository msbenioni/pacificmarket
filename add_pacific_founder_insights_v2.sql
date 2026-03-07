-- Add Pacific Founder Insights v2 Fields
-- This migration adds all the new fields for the enhanced Pacific Founder Insights Survey

-- Add new fields to business_insights_snapshots table
ALTER TABLE business_insights_snapshots 
ADD COLUMN IF NOT EXISTS founder_role TEXT,
ADD COLUMN IF NOT EXISTS founder_story TEXT,
ADD COLUMN IF NOT EXISTS business_operating_status TEXT,
ADD COLUMN IF NOT EXISTS business_age TEXT,
ADD COLUMN IF NOT EXISTS business_registered BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS employs_anyone BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS employs_family_community BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS sales_channels TEXT[], -- Array of sales channels
ADD COLUMN IF NOT EXISTS revenue_band TEXT,
ADD COLUMN IF NOT EXISTS pacific_identity TEXT[], -- Array of Pacific communities
ADD COLUMN IF NOT EXISTS based_in_country TEXT,
ADD COLUMN IF NOT EXISTS based_in_city TEXT,
ADD COLUMN IF NOT EXISTS serves_pacific_communities TEXT,
ADD COLUMN IF NOT EXISTS culture_influences_business BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS culture_influence_details TEXT,
ADD COLUMN IF NOT EXISTS family_community_responsibilities_affect_business BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS responsibilities_impact_details TEXT,
ADD COLUMN IF NOT EXISTS support_needed_next TEXT[], -- Array of support needs
ADD COLUMN IF NOT EXISTS current_support_sources TEXT[], -- Array of current support sources
ADD COLUMN IF NOT EXISTS goals_next_12_months TEXT[], -- Array of goals (changed from text)
ADD COLUMN IF NOT EXISTS goals_details TEXT, -- Optional text details for goals
ADD COLUMN IF NOT EXISTS expansion_plans BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS open_to_future_contact BOOLEAN DEFAULT FALSE;

-- Update existing founder_motivation to be an array if it's not already
-- This handles the change from text to array for structured data
DO $$
BEGIN
    -- Check if founder_motivation column exists and is not already an array
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'business_insights_snapshots' 
        AND column_name = 'founder_motivation'
        AND data_type != 'ARRAY'
    ) THEN
        -- Create temporary array column
        ALTER TABLE business_insights_snapshots ADD COLUMN IF NOT EXISTS founder_motivation_new TEXT[];
        
        -- Move data from text to array (split by commas if multiple values)
        UPDATE business_insights_snapshots 
        SET founder_motivation_new = ARRAY[founder_motivation] 
        WHERE founder_motivation IS NOT NULL AND founder_motivation != '';
        
        -- Drop old column and rename new one
        ALTER TABLE business_insights_snapshots DROP COLUMN IF EXISTS founder_motivation;
        ALTER TABLE business_insights_snapshots RENAME COLUMN founder_motivation_new TO founder_motivation;
    END IF;
END $$;

-- Update existing goals_next_12_months to be an array if it's not already
DO $$
BEGIN
    -- Check if goals_next_12_months column exists and is not already an array
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'business_insights_snapshots' 
        AND column_name = 'goals_next_12_months'
        AND data_type != 'ARRAY'
    ) THEN
        -- Create temporary array column
        ALTER TABLE business_insights_snapshots ADD COLUMN IF NOT EXISTS goals_next_12_months_new TEXT[];
        
        -- Move data from text to array (split by commas if multiple values)
        UPDATE business_insights_snapshots 
        SET goals_next_12_months_new = ARRAY[goals_next_12_months] 
        WHERE goals_next_12_months IS NOT NULL AND goals_next_12_months != '';
        
        -- Drop old column and rename new one
        ALTER TABLE business_insights_snapshots DROP COLUMN IF EXISTS goals_next_12_months;
        ALTER TABLE business_insights_snapshots RENAME COLUMN goals_next_12_months_new TO goals_next_12_months;
    END IF;
END $$;

-- Update existing community_impact_areas to have better options
-- (This is optional - existing data will still work)

-- Add indexes for performance on new array fields
CREATE INDEX IF NOT EXISTS idx_business_insights_snapshots_pacific_identity 
ON business_insights_snapshots USING GIN (pacific_identity);

CREATE INDEX IF NOT EXISTS idx_business_insights_snapshots_sales_channels 
ON business_insights_snapshots USING GIN (sales_channels);

CREATE INDEX IF NOT EXISTS idx_business_insights_snapshots_support_needed_next 
ON business_insights_snapshots USING GIN (support_needed_next);

CREATE INDEX IF NOT EXISTS idx_business_insights_snapshots_goals_next_12_months 
ON business_insights_snapshots USING GIN (goals_next_12_months);

CREATE INDEX IF NOT EXISTS idx_business_insights_snapshots_community_impact_areas 
ON business_insights_snapshots USING GIN (community_impact_areas);

-- Add indexes for key text fields
CREATE INDEX IF NOT EXISTS idx_business_insights_snapshots_business_operating_status 
ON business_insights_snapshots(business_operating_status);

CREATE INDEX IF NOT EXISTS idx_business_insights_snapshots_business_age 
ON business_insights_snapshots(business_age);

CREATE INDEX IF NOT EXISTS idx_business_insights_snapshots_based_in_country 
ON business_insights_snapshots(based_in_country);

CREATE INDEX IF NOT EXISTS idx_business_insights_snapshots_serves_pacific_communities 
ON business_insights_snapshots(serves_pacific_communities);

-- Verify the new columns were added
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'business_insights_snapshots' 
    AND column_name IN (
        'founder_role', 'founder_story', 'business_operating_status', 'business_age',
        'business_registered', 'employs_anyone', 'employs_family_community',
        'sales_channels', 'revenue_band', 'pacific_identity', 'based_in_country',
        'based_in_city', 'serves_pacific_communities', 'culture_influences_business',
        'culture_influence_details', 'family_community_responsibilities_affect_business',
        'responsibilities_impact_details', 'support_needed_next', 'current_support_sources',
        'goals_next_12_months', 'goals_details', 'expansion_plans', 'open_to_future_contact'
    )
ORDER BY column_name;
