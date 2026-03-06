-- Add GDPR consent columns to profiles table
-- This migration adds fields to track user consent for GDPR compliance

-- Add GDPR consent column
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS gdpr_consent BOOLEAN DEFAULT FALSE;

-- Add GDPR consent date column  
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS gdpr_consent_date TIMESTAMPTZ;

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.gdpr_consent IS 'User consent for GDPR data processing (required for account creation)';
COMMENT ON COLUMN public.profiles.gdpr_consent_date IS 'Timestamp when GDPR consent was given';

-- Create index for easy querying of consent status
CREATE INDEX IF NOT EXISTS idx_profiles_gdpr_consent ON public.profiles(gdpr_consent);

-- Update the handle_new_user function to include GDPR consent from user metadata
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
begin
  insert into public.profiles (id, email, gdpr_consent, gdpr_consent_date)
  values (
    new.id, 
    new.email,
    (new.raw_user_meta_data->>'gdpr_consent')::boolean,
    (new.raw_user_meta_data->>'gdpr_consent_date')::timestamptz
  );
  return new;
end;
$$;

-- Create a function to query users with GDPR consent for reporting
CREATE OR REPLACE FUNCTION get_users_with_gdpr_consent()
RETURNS TABLE (
    user_id uuid,
    email text,
    display_name text,
    gdpr_consent boolean,
    gdpr_consent_date timestamptz,
    created_at timestamptz
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.email,
        p.display_name,
        p.gdpr_consent,
        p.gdpr_consent_date,
        p.created_at
    FROM public.profiles p
    WHERE p.gdpr_consent = true
    ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
