-- Business Profile Schema Refactor Migration
-- Renames and cleans up business table fields for consistency
-- Created: 2026-03-18

-- ========================================
-- PART 1: RENAME EXISTING COLUMNS
-- ========================================

-- Rename name to business_name
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'name') THEN
        ALTER TABLE businesses RENAME COLUMN name TO business_name;
        RAISE NOTICE 'Renamed name to business_name';
    ELSE
        RAISE NOTICE 'Column name does not exist, skipping rename';
    END IF;
END $$;

-- Rename contact_name to business_contact_person
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'contact_name') THEN
        ALTER TABLE businesses RENAME COLUMN contact_name TO business_contact_person;
        RAISE NOTICE 'Renamed contact_name to business_contact_person';
    ELSE
        RAISE NOTICE 'Column contact_name does not exist, skipping rename';
    END IF;
END $$;

-- Rename contact_email to business_email
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'contact_email') THEN
        ALTER TABLE businesses RENAME COLUMN contact_email TO business_email;
        RAISE NOTICE 'Renamed contact_email to business_email';
    ELSE
        RAISE NOTICE 'Column contact_email does not exist, skipping rename';
    END IF;
END $$;

-- Rename contact_phone to business_phone
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'contact_phone') THEN
        ALTER TABLE businesses RENAME COLUMN contact_phone TO business_phone;
        RAISE NOTICE 'Renamed contact_phone to business_phone';
    ELSE
        RAISE NOTICE 'Column contact_phone does not exist, skipping rename';
    END IF;
END $$;

-- Rename contact_website to business_website
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'contact_website') THEN
        ALTER TABLE businesses RENAME COLUMN contact_website TO business_website;
        RAISE NOTICE 'Renamed contact_website to business_website';
    ELSE
        RAISE NOTICE 'Column contact_website does not exist, skipping rename';
    END IF;
END $$;

-- Rename business_registered to is_business_registered
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'business_registered') THEN
        ALTER TABLE businesses RENAME COLUMN business_registered TO is_business_registered;
        RAISE NOTICE 'Renamed business_registered to is_business_registered';
    ELSE
        RAISE NOTICE 'Column business_registered does not exist, skipping rename';
    END IF;
END $$;

-- ========================================
-- PART 2: ADD NEW COLUMNS
-- ========================================

-- Add role column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'role') THEN
        ALTER TABLE businesses ADD COLUMN role text;
        RAISE NOTICE 'Added role column';
    ELSE
        RAISE NOTICE 'Role column already exists';
    END IF;
END $$;

-- ========================================
-- PART 3: DROP PROFILE-ONLY COLUMNS
-- ========================================

-- Drop languages_spoken (belongs in profiles table)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'languages_spoken') THEN
        ALTER TABLE businesses DROP COLUMN languages_spoken;
        RAISE NOTICE 'Dropped languages_spoken column';
    ELSE
        RAISE NOTICE 'Column languages_spoken does not exist, skipping drop';
    END IF;
END $$;

-- Drop cultural_identity (belongs in profiles table)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'cultural_identity') THEN
        ALTER TABLE businesses DROP COLUMN cultural_identity;
        RAISE NOTICE 'Dropped cultural_identity column';
    ELSE
        RAISE NOTICE 'Column cultural_identity does not exist, skipping drop';
    END IF;
END $$;

-- Drop sales_channels (not needed)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'sales_channels') THEN
        ALTER TABLE businesses DROP COLUMN sales_channels;
        RAISE NOTICE 'Dropped sales_channels column';
    ELSE
        RAISE NOTICE 'Column sales_channels does not exist, skipping drop';
    END IF;
END $$;

-- ========================================
-- PART 4: DROP PRIVATE/OWNER FIELDS (BELONG IN PROFILES)
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

-- Drop additional_owner_emails
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'additional_owner_emails') THEN
        ALTER TABLE businesses DROP COLUMN additional_owner_emails;
        RAISE NOTICE 'Dropped additional_owner_emails column';
    ELSE
        RAISE NOTICE 'Column additional_owner_emails does not exist, skipping drop';
    END IF;
END $$;

-- ========================================
-- PART 5: CLEAN UP SOCIAL_LINKS (REMOVE WEBSITE)
-- ========================================

-- Update social_links to remove website field from existing data
DO $$
BEGIN
    -- Check if social_links column exists and has data
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'social_links') THEN
        -- Remove website from social_links JSON objects
        UPDATE businesses 
        SET social_links = social_links - 'website' 
        WHERE social_links IS NOT NULL AND social_links ? 'website';
        
        RAISE NOTICE 'Removed website field from social_links';
    ELSE
        RAISE NOTICE 'Column social_links does not exist, skipping cleanup';
    END IF;
END $$;

-- ========================================
-- PART 6: VERIFY CHANGES
-- ========================================

-- Display final column count
DO $$
DECLARE
    column_count integer;
BEGIN
    SELECT COUNT(*) INTO column_count 
    FROM information_schema.columns 
    WHERE table_name = 'businesses';
    
    RAISE NOTICE 'Migration completed. Final businesses table has % columns', column_count;
END $$;

-- Show new schema
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'businesses' 
ORDER BY ordinal_position;
