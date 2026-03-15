@echo off
echo Adding business acquisition interest field to database...
set PGPASSWORD=MontBlanc3001
psql -h db.mnmisjprswpuvcojnbip.supabase.co -p 5432 -U postgres -d postgres -f add_business_acquisition_field.sql
set PGPASSWORD=
echo Migration complete!
pause
