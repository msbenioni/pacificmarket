-- SQL to remove old generated banner/logo URLs and set homepage featured for specific business
-- This will make the business use the new teal background with business name text and be featured on homepage

UPDATE businesses 
SET 
  logo_url = NULL,
  banner_url = NULL, 
  mobile_banner_url = NULL,
  is_homepage_featured = true,
  updated_at = NOW()
WHERE id = 'fcf11781-96da-4c8b-b16c-bca3c50724a3';

-- Verify the update
SELECT id, business_name, logo_url, banner_url, mobile_banner_url, is_homepage_featured 
FROM businesses 
WHERE id = 'fcf11781-96da-4c8b-b16c-bca3c50724a3';
