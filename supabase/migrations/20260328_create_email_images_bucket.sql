-- Create email images storage bucket for campaign email images
-- Created: 2026-03-28
-- Purpose: Store images used in email campaigns

-- Insert storage policy for the bucket (service role has full access)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'email-images', 
  'email-images', 
  true, 
  10485760, -- 10MB in bytes
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Create storage policies
-- 1. Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload email images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'email-images' AND 
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = 'email-campaigns'
);

-- 2. Allow authenticated users to update their own images
CREATE POLICY "Authenticated users can update own email images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'email-images' AND 
  auth.role() = 'authenticated'
);

-- 3. Allow authenticated users to read all email images (public bucket)
CREATE POLICY "Anyone can read email images" ON storage.objects
FOR SELECT USING (
  bucket_id = 'email-images'
);

-- 4. Allow authenticated users to delete their own images
CREATE POLICY "Authenticated users can delete own email images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'email-images' AND 
  auth.role() = 'authenticated'
);

-- Grant necessary permissions
GRANT ALL ON storage.buckets TO authenticated;
GRANT ALL ON storage.objects TO authenticated;
