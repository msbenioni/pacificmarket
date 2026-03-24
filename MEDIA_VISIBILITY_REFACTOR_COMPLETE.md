# Business Media & Homepage Visibility - Complete Refactor Implementation

## ✅ Summary of Changes

### **Part 1: Fixed Media Removal Preview Behavior**

**Problem**: Clicking "X" set removal flags but previews still showed images.

**Solution**: Created `useMediaState` hook that respects removal flags:

```javascript
// NEW: src/hooks/useMediaState.js
export function useMediaState({ file, persistedUrl, removeFlag = false }) {
  // If marked for removal, don't show any preview
  if (removeFlag) {
    setPreviewUrl("");
    return;
  }
  // ... handle file and persisted URLs
}

// Returns:
{
  displayUrl,      // URL to display (empty if removed)
  hasImage,        // Boolean: has image and not removed
  isRemoved,       // Boolean: marked for removal
  isLocalPreview,  // Boolean: showing local file preview
  isPersistedPreview // Boolean: showing persisted image
}
```

**Result**: 
- ✅ Clicking X immediately hides preview
- ✅ Removal flags take precedence over all URLs
- ✅ Local file clearing works correctly
- ✅ Starter branding not treated as removable

---

### **Part 2: Production-Matching Banner Previews**

**Problem**: Generic cropped thumbnails didn't match real rendering.

**Solution**: Created production-matching preview components:

```javascript
// NEW: src/components/forms/FormSections/BannerPreviews.jsx

// Desktop banner - matches BusinessBanner component
export function DesktopBannerPreview({ bannerUrl, businessName })

// Mobile banner - matches FeaturedSpotlight mobile rendering  
export function MobileBannerPreview({ bannerUrl, businessName })

// Featured banner - matches FeaturedSpotlight large rendering
export function FeaturedBannerPreview({ bannerUrl, businessName })
```

**Key Features**:
- ✅ Same aspect ratios as production components
- ✅ Same object-fit and object-position behavior  
- ✅ Same gradients and overlays
- ✅ Same heights and responsive behavior
- ✅ Upload container IS the preview container

**Updated UploadCard**:
```javascript
// Now supports bannerType parameter
<UploadCard
  bannerType="desktop"  // Uses DesktopBannerPreview
  bannerType="mobile"   // Uses MobileBannerPreview  
  bannerType="featured"  // Uses FeaturedBannerPreview
/>
```

---

### **Part 3: Clean Homepage Visibility Architecture**

**Problem**: Multiple places setting homepage visibility caused conflicts.

**Solution**: Added `visibility_mode` field for governance:

#### **Database Schema**:
```sql
-- NEW: database/migrations/20260324_add_visibility_mode.sql
ALTER TABLE businesses 
ADD COLUMN visibility_mode TEXT DEFAULT 'auto' 
CHECK (visibility_mode IN ('auto', 'manual'));
```

#### **Visibility Rules**:
- **`visibility_mode = 'auto'`**: Follow tier-based rules
- **`visibility_mode = 'manual'`**: Admin control overrides all

#### **Auto-Homepage Logic** (Moana tier only):
```javascript
// Only applies when visibility_mode !== 'manual'
if (subscription_tier === 'MOANA' && visibility_mode !== 'manual') {
  visibility_tier = 'homepage';
  is_homepage_featured = true;
}
```

**Updated in**:
- ✅ `createBusinessWithBranding.js`
- ✅ `useBusinessOperations.js`  
- ✅ Stripe webhook handlers
- ✅ Business types and queries

---

### **Part 4: Enhanced Admin Visibility UI**

**Updated AdminVisibilitySection**:
```javascript
// Shows current mode and explains behavior
<div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
  <div className={`h-2 w-2 rounded-full ${isManualMode ? 'bg-orange-500' : 'bg-green-500'}`}></div>
  <span>{isManualMode ? 'Manual Control' : 'Automatic (Tier-Based)'}</span>
</div>
```

**Features**:
- ✅ Visual indicator of auto vs manual mode
- ✅ Clear explanation of current behavior
- ✅ Manual changes automatically set mode to 'manual'
- ✅ Legacy field demoted but preserved

---

### **Part 5: Updated All Save/Create/Webhook Paths**

**Files Updated**:
1. **`src/utils/businessCreationWithBranding.js`**
   - Added `visibility_mode` to CREATE_FIELD_PASSTHROUGH
   - Auto-Homepage only when mode !== 'manual'

2. **`src/hooks/useBusinessOperations.js`**
   - Same auto-Homepage logic with manual override check

3. **`src/app/api/stripe/webhook/route.js`**
   - Both webhook handlers respect manual overrides
   - Only auto-assign when `visibility_mode !== 'manual'`

---

## ✅ Validation Checklist Results

### **Media Removal** ✅
1. Clicking X on persisted logo hides immediately
2. Clicking X on desktop banner hides immediately  
3. Clicking X on mobile banner hides immediately
4. Local file reverts correctly when X clicked
5. Starter branding not treated as removable

### **Media Previews** ✅
6. Desktop banner preview matches production usage
7. Mobile banner preview matches production usage
8. Upload container IS the preview container
9. Image cropping/positioning matches real rendering

### **Visibility Rules** ✅
10. Admin can set any business to homepage regardless of tier
11. Moana businesses default to homepage automatically
12. Admin manual overrides survive Stripe webhooks
13. Homepage queries use `visibility_tier` only
14. Legacy `is_homepage_featured` no longer drives logic

---

## ✅ Files Modified

### **New Files**:
- `src/hooks/useMediaState.js` - Media state with removal support
- `src/components/forms/FormSections/BannerPreviews.jsx` - Production-matching previews
- `database/migrations/20260324_add_visibility_mode.sql` - Database schema

### **Updated Files**:
- `src/components/forms/FormSections/BrandMediaSection.jsx` - Uses new hooks and previews
- `src/components/forms/FormSections/AdminVisibilitySection.jsx` - Enhanced admin UI
- `src/components/forms/BusinessProfileForm.jsx` - Added visibility_mode to form state
- `src/utils/businessCreationWithBranding.js` - Manual override logic
- `src/hooks/useBusinessOperations.js` - Manual override logic
- `src/app/api/stripe/webhook/route.js` - Manual override logic
- `src/lib/supabase/queries/businesses.ts` - Added visibility_mode to queries
- `src/types/business.ts` - Added visibility_mode type

---

## ✅ Migration Required

Run the database migration:
```sql
-- Execute this in your Supabase SQL editor
-- database/migrations/20260324_add_visibility_mode.sql
```

**Backfill**: Existing records automatically get `visibility_mode = 'auto'` (default behavior preserved).

---

## ✅ Architecture Benefits

1. **Single Source of Truth**: `visibility_tier` controls all homepage placement
2. **Clear Governance**: Auto vs manual modes prevent conflicts
3. **Predictable Behavior**: Admin overrides always respected
4. **Production Accuracy**: Preview containers match real rendering
5. **Immediate Feedback**: Removal actions show immediate UI changes
6. **Clean Separation**: Business logic vs admin control clearly separated

The system now provides predictable, controllable homepage visibility with accurate media previews and immediate removal feedback.
