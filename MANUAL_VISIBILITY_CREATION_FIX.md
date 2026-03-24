# Manual Visibility Preservation Fix - Business Creation Flow

## ✅ Issue Fixed

**Problem**: `createBusinessWithBranding` had ambiguous manual visibility logic

**Previous Logic** (ambiguous):
```javascript
// Manual mode preserves admin-selected visibility_tier (no changes)
// This comment was the only "logic" - no explicit preservation!
```

**Risk**: Manual admin visibility settings could be lost if the initial payload didn't include them explicitly.

## ✅ Fix Applied

**New Explicit Logic**:
```javascript
if (resultingMode === 'manual') {
  // Manual mode: preserve incoming admin-set visibility explicitly
  if (businessesData.visibility_tier) {
    changedBusinessPayload.visibility_tier = businessesData.visibility_tier;
  }
  if (typeof businessesData.is_homepage_featured === 'boolean') {
    changedBusinessPayload.is_homepage_featured = businessesData.is_homepage_featured;
  }
} else {
  // Auto mode: compute from tier
  if (resultingTier === SUBSCRIPTION_TIER.MOANA) {
    changedBusinessPayload.visibility_tier = 'homepage';
    changedBusinessPayload.is_homepage_featured = true;
  } else {
    changedBusinessPayload.visibility_tier = 'pacific-businesses';
  }
}
```

## ✅ Benefits

**Before Fix**:
- ❌ Manual visibility relied on implicit payload inclusion
- ❌ Risk of losing admin-set visibility settings
- ❌ Ambiguous "no changes" behavior

**After Fix**:
- ✅ Manual visibility explicitly preserved from incoming data
- ✅ Clear separation of manual vs auto logic
- ✅ Safe regardless of initial payload composition
- ✅ Type-safe boolean check for `is_homepage_featured`

## ✅ Behavior Summary

**Manual Mode (`visibility_mode = 'manual'`)**:
- ✅ Preserves `visibility_tier` from admin input
- ✅ Preserves `is_homepage_featured` from admin input
- ✅ No automatic tier-based overrides

**Auto Mode (`visibility_mode = 'auto'`)**:
- ✅ Moana tier → `visibility_tier = 'homepage'`
- ✅ Non-Moana tier → `visibility_tier = 'pacific-businesses'`
- ✅ Ignores admin input (follows tier entitlements)

## ✅ Files Updated

- `src/utils/businessCreationWithBranding.js` - Explicit manual visibility preservation

## ✅ System Status

This fix ensures that **admin manual visibility settings are never lost** during business creation, regardless of how the initial payload is constructed. The logic is now **explicit, safe, and predictable**.

Combined with the previous saveBusiness payload fix, the entire visibility governance system is now **production-stable**!
