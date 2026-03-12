-- SUPABASE DATABASE DUMP
-- Generated: 2026-03-13_12-12-00
-- This is a placeholder for an actual Supabase dump
-- To get the real dump, you would run:

-- For Supabase CLI:
-- supabase db dump --db-url=postgresql://[user]:[password]@[host]:[port]/[database] > supabase_dump.sql

-- Or via pg_dump:
-- pg_dump -h [host] -U [user] -d [database] > supabase_dump.sql

-- ====================================================================
-- ACTUAL SUPABASE TABLES (as of refactoring completion)
-- ====================================================================

-- To get the actual current state, run one of these commands:

-- 1. If you have Supabase CLI installed:
--    supabase db dump

-- 2. If you have direct database access:
--    pg_dump -h [your-project-ref.supabase.co] -U postgres -d postgres > actual_dump.sql

-- 3. Via Supabase Dashboard:
--    - Go to Database > Settings
--    - Click "Download Database Dump"

-- ====================================================================
-- EXPECTED TABLES TO INCLUDE:
-- ====================================================================

-- 1. Core tables
--    - businesses
--    - founder_insights  
--    - business_insights
--    - claim_requests
--    - profiles

-- 2. Supabase auth tables
--    - auth.users
--    - auth.sessions
--    - auth.refresh_tokens
----    - auth.users_providers

-- 3. Other system tables
--    - migrations
--    - schema_migrations
--    - storage.objects
--    - storage.buckets

-- ====================================================================
-- CURRENT KNOWN STRUCTURE (from our refactoring)
-- ====================================================================

-- FOUNDER_INSIGHTS (newly created)
CREATE TABLE founder_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    snapshot_year INTEGER NOT NULL,
    submitted_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    gender TEXT,
    age_range TEXT,
    years_entrepreneurial TEXT,
    entrepreneurial_background TEXT,
    businesses_founded TEXT,
    family_entrepreneurial_background BOOLEAN,
    founder_role TEXT,
    founder_story TEXT,
    founder_motivation_array TEXT[],
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
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, snapshot_year)
);

-- BUSINESS_INSIGHTS (newly created)  
CREATE TABLE business_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    snapshot_year INTEGER NOT NULL,
    submitted_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
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
    business_stage TEXT,
    top_challenges JSONB,
    hiring_intentions BOOLEAN,
    business_operating_status TEXT,
    business_age TEXT,
    business_registered BOOLEAN,
    employs_anyone BOOLEAN,
    employs_family_community BOOLEAN,
    team_size TEXT,
    revenue_band TEXT,
    current_funding_source TEXT,
    funding_amount_needed TEXT,
    funding_purpose TEXT,
    investment_stage TEXT,
    revenue_streams TEXT[],
    financial_challenges TEXT,
    investment_exploration TEXT,
    community_impact_areas JSONB,
    support_needed_next TEXT[],
    current_support_sources TEXT[],
    expansion_plans BOOLEAN,
    industry TEXT,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(business_id, snapshot_year)
);

-- ====================================================================
-- TO GET ACTUAL DUMP:
-- ====================================================================

-- Replace the placeholder commands above with your actual Supabase credentials
-- and run one of these commands to get the real database dump.
