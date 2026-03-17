import { createClient } from '@supabase/supabase-js';
import { generateStarterBranding } from './generateStarterBranding.js';

// Initialize Supabase client - you'll need to replace with your actual credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

function svgToBlob(svg) {
  return new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
}

async function uploadSvg(bucket, path, svg) {
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, svgToBlob(svg), {
      contentType: 'image/svg+xml',
      upsert: true,
      cacheControl: '3600',
    });

  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function createAndUploadStarterBranding({
  businessId,
  businessName,
  industry,
}) {
  const bucket = 'business-branding';

  // Generate the SVG assets
  const assets = await generateStarterBranding({
    businessName,
    industry,
  });

  const basePath = `businesses/${businessId}`;

  // Upload all three assets in parallel
  const [generatedLogoUrl, generatedBannerUrl, generatedMobileBannerUrl] =
    await Promise.all([
      uploadSvg(bucket, `${basePath}/starter-logo.svg`, assets.logoSvg),
      uploadSvg(bucket, `${basePath}/starter-banner-desktop.svg`, assets.desktopBannerSvg),
      uploadSvg(bucket, `${basePath}/starter-banner-mobile.svg`, assets.mobileBannerSvg),
    ]);

  return {
    generatedLogoUrl,
    generatedBannerUrl,
    generatedMobileBannerUrl,
    style: assets.style,
  };
}
