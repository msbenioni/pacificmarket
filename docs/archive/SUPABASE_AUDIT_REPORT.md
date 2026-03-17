# Pacific Market Supabase Consistency Audit Report

## 1. Executive Summary

**Critical Issues Found:**
- Column name mismatches between database schema and frontend code
- Extensive use of `select('*')` queries (20+ instances)
- Duplicate business logic scattered across 15+ files
- No centralized query layer
- Missing analytics tracking implementation
- RLS assumptions not documented

**Severity Distribution:**
- **Critical**: 8 issues (column mismatches, performance)
- **Medium**: 12 issues (duplicate logic, architecture)
- **Low**: 6 issues (consistency, documentation)

**Impact:** High maintenance overhead, potential runtime errors, performance issues.

---

## 2. Tables Used in Code

### Primary Tables:
1. **businesses** - Core business registry data
2. **business_insights_snapshots** - Founder insights (single source of truth)
3. **claim_requests** - Business ownership claims
4. **profiles** - User profiles and roles
5. **business_invoice_settings** - Invoice configuration
6. **business_images** - Business image galleries
7. **admin_notification_settings** - Admin preferences

### Secondary Tables:
8. **email_campaigns** - Email marketing
9. **email_campaign_queue** - Email queue
10. **email_templates** - Email templates
11. **referrals** - Referral tracking
12. **users** - Legacy user table (limited usage)

---

## 3. Table-by-Table Usage Map

### **businesses** (36 records)
**Files using this table:**
- `screens/AdminDashboard.jsx` - SELECT, UPDATE, DELETE
- `screens/Registry.jsx` - SELECT
- `screens/Home.jsx` - SELECT  
- `screens/BusinessPortal.jsx` - SELECT
- `screens/BusinessProfile.jsx` - SELECT
- `screens/QRCodeGenerator.jsx` - SELECT
- `screens/InvoiceGenerator.jsx` - SELECT, UPDATE
- `screens/EmailSignatureGenerator.jsx` - SELECT
- `hooks/useOnboardingStatus.js` - SELECT
- `components/home/StatsBar.jsx` - SELECT
- Multiple API routes - SELECT, UPDATE

**Columns referenced:**
```sql
id, name, description, tagline, logo_url, banner_url,
contact_email, contact_phone, contact_website, address, suburb, city,
state_region, postal_code, country, industry, social_links,
business_hours, business_structure, year_started, status, verified,
claimed, claimed_at, claimed_by, visibility_tier, homepage_featured,
subscription_tier, owner_user_id, created_at, updated_at
```

**Operations:** SELECT (15), UPDATE (4), DELETE (1)

---

### **business_insights_snapshots** (30+ records)
**Files using this table:**
- `screens/AdminDashboard.jsx` - SELECT
- `screens/Insights.jsx` - SELECT
- `screens/BusinessPortal.jsx` - INSERT, UPDATE

**Columns referenced:**
```sql
id, business_id, user_id, snapshot_year, submitted_date, year_started,
problem_solved, team_size_band, business_model, family_involvement,
customer_region, sales_channels, import_export_status, founder_role,
founder_story, founder_motivation_array, business_stage, top_challenges
```

**Operations:** SELECT (2), INSERT (1), UPDATE (1)

---

### **claim_requests** (3 records)
**Files using this table:**
- `screens/AdminDashboard.jsx` - SELECT, UPDATE
- `pages/claims/MyClaimsPage.jsx` - SELECT
- `utils/claimRequests.js` - DELETE
- `utils/userClaimActions.js` - SELECT, DELETE
- `components/admin/ClaimDeleteButton.jsx` - DELETE

**Columns referenced:**
```sql
id, business_id, user_id, status, contact_email, contact_phone,
contact_name, message, created_at, updated_at
```

**Operations:** SELECT (3), UPDATE (1), DELETE (3)

---

### **profiles** (Admin role management)
**Files using this table:**
- `screens/AdminDashboard.jsx` - SELECT
- `screens/ProfileSettings.jsx` - SELECT, UPDATE, INSERT
- `hooks/useOnboardingStatus.js` - SELECT
- `components/onboarding/ProfileSetupModal.jsx` - SELECT

**Columns referenced:**
```sql
id, email, full_name, role, display_name, created_at, updated_at
```

**Operations:** SELECT (4), UPDATE (1), INSERT (1)

---

## 4. Column/Field Mismatches

### **Critical Mismatches:**

1. **website vs contact_website**
   - **Database:** `contact_website`
   - **Code:** Some places use `website` (BusinessProfile.jsx)
   - **Impact:** Runtime errors, missing data

