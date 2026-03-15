-- Remove duplicate location fields from founder_insights table
-- Migration script to drop duplicate columns that are already in businesses table
-- Handles RLS policy dependencies

-- Drop RLS policies that depend on the columns we're removing
DROP POLICY IF EXISTS "Public can view founder insights" ON founder_insights;
DROP POLICY IF EXISTS "Users can view own founder insights" ON founder_insights;
DROP POLICY IF EXISTS "Users can insert own founder insights" ON founder_insights;
DROP POLICY IF EXISTS "Users can update own founder insights" ON founder_insights;

-- Drop duplicate columns from founder_insights table  
ALTER TABLE founder_insights
DROP COLUMN IF EXISTS based_in_country,
DROP COLUMN IF EXISTS based_in_city;

-- Recreate RLS policies for founder_insights table without the removed columns
CREATE POLICY "Public can view founder insights" ON founder_insights
    FOR SELECT USING (true);

CREATE POLICY "Users can view own founder insights" ON founder_insights
    FOR SELECT USING (
        auth.uid() = user_id
    );

CREATE POLICY "Users can insert own founder insights" ON founder_insights
    FOR INSERT WITH CHECK (
        auth.uid() = user_id
    );

CREATE POLICY "Users can update own founder insights" ON founder_insights
    FOR UPDATE USING (
        auth.uid() = user_id
    );

-- Note: These fields remain in the businesses table as the single source of truth (country, city)
