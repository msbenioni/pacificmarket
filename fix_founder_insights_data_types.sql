-- Update founder_insights table to use correct data types
-- =====================================================

-- Drop and recreate with correct data types
DROP TABLE IF EXISTS founder_insights;

-- Founder Insights Table - with correct data types from original
CREATE TABLE founder_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    snapshot_year INTEGER NOT NULL,
    submitted_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Personal founder data
    gender TEXT,
    age_range TEXT,
    years_entrepreneurial TEXT,
    entrepreneurial_background TEXT,
    businesses_founded TEXT,
    family_entrepreneurial_background BOOLEAN,
    founder_role TEXT,
    founder_story TEXT,
    founder_motivation_array JSONB,  -- Keep as JSONB from original
    
    -- Pacific identity
    pacific_identity JSONB,  -- Keep as JSONB from original
    based_in_country TEXT,
    based_in_city TEXT,
    serves_pacific_communities TEXT,
    culture_influences_business BOOLEAN,
    culture_influence_details TEXT,
    family_community_responsibilities_affect_business JSONB,  -- Keep as JSONB from original
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
    goals_next_12_months_array JSONB,  -- Keep as JSONB from original
    
    -- Metadata
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Unique constraint: one founder insight per user per year
    UNIQUE(user_id, snapshot_year)
);

-- Create indexes
CREATE INDEX idx_founder_insights_user_year ON founder_insights(user_id, snapshot_year);
CREATE INDEX idx_founder_insights_submitted_date ON founder_insights(submitted_date DESC);
