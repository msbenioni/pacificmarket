-- Fix data types for Pacific Founder Insights v2
-- This script handles the data type conversions that failed due to view dependencies

-- Since we can't drop the columns due to view dependencies, 
-- we'll add new array columns and migrate data

-- Add new array columns for structured data
ALTER TABLE business_insights_snapshots 
ADD COLUMN IF NOT EXISTS founder_motivation_array TEXT[],
ADD COLUMN IF NOT EXISTS goals_next_12_months_array TEXT[];

-- Create a function to safely migrate data
CREATE OR REPLACE FUNCTION migrate_insights_data()
RETURNS void AS $$
BEGIN
    -- Migrate founder_motivation from text to array if needed
    -- Only update rows where the array is null but text is not null
    UPDATE business_insights_snapshots 
    SET founder_motivation_array = ARRAY[founder_motivation] 
    WHERE founder_motivation_array IS NULL 
    AND founder_motivation IS NOT NULL 
    AND founder_motivation != '';
    
    -- Migrate goals_next_12_months from text to array if needed
    UPDATE business_insights_snapshots 
    SET goals_next_12_months_array = ARRAY[goals_next_12_months] 
    WHERE goals_next_12_months_array IS NULL 
    AND goals_next_12_months IS NOT NULL 
    AND goals_next_12_months != '';
END;
$$ LANGUAGE plpgsql;

-- Run the migration
SELECT migrate_insights_data();

-- Drop the function
DROP FUNCTION migrate_insights_data();

-- Verify the migration
SELECT 
    COUNT(*) as total_records,
    COUNT(founder_motivation_array) as founder_motivation_array_count,
    COUNT(goals_next_12_months_array) as goals_array_count
FROM business_insights_snapshots;
