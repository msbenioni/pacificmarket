# Premium Onboarding Navigator System

A guided onboarding system that provides users with clear, step-by-step progression through profile completion and business setup.

## 🎯 Overview

The onboarding navigator ensures users always know what to do next, with:
- **Single source of truth** for onboarding status
- **Premium UI** with progress indicators and clear CTAs
- **Smart routing** based on user's current state
- **Profile-first approach** for trust and verification

## 📁 Components

### Core Components

#### `useOnboardingStatus` Hook
**Location**: `src/hooks/useOnboardingStatus.js`

Computes onboarding status and next actions:
```js
const { onboardingStatus, loading } = useOnboardingStatus();

// onboardingStatus contains:
{
  needsProfile: boolean,
  hasOwnedBusinesses: boolean,
  hasClaims: boolean,
  hasAnyBusiness: boolean,
  incompleteBusinessProfiles: Business[],
  totalSteps: 3,
  completedSteps: number,
  currentStep: number,
  nextAction: 'complete-profile' | 'claim-or-add' | 'complete-business-profiles' | 'dashboard-ready',
  isComplete: boolean
}
```

#### `SetupProgressCard`
**Location**: `src/components/onboarding/SetupProgressCard.jsx`

Premium progress card showing:
- 3-step progress indicator
- Current step status (completed/current/locked)
- Single "Continue setup" CTA
- Optional "Do this later" for non-critical steps
- Trust messaging

#### `ProfileSetupModal`
**Location**: `src/components/onboarding/ProfileSetupModal.jsx`

Guided profile completion:
- Multi-step modal with progress bar
- Uses existing profile onboarding constants
- Real-time validation
- Auto-advance to next step after completion
- Success celebration state

#### `ClaimAddBusinessModal`
**Location**: `src/components/onboarding/ClaimAddBusinessModal.jsx`

Premium choice interface:
- Visual comparison of claim vs add options
- Clear recommendations based on user state
- Cultural design with premium styling

#### `ProfileIncompleteWarning`
**Location**: `src/components/onboarding/ClaimAddBusinessModal.jsx`

Warning banner when profile is incomplete:
- Amber styling for attention
- Clear explanation of why profile is needed
- Trust-focused messaging

### Utility Components

#### `OnboardingRedirect`
**Location**: `src/components/onboarding/OnboardingRedirect.jsx`

Handles automatic redirects:
- Root page → `/businessportal` if onboarding incomplete
- Login/signup pages → `/businessportal` if logged in
- Email confirmation handling

## 🔄 Onboarding Flow

### Step 1: Complete Profile (Required)
**Fields**: `city`, `country`, `primary_cultural`
**Optional**: `cultural_tags`, `languages`, `years_operating`, `business_role`, `market_region`

**Trigger**: User lands on `/businessportal` with incomplete profile
**Action**: Show `ProfileSetupModal` with guided steps
**Next**: Auto-open claim/add modal if no businesses

### Step 2: Claim or Add Business (Required)
**Trigger**: Profile complete but no businesses
**Action**: Show `ClaimAddBusinessModal` with choice interface
**Options**:
- Claim existing (if business already listed)
- Add new (first-time listings)

### Step 3: Complete Business Details (Optional)
**Trigger**: Business exists but missing key details
**Action**: Show setup progress with "Complete business details" option
**Fields**: `description`, `industry`, `year_founded`, `contact_website`

## 🎨 UI/UX Features

### Premium Design Elements
- **Gradient backgrounds** for visual hierarchy
- **Progress indicators** with clear status
- **Single primary CTA** to reduce decision fatigue
- **Secondary skip options** where appropriate
- **Success celebrations** for completed steps

### Cultural Considerations
- **Trust-focused messaging** about verification
- **Community-oriented language** ("represent Pacific enterprise")
- **Respectful data collection** with clear privacy explanations

### Responsive Design
- **Mobile-first** approach
- **Touch-friendly** buttons and interactions
- **Accessible** with proper ARIA labels
- **Keyboard navigation** support

## 🔧 Implementation Guide

### 1. Add to BusinessPortal

