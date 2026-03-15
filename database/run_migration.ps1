# Database Migration Execution Script (PowerShell)
# Purpose: Execute the database migration using Supabase connection
# Date: 2026-03-15

# Database connection details from .env.local
$DB_HOST = "db.mnmisjprswpuvcojnbip.supabase.co"
$DB_PORT = "5432"
$DB_NAME = "postgres"
$DB_USER = "postgres"
$DB_PASSWORD = "MontBlanc3001"

# Migration file path
$MIGRATION_FILE = "database\migration_2026_03_15.sql"

Write-Host "🚀 Starting Database Migration..." -ForegroundColor Green
Write-Host "📅 Date: $(Get-Date)" -ForegroundColor Blue
Write-Host "🗄️  Database: ${DB_HOST}:${DB_PORT}/${DB_NAME}" -ForegroundColor Blue
Write-Host "📁 Migration file: ${MIGRATION_FILE}" -ForegroundColor Blue
Write-Host ""

# Check if migration file exists
if (-not (Test-Path $MIGRATION_FILE)) {
    Write-Host "❌ Migration file not found: $MIGRATION_FILE" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Migration file found" -ForegroundColor Green

# Set PGPASSWORD environment variable
$env:PGPASSWORD = $DB_PASSWORD

# Execute migration
Write-Host "🔄 Executing migration..." -ForegroundColor Yellow
try {
    & psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f $MIGRATION_FILE
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "🎉 Migration completed successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📋 Next steps:" -ForegroundColor Cyan
        Write-Host "1. Test all forms (FounderInsightsForm, BusinessInsightsAccordion)" -ForegroundColor White
        Write-Host "2. Verify data integrity in the database" -ForegroundColor White
        Write-Host "3. Test user workflows end-to-end" -ForegroundColor White
        Write-Host "4. Remove backup tables when confident:" -ForegroundColor Yellow
        Write-Host "   DROP TABLE founder_insights_backup;" -ForegroundColor Gray
        Write-Host "   DROP TABLE business_insights_backup;" -ForegroundColor Gray
    } else {
        Write-Host "❌ psql command failed with exit code $LASTEXITCODE" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host ""
    Write-Host "❌ Migration failed!" -ForegroundColor Red
    Write-Host "🔄 Please check the error messages above" -ForegroundColor Yellow
    Write-Host "💡 You can restore from backup tables if needed:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "   -- Restore founder_insights:" -ForegroundColor Gray
    Write-Host "   TRUNCATE TABLE founder_insights;" -ForegroundColor Gray
    Write-Host "   INSERT INTO founder_insights SELECT * FROM founder_insights_backup;" -ForegroundColor Gray
    Write-Host ""
    Write-Host "   -- Restore business_insights:" -ForegroundColor Gray
    Write-Host "   TRUNCATE TABLE business_insights;" -ForegroundColor Gray
    Write-Host "   INSERT INTO business_insights SELECT * FROM business_insights_backup;" -ForegroundColor Gray
    exit 1
} finally {
    # Clear environment variable
    Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue
}
