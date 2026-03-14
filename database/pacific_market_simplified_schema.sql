-- ================================================================
-- PACIFIC MARKET SIMPLIFIED DATABASE SCHEMA
-- Core functionality only - removed unused tables
-- ================================================================

-- ================================================================
-- EXTENSIONS
-- ================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ================================================================
-- TABLES
-- ================================================================

-- PROFILES TABLE (Extended profiles table)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Profile completion tracking
    profile_completeness INTEGER DEFAULT 0 CHECK (profile_completeness >= 0 AND profile_completeness <= 100),
    
    -- Cultural identity (from onboarding)
    primary_cultural TEXT[],
    languages_spoken TEXT[],
    cultural_identity TEXT[],
    
    -- Professional background
    professional_background TEXT,
    skills_expertise TEXT[],
    education_level TEXT,
    
    -- Contact and location
    phone TEXT,
    country TEXT,
    city TEXT,
    
    -- Preferences
    notification_settings JSONB DEFAULT '{}',
    privacy_settings JSONB DEFAULT '{}',
    
    -- Unique constraint
    UNIQUE(user_id)
);

-- BUSINESSES TABLE (Main business listings)
CREATE TABLE IF NOT EXISTS businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Basic business information
    name TEXT NOT NULL,
    business_handle TEXT UNIQUE,
    tagline TEXT,
    description TEXT,
    tagline TEXT,
    
    -- Contact information (public)
    contact_name TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    contact_website TEXT,
    business_hours TEXT,
    public_phone TEXT,
    
    -- Location
    country TEXT,
    city TEXT,
    suburb TEXT,
    address TEXT,
    state_region TEXT,
    postal_code TEXT,
    
    -- Business classification
    industry TEXT,
    business_type TEXT,
    business_structure TEXT,
    
    -- Media
    logo_url TEXT,
    banner_url TEXT,
    
    -- Ownership and access
    business_owner TEXT,
    business_owner_email TEXT,
    additional_owner_emails TEXT[],
    
    -- Business metrics
    year_started INTEGER,
    team_size_band TEXT,
    employee_count INTEGER,
    annual_revenue TEXT,
    revenue_band TEXT,
    
    -- Status and verification
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'inactive', 'suspended')),
    verified BOOLEAN DEFAULT FALSE,
    claimed BOOLEAN DEFAULT FALSE,
    claimed_at TIMESTAMP WITH TIME ZONE,
    claimed_by UUID REFERENCES profiles(user_id),
    
    -- Subscription and visibility
    subscription_tier TEXT DEFAULT 'vaka' CHECK (subscription_tier IN ('vaka', 'mana', 'moana')),
    visibility_tier TEXT DEFAULT 'public' CHECK (visibility_tier IN ('public', 'private', 'unlisted')),
    homepage_featured BOOLEAN DEFAULT FALSE,
    
    -- Operational details
    business_operating_status TEXT DEFAULT 'operating',
    business_registered BOOLEAN DEFAULT FALSE,
    
    -- Social and web presence
    social_links JSONB DEFAULT '{}',
    website TEXT,
    
    -- Cultural and regional data
    cultural_identity TEXT[],
    languages_spoken TEXT[],
    
    -- Metadata
    source TEXT DEFAULT 'user',
    referral_code TEXT,
    
    -- Indexes
    CONSTRAINT businesses_business_handle_check CHECK (business_handle ~* '^[a-z0-9-]+$'),
    CONSTRAINT businesses_email_check CHECK (contact_email ~* '^[^@]+@[^@]+\.[^@]+$')
);

-- BUSINESS_INSIGHTS TABLE (Business-specific operational data)
CREATE TABLE IF NOT EXISTS business_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
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
CREATE TABLE IF NOT EXISTS founder_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
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

-- NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('system', 'business', 'profile', 'marketing')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Index for performance
    INDEX idx_notifications_user_unread (user_id, read),
    INDEX idx_notifications_created (created_at)
);

-- ================================================================
-- INDEXES
-- ================================================================

