-- Verify the final database state after all migrations

-- Check businesses table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'businesses' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check business_insights_snapshots table structure  
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'business_insights_snapshots' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Show sample businesses data
SELECT id, name, business_handle, industry, country, city, subscription_tier, status, verified, claimed, profile_completeness
FROM businesses 
LIMIT 3;

-- Show if insights table has data
SELECT COUNT(*) as insights_count FROM business_insights_snapshots;

-- Check enum types
SELECT typname, typtype 
FROM pg_type 
WHERE typname IN ('subscription_tier_enum', 'business_status_enum', 'business_source_enum', 'team_size_band_enum', 'business_stage_enum', 'import_export_status_enum');
