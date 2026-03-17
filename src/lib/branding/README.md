# Starter Branding System

This system generates simple, consistent starter branding for Vaka plan businesses using Satori and Supabase Storage with the Pacific Discovery Network brand colors.

## Files Overview

- `generateStarterBranding.js` - Core Satori SVG generation logic
- `uploadStarterBranding.js` - Supabase upload functionality  
- `../app/api/branding/starter/route.js` - API endpoint for generation
- `../../database/migrations/add_generated_branding_fields.sql` - Database schema

## Setup Instructions

### 1. Install Satori
```bash
npm install satori
```

### 2. Add Font File
Place `Inter-Bold.ttf` in `public/fonts/` directory for professional typography.

### 3. Create Supabase Bucket
Create a public bucket called `business-branding` in your Supabase project.

### 4. Run Database Migration
```sql
-- Run the migration in add_generated_branding_fields.sql
```

### 5. Set Environment Variables
Ensure these are in your `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Brand Design

### Consistent Brand Identity
All starter branding uses the Pacific Discovery Network brand colors:
- **Background**: Teal gradient (#0D4F4F → #14B8A6)
- **Text**: White (#FFFFFF)
- **Style**: Clean, centered, professional

### Generated Assets

For each business, the system generates:

1. **Starter Logo** (200×200px)
   - Business initials in white text
   - Teal gradient background
   - Rounded corners (32px)
   - Large, bold typography (72px)

2. **Starter Desktop Banner** (1200×300px)
   - Business name centered in white text
   - Teal gradient background
   - Rounded corners (28px)
   - Large typography (54px)

3. **Starter Mobile Banner** (400×160px)
   - Business name centered in white text
   - Teal gradient background
   - Rounded corners (20px)
   - Medium typography (32px)

## Usage

### Automatic Generation
Starter branding is automatically generated for Vaka plan businesses when they are created.

### Manual Trigger
```javascript
const response = await fetch("/api/branding/starter", {
  method: "POST", 
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ businessId: "business-id-here" })
});
```

### Display Logic
Use the updated bannerUtils functions:
```javascript
import { getLogoUrl, getBannerUrl } from '@/utils/bannerUtils';

const logoUrl = getLogoUrl(business); // Checks uploaded → generated → fallback
const bannerUrl = getBannerUrl(business);
```

## File Storage

Generated assets are stored in Supabase at:
```
business-branding/businesses/{businessId}/
├── starter-logo.svg
├── starter-banner-desktop.svg  
└── starter-banner-mobile.svg
```

## Database Fields

The system adds these fields to the `businesses` table:
- `generated_logo_url` - URL to generated logo
- `generated_banner_url` - URL to generated desktop banner
- `generated_mobile_banner_url` - URL to generated mobile banner

## Notes

- **SVG format** for crisp scaling and small file sizes
- **Consistent branding** - All businesses use the same Pacific Discovery Network colors
- **Simple design** - Clean, centered text on brand background
- **Professional typography** - Inter Bold font with fallback to system fonts
- **Graceful error handling** - Business creation won't fail if branding generation fails
