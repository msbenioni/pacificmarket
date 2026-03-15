@echo off
echo Setting up database connection...
set PGPASSWORD=MontBlanc3001
echo Running migration...
psql -h db.mnmisjprswpuvcojnbip.supabase.co -p 5432 -U postgres -d postgres -f migration_2026_03_15.sql
set PGPASSWORD=
echo Migration complete!
pause
