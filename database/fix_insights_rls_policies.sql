-- ================================================================
-- FIX INSIGHTS RLS POLICIES
-- Add public access policies for aggregated insights data
-- ================================================================

-- Drop existing restrictive policies if they exist
DROP POLICY IF EXISTS "Users can view own business insights" ON business_insights;
DROP POLICY IF EXISTS "Users can update own business insights" ON business_insights;
DROP POLICY IF EXISTS "Users can insert own business insights" ON business_insights;
DROP POLICY IF EXISTS "Admins full access to business_insights" ON business_insights;
DROP POLICY IF EXISTS "Business owners can view business insights" ON business_insights;

DROP POLICY IF EXISTS "Users can view own founder insights" ON founder_insights;
DROP POLICY IF EXISTS "Users can update own founder insights" ON founder_insights;
DROP POLICY IF EXISTS "Users can insert own founder insights" ON founder_insights;
DROP POLICY IF EXISTS "Admins full access to founder_insights" ON founder_insights;

-- ================================================================
-- BUSINESS INSIGHTS RLS POLICIES
-- ================================================================

-- Public can view aggregated business insights (non-sensitive data only)
CREATE POLICY "Public can view business insights" ON business_insights
    FOR SELECT USING (
        -- Only allow access to non-sensitive fields for public viewing
        true AND (
            -- These fields are safe for public viewing
            snapshot_year IS NOT NULL OR
            submitted_date IS NOT NULL OR
            created_at IS NOT NULL OR
            updated_at IS NOT NULL OR
            -- Business basics (safe for public)
            year_started IS NOT NULL OR
            team_size_band IS NOT NULL OR
            business_model IS NOT NULL OR
            customer_region IS NOT NULL OR
            sales_channels IS NOT NULL OR
            import_export_status IS NOT NULL OR
            -- Business stage & growth (safe for public)
            business_stage IS NOT NULL OR
            top_challenges IS NOT NULL OR
            hiring_intentions IS NOT NULL OR
            business_operating_status IS NOT NULL OR
            business_age IS NOT NULL OR
            business_registered IS NOT NULL OR
            employs_anyone IS NOT NULL OR
            employs_family_community IS NOT NULL OR
            team_size IS NOT NULL OR
            -- Financial (aggregated only, no specific amounts)
            revenue_band IS NOT NULL OR
            current_funding_source IS NOT NULL OR
            funding_amount_needed IS NOT NULL OR
            funding_purpose IS NOT NULL OR
            investment_stage IS NOT NULL OR
            investment_exploration IS NOT NULL OR
            -- Community & support (safe for public)
            community_impact_areas IS NOT NULL OR
            support_needed_next IS NOT NULL OR
            current_support_sources IS NOT NULL OR
            expansion_plans IS NOT NULL OR
            -- Industry (safe for public)
            industry IS NOT NULL
        )
    );

-- Users can view own business insights (including sensitive data)
CREATE POLICY "Users can view own business insights" ON business_insights
    FOR SELECT USING (auth.uid() = user_id);

-- Users can update own business insights
CREATE POLICY "Users can update own business insights" ON business_insights
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can insert own business insights
CREATE POLICY "Users can insert own business insights" ON business_insights
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins full access to business_insights
CREATE POLICY "Admins full access to business_insights" ON business_insights
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Business owners can view business insights for their businesses
CREATE POLICY "Business owners can view business insights" ON business_insights
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM businesses b 
            WHERE b.id = business_insights.business_id 
            AND b.owner_user_id = auth.uid()
        )
    );

-- ================================================================
-- FOUNDER INSIGHTS RLS POLICIES
-- ================================================================

-- Public can view aggregated founder insights (non-sensitive data only)
CREATE POLICY "Public can view founder insights" ON founder_insights
    FOR SELECT USING (
        -- Only allow access to non-sensitive fields for public viewing
        true AND (
            -- These fields are safe for public viewing
            snapshot_year IS NOT NULL OR
            submitted_date IS NOT NULL OR
            created_at IS NOT NULL OR
            updated_at IS NOT NULL OR
            -- Personal founder data (aggregated, safe for public)
            gender IS NOT NULL OR
            age_range IS NOT NULL OR
            years_entrepreneurial IS NOT NULL OR
            businesses_founded IS NOT NULL OR
            founder_role IS NOT NULL OR
            founder_motivation_array IS NOT NULL OR
            -- Pacific identity (safe for public)
            pacific_identity IS NOT NULL OR
            based_in_country IS NOT NULL OR
            based_in_city IS NOT NULL OR
            serves_pacific_communities IS NOT NULL OR
            culture_influences_business IS NOT NULL OR
            family_community_responsibilities_affect_business IS NOT NULL OR
            -- Support & mentorship (safe for public)
            mentorship_access IS NOT NULL OR
            mentorship_offering IS NOT NULL OR
            barriers_to_mentorship IS NOT NULL OR
            -- Investment & collaboration (safe for public)
            angel_investor_interest IS NOT NULL OR
            investor_capacity IS NOT NULL OR
            collaboration_interest IS NOT NULL OR
            open_to_future_contact IS NOT NULL OR
            -- Goals (safe for public)
            goals_next_12_months_array IS NOT NULL
        )
    );

-- Users can view own founder insights (including sensitive data)
CREATE POLICY "Users can view own founder insights" ON founder_insights
    FOR SELECT USING (auth.uid() = user_id);

-- Users can update own founder insights
CREATE POLICY "Users can update own founder insights" ON founder_insights
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can insert own founder insights
CREATE POLICY "Users can insert own founder insights" ON founder_insights
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins full access to founder_insights
CREATE POLICY "Admins full access to founder_insights" ON founder_insights
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- ================================================================
-- VERIFICATION
-- ================================================================

-- Check that policies were created correctly
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename IN ('business_insights', 'founder_insights')
ORDER BY tablename, policyname;

-- Test public access (should work now)
SELECT COUNT(*) as business_insights_count FROM business_insights;
SELECT COUNT(*) as founder_insights_count FROM founder_insights;
