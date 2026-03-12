-- Fix business_insights table to include founder fields that are relevant to business
-- =====================================================

-- Drop and recreate with founder fields included
DROP TABLE IF EXISTS business_insights;

-- Business Insights Table - with both business AND relevant founder fields
CREATE TABLE business_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
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
    
    -- Founder context (relevant to business understanding)
    gender TEXT,
    age_range TEXT,
    years_entrepreneurial TEXT,
    entrepreneurial_background TEXT,
    businesses_founded TEXT,
    family_entrepreneurial_background BOOLEAN,
    founder_role TEXT,
    founder_story TEXT,
    pacific_identity TEXT[],
    based_in_country TEXT,
    based_in_city TEXT,
    serves_pacific_communities TEXT,
    culture_influences_business BOOLEAN,
    culture_influence_details TEXT,
    family_community_responsibilities_affect_business TEXT[],
    responsibilities_impact_details TEXT,
    mentorship_access BOOLEAN,
    mentorship_offering BOOLEAN,
    barriers_to_mentorship TEXT,
    angel_investor_interest TEXT,
    investor_capacity TEXT,
    collaboration_interest BOOLEAN,
    open_to_future_contact BOOLEAN,
    goals_details TEXT,
    goals_next_12_months_array TEXT[],
    founder_motivation_array TEXT[],
    
    -- Metadata
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Unique constraint: one business insight per business per year
    UNIQUE(business_id, snapshot_year)
);

-- Create indexes
CREATE INDEX idx_business_insights_business_year ON business_insights(business_id, snapshot_year);
CREATE INDEX idx_business_insights_submitted_date ON business_insights(submitted_date DESC);
