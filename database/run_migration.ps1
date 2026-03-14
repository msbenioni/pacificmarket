# ================================================================
# PACIFIC MARKET DATABASE MIGRATION SCRIPT
# Uses your specific Supabase connection
# ================================================================

param(
    [Parameter(Mandatory=$false)]
    [string]$Action = "migrate",  # Options: backup, migrate, verify, rollback
    [Parameter(Mandatory=$false)]
    [string]$SchemaFile = "pacific_market_complete_schema.sql",
    [Parameter(Mandatory=$false)]
    [string]$MigrationFile = "apply_clean_schema.sql"
)

# Connection details from your .env.local
$ConnectionString = "postgresql://postgres:MontBlanc3001@db.mnmisjprswpuvcojnbip.supabase.co:5432/postgres"
$ProjectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)

Write-Host "Pacific Market Database Migration" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green
Write-Host "Action: $Action" -ForegroundColor Cyan
Write-Host "Project: $ProjectRoot" -ForegroundColor Cyan
Write-Host "" -ForegroundColor White

# Function to run SQL commands
function Invoke-SQL {
    param([string]$SQL, [string]$Description)
    
    Write-Host "Executing: $Description" -ForegroundColor Yellow
    
    try {
        $result = & psql $ConnectionString -c $SQL
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Success: $Description" -ForegroundColor Green
            return $result
        } else {
            Write-Host "❌ Error: $Description" -ForegroundColor Red
            throw "SQL execution failed"
        }
    } catch {
        Write-Host "❌ Exception: $Description" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        throw
    }
}

# Function to run SQL file
function Invoke-SQLFile {
    param([string]$FilePath, [string]$Description)
    
    Write-Host "Executing: $Description" -ForegroundColor Yellow
    
    if (-not (Test-Path $FilePath)) {
        Write-Host "❌ Error: File not found - $FilePath" -ForegroundColor Red
        throw "SQL file not found: $FilePath"
    }
    
    try {
        $result = & psql $ConnectionString -f $FilePath
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Success: $Description" -ForegroundColor Green
            return $result
        } else {
            Write-Host "❌ Error: $Description" -ForegroundColor Red
            throw "SQL file execution failed"
        }
    } catch {
        Write-Host "❌ Exception: $Description" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        throw
    }
}

