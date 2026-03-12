-- 🔍 FORM-FIELD TO DB-COLUMN CONSISTENCY ISSUES FOUND
-- =====================================================

❌ FOUNDER_INSIGHTS ACCORDION MISMATCHES:

FORM SUBMITS → DB COLUMN (ACTUAL):
✅ gender → gender (TEXT) ✅
✅ age_range → age_range (TEXT) ✅  
✅ years_entrepreneurial → years_entrepreneurial (TEXT) ✅
❌ entrepreneurial_background → NOT IN DB (NEED TO ADD)
✅ businesses_founded → businesses_founded (TEXT) ✅
❌ family_entrepreneurial_background → family_entrepreneurial_background (BOOLEAN) ✅
✅ founder_role → founder_role (TEXT) ✅
✅ founder_story → founder_story (TEXT) ✅
✅ founder_motivation_array → founder_motivation_array (TEXT[]) ✅
✅ pacific_identity → pacific_identity (TEXT[]) ✅
✅ based_in_country → based_in_country (TEXT) ✅
✅ based_in_city → based_in_city (TEXT) ✅
✅ serves_pacific_communities → serves_pacific_communities (TEXT) ✅
✅ culture_influences_business → culture_influences_business (BOOLEAN) ✅
✅ culture_influence_details → culture_influence_details (TEXT) ✅
✅ family_community_responsibilities_affect_business → family_community_responsibilities_affect_business (TEXT[]) ✅
✅ responsibilities_impact_details → responsibilities_impact_details (TEXT) ✅
✅ mentorship_access → mentorship_access (BOOLEAN) ✅
✅ mentorship_offering → mentorship_offering (BOOLEAN) ✅
✅ barriers_to_mentorship → barriers_to_mentorship (TEXT) ✅
✅ angel_investor_interest → angel_investor_interest (TEXT) ✅
✅ investor_capacity → investor_capacity (TEXT) ✅
✅ collaboration_interest → collaboration_interest (BOOLEAN) ✅
✅ open_to_future_contact → open_to_future_contact (BOOLEAN) ✅
✅ goals_details → goals_details (TEXT) ✅
✅ goals_next_12_months_array → goals_next_12_months_array (TEXT[]) ✅

❌ BUSINESS_INSIGHTS ACCORDION MISMATCHES:

FORM SUBMITS → DB COLUMN (ACTUAL):
✅ business_stage → business_stage (TEXT) ✅
✅ team_size_band → team_size_band (TEXT) ✅
✅ business_model → business_model (TEXT) ✅
✅ family_involvement → family_involvement (BOOLEAN) ✅
✅ customer_region → customer_region (TEXT) ✅
❌ sales_channels → sales_channels (JSONB) - FORM USES ARRAY ❌
✅ import_export_status → import_export_status (TEXT) ✅
❌ import_countries → import_countries (JSONB) - FORM USES ARRAY ❌
❌ export_countries → export_countries (JSONB) - FORM USES ARRAY ❌
✅ business_operating_status → business_operating_status (TEXT) ✅
✅ business_age → business_age (TEXT) ✅
✅ business_registered → business_registered (BOOLEAN) ✅
✅ employs_anyone → employs_anyone (BOOLEAN) ✅
✅ employs_family_community → employs_family_community (BOOLEAN) ✅
✅ team_size → team_size (TEXT) ✅
✅ revenue_band → revenue_band (TEXT) ✅
✅ current_funding_source → current_funding_source (TEXT) ✅
✅ investment_stage → investment_stage (TEXT) ✅
❌ revenue_streams → revenue_streams (TEXT[]) - FORM USES ARRAY ✅
✅ financial_challenges → financial_challenges (TEXT) ✅
✅ funding_amount_needed → funding_amount_needed (TEXT) ✅
✅ funding_purpose → funding_purpose (TEXT) ✅
❌ top_challenges → top_challenges (JSONB) - FORM USES ARRAY ❌
❌ support_needed_next → support_needed_next (TEXT[]) - FORM USES ARRAY ✅
✅ goals_next_12_months_array → goals_next_12_months_array (TEXT[]) ✅
✅ expansion_plans → expansion_plans (BOOLEAN) ✅
❌ community_impact_areas → community_impact_areas (JSONB) - FORM USES ARRAY ❌
✅ collaboration_interest → collaboration_interest (BOOLEAN) ✅
✅ open_to_future_contact → open_to_future_contact (BOOLEAN) ✅

🔧 NEEDED FIXES:
1. Add missing entrepreneurial_background field to founder_insights
2. Fix data type mismatches (JSONB vs TEXT[])
3. Update forms to match DB data types
