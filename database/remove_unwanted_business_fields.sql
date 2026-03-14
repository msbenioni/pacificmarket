-- Remove unwanted business fields
-- Migration script to drop columns from businesses and business_insights tables
-- Handles RLS policy dependencies

-- Drop RLS policies that depend on the columns we're removing
DROP POLICY IF EXISTS "Public can view business insights" ON business_insights;
DROP POLICY IF EXISTS "Users can view own business insights" ON business_insights;
DROP POLICY IF EXISTS "Users can insert own business insights" ON business_insights;
DROP POLICY IF EXISTS "Users can update own business insights" ON business_insights;

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

-- Recreate RLS policies for business_insights table without the removed columns
CREATE POLICY "Public can view business insights" ON business_insights
    FOR SELECT USING (true);

CREATE POLICY "Users can view own business insights" ON business_insights
    FOR SELECT USING (
        auth.uid() = user_id
    );

CREATE POLICY "Users can insert own business insights" ON business_insights
    FOR INSERT WITH CHECK (
        auth.uid() = user_id
    );

CREATE POLICY "Users can update own business insights" ON business_insights
    FOR UPDATE USING (
        auth.uid() = user_id
    );

-- Note: business_registered field is kept as it may be useful for other purposes
