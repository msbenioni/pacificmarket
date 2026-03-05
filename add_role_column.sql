-- Step 1: Create a new text column for role
ALTER TABLE public.profiles ADD COLUMN role_text text DEFAULT 'user';

-- Step 2: Update existing data to use the new column
UPDATE public.profiles SET role_text = 'user' WHERE role IN ('buyer', 'seller');
UPDATE public.profiles SET role_text = 'admin' WHERE role = 'admin';

-- Step 3: Update the trigger function to use the new column
CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, role_text)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)), 
    'user'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END $$;

-- Step 4: Update RLS policies to use the new column (we'll handle this separately)
-- For now, let's just test if the signup works with the new column
