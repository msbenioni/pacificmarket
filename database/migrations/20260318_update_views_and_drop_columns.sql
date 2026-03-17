-- Update Views and Drop Remaining Columns
-- Created: 2026-03-18

-- ========================================
-- PART 1: UPDATE VIEWS TO USE NEW COLUMN NAMES
-- ========================================

-- Update public_businesses view to use new column names and remove private fields
CREATE OR REPLACE VIEW public_businesses AS
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
    -- Remove private fields: business_owner, business_owner_email
    created_date,
    updated_at
FROM businesses
WHERE status = 'active' AND is_verified = true;

-- Update public_business_statistics view if it exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.views WHERE table_name = 'public_business_statistics') THEN
        EXECUTE 'DROP VIEW IF EXISTS public_business_statistics';
        EXECUTE 'CREATE VIEW public_business_statistics AS
        SELECT 
            COUNT(*) as total_businesses,
            COUNT(CASE WHEN is_verified = true THEN 1 END) as verified_businesses,
            COUNT(CASE WHEN status = ''active'' THEN 1 END) as active_businesses,
            COUNT(CASE WHEN subscription_tier = ''vaka'' THEN 1 END) as vaka_businesses,
            COUNT(CASE WHEN subscription_tier = ''mana'' THEN 1 END) as mana_businesses,
            COUNT(CASE WHEN subscription_tier = ''moana'' THEN 1 END) as moana_businesses
        FROM businesses';
        
        RAISE NOTICE 'Updated public_business_statistics view';
    END IF;
END $$;

-- ========================================
-- PART 2: NOW DROP THE PROBLEMATIC COLUMNS
-- ========================================

-- Drop business_owner (now that views are updated)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'business_owner') THEN
        ALTER TABLE businesses DROP COLUMN business_owner;
        RAISE NOTICE 'Dropped business_owner column';
    ELSE
        RAISE NOTICE 'Column business_owner does not exist, skipping drop';
    END IF;
END $$;

-- Drop business_owner_email (now that views are updated)
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
-- PART 3: VERIFY FINAL SCHEMA
-- ========================================

-- Show final businesses table schema
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'businesses' 
ORDER BY ordinal_position;

-- Show final public_businesses view schema
SELECT 
    column_name, 
    data_type
FROM information_schema.columns 
WHERE table_name = 'public_businesses' 
ORDER BY ordinal_position;

SELECT 'View updates and column drops completed successfully' as status;
