-- Check existing businesses table schema before adding new columns
-- This will help us avoid duplicate column names

-- Get current table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'businesses' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check for any similar column names that might conflict
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'businesses' 
    AND table_schema = 'public'
    AND (
        column_name LIKE '%operating%' 
        OR column_name LIKE '%age%'
        OR column_name LIKE '%team%'
        OR column_name LIKE '%size%'
        OR column_name LIKE '%register%'
        OR column_name LIKE '%employ%'
        OR column_name LIKE '%sales%'
        OR column_name LIKE '%channel%'
        OR column_name LIKE '%primary%'
        OR column_name LIKE '%stage%'
        OR column_name LIKE '%import%'
        OR column_name LIKE '%export%'
        OR column_name LIKE '%revenue%'
    );

-- Check if any of our proposed columns already exist
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
