-- Drop and Recreate Views, Then Drop Columns
-- Created: 2026-03-18

-- ========================================
-- PART 1: DROP DEPENDENT VIEWS
-- ========================================

-- Drop the views that depend on businesses table
DROP VIEW IF EXISTS public_businesses;
DROP VIEW IF EXISTS public_business_statistics;

RAISE NOTICE 'Dropped dependent views';

-- ========================================
-- PART 2: NOW DROP THE PROBLEMATIC COLUMNS
-- ========================================

-- Drop business_owner
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'business_owner') THEN
        ALTER TABLE businesses DROP COLUMN business_owner;
        RAISE NOTICE 'Dropped business_owner column';
    ELSE
        RAISE NOTICE 'Column business_owner does not exist, skipping drop';
    END IF;
END $$;

-- Drop business_owner_email
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'business_owner_email') THEN
        ALTER TABLE businesses DROP COLUMN business_owner_email;
        RAISE NOTICE 'Dropped business_owner_email column';
    ELSE
        RAISE NOTICE 'Column business_owner_email does not exist, skipping drop';
    END IF;
END $$;

-- ========================================
-- PART 3: RECREATE VIEWS WITH NEW SCHEMA
-- ========================================

-- Recreate public_businesses view with new column names
CREATE VIEW public_businesses AS
SELECT 
    id,
    business_name as name,  -- Use renamed column
    business_handle,
    tagline,
    description,
    logo_url,
    banner_url,
    mobile_banner_url,
    business_email as contact_email,  -- Use renamed column
    business_website as contact_website,  -- Use renamed column
    business_phone as contact_phone,  -- Use renamed column
    business_hours,
    country,
    city,
    industry,
    status,
    is_verified,
    created_date,
    updated_at
FROM businesses
WHERE status = 'active' AND is_verified = true;

-- Recreate public_business_statistics view
CREATE VIEW public_business_statistics AS
SELECT 
    COUNT(*) as total_businesses,
    COUNT(CASE WHEN is_verified = true THEN 1 END) as verified_businesses,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_businesses,
    COUNT(CASE WHEN subscription_tier = 'vaka' THEN 1 END) as vaka_businesses,
    COUNT(CASE WHEN subscription_tier = 'mana' THEN 1 END) as mana_businesses,
    COUNT(CASE WHEN subscription_tier = 'moana' THEN 1 END) as moana_businesses
FROM businesses;

RAISE NOTICE 'Recreated views with new schema';

-- ========================================
-- PART 4: VERIFY FINAL SCHEMA
-- ========================================

-- Show final businesses table schema
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'businesses' 
ORDER BY ordinal_position;

SELECT 'All view updates and column drops completed successfully' as status;
