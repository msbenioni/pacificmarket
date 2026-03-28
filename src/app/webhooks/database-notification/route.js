import { createClient } from "@supabase/supabase-js";
import { notifyNewBusinessCreated, notifyNewBusinessClaim } from "@/utils/notifyAdmin";
import { NextResponse } from "next/server";

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const signature = request.headers.get('supabase-webhook-signature');
    
    // Verify webhook signature (in production, implement proper verification)
    // For now, we'll assume it's valid
    
    const payload = await request.json();
    console.log('Database webhook received:', payload);

    // Handle different table events
    const { table, record, type } = payload;

    if (type === 'INSERT') {
      if (table === 'businesses') {
        // Only notify for user-created businesses
        if (record.created_via && ['user_claim_modal', 'user_portal'].includes(record.created_via)) {
          // Fetch user details
          const { data: userData } = await supabase.auth.admin.getUserById(record.owner_user_id);
          
          if (userData) {
            await notifyNewBusinessCreated(record, userData.user);
            console.log('✅ Business notification sent:', record.business_name);
          }
        } else {
          console.log('⏭️ Skipping admin-created business:', record.created_via);
        }
      } else if (table === 'claim_requests') {
        // Only notify for user-submitted claims
        if (record.created_via && ['user_claim_modal', 'user_portal'].includes(record.created_via)) {
          // Fetch business and user details
          const { data: business } = await supabase
            .from('businesses')
            .select('*')
            .eq('id', record.business_id)
            .single();
            
          const { data: userData } = await supabase.auth.admin.getUserById(record.user_id);
          
          if (business && userData) {
            await notifyNewBusinessClaim(record, business, userData.user);
            console.log('✅ Claim notification sent:', business.business_name);
          }
        } else {
          console.log('⏭️ Skipping admin-created claim:', record.created_via);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
