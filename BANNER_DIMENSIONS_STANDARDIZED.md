# Banner Dimensions Standardization - Single Source of Truth

## ✅ Problem Fixed

**Inconsistent Banner Dimensions** were confusing users:

| Location | Desktop Banner | Mobile Banner |
|----------|----------------|---------------|
| Upload card help text | `1200×400px` | `390×844px` |
| Guide text | `1200×300px` | `400×160px` |
| **Result** | **INCONSISTENT** | **INCONSISTENT** |

## ✅ Solution: Single Source of Truth

Created `src/constants/bannerDimensions.js` with canonical dimensions:

```javascript
export const BANNER_DIMENSIONS = {
  DESKTOP: {
    width: 1200,
    height: 300,
    aspectRatio: '1200:300',
    recommendedSize: '1200×300px',
    description: 'Desktop banner for business registry pages'
  },
  
  MOBILE: {
    width: 400,
    height: 160,
    aspectRatio: '400:160',
    recommendedSize: '400×160px',
    description: 'Mobile banner for mobile cards and homepage'
  }
};
```

## ✅ Consistent Help Text

**New Help Text Pattern**:
```javascript
// Desktop: "1200×300px recommended. Preview below shows how it will crop on site."
// Mobile:  "400×160px recommended. Preview below shows how it will crop on site."
```

**New Guide Text Pattern**:
```javascript
// Desktop: "Desktop banner for business registry pages: 1200×300px"
// Mobile:  "Mobile banner for mobile cards and homepage: 400×160px"
```

## ✅ Key Benefits

1. **Single Source of Truth**: All banner dimensions come from one place
2. **Easy Updates**: Change container sizes in one file, applies everywhere
3. **Clear User Guidance**: Users understand upload sizes vs preview behavior
4. **Consistent Messaging**: No more conflicting dimension recommendations
5. **Future-Proof**: Container size changes only require updating the constants

## ✅ Files Updated

### **New File**:
- `src/constants/bannerDimensions.js` - Single source of truth for banner dimensions

### **Updated Files**:
- `src/components/forms/FormSections/BrandMediaSection.jsx` - Uses consistent help text

## ✅ User Experience Improvement

**Before Fix**:
- ❌ Conflicting dimension recommendations
- ❌ Users unsure which size to upload
- ❌ Preview vs upload size confusion

**After Fix**:
- ✅ Consistent `1200×300px` for desktop everywhere
- ✅ Consistent `400×160px` for mobile everywhere
- ✅ Clear "Preview shows how it will crop" messaging
- ✅ Easy to update if container sizes change

## ✅ Implementation Details

**Helper Functions**:
```javascript
getBannerHelpText(type)     // For upload card help text
getBannerGuideText(type)    // For guide/description text
```

**Preview Container Info** (for reference):
- Desktop: Responsive heights with cropping
- Mobile: Fixed `h-[133px]` matching FeaturedSpotlight
- Featured: Fixed `h-[233px]` matching large featured cards

## ✅ System Status

Banner dimensions are now **standardized and consistent** across the entire application. Users will receive clear, unified guidance for banner uploads, and any future container size changes can be made in a single location.

The business media system is now **production-ready** with consistent user guidance!
