-- Phase 1, Task 1: Update businesses table to canonical schema
-- This migration creates the final authoritative business record structure

-- First, let's check the current structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'businesses' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Add new columns that don't exist
DO $$
BEGIN
    -- Check and add business_handle if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'business_handle') THEN
        ALTER TABLE businesses ADD COLUMN business_handle text;
    END IF;
    
    -- Check and add year_started if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'year_started') THEN
        ALTER TABLE businesses ADD COLUMN year_started integer;
    END IF;
    
    -- Check and add social_links if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'social_links') THEN
        ALTER TABLE businesses ADD COLUMN social_links jsonb;
    END IF;
    
    -- Check and add tagline if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'tagline') THEN
        ALTER TABLE businesses ADD COLUMN tagline text;
    END IF;
    
    -- Check and add created_by if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'created_by') THEN
        ALTER TABLE businesses ADD COLUMN created_by uuid REFERENCES auth.users(id);
    END IF;
    
    -- Check and add source if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'source') THEN
        ALTER TABLE businesses ADD COLUMN source text DEFAULT 'user';
    END IF;
    
    -- Check and add profile_completeness if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'profile_completeness') THEN
        ALTER TABLE businesses ADD COLUMN profile_completeness decimal(3,2) DEFAULT 0.0;
    END IF;
END $$;

-- Rename columns to match canonical schema
DO $$
BEGIN
    -- Rename category to industry if it exists and industry doesn't exist
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'category')
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'industry') THEN
        ALTER TABLE businesses RENAME COLUMN category TO industry;
    END IF;
    
    -- Rename tier to subscription_tier if it exists and subscription_tier doesn't exist
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'tier')
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'subscription_tier') THEN
        ALTER TABLE businesses RENAME COLUMN tier TO subscription_tier;
    END IF;
    
    -- Rename email to contact_email if it exists and contact_email doesn't exist
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'email')
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'contact_email') THEN
        ALTER TABLE businesses RENAME COLUMN email TO contact_email;
    END IF;
    
    -- Rename phone to contact_phone if it exists and contact_phone doesn't exist
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'phone')
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'contact_phone') THEN
        ALTER TABLE businesses RENAME COLUMN phone TO contact_phone;
    END IF;
    
    -- Rename handle to business_handle if it exists and business_handle doesn't exist
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'handle')
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'business_handle') THEN
        ALTER TABLE businesses RENAME COLUMN handle TO business_handle;
    END IF;
END $$;

-- Update enum types and constraints
DO $$
BEGIN
    -- Create or update subscription_tier enum
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_tier_enum') THEN
        CREATE TYPE subscription_tier_enum AS ENUM ('basic', 'verified', 'featured_plus');
    END IF;
    
    -- Update subscription_tier column to use new enum
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'subscription_tier') THEN
        -- Convert existing values and update column type
        UPDATE businesses SET subscription_tier = 'basic' WHERE subscription_tier = 'free' OR subscription_tier IS NULL;
        UPDATE businesses SET subscription_tier = 'verified' WHERE subscription_tier = 'verified';
        UPDATE businesses SET subscription_tier = 'featured_plus' WHERE subscription_tier = 'featured_plus';
        
        ALTER TABLE businesses ALTER COLUMN subscription_tier TYPE subscription_tier_enum USING subscription_tier::text::subscription_tier_enum;
    END IF;
    
    -- Create or update status enum if needed
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'business_status_enum') THEN
        CREATE TYPE business_status_enum AS ENUM ('pending', 'active', 'rejected');
    END IF;
    
    -- Update status column to use enum
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'status') THEN
        ALTER TABLE businesses ALTER COLUMN status TYPE business_status_enum USING status::text::business_status_enum;
    END IF;
    
    -- Create or update source enum
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'business_source_enum') THEN
        CREATE TYPE business_source_enum AS ENUM ('user', 'admin', 'import', 'claim');
    END IF;
    
    -- Update source column to use enum
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'source') THEN
        ALTER TABLE businesses ALTER COLUMN source TYPE business_source_enum USING source::text::business_source_enum;
    END IF;
