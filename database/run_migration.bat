@echo off
echo 🚀 Starting Database Migration...
echo 📅 Date: %date%
echo 🗄️  Database: db.mnmisjprswpuvcojnbip.supabase.co:5432/postgres
echo 📁 Migration file: migration_2026_03_15.sql
echo.

REM Check if migration file exists
if not exist "migration_2026_03_15.sql" (
    echo ❌ Migration file not found: migration_2026_03_15.sql
    pause
    exit /b 1
)

echo ✅ Migration file found

REM Set PGPASSWORD environment variable
set PGPASSWORD=MontBlanc3001

REM Execute migration
echo 🔄 Executing migration...
psql -h db.mnmisjprswpuvcojnbip.supabase.co -p 5432 -U postgres -d postgres -f migration_2026_03_15.sql

REM Check execution result
if %ERRORLEVEL% EQU 0 (
    echo.
    echo 🎉 Migration completed successfully!
    echo.
    echo 📋 Next steps:
    echo 1. Test all forms (FounderInsightsForm, BusinessInsightsAccordion)
    echo 2. Verify data integrity in the database
    echo 3. Test user workflows end-to-end
    echo 4. Remove backup tables when confident:
    echo    DROP TABLE founder_insights_backup;
    echo    DROP TABLE business_insights_backup;
) else (
    echo.
    echo ❌ Migration failed!
    echo 🔄 Please check the error messages above
    echo 💡 You can restore from backup tables if needed:
    echo.
    echo    -- Restore founder_insights:
    echo    TRUNCATE TABLE founder_insights;
    echo    INSERT INTO founder_insights SELECT * FROM founder_insights_backup;
    echo.
    echo    -- Restore business_insights:
    echo    TRUNCATE TABLE business_insights;
    echo    INSERT INTO business_insights SELECT * FROM business_insights_backup;
    pause
    exit /b 1
)

REM Clear environment variable
set PGPASSWORD=

echo.
echo ✅ Migration process complete!
pause
