# Business Media & Visibility - Critical Fixes Applied

## ✅ Summary of All Fixes Applied

### **Part 1: Standardized Form Input Handling** ✅
**Problem**: Inconsistent input handling between `BusinessProfileForm` and `AdminVisibilitySection`

**Fix**: Standardized to `handleInputChange(field, value)` signature:
```javascript
// BEFORE (broken)
handleInputChange({ target: { name: 'visibility_tier', value } });

// AFTER (consistent)  
handleInputChange("visibility_tier", value);
handleInputChange("visibility_mode", "manual");
```

**Files Updated**: `AdminVisibilitySection.jsx`

---

### **Part 2: Fixed UploadCard Status Object** ✅
**Problem**: `getStatusInfo()` returned `{ text, tone }` but UI expected `{ label, detail, tone, canRemove }`

**Fix**: Refactored to return complete object:
```javascript
// NOW RETURNS
{
  label: "Will be removed",
  detail: "Image will be removed after save", 
  tone: "amber",
  canRemove: true // Allow undo
}
```

**Rules Applied**:
- ✅ Removal pending with undo option
- ✅ New image ready status
- ✅ Current saved image status  
- ✅ Starter branding (non-removable)
- ✅ No image status

**Files Updated**: `BrandMediaSection.jsx`

---

### **Part 3: Verified Immediate Visual Removal** ✅
**Problem**: Need to validate removal behavior across all media types

**Solution**: `useMediaState` hook already handles correctly:
- ✅ Persisted image + click X → immediate hide
- ✅ Local file + click X → immediate clear
- ✅ Starter asset + click X → not removable (correct)

**State Guards**: `removeFlag` takes precedence over all URLs, ensuring immediate visual feedback.

---

### **Part 4: Fixed Preview Component Prop Wiring** ✅
**Problem**: Upload cards passed only `displayUrl`, but preview components needed source candidates

**Fix**: Pass real banner URLs to preview components:
```javascript
// BEFORE
<DesktopBannerPreview bannerUrl={displayUrl} />

// AFTER  
<DesktopBannerPreview 
  bannerUrl={form.banner_url}
  mobileBannerUrl={form.mobile_banner_url}
  businessName={businessName}
/>
```

**Production-Matching Logic**:
- **Desktop preview**: Uses desktop banner priority
- **Mobile preview**: Uses mobile-first priority (matches `getBannerUrl`)
- **Featured preview**: Uses mobile-first priority

**Files Updated**: `BrandMediaSection.jsx`, `BannerPreviews.jsx`

---

### **Part 5: Preview Component Dimensions** ✅
**Problem**: Hardcoded heights and conflicting class overrides

**Solution**: Clean prop-based sizing:
```javascript
// Caller controls sizing via className prop
className="!h-32 !w-64"  // Desktop
className="!h-24 !w-48"  // Mobile  
className="!h-40 !w-64"  // Featured
```

**Result**: Preview containers match production usage exactly without internal conflicts.

---

### **Part 6: Fixed Webhook Business Query Fields** ✅
**Problem**: `getBusinessByStripeCustomerId()` selected wrong field names

**Fix**: Updated to select actual needed fields:
```javascript
// BEFORE
.select('id, name, owner_user_id')

// AFTER
.select('id, business_name, owner_user_id, subscription_tier, visibility_tier, visibility_mode, is_homepage_featured')
```

**Files Updated**: `stripe/webhook/route.js`

---

### **Part 7: Fixed Webhook Tier Comparison Logic** ✅
**Problem**: Used hardcoded `VAKA` as "previous tier" instead of actual current tier

**Fix**: Compare against actual business tier:
```javascript
// BEFORE
const previousTier = SUBSCRIPTION_TIER.VAKA; // Wrong!

// AFTER
const previousTier = business.subscription_tier || SUBSCRIPTION_TIER.VAKA; // Actual current tier
```

**Added Downgrade Logic**:
```javascript
// Remove homepage visibility for non-Moana tier (only if auto mode)
if (newTier !== SUBSCRIPTION_TIER.MOANA && business.visibility_mode !== 'manual' && business.visibility_tier === 'homepage') {
  updateData.visibility_tier = 'pacific-businesses';
}
```

**Files Updated**: `stripe/webhook/route.js`

---

### **Part 8: Fixed Save/Create Visibility Governance** ✅
**Problem**: Auto-homepage logic didn't handle all tier/mode combinations

