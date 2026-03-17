# Run mobile banner migration using connection string from .env.local

# Read connection string from .env.local
$envContent = Get-Content ".env.local"
$connectionString = $envContent | Where-Object { $_ -match "SUPABASE_CONNECTION_STRING=" } | ForEach-Object { $_ -replace "SUPABASE_CONNECTION_STRING=", "" }

if (-not $connectionString) {
    Write-Error "SUPABASE_CONNECTION_STRING not found in .env.local"
    exit 1
}

Write-Host "Running mobile banner migration..."
Write-Host "Connection: $($connectionString.Substring(0, 50))..."

# Read migration SQL
$migrationSql = Get-Content "database/migrations/add_mobile_banner_url.sql" -Raw

# Execute migration using psql (if available) or create a simple SQL runner
try {
    # Try using psql if installed
    $env:PGPASSWORD = "MontBlanc3001"
    psql $connectionString -f "database/migrations/add_mobile_banner_url.sql"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Migration completed successfully!"
    } else {
        Write-Error "❌ Migration failed with exit code $LASTEXITCODE"
        exit 1
    }
} catch {
    Write-Host "psql not available, creating alternative approach..."
    
    # Create a temporary SQL file with connection info
    $tempSql = @"
-- Mobile Banner Migration
-- Connection: $($connectionString.Substring(0, 50))...

-- Add mobile_banner_url field to businesses table
ALTER TABLE businesses 
ADD COLUMN IF NOT EXISTS mobile_banner_url TEXT;

-- Add comment to explain the purpose
COMMENT ON COLUMN businesses.mobile_banner_url IS 'Mobile-optimized banner image for business cards and homepage featured sections (400x160px recommended)';

-- Update the public view to include the new field
DROP VIEW IF EXISTS public_businesses;

CREATE VIEW public_businesses AS
SELECT 
    b.id,
    b.business_id,
    business.business_name,
    b.business_handle,
    b.tagline,
    b.description,
    b.logo_url,
    b.banner_url,
    b.mobile_banner_url,
    b.contact_email,
    b.contact_website,
    b.contact_phone,
    b.business_hours,
    b.country,
    b.city,
    b.industry,
    b.status,
    b.is_verified,
    b.business_owner,
    b.business_owner_email,
    b.created_date,
    b.updated_at,
    -- Additional fields for public display
    b.additional_owner_emails,
    b.languages_spoken,
    b.target_audience,
    b.business_type,
    b.revenue_range,
    b.employee_count,
    b.establishment_year,
    b.social_media_links,
    b.accepts_in_person_consultations,
    b.consultation_fee_range,
    b.consultation_duration,
    b.special_considerations,
    b.open_to_future_contact,
    b.preferred_contact_methods,
    b.operating_regions,
    b.partnership_interests,
    b.collaboration_interests,
    b.support_needs,
    b.contribution_areas
FROM businesses b
WHERE b.status = 'active';

-- Grant permissions
GRANT SELECT ON public_businesses TO authenticated;
GRANT SELECT ON public_businesses TO anon;

-- Migration completed
"@
    
    $tempSql | Out-File -FilePath "temp_migration.sql" -Encoding UTF8
    
    Write-Host "📝 Created temp_migration.sql with the migration commands"
    Write-Host "🔧 Please run this file in your Supabase SQL Editor:"
    Write-Host "   1. Open Supabase Dashboard"
    Write-Host "   2. Go to SQL Editor"
    Write-Host "   3. Copy contents of temp_migration.sql"
    Write-Host "   4. Execute the SQL"
    
    # Also show the key commands for manual execution
    Write-Host "`n📋 Key SQL commands to run manually:"
    Write-Host "ALTER TABLE businesses ADD COLUMN IF NOT EXISTS mobile_banner_url TEXT;"
    Write-Host "DROP VIEW IF EXISTS public_businesses;"
    Write-Host "-- Then recreate the view with mobile_banner_url included"
}

Write-Host "`n🎯 After migration is complete:"
Write-Host "✅ Mobile banner upload will save to database"
Write-Host "✅ Business cards will use mobile banner first"
Write-Host "✅ Homepage featured will use mobile banner first"
Write-Host "✅ Desktop banner will be used as fallback"
