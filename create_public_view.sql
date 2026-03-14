-- Create public view with mobile_banner_url (minimal version)
-- Run this in Supabase SQL Editor

-- Create public view with only existing columns
CREATE OR REPLACE VIEW public_businesses AS
SELECT 
    b.id,
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
    b.updated_at
FROM businesses b
WHERE b.status = 'active';

-- Grant permissions
GRANT SELECT ON public_businesses TO authenticated;
GRANT SELECT ON public_businesses TO anon;

-- Verify the view was created
SELECT table_name 
FROM information_schema.views 
WHERE table_name = 'public_businesses';
