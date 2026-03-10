-- REVISED Migration Based on Schema Check Results
-- Adjusting for existing columns to avoid conflicts

-- Step 1: Safe column additions (only add if they don't exist)
DO $$
BEGIN
    -- Add business operating status column (no conflict)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='businesses' AND column_name='business_operating_status') THEN
        ALTER TABLE businesses ADD COLUMN business_operating_status TEXT;
        RAISE NOTICE 'Added business_operating_status column';
    END IF;

    -- Add business age column (no conflict with existing fields)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='businesses' AND column_name='business_age') THEN
        ALTER TABLE businesses ADD COLUMN business_age TEXT;
        RAISE NOTICE 'Added business_age column';
    END IF;

    -- REVISED: Use existing employee columns instead of new ones
    -- Keep: full_time_employees, part_time_employees (already exist)
    -- Skip: employs_anyone, employs_family_community (use existing instead)

    -- Add business registration status column (no conflict)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='businesses' AND column_name='business_registered') THEN
        ALTER TABLE businesses ADD COLUMN business_registered BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Added business_registered column';
    END IF;

    -- Add sales channels column (no conflict)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='businesses' AND column_name='sales_channels') THEN
        ALTER TABLE businesses ADD COLUMN sales_channels JSONB DEFAULT '[]'::jsonb;
        RAISE NOTICE 'Added sales_channels column';
    END IF;

    -- REVISED: Use existing industry column instead of primary_industry
    -- Skip: primary_industry (use existing industry instead)

    -- Add import/export status column (no conflict)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='businesses' AND column_name='import_export_status') THEN
        ALTER TABLE businesses ADD COLUMN import_export_status TEXT;
        RAISE NOTICE 'Added import_export_status column';
    END IF;

    -- REVISED: Use existing annual_revenue_exact instead of revenue_band
    -- Skip: revenue_band (use existing annual_revenue_exact instead)

    -- Add team_size_band (complements existing employee columns)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='businesses' AND column_name='team_size_band') THEN
        ALTER TABLE businesses ADD COLUMN team_size_band TEXT;
        RAISE NOTICE 'Added team_size_band column';
    END IF;

END $$;

-- Step 2: Add comments for documentation
COMMENT ON COLUMN businesses.business_operating_status IS 'Current operating status of the business (planning, operating, paused, etc.)';
COMMENT ON COLUMN businesses.business_age IS 'How long the business has been operating';
COMMENT ON COLUMN businesses.team_size_band IS 'Current team size category (complements full_time_employees and part_time_employees)';
COMMENT ON COLUMN businesses.business_registered IS 'Whether the business is formally registered';
COMMENT ON COLUMN businesses.sales_channels IS 'Array of sales channels used by the business';
COMMENT ON COLUMN businesses.import_export_status IS 'Import/export activities status';

-- Step 3: Show what we're using vs what we're adding
SELECT 
    'EXISTING' as source,
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name = 'businesses' 
    AND table_schema = 'public'
    AND column_name IN (
        'growth_stage', 'full_time_employees', 'part_time_employees', 
        'annual_revenue_exact', 'primary_market', 'languages_spoken'
    )
UNION ALL
SELECT 
    'NEWLY_ADDED' as source,
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name = 'businesses' 
    AND table_schema = 'public'
    AND column_name IN (
        'business_operating_status', 'business_age', 'team_size_band',
        'business_registered', 'sales_channels', 'import_export_status'
    )
ORDER BY source, column_name;
