-- FORM-FIELD TO DB-COLUMN CONSISTENCY ANALYSIS
-- =====================================================

🔍 FOUNDER_INSIGHTS_ACCORDION FIELDS:
✅ SUBMITTED TO founder_insights TABLE:
- gender ✅
- age_range ✅ 
- years_entrepreneurial ✅
- entrepreneurial_background ❓ (CHECK IF EXISTS)
- businesses_founded ✅
- family_entrepreneurial_background ❓ (CHECK IF EXISTS)
- founder_role ✅
- founder_story ✅
- founder_motivation_array ✅
- pacific_identity ✅
- based_in_country ✅
- based_in_city ✅
- serves_pacific_communities ✅
- culture_influences_business ✅
- culture_influence_details ✅
- family_community_responsibilities_affect_business ✅
- responsibilities_impact_details ✅
- mentorship_access ❓ (CHECK IF EXISTS)
- mentorship_offering ✅
- barriers_to_mentorship ❓ (CHECK IF EXISTS)
- angel_investor_interest ✅
- investor_capacity ✅
- collaboration_interest ✅
- open_to_future_contact ✅
- goals_details ✅
- goals_next_12_months_array ✅

🔍 BUSINESS_INSIGHTS_ACCORDION FIELDS:
✅ SUBMITTED TO business_insights TABLE:
- business_id ✅
- user_id ✅
- business_stage ✅
- team_size_band ✅
- business_model ✅
- family_involvement ✅
- customer_region ✅
- sales_channels ✅
- import_export_status ✅
- import_countries ✅
- export_countries ✅
- business_operating_status ✅
- business_age ✅
- business_registered ✅
- employs_anyone ✅
- employs_family_community ✅
- team_size ✅
- revenue_band ✅
- current_funding_source ✅
- investment_stage ✅
- revenue_streams ✅
- financial_challenges ✅
- funding_amount_needed ✅
- funding_purpose ✅
- top_challenges ✅
- support_needed_next ✅
- goals_next_12_months_array ✅
- expansion_plans ✅
- community_impact_areas ✅
- collaboration_interest ✅
- open_to_future_contact ✅

❌ POTENTIAL ISSUES TO CHECK:
1. entrepreneurial_background field
2. family_entrepreneurial_background field  
3. mentorship_access field
4. barriers_to_mentorship field
5. Any fields in forms that don't exist in DB
6. Any DB columns that aren't being collected by forms
