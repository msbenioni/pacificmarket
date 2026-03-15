-- ================================================================
-- SIMPLE PUBLIC ACCESS UPDATE FOR PROFILES
-- Purpose: Allow public to see city, country, primary_cultural, languages
-- Generated: 2026-03-16
-- ================================================================

-- Update the existing public RLS policy to allow access to location and cultural fields
DROP POLICY IF EXISTS "Public can view basic profile info" ON profiles;

CREATE POLICY "Public can view location and cultural identity" ON profiles
    FOR SELECT USING (
        -- Allow public access to profiles with location or cultural data
        city IS NOT NULL OR 
        country IS NOT NULL OR 
        primary_cultural IS NOT NULL OR 
        languages IS NOT NULL
    );

-- Alternative: If you want to allow public access to ALL profiles for these fields
-- Uncomment this instead of the policy above:

/*
CREATE POLICY "Public can view location and cultural identity" ON profiles
    FOR SELECT USING (true);
*/

-- Create a secure view for public access (recommended approach)
CREATE OR REPLACE VIEW public_profile_location_cultural AS
SELECT 
    p.id,
    p.display_name,
    p.city,
    p.country,
    p.primary_cultural,
    p.languages,
    p.created_at
FROM profiles p
WHERE (
    p.city IS NOT NULL OR 
    p.country IS NOT NULL OR 
    p.primary_cultural IS NOT NULL OR 
    p.languages IS NOT NULL
);

-- Grant public access to the view
GRANT SELECT ON public_profile_location_cultural TO anon;
GRANT SELECT ON public_profile_location_cultural TO authenticated;

-- Add comment for documentation
COMMENT ON VIEW public_profile_location_cultural IS 'Public view of profile location and cultural identity information';
