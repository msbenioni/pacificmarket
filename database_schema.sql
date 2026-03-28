-- Pacific Discovery Network Database Schema
-- Generated on: 2026-03-28T23:36:10.825Z
-- Connection: postgresql://postgres:***@db.mnmisjprswpuvcojnbip.supabase.co:5432/postgres


-- ========================================
-- BASE TABLE: admin_notifications
-- ========================================

CREATE TABLE admin_notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  entity_type text NULL,
  entity_id uuid NULL,
  user_id uuid NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE admin_notifications ADD PRIMARY KEY (id);
CREATE INDEX idx_admin_notifications_type ON public.admin_notifications USING btree (type);
CREATE INDEX idx_admin_notifications_is_read ON public.admin_notifications USING btree (is_read);
CREATE INDEX idx_admin_notifications_entity ON public.admin_notifications USING btree (entity_type, entity_id);
CREATE INDEX idx_admin_notifications_user_id ON public.admin_notifications USING btree (user_id);

-- RLS Policies for admin_notifications
ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can update notifications" ON admin_notifications
  FOR UPDATE PERMISSIVE USING ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::app_role)))));
CREATE POLICY "Admins can view all notifications" ON admin_notifications
  FOR SELECT PERMISSIVE USING ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::app_role)))));
CREATE POLICY "Service role full access notifications" ON admin_notifications
  FOR ALL PERMISSIVE USING ((auth.role() = 'service_role'::text)) WITH CHECK ((auth.role() = 'service_role'::text));


-- ========================================
-- BASE TABLE: audit_logs
-- ========================================

CREATE TABLE audit_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  table_name VARCHAR(50) NOT NULL,
  record_id uuid NOT NULL,
  action VARCHAR(10) NOT NULL,
  old_data jsonb NULL,
  new_data jsonb NULL,
  user_id uuid NULL,
  ip_address inet NULL,
  user_agent text NULL,
  created_at timestamp with time zone NULL DEFAULT now()
);
ALTER TABLE audit_logs ADD PRIMARY KEY (id);
CREATE INDEX idx_audit_logs_table_name ON public.audit_logs USING btree (table_name);
CREATE INDEX idx_audit_logs_record_id ON public.audit_logs USING btree (record_id);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs USING btree (user_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs USING btree (created_at);


-- ========================================
-- BASE TABLE: backup_businesses
-- ========================================

CREATE TABLE backup_businesses (
  id uuid NULL,
  name VARCHAR(255) NULL,
  description text NULL,
  short_description text NULL,
  logo_url text NULL,
  contact_website text NULL,
  contact_email VARCHAR(255) NULL,
  contact_phone VARCHAR(50) NULL,
  address text NULL,
  country VARCHAR(100) NULL,
  industry VARCHAR(100) NULL,
  status VARCHAR(20) NULL,
  user_id uuid NULL,
  created_at timestamp with time zone NULL,
  updated_at timestamp with time zone NULL,
  created_date date NULL,
  contact_name text NULL,
  languages_spoken ARRAY NULL,
  social_links jsonb NULL,
  suburb text NULL,
  city text NULL,
  state_region text NULL,
  postal_code text NULL,
  business_hours text NULL,
  banner_url text NULL,
  cultural_identity text NULL,
  claimed boolean NULL,
  claimed_at timestamp with time zone NULL,
  claimed_by text NULL,
  business_handle text NULL,
  verified boolean NULL,
  owner_user_id uuid NULL,
  proof_links ARRAY NULL,
  homepage_featured boolean NULL,
  visibility_tier text NULL,
  business_structure text NULL,
  annual_revenue_exact integer NULL,
  full_time_employees integer NULL,
  part_time_employees integer NULL,
  primary_market text NULL,
  growth_stage text NULL,
  funding_source text NULL,
  business_challenges ARRAY NULL,
  future_plans text NULL,
  tech_stack ARRAY NULL,
  customer_segments ARRAY NULL,
  competitive_advantage text NULL,
  year_started integer NULL,
  created_by uuid NULL,
  source text NULL,
  profile_completeness NUMERIC(3, 2) NULL,
  referral_code text NULL,
  subscription_tier VARCHAR(20) NULL,
  business_operating_status text NULL,
  business_age text NULL,
  business_registered boolean NULL,
  sales_channels jsonb NULL,
  import_export_status text NULL,
  team_size_band text NULL,
  revenue_band text NULL,
  business_owner text NULL,
  business_owner_email text NULL,
  additional_owner_emails ARRAY NULL,
  public_phone text NULL
);


-- ========================================
-- BASE TABLE: backup_profiles
-- ========================================

CREATE TABLE backup_profiles (
  id uuid NULL,
  display_name text NULL,
  email text NULL,
  country text NULL,
  created_at timestamp with time zone NULL,
  updated_at timestamp with time zone NULL,
  primary_cultural text NULL,
  education_level text NULL,
  professional_background ARRAY NULL,
  business_networks ARRAY NULL,
  mentorship_availability boolean NULL,
  investment_interest text NULL,
  community_involvement ARRAY NULL,
  skills_expertise ARRAY NULL,
  business_goals text NULL,
  challenges_faced ARRAY NULL,
  success_factors ARRAY NULL,
  preferred_collaboration ARRAY NULL,
  role UUID NULL,
  years_operating integer NULL,
  business_role text NULL,
  city text NULL,
  languages ARRAY NULL,
  market_region text NULL,
  pending_business_id uuid NULL,
  pending_business_name text NULL,
  invited_by uuid NULL,
  invited_date timestamp with time zone NULL,
  status text NULL,
  gdpr_consent boolean NULL,
  gdpr_consent_date timestamp with time zone NULL,
  cultural_tags ARRAY NULL
);


-- ========================================
-- BASE TABLE: business_images
-- ========================================

CREATE TABLE business_images (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL,
  url text NOT NULL,
  caption text NULL,
  sort_order integer NULL DEFAULT 0,
  created_at timestamp with time zone NULL DEFAULT now()
);
ALTER TABLE business_images ADD PRIMARY KEY (id);


-- ========================================
-- BASE TABLE: business_referral_rewards
-- ========================================

CREATE TABLE business_referral_rewards (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  referrer_business_id uuid NOT NULL,
  referred_business_id uuid NOT NULL,
  reward_type text NOT NULL DEFAULT 'moana_extension'::text,
  reward_days integer NOT NULL DEFAULT 31,
  status text NOT NULL DEFAULT 'pending'::text,
  eligibility_reason text NULL,
  applied_at timestamp with time zone NULL,
  applied_by text NOT NULL DEFAULT 'system'::text,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now()
);
ALTER TABLE business_referral_rewards ADD PRIMARY KEY (id);
ALTER TABLE business_referral_rewards ADD CONSTRAINT business_referral_rewards_referred_business_id_fkey FOREIGN KEY (referred_business_id) REFERENCES businesses(id);
ALTER TABLE business_referral_rewards ADD CONSTRAINT business_referral_rewards_referrer_business_id_fkey FOREIGN KEY (referrer_business_id) REFERENCES businesses(id);
CREATE UNIQUE INDEX business_referral_rewards_referred_business_id_key ON public.business_referral_rewards USING btree (referred_business_id);
CREATE INDEX idx_referral_rewards_referrer ON public.business_referral_rewards USING btree (referrer_business_id);
CREATE INDEX idx_referral_rewards_referred ON public.business_referral_rewards USING btree (referred_business_id);
CREATE INDEX idx_referral_rewards_status ON public.business_referral_rewards USING btree (status);

-- RLS Policies for business_referral_rewards
ALTER TABLE business_referral_rewards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view all referral rewards" ON business_referral_rewards
  FOR SELECT PERMISSIVE USING ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::app_role)))));
CREATE POLICY "Business owners can view their referral rewards" ON business_referral_rewards
  FOR SELECT PERMISSIVE USING ((auth.uid() = ( SELECT businesses.owner_user_id
   FROM businesses
  WHERE (businesses.id = business_referral_rewards.referrer_business_id))));
CREATE POLICY "Service role can manage referral rewards" ON business_referral_rewards
  FOR ALL PERMISSIVE USING ((auth.role() = 'service_role'::text));


-- ========================================
-- BASE TABLE: businesses
-- ========================================

CREATE TABLE businesses (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  business_name VARCHAR(255) NOT NULL,
  description text NULL,
  logo_url text NULL,
  business_website text NULL,
  business_email VARCHAR(255) NULL,
  business_phone VARCHAR(50) NULL,
  address text NULL,
  country VARCHAR(100) NULL,
  industry VARCHAR(100) NULL,
  status VARCHAR(20) NULL DEFAULT 'pending'::character varying,
  user_id uuid NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  created_date date NULL DEFAULT CURRENT_DATE,
  business_contact_person text NULL,
  social_links jsonb NULL,
  suburb text NULL,
  city text NULL,
  state_region text NULL,
  postal_code text NULL,
  business_hours text NULL,
  banner_url text NULL,
  is_claimed boolean NULL DEFAULT false,
  claimed_at timestamp with time zone NULL,
  claimed_by text NULL,
  business_handle text NULL,
  is_verified boolean NULL DEFAULT false,
  owner_user_id uuid NULL,
  visibility_tier text NOT NULL DEFAULT 'none'::text,
  business_structure text NULL,
  year_started integer NULL,
  created_by uuid NULL,
  source text NULL DEFAULT 'user'::text,
  profile_completeness NUMERIC(3, 2) NULL DEFAULT 0.0,
  referral_code text NULL,
  subscription_tier VARCHAR(20) NULL DEFAULT 'vaka'::character varying,
  is_business_registered boolean NULL DEFAULT false,
  team_size_band text NULL,
  tagline text NULL,
  mobile_banner_url text NULL,
  business_acquisition_interest boolean NULL DEFAULT false,
  founder_story text NULL,
  age_range text NULL,
  gender text NULL,
  collaboration_interest boolean NULL DEFAULT false,
  mentorship_offering boolean NULL DEFAULT false,
  open_to_future_contact boolean NULL DEFAULT false,
  business_stage text NULL,
  generated_logo_url text NULL,
  generated_banner_url text NULL,
  generated_mobile_banner_url text NULL,
  role text NULL,
  cultural_identity text NULL,
  languages_spoken text NULL,
  visibility_mode text NULL DEFAULT 'auto'::text,
  is_active boolean NULL DEFAULT true,
  referred_by_business_id uuid NULL,
  referral_reward_applied boolean NOT NULL DEFAULT false,
  referral_reward_applied_at timestamp with time zone NULL,
  tier_expires_at timestamp with time zone NULL,
  referral_count integer NOT NULL DEFAULT 0,
  created_via text NULL DEFAULT 'admin'::text
);
ALTER TABLE businesses ADD PRIMARY KEY (id);
ALTER TABLE businesses ADD CONSTRAINT businesses_referred_by_business_id_fkey FOREIGN KEY (referred_by_business_id) REFERENCES businesses(id);
CREATE UNIQUE INDEX businesses_business_handle_unique ON public.businesses USING btree (business_handle);
CREATE INDEX idx_businesses_owner_user_id ON public.businesses USING btree (owner_user_id);
CREATE INDEX idx_businesses_business_handle ON public.businesses USING btree (business_handle);
CREATE INDEX idx_businesses_created_date ON public.businesses USING btree (created_date);
CREATE INDEX idx_businesses_created_via ON public.businesses USING btree (created_via);
CREATE INDEX idx_businesses_subscription_tier ON public.businesses USING btree (subscription_tier);
CREATE INDEX idx_businesses_business_structure ON public.businesses USING btree (business_structure);
CREATE INDEX idx_businesses_status ON public.businesses USING btree (status);
CREATE INDEX idx_businesses_country ON public.businesses USING btree (country);
CREATE INDEX idx_businesses_industry ON public.businesses USING btree (industry);
CREATE INDEX idx_businesses_stage ON public.businesses USING btree (business_stage);
CREATE INDEX idx_businesses_collaboration ON public.businesses USING btree (collaboration_interest);
CREATE INDEX idx_businesses_mentorship ON public.businesses USING btree (mentorship_offering);
CREATE INDEX idx_businesses_user_id ON public.businesses USING btree (user_id);
CREATE INDEX idx_businesses_social_links ON public.businesses USING gin (social_links);
CREATE INDEX idx_businesses_suburb ON public.businesses USING btree (suburb);
CREATE INDEX idx_businesses_city ON public.businesses USING btree (city);
CREATE INDEX idx_businesses_state_region ON public.businesses USING btree (state_region);
CREATE INDEX idx_businesses_postal_code ON public.businesses USING btree (postal_code);
CREATE INDEX idx_businesses_visibility_mode ON public.businesses USING btree (visibility_mode);
CREATE INDEX idx_businesses_referred_by ON public.businesses USING btree (referred_by_business_id);
CREATE INDEX businesses_contact_email_idx ON public.businesses USING btree (business_email);
CREATE INDEX businesses_user_id_idx ON public.businesses USING btree (user_id);
CREATE UNIQUE INDEX businesses_shop_handle_unique ON public.businesses USING btree (lower(business_handle)) WHERE ((business_handle IS NOT NULL) AND (business_handle <> ''::text));
CREATE INDEX idx_businesses_referral_code ON public.businesses USING btree (referral_code);
CREATE INDEX idx_businesses_referral_reward_applied ON public.businesses USING btree (referral_reward_applied);
CREATE INDEX idx_businesses_owner ON public.businesses USING btree (owner_user_id);
CREATE INDEX idx_businesses_handle ON public.businesses USING btree (business_handle);
CREATE INDEX idx_businesses_email ON public.businesses USING btree (business_email);
CREATE INDEX idx_businesses_subscription ON public.businesses USING btree (subscription_tier);
CREATE INDEX idx_businesses_verified ON public.businesses USING btree (is_verified);
CREATE INDEX idx_businesses_created ON public.businesses USING btree (created_at);

-- RLS Policies for businesses
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage all businesses" ON businesses
  FOR ALL PERMISSIVE USING (((auth.role() = 'service_role'::text) OR ((auth.uid() IS NOT NULL) AND (EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::app_role)))))));
CREATE POLICY "Authenticated can view approved businesses" ON businesses
  FOR SELECT PERMISSIVE USING (((auth.role() = 'authenticated'::text) AND ((status)::text = 'active'::text)));
CREATE POLICY "Public can view approved businesses" ON businesses
  FOR SELECT PERMISSIVE USING (((status)::text = 'active'::text));


-- ========================================
-- BASE TABLE: businesses_duplicate
-- ========================================

