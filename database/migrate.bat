@echo off
echo Pacific Market Database Migration
echo ==================================
echo.
echo This script will migrate your database to the new clean schema
echo Using your Supabase connection from .env.local
echo.
pause

echo Step 1: Creating backup...
powershell -ExecutionPolicy Bypass -File "run_migration.ps1" -Action "backup"

echo.
echo Step 2: Running migration...
powershell -ExecutionPolicy Bypass -File "run_migration.ps1" -Action "migrate"

echo.
echo Step 3: Verifying migration...
powershell -ExecutionPolicy Bypass -File "run_migration.ps1" -Action "verify"

echo.
echo ==================================
echo Migration completed!
echo ==================================
pause
