-- =====================================================
-- Pacific Market Database Views
-- Read-Only Convenience Layer for UI Components
-- =====================================================

-- View 1: v_owner_business_summary
-- Joins profiles + businesses for portal dashboard, header cards, admin lists
CREATE OR REPLACE VIEW v_owner_business_summary AS
SELECT 
    p.id as profile_id,
    p.email as profile_email,
    p.display_name as owner_name,
    p.role as profile_role,
    p.country as owner_country,
    p.city as owner_city,
    p.primary_cultural,
    p.languages,
    p.status as profile_status,
    b.id as business_id,
    b.name as business_name,
    b.business_handle,
    b.short_description,
    b.description,
    b.logo_url,
    b.banner_url,
    b.contact_email,
    b.contact_phone,
    b.contact_website,
    b.address,
    b.suburb,
    b.city as business_city,
    b.state_region,
    b.postal_code,
    b.country as business_country,
    b.industry,
    b.social_links,
    b.business_hours,
    b.business_structure,
    b.year_started,
    b.status as business_status,
    b.verified,
    b.claimed,
    b.claimed_at,
    b.claimed_by,
    b.visibility_tier,
    b.homepage_featured,
    b.source,
    b.profile_completeness,
    b.referral_code,
    b.created_at as business_created_date,
    b.updated_at as business_updated_date
FROM profiles p
LEFT JOIN businesses b ON p.id = b.owner_user_id;

-- View 2: v_latest_business_insights
-- Latest row from business_insights_snapshots per business
CREATE OR REPLACE VIEW v_latest_business_insights AS
WITH ranked_insights AS (
    SELECT 
        bis.*,
        ROW_NUMBER() OVER (PARTITION BY business_id ORDER BY submitted_date DESC) as rn
    FROM business_insights_snapshots bis
)
SELECT 
    r.business_id,
    r.id as insight_id,
    r.snapshot_year,
    r.submitted_date,
    r.founder_story,
    r.founder_role,
    r.problem_solved,
    r.team_size_band,
    r.business_model,
    r.family_involvement,
    r.customer_region,
    r.sales_channels,
    r.import_export_status,
    r.import_countries,
    r.export_countries,
    r.business_stage,
    r.top_challenges,
    r.hiring_intentions,
    r.community_impact_areas,
    r.collaboration_interest,
    r.revenue_band,
    r.expansion_plans,
    r.culture_influence_details,
    r.mentorship_access,
    r.mentorship_offering,
    r.open_to_future_contact,
    r.based_in_country,
    r.based_in_city,
    r.primary_industry
FROM ranked_insights r
WHERE r.rn = 1;

-- View 3: v_business_subscription_status
-- Businesses joined with active/current subscriptions
CREATE OR REPLACE VIEW v_business_subscription_status AS
SELECT 
    b.id as business_id,
    b.name as business_name,
    b.business_handle,
    b.owner_user_id,
    b.status as business_status,
    s.id as subscription_id,
    s.user_id as subscription_user_id,
    s.stripe_subscription_id,
    s.stripe_customer_id,
    s.plan_type,
    s.status as subscription_status,
    s.current_period_start,
    s.current_period_end,
    s.cancel_at_period_end,
    s.created_at as subscription_created,
    s.updated_at as subscription_updated,
    CASE 
        WHEN s.id IS NOT NULL AND s.status = 'active' THEN 'active'
        WHEN s.id IS NOT NULL AND s.status IN ('trialing', 'past_due') THEN s.status
        ELSE 'none'
    END as effective_subscription_status
FROM businesses b
LEFT JOIN subscriptions s ON b.id = s.business_id 
    AND (s.status = 'active' OR s.status = 'trialing' OR s.status = 'past_due')
ORDER BY b.name;

