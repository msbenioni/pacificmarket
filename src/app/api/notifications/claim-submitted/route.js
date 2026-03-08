import { createClient } from "@supabase/supabase-js";
import { notifyClaimSubmitted } from "@/lib/notifications";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const { businessId, claimantId, claimType } = await request.json();
    
    // Get business and claimant details
    const { data: business } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', businessId)
      .single();
      
    const { data: claimant } = await supabase
      .from('users')
      .select('*')
      .eq('id', claimantId)
      .single();
    
    if (!business || !claimant) {
      return Response.json({ error: 'Business or claimant not found' }, { status: 404 });
    }
    
    // Send notification
    const notificationResult = await notifyClaimSubmitted(business, claimant, claimType);
    
    if (notificationResult.success) {
      return Response.json({ 
        success: true, 
        message: 'Claim submitted notification sent successfully' 
      });
    } else {
      return Response.json({ 
        error: 'Failed to send notification', 
        details: notificationResult.error 
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Claim submitted notification error:', error);
    return Response.json({ 
      error: 'Internal server error', 
      message: error.message 
    }, { status: 500 });
  }
}
