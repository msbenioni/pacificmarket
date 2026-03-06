-- Fix businesses table schema for canonical data model
-- This handles the data type conversion issues from the previous migration

-- First, drop existing constraints that conflict
ALTER TABLE businesses DROP CONSTRAINT IF EXISTS businesses_subscription_tier_check;
ALTER TABLE businesses DROP CONSTRAINT IF EXISTS businesses_status_check;

-- Update existing data to use new values before type conversion
UPDATE businesses SET subscription_tier = 'basic' WHERE subscription_tier = 'free' OR subscription_tier IS NULL;

-- Create enum types if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_tier_enum') THEN
        CREATE TYPE subscription_tier_enum AS ENUM ('basic', 'verified', 'featured_plus');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'business_status_enum') THEN
        CREATE TYPE business_status_enum AS ENUM ('pending', 'active', 'rejected');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'business_source_enum') THEN
        CREATE TYPE business_source_enum AS ENUM ('user', 'admin', 'import', 'claim');
    END IF;
END $$;

-- Convert columns to use new enum types
ALTER TABLE businesses ALTER COLUMN subscription_tier TYPE subscription_tier_enum USING subscription_tier::text::subscription_tier_enum;
ALTER TABLE businesses ALTER COLUMN status TYPE business_status_enum USING status::text::business_status_enum;

-- Add new columns if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'business_handle') THEN
        ALTER TABLE businesses ADD COLUMN business_handle text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'year_started') THEN
        ALTER TABLE businesses ADD COLUMN year_started integer;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'social_links') THEN
        ALTER TABLE businesses ADD COLUMN social_links jsonb;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'tagline') THEN
        ALTER TABLE businesses ADD COLUMN tagline text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'created_by') THEN
        ALTER TABLE businesses ADD COLUMN created_by uuid REFERENCES auth.users(id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'source') THEN
        ALTER TABLE businesses ADD COLUMN source business_source_enum DEFAULT 'user';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'profile_completeness') THEN
        ALTER TABLE businesses ADD COLUMN profile_completeness decimal(3,2) DEFAULT 0.0;
    END IF;
END $$;

-- Rename columns if needed and they don't conflict
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

-- Add constraints
ALTER TABLE businesses ADD CONSTRAINT businesses_business_handle_unique UNIQUE (business_handle);
ALTER TABLE businesses ADD CONSTRAINT businesses_name_not_empty CHECK (length(trim(name)) > 0);
ALTER TABLE businesses ADD CONSTRAINT businesses_subscription_tier_check CHECK (subscription_tier IN ('basic', 'verified', 'featured_plus'));
ALTER TABLE businesses ADD CONSTRAINT businesses_status_check CHECK (status IN ('pending', 'active', 'rejected'));
ALTER TABLE businesses ADD CONSTRAINT businesses_source_check CHECK (source IN ('user', 'admin', 'import', 'claim'));
ALTER TABLE businesses ADD CONSTRAINT businesses_year_started_check CHECK (year_started >= 1900 AND year_started <= EXTRACT(YEAR FROM CURRENT_DATE) + 1);
ALTER TABLE businesses ADD CONSTRAINT businesses_profile_completeness_check CHECK (profile_completeness >= 0.0 AND profile_completeness <= 1.0);

-- Create indexes that don't exist
CREATE INDEX IF NOT EXISTS idx_businesses_business_handle ON businesses(business_handle);
CREATE INDEX IF NOT EXISTS idx_businesses_owner_user_id ON businesses(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_businesses_created_date ON businesses(created_date);

-- Verify the final structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'businesses' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Show sample data to verify migration
SELECT id, name, business_handle, industry, country, city, subscription_tier, status, verified, claimed, profile_completeness
FROM businesses 
LIMIT 3;
