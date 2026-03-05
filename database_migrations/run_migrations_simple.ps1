# Simple Database Migration Runner for Windows PowerShell
# Execute migrations for Pacific Market private fields

Write-Host "🚀 Starting Pacific Market Database Migrations..." -ForegroundColor Green
Write-Host "⚠️  Make sure you have a database backup before proceeding!" -ForegroundColor Yellow

# Set your database connection details
# Update these values with your actual database connection
$env:PGHOST = "localhost"
$env:PGPORT = "5432"
$env:PGDATABASE = "pacific_market"
$env:PGUSER = "postgres"
$env:PGPASSWORD = "your_password"

# Check if psql is available
try {
    $psqlVersion = & psql --version 2>$null
    Write-Host "✅ Found psql: $psqlVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: psql is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install PostgreSQL and ensure psql is in your PATH" -ForegroundColor Yellow
    exit 1
}

# Function to execute SQL file
function Execute-SqlFile {
    param(
        [string]$SqlFile,
        [string]$Description
    )
    
    Write-Host "📝 Executing: $Description" -ForegroundColor Cyan
    Write-Host "📄 File: $SqlFile" -ForegroundColor Cyan
    
    try {
        & psql -f $SqlFile
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Success: $Description" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ Failed: $Description" -ForegroundColor Red
            Write-Host "⚠️  Please check the error above and fix manually" -ForegroundColor Yellow
            return $false
        }
    } catch {
        Write-Host "❌ Exception executing: $Description" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Execute migrations in order
Write-Host ""
Write-Host "🔄 Step 1: Adding private fields to tables..." -ForegroundColor Blue
$step1Success = Execute-SqlFile "add_private_fields.sql" "Add private fields to businesses and profiles tables"

if ($step1Success) {
    Write-Host ""
    Write-Host "🔄 Step 2: Creating analytics views..." -ForegroundColor Blue
    $step2Success = Execute-SqlFile "create_analytics_views.sql" "Create analytics views and functions"
    
    if ($step2Success) {
        Write-Host ""
        Write-Host "✅ All migrations completed successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📊 Migration Summary:" -ForegroundColor Cyan
        Write-Host "  • Added 11 private fields to businesses table" -ForegroundColor White
        Write-Host "  • Added 10 private fields to profiles table" -ForegroundColor White
        Write-Host "  • Created analytics views for safe data access" -ForegroundColor White
        Write-Host "  • Set up Row Level Security (RLS) policies" -ForegroundColor White
        Write-Host "  • Created helpful analytics functions" -ForegroundColor White
        Write-Host ""
        Write-Host "🔐 Privacy Protection:" -ForegroundColor Yellow
        Write-Host "  • Private fields only accessible to owners and admins" -ForegroundColor White
        Write-Host "  • Public views exclude all private data" -ForegroundColor White
        Write-Host "  • Analytics functions require admin privileges" -ForegroundColor White
        Write-Host ""
        Write-Host "🎯 Next Steps:" -ForegroundColor Cyan
        Write-Host "  1. Test the application with new profile fields" -ForegroundColor White
        Write-Host "  2. Verify privacy controls are working" -ForegroundColor White
        Write-Host "  3. Update application code to use new fields" -ForegroundColor White
        Write-Host ""
        Write-Host "⚡ To rollback: psql -f remove_private_fields.sql" -ForegroundColor Yellow
    } else {
        Write-Host ""
        Write-Host "⚠️  Step 2 failed, but Step 1 was completed" -ForegroundColor Yellow
        Write-Host "🔧 You may need to manually check the views and functions" -ForegroundColor Yellow
        Write-Host "⚡ To rollback: psql -f remove_private_fields.sql" -ForegroundColor Yellow
    }
} else {
    Write-Host ""
    Write-Host "❌ Migration failed at Step 1" -ForegroundColor Red
    Write-Host "🔧 Please fix the errors above and retry" -ForegroundColor Yellow
    Write-Host "⚡ To rollback: psql -f remove_private_fields.sql" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🏁 Migration process completed!" -ForegroundColor Green