END $$;

-- Add constraints for data integrity
ALTER TABLE businesses ADD CONSTRAINT businesses_business_handle_unique UNIQUE (business_handle);
ALTER TABLE businesses ADD CONSTRAINT businesses_name_not_empty CHECK (length(trim(name)) > 0);
ALTER TABLE businesses ADD CONSTRAINT businesses_subscription_tier_check CHECK (subscription_tier IN ('basic', 'verified', 'featured_plus'));
ALTER TABLE businesses ADD CONSTRAINT businesses_status_check CHECK (status IN ('pending', 'active', 'rejected'));
ALTER TABLE businesses ADD CONSTRAINT businesses_source_check CHECK (source IN ('user', 'admin', 'import', 'claim'));
ALTER TABLE businesses ADD CONSTRAINT businesses_year_started_check CHECK (year_started >= 1900 AND year_started <= EXTRACT(YEAR FROM CURRENT_DATE) + 1);
ALTER TABLE businesses ADD CONSTRAINT businesses_profile_completeness_check CHECK (profile_completeness >= 0.0 AND profile_completeness <= 1.0);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_businesses_status ON businesses(status);
CREATE INDEX IF NOT EXISTS idx_businesses_subscription_tier ON businesses(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_businesses_country ON businesses(country);
CREATE INDEX IF NOT EXISTS idx_businesses_industry ON businesses(industry);
CREATE INDEX IF NOT EXISTS idx_businesses_owner_user_id ON businesses(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_businesses_business_handle ON businesses(business_handle);
CREATE INDEX IF NOT EXISTS idx_businesses_created_date ON businesses(created_date);

-- Create trigger for updated_date
CREATE OR REPLACE FUNCTION update_updated_date_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_date = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_businesses_updated_date 
    BEFORE UPDATE ON businesses 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_date_column();

-- Create trigger for profile_completeness calculation
CREATE OR REPLACE FUNCTION calculate_profile_completeness()
RETURNS TRIGGER AS $$
BEGIN
    DECLARE completeness DECIMAL(3,2) := 0.0;
    field_count INTEGER := 0;
    total_fields INTEGER := 8; -- Adjust based on required fields
    
    -- Check required fields
    IF NEW.name IS NOT NULL AND length(trim(NEW.name)) > 0 THEN
        field_count := field_count + 1;
    END IF;
    
    IF NEW.industry IS NOT NULL AND length(trim(NEW.industry)) > 0 THEN
        field_count := field_count + 1;
    END IF;
    
    IF NEW.country IS NOT NULL AND length(trim(NEW.country)) > 0 THEN
        field_count := field_count + 1;
    END IF;
    
    IF NEW.city IS NOT NULL AND length(trim(NEW.city)) > 0 THEN
        field_count := field_count + 1;
    END IF;
    
    IF NEW.contact_email IS NOT NULL AND length(trim(NEW.contact_email)) > 0 THEN
        field_count := field_count + 1;
    END IF;
    
    IF NEW.description IS NOT NULL AND length(trim(NEW.description)) > 0 THEN
        field_count := field_count + 1;
    END IF;
    
    IF NEW.logo_url IS NOT NULL AND length(trim(NEW.logo_url)) > 0 THEN
        field_count := field_count + 1;
    END IF;
    
    IF NEW.website IS NOT NULL AND length(trim(NEW.website)) > 0 THEN
        field_count := field_count + 1;
    END IF;
    
    completeness := (field_count::DECIMAL / total_fields::DECIMAL);
    NEW.profile_completeness := completeness;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER calculate_business_profile_completeness 
    BEFORE INSERT OR UPDATE ON businesses 
    FOR EACH ROW 
    EXECUTE FUNCTION calculate_profile_completeness();

-- Verify the final structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'businesses' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Show sample data to verify migration
SELECT id, name, business_handle, industry, country, city, subscription_tier, status, verified, claimed, profile_completeness
FROM businesses 
LIMIT 5;
