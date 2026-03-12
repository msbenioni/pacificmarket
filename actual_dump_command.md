-- ACTUAL SUPABASE DUMP COMMAND
-- Use this command with the connection string from .env.local

-- For Windows PowerShell:
pg_dump "postgresql://postgres:MontBlanc3001@db.mnmisprswpuvcojnbip.supabase.co:5432/postgres" > actual_supabase_dump.sql

-- For regular command prompt:
pg_dump -h db.mnmisprswpuvcojnbip.supabase.co -U postgres -p 5432 -d postgres > actual_supabase_dump.sql

-- Alternative via psql:
psql "postgresql://postgres:MontBlanc3001@db.mnmisprswpuvcojnbip.supabase.co:5432/postgres" -c "\copy (SELECT table_name FROM information_schema.tables WHERE table_schema = 'public') TO stdout WITH CSV HEADER" > tables_list.csv
