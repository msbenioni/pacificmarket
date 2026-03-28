# Automated Referral Reward System Implementation

## Overview

This document describes the complete implementation of an automated referral reward system for Pacific Discovery Network. The system automatically applies rewards to referrers when referred businesses become active, eliminating the need for manual admin intervention.

## Business Rules

- **Reward**: +31 days Moana plan extension to BOTH referrer and referred business per successful referral
- **Eligibility**: Referred business must have `status = 'active'` and a valid referrer
- **Dual Rewards**: Both parties receive rewards in the same canonical workflow
- **Stacking**: Multiple successful referrals stack (2 referrals = +62 days for referrer, +31 days for each referred)
- **Idempotent**: Each referred business can only trigger one pair of rewards
- **Automatic**: Rewards applied via database triggers when status changes to 'active'

### Referral Reward Outcome:
- When a referred business becomes ACTIVE:
  - the referred business receives 31 days
  - the referrer business receives 31 days
- Both rewards must be applied automatically in the same canonical workflow.
- Each referred business can only trigger this pair of rewards once.

## Implementation Summary

### Database Schema Changes

#### New Table: `business_referral_rewards`
```sql
CREATE TABLE public.business_referral_rewards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    referrer_business_id UUID NOT NULL REFERENCES public.businesses(id),
    referred_business_id UUID NOT NULL REFERENCES public.businesses(id),
    reward_type TEXT NOT NULL DEFAULT 'moana_extension',
    reward_days INTEGER NOT NULL DEFAULT 31,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'applied', 'skipped', 'failed')),
    eligibility_reason TEXT,
    applied_at TIMESTAMPTZ NULL,
    applied_by TEXT NOT NULL DEFAULT 'system',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    UNIQUE (referred_business_id)
);
```

#### Existing Fields (Already Present)
- `referred_by_business_id` - Tracks referrer relationship
- `referral_reward_applied` - Legacy flag (kept for compatibility)
- `tier_expires_at` - Moana plan expiry date
- `referral_count` - Count of successful referrals

### Core SQL Functions

#### `apply_referral_reward_for_business(p_referred_business_id UUID)`
**Purpose**: Main reward application function
**Behavior**:
- Checks eligibility using `is_business_referral_reward_eligible()`
- Calculates new expiry dates for both businesses (additive logic)
- Updates referrer's `tier_expires_at` and `referral_count`
- Updates referred business's `tier_expires_at` and `referral_reward_applied`
- Creates/updates reward record in `business_referral_rewards`
- Returns structured JSON result with both expiry dates

### Reward Application Logic
The canonical reward function must apply BOTH sides of the reward:
1. extend the referred business by 31 days
2. extend the referrer business by 31 days

Use the same end-date logic for both:
- if current Moana end date is in the future: add 31 days to current end date
- if current Moana end date is null or expired: set to now() + 31 days

#### `is_business_referral_reward_eligible(p_business_id UUID)`
**Purpose**: Check if business qualifies for reward
**Returns**: Boolean
**Criteria**:
- Business exists
- Has valid referrer
- Status is 'active'
- No reward already applied
- Referrer is also active

#### `create_pending_referral_reward(p_referred_business_id UUID)`
**Purpose**: Create pending reward record when business with referral is created
**Called by**: INSERT trigger

#### `get_business_referral_summary(p_business_id UUID)`
**Purpose**: Return comprehensive referral history
**Returns**: JSON with rewards given/received

### Database Triggers

#### `on_business_insert_create_pending_referral_reward`
**Event**: AFTER INSERT on businesses
**Action**: Creates pending reward record if `referred_by_business_id` is set

#### `on_business_update_apply_referral_reward`
**Event**: AFTER UPDATE on businesses  
**Action**: Applies reward when status changes to 'active'

#### `on_business_update_referral_eligibility`
**Event**: AFTER UPDATE on businesses
**Action**: Updates eligibility when referral relationships change

### Frontend Changes

#### Admin Dashboard Updates
- **Removed**: Manual "Apply Referral Reward" button
- **Added**: Automatic status indicators:
  - 🟢 "Reward applied automatically" (when applied)
  - 🟡 "Processing reward..." (when active but not yet applied)
  - ⚪ "Reward pending activation" (when not active)
- **Enhanced**: Referral information display with status context

#### Business Creation Flow
- **ClaimAddBusinessModal**: No changes needed (already correctly persists `referred_by_business_id`)
- **BusinessProfileForm**: Referral dropdown only shows in create mode
- **Triggers**: Handle reward application automatically

#### New API Queries
- `getBusinessReferralRewards()` - Get reward history
- `getBusinessReferralSummary()` - Get comprehensive summary
- `processPendingReferralRewards()` - Manual processing (admin)
- `applyReferralReward()` - Manual retry (admin)

## Deployment Instructions

### 1. Database Migrations

Run migrations in order:

