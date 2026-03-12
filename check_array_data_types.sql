-- Check the actual data types in the original table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'business_insights_snapshots' 
  AND table_schema = 'public'
  AND column_name IN ('community_impact_areas', 'top_challenges', 'sales_channels', 'import_countries', 'export_countries', 'revenue_streams', 'support_needed_next', 'current_support_sources', 'founder_motivation_array', 'pacific_identity', 'family_community_responsibilities_affect_business', 'goals_next_12_months_array')
ORDER BY column_name;
