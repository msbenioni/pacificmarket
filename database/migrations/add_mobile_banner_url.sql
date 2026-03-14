-- Add mobile_banner_url field to businesses table
-- This allows separate banner images for mobile contexts (business cards, homepage)

-- Add the mobile_banner_url column to businesses table
ALTER TABLE businesses 
ADD COLUMN mobile_banner_url TEXT;

-- Add comment to explain the purpose
COMMENT ON COLUMN businesses.mobile_banner_url IS 'Mobile-optimized banner image for business cards and homepage featured sections (400x160px recommended)';

-- Update the public view to include the new field
DROP VIEW IF EXISTS public_businesses;

CREATE VIEW public_businesses AS
SELECT 
    b.id,
    b.business_id,
    b.name,
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