```jsx
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus';
import { SetupProgressCard, ProfileIncompleteWarning } from '@/components/onboarding/SetupProgressCard';
import { ClaimAddBusinessModal } from '@/components/onboarding/ClaimAddBusinessModal';
import { ProfileSetupModal } from '@/components/onboarding/ProfileSetupModal';

// In component:
const { onboardingStatus } = useOnboardingStatus();
const [showProfileModal, setShowProfileModal] = useState(false);
const [showClaimAddModal, setShowClaimAddModal] = useState(false);

// In render:
{onboardingStatus.needsProfile && <ProfileIncompleteWarning />}
{!onboardingStatus.isComplete && <SetupProgressCard />}

// Update empty state to be onboarding-aware
{onboardingStatus.needsProfile ? (
  <button onClick={() => setShowProfileModal(true)}>
    Complete Profile
  </button>
) : (
  <button onClick={() => setShowClaimAddModal(true)}>
    Claim/Add Business
  </button>
)}
```

### 2. Add to Root Page

```jsx
import { OnboardingRedirect } from '@/components/onboarding/OnboardingRedirect';

export default function HomePage() {
  return (
    <OnboardingRedirect>
      {/* Your existing home page content */}
    </OnboardingRedirect>
  );
}
```

### 3. Configure Supabase Redirect

Set email confirmation redirect URL:
```
https://www.pacificmarket.co.nz/businessportal
```

## 📊 Data Model

### Required Profile Fields
```sql
profiles.city -- required
profiles.country -- required  
profiles.primary_cultural -- required
```

### Business Ownership Check
```sql
-- Check for owned businesses
SELECT COUNT(*) FROM businesses WHERE owner_user_id = :user_id

-- Check for claim requests  
SELECT COUNT(*) FROM claim_requests WHERE user_id = :user_id
```

### Business Profile Completeness
```sql
-- Check incomplete business profiles
SELECT * FROM businesses 
WHERE owner_user_id = :user_id
AND (
  description IS NULL OR
  industry IS NULL OR  
  year_founded IS NULL OR
  contact_website IS NULL
)
```

## 🧪 Testing Scenarios

### New User Flow
1. User confirms email → lands on `/businessportal`
2. Sees "Complete your profile" warning
3. Sees setup progress card (Step 1 current)
4. Clicks "Continue setup" → ProfileSetupModal
5. Completes profile → auto-opens claim/add modal
6. Chooses claim or add → completes onboarding

### Existing User Flow
1. User logs in → lands on `/businessportal`
2. If profile complete but no businesses → shows claim/add modal
3. If has businesses → shows normal dashboard
4. If incomplete business profiles → shows setup progress with Step 3

### Edge Cases
- **Profile incomplete + existing businesses**: Still require profile completion
- **Multiple businesses**: Show completion status for all
- **Pending claims**: Count as "has business" for onboarding
- **Admin users**: Same onboarding flow applies

## 🔄 Migration Notes

### Breaking Changes
- None - fully backward compatible
- Existing users see normal dashboard if already complete

### Database Changes
- No new tables required
- Uses existing `profiles` and `businesses` tables
- Leverages existing `claim_requests` table

### Performance Considerations
- Single API call to fetch all onboarding data
- Efficient queries with proper indexes
- Caching of onboarding status in hook

## 🎯 Success Metrics

### User Experience
- **Reduced confusion** with single next action
- **Higher completion rates** with guided flow
- **Better trust** with profile-first approach

### Business Metrics
- **More complete profiles** for better verification
- **Higher claim rates** with clear guidance
- **Reduced support tickets** for setup questions

## 🚀 Future Enhancements

### Potential Additions
- **Progress persistence** across sessions
- **Skip with reason** collection
- **A/B testing** of different flows
- **Mobile app** integration
- **Admin dashboard** for onboarding analytics

### Personalization
- **Industry-specific** onboarding paths
- **Cultural identity** tailored messaging
- **Geographic** relevant suggestions
- **Business size** appropriate guidance

---

**Version**: 1.0  
**Created**: 2025-03-05  
**Compatible**: Pacific Market Platform  
**Dependencies**: React, Next.js, Supabase