# Migration actions
switch ($Action.ToLower()) {
    
    "backup" {
        Write-Host "Creating database backups..." -ForegroundColor Cyan
        
        $SQL = @"
-- Create backup tables (handle missing tables gracefully)
DO $$
BEGIN
    -- Backup profiles
    BEGIN
        CREATE TABLE backup_profiles AS SELECT * FROM profiles;
        RAISE NOTICE '✅ Backed up profiles table';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'ℹ️ Profiles table not found, skipping backup';
    END;
    
    -- Backup businesses
    BEGIN
        CREATE TABLE backup_businesses AS SELECT * FROM businesses;
        RAISE NOTICE '✅ Backed up businesses table';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'ℹ️ Businesses table not found, skipping backup';
    END;
    
    -- Backup business_insights
    BEGIN
        CREATE TABLE backup_business_insights AS SELECT * FROM business_insights;
        RAISE NOTICE '✅ Backed up business_insights table';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'ℹ️ Business_insights table not found, skipping backup';
    END;
    
    -- Backup founder_insights
    BEGIN
        CREATE TABLE backup_founder_insights AS SELECT * FROM founder_insights;
        RAISE NOTICE '✅ Backed up founder_insights table';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'ℹ️ Founder_insights table not found, skipping backup';
    END;
    
    -- Backup notifications (may not exist yet)
    BEGIN
        CREATE TABLE backup_notifications AS SELECT * FROM notifications;
        RAISE NOTICE '✅ Backed up notifications table';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'ℹ️ Notifications table not found, skipping backup';
    END;
END $$;

-- Count records in backup tables
SELECT 'backup_profiles' as table_name, COUNT(*) as record_count FROM backup_profiles
UNION ALL
SELECT 'backup_businesses' as table_name, COUNT(*) as record_count FROM backup_businesses
UNION ALL
SELECT 'backup_business_insights' as table_name, COUNT(*) as record_count FROM backup_business_insights
UNION ALL
SELECT 'backup_founder_insights' as table_name, COUNT(*) as record_count FROM backup_founder_insights
UNION ALL
SELECT 'backup_notifications' as table_name, COUNT(*) as record_count FROM backup_notifications;
"@
        
        Invoke-SQL -SQL $SQL -Description "Creating backup tables and counting records"
    }
    
    "migrate" {
        Write-Host "Starting full migration process..." -ForegroundColor Cyan
        
        $SchemaPath = Join-Path $ProjectRoot "database\$SchemaFile"
        $MigrationPath = Join-Path $ProjectRoot "database\$MigrationFile"
        
        Write-Host "Schema file: $SchemaPath" -ForegroundColor White
        Write-Host "Migration file: $MigrationPath" -ForegroundColor White
        
        # Step 1: Apply clean schema
        Write-Host "`nStep 1: Applying clean database schema..." -ForegroundColor Yellow
        Invoke-SQLFile -FilePath $SchemaPath -Description "Applying clean schema"
        
        # Step 2: Run migration script
        Write-Host "`nStep 2: Running migration script..." -ForegroundColor Yellow
        Invoke-SQLFile -FilePath $MigrationPath -Description "Running data migration"
        
        Write-Host "`n✅ Migration completed successfully!" -ForegroundColor Green
    }
    
    "verify" {
        Write-Host "Verifying database integrity..." -ForegroundColor Cyan
        
        $VerifyPath = Join-Path $ProjectRoot "database\verify_database.sql"
        
        Write-Host "Verification file: $VerifyPath" -ForegroundColor White
        
        try {
            $result = & psql $ConnectionString -f $VerifyPath
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ Verification completed successfully!" -ForegroundColor Green
                Write-Host "" -ForegroundColor White
                Write-Host $result -ForegroundColor Cyan
            } else {
                Write-Host "❌ Verification failed" -ForegroundColor Red
                throw "SQL file execution failed"
            }
        } catch {
            Write-Host "❌ Exception: Verification failed" -ForegroundColor Red
            Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
            throw
        }
    }
    
    "rollback" {
        Write-Host "Rolling back to backup tables..." -ForegroundColor Cyan
        
        $SQL = @"
-- WARNING: This will replace current data with backup data
-- Make sure you have a recent backup before proceeding!

-- Drop current tables
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS founder_insights CASCADE;
DROP TABLE IF EXISTS business_insights CASCADE;
DROP TABLE IF EXISTS businesses CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Restore from backup
CREATE TABLE profiles AS SELECT * FROM backup_profiles;
CREATE TABLE businesses AS SELECT * FROM backup_businesses;
CREATE TABLE business_insights AS SELECT * FROM backup_business_insights;
CREATE TABLE founder_insights AS SELECT * FROM backup_founder_insights;
CREATE TABLE notifications AS SELECT * FROM backup_notifications;

-- Verify restoration
SELECT 'profiles' as table_name, COUNT(*) as record_count FROM profiles
UNION ALL
SELECT 'businesses' as table_name, COUNT(*) as record_count FROM businesses
UNION ALL
SELECT 'business_insights' as table_name, COUNT(*) as record_count FROM business_insights
UNION ALL
SELECT 'founder_insights' as table_name, COUNT(*) as record_count FROM founder_insights
UNION ALL
SELECT 'notifications' as table_name, COUNT(*) as record_count FROM notifications;
"@
        
        Invoke-SQL -SQL $SQL -Description "Rolling back to backup tables"
    }
    
    default {
        Write-Host "❌ Unknown action: $Action" -ForegroundColor Red
        Write-Host "Available actions:" -ForegroundColor White
        Write-Host "  backup  - Create backup tables" -ForegroundColor White
        Write-Host "  migrate - Run full migration" -ForegroundColor White
        Write-Host "  verify  - Verify database integrity" -ForegroundColor White
        Write-Host "  rollback - Rollback to backup tables" -ForegroundColor White
        exit 1
    }
}

Write-Host "`nMigration completed successfully!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green
