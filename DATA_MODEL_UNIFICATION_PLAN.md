# Pacific Market Data Model Unification Plan

## Overview

This document is the **single source of truth** for Pacific Market’s data model. It defines:
- Which tables own which facts
- Which columns should be moved or removed
- Which views provide convenience reads
- The order to safely refactor without breaking the app

**Rule:** Each fact has exactly one owner. Everything else reads via joins or views.

---

## Current State (from prod dump + code map)

### Existing tables in prod
- `profiles` (person/account owner; contains many survey fields)
- `businesses` (current business profile; contains billing/insight drift)
- `business_insights_snapshots` (founder journey history; FK to businesses)
- `subscriptions` (billing truth; exists but unused in code)
- `claim_requests` (ownership claim workflow)
- `business_images`, `product_services`, `business_invoice_settings`, `business_signature_settings` (tool tables)
- Email campaign tables, referrals, admin_notification_settings, audit_logs

### Key drifts detected
- `businesses` has both `user_id` and `owner_user_id`
- Code writes to `businesses.subscription_status`, `subscription_period_end`, `listing_tier` — these columns **do not exist**
- Billing state is handled in `businesses` instead of `subscriptions`
- Many “insight-like” fields live in `businesses` (revenue, team size, growth stage, etc.)
- `profiles` contains survey fields that should live in insights snapshots
- `business_insights_snapshots_backup` is unused in code
- Widespread `select('*')` in code makes column removal risky without explicit selects

---

## Recommended Ownership Model

### 1) `profiles` — Person / Account Owner

**Purpose:** Auth, personal details, permissions, consent, onboarding state.

| Column | Keep? | Notes |
|--------|-------|-------|
| id | Yes | Primary user/account identity |
| email | Yes | Account/login email |
| display_name | Yes | Person name shown in portal/admin |
| role | Yes | App permission role |
| country | Yes | Person’s location |
| city | Yes | Person’s location |
| primary_cultural | Yes | Person/founder cultural identity |
| languages | Yes | Person languages |
| gdpr_consent / gdpr_consent_date | Yes | User consent belongs to person |
| status | Yes | Account status |
| invited_by / invited_date | Yes | Account workflow |
| pending_business_id / pending_business_name | Maybe | Fine for onboarding workflow, not core identity |
| **Move to insights** | | business_goals, challenges_faced, success_factors, community_involvement, skills_expertise, etc. |

**Keep `profiles` lean.** Anything survey-like should move to `business_insights_snapshots`.

---

### 2) `businesses` — Current Business Master Record

**Purpose:** Canonical public business profile.

| Column | Keep? | Notes |
|--------|-------|-------|
| id | Yes | Primary business identity |
| owner_user_id | Yes | Choose one; deprecate `user_id` |
| name | Yes | Canonical business name |
| business_handle | Yes | Public slug/handle |
| short_description | Yes | Choose one; deprecate `tagline` |
| description | Yes | Public long description |
| logo_url | Yes | Current logo |
| banner_url | Yes | Current banner |
| contact_email | Yes | Public business contact |
| contact_phone | Yes | Public business contact |
| contact_website | Yes | Public website |
| address / suburb / city / state_region / postal_code / country | Yes | Business location |
| industry | Yes | Core public classification |
| social_links | Yes | Business public social links |
| business_hours | Yes | Public business info |
| business_structure | Yes | Current business master detail |
| year_started | Yes | Stable core business fact |
| status | Yes | Listing approval/publish state |
| verified | Yes | Registry state |
| claimed / claimed_at / claimed_by | Yes | Claim workflow linked to business |
| visibility_tier | Yes | Registry visibility setting |
| homepage_featured | Yes | Site merchandising state |
| source | Yes | Where listing came from |
| profile_completeness | Maybe | OK as derived/cache field |
| referral_code | Yes | Business referral logic |
| **Move to insights** | | annual_revenue_exact, full_time_employees, part_time_employees, primary_market, growth_stage, funding_source, business_challenges, future_plans, tech_stack, customer_segments, competitive_advantage |
| **Move to subscriptions** | | subscription_tier, stripe_customer_id, subscription_status, subscription_period_end, listing_tier |

---

### 3) `business_insights_snapshots` — Founder Journey + Business Insight History

**Purpose:** Historical/evolving questionnaire data; what was true when the founder answered.

