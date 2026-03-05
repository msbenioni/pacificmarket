-- Fix the handle_new_user function to use correct role enum
CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, role)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)), 
    'buyer'  -- Use 'buyer' instead of 'user' to match the enum
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END $$;
