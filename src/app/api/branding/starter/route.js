import { NextResponse } from 'next/server';
import { createAndUploadStarterBranding } from '@/lib/branding/uploadStarterBranding.js';
import { createClient } from '@supabase/supabase-js';
import { SUBSCRIPTION_TIER } from '@/constants/unifiedConstants.js';

// Initialize Supabase admin client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req) {
  try {
    const body = await req.json();
    const { businessId } = body;

    if (!businessId) {
      return NextResponse.json({ error: 'Missing businessId' }, { status: 400 });
    }

    // Fetch business details
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('id, name, industry, subscription_tier')
      .eq('id', businessId)
      .single();

    if (businessError || !business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    // Only generate starter branding for Vaka plan
    if (business.subscription_tier !== SUBSCRIPTION_TIER.VAKA) {
      return NextResponse.json({ ok: true, skipped: true, message: 'Only Vaka plan gets starter branding' });
    }

    // Generate and upload starter branding
    const branding = await createAndUploadStarterBranding({
      businessId: business.id,
      businessName: business.business_name,
      industry: business.industry,
    });

    // Update business record with generated URLs
    const { error: updateError } = await supabase
      .from('businesses')
      .update({
        generated_logo_url: branding.generatedLogoUrl,
        generated_banner_url: branding.generatedBannerUrl,
        generated_mobile_banner_url: branding.generatedMobileBannerUrl,
      })
      .eq('id', business.id);

    if (updateError) {
      console.error('Database update error:', updateError);
      return NextResponse.json({ error: 'Failed to update business record' }, { status: 500 });
    }

    return NextResponse.json({ 
      ok: true, 
      branding,
      message: 'Starter branding generated successfully'
    });

  } catch (error) {
    console.error('Starter branding error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate starter branding',
      details: error.message 
    }, { status: 500 });
  }
}
