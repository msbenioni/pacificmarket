-- Add gender and age_range fields to business_insights_snapshots table

-- Step 1: Drop the view first
DROP VIEW IF EXISTS latest_business_insights;

-- Step 2: Add gender field
ALTER TABLE business_insights_snapshots 
ADD COLUMN gender text DEFAULT '';

-- Step 3: Add age_range field  
ALTER TABLE business_insights_snapshots 
ADD COLUMN age_range text DEFAULT '';

-- Step 4: Recreate the view with new fields
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
    open_to_future_contact,
    gender,  -- New field!
    age_range  -- New field!
FROM business_insights_snapshots
ORDER BY user_id, business_id, submitted_date DESC;

-- Step 5: Verify the new columns
SELECT 
    column_name, 
    data_type, 
    column_default 
FROM information_schema.columns 
WHERE table_name = 'business_insights_snapshots' 
  AND column_name IN ('gender', 'age_range')
ORDER BY column_name;