CREATE TABLE businesses_duplicate (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description text NULL,
  logo_url text NULL,
  contact_website text NULL,
  contact_email VARCHAR(255) NULL,
  contact_phone VARCHAR(50) NULL,
  address text NULL,
  country VARCHAR(100) NULL,
  industry VARCHAR(100) NULL,
  status VARCHAR(20) NULL DEFAULT 'pending'::character varying,
  user_id uuid NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  created_date date NULL DEFAULT CURRENT_DATE,
  contact_name text NULL,
  languages_spoken ARRAY NULL,
  social_links jsonb NULL,
  suburb text NULL,
  city text NULL,
  state_region text NULL,
  postal_code text NULL,
  business_hours text NULL,
  banner_url text NULL,
  cultural_identity text NULL,
  is_claimed boolean NULL DEFAULT false,
  claimed_at timestamp with time zone NULL,
  claimed_by text NULL,
  business_handle text NULL,
  is_verified boolean NULL DEFAULT false,
  owner_user_id uuid NULL,
  proof_links ARRAY NULL,
  is_homepage_featured boolean NOT NULL DEFAULT false,
  visibility_tier text NOT NULL DEFAULT 'none'::text,
  business_structure text NULL,
  year_started integer NULL,
  created_by uuid NULL,
  source text NULL DEFAULT 'user'::text,
  profile_completeness NUMERIC(3, 2) NULL DEFAULT 0.0,
  referral_code text NULL,
  subscription_tier VARCHAR(20) NULL DEFAULT 'vaka'::character varying,
  business_registered boolean NULL DEFAULT false,
  sales_channels jsonb NULL DEFAULT '[]'::jsonb,
  team_size_band text NULL,
  business_owner text NULL,
  business_owner_email text NULL,
  additional_owner_emails ARRAY NULL,
  tagline text NULL,
  mobile_banner_url text NULL,
  business_acquisition_interest boolean NULL DEFAULT false,
  founder_story text NULL,
  age_range text NULL,
  gender text NULL,
  collaboration_interest boolean NULL DEFAULT false,
  mentorship_offering boolean NULL DEFAULT false,
  open_to_future_contact boolean NULL DEFAULT false,
  business_stage text NULL,
  generated_logo_url text NULL,
  generated_banner_url text NULL,
  generated_mobile_banner_url text NULL
);
ALTER TABLE businesses_duplicate ADD PRIMARY KEY (id);
CREATE INDEX businesses_duplicate_status_idx ON public.businesses_duplicate USING btree (status);
CREATE INDEX businesses_duplicate_country_idx ON public.businesses_duplicate USING btree (country);
CREATE INDEX businesses_duplicate_industry_idx ON public.businesses_duplicate USING btree (industry);
CREATE INDEX businesses_duplicate_user_id_idx ON public.businesses_duplicate USING btree (user_id);
CREATE INDEX businesses_duplicate_languages_spoken_idx ON public.businesses_duplicate USING gin (languages_spoken);
CREATE INDEX businesses_duplicate_social_links_idx ON public.businesses_duplicate USING gin (social_links);
CREATE INDEX businesses_duplicate_suburb_idx ON public.businesses_duplicate USING btree (suburb);
CREATE INDEX businesses_duplicate_city_idx ON public.businesses_duplicate USING btree (city);
CREATE INDEX businesses_duplicate_state_region_idx ON public.businesses_duplicate USING btree (state_region);
CREATE INDEX businesses_duplicate_postal_code_idx ON public.businesses_duplicate USING btree (postal_code);
CREATE INDEX businesses_duplicate_cultural_identity_idx ON public.businesses_duplicate USING btree (cultural_identity);
CREATE INDEX businesses_duplicate_contact_email_idx ON public.businesses_duplicate USING btree (contact_email);
CREATE INDEX businesses_duplicate_user_id_idx1 ON public.businesses_duplicate USING btree (user_id);
CREATE UNIQUE INDEX businesses_duplicate_lower_idx ON public.businesses_duplicate USING btree (lower(business_handle)) WHERE ((business_handle IS NOT NULL) AND (business_handle <> ''::text));
CREATE INDEX businesses_duplicate_business_structure_idx ON public.businesses_duplicate USING btree (business_structure);
CREATE UNIQUE INDEX businesses_duplicate_business_handle_key ON public.businesses_duplicate USING btree (business_handle);
CREATE INDEX businesses_duplicate_owner_user_id_idx ON public.businesses_duplicate USING btree (owner_user_id);
CREATE INDEX businesses_duplicate_business_handle_idx ON public.businesses_duplicate USING btree (business_handle);
CREATE INDEX businesses_duplicate_created_date_idx ON public.businesses_duplicate USING btree (created_date);
CREATE INDEX businesses_duplicate_referral_code_idx ON public.businesses_duplicate USING btree (referral_code);
CREATE INDEX businesses_duplicate_subscription_tier_idx ON public.businesses_duplicate USING btree (subscription_tier);
CREATE INDEX businesses_duplicate_business_owner_email_idx ON public.businesses_duplicate USING btree (business_owner_email);
CREATE INDEX businesses_duplicate_additional_owner_emails_idx ON public.businesses_duplicate USING gin (additional_owner_emails);
CREATE INDEX businesses_duplicate_owner_user_id_idx1 ON public.businesses_duplicate USING btree (owner_user_id);
CREATE INDEX businesses_duplicate_business_handle_idx1 ON public.businesses_duplicate USING btree (business_handle);
CREATE INDEX businesses_duplicate_contact_email_idx1 ON public.businesses_duplicate USING btree (contact_email);
CREATE INDEX businesses_duplicate_business_owner_email_idx1 ON public.businesses_duplicate USING btree (business_owner_email);
CREATE INDEX businesses_duplicate_subscription_tier_idx1 ON public.businesses_duplicate USING btree (subscription_tier);
CREATE INDEX businesses_duplicate_verified_idx ON public.businesses_duplicate USING btree (is_verified);
CREATE INDEX businesses_duplicate_created_at_idx ON public.businesses_duplicate USING btree (created_at);
CREATE INDEX businesses_duplicate_additional_owner_emails_idx1 ON public.businesses_duplicate USING gin (additional_owner_emails);
CREATE INDEX businesses_duplicate_languages_spoken_idx1 ON public.businesses_duplicate USING gin (languages_spoken);
CREATE INDEX businesses_duplicate_business_stage_idx ON public.businesses_duplicate USING btree (business_stage);
CREATE INDEX businesses_duplicate_collaboration_interest_idx ON public.businesses_duplicate USING btree (collaboration_interest);
CREATE INDEX businesses_duplicate_mentorship_offering_idx ON public.businesses_duplicate USING btree (mentorship_offering);


-- ========================================
-- BASE TABLE: claim_requests
-- ========================================

CREATE TABLE claim_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL,
  user_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending'::text,
  business_email text NULL,
  business_phone text NULL,
  role text NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  claim_type VARCHAR(20) NULL DEFAULT 'request'::character varying,
  message text NULL,
  reviewed_by uuid NULL,
  reviewed_at timestamp with time zone NULL,
  created_via text NULL DEFAULT 'admin'::text
);
ALTER TABLE claim_requests ADD PRIMARY KEY (id);
ALTER TABLE claim_requests ADD CONSTRAINT claim_requests_business_id_fkey FOREIGN KEY (business_id) REFERENCES businesses(id);
ALTER TABLE claim_requests ADD CONSTRAINT claim_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id);
CREATE INDEX idx_claim_requests_user_id ON public.claim_requests USING btree (user_id);
CREATE INDEX idx_claim_requests_business_id ON public.claim_requests USING btree (business_id);
CREATE INDEX idx_claim_requests_status ON public.claim_requests USING btree (status);
CREATE INDEX idx_claim_requests_created_at ON public.claim_requests USING btree (created_at);
CREATE INDEX idx_claim_requests_created_via ON public.claim_requests USING btree (created_via);

-- RLS Policies for claim_requests
ALTER TABLE claim_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage all claim requests" ON claim_requests
  FOR ALL PERMISSIVE USING (((auth.role() = 'service_role'::text) OR ((auth.uid() IS NOT NULL) AND (EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::app_role)))))));
CREATE POLICY "Users can create claim requests" ON claim_requests
  FOR INSERT PERMISSIVE WITH CHECK ((auth.uid() = user_id));
CREATE POLICY "Users can delete their own pending claim requests" ON claim_requests
  FOR DELETE PERMISSIVE USING (((auth.uid() = user_id) AND (status = 'pending'::text)));
CREATE POLICY "Users can update their own pending claim requests" ON claim_requests
  FOR UPDATE PERMISSIVE USING (((auth.uid() = user_id) AND (status = 'pending'::text))) WITH CHECK (((auth.uid() = user_id) AND (status = 'pending'::text)));
CREATE POLICY "Users can view their own claim requests" ON claim_requests
  FOR SELECT PERMISSIVE USING ((auth.uid() = user_id));


-- ========================================
-- BASE TABLE: claim_requests_backup_cleanup
-- ========================================

CREATE TABLE claim_requests_backup_cleanup (
  id uuid NULL,
  business_id uuid NULL,
  user_id uuid NULL,
  status text NULL,
  contact_email text NULL,
  contact_phone text NULL,
  verification_documents text NULL,
  rejection_reason text NULL,
  reviewed_by uuid NULL,
  reviewed_at timestamp with time zone NULL,
  business_name text NULL,
  user_email text NULL,
  role text NULL,
  proof_url text NULL,
  created_at timestamp with time zone NULL,
  updated_at timestamp with time zone NULL,
  claim_type VARCHAR(20) NULL,
  listing_contact_email text NULL,
  listing_contact_phone text NULL,
  message text NULL
);


-- ========================================
-- BASE TABLE: countries
-- ========================================

CREATE TABLE countries (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  code text NOT NULL,
  name text NOT NULL,
  region text NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE countries ADD PRIMARY KEY (id);
CREATE UNIQUE INDEX countries_code_key ON public.countries USING btree (code);


-- ========================================
-- BASE TABLE: email_campaign_queue
-- ========================================

CREATE TABLE email_campaign_queue (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'queued'::character varying,
  priority integer NOT NULL DEFAULT 2,
  created_at timestamp with time zone NULL DEFAULT now(),
  scheduled_at timestamp with time zone NULL DEFAULT now(),
  started_at timestamp with time zone NULL,
  completed_at timestamp with time zone NULL,
  sent_count integer NULL DEFAULT 0,
  failed_count integer NULL DEFAULT 0,
  error_message text NULL,
  retry_count integer NULL DEFAULT 0,
  max_retries integer NULL DEFAULT 3
);
ALTER TABLE email_campaign_queue ADD PRIMARY KEY (id);
ALTER TABLE email_campaign_queue ADD CONSTRAINT email_campaign_queue_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES email_campaigns(id);
CREATE UNIQUE INDEX email_campaign_queue_campaign_id_key ON public.email_campaign_queue USING btree (campaign_id);
CREATE INDEX idx_email_campaign_queue_status ON public.email_campaign_queue USING btree (status);
CREATE INDEX idx_email_campaign_queue_priority ON public.email_campaign_queue USING btree (priority DESC, created_at);

-- RLS Policies for email_campaign_queue
ALTER TABLE email_campaign_queue ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin full access to email_campaign_queue" ON email_campaign_queue
  FOR ALL PERMISSIVE USING (is_admin()) WITH CHECK (is_admin());


-- ========================================
-- BASE TABLE: email_campaign_recipients
-- ========================================

CREATE TABLE email_campaign_recipients (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL,
  subscriber_id uuid NULL,
  email VARCHAR(255) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending'::character varying,
  sent_at timestamp with time zone NULL,
  opened_at timestamp with time zone NULL,
  clicked_at timestamp with time zone NULL,
  provider_message_id VARCHAR(255) NULL,
  error_message text NULL,
  created_at timestamp with time zone NULL DEFAULT now()
);
ALTER TABLE email_campaign_recipients ADD PRIMARY KEY (id);
ALTER TABLE email_campaign_recipients ADD CONSTRAINT email_campaign_recipients_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES email_campaigns(id);
ALTER TABLE email_campaign_recipients ADD CONSTRAINT email_campaign_recipients_subscriber_id_fkey FOREIGN KEY (subscriber_id) REFERENCES email_subscribers(id);
CREATE UNIQUE INDEX email_campaign_recipients_campaign_id_email_key ON public.email_campaign_recipients USING btree (campaign_id, email);
CREATE INDEX idx_email_campaign_recipients_campaign_id ON public.email_campaign_recipients USING btree (campaign_id);
CREATE INDEX idx_email_campaign_recipients_email ON public.email_campaign_recipients USING btree (email);

-- RLS Policies for email_campaign_recipients
ALTER TABLE email_campaign_recipients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin full access to email_campaign_recipients" ON email_campaign_recipients
  FOR ALL PERMISSIVE USING (is_admin()) WITH CHECK (is_admin());


-- ========================================
-- BASE TABLE: email_campaigns
-- ========================================

CREATE TABLE email_campaigns (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  html_content text NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'draft'::character varying,
  recipients integer NULL DEFAULT 0,
  opens integer NULL DEFAULT 0,
  clicks integer NULL DEFAULT 0,
  open_rate NUMERIC(5, 2) NULL DEFAULT 0,
  sent_at timestamp with time zone NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  created_by uuid NULL,
  updated_at timestamp with time zone NULL DEFAULT now(),
  audience_type VARCHAR(50) NULL,
  audience_value VARCHAR(100) NULL
);
ALTER TABLE email_campaigns ADD PRIMARY KEY (id);
CREATE INDEX idx_email_campaigns_status ON public.email_campaigns USING btree (status);
CREATE INDEX idx_email_campaigns_created_at ON public.email_campaigns USING btree (created_at DESC);
CREATE INDEX idx_email_campaigns_audience_type ON public.email_campaigns USING btree (audience_type, audience_value);

-- RLS Policies for email_campaigns
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin full access to email_campaigns" ON email_campaigns
  FOR ALL PERMISSIVE USING (is_admin()) WITH CHECK (is_admin());


-- ========================================
-- BASE TABLE: email_events
-- ========================================

CREATE TABLE email_events (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  campaign_id uuid NULL,
  recipient_id uuid NULL,
  event_type VARCHAR(20) NOT NULL,
  event_data jsonb NULL,
  created_at timestamp with time zone NULL DEFAULT now()
);
ALTER TABLE email_events ADD PRIMARY KEY (id);
ALTER TABLE email_events ADD CONSTRAINT email_events_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES email_campaigns(id);
ALTER TABLE email_events ADD CONSTRAINT email_events_recipient_id_fkey FOREIGN KEY (recipient_id) REFERENCES email_campaign_recipients(id);
CREATE INDEX idx_email_events_campaign_id ON public.email_events USING btree (campaign_id);

-- RLS Policies for email_events
ALTER TABLE email_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin full access to email_events" ON email_events
  FOR ALL PERMISSIVE USING (is_admin()) WITH CHECK (is_admin());


-- ========================================
-- BASE TABLE: email_subscriber_entities
-- ========================================

CREATE TABLE email_subscriber_entities (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  subscriber_id uuid NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id uuid NOT NULL,
  entity_name VARCHAR(255) NULL,
  relationship_type VARCHAR(50) NOT NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now()
);
ALTER TABLE email_subscriber_entities ADD PRIMARY KEY (id);
ALTER TABLE email_subscriber_entities ADD CONSTRAINT email_subscriber_entities_subscriber_id_fkey FOREIGN KEY (subscriber_id) REFERENCES email_subscribers(id);
CREATE UNIQUE INDEX email_subscriber_entities_subscriber_id_entity_type_entity__key ON public.email_subscriber_entities USING btree (subscriber_id, entity_type, entity_id);
CREATE INDEX idx_email_subscriber_entities_subscriber_id ON public.email_subscriber_entities USING btree (subscriber_id);

-- RLS Policies for email_subscriber_entities
ALTER TABLE email_subscriber_entities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin full access to email_subscriber_entities" ON email_subscriber_entities
  FOR ALL PERMISSIVE USING (is_admin()) WITH CHECK (is_admin());


-- ========================================
-- BASE TABLE: email_subscribers
-- ========================================

CREATE TABLE email_subscribers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  first_name VARCHAR(255) NULL,
  source VARCHAR(50) NOT NULL DEFAULT 'manual_import'::character varying,
  status VARCHAR(20) NOT NULL DEFAULT 'subscribed'::character varying,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now()
);
ALTER TABLE email_subscribers ADD PRIMARY KEY (id);
CREATE UNIQUE INDEX email_subscribers_email_key ON public.email_subscribers USING btree (email);
CREATE INDEX idx_email_subscribers_email ON public.email_subscribers USING btree (email);
CREATE INDEX idx_email_subscribers_status ON public.email_subscribers USING btree (status);