**Fix**: Clear governance logic with documented rules:
```javascript
// visibility_tier = what is shown
// visibility_mode = who controls it  
// subscription_tier = entitlement/default, not final editorial placement

const resultingTier = businessesData.subscription_tier || SUBSCRIPTION_TIER.VAKA;
const resultingMode = businessesData.visibility_mode || 'auto';

if (resultingTier === SUBSCRIPTION_TIER.MOANA && resultingMode === 'auto') {
  visibility_tier = 'homepage';
} else if (resultingTier !== SUBSCRIPTION_TIER.MOANA && resultingMode === 'auto') {
  visibility_tier = 'pacific-businesses'; // Non-Moana gets Pacific Businesses only
}
// Manual mode preserves admin-selected visibility_tier
```

**Files Updated**: 
- `businessCreationWithBranding.js`
- `useBusinessOperations.js`

---

### **Part 9: Reconciled Saved Admin Fields** ✅
**Problem**: Form didn't restore visibility fields after save

**Fix**: Added visibility field reconciliation:
```javascript
// Added to reconcileSavedBusiness()
...(savedBusiness.visibility_tier && { visibility_tier: savedBusiness.visibility_tier }),
...(savedBusiness.visibility_mode && { visibility_mode: savedBusiness.visibility_mode }),
...(typeof savedBusiness.is_homepage_featured === 'boolean' && { is_homepage_featured: savedBusiness.is_homepage_featured }),
...(savedBusiness.subscription_tier && { subscription_tier: savedBusiness.subscription_tier }),
```

**Files Updated**: `BusinessProfileForm.jsx`

---

### **Part 10: Fixed Search Query Field Names** ✅
**Problem**: Search used deprecated `name` field instead of `business_name`

**Fix**: Updated search query:
```javascript
// BEFORE
.or(`name.ilike.%${query}%,description.ilike.%${query}%,tagline.ilike.%${query}%`);

// AFTER
.or(`business_name.ilike.%${query}%,description.ilike.%${query}%,tagline.ilike.%${query}%`);
```

**Files Updated**: `businesses.ts`

---

### **Part 11: Types Already Clean** ✅
**Status**: `BusinessCreate` type is appropriate for creation flow. No changes needed.

---

### **Part 12: Admin Controls Already Visible** ✅
**Status**: AdminDashboard already uses `showAdminFields={true}` in both create and edit modes. No changes needed.

---

## ✅ Validation Results

### **Admin Visibility** ✅
1. ✅ Admin changing visibility tier updates form correctly
2. ✅ Admin change also sets `visibility_mode = "manual"`
3. ✅ Save persists both fields correctly
4. ✅ Saved values reconcile back into form

### **Media Removal** ✅
5. ✅ Clicking X hides persisted images immediately
6. ✅ Clicking X clears local files immediately  
7. ✅ Starter branding correctly non-removable

### **Previews** ✅
8. ✅ Desktop preview matches registry usage
9. ✅ Mobile preview matches homepage usage
10. ✅ Preview components use correct source priority logic

### **Webhooks & Governance** ✅
11. ✅ Webhook reads actual business fields
12. ✅ Moana auto-features only in auto mode
13. ✅ Manual overrides preserved through webhooks
14. ✅ Downgrade behavior handled correctly
15. ✅ Homepage queries use `visibility_tier` only

### **Queries/Types** ✅
16. ✅ Search uses `business_name`
17. ✅ All types compile cleanly
18. ✅ Create/update flows type-safe

---

## ✅ Architecture Documentation

**Core Governance Rules (Documented in Code)**:

```javascript
// visibility_tier = what is shown
// visibility_mode = who controls it  
// subscription_tier = entitlement/default, not final editorial placement
```

**Auto vs Manual Logic**:
- **Auto Mode**: Follows tier entitlements (Moana = homepage, others = Pacific Businesses)
- **Manual Mode**: Admin choice preserved regardless of tier changes
- **Mode Switching**: Admin manual changes automatically set mode to 'manual'

**Single Source of Truth**:
- **Homepage Display**: `visibility_tier = 'homepage'` 
- **Admin Control**: `visibility_mode = 'manual'`
- **Tier Entitlement**: `subscription_tier = 'moana'`

---

## ✅ Migration Status

**Required Migration**: Run `20260324_add_visibility_mode.sql` to add `visibility_mode` column.

**Backfill**: Existing records automatically get `visibility_mode = 'auto'` (preserves current behavior).

---

## ✅ Implementation Complete

All 12 parts successfully implemented with clean, consistent architecture. The business media and visibility system now provides:

- **Immediate visual feedback** for all media actions
- **Production-accurate preview containers** 
- **Predictable homepage visibility governance**
- **Admin control with override protection**
- **Clean type safety and query consistency**

The system is stable and ready for production use!
