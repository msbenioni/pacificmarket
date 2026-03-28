import { requireAdmin } from '@/lib/server-auth';
import { createClient } from '@supabase/supabase-js';

export async function POST(request, context) {
  try {
    const params = await context.params;
    const businessId = params?.id;
    
    // Authenticate admin
    const auth = await requireAdmin(request);
    if (auth.error) {
      return Response.json({ error: auth.error }, { status: auth.status });
    }

    if (!businessId) {
      return Response.json({ error: 'Business ID required' }, { status: 400 });
    }

    // Environment variable guard for service role key
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Supabase environment variables not configured', {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
      });
      return Response.json({ 
        error: 'Server configuration error', 
        details: 'Required environment variables not available' 
      }, { status: 500 });
    }

    // Create service client for RPC call (service role bypasses RLS)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Call the SQL function to apply referral reward
    const { data, error } = await supabase.rpc('apply_referral_moana_reward', {
      p_new_business_id: businessId
    });

    if (error) {
      console.error('Referral reward application error:', error);
      return Response.json({ 
        error: 'Failed to apply referral reward', 
        details: error.message 
      }, { status: 500 });
    }

    // Guard against null/malformed RPC response
    if (!data || typeof data !== 'object') {
      console.error('Invalid RPC response from referral function:', data);
      return Response.json({ 
        error: 'Invalid server response', 
        details: 'RPC function returned malformed data' 
      }, { status: 500 });
    }

    // The SQL function already returns JSON, so no parsing needed
    const result = data;

    // Normalize error handling for various error formats
    if (!result.success) {
      return Response.json({ 
        error: result.error || result.details || result.detail || 'Failed to apply referral reward',
        details: result.details || result.detail || 'RPC function returned error'
      }, { status: 400 });
    }

    return Response.json({
      success: true,
      message: result.message,
      data: {
        new_business_expiry: result.new_business_expiry,
        referrer_business_expiry: result.referrer_business_expiry,
        new_business_name: result.new_business_name,
        referrer_business_name: result.referrer_business_name
      }
    });

  } catch (error) {
    console.error('Referral reward API error:', error);
    return Response.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
