-- ================================================================
-- UPDATE PROFILES RLS FOR PUBLIC ACCESS TO LOCATION & CULTURAL DATA
-- Purpose: Allow public to see city, country, primary_cultural, languages
-- Generated: 2026-03-16
-- ================================================================

-- Step 1: Create a secure view for public profile information
CREATE OR REPLACE VIEW public_profile_info AS
SELECT 
    p.id,
    p.display_name,
    p.city,
    p.country,
    p.primary_cultural,
    p.languages,
    p.created_at,
    -- Only show if user has active public business
    CASE WHEN b.id IS NOT NULL AND b.status = 'active' AND b.visibility_tier = 'public' 
         THEN true 
         ELSE false 
    END as has_public_business
FROM profiles p
LEFT JOIN businesses b ON p.user_id = b.owner_user_id 
WHERE p.display_name IS NOT NULL 
   OR p.city IS NOT NULL 
   OR p.country IS NOT NULL;

-- Step 2: Grant public access to the view
GRANT SELECT ON public_profile_info TO anon;
GRANT SELECT ON public_profile_info TO authenticated;

-- Step 3: Update the existing public RLS policy to be more specific
DROP POLICY IF EXISTS "Public can view basic profile info" ON profiles;

-- Create new public policy that allows access to location/cultural fields
CREATE POLICY "Public can view location and cultural identity" ON profiles
    FOR SELECT USING (
        -- Allow public access to profiles that have:
        -- 1. Display name, OR
        -- 2. Location info, OR  
        -- 3. Cultural identity info
        (display_name IS NOT NULL OR 
         city IS NOT NULL OR 
         country IS NOT NULL OR 
         primary_cultural IS NOT NULL OR 
         languages IS NOT NULL)
    );

-- Step 4: Create a function for secure public access
CREATE OR REPLACE FUNCTION get_public_profile_info(profile_id UUID)
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
    FROM profiles p
    WHERE p.id = profile_id
    AND (
        p.display_name IS NOT NULL OR 
        p.city IS NOT NULL OR 
        p.country IS NOT NULL OR 
        p.primary_cultural IS NOT NULL OR 
        p.languages IS NOT NULL
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant access to the function
GRANT EXECUTE ON FUNCTION get_public_profile_info(UUID) TO anon;
GRANT EXECUTE ON FUNCTION get_public_profile_info(UUID) TO authenticated;

-- Step 5: Test the public access
-- This should work for anonymous users:
-- SELECT * FROM public_profile_info;
-- SELECT * FROM get_public_profile_info('some-profile-id');

-- Step 6: Create an index for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_public_fields 
ON profiles (display_name, city, country) 
WHERE (display_name IS NOT NULL OR city IS NOT NULL OR country IS NOT NULL);

CREATE INDEX IF NOT EXISTS idx_profiles_cultural_fields 
ON profiles (primary_cultural, languages) 
WHERE (primary_cultural IS NOT NULL OR languages IS NOT NULL);
