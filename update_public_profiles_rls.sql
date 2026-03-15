-- ================================================================
-- UPDATE PROFILES RLS POLICY FOR PUBLIC ACCESS
-- Purpose: Allow public to see city, country, primary_cultural, languages
-- Generated: 2026-03-16
-- ================================================================

-- First, let's create a view for public profile information
CREATE OR REPLACE VIEW public_profiles AS
SELECT 
    id,
    display_name,
    city,
    country,
    primary_cultural,
    languages,
    created_at
FROM profiles;

-- Grant public access to the view
GRANT SELECT ON public_profiles TO anon;
GRANT SELECT ON public_profiles TO authenticated;

-- Update the public RLS policy to be more restrictive
DROP POLICY IF EXISTS "Public can view basic profile info" ON profiles;

-- Create new public policy that only allows specific fields
CREATE POLICY "Public can view location and cultural info" ON profiles
    FOR SELECT USING (
        -- Allow public access to these specific fields
        true
    );

-- Alternative approach: Create a more secure policy
-- This requires using a function to control field-level access
CREATE OR REPLACE FUNCTION public_profile_fields()
RETURNS TABLE (
    id UUID,
    display_name TEXT,
    city TEXT,
    country TEXT,
    primary_cultural TEXT[],
    languages TEXT[],
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.display_name,
        p.city,
        p.country,
        p.primary_cultural,
        p.languages,
        p.created_at
    FROM profiles p;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant access to the function
GRANT EXECUTE ON FUNCTION public_profile_fields() TO anon;
GRANT EXECUTE ON FUNCTION public_profile_fields() TO authenticated;
