-- Add missing founder fields to business_insights table
-- =====================================================

-- Add founder fields that exist in original table but missing from business_insights
ALTER TABLE business_insights 
ADD COLUMN gender TEXT,
ADD COLUMN age_range TEXT,
ADD COLUMN years_entrepreneurial TEXT,
ADD COLUMN founder_role TEXT,
ADD COLUMN entrepreneurial_background TEXT,
ADD COLUMN businesses_founded TEXT,
ADD COLUMN family_entrepreneurial_background BOOLEAN,
ADD COLUMN founder_story TEXT,
ADD COLUMN pacific_identity TEXT[],
ADD COLUMN based_in_country TEXT,
ADD COLUMN based_in_city TEXT,
ADD COLUMN serves_pacific_communities TEXT,
ADD COLUMN culture_influences_business BOOLEAN,
ADD COLUMN culture_influence_details TEXT,
ADD COLUMN family_community_responsibilities_affect_business TEXT[],
ADD COLUMN responsibilities_impact_details TEXT,
ADD COLUMN mentorship_access BOOLEAN,
ADD COLUMN mentorship_offering BOOLEAN,
ADD COLUMN barriers_to_mentorship TEXT,
ADD COLUMN angel_investor_interest TEXT,
ADD COLUMN investor_capacity TEXT,
ADD COLUMN collaboration_interest BOOLEAN,
ADD COLUMN open_to_future_contact BOOLEAN,
ADD COLUMN goals_details TEXT,
ADD COLUMN goals_next_12_months_array TEXT[],
ADD COLUMN founder_motivation_array TEXT[];

-- Verify the columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'business_insights' 
  AND table_schema = 'public'
  AND column_name IN ('gender', 'age_range', 'years_entrepreneurial', 'founder_role', 'pacific_identity', 'founder_motivation_array')
ORDER BY column_name;
