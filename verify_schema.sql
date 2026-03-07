-- Verify all founder insights columns exist
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'business_insights_snapshots'
  AND column_name IN (
    'current_funding_source', 'angel_investor_interest', 'investor_capacity',
    'revenue_streams', 'financial_challenges', 'top_challenges', 
    'business_stage', 'hiring_intentions', 'community_impact_areas',
    'collaboration_interest', 'founder_role', 'founder_story'
  )
ORDER BY column_name;
