-- Reset script: Remove claimed status from test businesses
-- This will allow you to test the claim system again

-- Step 1: Remove ownership from SaaSy Cookies and SenseAI
UPDATE businesses 
SET 
  owner_user_id = NULL,
  is_claimed = false,
  claimed_at = NULL,
  claimed_by = NULL
WHERE name IN ('SaaSy Cookies', 'SenseAI');

-- Step 2: Remove any existing claim requests for these businesses
DELETE FROM claim_requests 
WHERE business_id IN (
  SELECT id FROM businesses 
  WHERE name IN ('SaaSy Cookies', 'SenseAI')
);

-- Step 3: Verification query
SELECT 
  name,
  owner_user_id,
  is_claimed,
  claimed_at,
  claimed_by
FROM businesses 
WHERE name IN ('SaaSy Cookies', 'SenseAI')
ORDER BY name;