2. **subscription_tier vs tier**
   - **Database:** `subscription_tier`
   - **Code:** Mixed usage of `tier` and `subscription_tier`
   - **Files affected:** BusinessProfile.jsx, BusinessPortal.jsx

3. **visibility_tier logic inconsistency**
   - **Database:** `visibility_tier` (text: 'homepage', 'registry', 'none')
   - **Code:** Some places check `visibility_tier === 'homepage'` (Home.jsx)
   - **Code:** Other places use `subscription_tier` for visibility logic

4. **updated_at vs updated_at**
   - **Database:** `updated_at`
   - **Code:** Some places reference `updated_at`
   - **Impact:** Update failures

### **Medium Mismatches:**

5. **Missing business_images table joins**
   - **Code assumes:** `business_images` available for premium tiers
   - **Reality:** Table exists but not consistently joined

6. **Inconsistent timestamp usage**
   - **Database:** `created_at`, `updated_at`
   - **Code:** Mixed use of `created_date`, `updated_at`

---

## 5. Duplicate Query Logic

### **Critical Duplications:**

1. **Business Listing Query** (5 copies)
   - `screens/Registry.jsx` - Active businesses with full details
   - `screens/Home.jsx` - Homepage featured businesses  
   - `screens/Insights.jsx` - Analytics businesses
   - `hooks/useOnboardingStatus.js` - User businesses
   - **Should be:** `queries/getBusinesses.js`

2. **Admin Role Check** (3 copies)
   - `screens/AdminDashboard.jsx` - Admin verification
   - `screens/ProfileSettings.jsx` - Admin list
   - `utils/` - Various admin checks
   - **Should be:** `hooks/useAdminAuth.js`

3. **User Business Ownership Query** (4 copies)
   - `screens/QRCodeGenerator.jsx`
   - `screens/InvoiceGenerator.jsx`
   - `screens/EmailSignatureGenerator.jsx`
   - `hooks/useOnboardingStatus.js`
   - **Should be:** `hooks/useUserBusinesses.js`

### **Medium Duplications:**

4. **Claim Requests Query** (3 copies)
5. **Profile Query Pattern** (4 copies)
6. **Business Details Query** (6 copies)

---

## 6. Duplicate Business Rules

### **Critical Duplications:**

1. **Tier Display Logic** (8+ files)
   ```javascript
   // Found in: AdminDashboard.jsx, BusinessProfile.jsx, Registry.jsx, etc.
   const tier = business.subscription_tier ?? business.tier;
   const tierName = getTierDisplayName(tier);
   ```
   **Should be:** `utils/businessHelpers.js`

2. **Badge/Status Logic** (6+ files)
   ```javascript
   // Verified badge logic repeated everywhere
   {business.verified && (
     <span className="verified-badge">Verified</span>
   )}
   ```
   **Should be:** `components/BadgeDisplay.jsx`

3. **Country/Industry Display Names** (10+ files)
   ```javascript
   // Repeated in multiple components
   const countryLabel = getCountryDisplayName(business.country);
   const industryLabel = getIndustryDisplayName(business.industry);
   ```
   **Should be:** `utils/formatHelpers.js`

4. **Fallback Image Logic** (4+ files)
   ```javascript
   // Avatar/logo fallback repeated
   {business.logo_url ? (
     <img src={business.logo_url} />
   ) : (
     <div className="fallback-avatar">
       {business.business_name.charAt(0)}
     </div>
   )}
   ```
   **Should be:** `components/BusinessAvatar.jsx`

### **Medium Duplications:**

5. **Public Visibility Rules** (3+ files)
6. **Business Status Filtering** (4+ files)
7. **Contact Information Display** (5+ files)

---

## 7. Analytics/Event Audit

### **Current Analytics Implementation:**
**❌ NO ANALYTICS TRACKING FOUND**

### **Missing Events That Should Be Tracked:**
1. **Business Registration Events:**
   - `business_created`
   - `business_claimed`
   - `business_verified`

2. **User Engagement Events:**
   - `user_registered`
   - `user_login`
   - `profile_completed`

3. **Premium Tier Events:**
   - `tier_upgraded`
   - `payment_completed`
   - `subscription_cancelled`

4. **Content Engagement:**
   - `business_viewed`
   - `contact_clicked`
   - `website_visited`

5. **Admin Actions:**
   - `business_approved`
   - `business_rejected`
   - `claim_processed`

### **Recommended Implementation:**
```javascript
// utils/analytics.js
export const trackEvent = (eventName, properties) => {
  // GTM dataLayer push
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...properties
  });
};
```

---

## 8. RLS / Access Risk Audit

### **High Risk Assumptions:**

1. **Public Read Access Assumed**
   ```javascript
   // Registry.jsx assumes public read access
   supabase.from('businesses').select('*').eq('status', 'active')
   ```
   **Risk:** RLS might block public access