-- RLS Policies for email_subscribers
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin full access to email_subscribers" ON email_subscribers
  FOR ALL PERMISSIVE USING (is_admin()) WITH CHECK (is_admin());


-- ========================================
-- BASE TABLE: email_templates
-- ========================================

CREATE TABLE email_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  html_content text NOT NULL,
  variables ARRAY NULL DEFAULT '{}'::text[],
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  created_by uuid NULL
);
ALTER TABLE email_templates ADD PRIMARY KEY (id);

-- RLS Policies for email_templates
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin full access to email_templates" ON email_templates
  FOR ALL PERMISSIVE USING (is_admin()) WITH CHECK (is_admin());


-- ========================================
-- BASE TABLE: homepage_featured_backup
-- ========================================

CREATE TABLE homepage_featured_backup (
  id uuid NULL,
  business_name VARCHAR(255) NULL,
  visibility_tier text NULL,
  is_homepage_featured boolean NULL,
  updated_at timestamp with time zone NULL
);


-- ========================================
-- BASE TABLE: profiles
-- ========================================

CREATE TABLE profiles (
  id uuid NOT NULL,
  display_name text NULL,
  private_email text NULL,
  country text NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  cultural_identity text NULL,
  role UUID NULL DEFAULT 'owner'::app_role,
  city text NULL,
  languages_spoken ARRAY NULL DEFAULT '{}'::text[],
  pending_business_id uuid NULL,
  pending_business_name text NULL,
  invited_by uuid NULL,
  invited_date timestamp with time zone NULL,
  status text NULL DEFAULT 'active'::text,
  gdpr_consent boolean NULL DEFAULT false,
  gdpr_consent_date timestamp with time zone NULL,
  private_phone text NULL
);
ALTER TABLE profiles ADD PRIMARY KEY (id);
ALTER TABLE profiles ADD CONSTRAINT profiles_invited_by_fkey FOREIGN KEY (invited_by) REFERENCES profiles(id);
ALTER TABLE profiles ADD CONSTRAINT profiles_pending_business_id_fkey FOREIGN KEY (pending_business_id) REFERENCES businesses(id);
CREATE INDEX idx_profiles_email ON public.profiles USING btree (private_email);

-- RLS Policies for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage profiles" ON profiles
  FOR ALL PERMISSIVE USING (((auth.role() = 'service_role'::text) OR ((auth.jwt() ->> 'role'::text) = 'admin'::text))) WITH CHECK (((auth.role() = 'service_role'::text) OR ((auth.jwt() ->> 'role'::text) = 'admin'::text)));
CREATE POLICY "Admins have full access to profiles" ON profiles
  FOR ALL PERMISSIVE USING (((auth.jwt() ->> 'role'::text) = 'admin'::text)) WITH CHECK (((auth.jwt() ->> 'role'::text) = 'admin'::text));
CREATE POLICY "Allow users to delete own profiles" ON profiles
  FOR DELETE PERMISSIVE USING ((auth.uid() = id));
CREATE POLICY "Allow users to insert own profiles" ON profiles
  FOR INSERT PERMISSIVE WITH CHECK ((auth.uid() = id));
CREATE POLICY "Allow users to read own profiles" ON profiles
  FOR SELECT PERMISSIVE USING ((auth.uid() = id));
CREATE POLICY "Allow users to update own profiles" ON profiles
  FOR UPDATE PERMISSIVE USING ((auth.uid() = id));
CREATE POLICY "Public can view basic profile info for business ownership" ON profiles
  FOR SELECT PERMISSIVE USING (true);
CREATE POLICY "Public can view location and cultural identity" ON profiles
  FOR SELECT PERMISSIVE USING (((city IS NOT NULL) OR (country IS NOT NULL) OR (cultural_identity IS NOT NULL) OR (languages_spoken IS NOT NULL)));
CREATE POLICY "Service role full access profiles" ON profiles
  FOR ALL PERMISSIVE USING ((auth.role() = 'service_role'::text)) WITH CHECK ((auth.role() = 'service_role'::text));
CREATE POLICY "Users can delete their own profile" ON profiles
  FOR DELETE PERMISSIVE USING ((auth.uid() = id));
CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT PERMISSIVE WITH CHECK ((auth.uid() = id));
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE PERMISSIVE USING ((auth.uid() = id)) WITH CHECK ((auth.uid() = id));
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE PERMISSIVE USING ((auth.uid() = id));
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT PERMISSIVE USING ((auth.uid() = id));
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT PERMISSIVE USING ((auth.uid() = id));


-- ========================================
-- VIEW: public_business_statistics
-- ========================================

CREATE VIEW public_business_statistics AS  SELECT count(*) AS total_businesses,
    count(
        CASE
            WHEN (is_verified = true) THEN 1
            ELSE NULL::integer
        END) AS verified_businesses,
    count(
        CASE
            WHEN ((status)::text = 'active'::text) THEN 1
            ELSE NULL::integer
        END) AS active_businesses,
    count(
        CASE
            WHEN ((subscription_tier)::text = 'vaka'::text) THEN 1
            ELSE NULL::integer
        END) AS vaka_businesses,
    count(
        CASE
            WHEN ((subscription_tier)::text = 'mana'::text) THEN 1
            ELSE NULL::integer
        END) AS mana_businesses,
    count(
        CASE
            WHEN ((subscription_tier)::text = 'moana'::text) THEN 1
            ELSE NULL::integer
        END) AS moana_businesses
   FROM businesses;;


-- ========================================
-- VIEW: public_businesses
-- ========================================

CREATE VIEW public_businesses AS  SELECT id,
    business_name AS name,
    business_handle,
    tagline,
    description,
    logo_url,
    banner_url,
    mobile_banner_url,
    business_email AS contact_email,
    business_website AS contact_website,
    business_phone AS contact_phone,
    business_hours,
    country,
    city,
    industry,
    status,
    is_verified,
    created_date,
    updated_at
   FROM businesses
  WHERE (((status)::text = 'active'::text) AND (is_verified = true));;


-- ========================================
-- BASE TABLE: subscriptions
-- ========================================

CREATE TABLE subscriptions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  business_id uuid NULL,
  stripe_subscription_id text NULL,
  stripe_customer_id text NULL,
  plan_type VARCHAR(50) NOT NULL,
  status VARCHAR(20) NULL DEFAULT 'active'::character varying,
  current_period_start timestamp with time zone NULL,
  current_period_end timestamp with time zone NULL,
  cancel_at_period_end boolean NULL DEFAULT false,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now()
);
ALTER TABLE subscriptions ADD PRIMARY KEY (id);
ALTER TABLE subscriptions ADD CONSTRAINT subscriptions_business_id_fkey FOREIGN KEY (business_id) REFERENCES businesses(id);
CREATE INDEX idx_subscriptions_business_id_status ON public.subscriptions USING btree (business_id, status);
CREATE UNIQUE INDEX subscriptions_stripe_subscription_id_key ON public.subscriptions USING btree (stripe_subscription_id);
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions USING btree (user_id);
CREATE INDEX idx_subscriptions_business_id ON public.subscriptions USING btree (business_id);
CREATE INDEX idx_subscriptions_stripe_subscription_id ON public.subscriptions USING btree (stripe_subscription_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions USING btree (status);

-- RLS Policies for subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow insertions for subscription creation" ON subscriptions
  FOR INSERT PERMISSIVE WITH CHECK (true);
CREATE POLICY "Allow updates for subscription management" ON subscriptions
  FOR UPDATE PERMISSIVE USING (true);
CREATE POLICY "Anonymous users can view basic subscription info" ON subscriptions
  FOR SELECT PERMISSIVE USING (true);
CREATE POLICY "Service role can manage all subscriptions" ON subscriptions
  FOR ALL PERMISSIVE USING ((((current_setting('request.jwt.claims'::text, true))::json ->> 'role'::text) = 'service_role'::text));
CREATE POLICY "Users can view their own subscriptions" ON subscriptions
  FOR SELECT PERMISSIVE USING ((auth.uid() = user_id));


-- ========================================
-- BASE TABLE: unsubscribe_tokens
-- ========================================

CREATE TABLE unsubscribe_tokens (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  token VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  used_at timestamp with time zone NULL
);
ALTER TABLE unsubscribe_tokens ADD PRIMARY KEY (id);
CREATE UNIQUE INDEX unsubscribe_tokens_token_key ON public.unsubscribe_tokens USING btree (token);
CREATE INDEX idx_unsubscribe_tokens_token ON public.unsubscribe_tokens USING btree (token);
CREATE INDEX idx_unsubscribe_tokens_email ON public.unsubscribe_tokens USING btree (email);

-- RLS Policies for unsubscribe_tokens
ALTER TABLE unsubscribe_tokens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can delete unsubscribe tokens" ON unsubscribe_tokens
  FOR DELETE PERMISSIVE USING ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::app_role)))));
CREATE POLICY "Admins can insert unsubscribe tokens" ON unsubscribe_tokens
  FOR INSERT PERMISSIVE WITH CHECK ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::app_role)))));
CREATE POLICY "Admins can view unsubscribe tokens" ON unsubscribe_tokens
  FOR SELECT PERMISSIVE USING ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::app_role)))));
CREATE POLICY "Public access to unsubscribe tokens" ON unsubscribe_tokens
  FOR SELECT PERMISSIVE USING (true);
CREATE POLICY "Service role full access to unsubscribe tokens" ON unsubscribe_tokens
  FOR ALL PERMISSIVE USING ((EXISTS ( SELECT 1
   FROM auth.users
  WHERE ((users.role)::text = 'service_role'::text))));


-- ========================================
-- BASE TABLE: user_onboarding_status
-- ========================================

