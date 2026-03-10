# 🎯 Phase 2 Implementation Plan - Pacific Market

## 📊 **Analysis Complete**

### **Remaining Files to Migrate:**

#### **High Priority (Direct Business Usage):**
1. `screens/BusinessPortal.jsx` - Complex business management with manual queries
2. `screens/QRCodeGenerator.jsx` - User business listing with `select('*')`
3. `screens/InvoiceGenerator.jsx` - Business tools with multiple `select('*')`
4. `screens/EmailSignatureGenerator.jsx` - Business selection with `select('*')`
5. `hooks/useOnboardingStatus.js` - Onboarding with `select('*')`
6. `components/home/StatsBar.jsx` - Homepage stats with `select('*')`

#### **Medium Priority (API Routes):**
7. `app/api/stripe/webhook/route.js` - 4 instances of `select('*')`
8. `app/api/signatures/generate/route.js` - Business data with `select('*')`
9. `app/api/notifications/*/route.js` - Multiple notification APIs

#### **Low Priority (Other Tables):**
10. `screens/ProfileSettings.jsx` - Profiles table `select('*')`
11. `components/onboarding/ProfileSetupModal.jsx` - Profiles table
12. `app/customer-portal/page.jsx` - Mixed table usage

---

## 🚀 **Suggested Migration Order**

### **Wave 1: Core User Tools (Immediate Impact)**
1. **QRCodeGenerator.jsx** - Simple user business listing
2. **InvoiceGenerator.jsx** - Critical business tool
3. **EmailSignatureGenerator.jsx** - Business communication tool

### **Wave 2: Business Management (Complex but Important)**
4. **BusinessPortal.jsx** - Main business management interface
5. **useOnboardingStatus.js** - User onboarding flow

### **Wave 3: Supporting Components**
6. **StatsBar.jsx** - Homepage statistics
7. **ProfileSettings.jsx** - Admin profiles

### **Wave 4: API Layer (Backend Consistency)**
8. **Stripe webhook** - Payment processing
9. **Notification APIs** - Email notifications
10. **Signature generation** - Tool functionality

---

## 📁 **New Files to Create**

### **1. Enhanced Query Layer**
```typescript
// src/lib/supabase/queries/fieldSets.ts
export const BUSINESS_PUBLIC_FIELDS = `...`;
export const BUSINESS_ADMIN_FIELDS = `...`;
export const BUSINESS_TOOL_FIELDS = `...`;
export const BUSINESS_MINIMAL_FIELDS = `id, name, logo_url, subscription_tier`;
```

### **2. Business Rules Engine**
```typescript
// src/lib/business/rules.ts
export function isPublicBusiness(business: Business): boolean
export function canAppearOnHomepage(business: Business): boolean
export function canUsePremiumTools(business: Business): boolean
export function getBusinessVisibilityTier(business: Business): string
export function hasBusinessAccess(business: Business, userId: string): boolean
```

### **3. Shared UI Components**
```typescript
// src/components/business/BusinessAvatar.tsx
// src/components/business/BusinessBadgeGroup.tsx
// src/components/business/BusinessContactLinks.tsx
// src/components/business/BusinessCard.tsx (enhanced)
```

### **4. Analytics Foundation**
```typescript
// src/lib/analytics/events.ts
export const ANALYTICS_EVENTS = {
  BUSINESS_PROFILE_VIEW: 'business_profile_view',
  BUSINESS_WEBSITE_CLICK: 'business_website_click',
  SEARCH_PERFORMED: 'search_performed',
  CLAIM_REQUEST_SUBMITTED: 'claim_request_submitted'
};

// src/lib/analytics/tracker.ts
export function trackEvent(eventName: string, properties: object): void
```

---

## 🔧 **Exact Low-Risk Code Changes**

### **1. QRCodeGenerator.jsx (Wave 1)**
```javascript
// Before
const { data: businesses } = await supabase
  .from('businesses')
  .select('*')
  .eq('owner_user_id', user.id);

// After
import { getUserBusinesses } from "@/lib/supabase/queries/businesses";
const { data: businesses } = await getUserBusinesses(user.id);
```

### **2. InvoiceGenerator.jsx (Wave 1)**
```javascript
// Before - Multiple select('*')
const { data: ownedBusinesses } = await supabase
  .from('businesses')
  .select('*')
  .eq('owner_user_id', user.id);

// After
import { getUserBusinesses, getBusinessById } from "@/lib/supabase/queries/businesses";
const { data: ownedBusinesses } = await getUserBusinesses(user.id);
const { data: business } = await getBusinessById(selectedBusinessId);
```

