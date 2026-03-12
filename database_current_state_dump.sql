-- CURRENT DATABASE STATE DUMP
-- Generated: 2026-03-13_12-10-55
-- Purpose: Clean baseline after insights table separation refactoring

-- ====================================================================
-- TABLE STRUCTURES
-- ====================================================================

-- FOUNDER_INSIGHTS TABLE (Founder-specific data)
CREATE TABLE founder_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    snapshot_year INTEGER NOT NULL,
    submitted_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Personal founder data
    gender TEXT,
    age_range TEXT,
    years_entrepreneurial TEXT,
    entrepreneurial_background TEXT, -- Added during consistency fix
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
    
    -- Metadata
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Unique constraint: one founder insight per user per year
    UNIQUE(user_id, snapshot_year)
);

-- BUSINESS_INSIGHTS TABLE (Business-specific data)
CREATE TABLE business_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    snapshot_year INTEGER NOT NULL,
    submitted_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
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
    
    -- Metadata
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Unique constraint: one business insight per business per year
    UNIQUE(business_id, snapshot_year)
);

-- ====================================================================
-- RLS POLICIES
-- ====================================================================

-- Enable RLS on both tables
ALTER TABLE founder_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_insights ENABLE ROW LEVEL SECURITY;

-- Founder Insights Policies
CREATE POLICY "Admins full access to founder_insights" ON founder_insights 
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can view own founder insights" ON founder_insights 
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own founder insights" ON founder_insights 
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own founder insights" ON founder_insights 
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own founder insights" ON founder_insights 
FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Public can view founder insights for analytics" ON founder_insights 
FOR SELECT USING (true);

-- Business Insights Policies
CREATE POLICY "Admins full access to business_insights" ON business_insights 
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can view own business insights" ON business_insights 
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own business insights" ON business_insights 
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own business insights" ON business_insights 
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own business insights" ON business_insights 
FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Public can view business insights for analytics" ON business_insights 
FOR SELECT USING (true);

-- ====================================================================
-- INDEXES
-- ====================================================================

-- Founder Insights Indexes
CREATE INDEX idx_founder_insights_user_year ON founder_insights(user_id, snapshot_year);
CREATE INDEX idx_founder_insights_submitted_date ON founder_insights(submitted_date);
CREATE INDEX idx_founder_insights_source_year ON founder_insights(snapshot_year);

-- Business Insights Indexes
CREATE INDEX idx_business_insights_business_year ON business_insights(business_id, snapshot_year);
CREATE INDEX idx_business_insights_submitted_date ON business_insights(submitted_date);
CREATE INDEX idx_business_insights_source_year ON business_insights(snapshot_year);

-- ====================================================================
-- CURRENT DATA STATUS
-- ====================================================================

-- As of this dump:
-- - 2 business records exist in businesses table
-- - Founder insights data has been migrated to founder_insights table
-- - Business insights data has been migrated to business_insights table
-- - All RLS policies are active
-- - Forms are properly mapped to database columns

-- ====================================================================
-- FRONTEND CONFIGURATION
-- ====================================================================

-- Insights.jsx fetches from BOTH tables:
-- - founder_insights (for founder demographics, background, goals)
-- - business_insights (for business operations, financial data, growth)

-- BusinessPortal.jsx uses:
-- - FounderInsightsAccordion → founder_insights table
-- - BusinessInsightsAccordion → business_insights table

-- Form-Field Consistency: 100% MATCHED
-- - All form fields map directly to database columns
-- - Data types properly aligned (JSONB vs TEXT[])
-- - No missing or mismatched fields
