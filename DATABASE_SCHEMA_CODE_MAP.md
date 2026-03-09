# Database Schema + Code Map

Generated: 2026-03-09T08:49:49.018Z

## admin_notification_settings

**Schema columns**

- id (uuid, NOT NULL DEFAULT gen_random_uuid() NOT NULL)
- user_id (uuid, NOT NULL)
- settings (jsonb, NOT NULL DEFAULT '{}'::jsonb NOT NULL)
- admin_email (text, NOT NULL)
- created_at (timestamp with time zone, NOT NULL DEFAULT timezone('utc'::text)
- updated_at (timestamp with time zone, NOT NULL DEFAULT timezone('utc'::text)

**RLS policies**

- _None found in dump._

**Dependencies (FK references)**

- _None found._

**Code usage**

- src/components/admin/NotificationSettings.jsx
  - select: '*'
  - upsert: user_id, admin_email, updated_at

**Potential mismatches**

- Columns referenced in code but not found in schema: _None detected._
- Schema columns not directly referenced in code: _None detected (or select * in use)._

## audit_logs

**Schema columns**

- id (uuid, NOT NULL DEFAULT gen_random_uuid() NOT NULL)
- table_name (character varying(50), NOT NULL)
- record_id (uuid, NOT NULL)
- action (character varying(10), NOT NULL)
- old_data (jsonb, NULL)
- new_data (jsonb, NULL)
- user_id (uuid, NULL)
- ip_address (inet, NULL)
- user_agent (text, NULL)
- created_at (timestamp with time zone, NULL DEFAULT now())

**RLS policies**

- _None found in dump._

**Dependencies (FK references)**

- _None found._

**Code usage**

- _No code usage found._

## business_images

**Schema columns**

- id (uuid, NOT NULL DEFAULT gen_random_uuid() NOT NULL)
- business_id (uuid, NOT NULL)
- url (text, NOT NULL)
- caption (text, NULL)
- sort_order (integer, NULL DEFAULT 0)
- created_at (timestamp with time zone, NULL DEFAULT now())

**RLS policies**

- _None found in dump._

**Dependencies (FK references)**

- _None found._

**Code usage**

- src/screens/BusinessProfile.jsx
  - select: "*"

## business_insights_snapshots

**Schema columns**

- id (uuid, NOT NULL DEFAULT gen_random_uuid() NOT NULL)
- business_id (uuid, NULL)
- snapshot_year (integer, NOT NULL)
- submitted_date (timestamp with time zone, NULL DEFAULT CURRENT_TIMESTAMP)
- year_started (integer, NULL)
- problem_solved (text, NULL)
- team_size_band (public.team_size_band_enum, NULL)
- business_model (text, NULL)
- family_involvement (boolean, NULL DEFAULT false)
- customer_region (text, NULL)
- sales_channels (jsonb, NULL)
- import_export_status (public.import_export_status_enum, NULL DEFAULT 'none'::public.import_export_status_enum)
- import_countries (jsonb, NULL)
- export_countries (jsonb, NULL)
- business_stage (public.business_stage_enum, NULL)
- top_challenges (jsonb, NULL)
- hiring_intentions (boolean, NULL DEFAULT false)
- community_impact_areas (jsonb, NULL)
- collaboration_interest (boolean, NULL DEFAULT false)
- created_date (timestamp with time zone, NULL DEFAULT CURRENT_TIMESTAMP)
- updated_date (timestamp with time zone, NULL DEFAULT CURRENT_TIMESTAMP)
- created_by (uuid, NULL)
- years_entrepreneurial (text, NULL)
- entrepreneurial_background (text, NULL)
- businesses_founded (text, NULL)
- primary_industry (text, NULL)
- family_entrepreneurial_background (boolean, NULL DEFAULT false)
- mentorship_access (boolean, NULL DEFAULT false)
- mentorship_offering (boolean, NULL DEFAULT false)
- user_id (uuid, NULL)
- founder_role (text, NULL)
- founder_story (text, NULL)
- business_operating_status (text, NULL)
- business_age (text, NULL)
- business_registered (boolean, NULL DEFAULT false)
- employs_anyone (boolean, NULL DEFAULT false)
- employs_family_community (boolean, NULL DEFAULT false)
- revenue_band (text, NULL)
- pacific_identity (text[], NULL)
- based_in_country (text, NULL)
- based_in_city (text, NULL)
- serves_pacific_communities (text, NULL)
- culture_influences_business (boolean, NULL DEFAULT false)
- culture_influence_details (text, NULL)
- family_community_responsibilities_affect_business (text[], NULL DEFAULT '{}'::text[])
- responsibilities_impact_details (text, NULL)
- support_needed_next (text[], NULL)
- current_support_sources (text[], NULL)
- goals_details (text, NULL)
- expansion_plans (boolean, NULL DEFAULT false)
- open_to_future_contact (boolean, NULL DEFAULT false)
- founder_motivation_array (text[], NULL)
- goals_next_12_months_array (text[], NULL)
- current_funding_source (text, NULL)
- funding_amount_needed (text, NULL)
- funding_purpose (text, NULL)
- investment_stage (text, NULL)
- angel_investor_interest (text, NULL)
- investor_capacity (text, NULL)
- revenue_streams (text[], NULL)
- financial_challenges (text, NULL)
- barriers_to_mentorship (text, NULL)
- investment_exploration (text, NULL)
- team_size (text, NULL)
- is_autosave (boolean, NULL DEFAULT false)
- submission_type (text, NOT NULL DEFAULT 'full'::text NOT NULL)
- completion_status (text, NOT NULL DEFAULT 'in_progress'::text NOT NULL)
- gender (text, NULL DEFAULT ''::text)
- age_range (text, NULL DEFAULT ''::text)

**RLS policies**

- _None found in dump._

**Dependencies (FK references)**

- references businesses (id)

**Code usage**

- src/screens/AdminDashboard.jsx
  - select: "*"
- src/screens/BusinessPortal.jsx
  - select: "*"
  - update: updated_date (dynamic)
  - insert: submitted_date (dynamic)

**Potential mismatches**

- Columns referenced in code but not found in schema: _None detected._
- Schema columns not directly referenced in code: _None detected (or select * in use)._

## business_insights_snapshots_backup

**Schema columns**

- id (uuid, NULL)
- business_id (uuid, NULL)
- snapshot_year (integer, NULL)
- submitted_date (timestamp with time zone, NULL)
- year_started (integer, NULL)
- problem_solved (text, NULL)
- team_size_band (public.team_size_band_enum, NULL)
- business_model (text, NULL)
- family_involvement (boolean, NULL)
- customer_region (text, NULL)
- sales_channels (jsonb, NULL)
- import_export_status (public.import_export_status_enum, NULL)
- import_countries (jsonb, NULL)
- export_countries (jsonb, NULL)
- business_stage (public.business_stage_enum, NULL)
- top_challenges (jsonb, NULL)
- hiring_intentions (boolean, NULL)
- community_impact_areas (jsonb, NULL)
- collaboration_interest (boolean, NULL)
- created_date (timestamp with time zone, NULL)
- updated_date (timestamp with time zone, NULL)
- created_by (uuid, NULL)
- years_entrepreneurial (text, NULL)
- entrepreneurial_background (text, NULL)
- businesses_founded (text, NULL)
- primary_industry (text, NULL)
- family_entrepreneurial_background (boolean, NULL)
- mentorship_access (boolean, NULL)
- mentorship_offering (boolean, NULL)
- user_id (uuid, NULL)
- founder_role (text, NULL)
- founder_story (text, NULL)
- business_operating_status (text, NULL)
- business_age (text, NULL)
- business_registered (boolean, NULL)
- employs_anyone (boolean, NULL)
- employs_family_community (boolean, NULL)
- revenue_band (text, NULL)
- pacific_identity (text[], NULL)
- based_in_country (text, NULL)
- based_in_city (text, NULL)
- serves_pacific_communities (text, NULL)
- culture_influences_business (boolean, NULL)
- culture_influence_details (text, NULL)
- family_community_responsibilities_affect_business (boolean, NULL)
- responsibilities_impact_details (text, NULL)
- support_needed_next (text[], NULL)
- current_support_sources (text[], NULL)
- goals_details (text, NULL)
- expansion_plans (boolean, NULL)
- open_to_future_contact (boolean, NULL)
- founder_motivation_array (text[], NULL)
- goals_next_12_months_array (text[], NULL)
- current_funding_source (text, NULL)
- funding_amount_needed (text, NULL)
- funding_purpose (text, NULL)
- investment_stage (text, NULL)
- angel_investor_interest (text, NULL)
- investor_capacity (text, NULL)
- revenue_streams (text[], NULL)
- financial_challenges (text, NULL)
- barriers_to_mentorship (text, NULL)
- investment_exploration (text, NULL)
- team_size (text, NULL)
- is_autosave (boolean, NULL)
- submission_type (text, NULL)
- completion_status (text, NULL)

**RLS policies**

- _None found in dump._

**Dependencies (FK references)**

- _None found._

**Code usage**

- _No code usage found._

## business_invoice_settings

**Schema columns**

- id (uuid, NOT NULL DEFAULT gen_random_uuid() NOT NULL)
- business_id (uuid, NOT NULL)
- account_name (text, NULL)
- account_number (text, NULL)
- payment_reference_label (text, NULL)
- payment_terms (text, NULL)
- footer_note (text, NULL)
- default_tax_rate (numeric, NULL DEFAULT 0)
- default_withholding_tax_rate (numeric, NULL DEFAULT 0)
- invoice_primary_color (text, NULL DEFAULT '#0a1628'::text)
- invoice_accent_color (text, NULL DEFAULT '#c9a84c'::text)
- invoice_text_color (text, NULL DEFAULT '#0f172a'::text)
- created_at (timestamp with time zone, NULL DEFAULT now())
- updated_at (timestamp with time zone, NULL DEFAULT now())

**RLS policies**

- _None found in dump._

**Dependencies (FK references)**

- _None found._

**Code usage**

- src/screens/InvoiceGenerator.jsx
  - select: '*'
  - upsert: (dynamic keys) (dynamic)

## business_signature_settings

**Schema columns**

- id (uuid, NOT NULL DEFAULT gen_random_uuid() NOT NULL)
- business_id (uuid, NOT NULL)
- default_full_name (text, NULL)
- default_job_title (text, NULL)
- default_department (text, NULL)
- default_pronouns (text, NULL)
- default_email (text, NULL)
- default_phone (text, NULL)
- default_website (text, NULL)
- default_address (text, NULL)
- linkedin_url (text, NULL)
- facebook_url (text, NULL)
- instagram_url (text, NULL)
- tiktok_url (text, NULL)
- template (text, NULL DEFAULT 'modern'::text)
- brand_primary (text, NULL DEFAULT '#0a1628'::text)
- brand_secondary (text, NULL DEFAULT '#0d4f4f'::text)
- brand_accent (text, NULL DEFAULT '#00c4cc'::text)
- text_color (text, NULL DEFAULT '#0f172a'::text)
- include_logo (boolean, NULL DEFAULT true)
- include_badge (boolean, NULL DEFAULT true)
- include_socials (boolean, NULL DEFAULT true)
- include_address (boolean, NULL DEFAULT true)
- include_pronouns (boolean, NULL DEFAULT false)
- disclaimer (text, NULL)
- created_at (timestamp with time zone, NOT NULL DEFAULT now() NOT NULL)
- updated_at (timestamp with time zone, NOT NULL DEFAULT now() NOT NULL)

**RLS policies**

- signature_settings_delete_owner_only
- signature_settings_insert_owner_only
- signature_settings_select_owner_only
- signature_settings_update_owner_only

**Dependencies (FK references)**

- references businesses (id)

**Code usage**

- src/screens/EmailSignatureGenerator.jsx
  - select: "*"
  - upsert: (dynamic keys) (dynamic)

## businesses

**Schema columns**

- id (uuid, NOT NULL DEFAULT gen_random_uuid() NOT NULL)
- name (character varying(255), NOT NULL)
- description (text, NULL)
- short_description (text, NULL)
- logo_url (text, NULL)
- contact_website (text, NULL)
- contact_email (character varying(255), NULL)
- contact_phone (character varying(50), NULL)
- address (text, NULL)
- country (character varying(100), NULL)
- industry (character varying(100), NULL)
- status (character varying(20), NULL DEFAULT 'pending'::character varying)
- subscription_tier (character varying(20), NULL DEFAULT 'basic'::character varying)
- user_id (uuid, NULL)
- stripe_customer_id (text, NULL)
- created_at (timestamp with time zone, NULL DEFAULT now())
- updated_at (timestamp with time zone, NULL DEFAULT now())
- created_date (date, NULL DEFAULT CURRENT_DATE)
- contact_name (text, NULL)
- languages_spoken (text[], NULL)
- social_links (jsonb, NULL)
- suburb (text, NULL)
- city (text, NULL)
- state_region (text, NULL)
- postal_code (text, NULL)
- business_hours (text, NULL)
- banner_url (text, NULL)
- cultural_identity (text, NULL)
- claimed (boolean, NULL DEFAULT false)
- claimed_at (timestamp with time zone, NULL)
- claimed_by (text, NULL)
- business_handle (text, NULL)
- verified (boolean, NULL DEFAULT false)
- owner_user_id (uuid, NULL)
- proof_links (text[], NULL)
- homepage_featured (boolean, NOT NULL DEFAULT false NOT NULL)
- visibility_tier (text, NOT NULL DEFAULT 'none'::text NOT NULL)
- business_structure (text, NULL)
- annual_revenue_exact (integer, NULL)
- full_time_employees (integer, NULL)
- part_time_employees (integer, NULL)
- primary_market (text, NULL)
- growth_stage (text, NULL)
- funding_source (text, NULL)
- business_challenges (text[], NULL)
- future_plans (text, NULL)
- tech_stack (text[], NULL)
- customer_segments (text[], NULL)
- competitive_advantage (text, NULL)
- year_started (integer, NULL)
- tagline (text, NULL)
- created_by (uuid, NULL)
- source (text, NULL DEFAULT 'user'::text)
- profile_completeness (numeric(3,2), NULL DEFAULT 0.0)
- referral_code (text, NULL)

**RLS policies**

- _None found in dump._

**Dependencies (FK references)**

- references businesses (id)

**Code usage**

- src/app/api/notifications/business-added/route.js
  - select: '*'
- src/app/api/notifications/business-claimed/route.js
  - select: '*'
- src/app/api/notifications/business-updated/route.js
  - select: '*'
- src/app/api/notifications/claim-submitted/route.js
  - select: '*'
- src/app/api/signatures/generate/route.js
  - select: '*'
- src/app/api/stripe/webhook/route.js
  - select: '*'
  - select: '*'
  - update: subscription_status, subscription_period_end
  - select: '*'
  - update: listing_tier
  - select: '*'
  - update: listing_tier, subscription_status, stripe_customer_id
- src/app/customer-portal/page.jsx
  - select: '*'
  - update: owner_user_id
- src/app/register/[business-handle]/page.jsx
  - select: 'name, business_handle, city, country'
- src/app/register/saasy-cookies/page.jsx
  - select: 'name, business_handle, city, country'
- src/components/BusinessSearch.jsx
  - select: "id, name, city, country, industry, business_handle, status"
- src/components/home/StatsBar.jsx
  - select: '*'
- src/components/onboarding/ClaimAddBusinessModal.jsx
  - insert: owner_user_id, created_at, updated_at, status, subscription_tier, visibility_tier (dynamic)
- src/components/registry/RegistryFilters.jsx
  - select: "country, industry"
- src/hooks/useOnboardingStatus.js
  - select: '*'
- src/lib/email/getAudienceRecipients.js
  - select: 'owner_user_id, business_handle'
  - select: 'owner_user_id, business_handle'
  - select: 'owner_user_id, business_handle'
  - select: 'owner_user_id, business_handle'
  - select: 'owner_user_id, business_handle'
- src/screens/AdminDashboard.jsx
  - select: "*"
  - update: (dynamic keys) (dynamic)
  - update: (dynamic keys) (dynamic)
  - delete
  - update: (dynamic keys) (dynamic)
  - insert: (dynamic keys) (dynamic)
- src/screens/BusinessPortal.jsx
  - select: '*'
  - update: (dynamic keys) (dynamic)
  - update: logo_url
  - select: '*'
  - delete
- src/screens/BusinessProfile.jsx
  - select: "*"
  - select: "*"
- src/screens/EmailSignatureGenerator.jsx
  - select: "*"
  - select: "*"
  - select: "*"
  - update: (dynamic keys) (dynamic)
- src/screens/Home.jsx
  - select: '*'
- src/screens/Insights.jsx
  - select: '*'
- src/screens/InvoiceGenerator.jsx
  - select: '*'
  - select: '*'
  - select: '*'
  - update: (dynamic keys) (dynamic)
- src/screens/QRCodeGenerator.jsx
  - select: '*'
- src/screens/Registry.jsx
  - select: '*'

**Potential mismatches**

- Columns referenced in code but not found in schema: subscription_status, subscription_period_end, listing_tier, name, business_handle, city, country, id, name, city, country, industry, business_handle, status, country, industry, owner_user_id, business_handle
- Schema columns not directly referenced in code: _None detected (or select * in use)._

## claim_requests

**Schema columns**

- id (uuid, NOT NULL DEFAULT gen_random_uuid() NOT NULL)
- business_id (uuid, NOT NULL)
- user_id (uuid, NOT NULL)
- status (character varying(20), NULL DEFAULT 'pending'::character varying)
- contact_email (character varying(255), NULL)
- contact_phone (character varying(50), NULL)
- verification_documents (text[], NULL)
- rejection_reason (text, NULL)
- reviewed_by (uuid, NULL)
- reviewed_at (timestamp with time zone, NULL)
- created_at (timestamp with time zone, NULL DEFAULT now())
- updated_at (timestamp with time zone, NULL DEFAULT now())
- user_email (text, NULL)
- business_name (text, NULL)
- created_date (date, NULL DEFAULT CURRENT_DATE)
- notes (text, NULL)
- message (text, NULL)
- admin_notes (text, NULL)
- role (character varying(20), NULL DEFAULT 'owner'::character varying)
- listing_contact_email (text, NULL)
- listing_contact_phone (text, NULL)
- proof_url (text, NULL)

**RLS policies**

- _None found in dump._

**Dependencies (FK references)**

- references businesses (id)

**Code usage**

- src/components/admin/ClaimDeleteButton.jsx
  - delete
- src/components/claims/CancelClaimButton.jsx
  - delete
- src/components/onboarding/ClaimAddBusinessModal.jsx
  - select: "id,status"
  - insert: (dynamic keys) (dynamic)
- src/hooks/useOnboardingStatus.js
  - select: '*'
- src/pages/claims/MyClaimsPage.jsx
  - select: `
          *,
          businesses:business_id (
            name,
            city,
            country,
            industry
          )
        `
- src/screens/AdminDashboard.jsx
  - select: "*"
  - update: (dynamic keys)
- src/screens/BusinessPortal.jsx
  - select: '*'
- src/screens/EmailSignatureGenerator.jsx
  - select: "business_id"
- src/screens/InvoiceGenerator.jsx
  - select: 'business_id'
- src/utils/claimRequests.js
  - delete
  - delete
  - delete
- src/utils/userClaimActions.js
  - delete
  - select: `
        *,
        businesses:business_id (name, city, country, industry)
      `

**Potential mismatches**

- Columns referenced in code but not found in schema: id,status
- Schema columns not directly referenced in code: _None detected (or select * in use)._

## contact_access_logs

**Schema columns**

- id (uuid, NOT NULL DEFAULT gen_random_uuid() NOT NULL)
- business_id (uuid, NULL)
- business_name (character varying(255), NOT NULL)
- requester_email (character varying(255), NOT NULL)
- ip_address (text, NULL)
- user_agent (text, NULL)
- created_at (timestamp with time zone, NULL DEFAULT now())

**RLS policies**

- _None found in dump._

**Dependencies (FK references)**

- _None found._

**Code usage**

- _No code usage found._

## countries

**Schema columns**

- id (uuid, NOT NULL DEFAULT gen_random_uuid() NOT NULL)
- code (text, NOT NULL)
- name (text, NOT NULL)
- region (text, NULL)
- created_at (timestamp with time zone, NOT NULL DEFAULT now() NOT NULL)

**RLS policies**

- _None found in dump._

**Dependencies (FK references)**

- _None found._

**Code usage**

- _No code usage found._

## email_campaign_queue

**Schema columns**

- id (uuid, NOT NULL DEFAULT gen_random_uuid() NOT NULL)
- campaign_id (uuid, NOT NULL)
- status (character varying(20), NULL DEFAULT 'queued'::character varying)
- priority (character varying(20), NULL DEFAULT 'normal'::character varying)
- created_at (timestamp with time zone, NULL DEFAULT now())
- scheduled_at (timestamp with time zone, NULL DEFAULT now())
- started_at (timestamp with time zone, NULL)
- completed_at (timestamp with time zone, NULL)
- sent_count (integer, NULL DEFAULT 0)
- failed_count (integer, NULL DEFAULT 0)
- error_message (text, NULL)
- retry_count (integer, NULL DEFAULT 0)
- max_retries (integer, NULL DEFAULT 3)

**RLS policies**

- _None found in dump._

**Dependencies (FK references)**

- references email_campaigns (id)

**Code usage**

- src/app/api/admin/email/processor/route.js
  - select: '*'
  - update: status, started_at
  - update: status, completed_at, sent_count, failed_count
  - update: status, error_message, completed_at
- src/app/api/admin/email/queue-campaign/route.js
  - select: 'id, status'
  - insert: campaign_id, status, priority, created_at, scheduled_at
- src/app/api/admin/email/queue/route.js
  - select: 'id, status'
  - insert: campaign_id, status, priority, created_at, scheduled_at
  - select: `
        *,
        email_campaigns (
          name,
          subject,
          status
        )
      `

**Potential mismatches**

- Columns referenced in code but not found in schema: id, status
- Schema columns not directly referenced in code: _None detected (or select * in use)._

## email_campaign_recipients

**Schema columns**

- id (uuid, NOT NULL DEFAULT gen_random_uuid() NOT NULL)
- campaign_id (uuid, NOT NULL)
- subscriber_id (uuid, NOT NULL)
- email (character varying(255), NOT NULL)
- status (character varying(20), NULL DEFAULT 'pending'::character varying)
- sent_at (timestamp with time zone, NULL)
- opened_at (timestamp with time zone, NULL)
- clicked_at (timestamp with time zone, NULL)
- created_at (timestamp with time zone, NULL DEFAULT now())
- provider_message_id (text, NULL)
- error_message (text, NULL)

**RLS policies**

- _None found in dump._

**Dependencies (FK references)**

- references email_campaigns (id)
- references email_subscribers (id)

**Code usage**

- src/app/api/admin/email/processor/route.js
  - select: 'email'
  - insert: (dynamic keys) (dynamic)
  - update: status, sent_at, provider_message_id
  - update: status, error_message

**Potential mismatches**

- Columns referenced in code but not found in schema: _None detected._
- Schema columns not directly referenced in code: id, campaign_id, subscriber_id, opened_at, clicked_at, created_at
  - _Note: may still be used by triggers, RLS policies, or admin tooling._

## email_campaigns

**Schema columns**

- id (uuid, NOT NULL DEFAULT gen_random_uuid() NOT NULL)
- name (character varying(255), NOT NULL)
- subject (character varying(255), NOT NULL)
- html_content (text, NOT NULL)
- audience (character varying(50), NOT NULL)
- status (character varying(20), NULL DEFAULT 'draft'::character varying)
- sent_at (timestamp with time zone, NULL)
- created_at (timestamp with time zone, NULL DEFAULT now())
- created_by (uuid, NULL)

**RLS policies**

- _None found in dump._

**Dependencies (FK references)**

- references profiles (id)

**Code usage**

- src/app/api/admin/email/campaigns/[id]/audience-preview/route.js
  - select: 'name, audience, subject'
- src/app/api/admin/email/campaigns/route.js
  - select: `
        *,
        email_campaign_recipients (
          id,
          status,
          opened,
          clicked
        )
      `
  - insert: status, created_by
- src/app/api/admin/email/processor/route.js
  - select: '*'
  - update: status
  - update: status, sent_at
  - update: status
- src/app/api/admin/email/queue-campaign/route.js
  - select: '*'
  - update: status
- src/app/api/admin/email/queue/route.js
  - select: '*'
  - update: status

**Potential mismatches**

- Columns referenced in code but not found in schema: name, audience, subject
- Schema columns not directly referenced in code: _None detected (or select * in use)._

## email_events

**Schema columns**

- id (uuid, NOT NULL DEFAULT gen_random_uuid() NOT NULL)
- campaign_id (uuid, NULL)
- recipient_id (uuid, NULL)
- event_type (character varying(20), NOT NULL)
- event_data (jsonb, NULL)
- created_at (timestamp with time zone, NULL DEFAULT now())

**RLS policies**

- _None found in dump._

**Dependencies (FK references)**

- references email_campaigns (id)
- references email_campaign_recipients (id)

**Code usage**

- src/app/api/email/unsubscribe/route.js
  - insert: campaign_id, recipient_id, event_type, event_data, email, method, timestamp

**Potential mismatches**

- Columns referenced in code but not found in schema: email, method, timestamp
- Schema columns not directly referenced in code: id, created_at
  - _Note: may still be used by triggers, RLS policies, or admin tooling._

## email_subscriber_entities

**Schema columns**

- id (uuid, NOT NULL DEFAULT gen_random_uuid() NOT NULL)
- subscriber_id (uuid, NOT NULL)
- entity_type (character varying(50), NOT NULL)
- entity_id (uuid, NOT NULL)
- entity_name (character varying(255), NULL)
- relationship_type (character varying(50), NULL DEFAULT 'owner'::character varying)
- created_at (timestamp with time zone, NULL DEFAULT now())
- updated_at (timestamp with time zone, NULL DEFAULT now())

**RLS policies**

- _None found in dump._

**Dependencies (FK references)**

- references email_subscribers (id)

**Code usage**

- _No code usage found._

## email_subscribers

**Schema columns**

- id (uuid, NOT NULL DEFAULT gen_random_uuid() NOT NULL)
- email (character varying(255), NOT NULL)
- first_name (character varying(255), NULL)
- source (character varying(50), NULL DEFAULT 'manual_import'::character varying)
- status (character varying(20), NULL DEFAULT 'subscribed'::character varying)
- created_at (timestamp with time zone, NULL DEFAULT now())
- updated_at (timestamp with time zone, NULL DEFAULT now())

**RLS policies**

- _None found in dump._

**Dependencies (FK references)**

- _None found._

**Code usage**

- src/app/api/admin/email/subscribers/route.js
  - select: `
        *,
        email_subscriber_entities (
          entity_type,
          entity_name,
          relationship_type
        )
      `
  - upsert: (dynamic keys) (dynamic)
  - update: updated_at
- src/app/api/email/unsubscribe/route.js
  - update: status, updated_at
  - select: 'email, status, first_name, created_at'
  - select: 'email, status, first_name, created_at'
- src/lib/email/getAudienceRecipients.js
  - select: 'id, email, first_name'
  - select: 'id, email, first_name'
  - select: 'id, email, first_name'
  - select: 'id, email, first_name'
  - select: 'id, email, first_name'

**Potential mismatches**

- Columns referenced in code but not found in schema: email, status, first_name, created_at, id, email, first_name
- Schema columns not directly referenced in code: _None detected (or select * in use)._

## email_templates

**Schema columns**

- id (uuid, NOT NULL DEFAULT gen_random_uuid() NOT NULL)
- name (character varying(255), NOT NULL)
- subject (character varying(255), NOT NULL)
- html_content (text, NOT NULL)
- variables (jsonb, NULL DEFAULT '[]'::jsonb)
- created_at (timestamp with time zone, NULL DEFAULT now())
- updated_at (timestamp with time zone, NULL DEFAULT now())
- created_by (uuid, NULL)

**RLS policies**

- _None found in dump._

**Dependencies (FK references)**

- references profiles (id)

**Code usage**

- src/app/api/admin/email/templates/route.js
  - select: '*'
  - insert: variables, created_by
  - update: (dynamic keys) (dynamic)
  - delete

**Potential mismatches**

- Columns referenced in code but not found in schema: _None detected._
- Schema columns not directly referenced in code: _None detected (or select * in use)._

## email_unsubscribe_tokens

**Schema columns**

- id (uuid, NOT NULL DEFAULT gen_random_uuid() NOT NULL)
- token (character varying(64), NOT NULL)
- email (character varying(255), NOT NULL)
- expires_at (timestamp with time zone, NOT NULL)
- created_at (timestamp with time zone, NULL DEFAULT now())
- used_at (timestamp with time zone, NULL)

**RLS policies**

- _None found in dump._

**Dependencies (FK references)**

- _None found._

**Code usage**

- src/app/api/email/token/route.js
  - insert: email, expires_at, created_at
  - select: 'email, expires_at, used_at'
- src/app/api/email/unsubscribe/route.js
  - select: 'email, expires_at, used_at'
  - update: used_at
  - select: 'email, expires_at'

**Potential mismatches**

- Columns referenced in code but not found in schema: email, expires_at, used_at, email, expires_at
- Schema columns not directly referenced in code: id, token
  - _Note: may still be used by triggers, RLS policies, or admin tooling._

## feature_templates

**Schema columns**

- id (bigint, NOT NULL)
- name (text, NOT NULL)
- description (text, NULL)
- format (text, NOT NULL)
- width (integer, NOT NULL)
- height (integer, NOT NULL)
- layout_config (jsonb, NULL DEFAULT '{}'::jsonb)
- style_config (jsonb, NULL DEFAULT '{}'::jsonb)
- is_active (boolean, NULL DEFAULT true)
- is_default (boolean, NULL DEFAULT false)
- usage_count (integer, NULL DEFAULT 0)
- created_at (timestamp with time zone, NULL DEFAULT now())
- updated_at (timestamp with time zone, NULL DEFAULT now())

**RLS policies**

- _None found in dump._

**Dependencies (FK references)**

- references businesses (id)

**Code usage**

- _No code usage found._

## latest_business_insights

**Schema columns**

- _Not found in schema dump._

**RLS policies**

- _None found in dump._

**Dependencies (FK references)**

- _None found._

**Code usage**

- src/screens/Insights.jsx
  - select: '*'

## pacific_places

**Schema columns**

- id (bigint, NOT NULL)
- region (text, NOT NULL)
- country (text, NOT NULL)

**RLS policies**

- _None found in dump._

**Dependencies (FK references)**

- _None found._

**Code usage**

- _No code usage found._

## platform_settings

**Schema columns**

- id (uuid, NOT NULL DEFAULT gen_random_uuid() NOT NULL)
- key (character varying(100), NOT NULL)
- value (text, NULL)
- description (text, NULL)
- updated_at (timestamp with time zone, NULL DEFAULT now())
- updated_by (uuid, NULL)

**RLS policies**

- _None found in dump._

**Dependencies (FK references)**

- references profiles (id)

**Code usage**

- _No code usage found._

## product_services

**Schema columns**

- id (uuid, NOT NULL DEFAULT gen_random_uuid() NOT NULL)
- business_id (uuid, NOT NULL)
- name (text, NOT NULL)
- description (text, NULL)
- price_display (text, NULL)
- image_url (text, NULL)
- created_at (timestamp with time zone, NULL DEFAULT now())

**RLS policies**

- _None found in dump._

**Dependencies (FK references)**

- _None found._

**Code usage**

- src/screens/BusinessProfile.jsx
  - select: "*"

## profiles

**Schema columns**

- id (uuid, NOT NULL)
- display_name (text, NULL)
- email (text, NULL)
- country (text, NULL)
- created_at (timestamp with time zone, NOT NULL DEFAULT now() NOT NULL)
- updated_at (timestamp with time zone, NOT NULL DEFAULT now() NOT NULL)
- primary_cultural (text, NULL)
- education_level (text, NULL)
- professional_background (text[], NULL)
- business_networks (text[], NULL)
- mentorship_availability (boolean, NULL DEFAULT false)
- investment_interest (text, NULL)
- community_involvement (text[], NULL)
- skills_expertise (text[], NULL)
- business_goals (text, NULL)
- challenges_faced (text[], NULL)
- success_factors (text[], NULL)
- preferred_collaboration (text[], NULL)
- role (public.app_role, NULL DEFAULT 'owner'::public.app_role)
- years_operating (integer, NULL)
- business_role (text, NULL)
- city (text, NULL)
- languages (text[], NULL DEFAULT '{}'::text[])
- market_region (text, NULL)
- pending_business_id (uuid, NULL)
- pending_business_name (text, NULL)
- invited_by (uuid, NULL)
- invited_date (timestamp with time zone, NULL)
- status (text, NULL DEFAULT 'active'::text)
- gdpr_consent (boolean, NULL DEFAULT false)
- gdpr_consent_date (timestamp with time zone, NULL)

**RLS policies**

- _None found in dump._

**Dependencies (FK references)**

- references profiles (id)
- references businesses (id)

**Code usage**

- src/app/api/admin/referral-draw/route.js
  - select: 'role'
  - select: 'role'
- src/app/customer-portal/page.jsx
  - select: '*'
  - insert: id, full_name
  - update: pending_business_id, pending_business_name, invited_by, invited_date, status
- src/components/layout/Layout.jsx
  - select: 'role, display_name'
- src/components/onboarding/ProfileSetupModal.jsx
  - select: '*'
  - upsert: id, updated_at (dynamic)
- src/hooks/useOnboardingStatus.js
  - select: '*'
- src/lib/email/getAudienceRecipients.js
  - select: 'id, email'
  - select: 'id, email, display_name'
  - select: 'id, email, display_name'
  - select: 'id, email, display_name'
  - select: 'id, email, display_name'
- src/lib/server-auth.js
  - select: 'role'
- src/screens/AdminDashboard.jsx
  - select: "role, display_name"
- src/screens/AdminLogin.jsx
  - select: 'role'
- src/screens/BusinessPortal.jsx
  - select: "*"
  - select: 'role, display_name'
  - select: '*'
  - update: pending_business_id, pending_business_name, invited_by, invited_date
  - insert: email, display_name, pending_business_id, pending_business_name, invited_by, invited_date, status
- src/screens/ProfileSettings.jsx
  - select: 'role, display_name'
  - select: '*'
  - update: display_name
  - insert: id, email, full_name, display_name, role
  - update: role

**Potential mismatches**

- Columns referenced in code but not found in schema: full_name, role, display_name, id, email, id, email, display_name
- Schema columns not directly referenced in code: _None detected (or select * in use)._

## referrals

**Schema columns**

- id (uuid, NOT NULL DEFAULT gen_random_uuid() NOT NULL)
- referrer_business_id (uuid, NOT NULL)
- referred_business_id (uuid, NOT NULL)
- created_at (timestamp with time zone, NULL DEFAULT now())
- status (text, NOT NULL DEFAULT 'pending'::text NOT NULL)

**RLS policies**

- _None found in dump._

**Dependencies (FK references)**

- references businesses (id)
- references businesses (id)

**Code usage**

- src/app/api/admin/referral-draw/route.js
  - select: 'referrer_business_id, created_at'
- src/lib/email/getAudienceRecipients.js
  - select: 'referrer_business_id'

**Potential mismatches**

- Columns referenced in code but not found in schema: referrer_business_id, created_at
- Schema columns not directly referenced in code: id, referred_business_id, created_at, status
  - _Note: may still be used by triggers, RLS policies, or admin tooling._

## shop_analytics

**Schema columns**

- id (bigint, NOT NULL)
- seller_id (bigint, NULL)
- date (date, NOT NULL DEFAULT CURRENT_DATE NOT NULL)
- page_views (integer, NULL DEFAULT 0)
- contact_clicks (integer, NULL DEFAULT 0)
- created_at (timestamp with time zone, NULL DEFAULT now())
- event_type (character varying(50), NULL)
- event_data (jsonb, NULL DEFAULT '{}'::jsonb)
- visitor_id (character varying(100), NULL)
- session_id (character varying(100), NULL)
- admin_listing_id (integer, NULL)
- user_agent (text, NULL)
- device_type (character varying(20), NULL)
- referrer (text, NULL)
- ip_address (text, NULL)

**RLS policies**

- _None found in dump._

**Dependencies (FK references)**

- _None found._

**Code usage**

- _No code usage found._

## subscriptions

**Schema columns**

- id (uuid, NOT NULL DEFAULT gen_random_uuid() NOT NULL)
- user_id (uuid, NOT NULL)
- business_id (uuid, NULL)
- stripe_subscription_id (text, NULL)
- stripe_customer_id (text, NULL)
- plan_type (character varying(50), NOT NULL)
- status (character varying(20), NULL DEFAULT 'active'::character varying)
- current_period_start (timestamp with time zone, NULL)
- current_period_end (timestamp with time zone, NULL)
- cancel_at_period_end (boolean, NULL DEFAULT false)
- created_at (timestamp with time zone, NULL DEFAULT now())
- updated_at (timestamp with time zone, NULL DEFAULT now())

**RLS policies**

- _None found in dump._

**Dependencies (FK references)**

- references businesses (id)

**Code usage**

- _No code usage found._

## users

**Schema columns**

- _Not found in schema dump._

**RLS policies**

- _None found in dump._

**Dependencies (FK references)**

- _None found._

**Code usage**

- src/app/api/notifications/business-added/route.js
  - select: '*'
- src/app/api/notifications/business-claimed/route.js
  - select: '*'
- src/app/api/notifications/business-updated/route.js
  - select: '*'
- src/app/api/notifications/claim-submitted/route.js
  - select: '*'
- src/app/api/stripe/webhook/route.js
  - select: '*'
  - select: '*'

