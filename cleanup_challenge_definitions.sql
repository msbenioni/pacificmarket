-- CLEAN UP CHALLENGE FIELD DEFINITIONS
-- =====================================================

-- STEP 1: Clarify what challenges belong in each table

-- FOUNDER_INSIGHTS should have these challenge fields:
-- - top_challenges (founder-specific challenges)
-- - support_needed_next (founder support needs)

-- BUSINESS_INSIGHTS should have these challenge fields:  
-- - top_challenges (business-specific challenges)
-- - support_needed_next (business support needs)

-- STEP 2: Update insights page to show separate analytics
-- - "Founder Challenges" section from founder_insights
-- - "Business Challenges" section from business_insights
-- - Combined "All Challenges" for ecosystem overview

-- STEP 3: Update field meanings in forms
-- - FounderInsightsAccordion → Founder-focused challenges
-- - BusinessInsightsAccordion → Business-focused challenges
