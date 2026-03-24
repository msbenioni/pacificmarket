# Homepage Field Consistency Fixed + Recommendation

## ✅ Issue Fixed

**Problem**: `visibility_tier` and `is_homepage_featured` could become inconsistent

**Before** (inconsistent):
```javascript
// Moana/auto sets both
visibility_tier = 'homepage'
is_homepage_featured = true

// Downgrade/auto only sets one
visibility_tier = 'pacific-businesses'
// is_homepage_featured left unchanged → INCONSISTENT!
```

**After** (consistent):
```javascript
// Moana/auto sets both
visibility_tier = 'homepage'
is_homepage_featured = true

// Downgrade/auto sets both
visibility_tier = 'pacific-businesses'
is_homepage_featured = false  // ← Now in sync
```

## ✅ Files Updated

- `src/hooks/useBusinessOperations.js` - Added `is_homepage_featured = false` for downgrade
- `src/app/api/stripe/webhook/route.js` - Added sync for both webhook handlers
- `src/utils/businessCreationWithBranding.js` - Added sync for auto mode downgrade

## ✅ Consistency Rule Applied

**New Rule**: Keep both fields in sync since code writes to both
```javascript
if (visibility_tier === 'homepage') {
  is_homepage_featured = true;
} else {
  is_homepage_featured = false;
}
```

## 🤔 Recommendation: Do You Need Both Fields?

### **Current Situation**
You have two fields that essentially mean the same thing:
- `visibility_tier = 'homepage'` ← **Primary control**
- `is_homepage_featured = true` ← **Legacy backup**

### **My Recommendation: Keep Both for Now**

**Reasons**:
1. **Existing Data**: You probably have existing data with `is_homepage_featured` values
2. **Legacy Queries**: Some old queries might still reference the boolean field
3. **Admin UI**: The admin form still shows the legacy checkbox
4. **Gradual Migration**: You can migrate queries gradually without breaking changes

### **Clean Architecture Approach**

**Phase 1: Current (Recommended)**
```javascript
// Keep both fields in sync
visibility_tier = 'homepage'     // Primary control
is_homepage_featured = true    // Legacy backup (synced)
```

**Phase 2: Future Migration**
```javascript
// 1. Update all queries to use visibility_tier only
// 2. Remove is_homepage_featured from admin UI
// 3. Add migration to clean up legacy field
// 4. Eventually drop is_homepage_featured column
```

### **Alternative: Immediate Cleanup**

If you want to clean up immediately:

**Pros**:
- Simpler data model
- No field duplication
- Cleaner code

**Cons**:
- Need data migration
- Might break old queries
- Admin UI changes required

### **Recommended Implementation**

**For now, keep both but document clearly**:

```javascript
/**
 * Homepage Visibility Architecture
 * 
 * PRIMARY: visibility_tier = 'homepage' | 'pacific-businesses' | 'none'
 * LEGACY:  is_homepage_featured = true | false (kept in sync)
 * 
 * Rule: Always keep both fields consistent since legacy code may read either
 */
```

**Add this comment** near your visibility logic to make the architecture clear.

## ✅ Benefits of Current Approach

1. **Backward Compatibility** - Old queries still work
2. **Gradual Migration Path** - Can clean up legacy field later
3. **No Data Loss** - Existing boolean values preserved
4. **Admin UI Continuity** - No immediate UI changes needed

## ✅ System Status

Both fields are now **kept in sync** across all code paths:
- ✅ Business creation
- ✅ Business updates  
- ✅ Webhook handlers
- ✅ Tier upgrades/downgrades

The system is **consistent and reliable** while maintaining backward compatibility.

**Recommendation**: Keep both fields for now, plan gradual migration to `visibility_tier` only.