| Type | Keep? | Notes |
|------|-------|-------|
| Founder story | Yes | Narrative changes over time |
| Founder role | Yes | Insight/survey context |
| Motivation | Yes | Insight data |
| Top challenges | Yes | Time-based |
| Goals next 12 months | Yes | Time-based |
| Support needed | Yes | Time-based |
| Funding needs | Yes | Time-based |
| Team size band | Yes | Time-based |
| Business stage | Yes | Time-based |
| Community impact areas | Yes | Insight data |
| Culture influence details | Yes | Survey detail |
| Mentorship access/offering | Yes | Founder ecosystem insight |
| Revenue band | Yes | Historical/analytical |
| Hiring intentions | Yes | Time-based |
| Expansion plans | Yes | Time-based |
| Open to future contact | Yes | Fine if tied to insight form |
| Duplicates from businesses | Yes | OK here as historical snapshot (e.g., based_in_country, based_in_city, primary_industry) |

---

### 4) `subscriptions` — Billing Truth

**Purpose:** Only source of truth for billing state.

| Column | Keep? | Notes |
|--------|-------|-------|
| id | Yes | Subscription identity |
| user_id | Yes | Owner relationship |
| business_id | Yes | Business relationship |
| stripe_subscription_id | Yes | Billing system reference |
| stripe_customer_id | Yes | Billing system reference |
| plan_type | Yes | Billing plan |
| status | Yes | Billing truth |
| current_period_start / current_period_end | Yes | Billing truth |
| cancel_at_period_end | Yes | Billing truth |
| created_at / updated_at | Yes | Audit trail |

**Do not also maintain these meanings in `businesses` unless intentionally denormalized.**

---

### 5) `claim_requests` — Ownership Claim Workflow

**Purpose:** Ownership claim workflow; references `businesses` and `profiles`.

| Column | Keep? | Notes |
|--------|-------|-------|
| business_id | Yes | FK to businesses |
| user_id | Yes | FK to profiles |
| status | Yes | Workflow state |
| contact_email / contact_phone | Yes | Claim contact info |
| verification_documents | Yes | Claim evidence |
| rejection_reason | Yes | Admin notes |
| reviewed_by / reviewed_at | Yes | Admin audit |
| business_name | Yes | Snapshot of submitted name |
| user_email | Yes | Snapshot of submitted email |
| role | Yes | Claim role (owner/rep) |
| proof_url | Yes | Evidence link |

---

### 6) Support Tables (tool-specific)

| Table | Purpose | Notes |
|-------|---------|-------|
| `business_images` | Gallery | FK to businesses |
| `product_services` | Offerings | FK to businesses |
| `business_invoice_settings` | Invoice tool config | FK to businesses |
| `business_signature_settings` | Signature tool config | FK to businesses |
| `admin_notification_settings` | Admin preferences | FK to profiles |
| `referrals` | Referral tracking | FK to businesses |
| Email campaign tables | Marketing | FK to profiles/businesses |
| `audit_logs` | Audit trail | System-wide |

---

## Recommended Views (Read-Only Convenience Layer)

### `v_owner_business_summary`
Joins: `profiles` + `businesses`  
Use for: portal dashboard, header cards, admin owner/business list, email personalization.

### `v_latest_business_insights`
Joins: latest row from `business_insights_snapshots` per business  
Use for: insights page, business summary cards, founder/admin reporting.

### `v_business_subscription_status`
Joins: `businesses` + active/current `subscriptions`  
Use for: pricing/billing UI, admin subscription overview, access checks.

### `v_business_admin_full`
Joins: `businesses` + `profiles` + latest insights + current subscription + latest claim/request status if needed  
Use for: admin dashboard only.

---

## What Should Not Be Duplicated

**Rule:** Each fact has one owner.

| Fact | Source of truth |
|------|-----------------|
| Person login email | `profiles.email` |
| Public business email | `businesses.contact_email` |
| Founder cultural identity | `profiles.primary_cultural` |
| Business cultural representation | `businesses.cultural_identity` |
| Current business description | `businesses.description` |
| Founder’s story over time | `business_insights_snapshots.founder_story` |
| Active paid plan | `subscriptions.plan_type` + `subscriptions.status` |

---

## Where Schema Currently Needs Cleanup

### 1) Pick one owner key in `businesses`
You have both `user_id` and `owner_user_id`. Choose one (`owner_user_id` is clearer) and deprecate/remove the other.

### 2) Remove schema drift
Code references fields that do not exist: `subscription_status`, `subscription_period_end`, `listing_tier`. This means old code, renamed columns, or incomplete migrations.

### 3) Reduce `select('*')`
`select('*')` makes it hard to manage the schema cleanly. Replace with explicit selects on:
- Customer portal
- Admin dashboard
- Business portal
- Insights page

### 4) Keep workflow tables separate from master data
`claim_requests`, `referrals`, email campaign tables, settings tables, logs should reference `profiles` or `businesses`, but not duplicate those master fields unless needed as a snapshot.

