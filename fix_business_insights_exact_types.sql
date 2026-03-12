-- Fix business_insights table with EXACT data types from original
-- =====================================================

-- Drop and recreate with exact data types
DROP TABLE IF EXISTS business_insights;

-- Business Insights Table - with exact data types from original
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
    sales_channels JSONB,  -- JSONB from original
    import_export_status TEXT,
    import_countries JSONB,  -- JSONB from original
    export_countries JSONB,  -- JSONB from original
    
    -- Business stage & growth
    business_stage TEXT,
    top_challenges JSONB,   -- JSONB from original
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
    revenue_streams TEXT[],   -- ARRAY from original
    financial_challenges TEXT,
    investment_exploration TEXT,
    
    -- Community & support
    community_impact_areas JSONB,  -- JSONB from original
    support_needed_next TEXT[],    -- ARRAY from original
    current_support_sources TEXT[], -- ARRAY from original
    expansion_plans BOOLEAN,
    
    -- Industry
    industry TEXT,
    
    -- Metadata
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Unique constraint: one business insight per business per year
    UNIQUE(business_id, snapshot_year)
);

-- Create indexes
CREATE INDEX idx_business_insights_business_year ON business_insights(business_id, snapshot_year);
CREATE INDEX idx_business_insights_submitted_date ON business_insights(submitted_date DESC);