CREATE TABLE user_onboarding_status (
  user_id uuid NOT NULL,
  email text NOT NULL,
  confirmed_at timestamp with time zone NULL,
  welcome_email_sent_at timestamp with time zone NULL,
  reminder_email_sent_at timestamp with time zone NULL,
  has_business boolean NOT NULL DEFAULT false,
  has_claim boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE user_onboarding_status ADD PRIMARY KEY (user_id);
CREATE INDEX idx_user_onboarding_status_email ON public.user_onboarding_status USING btree (email);
CREATE INDEX idx_user_onboarding_status_confirmed_at ON public.user_onboarding_status USING btree (confirmed_at);
CREATE INDEX idx_user_onboarding_status_has_business ON public.user_onboarding_status USING btree (has_business);
CREATE INDEX idx_user_onboarding_status_has_claim ON public.user_onboarding_status USING btree (has_claim);

-- RLS Policies for user_onboarding_status
ALTER TABLE user_onboarding_status ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access onboarding" ON user_onboarding_status
  FOR ALL PERMISSIVE USING ((auth.role() = 'service_role'::text)) WITH CHECK ((auth.role() = 'service_role'::text));
CREATE POLICY "Users can view their own onboarding status" ON user_onboarding_status
  FOR SELECT PERMISSIVE USING ((auth.uid() = user_id));


-- ========================================
-- FUNCTIONS
-- ========================================

-- Function: add_shipment_tracking_event


DECLARE
  v_event jsonb;
BEGIN
  v_event := jsonb_build_object(
    'timestamp', now(),
    'status', p_status,
    'location', p_location,
    'description', p_description
  );
  
  UPDATE public.shipments
  SET 
    tracking_events = tracking_events || v_event,
    last_tracking_update = now(),
    status = p_status
  WHERE id = p_shipment_id;
END;


-- Function: allocate_monthly_boost_credits


DECLARE
  v_seller RECORD;
  v_allocation_cents integer;
BEGIN
  -- Get Pro sellers who need monthly credit allocation
  FOR v_seller IN
    SELECT s.id, s.last_credit_allocation_at
    FROM public.sellers s
    WHERE s.current_plan = 'pro'
      AND (
        s.last_credit_allocation_at IS NULL
        OR s.last_credit_allocation_at < date_trunc('month', CURRENT_DATE)
      )
  LOOP
    -- Get monthly allocation amount
    SELECT monthly_boost_credits_cents INTO v_allocation_cents
    FROM public.subscription_plans
    WHERE id = 'pro';

    -- Add credits
    INSERT INTO public.boost_credits (seller_id, amount_cents, balance_cents, type, description)
    SELECT
      v_seller.id,
      v_allocation_cents,
      COALESCE(
        (SELECT boost_credits_cents FROM public.sellers WHERE id = v_seller.id),
        0
      ) + v_allocation_cents,
      'monthly_allocation',
      'Monthly Pro plan boost credits';

    -- Update seller balance
    UPDATE public.sellers
    SET
      boost_credits_cents = boost_credits_cents + v_allocation_cents,
      last_credit_allocation_at = CURRENT_DATE
    WHERE id = v_seller.id;
  END LOOP;
END;


-- Function: apply_referral_moana_reward


      DECLARE
          v_canonical_result JSON;
          v_result JSON;
      BEGIN
          -- Delegate to the canonical function (single source of truth)
          v_canonical_result := public.apply_referral_reward_for_business(p_new_business_id);

          -- If it failed, return the error as-is
          IF (v_canonical_result->>'success')::boolean IS NOT TRUE THEN
              RETURN v_canonical_result;
          END IF;

          -- Remap response fields for backward compatibility with admin API route
          -- API expects: new_business_expiry, referrer_business_expiry, new_business_name, referrer_business_name
          v_result := json_build_object(
              'success', true,
              'message', COALESCE(v_canonical_result->>'message', 'Referral reward applied successfully'),
              'new_business_expiry', v_canonical_result->>'referred_expiry_date',
              'referrer_business_expiry', v_canonical_result->>'referrer_expiry_date',
              'new_business_name', v_canonical_result->>'referred_business_name',
              'referrer_business_name', v_canonical_result->>'referrer_business_name'
          );

          RETURN v_result;
      EXCEPTION
          WHEN OTHERS THEN
              RETURN json_build_object(
                  'success', false,
                  'error', SQLERRM,
                  'detail', SQLSTATE
              );
      END;
      

-- Function: apply_referral_reward_for_business


      DECLARE
          v_referred_business RECORD;
          v_referrer_business RECORD;
          v_existing_reward RECORD;
          v_referrer_expiry_date TIMESTAMPTZ;
          v_referred_expiry_date TIMESTAMPTZ;
          v_reward_record_id UUID;
          v_result JSON;
      BEGIN
          SELECT * INTO v_referred_business 
          FROM public.businesses 
          WHERE id = p_referred_business_id;
          
          IF NOT FOUND THEN
              v_result := json_build_object('success', false, 'error', 'Referred business not found', 'action', 'none');
              RETURN v_result;
          END IF;
          
          IF NOT public.is_business_referral_reward_eligible(p_referred_business_id) THEN
              v_result := json_build_object(
                  'success', false, 
                  'error', 'Business not eligible for referral reward',
                  'reason', public.get_business_referral_reward_eligibility_reason(p_referred_business_id),
                  'action', 'none'
              );
              RETURN v_result;
          END IF;
          
          SELECT * INTO v_existing_reward
          FROM public.business_referral_rewards 
          WHERE referred_business_id = p_referred_business_id
          LIMIT 1;
          
          IF v_existing_reward.status = 'applied' THEN
              v_result := json_build_object(
                  'success', true, 
                  'message', 'Referral reward already applied',
                  'action', 'already_applied',
                  'reward_id', v_existing_reward.id,
                  'applied_at', v_existing_reward.applied_at
              );
              RETURN v_result;
          END IF;
          
          SELECT * INTO v_referrer_business 
          FROM public.businesses 
          WHERE id = v_referred_business.referred_by_business_id;
          
          IF v_referrer_business.tier_expires_at IS NOT NULL 
             AND v_referrer_business.tier_expires_at > now() 
             AND v_referrer_business.subscription_tier = 'moana' THEN
              v_referrer_expiry_date := v_referrer_business.tier_expires_at + interval '31 days';
          ELSE
              v_referrer_expiry_date := now() + interval '31 days';
          END IF;
          
          IF v_referred_business.tier_expires_at IS NOT NULL 
             AND v_referred_business.tier_expires_at > now() 
             AND v_referred_business.subscription_tier = 'moana' THEN
              v_referred_expiry_date := v_referred_business.tier_expires_at + interval '31 days';
          ELSE
              v_referred_expiry_date := now() + interval '31 days';
          END IF;
          
          BEGIN
              IF v_existing_reward IS NOT NULL THEN
                  UPDATE public.business_referral_rewards 
                  SET status = 'applied', eligibility_reason = 'Referred business became active', applied_at = now(), updated_at = now()
                  WHERE id = v_existing_reward.id;
                  v_reward_record_id := v_existing_reward.id;
              ELSE
                  INSERT INTO public.business_referral_rewards (
                      referrer_business_id, referred_business_id, reward_type, reward_days, status, eligibility_reason, applied_at, applied_by
                  ) VALUES (
                      v_referrer_business.id, v_referred_business.id, 'moana_extension', 31, 'applied', 'Referred business became active', now(), 'system'
                  ) RETURNING id INTO v_reward_record_id;
              END IF;
              
              UPDATE public.businesses 
              SET 
                  subscription_tier = 'moana',
                  visibility_tier = CASE WHEN visibility_mode = 'manual' THEN visibility_tier ELSE 'homepage' END,
                  tier_expires_at = v_referrer_expiry_date,
                  referral_count = referral_count + 1,
                  updated_at = now()
              WHERE id = v_referrer_business.id;
              
              UPDATE public.businesses 
              SET 
                  subscription_tier = 'moana',
                  visibility_tier = CASE WHEN visibility_mode = 'manual' THEN visibility_tier ELSE 'homepage' END,
                  tier_expires_at = v_referred_expiry_date,
                  referral_reward_applied = true,
                  referral_reward_applied_at = now(),
                  updated_at = now()
              WHERE id = p_referred_business_id;
              
          EXCEPTION
              WHEN OTHERS THEN
                  v_result := json_build_object('success', false, 'error', 'Failed to apply referral reward: ' || SQLERRM, 'detail', SQLSTATE, 'action', 'rollback');
                  RETURN v_result;
          END;
          
          v_result := json_build_object(
              'success', true,
              'message', 'Referral rewards applied successfully to both businesses',
              'action', 'applied',
              'reward_id', v_reward_record_id,
              'referrer_business_id', v_referrer_business.id,
              'referrer_business_name', v_referrer_business.business_name,
              'referred_business_id', v_referred_business.id,
              'referred_business_name', v_referred_business.business_name,
              'reward_days', 31,
              'referrer_expiry_date', v_referrer_expiry_date,
              'referred_expiry_date', v_referred_expiry_date,
              'applied_at', now()
          );
          RETURN v_result;
      EXCEPTION
          WHEN OTHERS THEN
              v_result := json_build_object('success', false, 'error', 'Unexpected error: ' || SQLERRM, 'detail', SQLSTATE, 'action', 'error');
              RETURN v_result;
      END;
      

-- Function: audit_trigger_function


BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO audit_logs (table_name, record_id, action, old_data, user_id)
    VALUES (TG_TABLE_NAME, OLD.id, TG_OP, row_to_json(OLD), auth.uid());
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_logs (table_name, record_id, action, old_data, new_data, user_id)
    VALUES (TG_TABLE_NAME, NEW.id, TG_OP, row_to_json(OLD), row_to_json(NEW), auth.uid());
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO audit_logs (table_name, record_id, action, new_data, user_id)
    VALUES (TG_TABLE_NAME, NEW.id, TG_OP, row_to_json(NEW), auth.uid());
    RETURN NEW;
  END IF;
  RETURN NULL;
END;


-- Function: auto_initialize_service_subscription


BEGIN
  -- Pro sellers get service subscription trial
  IF NEW.seller_tier = 'pro' AND NEW.service_subscription_status IS NULL THEN
    NEW.service_subscription_status := 'trial';
    NEW.trial_ends_at := now() + interval '1 month';
    NEW.service_subscription_started_at := now();
  END IF;

  RETURN NEW;
END;


-- Function: backfill_historic_referral_rewards


DECLARE
    v_businesses_with_referrals RECORD;
    v_processed_count INTEGER := 0;
    v_skipped_count INTEGER := 0;
    v_failed_count INTEGER := 0;
    v_result JSON;
    v_reward_result JSON;
BEGIN
    -- RAISE NOTICE 'Starting backfill of historic referral rewards...';
    
    -- Find all businesses with referrals that might need reward processing
    FOR v_businesses_with_referrals IN 
        SELECT 
            b.id as business_id,
            b.business_name,
            b.referred_by_business_id,
            b.status,
            b.referral_reward_applied,
            b.tier_expires_at,
            b.referral_count,
            rb.id as existing_reward_id,
            rb.status as reward_status,
            rb.applied_at as reward_applied_at
        FROM public.businesses b
        LEFT JOIN public.business_referral_rewards rb ON b.id = rb.referred_business_id
        WHERE b.referred_by_business_id IS NOT NULL
        ORDER BY b.created_at ASC
    LOOP
        BEGIN
            -- RAISE NOTICE 'Processing business: % (referrer: %)', v_businesses_with_referrals.business_name, v_businesses_with_referrals.referred_by_business_id;
            
            -- Check if this business already has a processed reward in the new system
            IF v_businesses_with_referrals.existing_reward_id IS NOT NULL 
               AND v_businesses_with_referrals.reward_status = 'applied' THEN
                -- Already processed, skip
                v_skipped_count := v_skipped_count + 1;
                -- RAISE NOTICE 'Skipping % - reward already applied on %', v_businesses_with_referrals.business_name, v_businesses_with_referrals.reward_applied_at;
                CONTINUE;
            END IF;
            
            -- Try to apply the reward using our canonical function
            v_reward_result := public.apply_referral_reward_for_business(v_businesses_with_referrals.business_id);
            
            IF v_reward_result->>'success' = 'true' THEN
                v_processed_count := v_processed_count + 1;
                -- RAISE NOTICE 'Applied reward for %: %', v_businesses_with_referrals.business_name, v_reward_result->>'message';
            ELSIF v_reward_result->>'action' = 'already_applied' THEN
                v_skipped_count := v_skipped_count + 1;
                -- RAISE NOTICE 'Reward already applied for %: %', v_businesses_with_referrals.business_name, v_reward_result->>'message';
            ELSIF v_reward_result->>'action' = 'none' THEN
                -- Not eligible, but that's expected
                v_skipped_count := v_skipped_count + 1;
                -- RAISE NOTICE 'Business % not eligible: %', v_businesses_with_referrals.business_name, v_reward_result->>'reason';
            ELSE
                v_failed_count := v_failed_count + 1;
                -- RAISE WARNING 'Failed to process reward for %: %', v_businesses_with_referrals.business_name, v_reward_result->>'error';
            END IF;
            
        EXCEPTION
            WHEN OTHERS THEN
                v_failed_count := v_failed_count + 1;
                RAISE WARNING 'Exception processing business %: %', v_businesses_with_referrals.business_name, SQLERRM;
        END;
    END LOOP;
    
    -- Return summary
    v_result := json_build_object(
        'success', true,
        'message', 'Backfill completed',
        'processed', v_processed_count,
        'skipped', v_skipped_count,
        'failed', v_failed_count,
        'total_attempted', v_processed_count + v_skipped_count + v_failed_count,
        'completed_at', now()
    );
    
    -- RAISE NOTICE 'Backfill summary: % processed, % skipped, % failed', v_processed_count, v_skipped_count, v_failed_count;
    
    RETURN v_result;
    
EXCEPTION
    WHEN OTHERS THEN
    v_result := json_build_object(
        'success', false,
        'error', 'Backfill failed: ' || SQLERRM,
        'detail', SQLSTATE,
        'processed', v_processed_count,
        'skipped', v_skipped_count,
        'failed', v_failed_count
    );
    RETURN v_result;
END;


-- Function: calculate_commission_bps


DECLARE
  v_seller_tier TEXT;
BEGIN
  SELECT seller_tier INTO v_seller_tier
  FROM sellers
  WHERE id = p_seller_id;

  -- All sellers pay 6.5% commission (650 basis points)
  -- Both fixed_price and pro sellers have the same commission rate
  RETURN 650;
END;


-- Function: calculate_commission_for_seller


DECLARE
  v_seller_type seller_type;
  v_commission_bps integer;
BEGIN
  -- Get seller type and commission rate
  SELECT seller_type, commission_bps
  INTO v_seller_type, v_commission_bps
  FROM public.sellers
  WHERE id = p_seller_id;

  -- Service-only sellers have no commission
  IF v_seller_type = 'services' THEN
    RETURN 0;
  END IF;

  -- Product and hybrid sellers pay 6% commission on products
  IF v_commission_bps IS NOT NULL THEN
    RETURN ROUND(p_subtotal_cents * v_commission_bps / 10000.0)::integer;
  END IF;

  RETURN 0;
END;


-- Function: calculate_monthly_fee


DECLARE
  v_seller_tier TEXT;
  v_subscription_status TEXT;
BEGIN
  SELECT seller_tier, service_subscription_status INTO v_seller_tier, v_subscription_status
  FROM sellers
  WHERE id = p_seller_id;

  -- Fixed price sellers pay no monthly fee (FREE tier)
  IF v_seller_tier = 'fixed_price' THEN
    RETURN 0;
  END IF;

  -- Pro sellers pay $24.99/month (after trial)
  IF v_seller_tier = 'pro' THEN
    -- If in trial, no charge
    IF v_subscription_status = 'trial' THEN
      RETURN 0;
    END IF;
    
    -- Active subscription
    IF v_subscription_status = 'active' THEN
      RETURN 24.99;
    END IF;
  END IF;

  RETURN 0;
END;


-- Function: calculate_platform_fee


DECLARE
  v_fee_cents int;
  v_net_payout_cents int;
BEGIN
  -- Calculate fee (rounded)
  v_fee_cents := ROUND(p_subtotal_cents * p_fee_rate / 100.0);
  
  -- Calculate net payout
  v_net_payout_cents := p_subtotal_cents - v_fee_cents;
  
  -- Insert or update platform fee
  INSERT INTO public.platform_fees (
    order_id,
    seller_id,
    subtotal_cents,
    fee_rate,
    fee_cents,
    net_seller_payout_cents
  ) VALUES (
    p_order_id,
    p_seller_id,
    p_subtotal_cents,
    p_fee_rate,
    v_fee_cents,
    v_net_payout_cents
  )
  ON CONFLICT (order_id) DO UPDATE SET
    subtotal_cents = EXCLUDED.subtotal_cents,
    fee_rate = EXCLUDED.fee_rate,
    fee_cents = EXCLUDED.fee_cents,
    net_seller_payout_cents = EXCLUDED.net_seller_payout_cents;
END;


-- Function: calculate_seller_commission


DECLARE
  v_commission_bps integer;
BEGIN
  -- Get seller's commission rate
  SELECT commission_bps INTO v_commission_bps
  FROM public.sellers
  WHERE id = p_seller_id;

  -- Calculate commission (subtotal only, excludes shipping)
  RETURN ROUND(p_subtotal_cents * v_commission_bps / 10000.0)::integer;
END;


-- Function: calculate_seller_net


BEGIN
  RETURN QUERY SELECT
    (p_gross_cents - ROUND(p_gross_cents * p_commission_rate) - ROUND(p_gross_cents * p_reserve_bps / 10000.0))::integer AS net_cents,
    ROUND(p_gross_cents * p_commission_rate)::integer AS commission_cents,
    ROUND(p_gross_cents * p_reserve_bps / 10000.0)::integer AS reserve_cents;
END;


-- Function: cleanup_expired_unsubscribe_tokens


DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM email_unsubscribe_tokens 
    WHERE expires_at < NOW() - INTERVAL '7 days';
    
    -- Get count of deleted rows
    SELECT COUNT(*) INTO deleted_count FROM email_unsubscribe_tokens;
    
    RETURN deleted_count;
END;


-- Function: create_follower_notifications


BEGIN
  -- Insert notification for each follower of this seller
  INSERT INTO follower_notifications (buyer_id, seller_id, activity_id)
  SELECT buyer_id, NEW.seller_id, NEW.id
  FROM seller_follows
  WHERE seller_id = NEW.seller_id;
  
  RETURN NEW;
END;


-- Function: create_pending_referral_reward


DECLARE
    v_referred_business RECORD;
BEGIN
    -- Load the business
    SELECT * INTO v_referred_business 
    FROM public.businesses 
    WHERE id = p_referred_business_id;
    
    -- Exit if no business or no referrer
    IF NOT FOUND OR v_referred_business.referred_by_business_id IS NULL THEN
        RETURN;
    END IF;
    
    -- Check if reward record already exists
    IF EXISTS (
        SELECT 1 FROM public.business_referral_rewards 
        WHERE referred_business_id = p_referred_business_id
    ) THEN
        RETURN;
    END IF;
    
    -- Create pending reward record
    INSERT INTO public.business_referral_rewards (
        referrer_business_id,
        referred_business_id,
        reward_type,
        reward_days,
        status,
        eligibility_reason,
        applied_by
    ) VALUES (
        v_referred_business.referred_by_business_id,
        v_referred_business.id,
        'moana_extension',
        31,
        'pending',
        'Awaiting business activation',
        'system'
    );
    
EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't fail the operation
        RAISE WARNING 'Failed to create pending referral reward for business %: %', p_referred_business_id, SQLERRM;
END;


-- Function: create_product_boost


DECLARE
  v_boost_id bigint;
  v_current_balance integer;
BEGIN
  -- Check seller has enough credits
  SELECT boost_credits_cents INTO v_current_balance
  FROM public.sellers
  WHERE id = p_seller_id;

  IF v_current_balance < p_cost_cents THEN
    RAISE EXCEPTION 'Insufficient boost credits. Current balance: %', v_current_balance;
  END IF;

  -- Create boost
  INSERT INTO public.product_boosts (
    seller_id,
    product_id,
    placement,
    cost_cents,
    starts_at,
    ends_at,
    status
  ) VALUES (
    p_seller_id,
    p_product_id,
    p_placement,
    p_cost_cents,
    now(),
    now() + (p_duration_days || ' days')::interval,
    'active'
  )
  RETURNING id INTO v_boost_id;

  -- Deduct credits
  INSERT INTO public.boost_credits (seller_id, amount_cents, balance_cents, type, reference_id, description)
  VALUES (
    p_seller_id,
    -p_cost_cents,
    v_current_balance - p_cost_cents,
    'spent',
    v_boost_id::text,
    'Boost: ' || p_placement || ' for ' || p_duration_days || ' days'
  );

  -- Update seller balance
  UPDATE public.sellers
  SET boost_credits_cents = boost_credits_cents - p_cost_cents
  WHERE id = p_seller_id;

  RETURN v_boost_id;
END;


-- Function: create_referral_if_present


DECLARE
    v_referrer_business_id UUID;
BEGIN
    -- Only proceed if we have a valid referral code
    IF p_referrer_code IS NOT NULL AND p_referrer_code != '' THEN
        -- Find the referrer business by their referral code
        SELECT id INTO v_referrer_business_id
        FROM businesses
        WHERE referral_code = p_referrer_code;
        
        -- If we found a valid referrer and it's not self-referral
        IF v_referrer_business_id IS NOT NULL AND v_referrer_business_id != p_referred_business_id THEN
            -- Insert the referral record
            INSERT INTO referrals (referrer_business_id, referred_business_id, status)
            VALUES (v_referrer_business_id, p_referred_business_id, 'approved')
            ON CONFLICT (referrer_business_id, referred_business_id) DO NOTHING;
        END IF;
    END IF;
END;


-- Function: ensure_single_default_address


BEGIN
  -- If setting as default shipping, unset others
  IF NEW.is_default_shipping = true THEN
    UPDATE public.addresses 
    SET is_default_shipping = false 
    WHERE user_id = NEW.user_id 
      AND id != NEW.id 
      AND is_default_shipping = true;
  END IF;
  
  -- If setting as default billing, unset others
  IF NEW.is_default_billing = true THEN
    UPDATE public.addresses 
    SET is_default_billing = false 
    WHERE user_id = NEW.user_id 
      AND id != NEW.id 
      AND is_default_billing = true;
  END IF;
  
  RETURN NEW;
END;


-- Function: expire_moana_tiers


      DECLARE
          v_expired_count INTEGER;
          v_result JSON;
      BEGIN
          -- Downgrade businesses whose moana tier has expired
          -- Only affects businesses in auto visibility mode
          WITH expired AS (
              UPDATE public.businesses
              SET 
                  subscription_tier = 'vaka',
                  visibility_tier = CASE 
                      WHEN visibility_mode = 'manual' THEN visibility_tier 
                      ELSE 'none' 
                  END,
                  updated_at = now()
              WHERE subscription_tier = 'moana'
                AND tier_expires_at IS NOT NULL
                AND tier_expires_at < now()
                AND status = 'active'
              RETURNING id, business_name, tier_expires_at
          )
          SELECT COUNT(*) INTO v_expired_count FROM expired;

          -- Log results
          IF v_expired_count > 0 THEN
              -- Also log each expiry to audit_logs for traceability
              INSERT INTO public.audit_logs (table_name, record_id, action, new_data, user_id)
              SELECT 
                  'businesses',
                  b.id,
                  'tier_expired',
                  jsonb_build_object(
                      'previous_tier', 'moana',
                      'new_tier', 'vaka',
                      'expired_at', b.tier_expires_at,
                      'processed_at', now()
                  ),
                  NULL
              FROM public.businesses b
              WHERE b.subscription_tier = 'vaka'
                AND b.updated_at >= now() - interval '1 minute'
                AND b.tier_expires_at IS NOT NULL
                AND b.tier_expires_at < now();

              RAISE LOG 'Expired % moana tier(s)', v_expired_count;
          END IF;

          v_result := json_build_object(
              'success', true,
              'expired_count', v_expired_count,
              'processed_at', now()
          );
          RETURN v_result;
      EXCEPTION
          WHEN OTHERS THEN
              v_result := json_build_object(
                  'success', false,
                  'error', SQLERRM,
                  'detail', SQLSTATE
              );
              RETURN v_result;
      END;
      

-- Function: generate_order_number


DECLARE
  new_number text;
  exists_check boolean;
BEGIN
  LOOP
    new_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::text, 4, '0');
    SELECT EXISTS(SELECT 1 FROM orders WHERE order_number = new_number) INTO exists_check;
    EXIT WHEN NOT exists_check;
  END LOOP;
  RETURN new_number;
