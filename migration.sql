-- Step 1: Create backup table
CREATE TABLE business_insights_snapshots_backup AS 
SELECT * FROM business_insights_snapshots;

-- Step 2: Drop the view that depends on the table
DROP VIEW IF EXISTS latest_business_insights;

-- Step 3: Remove the default first
ALTER TABLE business_insights_snapshots 
ALTER COLUMN family_community_responsibilities_affect_business 
DROP DEFAULT;

-- Step 4: Convert boolean to text array
ALTER TABLE business_insights_snapshots 
ALTER COLUMN family_community_responsibilities_affect_business 
TYPE text[] USING 
  CASE 
    WHEN family_community_responsibilities_affect_business = true THEN ARRAY['family_responsibilities']::text[]
    ELSE ARRAY[]::text[]
  END;

-- Step 5: Add new default value
ALTER TABLE business_insights_snapshots 
ALTER COLUMN family_community_responsibilities_affect_business 
SET DEFAULT '{}';

-- Step 6: Recreate the view with the new array field
CREATE OR REPLACE VIEW latest_business_insights AS
SELECT DISTINCT ON (user_id, business_id) 
    id,
    user_id,
    business_id,
    snapshot_year,
    submitted_date,
    year_started,
    years_entrepreneurial,
    businesses_founded,
    founder_role,
    founder_story,
    founder_motivation_array,
    problem_solved,
    team_size_band,
    business_model,
    family_involvement,
    customer_region,
    sales_channels,
    import_export_status,
    import_countries,
    export_countries,
    business_stage,
    top_challenges,
    support_needed_next,
    goals_next_12_months_array,
    hiring_intentions,
    community_impact_areas,
    collaboration_interest,
    created_date,
    updated_date,
    created_by,
    family_community_responsibilities_affect_business,
    expansion_plans,
    mentorship_offering,
    open_to_future_contact
FROM business_insights_snapshots
ORDER BY user_id, business_id, submitted_date DESC;

-- Step 7: Verify the migration
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default 
FROM information_schema.columns 
WHERE table_name = 'business_insights_snapshots' 
  AND column_name = 'family_community_responsibilities_affect_business';

-- Test the view
SELECT 
    id, 
    user_id, 
    family_community_responsibilities_affect_business,
    pg_typeof(family_community_responsibilities_affect_business)
FROM latest_business_insights 
LIMIT 5;
