# PowerShell Database Dump Script
Write-Host "Database Dump for Pacific Market" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

# Table structures for businesses
Write-Host "`n--- Businesses Table Structure ---" -ForegroundColor Yellow
try {
    $result = & psql "postgresql://postgres:MontBlanc3001@db.mnmisjprswpuvcojnbip.supabase.co:5432/postgres" -c "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'businesses' ORDER BY ordinal_position;"
    $result
} catch {
    Write-Host "Error getting businesses table structure: $_" -ForegroundColor Red
}

# Sample businesses data
Write-Host "`n--- Sample Businesses Data ---" -ForegroundColor Yellow
try {
    $result = & psql "postgresql://postgres:MontBlanc3001@db.mnmisjprswpuvcojnbip.supabase.co:5432/postgres" -c "SELECT id, name, email, status, subscription_tier, verified FROM businesses LIMIT 3;"
    $result
} catch {
    Write-Host "Error getting sample businesses data: $_" -ForegroundColor Red
}

# Row counts
Write-Host "`n--- Table Row Counts ---" -ForegroundColor Yellow
try {
    $result = & psql "postgresql://postgres:MontBlanc3001@db.mnmisjprswpuvcojnbip.supabase.co:5432/postgres" -c "SELECT relname as table_name, n_tup_ins as row_count FROM pg_stat_user_tables WHERE schemaname = 'public' ORDER BY relname;"
    $result
} catch {
    Write-Host "Error getting row counts: $_" -ForegroundColor Red
}

Write-Host "`nDatabase dump completed!`n" -ForegroundColor Green
