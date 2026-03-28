# Pacific Discovery Network Email System

## Overview

PDN has a complete, production-ready email marketing system built with custom SMTP (Google Workspace). **No Brevo integration needed** - the existing system is more comprehensive.

## Current Status

### ✅ **What's Ready**
- Complete email marketing dashboard
- SMTP configuration with Google Workspace
- Background email processor with queue system
- Subscriber management and segmentation
- Campaign creation and tracking
- Business data fully populated (38 businesses, 100% email coverage)

### ❌ **What's Missing**
- Database tables (migration needed)
- Business-to-subscriber sync
- First campaign creation

## Quick Start Guide

### 1. Run Database Migration
```bash
# Manual step: Copy migration SQL to Supabase Dashboard
node scripts/run-migration.cjs
```

**Manual Steps:**
1. Go to Supabase Dashboard > Database > SQL Editor
2. Copy contents of: `supabase/migrations/20260327_create_email_marketing_tables.sql`
3. Run the SQL to create all email marketing tables
4. Verify tables were created successfully

### 2. Sync Business Subscribers
```bash
# Preview what will be imported
node scripts/sync-business-subscribers.cjs

# Actually import (after verification)
node scripts/sync-business-subscribers.cjs --import
```

### 3. Test System
```bash
# Test all components before sending
node scripts/test-campaign-audience.cjs
```

### 4. Create Founder Campaign
```bash
# Create the Pacific Market -> PDN transition campaign
node scripts/create-founder-campaign.cjs
```

### 5. Send Campaign (via Admin Dashboard)
1. Go to: https://pacificdiscoverynetwork.com/AdminDashboard
2. Navigate to Email Marketing tab
3. Review campaign in "Ready to Send"
4. Test send to yourself first
5. Queue for background sending

## Business Data Summary

### Current Business Coverage
- **Total Businesses:** 38
- **With Email:** 38 (100% coverage)
- **Active:** All businesses have `is_active = true` (default)
- **Email Field:** `business_email` (fully populated)

### Subscription Tiers
```
Vaka: 32 businesses (84%)
mana: 6 businesses (16%)
moana: 0 businesses (0%)
```

### Available Fields for Segmentation
✅ `business_name` - Present and populated
✅ `business_email` - Present and populated  
✅ `business_contact_person` - Present and populated
✅ `subscription_tier` - Present and populated
✅ `is_active` - Added via migration (default true)
✅ `is_verified` - Present and populated
✅ `business_handle` - Present and populated

## Campaign Segments Available

### Founder Campaign Target: `Vaka_plan`
- **Audience:** 32 businesses on Vaka plan
- **Message:** Pacific Market → Pacific Discovery Network evolution
- **Goal:** Inform about transition, upsell to Mana for branding changes

### Other Segments
- `mana_plan` - 6 businesses (premium features)
- `moana_plan` - 0 businesses (enterprise tier)
- `business_owners` - Businesses with claimed listings
- `all` - All 38 businesses

## Email Configuration

### SMTP Settings (Active)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=jasmin@pacificdiscoverynetwork.com
SMTP_PASS=[configured]
SMTP_FROM_NAME=Pacific Discovery Network
SMTP_FROM_EMAIL=hello@pacificdiscoverynetwork.com
```

### Unused Brevo Key
```env
BREVO_MCP_API_KEY=[exists but unused]
```

## Files Created/Modified

### New Files
1. `supabase/migrations/20260327_create_email_marketing_tables.sql` - Database schema
2. `scripts/audit-email-system.cjs` - System audit tool
3. `scripts/check-businesses.cjs` - Business data audit
4. `scripts/run-migration.cjs` - Migration helper
5. `scripts/sync-business-subscribers.cjs` - Subscriber sync tool
6. `scripts/create-founder-campaign.cjs` - Campaign creator
7. `scripts/test-campaign-audience.cjs` - Testing tool
8. `EMAIL_SYSTEM_README.md` - This documentation

### Existing Files (Already Complete)
- `src/components/admindashboard/EmailMarketingDashboard.jsx` - Full admin UI
- `src/constants/emailConstants.js` - System constants
- `src/types/email.ts` - TypeScript definitions
- `src/lib/email/getAudienceRecipients.js` - Audience building logic
- All API endpoints in `src/app/api/admin/email/`
- All API endpoints in `src/app/api/emails/`

## Safety Features

### Dry Run Mode
- All scripts run in dry-run mode by default
- Use `--import` flag to actually import data
- Test campaign creation before sending
- Preview audiences before campaigns

### No Destructive Changes
- Migration uses `IF NOT EXISTS` and `ADD COLUMN IF NOT EXISTS`
- Subscriber sync uses upsert with conflict resolution
- Campaign creation is reversible (draft status)

### Rate Limiting & Batching
- Background processor sends in small batches
- Built-in delays between emails
- Error handling and retry logic

## Next Steps After First Campaign

### Future Campaign Types
1. **Product Updates** - New features and platform improvements
2. **Onboarding Nudges** - Help businesses complete profiles
3. **Visibility Tips** - Guidance on getting discovered
4. **Feature Launches** - Announce new capabilities
5. **Founder Notes** - Personal updates from leadership
6. **Premium Upsells** - Mana/Moana plan benefits

### Advanced Features (Already Built)
- Open/click tracking
- Unsubscribe handling
- Template system with variables
- Analytics dashboard
- Queue management
- Error reporting

## Troubleshooting

### Common Issues
1. **"Email tables not found"** - Run migration first
2. **"No subscribers"** - Run sync script with `--import`
3. **"SMTP errors"** - Check email configuration in `.env.local`
4. **"Permission denied"** - Ensure admin role in auth.users

### Verification Commands
```bash
# Check if tables exist
node scripts/audit-email-system.cjs

# Test audience preview
node scripts/test-campaign-audience.cjs

# Verify subscriber sync
node scripts/sync-business-subscribers.cjs
```

## Support

For issues with the email system:
1. Check this README first
2. Run the test scripts to verify setup
3. Check Supabase dashboard for table creation
4. Review admin dashboard for campaign status

Email: hello@pacificdiscoverynetwork.com