```bash
# 1. Create referral rewards table and helper functions
supabase db push 20260328_create_referral_rewards_system.sql

# 2. Create reward application functions
supabase db push 20260328_create_referral_reward_application.sql

# 3. Add triggers for automation
supabase db push 20260328_add_referral_triggers.sql

# 4. Create backfill script (optional, run after deployment)
supabase db push 20260328_backfill_referral_rewards.sql
```

### 2. Frontend Deployment

Deploy updated frontend files:
- `src/lib/supabase/queries/referralRewards.ts`
- `src/components/admin/AdminBusinessMobileCard.jsx`
- `src/screens/AdminDashboard.jsx`
- `src/tests/referral/referralSystem.test.js`

### 3. Backfill Historic Data

After deployment, run backfill to process existing referrals:

```sql
-- Check eligibility first
SELECT public.get_referral_backfill_report();

-- Run backfill (safe to run multiple times)
SELECT public.backfill_historic_referral_rewards();
```

### 4. Verify System

Test the following scenarios:

#### Single Referral Test
1. Create Business A (referrer)
2. Create Business B with referral to A
3. Approve Business B (set status to 'active')
4. Verify: Business A gets +31 days, reward record created

#### Multiple Referral Test
1. Business A refers Business B and C
2. Both B and C become active
3. Verify: Business A gets +62 days total

#### Duplicate Protection Test
1. Business A refers Business B
2. B becomes active (reward applied)
3. Try to apply reward again for B
4. Verify: No duplicate reward, returns 'already_applied'

## Monitoring & Maintenance

### Key Metrics to Monitor
- Number of pending rewards
- Reward application success rate
- Time from activation to reward application
- Referral conversion rate

### Common Issues & Solutions

#### Reward Not Applied
**Check**: 
- Business status is 'active'
- Referrer exists and is 'active'
- No existing applied reward

**Query**:
```sql
SELECT public.get_business_referral_reward_eligibility_reason('business-id');
```

#### Stale Pending Rewards
**Solution**: Run manual processing
```sql
SELECT public.process_pending_referral_rewards();
```

#### Performance Issues
**Monitor**: Trigger execution time on high-volume status updates
**Solution**: Consider batch processing for bulk activations

## Security Considerations

### Database Security
- All reward functions use `SECURITY DEFINER`
- Only service role can execute reward functions
- RLS policies restrict access to reward data
- Admin-only access to backfill functions

### Data Integrity
- Unique constraint prevents duplicate rewards
- Transaction safety ensures atomic updates
- Idempotent design prevents double-application

## API Endpoints

### New Queries (for admin tools)
- `GET /api/admin/referrals/pending` - List pending rewards
- `POST /api/admin/referrals/process` - Process pending rewards
- `POST /api/admin/referrals/backfill` - Run backfill

### Existing Endpoints (unchanged)
- Business creation endpoints automatically trigger rewards
- Status update endpoints automatically trigger rewards

## Testing

### Unit Tests
- Test all SQL functions with various scenarios
- Test frontend components with mock data
- Test API endpoints with mocked database

### Integration Tests
- End-to-end referral flow
- Bulk status updates
- Concurrent reward applications
- Backfill script execution

### Test Data Setup
```sql
-- Create test businesses
INSERT INTO businesses (id, business_name, referred_by_business_id, status) VALUES
('test-referrer', 'Test Referrer', NULL, 'active'),
('test-referred', 'Test Referred', 'test-referrer', 'pending');

-- Test activation
UPDATE businesses SET status = 'active' WHERE id = 'test-referred';

-- Verify reward
SELECT * FROM business_referral_rewards WHERE referred_business_id = 'test-referred';
```

## Rollback Plan

If issues arise, rollback steps:

### 1. Disable Triggers
```sql
DROP TRIGGER IF EXISTS on_business_update_apply_referral_reward ON businesses;
DROP TRIGGER IF EXISTS on_business_insert_create_pending_referral_reward ON businesses;
```

### 2. Restore Manual System
- Keep old `apply_referral_moana_reward` function
- Restore manual admin button in UI
- Use existing manual workflow

### 3. Data Migration
- New `business_referral_rewards` table can be kept for audit
- Existing `referral_reward_applied` flags continue working

## Future Enhancements

### Potential Improvements
1. **Reward Tiers**: Different reward amounts for different referrer tiers
2. **Time Limits**: Rewards must be claimed within X days
3. **Referral Limits**: Maximum rewards per referrer per time period
4. **Analytics Dashboard**: Detailed referral analytics
5. **Notification System**: Email alerts for successful referrals

### Scalability Considerations
- Batch processing for high-volume activations
- Queue system for reward processing
- Caching for referral statistics

## Support

For issues with the referral system:
1. Check application logs for trigger errors
2. Verify business status and referral relationships
3. Run eligibility check functions for debugging
4. Use backfill script to repair missed rewards

---

**Implementation Date**: 2026-03-28  
**Version**: 1.0  
**Author**: Cascade AI Assistant
