-- FRONTEND UPDATES NEEDED FOR TABLE SEPARATION
-- =====================================================

-- CURRENT ISSUES:
-- 1. FounderInsightsAccordion submits business fields to founder_insights table
-- 2. Field name mismatches (growth_stage vs business_stage)
-- 3. Missing business_insights form for business-specific insights

-- SOLUTIONS:
-- 1. Update FounderInsightsAccordion to only submit founder-specific fields
-- 2. Create BusinessInsightsAccordion for business-specific insights
-- 3. Update field mappings to match database schema

-- FIELDS TO MOVE FROM FOUNDER_INSIGHTS TO BUSINESS_INSIGHTS:
-- - growth_stage -> business_stage (rename in DB)
-- - current_funding_source
-- - investment_stage
-- - revenue_streams
-- - financial_challenges
-- - funding_amount_needed
-- - funding_purpose
-- - angel_investor_interest
-- - investor_capacity
-- - top_challenges
-- - support_needed_next
-- - community_impact_areas
-- - expansion_plans

-- FIELDS TO KEEP IN FOUNDER_INSIGHTS:
-- - gender, age_range, years_entrepreneurial
-- - founder_role, founder_story, founder_motivation_array
-- - pacific_identity, based_in_country, based_in_city
-- - serves_pacific_communities, culture_influences_business
-- - culture_influence_details, family_community_responsibilities_affect_business
-- - responsibilities_impact_details, mentorship_access, mentorship_offering
-- - barriers_to_mentorship, collaboration_interest, open_to_future_contact
-- - goals_next_12_months_array, goals_details
