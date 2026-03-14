-- ================================================================
-- FIX INSIGHTS TABLES FOREIGN KEYS
-- Correct the user_id references to match actual schema
-- ================================================================

-- Drop and recreate insights tables with correct foreign keys
DROP TABLE IF EXISTS business_insights CASCADE;
DROP TABLE IF EXISTS founder_insights CASCADE;

-- BUSINESS_INSIGHTS TABLE (Business-specific operational data)
CREATE TABLE business_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    snapshot_year INTEGER NOT NULL,
    submitted_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Business basics
    year_started INTEGER,
    problem_solved TEXT,
    team_size_band TEXT,
    business_model TEXT,
    family_involvement BOOLEAN,
    customer_region TEXT,
    sales_channels JSONB,
    import_export_status TEXT,
    import_countries JSONB,
    export_countries JSONB,
    
    -- Business stage & growth
    business_stage TEXT,
    top_challenges JSONB,
    hiring_intentions BOOLEAN,
    business_operating_status TEXT,
    business_age TEXT,
    business_registered BOOLEAN,
    employs_anyone BOOLEAN,
    employs_family_community BOOLEAN,
    team_size TEXT,
    
    -- Financial
    revenue_band TEXT,
    current_funding_source TEXT,
    funding_amount_needed TEXT,
    funding_purpose TEXT,
    investment_stage TEXT,
    revenue_streams TEXT[],
    financial_challenges TEXT,
    investment_exploration TEXT,
    
    -- Community & support
    community_impact_areas JSONB,
    support_needed_next TEXT[],
    current_support_sources TEXT[],
    expansion_plans BOOLEAN,
    
    -- Industry
    industry TEXT,
    
    -- Private contact details
    private_business_phone TEXT,
    private_business_email TEXT,
    
    -- Unique constraint: one business insight per business per year
    UNIQUE(business_id, snapshot_year)
);

-- FOUNDER_INSIGHTS TABLE (Founder-specific personal data)
CREATE TABLE founder_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    snapshot_year INTEGER NOT NULL,
    submitted_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Personal founder data
    gender TEXT,
    age_range TEXT,
    years_entrepreneurial TEXT,
    entrepreneurial_background TEXT,
    businesses_founded TEXT,
    family_entrepreneurial_background BOOLEAN,
    founder_role TEXT,
    founder_story TEXT,
    founder_motivation_array TEXT[],
    
    -- Pacific identity
    pacific_identity TEXT[],
    based_in_country TEXT,
    based_in_city TEXT,
    serves_pacific_communities TEXT,
    culture_influences_business BOOLEAN,
    culture_influence_details TEXT,
    family_community_responsibilities_affect_business TEXT[],
    responsibilities_impact_details TEXT,
    
    -- Support & mentorship
    mentorship_access BOOLEAN,
    mentorship_offering BOOLEAN,
    barriers_to_mentorship TEXT,
    
    -- Investment & collaboration
    angel_investor_interest TEXT,
    investor_capacity TEXT,
    collaboration_interest BOOLEAN,
    open_to_future_contact BOOLEAN,
    
    -- Goals (founder's personal goals)
    goals_details TEXT,
    goals_next_12_months_array TEXT[],
    
    -- Unique constraint: one founder insight per user per year
    UNIQUE(user_id, snapshot_year)
);

-- ================================================================
-- INDEXES
-- ================================================================

-- Business insights indexes
CREATE INDEX idx_business_insights_business_year ON business_insights(business_id, snapshot_year);
CREATE INDEX idx_business_insights_user ON business_insights(user_id);
CREATE INDEX idx_business_insights_year ON business_insights(snapshot_year);
CREATE INDEX idx_business_insights_stage ON business_insights(business_stage);
CREATE INDEX idx_business_insights_revenue ON business_insights(revenue_band);

-- Founder insights indexes
CREATE INDEX idx_founder_insights_user_year ON founder_insights(user_id, snapshot_year);
CREATE INDEX idx_founder_insights_year ON founder_insights(snapshot_year);
CREATE INDEX idx_founder_insights_gender ON founder_insights(gender);

-- ================================================================
-- RLS POLICIES
-- ================================================================

-- Enable RLS
ALTER TABLE business_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE founder_insights ENABLE ROW LEVEL SECURITY;

-- Business Insights RLS Policies
CREATE POLICY "Users can view own business insights" ON business_insights
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own business insights" ON business_insights
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own business insights" ON business_insights
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins full access to business_insights" ON business_insights
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Business owners can view business insights" ON business_insights
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM businesses b 
            WHERE b.id = business_insights.business_id 
            AND b.owner_user_id = auth.uid()
        )
    );

-- Founder Insights RLS Policies
CREATE POLICY "Users can view own founder insights" ON founder_insights
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own founder insights" ON founder_insights
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own founder insights" ON founder_insights
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins full access to founder_insights" ON founder_insights
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- ================================================================
-- TRIGGERS
-- ================================================================

-- Create triggers for updated_at
CREATE TRIGGER update_business_insights_updated_at BEFORE UPDATE ON business_insights
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_founder_insights_updated_at BEFORE UPDATE ON founder_insights
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================================
-- VERIFICATION
-- ================================================================

DO $$
BEGIN
    RAISE NOTICE '=== Insights Tables Fixed ===';
    RAISE NOTICE 'business_insights table created with correct foreign keys!';
    RAISE NOTICE 'founder_insights table created with correct foreign keys!';
    RAISE NOTICE 'RLS policies enabled for insights tables';
    RAISE NOTICE 'Indexes created for insights tables';
    RAISE NOTICE 'Triggers created for insights tables';
    RAISE NOTICE '=== Fix Complete ===';
END $$;
