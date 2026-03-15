@echo off
echo Running corrected migration...
set PGPASSWORD=MontBlanc3001
psql -h db.mnmisjprswpuvcojnbip.supabase.co -p 5432 -U postgres -d postgres -f migration_fixed.sql
set PGPASSWORD=
echo Migration complete!
pause
