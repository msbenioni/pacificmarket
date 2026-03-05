-- Add missing columns to claim_requests table for premium ownership workflow

-- Add listing contact info columns (store what's on file at time of claim)
ALTER TABLE "public"."claim_requests" 
ADD COLUMN "listing_contact_email" text,
ADD COLUMN "listing_contact_phone" text;

-- Add proof URL column for verification
ALTER TABLE "public"."claim_requests" 
ADD COLUMN "proof_url" text;

-- Add comments for clarity
COMMENT ON COLUMN "public"."claim_requests"."listing_contact_email" IS 'Email currently on business listing at time of claim (for notification)';
COMMENT ON COLUMN "public"."claim_requests"."listing_contact_phone" IS 'Phone currently on business listing at time of claim';
COMMENT ON COLUMN "public"."claim_requests"."proof_url" IS 'Optional proof link (website, social media, Google Business) to help verify ownership';

-- Add indexes for better query performance
CREATE INDEX "idx_claim_requests_listing_contact_email" ON "public"."claim_requests" USING "btree" ("listing_contact_email");
CREATE INDEX "idx_claim_requests_proof_url" ON "public"."claim_requests" USING "btree" ("proof_url");
