# Database Migration Execution Script (PowerShell)
# Purpose: Execute the email templates removal migration using Supabase connection
# Date: 2026-03-29

# Database connection details from .env.local
$DB_HOST = "db.mnmisjprswpuvcojnbip.supabase.co"
$DB_PORT = "5432"
$DB_NAME = "postgres"
$DB_USER = "postgres"
$DB_PASSWORD = "MontBlanc3001"

# Migration file path
$MIGRATION_FILE = "supabase\migrations\20260329_remove_email_templates.sql"

Write-Host "🚀 Starting Email Templates Removal Migration..." -ForegroundColor Green
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
        Write-Host "📋 Changes made:" -ForegroundColor Cyan
        Write-Host "1. Removed RLS policies for email_templates table" -ForegroundColor White
        Write-Host "2. Dropped email_templates table (all template data deleted)" -ForegroundColor White
        Write-Host "3. Email template feature completely removed from database" -ForegroundColor White
    }
    else {
        Write-Host "❌ psql command failed with exit code $LASTEXITCODE" -ForegroundColor Red
        exit 1
    }
}
catch {
    Write-Host ""
    Write-Host "❌ Migration failed!" -ForegroundColor Red
    Write-Host "🔄 Please check the error messages above" -ForegroundColor Yellow
    exit 1
}
finally {
    # Clear environment variable
    Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue
}
