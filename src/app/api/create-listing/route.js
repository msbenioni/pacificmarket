import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// POST — create a business listing from a discovered business
export async function POST(request) {
  try {
    const body = await request.json();
    const { discoveredBusinessIds } = body;

    if (!discoveredBusinessIds || discoveredBusinessIds.length === 0) {
      return NextResponse.json({ success: false, error: 'No business IDs provided' }, { status: 400 });
    }

    // Fetch the discovered businesses
    const { data: discovered, error: fetchError } = await supabase
      .from('discovered_businesses')
      .select('*')
      .in('id', discoveredBusinessIds);

    if (fetchError) {
      return NextResponse.json({ success: false, error: fetchError.message }, { status: 500 });
    }

    if (!discovered || discovered.length === 0) {
      return NextResponse.json({ success: false, error: 'No businesses found' }, { status: 404 });
    }

    // Map to businesses table format
    const listings = discovered.map(biz => ({
      business_name: biz.name,
      description: biz.description || null,
      business_website: biz.website || null,
      business_email: biz.email || null,
      business_phone: biz.phone || null,
      country: mapRegionToCountry(biz.region),
      city: biz.city || null,
      industry: biz.category || 'Other',
      status: 'pending',
      social_links: biz.social_media || {},
      source: 'firecrawl_discovery',
      visibility_tier: 'free',
    }));

    // Insert into businesses table
    const { data: created, error: insertError } = await supabase
      .from('businesses')
      .insert(listings)
      .select('id, business_name, status');

    if (insertError) {
      return NextResponse.json({ success: false, error: insertError.message }, { status: 500 });
    }

    // Update discovered businesses status to 'approved'
    await supabase
      .from('discovered_businesses')
      .update({ status: 'approved', updated_at: new Date().toISOString() })
      .in('id', discoveredBusinessIds);

    return NextResponse.json({
      success: true,
      data: {
        created: created.length,
        listings: created
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

function mapRegionToCountry(region) {
  const mapping = {
    'NZ Pasifika': 'New Zealand',
    'NZ Māori': 'New Zealand',
    'Hawaiʻi': 'United States',
    'Pacific Islands': 'Pacific Islands',
    'PNG': 'Papua New Guinea',
    'French Pacific': 'French Polynesia',
  };
  return mapping[region] || region || 'Unknown';
}