### **3. StatsBar.jsx (Wave 3)**
```javascript
// Before
const { data } = await supabase
  .from('businesses')
  .select('*')
  .eq('status', BUSINESS_STATUS.ACTIVE);

// After
import { getPublicBusinesses } from "@/lib/supabase/queries/businesses";
const { data } = await getPublicBusinesses({ limit: 1 });
```

### **4. BusinessPortal.jsx (Wave 2)**
```javascript
// Before - Complex manual query
const [businessesResult, claimsResult, profilesResult] = await Promise.all([
  supabase
    .from('businesses')
    .select(`id, name, business_handle, short_description, ...`)
    .eq('owner_user_id', u.id),
  // ... other queries
]);

// After
import { getUserBusinesses } from "@/lib/supabase/queries/businesses";
const { data: businessesResult } = await getUserBusinesses(u.id);
```

---

## ⚠️ **Risky Changes to Avoid in Phase 2**

### **High Risk - Postpone to Phase 3:**
1. **RLS Policy Changes** - Don't modify Row Level Security yet
2. **Business Images Joins** - Keep existing image loading logic
3. **Admin Workflow Overhauls** - Maintain existing admin processes
4. **Database Schema Changes** - No table modifications in Phase 2
5. **Complex Notification System Rewrites** - Keep existing email flow

### **Medium Risk - Handle Carefully:**
1. **Stripe Webhook Logic** - Test payment processing thoroughly
2. **BusinessPortal.jsx Updates** - Complex component, test thoroughly
3. **API Route Field Changes** - Ensure backward compatibility

### **Safe Changes - Proceed Confidently:**
1. **Simple Query Replacements** - QRCode, Invoice, Email Signature tools
2. **Helper Function Integration** - Tier, website, verified logic
3. **Component Standardization** - Avatar, badge, contact components
4. **Field Set Creation** - Explicit field definitions

---

## 📋 **Phase 2 Checklist**

### **Migration Tasks:**
- [ ] **Wave 1:** Migrate QRCodeGenerator, InvoiceGenerator, EmailSignatureGenerator
- [ ] **Wave 2:** Migrate BusinessPortal, useOnboardingStatus
- [ ] **Wave 3:** Migrate StatsBar, ProfileSettings
- [ ] **Wave 4:** Migrate API routes (Stripe, notifications, signatures)

### **Field Set Creation:**
- [ ] Create `fieldSets.ts` with BUSINESS_PUBLIC_FIELDS, BUSINESS_ADMIN_FIELDS, BUSINESS_TOOL_FIELDS
- [ ] Replace all `select('*')` with appropriate field sets
- [ ] Update query functions to use new field sets

### **Rules Engine:**
- [ ] Create `rules.ts` with visibility and access logic
- [ ] Implement `isPublicBusiness()`, `canAppearOnHomepage()`, `canUsePremiumTools()`
- [ ] Update components to use rules functions

### **Shared UI:**
- [ ] Create BusinessAvatar component
- [ ] Create BusinessBadgeGroup component  
- [ ] Create BusinessContactLinks component
- [ ] Enhance BusinessCard component

### **Analytics Foundation:**
- [ ] Define analytics event constants
- [ ] Create trackEvent helper function
- [ ] Add basic tracking to key user actions

---

## 🎯 **Success Metrics for Phase 2**

### **Technical Goals:**
- **Zero `select('*')`** for businesses table
- **All business queries** use shared query layer
- **Consistent field access** across all components
- **Centralized business rules** in one location

### **User Experience Goals:**
- **Faster page loads** from optimized queries
- **Consistent UI components** across business displays
- **Reliable business logic** for visibility and access
- **Better error handling** from standardized queries

### **Developer Experience Goals:**
- **Single source of truth** for business operations
- **Reusable components** for business display
- **Type-safe operations** throughout the app
- **Clear separation** between data logic and UI

---

## 🚀 **Ready to Begin Phase 2**

This plan provides a systematic, low-risk approach to migrating the rest of Pacific Market onto the shared business foundation created in Phase 1. Each wave builds upon the previous success while maintaining system stability.

**Start with Wave 1** for immediate impact and user-facing improvements, then progress through the waves to achieve complete consistency across the platform.
