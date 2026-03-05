-- Add missing columns to profiles table for new onboarding structure
-- This migration adds the fields that are referenced in the profile onboarding but missing from the database

-- Add business_role column
ALTER TABLE "public"."profiles" ADD COLUMN IF NOT EXISTS business_role text;

-- Add city column (missing from current schema)
ALTER TABLE "public"."profiles" ADD COLUMN IF NOT EXISTS city text;

-- Add languages column (array type for language data)
ALTER TABLE "public"."profiles" ADD COLUMN IF NOT EXISTS languages text[] DEFAULT '{}'::text[];

-- Add years_operating column for business experience
ALTER TABLE "public"."profiles" ADD COLUMN IF NOT EXISTS years_operating integer;

-- Add education_level column for personal insights
ALTER TABLE "public"."profiles" ADD COLUMN IF NOT EXISTS education_level text;

-- Add market_region column
ALTER TABLE "public"."profiles" ADD COLUMN IF NOT EXISTS market_region text;

-- Add cultural_identity column to replace primary_cultural and cultural_tags
ALTER TABLE "public"."profiles" ADD COLUMN IF NOT EXISTS cultural_identity text[] DEFAULT '{}'::text[];

-- Add comments for new columns
COMMENT ON COLUMN "public"."profiles"."business_role" IS 'User''s role in their business (founder, owner, manager, etc.)';
COMMENT ON COLUMN "public"."profiles"."city" IS 'User''s city of residence';
COMMENT ON COLUMN "public"."profiles"."languages" IS 'Languages spoken by the user (array)';
COMMENT ON COLUMN "public"."profiles"."years_operating" IS 'Number of years user has been operating in business';
COMMENT ON COLUMN "public"."profiles"."education_level" IS 'User''s highest completed education level';
COMMENT ON COLUMN "public"."profiles"."market_region" IS 'Market region derived from country';
COMMENT ON COLUMN "public"."profiles"."cultural_identity" IS 'User''s cultural identities (replaces primary_cultural and cultural_tags)';

-- Create index on cultural_identity for better query performance
CREATE INDEX IF NOT EXISTS "idx_profiles_cultural_identity" ON "public"."profiles" USING GIN ("cultural_identity");

-- Create index on business_role for filtering
CREATE INDEX IF NOT EXISTS "idx_profiles_business_role" ON "public"."profiles" ("business_role");

-- Create index on city for location-based queries
CREATE INDEX IF NOT EXISTS "idx_profiles_city" ON "public"."profiles" ("city");