END;


-- Function: generate_quote_number


DECLARE
  next_num INT;
  year_str TEXT;
BEGIN
  year_str := TO_CHAR(CURRENT_DATE, 'YYYY');
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(quote_number FROM 'QUOTE-\d{4}-(\d+)') AS INT)), 0) + 1
  INTO next_num
  FROM quotes
  WHERE quote_number LIKE 'QUOTE-' || year_str || '-%';
  
  RETURN 'QUOTE-' || year_str || '-' || LPAD(next_num::TEXT, 4, '0');
END;


-- Function: generate_transfer_group


BEGIN
  RETURN 'order_' || p_order_id::text;
END;


-- Function: generate_unique_business_handle


DECLARE
    base_handle TEXT;
    handle TEXT;
    counter INTEGER := 1;
BEGIN
    -- Convert to lowercase, replace spaces and special chars with hyphens
    base_handle := lower(regexp_replace(business_name, '[^a-z0-9\s-]', '', 'g'));
    base_handle := regexp_replace(base_handle, '\s+', '-', 'g');
    base_handle := regexp_replace(base_handle, '-+', '-', 'g');
    base_handle := trim(both '-' from base_handle);
    
    -- If empty, use a default
    IF base_handle = '' THEN
        base_handle := 'business';
    END IF;
    
    -- Check if unique, if not add number
    handle := base_handle;
    WHILE EXISTS (SELECT 1 FROM businesses WHERE business_handle = handle) LOOP
        handle := base_handle || '-' || counter;
        counter := counter + 1;
    END LOOP;
    
    RETURN handle;
END;


-- Function: get_business_referral_reward_eligibility_reason


DECLARE
    v_business RECORD;
    v_existing_reward RECORD;
BEGIN
    -- Load the business
    SELECT * INTO v_business 
    FROM public.businesses 
    WHERE id = p_business_id;
    
    -- Not found
    IF NOT FOUND THEN
        RETURN 'Business not found';
    END IF;
    
    -- No referrer
    IF v_business.referred_by_business_id IS NULL THEN
        RETURN 'No referral relationship found';
    END IF;
    
    -- Not active
    IF v_business.status != 'active' THEN
        RETURN 'Business is not active (status: ' || COALESCE(v_business.status, 'null') || ')';
    END IF;
    
    -- Check for existing applied reward
    SELECT * INTO v_existing_reward
    FROM public.business_referral_rewards 
    WHERE referred_business_id = p_business_id 
    AND status = 'applied'
    LIMIT 1;
    
    IF FOUND THEN
        RETURN 'Reward already applied on ' || TO_CHAR(v_existing_reward.applied_at, 'YYYY-MM-DD HH24:MI:SS');
    END IF;
    
    -- Check referrer status
    IF NOT EXISTS (
        SELECT 1 FROM public.businesses 
        WHERE id = v_business.referred_by_business_id 
        AND status = 'active'
    ) THEN
        RETURN 'Referrer business is not active';
    END IF;
    
    RETURN 'Eligible for referral reward';
END;


-- Function: get_business_referral_summary


DECLARE
    v_business RECORD;
    v_rewards_given JSON;
    v_rewards_received JSON;
    v_result JSON;
BEGIN
    -- Load business
    SELECT * INTO v_business 
    FROM public.businesses 
    WHERE id = p_business_id;
    
    IF NOT FOUND THEN
        RETURN json_build_object('error', 'Business not found');
    END IF;
    
    -- Get rewards this business has given (as referrer)
    SELECT json_agg(
        json_build_object(
            'reward_id', r.id,
            'referred_business_id', r.referred_business_id,
            'referred_business_name', b.business_name,
            'status', r.status,
            'reward_days', r.reward_days,
            'applied_at', r.applied_at,
            'eligibility_reason', r.eligibility_reason
        )
    ) INTO v_rewards_given
    FROM public.business_referral_rewards r
    JOIN public.businesses b ON r.referred_business_id = b.id
    WHERE r.referrer_business_id = p_business_id;
    
    -- Get rewards this business has received (as referred)
    SELECT json_agg(
        json_build_object(
            'reward_id', r.id,
            'referrer_business_id', r.referrer_business_id,
            'referrer_business_name', b.business_name,
            'status', r.status,
            'reward_days', r.reward_days,
            'applied_at', r.applied_at,
            'eligibility_reason', r.eligibility_reason
        )
    ) INTO v_rewards_received
    FROM public.business_referral_rewards r
    JOIN public.businesses b ON r.referrer_business_id = b.id
    WHERE r.referred_business_id = p_business_id;
    
    v_result := json_build_object(
        'business_id', p_business_id,
        'business_name', v_business.business_name,
        'current_tier', v_business.subscription_tier,
        'tier_expires_at', v_business.tier_expires_at,
        'referral_count', v_business.referral_count,
        'referred_by_business_id', v_business.referred_by_business_id,
        'rewards_given', COALESCE(v_rewards_given, '[]'::json),
        'rewards_received', COALESCE(v_rewards_received, '[]'::json),
        'total_reward_days_given', (
            SELECT COALESCE(SUM(r.reward_days), 0)
            FROM public.business_referral_rewards r
            WHERE r.referrer_business_id = p_business_id 
            AND r.status = 'applied'
        )
    );
    
    RETURN v_result;
END;


-- Function: get_business_stats


BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_businesses,
        COUNT(*) FILTER (WHERE is_verified = true) as verified_businesses,
        COUNT(DISTINCT country) as countries_represented,
        COUNT(DISTINCT industry) as industries_count,
        COUNT(DISTINCT cultural_identity) as cultural_identities_count
    FROM businesses 
    WHERE status = 'active';
END;


-- Function: get_cart_grouped_by_seller


declare
begin
  return query
  with raw_items as (
    select
      ci.seller_id,
      jsonb_agg(jsonb_build_object(
        'cart_item_id', ci.id,
        'product_id',  ci.product_id,
        'quantity',    ci.quantity,
        'unit_amount', ci.price_cents,  -- minor units
        'currency',    ci.currency
      ) order by ci.id) as items,
      sum(ci.price_cents * ci.quantity)::bigint as subtotal_cents,
      min(ci.currency) as currency
    from cart_items ci
    where ci.cart_id = p_cart_id
    group by ci.seller_id
  ),
  coupon_map as (
    -- p_coupons = {"123":"WELCOME10","456":"SPRING5"}
    select (key)::bigint as seller_id, value::text as code
    from jsonb_each_text(p_coupons)
  ),
  discounts as (
    select
      ri.seller_id,
      coalesce((
        select v.discount_cents
        from validate_coupon_for_seller(
          ri.seller_id,
          cm.code,
          ri.currency,
          ri.subtotal_cents
        ) v
        limit 1
      ), 0)::bigint as discount_cents
    from raw_items ri
    left join coupon_map cm on cm.seller_id = ri.seller_id
  )
  select
    s.id                                as seller_id,
    s.shop_name                         as seller_name,
    coalesce(s.currency_code, ri.currency) as seller_currency,
    s.platform_fee_percentage,
    ri.items,
    ri.subtotal_cents,
    greatest(d.discount_cents, 0)::bigint as discount_cents,
    0::bigint                             as shipping_cents, -- fill in later
    0::bigint                             as tax_cents,      -- fill in later
    floor(greatest(ri.subtotal_cents - d.discount_cents, 0)
          * (s.platform_fee_percentage / 100.0))::bigint     as platform_fee_cents,
    greatest(ri.subtotal_cents - d.discount_cents, 0)
      + 0 + 0                                               as total_cents
  from raw_items ri
  join sellers s on s.id = ri.seller_id
  left join discounts d on d.seller_id = ri.seller_id
  order by s.shop_name;
end;


-- Function: get_cart_grouped_by_seller


BEGIN
  RETURN QUERY
  SELECT 
    s.id as seller_id,
    s.shop_name,
    COALESCE(ci.currency, 'NZD') as currency,
    SUM(ci.price_cents * ci.quantity)::bigint as subtotal_cents,
    COALESCE(s.platform_fee_percentage, 6.5) as platform_fee_percentage,
    FLOOR(SUM(ci.price_cents * ci.quantity) * COALESCE(s.platform_fee_percentage, 6.5) / 100)::bigint as platform_fee_cents
  FROM cart_items ci
  INNER JOIN sellers s ON ci.seller_id = s.id
  WHERE ci.cart_id = p_cart_id
  GROUP BY s.id, s.shop_name, ci.currency, s.platform_fee_percentage
  ORDER BY s.shop_name;
END;


-- Function: get_challenges_analysis


BEGIN
  RETURN QUERY
  SELECT 
    challenge,
    COUNT(*) as frequency,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage,
    business_stage
  FROM business_insights_snapshots, 
       unnest(top_challenges) as challenge
  WHERE top_challenges IS NOT NULL
    AND snapshot_year = EXTRACT(YEAR FROM CURRENT_DATE)
  GROUP BY challenge, business_stage
  ORDER BY frequency DESC;
END;


-- Function: get_economic_insights


BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(SUM(annual_revenue_exact), 0) as total_revenue,
        COALESCE(SUM(full_time_employees + part_time_employees), 0) as total_employees,
        jsonb_build_object(
            'self_funded', COUNT(*) FILTER (WHERE funding_source = 'self-funded'),
            'bank_loans', COUNT(*) FILTER (WHERE funding_source = 'bank-loans'),
            'government_grants', COUNT(*) FILTER (WHERE funding_source = 'government-grants'),
            'investors', COUNT(*) FILTER (WHERE funding_source IN ('angel-investors', 'venture-capital'))
        ) as funding_distribution,
        jsonb_build_object(
            'access_to_capital', COUNT(*) FILTER (WHERE 'access-to-capital' = ANY(business_challenges)),
            'market_access', COUNT(*) FILTER (WHERE 'market-access' = ANY(business_challenges)),
            'talent_acquisition', COUNT(*) FILTER (WHERE 'talent-acquisition' = ANY(business_challenges)),
            'digital_transformation', COUNT(*) FILTER (WHERE 'digital-transformation' = ANY(business_challenges))
        ) as challenge_distribution,
        (SELECT jsonb_build_object(
            'high_school', COUNT(*) FILTER (WHERE education_level = 'high-school'),
            'bachelors', COUNT(*) FILTER (WHERE education_level = 'bachelors-degree'),
            'masters', COUNT(*) FILTER (WHERE education_level = 'masters-degree'),
            'phd', COUNT(*) FILTER (WHERE education_level = 'phd')
        ) FROM analytics_profiles) as education_distribution
    FROM analytics_businesses
    WHERE status = 'active';
END;


-- Function: get_ecosystem_insights


