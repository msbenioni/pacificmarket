@echo off
echo Running comprehensive database dump for Pacific Market...
echo.
echo This will dump:
echo - All table structures and schemas
echo - All constraints and indexes  
echo - All RLS policies
echo - All triggers
echo - All functions
echo - Sample data from each table
echo - Row counts and database info
echo.

psql "postgresql://postgres:MontBlanc3001@db.mnmisjprswpuvcojnbip.supabase.co:5432/postgres" -f "database_complete_dump.sql"

echo.
echo Database dump completed!
echo Check the output above for the complete database structure.
echo.