-- View 4: v_business_admin_full
-- Admin dashboard read model with all joined data
CREATE OR REPLACE VIEW v_business_admin_full AS
SELECT 
    -- Business fields
    b.id as business_id,
    b.name as business_name,
    b.business_handle,
    b.short_description,
    b.description,
    b.logo_url,
    b.banner_url,
    b.contact_email,
    b.contact_phone,
    b.contact_website,
    b.address,
    b.suburb,
    b.city as business_city,
    b.state_region,
    b.postal_code,
    b.country as business_country,
    b.industry,
    b.social_links,
    b.business_hours,
    b.business_structure,
    b.year_started,
    b.status as business_status,
    b.verified,
    b.claimed,
    b.claimed_at,
    b.claimed_by,
    b.visibility_tier,
    b.homepage_featured,
    b.source,
    b.profile_completeness,
    b.referral_code,
    b.created_at as business_created_date,
    b.updated_at as business_updated_date,
    
    -- Owner/Profile fields
    p.id as profile_id,
    p.email as profile_email,
    p.display_name as owner_name,
    p.role as profile_role,
    p.country as owner_country,
    p.city as owner_city,
    p.primary_cultural,
    p.languages,
    p.status as profile_status,
    
    -- Latest insights fields
    i.insight_id,
    i.snapshot_year,
    i.submitted_date as insight_submitted_date,
    i.founder_story,
    i.founder_role,
    i.problem_solved,
    i.team_size_band,
    i.business_model,
    i.family_involvement,
    i.customer_region,
    i.sales_channels,
    i.import_export_status,
    i.import_countries,
    i.export_countries,
    i.business_stage,
    i.top_challenges,
    i.hiring_intentions,
    i.community_impact_areas,
    i.collaboration_interest,
    i.revenue_band,
    i.expansion_plans,
    i.culture_influence_details,
    i.mentorship_access,
    i.mentorship_offering,
    i.open_to_future_contact,
    
    -- Subscription fields
    s.subscription_id,
    s.stripe_subscription_id,
    s.stripe_customer_id,
    s.plan_type,
    s.subscription_status,
    s.current_period_start,
    s.current_period_end,
    s.cancel_at_period_end,
    s.effective_subscription_status,
    
    -- Latest claim request status
    cr.id as claim_request_id,
    cr.status as claim_status,
    cr.contact_email as claim_contact_email,
    cr.contact_phone as claim_contact_phone,
    cr.verification_documents,
    cr.rejection_reason,
    cr.reviewed_by,
    cr.reviewed_at as claim_reviewed_at,
    cr.business_name as claim_business_name,
    cr.user_email as claim_user_email,
    cr.role as claim_role,
    cr.proof_url,
    cr.created_at as claim_created_at
    
FROM businesses b
LEFT JOIN profiles p ON b.owner_user_id = p.id
LEFT JOIN v_latest_business_insights i ON b.id = i.business_id
LEFT JOIN v_business_subscription_status s ON b.id = s.business_id
LEFT JOIN LATERAL (
    SELECT * FROM claim_requests cr1 
    WHERE cr1.business_id = b.id 
    ORDER BY cr1.created_at DESC 
    LIMIT 1
) cr ON true;

-- =====================================================
-- Index Recommendations for Views
-- =====================================================

-- Create supporting indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_businesses_owner_user_id ON businesses(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_business_insights_snapshots_business_id_submitted_date 
    ON business_insights_snapshots(business_id, submitted_date DESC);
CREATE INDEX IF NOT EXISTS idx_subscriptions_business_id_status 
    ON subscriptions(business_id, status);
CREATE INDEX IF NOT EXISTS idx_claim_requests_business_id_created_at 
    ON claim_requests(business_id, created_at DESC);

-- =====================================================
-- Usage Examples
-- =====================================================

/*
-- Portal Dashboard: Get user's businesses with basic info
SELECT * FROM v_owner_business_summary 
WHERE profile_id = $1;

-- Insights Page: Get latest insights for a business
SELECT * FROM v_latest_business_insights 
WHERE business_id = $1;

-- Admin Dashboard: Get full business data with filters
SELECT * FROM v_business_admin_full 
WHERE business_status = 'active' 
  AND industry = 'retail'
ORDER BY business_created_date DESC;

-- Billing UI: Get subscription status for a business
SELECT * FROM v_business_subscription_status 
WHERE business_id = $1;
*/
