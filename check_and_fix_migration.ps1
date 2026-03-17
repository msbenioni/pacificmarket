# Check businesses table structure and fix migration

$env:PGPASSWORD = "MontBlanc3001"

Write-Host "Checking businesses table structure..."

# Get column names
$columns = psql -h db.mnmisjprswpuvcojnbip.supabase.co -p 5432 -U postgres -d postgres -c "SELECT column_name FROM information_schema.columns WHERE table_name = 'businesses' ORDER BY ordinal_position;" -t | ForEach-Object { $_.Trim() }

Write-Host "Found columns:"
$columns | ForEach-Object { Write-Host "  - $_" }

# Check if business_id exists
if ($columns -contains "business_id") {
    Write-Host "✅ business_id column exists"
    $idColumn = "business_id"
} elseif ($columns -contains "id") {
    Write-Host "✅ Using 'id' column instead of 'business_id'"
    $idColumn = "id"
} else {
    Write-Host " No ID column found!"
    exit 1
}

# Create fixed migration
$fixedMigration = @"
-- Mobile Banner Migration for Pacific Discovery Network (Fixed)
-- Run this in Supabase SQL Editor

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
    b.$idColumn,
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

-- Verify the column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'businesses' 
AND column_name = 'mobile_banner_url';
"@

$fixedMigration | Out-File -FilePath "mobile_banner_migration_fixed.sql" -Encoding UTF8

Write-Host "`n✅ Created fixed migration: mobile_banner_migration_fixed.sql"
Write-Host "🔧 Please run this file in Supabase SQL Editor"
Write-Host "🎯 Using ID column: $idColumn"
