-- Delete a specific claim request by ID
DELETE FROM public.claim_requests 
WHERE id = 'your-claim-uuid-here';

-- Delete all pending claims for a specific business
DELETE FROM public.claim_requests 
WHERE business_id = 'business-uuid-here' 
AND status = 'pending';

-- Delete all claims by a specific user
DELETE FROM public.claim_requests 
WHERE user_id = 'user-uuid-here';

-- Delete claims older than 30 days (cleanup)
DELETE FROM public.claim_requests 
WHERE created_at < NOW() - INTERVAL '30 days'
AND status IN ('rejected', 'approved');
