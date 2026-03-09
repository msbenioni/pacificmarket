# Database Usage Map

Generated: 2026-03-09T08:37:54.539Z

## Tables

### admin_notification_settings

- src/components/admin/NotificationSettings.jsx
  - select: '*'
  - upsert: user_id, admin_email, updated_at

### business_images

- src/screens/BusinessProfile.jsx
  - select: "*"

### business_insights_snapshots

- src/screens/AdminDashboard.jsx
  - select: "*"
- src/screens/BusinessPortal.jsx
  - select: "*"
  - update: updated_date (dynamic)
  - insert: submitted_date (dynamic)

### business_invoice_settings

- src/screens/InvoiceGenerator.jsx
  - select: '*'
  - upsert: (dynamic keys) (dynamic)

### business_signature_settings

- src/screens/EmailSignatureGenerator.jsx
  - select: "*"
  - upsert: (dynamic keys) (dynamic)

### businesses

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

### claim_requests

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
  - select: ` *, businesses:business_id ( name, city, country, industry ) `
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
  - select: ` *, businesses:business_id (name, city, country, industry) `

### email_campaign_queue

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
  - select: ` *, email_campaigns ( name, subject, status ) `

### email_campaign_recipients

- src/app/api/admin/email/processor/route.js
  - select: 'email'
  - insert: (dynamic keys) (dynamic)
  - update: status, sent_at, provider_message_id
  - update: status, error_message

### email_campaigns

- src/app/api/admin/email/campaigns/[id]/audience-preview/route.js
  - select: 'name, audience, subject'
- src/app/api/admin/email/campaigns/route.js
  - select: ` *, email_campaign_recipients ( id, status, opened, clicked ) `
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

### email_events

- src/app/api/email/unsubscribe/route.js
  - insert: campaign_id, recipient_id, event_type, event_data, email, method, timestamp

### email_subscribers

- src/app/api/admin/email/subscribers/route.js
  - select: ` *, email_subscriber_entities ( entity_type, entity_name, relationship_type ) `
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

### email_templates

- src/app/api/admin/email/templates/route.js
  - select: '*'
  - insert: variables, created_by
  - update: (dynamic keys) (dynamic)
  - delete

### email_unsubscribe_tokens

- src/app/api/email/token/route.js
  - insert: email, expires_at, created_at
  - select: 'email, expires_at, used_at'
- src/app/api/email/unsubscribe/route.js
  - select: 'email, expires_at, used_at'
  - update: used_at
  - select: 'email, expires_at'

### latest_business_insights

- src/screens/Insights.jsx
  - select: '*'

### product_services

- src/screens/BusinessProfile.jsx
  - select: "*"

### profiles

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

### referrals

- src/app/api/admin/referral-draw/route.js
  - select: 'referrer_business_id, created_at'
- src/lib/email/getAudienceRecipients.js
  - select: 'referrer_business_id'

### users

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

## RPC Functions

- create_referral_if_present (from src/utils/referrals.js)
- get_referral_stats (from src/utils/referrals.js)
- select_monthly_referral_winner (from src/utils/referrals.js)

