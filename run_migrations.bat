@echo off
echo Running Supabase migrations...

echo Running financial fields migration...
psql "postgresql://postgres:MontBlanc3001@db.mnmisjprswpuvcojnbip.supabase.co:5432/postgres" -f add_financial_fields_to_insights.sql

echo Running missing fields migration...
psql "postgresql://postgres:MontBlanc3001@db.mnmisjprswpuvcojnbip.supabase.co:5432/postgres" -f add_missing_founder_insights_fields.sql

echo Migration complete!
pause
