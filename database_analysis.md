# DATABASE STRUCTURE ANALYSIS
# Comparing actual database with codebase expectations

## KEY FINDINGS:

### 1. Businesses Table Structure (ACTUAL):
- id: uuid (NOT NULL)
- name: character varying (NOT NULL) 
- description: text (nullable)
- short_description: text (nullable)
- logo_url: text (nullable)
- contact_website: text (nullable)
- contact_email: character varying (nullable) ⚠️ **NO EMAIL COLUMN!**
- contact_phone: character varying (nullable)
- address: text (nullable)
- country: character varying (nullable)
- industry: character varying (nullable)
- status: character varying (nullable)
- subscription_tier: character varying (nullable)
- user_id: uuid (nullable)
- stripe_customer_id: text (nullable)
- created_at: timestamp with time zone (nullable)
- updated_at: timestamp with time zone (nullable)
- created_date: date (nullable)
- contact_name: text (nullable)
- languages_spoken: ARRAY (nullable)
- social_links: jsonb (nullable)
- suburb: text (nullable)
- city: text (nullable)
- state_region: text (nullable)
- postal_code: text (nullable)
- business_hours: text (nullable)
- banner_url: text (nullable)
- cultural_identity: text (nullable)
- claimed: boolean (nullable)
- claimed_at: timestamp with time zone (nullable)
- claimed_by: text (nullable)
- business_handle: text (nullable)
- verified: boolean (nullable)
- owner_user_id: uuid (nullable)
- proof_links: ARRAY (nullable)
- homepage_featured: boolean (NOT NULL, default false)
- visibility_tier: text (NOT NULL)
- business_structure: text (nullable)
- annual_revenue_exact: integer (nullable)
- full_time_employees: integer (nullable)
- part_time_employees: integer (nullable)
- primary_market: text (nullable)
- growth_stage: text (nullable)
- funding_source: text (nullable)
- business_challenges: ARRAY (nullable)
- future_plans: text (nullable)
- tech_stack: ARRAY (nullable)
- customer_segments: ARRAY (nullable)
- competitive_advantage: text (nullable)
- year_started: integer (nullable)
- tagline: text (nullable)
- created_by: uuid (nullable)
- source: text (nullable)
- profile_completeness: numeric (nullable)
- referral_code: text (nullable)

### 2. OTHER TABLES FOUND:
- business_insights_snapshots (83 rows)
- claim_requests (9 rows) 
- profiles (9 rows)
- email_campaigns (0 rows)
- email_campaign_recipients (0 rows)
- email_queue (0 rows)
- email_subscribers (0 rows)

### 3. CRITICAL ISSUE IDENTIFIED:
⚠️ **The businesses table has NO `email` column!**

### 4. CODEBASE EXPECTATIONS vs ACTUAL:
The save function is filtering out: `["updated_date", "created_date", "verification_source", "tagline", "website"]`

But the actual table has:
- `contact_email` (not `email`)
- `contact_website` (not `website`)
- `tagline` exists in database
- `updated_date` and `created_date` exist in database

### 5. EMAIL MARKETING TABLES:
- email_campaigns (empty)
- email_campaign_recipients (empty) 
- email_queue (empty)
- email_subscribers (empty)

## RECOMMENDATIONS:

### 1. FIX SAVE FUNCTION:
Change the filtering in saveBusiness function from:
```javascript
!["updated_date", "created_date", "verification_source", "tagline", "website"]
```
To:
```javascript
!["updated_date", "created_date", "verification_source", "tagline", "contact_website"]
```

### 2. UPDATE CODEBASE REFERENCES:
- Change `email` to `contact_email` in all forms and components
- Change `website` to `contact_website` in all forms and components

### 3. EMAIL SYSTEM SETUP:
The email marketing tables exist but are empty. Need to run migrations to populate them.

### 4. RLS POLICIES:
Need to check if RLS policies are blocking updates to the businesses table.
