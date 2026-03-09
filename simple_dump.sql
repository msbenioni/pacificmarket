-- SIMPLE DATABASE DUMP
-- Basic table structures and sample data

-- Table structures
SELECT table_name, column_name, data_type, is_nullable FROM information_schema.columns WHERE table_schema = 'public' ORDER BY table_name, ordinal_position;

-- Businesses table sample
SELECT * FROM businesses LIMIT 2;

-- Profiles table sample  
SELECT * FROM profiles LIMIT 2;

-- Claim requests sample
SELECT * FROM claim_requests LIMIT 2;

-- Row counts
SELECT relname as table_name, n_tup_ins as row_count FROM pg_stat_user_tables WHERE schemaname = 'public' ORDER BY relname;
