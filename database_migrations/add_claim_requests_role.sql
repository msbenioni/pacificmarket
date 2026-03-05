-- Add role column to claim_requests table
ALTER TABLE "public"."claim_requests" 
ADD COLUMN "role" character varying(20) DEFAULT 'owner';

-- Add constraint for role values
ALTER TABLE "public"."claim_requests" 
ADD CONSTRAINT "claim_requests_role_check" 
CHECK (role IN ('owner', 'manager', 'staff', 'other'));

-- Update comment
COMMENT ON COLUMN "public"."claim_requests"."role" IS 'Claimant role: owner, manager, staff, or other';
