# Dumps Supabase prod database (schema + data) using SUPABASE_CONNECTION_STRING in .env.local
# Creates outputs under ./database_dumps

$root = Split-Path -Parent $PSScriptRoot
$envFile = Join-Path $root ".env.local"

if (-not (Test-Path $envFile)) {
  throw "Missing .env.local at $envFile"
}

$connectionLine = Get-Content $envFile | Where-Object { $_ -match '^\s*SUPABASE_CONNECTION_STRING\s*=' } | Select-Object -First 1
if (-not $connectionLine) {
  throw "SUPABASE_CONNECTION_STRING not found in .env.local"
}

$connectionString = $connectionLine -replace '^\s*SUPABASE_CONNECTION_STRING\s*=\s*', ''
$connectionString = $connectionString.Trim().Trim('"').Trim("'")

if (-not (Get-Command pg_dump -ErrorAction SilentlyContinue)) {
  throw "pg_dump not found. Install PostgreSQL client tools and ensure pg_dump is on PATH."
}

$outputDir = Join-Path $root "database_dumps"
New-Item -ItemType Directory -Path $outputDir -Force | Out-Null

$fullDump = Join-Path $outputDir "prod_full.dump"
$schemaDump = Join-Path $outputDir "prod_schema.sql"
$dataDump = Join-Path $outputDir "prod_data.sql"

Write-Host "Starting prod dump..." -ForegroundColor Cyan

& pg_dump --dbname $connectionString --format=custom --file $fullDump --no-owner --no-privileges
if ($LASTEXITCODE -ne 0) { throw "pg_dump (full) failed" }

& pg_dump --dbname $connectionString --schema-only --file $schemaDump --no-owner --no-privileges
if ($LASTEXITCODE -ne 0) { throw "pg_dump (schema) failed" }

& pg_dump --dbname $connectionString --data-only --column-inserts --file $dataDump --no-owner --no-privileges
if ($LASTEXITCODE -ne 0) { throw "pg_dump (data) failed" }

Write-Host "Dump complete. Files:" -ForegroundColor Green
Write-Host "- $fullDump"
Write-Host "- $schemaDump"
Write-Host "- $dataDump"
