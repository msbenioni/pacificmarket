-- Check the current status constraint for businesses table
SELECT conname, contype, pg_get_constraintdef(oid) as definition
FROM pg_constraint 
WHERE conrelid = 'public.businesses'::regclass 
AND conname = 'businesses_status_check';

-- Also check what status values currently exist in the table
SELECT DISTINCT status, COUNT(*) as count 
FROM public.businesses 
GROUP BY status 
ORDER BY status;
