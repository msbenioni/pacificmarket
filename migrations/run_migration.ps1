# Migration runner script for business_insights column fixes
# Uses environment variables for database connection

Write-Host "Starting business_insights column migration..." -ForegroundColor Green

# Check if required environment variables are set
if ($env:DATABASE_URL) {
    $DbUrl = $env:DATABASE_URL
} elseif ($env:SUPABASE_DB_URL) {
    $DbUrl = $env:SUPABASE_DB_URL
} else {
    Write-Host "Error: DATABASE_URL or SUPABASE_DB_URL environment variable not set" -ForegroundColor Red
    Write-Host "Please set your database connection string as an environment variable" -ForegroundColor Yellow
    exit 1
}

Write-Host "Using database URL: $($DbUrl.Substring(0, [Math]::Min(50, $DbUrl.Length)))..." # Show first 50 chars for verification

# Check if psql is available
try {
    $null = Get-Command psql -ErrorAction Stop
} catch {
    Write-Host "Error: psql command not found. Please ensure PostgreSQL client tools are installed." -ForegroundColor Red
    Write-Host "Download from: https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    exit 1
}

# Run the migration
Write-Host "Executing SQL migration..." -ForegroundColor Blue

try {
    psql $DbUrl -f migrations/fix_business_insights_columns.sql
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Migration completed successfully!" -ForegroundColor Green
        Write-Host "The following columns have been renamed:" -ForegroundColor Cyan
        Write-Host "  - top_challenges → top_challenges_array" -ForegroundColor White
        Write-Host "  - community_impact_areas → community_impact_areas_array" -ForegroundColor White
        Write-Host "  - support_needed_next → support_needed_next_array" -ForegroundColor White
        Write-Host "  - current_support_sources → current_support_sources_array" -ForegroundColor White
        Write-Host "  - business_registered → is_business_registered" -ForegroundColor White
    } else {
        Write-Host "❌ Migration failed!" -ForegroundColor Red
        Write-Host "Please check the error messages above" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "❌ Migration failed with error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