---

## Recommended Final Simplified Model

### Core write tables
| Table | Purpose |
|-------|---------|
| `profiles` | Person/account owner |
| `businesses` | Current business profile |
| `business_insights_snapshots` | Founder/business history |
| `subscriptions` | Billing truth |
| `claim_requests` | Ownership claim workflow |

### Support tables
| Table | Purpose |
|-------|---------|
| `business_images` | Gallery |
| `product_services` | Business offerings |
| `business_invoice_settings` | Invoice tool config |
| `business_signature_settings` | Signature tool config |
| `admin_notification_settings` | Admin preferences |
| `referrals` | Referral tracking |

### Read-only convenience layer
| View | Purpose |
|------|--------|
| `v_owner_business_summary` | Owner + business current profile |
| `v_latest_business_insights` | Latest insight snapshot |
| `v_business_subscription_status` | Current subscription state |
| `v_business_admin_full` | Admin dashboard read model |

---

## Recommended Cleanup Decisions Table

### Keep as-is
- `profiles`
- `businesses`
- `business_insights_snapshots`
- `subscriptions`
- `claim_requests`
- `business_images`
- `product_services`

### Refactor
- `businesses.user_id` vs `owner_user_id`
- Billing fields spread into `businesses`
- Profile/survey fields living in `profiles`
- Strategy fields living in `businesses`

### Make views for
- Latest business insights
- Owner + business joined record
- Current subscription state
- Admin summary

### Archive/remove later
- `business_insights_snapshots_backup`
- Any dead legacy columns
- Any code paths using non-existent fields

---

## Best-Practice Structure in Plain English

### Person
“Who is this founder?” → `profiles`

### Business
“What is their business right now?” → `businesses`

### Journey
“What has this founder said about their journey, challenges, goals, and growth over time?” → `business_insights_snapshots`

### Billing
“What are they paying for right now?” → `subscriptions`

### App convenience
“What combined record should the portal/admin read?” → Views

---

## Suggested Next Steps in Order

### Step 1
Create a spreadsheet with all columns from:
- `profiles`
- `businesses`
- `business_insights_snapshots`
- `subscriptions`

Add columns:
- Source of truth
- Keep / move / remove
- Notes

### Step 2
Decide the official ownership of every duplicated concept.

### Step 3
Create the views before removing columns, so the UI stays stable.

### Step 4
Update code to stop using old column names and `select('*')`.

### Step 5
Then run migrations to clean out duplication safely.

---

## My Strongest Recommendation

For Pacific Market, optimize around this rule:

**The business owner enters data once, and the rest of the site reads it through joins or views — not duplicate columns.**

This gives you:
- Cleaner admin logic
- Easier email personalization
- Less insert/update confusion
- Better long-term scaling for Pacific Market and your charity/community reporting later

---

## Technical Implementation Plan

### Phase A: Align code to prod schema
- Fix code that writes non-existent columns (`subscription_status`, `subscription_period_end`, `listing_tier`)
- Replace `select('*')` with explicit selects on core screens
- Choose one owner key (`owner_user_id`) and deprecate the other

### Phase B: Create views
- Draft SQL for `v_owner_business_summary`, `v_latest_business_insights`, `v_business_subscription_status`, `v_business_admin_full`
- Update code to read from views where appropriate

### Phase C: Move billing logic to `subscriptions`
- Update Stripe webhook and billing UI to write to `subscriptions`
- Remove billing columns from `businesses` after verification

### Phase D: Move insight fields
- Move survey fields from `profiles` to `business_insights_snapshots`
- Move strategy fields from `businesses` to `business_insights_snapshots`
- Update forms to write to the correct tables

### Phase E: Clean up
- Archive `business_insights_snapshots_backup`
- Remove deprecated columns from `businesses` and `profiles`
- Add RLS policies if needed

---

## Migration Safety Checklist

- [ ] Create views before dropping columns
- [ ] Replace `select('*')` with explicit selects
- [ ] Test billing flow with `subscriptions` table
- [ ] Verify admin dashboard reads from views
- [ ] Run a dry-run migration on staging
- [ ] Backup production before schema changes
- [ ] Monitor for errors after deployment

---

## Success Metrics

- No code writes to non-existent columns
- Billing state lives only in `subscriptions`
- Insight data lives only in `business_insights_snapshots`
- Admin UI uses views for combined data
- No `select('*')` in core screens
- All duplicated concepts have one owner

---

## Notes

- This plan assumes the current prod schema as the source of truth
- Views are read-only and can be created/updated without downtime
- Column removal should happen after code is aligned
- Keep backup tables/archives until verification is complete
