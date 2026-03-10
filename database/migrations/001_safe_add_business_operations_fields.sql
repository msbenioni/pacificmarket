-- SAFE Database Schema Analysis and Migration
-- This script first checks for existing columns before adding new ones

-- Step 1: Check current businesses table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'businesses' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Step 2: Check for potential conflicts with our proposed columns
SELECT column_name, data_type
FROM information_schema.columns 
WHERE table_name = 'businesses' 
    AND table_schema = 'public'
    AND column_name IN (
        'business_operating_status',
        'business_age', 
        'team_size_band',
        'business_registered',
        'business_stage',
        'employs_anyone',
        'employs_family_community',
        'sales_channels',
        'primary_industry',
        'import_export_status',
        'revenue_band'
    );

-- Step 3: Safe column additions (only add if they don't exist)
-- Note: We use IF NOT EXISTS pattern to avoid errors

DO $$
BEGIN
    -- Add business operating status column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='businesses' AND column_name='business_operating_status') THEN
        ALTER TABLE businesses ADD COLUMN business_operating_status TEXT;
        RAISE NOTICE 'Added business_operating_status column';
    END IF;

    -- Add business age column  
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='businesses' AND column_name='business_age') THEN
        ALTER TABLE businesses ADD COLUMN business_age TEXT;
        RAISE NOTICE 'Added business_age column';
    END IF;

    -- Add team size band column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='businesses' AND column_name='team_size_band') THEN
        ALTER TABLE businesses ADD COLUMN team_size_band TEXT;
        RAISE NOTICE 'Added team_size_band column';
    END IF;

    -- Add business registration status column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='businesses' AND column_name='business_registered') THEN
        ALTER TABLE businesses ADD COLUMN business_registered BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Added business_registered column';
    END IF;

    -- Add employment fields
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='businesses' AND column_name='employs_anyone') THEN
        ALTER TABLE businesses ADD COLUMN employs_anyone BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Added employs_anyone column';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='businesses' AND column_name='employs_family_community') THEN
        ALTER TABLE businesses ADD COLUMN employs_family_community BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Added employs_family_community column';
    END IF;

    -- Add sales channels column (JSON array)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='businesses' AND column_name='sales_channels') THEN
        ALTER TABLE businesses ADD COLUMN sales_channels JSONB DEFAULT '[]'::jsonb;
        RAISE NOTICE 'Added sales_channels column';
    END IF;

    -- Add primary industry column (may be different from main industry)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='businesses' AND column_name='primary_industry') THEN
        ALTER TABLE businesses ADD COLUMN primary_industry TEXT;
        RAISE NOTICE 'Added primary_industry column';
    END IF;

    -- Add business stage column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='businesses' AND column_name='business_stage') THEN
        ALTER TABLE businesses ADD COLUMN business_stage TEXT;
        RAISE NOTICE 'Added business_stage column';
    END IF;

    -- Add import/export status
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='businesses' AND column_name='import_export_status') THEN
        ALTER TABLE businesses ADD COLUMN import_export_status TEXT;
        RAISE NOTICE 'Added import_export_status column';
    END IF;

    -- Add revenue band
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='businesses' AND column_name='revenue_band') THEN
        ALTER TABLE businesses ADD COLUMN revenue_band TEXT;
        RAISE NOTICE 'Added revenue_band column';
    END IF;

END $$;

-- Step 4: Add comments for documentation
COMMENT ON COLUMN businesses.business_operating_status IS 'Current operating status of the business (planning, operating, paused, etc.)';
COMMENT ON COLUMN businesses.business_age IS 'How long the business has been operating';
COMMENT ON COLUMN businesses.team_size_band IS 'Current team size category';
COMMENT ON COLUMN businesses.business_registered IS 'Whether the business is formally registered';
COMMENT ON COLUMN businesses.employs_anyone IS 'Whether the business employs any staff';
COMMENT ON COLUMN businesses.employs_family_community IS 'Whether the business employs family or community members';
COMMENT ON COLUMN businesses.sales_channels IS 'Array of sales channels used by the business';
COMMENT ON COLUMN businesses.primary_industry IS 'Primary industry sector (may differ from main industry field)';
COMMENT ON COLUMN businesses.business_stage IS 'Current business stage (idea, startup, growth, mature)';
COMMENT ON COLUMN businesses.import_export_status IS 'Import/export activities status';
COMMENT ON COLUMN businesses.revenue_band IS 'Revenue range category';

-- Step 5: Final verification
SELECT 
    column_name,
    data_type,
    'ADDED' as status
FROM information_schema.columns 
WHERE table_name = 'businesses' 
    AND table_schema = 'public'
    AND column_name IN (
        'business_operating_status',
        'business_age', 
        'team_size_band',
        'business_registered',
        'business_stage',
        'employs_anyone',
        'employs_family_community',
        'sales_channels',
        'primary_industry',
        'import_export_status',
        'revenue_band'
    )
ORDER BY column_name;