-- Businesses table indexes
CREATE INDEX IF NOT EXISTS idx_businesses_owner ON businesses(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_businesses_handle ON businesses(business_handle);
CREATE INDEX IF NOT EXISTS idx_businesses_email ON businesses(contact_email);
CREATE INDEX IF NOT EXISTS idx_businesses_owner_email ON businesses(business_owner_email);
CREATE INDEX IF NOT EXISTS idx_businesses_subscription ON businesses(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_businesses_status ON businesses(status);
CREATE INDEX IF NOT EXISTS idx_businesses_industry ON businesses(industry);
CREATE INDEX IF NOT EXISTS idx_businesses_country ON businesses(country);
CREATE INDEX IF NOT EXISTS idx_businesses_verified ON businesses(verified);
CREATE INDEX IF NOT EXISTS idx_businesses_created ON businesses(created_at);

-- GIN index for array fields
CREATE INDEX IF NOT EXISTS idx_businesses_additional_owners ON businesses USING GIN(additional_owner_emails);
CREATE INDEX IF NOT EXISTS idx_businesses_cultural_identity ON businesses USING GIN(cultural_identity);
CREATE INDEX IF NOT EXISTS idx_businesses_languages ON businesses USING GIN(languages_spoken);

-- Profiles table indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_user ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_cultural ON profiles USING GIN(primary_cultural);
CREATE INDEX IF NOT EXISTS idx_profiles_languages ON profiles USING GIN(languages_spoken);

-- Business insights indexes
CREATE INDEX IF NOT EXISTS idx_business_insights_business_year ON business_insights(business_id, snapshot_year);
CREATE INDEX IF NOT EXISTS idx_business_insights_user ON business_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_business_insights_year ON business_insights(snapshot_year);
CREATE INDEX IF NOT EXISTS idx_business_insights_stage ON business_insights(business_stage);
CREATE INDEX IF NOT EXISTS idx_business_insights_revenue ON business_insights(revenue_band);

-- Founder insights indexes
CREATE INDEX IF NOT EXISTS idx_founder_insights_user_year ON founder_insights(user_id, snapshot_year);
CREATE INDEX IF NOT EXISTS idx_founder_insights_year ON founder_insights(snapshot_year);
CREATE INDEX IF NOT EXISTS idx_founder_insights_gender ON founder_insights(gender);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at);

-- ================================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE founder_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins full access to profiles" ON profiles
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Public can view basic profile info" ON profiles
    FOR SELECT USING (true);

-- Businesses RLS Policies
CREATE POLICY "Users can view own businesses" ON businesses
    FOR SELECT USING (auth.uid() = owner_user_id);

CREATE POLICY "Users can update own businesses" ON businesses
    FOR UPDATE USING (auth.uid() = owner_user_id);

CREATE POLICY "Users can insert own businesses" ON businesses
    FOR INSERT WITH CHECK (auth.uid() = owner_user_id);

CREATE POLICY "Admins full access to businesses" ON businesses
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Public can view active business listings" ON businesses
    FOR SELECT USING (status = 'active' AND visibility_tier = 'public');

CREATE POLICY "Additional owners can view business" ON businesses
    FOR SELECT USING (
        auth.uid() = owner_user_id OR 
        auth.uid() IN (
            SELECT unnest(additional_owner_emails)::text 
            FROM profiles p 
            WHERE p.email = ANY(additional_owner_emails)
        )
    );

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

-- Notifications RLS Policies
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications" ON notifications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins full access to notifications" ON notifications
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- ================================================================
-- TRIGGERS AND FUNCTIONS
-- ================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON businesses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_business_insights_updated_at BEFORE UPDATE ON business_insights
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_founder_insights_updated_at BEFORE UPDATE ON founder_insights
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle business handle uniqueness
CREATE OR REPLACE FUNCTION generate_unique_business_handle(business_name TEXT)
RETURNS TEXT AS $$
DECLARE
    base_handle TEXT;
    handle TEXT;
    counter INTEGER := 1;
BEGIN
    -- Convert to lowercase, replace spaces and special chars with hyphens
    base_handle := lower(regexp_replace(business_name, '[^a-z0-9\s-]', '', 'g'));
    base_handle := regexp_replace(base_handle, '\s+', '-', 'g');
    base_handle := regexp_replace(base_handle, '-+', '-', 'g');
    base_handle := trim(both '-' from base_handle);
    
    -- If empty, use a default
    IF base_handle = '' THEN
        base_handle := 'business';
    END IF;
    
    -- Check if unique, if not add number
    handle := base_handle;
    WHILE EXISTS (SELECT 1 FROM businesses WHERE business_handle = handle) LOOP
        handle := base_handle || '-' || counter;
        counter := counter + 1;
    END LOOP;
    
    RETURN handle;
END;
$$ LANGUAGE plpgsql;

-- ================================================================
-- VIEWS
-- ================================================================

-- Public business listings view
CREATE OR REPLACE VIEW public_business_listings AS
SELECT 
    b.id,
    b.name,
    b.business_handle,
    b.tagline,
    b.logo_url,
    b.banner_url,
    b.contact_email,
    b.contact_website,
    b.country,
    b.city,
    b.industry,
    b.status,
    b.verified,
    b.subscription_tier,
    b.created_at,
    p.full_name as owner_name,
    p.avatar_url as owner_avatar
FROM businesses b
JOIN profiles p ON b.owner_user_id = p.user_id
WHERE b.status = 'active' 
  AND b.visibility_tier = 'public'
  AND b.verified = TRUE;

-- Business insights summary view
CREATE OR REPLACE VIEW business_insights_summary AS
SELECT 
    b.id as business_id,
    b.name as business_name,
    b.industry,
    bi.snapshot_year,
    bi.business_stage,
    bi.revenue_band,
    bi.team_size_band,
    bi.submitted_date,
    p.full_name as owner_name
FROM businesses b
LEFT JOIN business_insights bi ON b.id = bi.business_id
LEFT JOIN profiles p ON b.owner_user_id = p.user_id
ORDER BY bi.submitted_date DESC;

-- ================================================================
-- COMPLETION
-- ================================================================

-- Schema version info
COMMENT ON DATABASE pacific_market IS 'Pacific Market Database Schema v2.0 - Simplified core functionality';

-- Table comments
COMMENT ON TABLE profiles IS 'User profiles with cultural identity and professional background';
COMMENT ON TABLE businesses IS 'Business listings with public information and ownership details';
COMMENT ON TABLE business_insights IS 'Business operational data and insights (private)';
COMMENT ON TABLE founder_insights IS 'Founder personal data and journey insights (private)';
COMMENT ON TABLE notifications IS 'User notifications and system alerts';

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Pacific Market simplified database schema created successfully!';
    RAISE NOTICE 'Tables: profiles, businesses, business_insights, founder_insights, notifications';
    RAISE NOTICE 'RLS policies enabled for all tables';
    RAISE NOTICE 'Indexes created for optimal performance';
    RAISE NOTICE 'Triggers and functions implemented';
END $$;