BEGIN
  RETURN QUERY
  SELECT 
    hiring_intentions,
    collaboration_interest,
    COUNT(*) as founder_count,
    MODE() WITHIN GROUP (ORDER BY business_stage) as avg_business_stage,
    ARRAY_AGG(DISTINCT unnest(community_impact_areas)) FILTER (WHERE community_impact_areas IS NOT NULL) as common_impact_areas
  FROM business_insights_snapshots
  WHERE snapshot_year = EXTRACT(YEAR FROM CURRENT_DATE)
  GROUP BY hiring_intentions, collaboration_interest
  ORDER BY founder_count DESC;
END;


-- Function: get_financial_insights_summary


BEGIN
  RETURN QUERY
  SELECT 
    bis.current_funding_source as funding_source,
    bis.funding_amount_needed as funding_amount,
    bis.investment_stage as investment_stage,
    COUNT(*) as business_count,
    MODE() WITHIN GROUP (ORDER BY bis.funding_amount_needed) as avg_funding_needed
  FROM business_insights_snapshots bis
  WHERE bis.current_funding_source IS NOT NULL
  GROUP BY bis.current_funding_source, bis.funding_amount_needed, bis.investment_stage
  ORDER BY business_count DESC;
END;


-- Function: get_founder_insights_summary


BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_founders,
    ROUND(AVG(CASE WHEN businesses_founded ~ '^[0-9]+$' THEN CAST(businesses_founded AS INTEGER) ELSE 0 END), 2) as avg_businesses_founded,
    MODE() WITHIN GROUP (ORDER BY business_stage) as top_business_stages,
    ARRAY_AGG(DISTINCT unnest(top_challenges)) FILTER (WHERE top_challenges IS NOT NULL) as common_challenges,
    ROUND(AVG(CASE WHEN hiring_intentions = true THEN 100 ELSE 0 END), 2) as hiring_plans_percentage,
    ROUND(AVG(CASE WHEN collaboration_interest = true THEN 100 ELSE 0 END), 2) as collaboration_interest_percentage
  FROM business_insights_snapshots
  WHERE snapshot_year = EXTRACT(YEAR FROM CURRENT_DATE);
END;


-- Function: get_funding_gaps_analysis


BEGIN
  RETURN QUERY
  SELECT 
    bis.current_funding_source,
    COUNT(CASE WHEN bis.funding_amount_needed != 'not-sure' THEN 1 END) as seeking_funding,
    MODE() WITHIN GROUP (ORDER BY bis.funding_amount_needed) as avg_amount_needed,
    ARRAY_AGG(DISTINCT bis.funding_purpose) FILTER (WHERE bis.funding_purpose IS NOT NULL) as common_purposes
  FROM business_insights_snapshots bis
  WHERE bis.current_funding_source IS NOT NULL
  GROUP BY bis.current_funding_source
  ORDER BY seeking_funding DESC;
END;


-- Function: get_public_insights_stats


BEGIN
    RETURN QUERY
    SELECT 
        count(*) AS total_businesses,
        count(*) FILTER (WHERE ((subscription_tier)::text = 'vaka'::text)) AS vaka_count,
        count(*) FILTER (WHERE ((subscription_tier)::text = 'mana'::text)) AS mana_count,
        count(*) FILTER (WHERE ((subscription_tier)::text = 'moana'::text)) AS moana_count,
        count(*) FILTER (WHERE (is_verified = true)) AS verified_count,
        count(*) FILTER (WHERE ((status)::text = 'active'::text)) AS active_count,
        count(DISTINCT industry) AS unique_industries,
        count(DISTINCT country) AS unique_countries,
        date_trunc('month'::text, max(created_at)) AS latest_month
    FROM businesses 
    WHERE (((status)::text = 'active'::text) AND (is_verified = true));
END;


-- Function: get_referral_backfill_report


DECLARE
    v_report JSON;
    v_eligible_count INTEGER := 0;
    v_pending_count INTEGER := 0;
    v_applied_count INTEGER := 0;
    v_ineligible_count INTEGER := 0;
    v_total_referrals INTEGER := 0;
BEGIN
    -- Count total businesses with referrals
    SELECT COUNT(*) INTO v_total_referrals
    FROM public.businesses 
    WHERE referred_by_business_id IS NOT NULL;
    
    -- Count eligible for reward (active with referrer, no reward applied)
    SELECT COUNT(*) INTO v_eligible_count
    FROM public.businesses b
    WHERE b.referred_by_business_id IS NOT NULL
    AND b.status = 'active'
    AND NOT EXISTS (
        SELECT 1 FROM public.business_referral_rewards r 
        WHERE r.referred_business_id = b.id 
        AND r.status = 'applied'
    );
    
    -- Count pending rewards in new system
    SELECT COUNT(*) INTO v_pending_count
    FROM public.business_referral_rewards 
    WHERE status = 'pending';
    
    -- Count already applied rewards in new system
    SELECT COUNT(*) INTO v_applied_count
    FROM public.business_referral_rewards 
    WHERE status = 'applied';
    
    -- Count ineligible (not active or other issues)
    v_ineligible_count := v_total_referrals - v_eligible_count - v_applied_count;
    
    v_report := json_build_object(
        'total_referrals', v_total_referrals,
        'eligible_for_reward', v_eligible_count,
        'pending_rewards', v_pending_count,
        'already_applied', v_applied_count,
        'ineligible', v_ineligible_count,
        'report_generated_at', now()
    );
    
    RETURN v_report;
END;


-- Function: get_referral_stats


BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_referrals,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_referrals,
        COUNT(*) FILTER (WHERE status = 'approved') as approved_referrals,
        COUNT(*) FILTER (WHERE status = 'approved') as draw_entries
    FROM referrals
    WHERE referrer_business_id = p_business_id;
END;


-- Function: get_seller_boost_balance


DECLARE
  v_balance integer;
BEGIN
  SELECT boost_credits_cents INTO v_balance
  FROM public.sellers
  WHERE id = p_seller_id;

  RETURN COALESCE(v_balance, 0);
END;


-- Function: get_seller_monthly_fee


DECLARE
  v_seller_type seller_type;
  v_subscription_status subscription_status;
BEGIN
  SELECT seller_type, service_subscription_status
  INTO v_seller_type, v_subscription_status
  FROM public.sellers
  WHERE id = p_seller_id;

  -- Products-only sellers pay no monthly fee
  IF v_seller_type = 'products' THEN
    RETURN 0;
  END IF;

  -- Service and hybrid sellers pay $9.99/month (after trial)
  IF v_seller_type IN ('services', 'hybrid') THEN
    -- If in trial, no charge
    IF v_subscription_status = 'trial' THEN
      RETURN 0;
    END IF;

    -- If active, charge $9.99
    IF v_subscription_status = 'active' THEN
      RETURN 999; -- $9.99 in cents
    END IF;
  END IF;

  RETURN 0;
END;


-- Function: get_seller_stripe_account


  select stripe_connect_account_id
  from sellers
  where id = p_seller_id
    and stripe_connect_account_id is not null
    and stripe_charges_enabled = true
    and stripe_payouts_enabled  = true;


-- Function: get_shop_analytics_summary


BEGIN
  -- Validate input
  IF p_seller_id IS NULL AND p_admin_listing_id IS NULL THEN
    RAISE EXCEPTION 'Either seller_id or admin_listing_id must be provided';
  END IF;

  RETURN QUERY
  SELECT
    COUNT(*) FILTER (WHERE event_type = 'page_view') as total_views,
    COUNT(DISTINCT visitor_id) as unique_visitors,
    COUNT(*) FILTER (WHERE event_type = 'product_click') as product_clicks,
    COUNT(*) FILTER (WHERE event_type = 'contact_submit') as contact_submissions,
    AVG(
      CASE 
        WHEN event_type = 'page_view' AND (event_data->>'duration')::INTEGER > 0 
        THEN (event_data->>'duration')::INTEGER 
        ELSE NULL
      END
    ) as avg_time_on_page
  FROM shop_analytics
  WHERE 
    (p_seller_id IS NOT NULL AND seller_id = p_seller_id)
    OR
    (p_admin_listing_id IS NOT NULL AND admin_listing_id = p_admin_listing_id)
    AND created_at >= NOW() - (p_days || ' days')::INTERVAL;
END;


-- Function: get_unread_message_count


DECLARE
    unread_count bigint;
BEGIN
    SELECT COUNT(DISTINCT m.thread_id) INTO unread_count
    FROM public.messages m
    JOIN public.message_threads mt ON mt.id = m.thread_id
    WHERE m.is_read = false
    AND m.sender_id != user_uuid
    AND (
        mt.buyer_id = user_uuid
        OR EXISTS (
            SELECT 1 FROM public.sellers s
            WHERE s.id = mt.seller_id AND s.user_id = user_uuid
        )
    );
    
    RETURN unread_count;
END;


-- Function: get_users_with_gdpr_consent


begin
  return query
  select
    p.id,
    p.private_email,
    p.display_name,
    p.gdpr_consent,
    p.gdpr_consent_date,
    p.created_at
  from public.profiles p
  where p.gdpr_consent = true
  order by p.created_at desc;
end;


-- Function: handle_business_created_notification


BEGIN
    -- Only notify for user-created businesses, not admin-created
    IF NEW.created_via IN ('user_claim_modal', 'user_portal') THEN
        -- Webhook will be triggered by Supabase based on this trigger
        -- The webhook payload will include the NEW row data
        RAISE LOG 'Business created notification: % (%)', NEW.business_name, NEW.created_via;
    END IF;
    
    RETURN NEW;
END;


-- Function: handle_claim_created_notification


BEGIN
    -- Only notify for user-submitted claims, not admin-created
    -- Skip direct claims to avoid duplicate notifications
    IF NEW.created_via IN ('user_claim_modal', 'user_portal') AND NEW.claim_type = 'request' THEN
        -- Webhook will be triggered by Supabase based on this trigger
        RAISE LOG 'Claim created notification: % (%)', NEW.business_id, NEW.created_via;
    END IF;
    
    RETURN NEW;
END;


-- Function: handle_new_user


begin
  insert into public.profiles (
    id,
    private_email,
    display_name,
    gdpr_consent,
    gdpr_consent_date,
    status,
    created_at,
    updated_at
  )
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', ''),
    coalesce((new.raw_user_meta_data->>'gdpr_consent')::boolean, false),
    (new.raw_user_meta_data->>'gdpr_consent_date')::timestamptz,
    'active',
    now(),
    now()
  )
  on conflict (id) do update
  set
    private_email = excluded.private_email,
    display_name = excluded.display_name,
    gdpr_consent = excluded.gdpr_consent,
    gdpr_consent_date = excluded.gdpr_consent_date,
    updated_at = now();

  return new;
end;


-- Function: handle_updated_at


begin
  new.updated_at = now();
  return new;
end;


-- Function: increment_directory_analytics


BEGIN
  INSERT INTO directory_analytics (seller_id, event_type, event_date, count, metadata)
  VALUES (p_seller_id, p_event_type, CURRENT_DATE, 1, p_metadata)
  ON CONFLICT (seller_id, event_type, event_date)
  DO UPDATE SET 
    count = directory_analytics.count + 1,
    metadata = COALESCE(EXCLUDED.metadata, directory_analytics.metadata);
END;


-- Function: increment_product_views


BEGIN
  UPDATE public.products
  SET view_count = view_count + 1
  WHERE id = product_id;
END;


-- Function: increment_promo_code_usage


BEGIN
    -- Increment the usage count
    UPDATE promo_codes 
    SET current_uses = current_uses + 1,
        updated_at = NOW()
    WHERE id = NEW.promo_code_id;
    
    RETURN NEW;
END;


-- Function: initialize_service_trial


BEGIN
  UPDATE public.sellers
  SET
    service_subscription_status = 'trial',
    trial_ends_at = now() + interval '1 month',
    service_subscription_started_at = now()
  WHERE id = p_seller_id;
END;


-- Function: is_admin


  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );


-- Function: is_business_referral_reward_eligible


DECLARE
    v_business RECORD;
    v_existing_reward_count INTEGER;
BEGIN
    -- Load the business
    SELECT * INTO v_business 
    FROM public.businesses 
    WHERE id = p_business_id;
    
    -- Not found
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    -- Must have a referrer
    IF v_business.referred_by_business_id IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Must be active
    IF v_business.status != 'active' THEN
        RETURN FALSE;
    END IF;
    
    -- Must not have already produced an applied reward
    SELECT COUNT(*) INTO v_existing_reward_count
    FROM public.business_referral_rewards 
    WHERE referred_business_id = p_business_id 
    AND status = 'applied';
    
    IF v_existing_reward_count > 0 THEN
        RETURN FALSE;
    END IF;
    
    -- Referrer must exist and be active
    IF NOT EXISTS (
        SELECT 1 FROM public.businesses 
        WHERE id = v_business.referred_by_business_id 
        AND status = 'active'
    ) THEN
        RETURN FALSE;
    END IF;
    
    RETURN TRUE;
END;


-- Function: is_service_subscription_active


DECLARE
  v_status subscription_status;
  v_trial_ends_at timestamptz;
  v_manual_override BOOLEAN;
BEGIN
  SELECT service_subscription_status, trial_ends_at, manual_subscription_override
  INTO v_status, v_trial_ends_at, v_manual_override
  FROM public.sellers
  WHERE id = p_seller_id;

  -- If manual override is set, always return true
  IF v_manual_override = TRUE THEN
    RETURN TRUE;
  END IF;

  -- Check if subscription is active
  IF v_status = 'active' THEN
    RETURN TRUE;
  END IF;

  -- Check if trial is still valid
  IF v_status = 'trial' AND v_trial_ends_at > now() THEN
    RETURN TRUE;
  END IF;

  RETURN FALSE;
END;


-- Function: is_service_subscription_active


DECLARE
  v_status subscription_status;
  v_trial_ends_at timestamptz;
BEGIN
  SELECT service_subscription_status, trial_ends_at
  INTO v_status, v_trial_ends_at
  FROM public.sellers
  WHERE id = p_seller_id;

  -- Check if in trial period
  IF v_status = 'trial' AND v_trial_ends_at > now() THEN
    RETURN true;
  END IF;

  -- Check if active subscription
  IF v_status = 'active' THEN
    RETURN true;
  END IF;

  RETURN false;
END;


-- Function: is_shop_member


BEGIN
  RETURN EXISTS(
    SELECT 1 FROM public.shop_members sm
    WHERE sm.seller_id = p_seller_id
      AND sm.user_id = p_user_id
      AND sm.accepted_at IS NOT NULL
      AND (
        (p_min_role = 'staff') OR
        (p_min_role = 'admin' AND sm.role IN ('admin', 'owner')) OR
        (p_min_role = 'owner' AND sm.role = 'owner')
      )
  );
END;


-- Function: is_super_admin


BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = check_user_id AND role = 'super_admin'
  );
END;


-- Function: link_business_to_signed_in_user


declare
  v_business_id uuid;
begin
  -- Find ONE unclaimed business that matches signed-in email
  select b.id
  into v_business_id
  from public.businesses b
  where lower(trim(b.contact_email)) = lower(trim(auth.email()))
    and (b.user_id is null)
    and (b.claimed = false)
  order by b.created_at desc
  limit 1;

  if v_business_id is null then
    raise exception 'No unclaimed business found for this email';
  end if;

  update public.businesses
  set user_id   = auth.uid(),
      claimed   = true,
      claimed_at = now(),
      claimed_by = auth.email()
  where id = v_business_id;

  return v_business_id;
