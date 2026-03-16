-- Migration: Consolidate claims to single claim_requests table
-- This script migrates existing direct claims to claim_requests and cleans up the businesses table

-- Step 1: Create claim requests for existing directly claimed businesses
INSERT INTO claim_requests (
  id, 
  business_id, 
  user_id, 
  status, 
  contact_email, 
  contact_phone,
  business_name, 
  user_email, 
  role, 
  created_at,
  reviewed_at,
  reviewed_by,
  claim_type
)
SELECT 
  gen_random_uuid() as id,
  b.id as business_id,
  b.owner_user_id as user_id,
  'approved' as status,
  b.contact_email,
  b.contact_phone,
  b.name as business_name,
  p.email as user_email,
  'owner' as role,
  b.created_at,
  b.claimed_at as reviewed_at,
  b.claimed_by as reviewed_by,
  'direct' as claim_type
FROM businesses b
LEFT JOIN profiles p ON b.owner_user_id = p.id
WHERE b.is_claimed = true 
  AND b.owner_user_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM claim_requests cr 
    WHERE cr.business_id = b.id AND cr.user_id = b.owner_user_id
  );

-- Step 2: Remove claim-related columns from businesses table
-- Note: We'll keep owner_user_id for reference but remove the redundant claim columns

-- Step 3: Update RLS policies if needed to ensure users can see their approved claims

-- Step 4: Verification query to check the migration
SELECT 
  'Migrated Direct Claims' as migration_type,
  COUNT(*) as count
FROM claim_requests 
WHERE claim_type = 'direct' AND status = 'approved'

UNION ALL

SELECT 
  'Existing Claim Requests' as migration_type,
  COUNT(*) as count
FROM claim_requests 
WHERE claim_type IS NULL OR claim_type != 'direct'

UNION ALL

SELECT 
  'Businesses with Direct Claims (Before Cleanup)' as migration_type,
  COUNT(*) as count
FROM businesses 
WHERE is_claimed = true AND owner_user_id IS NOT NULL;
