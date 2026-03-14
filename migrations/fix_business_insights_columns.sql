-- Migration: Fix business_insights table column names
-- Purpose: Rename columns to match application naming conventions

-- Set environment variable for connection if needed
-- SET PGPASSWORD=${DATABASE_PASSWORD}

-- Connect to database using environment variable
-- \connect ${DATABASE_URL}

-- Rename columns to match expected field names
ALTER TABLE business_insights 
RENAME COLUMN top_challenges TO top_challenges_array;

ALTER TABLE business_insights 
RENAME COLUMN community_impact_areas TO community_impact_areas_array;

ALTER TABLE business_insights 
RENAME COLUMN support_needed_next TO support_needed_next_array;

ALTER TABLE business_insights 
RENAME COLUMN current_support_sources TO current_support_sources_array;

ALTER TABLE business_insights 
RENAME COLUMN business_registered TO is_business_registered;

-- Verify the changes
\dt business_insights
\d business_insights

-- Show sample data to confirm changes
SELECT 
    id,
    business_id,
    user_id,
    business_stage,
    top_challenges_array,
    community_impact_areas_array,
    support_needed_next_array,
    current_support_sources_array,
    is_business_registered,
    business_operating_status,
    team_size_band,
    revenue_band,
    investment_stage,
    investment_exploration
FROM business_insights 
LIMIT 5;

COMMIT;