end;


-- Function: prevent_service_publish_without_sub


DECLARE
  v_type TEXT;
  v_status TEXT;
  v_override BOOLEAN;
BEGIN
  -- Only check on INSERT or when status changes to 'published'
  IF TG_OP = 'UPDATE' AND OLD.status = 'published' AND NEW.status = 'published' THEN
    RETURN NEW;
  END IF;

  -- Only enforce for published services
  IF NEW.status != 'published' THEN
    RETURN NEW;
  END IF;

  -- Get seller info
  SELECT seller_tier, service_subscription_status, manual_subscription_override
  INTO v_type, v_status, v_override
  FROM sellers
  WHERE id = NEW.seller_id;

  -- Check if seller tier is pro (both fixed_price and pro can sell services, but pro has subscription)
  IF v_type != 'pro' THEN
    RAISE EXCEPTION 'Only Pro sellers can publish services. Please upgrade to Pro tier first.';
  END IF;

  -- Check subscription status (unless manual override)
  IF NOT v_override AND v_status NOT IN ('trial', 'active') THEN
    RAISE EXCEPTION 'Active service subscription required to publish services. Status: %', v_status;
  END IF;

  RETURN NEW;
END;


-- Function: process_pending_referral_rewards


DECLARE
    v_pending_rewards RECORD;
    v_processed_count INTEGER := 0;
    v_failed_count INTEGER := 0;
    v_skipped_count INTEGER := 0;
    v_result JSON;
BEGIN
    -- Process all pending rewards for eligible businesses
    FOR v_pending_rewards IN 
        SELECT r.id, r.referred_business_id
        FROM public.business_referral_rewards r
        WHERE r.status = 'pending'
    LOOP
        BEGIN
            -- Try to apply the reward
            v_result := public.apply_referral_reward_for_business(v_pending_rewards.referred_business_id);
            
            IF v_result->>'success' = 'true' THEN
                v_processed_count := v_processed_count + 1;
            ELSIF v_result->>'action' = 'already_applied' THEN
                v_skipped_count := v_skipped_count + 1;
            ELSE
                v_failed_count := v_failed_count + 1;
            END IF;
            
        EXCEPTION
            WHEN OTHERS THEN
                v_failed_count := v_failed_count + 1;
                RAISE WARNING 'Failed to process pending reward %: %', v_pending_rewards.id, SQLERRM;
        END;
    END LOOP;
    
    RETURN json_build_object(
        'success', true,
        'processed', v_processed_count,
        'skipped', v_skipped_count,
        'failed', v_failed_count,
        'total_attempted', v_processed_count + v_skipped_count + v_failed_count
    );
END;


-- Function: reset_unread_count


BEGIN
  IF NEW.is_read = TRUE AND OLD.is_read = FALSE THEN
    UPDATE conversation_threads
    SET 
      seller_unread_count = CASE 
        WHEN NEW.sender_type = 'buyer' AND seller_unread_count > 0 
        THEN seller_unread_count - 1 
        ELSE seller_unread_count 
      END,
      buyer_unread_count = CASE 
        WHEN NEW.sender_type = 'seller' AND buyer_unread_count > 0 
        THEN buyer_unread_count - 1 
        ELSE buyer_unread_count 
      END
    WHERE id = NEW.thread_id;
  END IF;
  
  RETURN NEW;
END;


-- Function: select_monthly_referral_winner


BEGIN
    RETURN QUERY
    WITH referral_counts AS (
        SELECT 
            referrer_business_id,
            COUNT(*) as count
        FROM referrals
        WHERE status = 'approved'
        GROUP BY referrer_business_id
    ),
    winner_selection AS (
        SELECT 
            rc.referrer_business_id,
            rc.count,
            -- This gives each referral an equal chance, not businesses with more referrals
            ROW_NUMBER() OVER (ORDER BY random()) as rn
        FROM referral_counts rc
    )
    SELECT 
        b.id as business_id,
        b.name as business_name,
        ws.count as referral_count
    FROM winner_selection ws
    JOIN businesses b ON b.id = ws.referrer_business_id
    WHERE ws.rn = 1;
END;


-- Function: set_commission_by_seller_type


BEGIN
  -- Products or hybrid sellers get 6% commission
  IF NEW.seller_type IN ('products', 'hybrid') THEN
    NEW.commission_bps := 600;
  END IF;

  -- Service-only sellers have no commission
  IF NEW.seller_type = 'services' THEN
    NEW.commission_bps := NULL;
  END IF;

  RETURN NEW;
END;


-- Function: set_order_number


BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;


-- Function: set_payout_method_by_country


BEGIN
  -- If country is NZ or New Zealand, use stripe_connect, otherwise use manual
  IF NEW.country = 'NZ' OR NEW.country = 'New Zealand' THEN
    NEW.payout_method := 'stripe_connect';
  ELSIF NEW.country IS NOT NULL AND NEW.country != '' THEN
    NEW.payout_method := 'manual';
  END IF;
  
  RETURN NEW;
END;


-- Function: set_quote_number


BEGIN
  IF NEW.quote_number IS NULL OR NEW.quote_number = '' THEN
    NEW.quote_number := generate_quote_number();
  END IF;
  RETURN NEW;
END;


-- Function: set_seller_commission


BEGIN
  -- All sellers get 6.5% commission (650 basis points)
  -- Both fixed_price and pro sellers have the same commission rate
  NEW.commission_bps := 650;

  RETURN NEW;
END;


-- Function: set_updated_at


begin
  new.updated_at = now();
  return new;
end 

-- Function: sync_business_to_subscriber


DECLARE
  existing_subscriber UUID;
  subscriber_id UUID;
BEGIN
  IF NEW.business_email IS NULL OR NEW.is_active = false OR NEW.status != 'active' THEN
    RETURN NEW;
  END IF;
  
  SELECT id INTO existing_subscriber 
  FROM email_subscribers 
  WHERE email = NEW.business_email;
  
  IF existing_subscriber IS NOT NULL THEN
    INSERT INTO email_subscriber_entities (subscriber_id, entity_type, entity_id, entity_name, relationship_type)
    VALUES (existing_subscriber, 'business', NEW.id, NEW.business_name, 'owner')
    ON CONFLICT DO NOTHING;
    
    RETURN NEW;
  END IF;
  
  INSERT INTO email_subscribers (
    email, 
    first_name, 
    source, 
    status,
    created_at
  ) VALUES (
    NEW.business_email,
    COALESCE(NEW.business_contact_person, SPLIT_PART(NEW.business_name, ' ', 1)),
    'business_signup',
    'subscribed',
    NOW()
  )
  RETURNING id INTO subscriber_id;
  
  INSERT INTO email_subscriber_entities (subscriber_id, entity_type, entity_id, entity_name, relationship_type)
  VALUES (subscriber_id, 'business', NEW.id, NEW.business_name, 'owner');
  
  RETURN NEW;
END;


-- Function: sync_user_email_to_profile


begin
  if new.email is distinct from old.email then
    update public.profiles
    set
      private_email = new.email,
      updated_at = now()
    where id = new.id;
  end if;

  return new;
end;


-- Function: sync_visibility_on_subscription_change


      BEGIN
          IF OLD.subscription_tier IS DISTINCT FROM NEW.subscription_tier THEN
              IF NEW.visibility_mode = 'manual' THEN
                  RETURN NEW;
              END IF;
              IF NEW.subscription_tier = 'moana' THEN
                  NEW.visibility_tier := 'homepage';
                  RAISE LOG 'Auto-set visibility_tier=homepage for business % (subscription_tier changed to moana)', NEW.id;
              END IF;
              IF OLD.subscription_tier = 'moana' AND NEW.subscription_tier != 'moana' 
                 AND NEW.visibility_tier = 'homepage' THEN
                  NEW.visibility_tier := 'none';
                  RAISE LOG 'Auto-reset visibility_tier=none for business % (subscription_tier changed from moana to %)', NEW.id, NEW.subscription_tier;
              END IF;
          END IF;
          RETURN NEW;
      END;
      

-- Function: track_shop_event


DECLARE
  v_event_id BIGINT;
  v_device_type VARCHAR(20);
BEGIN
  -- Validate that either seller_id or admin_listing_id is provided
  IF p_seller_id IS NULL AND p_admin_listing_id IS NULL THEN
    RAISE EXCEPTION 'Either seller_id or admin_listing_id must be provided';
  END IF;

  IF p_seller_id IS NOT NULL AND p_admin_listing_id IS NOT NULL THEN
    RAISE EXCEPTION 'Cannot provide both seller_id and admin_listing_id';
  END IF;

  -- Determine device type from user agent
  v_device_type := CASE
    WHEN p_user_agent ~* 'mobile' THEN 'mobile'
    WHEN p_user_agent ~* 'tablet|ipad' THEN 'tablet'
    ELSE 'desktop'
  END;

  INSERT INTO shop_analytics (
    seller_id,
    admin_listing_id,
    event_type,
    event_data,
    visitor_id,
    session_id,
    user_agent,
    referrer,
    ip_address,
    device_type
  ) VALUES (
    p_seller_id,
    p_admin_listing_id,
    p_event_type,
    p_event_data,
    p_visitor_id,
    p_session_id,
    p_user_agent,
    p_referrer,
    p_ip_address,
    v_device_type
  )
  RETURNING id INTO v_event_id;

  RETURN v_event_id;
END;


-- Function: trigger_apply_referral_reward_on_activation


      DECLARE
          v_result JSON;
      BEGIN
          -- Only apply reward if status changed to 'active' and business has a referrer
          IF NEW.status = 'active' 
             AND OLD.status != 'active' 
             AND NEW.referred_by_business_id IS NOT NULL THEN
              
              -- Apply the referral reward
              v_result := public.apply_referral_reward_for_business(NEW.id);
              
              -- Log the result for debugging
              IF (v_result->>'success')::boolean = true THEN
                  RAISE LOG 'Referral reward applied for business %: %', NEW.id, v_result;
                  
                  -- Log success to audit_logs
                  INSERT INTO public.audit_logs (table_name, record_id, action, new_data)
                  VALUES (
                      'businesses',
                      NEW.id,
                      'referral_reward_applied',
                      jsonb_build_object(
                          'result', v_result::text,
                          'referred_business_id', NEW.id,
                          'referrer_business_id', NEW.referred_by_business_id,
                          'triggered_by', 'on_activation'
                      )
                  );
              ELSE
                  RAISE WARNING 'Referral reward application FAILED for business %: %', NEW.id, v_result;
                  
                  -- Log failure to audit_logs so it is NOT silently lost
                  INSERT INTO public.audit_logs (table_name, record_id, action, new_data)
                  VALUES (
                      'businesses',
                      NEW.id,
                      'referral_reward_failed',
                      jsonb_build_object(
                          'error', v_result->>'error',
                          'reason', v_result->>'reason',
                          'referred_business_id', NEW.id,
                          'referrer_business_id', NEW.referred_by_business_id,
                          'triggered_by', 'on_activation'
                      )
                  );
              END IF;
          END IF;
          
          RETURN NEW;
      EXCEPTION
          WHEN OTHERS THEN
              -- Log error to audit_logs instead of silently swallowing
              BEGIN
                  INSERT INTO public.audit_logs (table_name, record_id, action, new_data)
                  VALUES (
                      'businesses',
                      NEW.id,
                      'referral_reward_exception',
                      jsonb_build_object(
                          'error', SQLERRM,
                          'sqlstate', SQLSTATE,
                          'referred_business_id', NEW.id,
                          'referrer_business_id', NEW.referred_by_business_id,
                          'triggered_by', 'on_activation'
                      )
                  );
              EXCEPTION WHEN OTHERS THEN
                  -- If even logging fails, just warn
                  RAISE WARNING 'Failed to log referral trigger error: %', SQLERRM;
              END;
              
              RAISE WARNING 'Referral reward trigger exception for business %: %', NEW.id, SQLERRM;
              RETURN NEW;
      END;
      

-- Function: trigger_create_pending_referral_reward


BEGIN
    -- Only create pending reward if business has a referrer
    IF NEW.referred_by_business_id IS NOT NULL THEN
        PERFORM public.create_pending_referral_reward(NEW.id);
    END IF;
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't fail the insert
        RAISE WARNING 'Failed to create pending referral reward in trigger: %', SQLERRM;
        RETURN NEW;
END;


-- Function: trigger_set_timestamp


BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;


-- Function: trigger_update_referral_eligibility


BEGIN
    -- Update reward eligibility when referrer or referred business changes
    -- This handles cases where a referrer becomes inactive or a referral is removed
    
    -- If referrer changed or referrer status changed, update eligibility
    IF (OLD.referred_by_business_id IS DISTINCT FROM NEW.referred_by_business_id) THEN
        -- Referral was added or removed, update/create pending record
        IF NEW.referred_by_business_id IS NOT NULL THEN
            PERFORM public.create_pending_referral_reward(NEW.id);
        END IF;
    END IF;
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't fail the update
        RAISE WARNING 'Failed to update referral eligibility in trigger: %', SQLERRM;
        RETURN NEW;
END;


-- Function: update_admin_directory_listings_updated_at


BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;


-- Function: update_cart_updated_at


BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;


-- Function: update_conversation_thread


BEGIN
  UPDATE conversation_threads
  SET 
    last_message_at = NEW.created_at,
    last_message_preview = LEFT(NEW.message, 100),
    updated_at = NEW.created_at,
    seller_unread_count = CASE 
      WHEN NEW.sender_type = 'buyer' THEN seller_unread_count + 1 
      ELSE seller_unread_count 
    END,
    buyer_unread_count = CASE 
      WHEN NEW.sender_type = 'seller' THEN buyer_unread_count + 1 
      ELSE buyer_unread_count 
    END
  WHERE id = NEW.thread_id;
  
  RETURN NEW;
END;


-- Function: update_creator_feature_stats


BEGIN
  -- Insert or update stats
  INSERT INTO creator_feature_stats (
    listing_id,
    times_featured,
    first_featured_date,
    last_featured_date,
    total_shares,
    total_likes,
    total_comments,
    times_shared_by_creator
  )
  VALUES (
    NEW.listing_id,
    1,
    NEW.featured_date,
    NEW.featured_date,
    COALESCE(NEW.shares_count, 0),
    COALESCE(NEW.likes_count, 0),
    COALESCE(NEW.comments_count, 0),
    CASE WHEN NEW.creator_shared THEN 1 ELSE 0 END
  )
  ON CONFLICT (listing_id) DO UPDATE SET
    times_featured = creator_feature_stats.times_featured + 1,
    last_featured_date = NEW.featured_date,
    total_shares = creator_feature_stats.total_shares + COALESCE(NEW.shares_count, 0),
    total_likes = creator_feature_stats.total_likes + COALESCE(NEW.likes_count, 0),
    total_comments = creator_feature_stats.total_comments + COALESCE(NEW.comments_count, 0),
    times_shared_by_creator = creator_feature_stats.times_shared_by_creator + CASE WHEN NEW.creator_shared THEN 1 ELSE 0 END,
    updated_at = NOW();
  
  RETURN NEW;
END;


-- Function: update_directory_featured


BEGIN
  -- Standard tier gets featured badge automatically
  IF NEW.directory_tier = 'standard' THEN
    NEW.directory_featured := true;
  ELSE
    NEW.directory_featured := false;
  END IF;
  RETURN NEW;
