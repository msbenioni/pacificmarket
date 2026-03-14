# Database Check Script for PowerShell
# Use this to check the current database state

$connectionString = "postgresql://postgres:MontBlanc3001@db.mnmisjprswpuvcojnbip.supabase.co:5432/postgres"

Write-Host "Checking business_insights table structure..." -ForegroundColor Green

# Check current columns
$columnsQuery = @"
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'business_insights' 
AND table_schema = 'public'
ORDER BY ordinal_position;
"@

# Check record count
$countQuery = @"
SELECT 
    COUNT(*) as total_records,
    MIN(created_date) as earliest_record,
    MAX(created_date) as latest_record
FROM business_insights;
"@

# Show sample data
$sampleQuery = @"
SELECT 
    business_id,
    user_id, 
    snapshot_year,
    business_stage,
    team_size_band,
    revenue_band,
    business_operating_status,
    created_date
FROM business_insights 
LIMIT 5;
"@

Write-Host "Running columns check..." -ForegroundColor Yellow
& psql $connectionString -c $columnsQuery

Write-Host "`nRunning record count check..." -ForegroundColor Yellow
& psql $connectionString -c $countQuery

Write-Host "`nRunning sample data check..." -ForegroundColor Yellow
& psql $connectionString -c $sampleQuery

Write-Host "`nDatabase check complete!" -ForegroundColor Green
