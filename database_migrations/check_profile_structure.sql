-- Check current profiles table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Show current profile data for msbenioni@gmail.com
SELECT id, email, display_name, role, created_at 
FROM public.profiles 
WHERE email = 'msbenioni@gmail.com';