END;


-- Function: update_message_threads_updated_at


BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;


-- Function: update_parent_cart_timestamp


BEGIN
  UPDATE carts SET updated_at = NOW() 
  WHERE id = COALESCE(NEW.cart_id, OLD.cart_id);
  RETURN COALESCE(NEW, OLD);
END;


-- Function: update_product_search_vector


BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.tags, ' '), '')), 'C');
  RETURN NEW;
END;


-- Function: update_promo_codes_updated_at


BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;


-- Function: update_quote_timestamps


BEGIN
  IF NEW.status = 'sent' AND OLD.status != 'sent' THEN
    NEW.sent_at := NOW();
  ELSIF NEW.status = 'viewed' AND OLD.status != 'viewed' THEN
    NEW.viewed_at := NOW();
  ELSIF NEW.status = 'accepted' AND OLD.status != 'accepted' THEN
    NEW.accepted_at := NOW();
  ELSIF NEW.status = 'declined' AND OLD.status != 'declined' THEN
    NEW.declined_at := NOW();
  ELSIF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    NEW.completed_at := NOW();
  END IF;
  
  NEW.updated_at := NOW();
  RETURN NEW;
END;


-- Function: update_rfp_proposal_count


BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE rfp_requests 
    SET proposal_count = proposal_count + 1 
    WHERE id = NEW.rfp_request_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE rfp_requests 
    SET proposal_count = proposal_count - 1 
    WHERE id = OLD.rfp_request_id;
  END IF;
  RETURN NULL;
END;


-- Function: update_rfp_search_vector


BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.category, '')), 'C');
  RETURN NEW;
END;


-- Function: update_rfq_proposal_count


BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE rfp_requests 
    SET proposal_count = proposal_count + 1 
    WHERE id = NEW.rfp_request_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE rfp_requests 
    SET proposal_count = proposal_count - 1 
    WHERE id = OLD.rfp_request_id;
  END IF;
  RETURN NULL;
END;


-- Function: update_rfq_search_vector


BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.category, '')), 'C');
  RETURN NEW;
END;


-- Function: update_seller_commission_on_plan_change


BEGIN
  -- Update commission_bps from the plan
  IF NEW.current_plan IS DISTINCT FROM OLD.current_plan THEN
    SELECT commission_bps INTO NEW.commission_bps
    FROM public.subscription_plans
    WHERE id = NEW.current_plan;
  END IF;

  RETURN NEW;
END;


-- Function: update_seller_follower_count


BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.sellers
        SET total_followers = total_followers + 1
        WHERE id = NEW.seller_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.sellers
        SET total_followers = GREATEST(0, total_followers - 1)
        WHERE id = OLD.seller_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;


-- Function: update_seller_product_count


BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.sellers
    SET product_count = product_count + 1
    WHERE id = NEW.seller_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.sellers
    SET product_count = GREATEST(product_count - 1, 0)
    WHERE id = OLD.seller_id;
  END IF;
  RETURN NULL;
END;


-- Function: update_seller_search_vector


BEGIN
  NEW.search_vector := 
    -- Business name (highest weight)
    setweight(to_tsvector('english', COALESCE(NEW.business_name, '')), 'A') ||
    -- Primary category (high weight)
    setweight(to_tsvector('english', COALESCE(NEW.primary_category, '')), 'B') ||
    -- Location fields (medium weight)
    setweight(to_tsvector('english', COALESCE(NEW.country, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(NEW.city, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(NEW.region, '')), 'C') ||
    -- Category tags (lower weight)
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.category_tags, ' '), '')), 'D');
  
  RETURN NEW;
END;


-- Function: update_seller_service_count


BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Increment service count when new service is added
    UPDATE public.sellers
    SET service_count = service_count + 1
    WHERE id = NEW.seller_id;
  ELSIF TG_OP = 'DELETE' THEN
    -- Decrement service count when service is deleted
    UPDATE public.sellers
    SET service_count = GREATEST(0, service_count - 1)
    WHERE id = OLD.seller_id;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Handle seller_id changes (rare but possible)
    IF OLD.seller_id != NEW.seller_id THEN
      UPDATE public.sellers
      SET service_count = GREATEST(0, service_count - 1)
      WHERE id = OLD.seller_id;
      
      UPDATE public.sellers
      SET service_count = service_count + 1
      WHERE id = NEW.seller_id;
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;


-- Function: update_sellers_search_vector


BEGIN
  NEW.search_vector := 
    -- Business name (highest weight)
    setweight(to_tsvector('english', COALESCE(NEW.business_name, '')), 'A') ||
    -- Primary category (high weight)
    setweight(to_tsvector('english', COALESCE(NEW.primary_category, '')), 'B') ||
    -- Location fields (medium weight)
    setweight(to_tsvector('english', COALESCE(NEW.country, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(NEW.city, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(NEW.region, '')), 'C') ||
    -- Category tags (lower weight)
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.category_tags, ' '), '')), 'D');
  
  RETURN NEW;
END;


-- Function: update_service_request_response_count


BEGIN
  UPDATE service_requests
  SET response_count = (
    SELECT COUNT(*) FROM service_request_responses
    WHERE request_id = NEW.request_id
  )
  WHERE id = NEW.request_id;
  RETURN NEW;
END;


-- Function: update_service_requests_updated_at


BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;


-- Function: update_shipment_from_ptp


BEGIN
  UPDATE public.shipments
  SET 
    status = COALESCE(p_ptp_data->>'status', status),
    tracking_number = COALESCE(p_ptp_data->>'tracking_number', tracking_number),
    ptp_tracking_url = COALESCE(p_ptp_data->>'tracking_url', ptp_tracking_url),
    last_tracking_update = now(),
    ptp_response = ptp_response || p_ptp_data
  WHERE id = p_shipment_id;
END;


-- Function: update_shipments_updated_at


BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;


-- Function: update_shipping_options_updated_at


BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;


-- Function: update_thread_last_message


BEGIN
    UPDATE public.message_threads
    SET last_message_at = NEW.created_at,
        updated_at = NEW.created_at
    WHERE id = NEW.thread_id;
    RETURN NEW;
END;


-- Function: update_updated_at_column


BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;


-- Function: validate_coupon_for_seller


DECLARE
  v_coupon RECORD;
  v_discount bigint := 0;
BEGIN
  -- Check if coupons table exists, if not return invalid
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'coupons'
  ) THEN
    RETURN QUERY SELECT false, 0::bigint, 'Coupon system not available'::text;
    RETURN;
  END IF;

  -- Try to find the coupon
  EXECUTE format('
    SELECT 
      id, 
      code, 
      discount_type, 
      discount_value, 
      min_purchase_cents,
      max_discount_cents,
      valid_from,
      valid_until,
      usage_limit,
      usage_count,
      active
    FROM coupons 
    WHERE seller_id = $1 
      AND UPPER(code) = UPPER($2)
      AND active = true
      AND (valid_from IS NULL OR valid_from <= NOW())
      AND (valid_until IS NULL OR valid_until >= NOW())
    LIMIT 1
  ') INTO v_coupon USING p_seller_id, p_code;

  -- If coupon not found or invalid
  IF v_coupon IS NULL THEN
    RETURN QUERY SELECT false, 0::bigint, 'Invalid or expired coupon code'::text;
    RETURN;
  END IF;

  -- Check usage limit
  IF v_coupon.usage_limit IS NOT NULL AND v_coupon.usage_count >= v_coupon.usage_limit THEN
    RETURN QUERY SELECT false, 0::bigint, 'Coupon usage limit reached'::text;
    RETURN;
  END IF;

  -- Check minimum purchase
  IF v_coupon.min_purchase_cents IS NOT NULL AND p_subtotal_cents < v_coupon.min_purchase_cents THEN
    RETURN QUERY SELECT 
      false, 
      0::bigint, 
      format('Minimum purchase of %s required', 
        to_char(v_coupon.min_purchase_cents / 100.0, 'FM999999990.00')
      )::text;
    RETURN;
  END IF;

  -- Calculate discount based on type
  IF v_coupon.discount_type = 'percentage' THEN
    v_discount := FLOOR(p_subtotal_cents * v_coupon.discount_value / 100);
    -- Apply max discount cap if set
    IF v_coupon.max_discount_cents IS NOT NULL AND v_discount > v_coupon.max_discount_cents THEN
      v_discount := v_coupon.max_discount_cents;
    END IF;
  ELSIF v_coupon.discount_type = 'fixed' THEN
    v_discount := v_coupon.discount_value;
  END IF;

  -- Ensure discount doesn't exceed subtotal
  IF v_discount > p_subtotal_cents THEN
    v_discount := p_subtotal_cents;
  END IF;

  RETURN QUERY SELECT true, v_discount, 'Coupon applied successfully'::text;
END;


-- Function: validate_coupon_for_seller


  with c as (
    select *
    from coupons
    where seller_id = p_seller_id
      and lower(code) = lower(p_code)
      and is_active = true
      and (starts_at is null or starts_at <= now())
      and (ends_at   is null or ends_at   >= now())
    limit 1
  )
  select
    c.id,
    c.ctype,
    c.percent_off,
    c.amount_off,
    case
      when c.ctype = 'PERCENT' and c.percent_off is not null
        then floor(p_subtotal_cents * (c.percent_off / 100.0))::bigint
      when c.ctype = 'FIXED' and c.amount_off is not null
           and (c.currency is null or c.currency = p_currency)
        then least(c.amount_off, p_subtotal_cents)::bigint
      else 0::bigint
    end as discount_cents
  from c
  union all
  -- If coupon not found/valid, return a zero-discount row
  select null::bigint, null::coupon_type, null::numeric, null::integer, 0::bigint
  where not exists (select 1 from c);


-- Function: validate_financial_insights


BEGIN
  -- Validate revenue_streams contains valid values
  IF NEW.revenue_streams IS NOT NULL THEN
    FOR i IN 1..array_length(NEW.revenue_streams, 1) LOOP
      IF NEW.revenue_streams[i] NOT IN ('product-sales', 'service-fees', 'subscription', 'consulting', 'licensing', 'advertising', 'commission', 'rental', 'other') THEN
        RAISE EXCEPTION 'Invalid revenue stream: %', NEW.revenue_streams[i];
      END IF;
    END LOOP;
  END IF;
  
  RETURN NEW;
END;


-- Function: validate_founder_insights


BEGIN
  -- Validate business_stage
  IF NEW.business_stage IS NOT NULL AND NEW.business_stage NOT IN ('idea', 'startup', 'growth', 'mature') THEN
    RAISE EXCEPTION 'Invalid business stage: %', NEW.business_stage;
  END IF;
  
  -- Validate top_challenges array contains valid values (if we want strict validation)
  -- Note: This is optional validation - uncomment if needed
  -- IF NEW.top_challenges IS NOT NULL THEN
  --   FOR i IN 1..array_length(NEW.top_challenges, 1) LOOP
  --     IF NEW.top_challenges[i] NOT IN ('funding', 'marketing', 'hiring', 'regulations', 'competition', 'technology', 'skills', 'network', 'time', 'cash-flow') THEN
  --       RAISE EXCEPTION 'Invalid challenge: %', NEW.top_challenges[i];
  --     END IF;
  --   END LOOP;
  -- END IF;
  
  RETURN NEW;
END;


-- Function: verify_purchase_for_review


BEGIN
    -- If order_id is provided, verify the purchase
    IF NEW.order_id IS NOT NULL THEN
        -- Check if the user actually purchased this product in this order
        IF NOT EXISTS (
            SELECT 1 FROM public.order_items oi
            JOIN public.orders o ON o.id = oi.order_id
            WHERE oi.order_id = NEW.order_id
            AND oi.product_id = NEW.product_id
            AND o.user_id = NEW.user_id
        ) THEN
            RAISE EXCEPTION 'Cannot review a product you have not purchased';
        END IF;
        
        -- Mark as verified purchase
        NEW.is_verified_purchase := true;
    END IF;
    
    RETURN NEW;
END;



-- ========================================
-- TRIGGERS
-- ========================================

-- Trigger: business-created-notifications on businesses
CREATE TRIGGER business-created-notifications
  AFTER INSERT ON businesses
  FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request('https://mnmisjprswpuvcojnbip.supabase.co/functions/v1/handle-notifications', 'POST', '{"Content-type":"application/json"}', '{}', '5000');

-- Trigger: on_business_insert_create_pending_referral_reward on businesses
CREATE TRIGGER on_business_insert_create_pending_referral_reward
  AFTER INSERT ON businesses
  FOR EACH ROW EXECUTE FUNCTION trigger_create_pending_referral_reward();

-- Trigger: on_business_insert_sync on businesses
CREATE TRIGGER on_business_insert_sync
  AFTER INSERT ON businesses
  FOR EACH ROW EXECUTE FUNCTION sync_business_to_subscriber();

-- Trigger: on_business_insert_sync on businesses
CREATE TRIGGER on_business_insert_sync
  AFTER UPDATE ON businesses
  FOR EACH ROW EXECUTE FUNCTION sync_business_to_subscriber();

-- Trigger: on_business_subscription_sync_visibility on businesses
CREATE TRIGGER on_business_subscription_sync_visibility
  BEFORE UPDATE ON businesses
  FOR EACH ROW EXECUTE FUNCTION sync_visibility_on_subscription_change();

-- Trigger: on_business_update_apply_referral_reward on businesses
CREATE TRIGGER on_business_update_apply_referral_reward
  AFTER UPDATE ON businesses
  FOR EACH ROW EXECUTE FUNCTION trigger_apply_referral_reward_on_activation();

-- Trigger: on_business_update_referral_eligibility on businesses
CREATE TRIGGER on_business_update_referral_eligibility
  AFTER UPDATE ON businesses
  FOR EACH ROW EXECUTE FUNCTION trigger_update_referral_eligibility();

-- Trigger: trigger_business_created_notification on businesses
CREATE TRIGGER trigger_business_created_notification
  AFTER INSERT ON businesses
  FOR EACH ROW EXECUTE FUNCTION handle_business_created_notification();

-- Trigger: claim-created-notifications on claim_requests
CREATE TRIGGER claim-created-notifications
  AFTER INSERT ON claim_requests
  FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request('https://mnmisjprswpuvcojnbip.supabase.co/functions/v1/handle-notifications', 'POST', '{"Content-type":"application/json"}', '{}', '5000');

-- Trigger: trigger_claim_created_notification on claim_requests
CREATE TRIGGER trigger_claim_created_notification
  AFTER INSERT ON claim_requests
  FOR EACH ROW EXECUTE FUNCTION handle_claim_created_notification();

-- Trigger: set_email_campaigns_updated_at on email_campaigns
CREATE TRIGGER set_email_campaigns_updated_at
  BEFORE UPDATE ON email_campaigns
  FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- Trigger: set_email_subscriber_entities_updated_at on email_subscriber_entities
CREATE TRIGGER set_email_subscriber_entities_updated_at
  BEFORE UPDATE ON email_subscriber_entities
  FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- Trigger: set_email_subscribers_updated_at on email_subscribers
CREATE TRIGGER set_email_subscribers_updated_at
  BEFORE UPDATE ON email_subscribers
  FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- Trigger: handle_user_onboarding_status_updated_at on user_onboarding_status
CREATE TRIGGER handle_user_onboarding_status_updated_at
  BEFORE UPDATE ON user_onboarding_status
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

