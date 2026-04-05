# Supabase Migration Script (PowerShell) - Fixed Encoding
# Runs SQL migrations using Supabase connection string

param(
    [switch]$Force = $false
)

# Load environment variables
$EnvFile = ".env.local"
if (Test-Path $EnvFile) {
    Get-Content $EnvFile | ForEach-Object {
        if ($_ -match '^([^=]+)=(.*)$') {
            [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2])
        }
    }
    Write-Host "[OK] Environment variables loaded from $EnvFile" -ForegroundColor Green
} else {
    Write-Host "[WARN] .env.local file not found" -ForegroundColor Yellow
}

function Test-Connection {
    param([string]$ConnectionString)
    
    try {
        # Parse connection string
        $Uri = [System.Uri]$ConnectionString.Replace('postgresql://', 'postgres://')
        $DbHost = $Uri.Host
        $DbPort = $Uri.Port
        if (-not $DbPort) { $DbPort = 5432 }
        $Database = $Uri.AbsolutePath.TrimStart('/')
        $User = $Uri.UserInfo.Split(':')[0]
        $Password = $Uri.UserInfo.Split(':')[1]
        
        Write-Host "[INFO] Testing connection to $DbHost`:$DbPort/$Database" -ForegroundColor Blue
        
        # Test connection with psql
        $null = & psql -h $DbHost -p $DbPort -U $User -d $Database -c "SELECT 1;" -t 2>$null
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[OK] Database connection successful" -ForegroundColor Green
            return @{
                Host = $DbHost
                Port = $DbPort
                Database = $Database
                User = $User
                Password = $Password
            }
        } else {
            throw "Connection test failed"
        }
    } catch {
        Write-Host "[ERROR] Database connection failed" -ForegroundColor Red
        throw
    }
}

function Invoke-SQLFile {
    param(
        [string]$FilePath,
        [hashtable]$ConnectionInfo
    )
    
    Write-Host "[INFO] Running migration: $(Split-Path $FilePath -Leaf)" -ForegroundColor Blue
    
    $env:PGPASSWORD = $ConnectionInfo.Password
    
    $null = & psql -h $ConnectionInfo.Host -p $ConnectionInfo.Port -U $ConnectionInfo.User -d $ConnectionInfo.Database -f $FilePath
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Migration completed: $(Split-Path $FilePath -Leaf)" -ForegroundColor Green
    } else {
        Write-Host "[ERROR] Migration failed: $(Split-Path $FilePath -Leaf)" -ForegroundColor Red
        throw "Migration failed for $FilePath"
    }
}

function Test-Migration {
    param([hashtable]$ConnectionInfo)
    
    Write-Host "[INFO] Verifying migration..." -ForegroundColor Blue
    
    $env:PGPASSWORD = $ConnectionInfo.Password
    
    # Check if tables exist
    $TablesQuery = @"
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'discovered_businesses',
    'daily_reports', 
    'quality_alerts',
    'email_groups',
    'email_campaigns',
    'error_logs',
    'scheduler_config'
);
"@
    
    $Tables = & psql -h $ConnectionInfo.Host -p $ConnectionInfo.Port -U $ConnectionInfo.User -d $ConnectionInfo.Database -c $TablesQuery -t
    
    Write-Host "[OK] Found $($Tables.Count) expected tables:" -ForegroundColor Green
    $Tables | ForEach-Object { Write-Host "   - $_" -ForegroundColor Gray }
    
    # Test scheduler config
    $ConfigTest = & psql -h $ConnectionInfo.Host -p $ConnectionInfo.Port -U $ConnectionInfo.User -d $ConnectionInfo.Database -c "SELECT COUNT(*) FROM scheduler_config;" -t
    
    Write-Host "[OK] Scheduler config accessible: $ConfigTest records" -ForegroundColor Green
}

# Main execution
try {
    Write-Host "[START] Starting Supabase migration..." -ForegroundColor Cyan
    
    # Check for connection string
    $ConnectionString = $env:SUPABASE_DB_CONNECTION_STRING
    
    if (-not $ConnectionString) {
        Write-Host "[ERROR] SUPABASE_DB_CONNECTION_STRING not found in environment variables" -ForegroundColor Red
        Write-Host "Please ensure .env.local contains the connection string" -ForegroundColor Yellow
        exit 1
    }
    
    Write-Host "[OK] Connection string found" -ForegroundColor Green
    
    # Test connection
    $ConnectionInfo = Test-Connection -ConnectionString $ConnectionString
    
    # Run migrations
    $MigrationDir = "supabase/migrations"
    
    $BaseTablesFile = Join-Path $MigrationDir "20260405_client_management_fixed.sql"
    $RLSPoliciesFile = Join-Path $MigrationDir "20260405_rls_policies_simple.sql"
    
    if (-not (Test-Path $BaseTablesFile)) {
        throw "Migration file not found: $BaseTablesFile"
    }
    
    if (-not (Test-Path $RLSPoliciesFile)) {
        throw "Migration file not found: $RLSPoliciesFile"
    }
    
    # Run base tables migration
    Invoke-SQLFile -FilePath $BaseTablesFile -ConnectionInfo $ConnectionInfo
    
    # Run RLS policies migration
    Invoke-SQLFile -FilePath $RLSPoliciesFile -ConnectionInfo $ConnectionInfo
    
    # Verify migration
    Test-Migration -ConnectionInfo $ConnectionInfo
    
    Write-Host "" -ForegroundColor White
    Write-Host "[SUCCESS] Migration completed successfully!" -ForegroundColor Green
    Write-Host "" -ForegroundColor White
    Write-Host "[NEXT] Next steps:" -ForegroundColor Cyan
    Write-Host "1. Start development server: npm run dev" -ForegroundColor Gray
    Write-Host "2. Visit: http://localhost:3000/AdminDashboard" -ForegroundColor Gray
    Write-Host "3. Test the discovery workflow" -ForegroundColor Gray
    Write-Host "" -ForegroundColor White
    Write-Host "[SECURITY] For production security, run:" -ForegroundColor Yellow
    Write-Host ".\scripts\apply-production-rls.ps1" -ForegroundColor Gray
    
} catch {
    Write-Host "" -ForegroundColor White
    Write-Host "[ERROR] Migration failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "" -ForegroundColor White
    Write-Host "[TROUBLESHOOT] Troubleshooting:" -ForegroundColor Yellow
    Write-Host "1. Check that .env.local contains SUPABASE_DB_CONNECTION_STRING" -ForegroundColor Gray
    Write-Host "2. Verify the database is accessible" -ForegroundColor Gray
    Write-Host "3. Ensure psql is installed and in PATH" -ForegroundColor Gray
    Write-Host "" -ForegroundColor White
    exit 1
}