2. **Admin Access Assumed**
   ```javascript
   // AdminDashboard.jsx assumes admin can read all data
   supabase.from('business_insights_snapshots').select('*')
   ```
   **Risk:** RLS blocking admin access (confirmed issue)

3. **User Ownership Assumed**
   ```javascript
   // Multiple places assume user can only see their data
   supabase.from('businesses').eq('owner_user_id', user.id)
   ```
   **Risk:** RLS policies might not enforce this

### **Medium Risk Assumptions:**

4. **Update Access Assumed**
5. **Delete Access Assumed**
6. **Cross-table Join Access Assumed**

### **Recommendations:**
- Document all RLS assumptions
- Add error handling for RLS violations
- Create service role client for admin operations
- Add RLS bypass functions for critical admin tasks

---

## 9. Performance / Query Cleanup Opportunities

### **Critical Issues:**

1. **20+ Instances of `select('*')`**
   ```javascript
   // Found in: QRCodeGenerator.jsx, ProfileSettings.jsx, InvoiceGenerator.jsx, etc.
   supabase.from('businesses').select('*')
   ```
   **Impact:** Over-fetching data, slower queries
   **Fix:** Use explicit column selection

2. **Missing Query Limits**
   ```javascript
   // Registry.jsx - no limit on potentially large dataset
   supabase.from('businesses').select('...').eq('status', 'active')
   ```
   **Fix:** Add `.limit(100)` or pagination

3. **N+1 Query Problems**
   ```javascript
   // BusinessProfile.jsx fetches images separately
   const { data: imgs } = await supabase.from('business_images').select('*')
   ```
   **Fix:** Use joins or batch queries

### **Medium Issues:**

4. **Missing Indexes on Filtered Columns**
5. **Inefficient Sorting on Non-indexed Columns**
6. **Duplicate Queries in Same Component**

---

## 10. Recommended Refactor Plan

### **Priority 1: Critical (Immediate - Week 1)**

1. **Fix Column Mismatches**
   - Standardize `contact_website` usage
   - Fix `subscription_tier` vs `tier` inconsistency
   - Update timestamp column references

2. **Create Query Layer**
   ```javascript
   // lib/queries/businessQueries.js
   export const getActiveBusinesses = (options = {}) => {
     return supabase
       .from('businesses')
       .select(EXPLICIT_COLUMNS)
       .eq('status', 'active')
       .limit(options.limit || 100);
   };
   ```

3. **Implement Analytics Tracking**
   ```javascript
   // lib/analytics.js
   export const trackBusinessEvent = (event, properties) => {
     // GTM implementation
   };
   ```

### **Priority 2: High (Week 2-3)**

4. **Centralize Business Logic**
   - `utils/businessHelpers.js` - Tier/badge logic
   - `hooks/useBusinessData.js` - Common business queries
   - `components/BusinessAvatar.jsx` - Fallback image logic

5. **Fix Performance Issues**
   - Replace all `select('*')` with explicit columns
   - Add query limits and pagination
   - Implement query caching

6. **RLS Safety Layer**
   - Add error handling for RLS violations
   - Create service role client for admin operations
   - Document all access assumptions

### **Priority 3: Medium (Week 4-5)**

7. **Component Standardization**
   - `components/BusinessCard.jsx` - Unified business display
   - `components/BadgeDisplay.jsx` - Status/tier badges
   - `components/ContactInfo.jsx` - Contact information display

8. **Hook Consolidation**
   - `hooks/useAdminAuth.js` - Admin authentication
   - `hooks/useUserBusinesses.js` - User business queries
   - `hooks/useClaimRequests.js` - Claim management

### **Priority 4: Low (Week 6)**

9. **Documentation & Testing**
   - Document all query patterns
   - Add query unit tests
   - Create RLS policy documentation

10. **Advanced Optimizations**
    - Implement query caching
    - Add real-time subscriptions
    - Optimize for mobile performance

---

### **Estimated Timeline:**
- **Week 1:** Critical fixes (column mismatches, basic query layer)
- **Week 2-3:** High priority (business logic, performance, RLS)
- **Week 4-5:** Medium priority (components, hooks)
- **Week 6:** Low priority (documentation, advanced features)

### **Success Metrics:**
- Zero column mismatch errors
- 50% reduction in duplicate code
- All queries use explicit column selection
- Analytics tracking implemented for key events
- RLS safety layer in place
- Performance improvement (faster page loads)

---

**Next Steps:**
1. Review and approve this audit
2. Assign priorities to development team
3. Begin with Priority 1 critical fixes
4. Establish code review process for consistency
5. Monitor performance improvements after each phase
