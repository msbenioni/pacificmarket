# Generate Database Dump Script
$timestamp = Get-Date -Format "yyyy-MM-ddTHH-mm-ssZ"
$dumpFile = "database_dumps\full_db_dump_$timestamp.dump"
$schemaFile = "database_dumps\schema_$timestamp.csv"
$statsFile = "database_dumps\table_stats_$timestamp.txt"

Write-Host "Generating full database dump..."
Write-Host "Timestamp: $timestamp"

# Create database_dumps directory if it doesn't exist
if (-not (Test-Path "database_dumps")) {
    New-Item -ItemType Directory -Path "database_dumps"
}

# Database connection parameters
$env:PGPASSWORD = "MontBlanc3001"
$dbHost = "db.mnmisjprswpuvcojnbip.supabase.co"
$dbPort = "5432"
$dbName = "postgres"
$dbUser = "postgres"

try {
    # Generate full database dump
    Write-Host "Dumping database schema and data..."
    $dumpResult = & pg_dump --host=$dbHost --port=$dbPort --username=$dbUser --dbname=$dbName --verbose --format=custom --file=$dumpFile 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Database dump completed: $dumpFile"
    } else {
        Write-Host "❌ Database dump failed: $dumpResult"
    }

    # Generate schema information
    Write-Host "Dumping database schema..."
    $schemaQuery = @"
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
ORDER BY table_name, ordinal_position
"@
    
    $schemaResult = & psql --host=$dbHost --port=$dbPort --username=$dbUser --dbname=$dbName -c "\copy ($schemaQuery) to '$schemaFile' WITH CSV HEADER" 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Schema dump completed: $schemaFile"
    } else {
        Write-Host "❌ Schema dump failed: $schemaResult"
    }

    # Generate table statistics
    Write-Host "Dumping table statistics..."
    $statsQuery = @"
SELECT 
    schemaname,
    tablename,
    n_tup_ins as inserts,
    n_tup_upd as updates,
    n_tup_del as deletes,
    n_live_tup as total_rows,
    last_vacuum,
    last_autovacuum,
    last_analyze,
    last_autoanalyze
FROM pg_stat_user_tables 
ORDER BY tablename
"@
    
    $statsResult = & psql --host=$dbHost --port=$dbPort --username=$dbUser --dbname=$dbName -c $statsQuery > $statsFile 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Table statistics completed: $statsFile"
    } else {
        Write-Host "❌ Table statistics failed: $statsResult"
    }

} catch {
    Write-Host "❌ Error during database dump: $_"
} finally {
    # Clear password from environment
    Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue
}

Write-Host ""
Write-Host "Database dump process completed!"
Write-Host "Files created:"
Write-Host "- $dumpFile (PostgreSQL custom format)"
Write-Host "- $schemaFile (Schema information)"
Write-Host "- $statsFile (Table statistics)"
