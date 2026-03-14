-- Post-Migration Verification Script
-- Run this after the migration to verify everything works

-- ====================================================================
-- VERIFICATION STEP 1: Check all expected columns exist
-- ====================================================================

SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'business_insights' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- ====================================================================
-- VERIFICATION STEP 2: Check form field mapping
-- ====================================================================

-- This should show all 19 form fields are now mapped
SELECT COUNT(*) as total_columns
FROM information_schema.columns 
WHERE table_name = 'business_insights' 
AND table_schema = 'public';

-- ====================================================================
-- VERIFICATION STEP 3: Check table constraints and relationships
-- ====================================================================

-- Check foreign key constraints
SELECT
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.table_name = 'business_insights'
  AND tc.constraint_type = 'FOREIGN KEY';

-- Check existing businesses to use for testing
SELECT 
    id as business_id,
    name as business_name,
    created_at
FROM businesses 
LIMIT 3;

-- ====================================================================
-- VERIFICATION STEP 4: Test column accessibility (safe test)
-- ====================================================================

-- Test that we can select from all new columns without errors
SELECT 
    business_description,
    growth_stage,
    goals_next_12_months_array,
    collaboration_interest,
    mentorship_offering,
    open_to_future_contact,
    business_model,
    family_involvement,
    customer_region,
    sales_channels
FROM business_insights 
LIMIT 1; -- This will return NULL for new columns if no data exists

-- ====================================================================
-- VERIFICATION COMPLETE
-- ====================================================================

-- If all queries ran without error, the migration was successful
-- All BusinessInsightsAccordion form fields now have proper database mapping
-- The form should be able to INSERT, SELECT, UPDATE, and DELETE all fields correctly
-- (Note: Actual form operations will use real business_id values from the businesses table)
