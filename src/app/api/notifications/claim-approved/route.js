import { createClient } from "@supabase/supabase-js";
import { notifyClaimApproved } from "@/lib/notifications";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const { businessData, claimantData } = await request.json();
    
    if (!businessData || !claimantData) {
      return Response.json({ error: 'Missing required data' }, { status: 400 });
    }
    
    // Send notification to the claimant
    const notificationResult = await notifyClaimApproved(businessData, claimantData);
    
    if (notificationResult.success) {
      return Response.json({ 
        success: true, 
        message: 'Claim approval notification sent successfully' 
      });
    } else {
      return Response.json({ 
        error: 'Failed to send notification', 
        details: notificationResult.error 
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Claim approval notification error:', error);
    return Response.json({ 
      error: 'Internal server error', 
      message: error.message 
    }, { status: 500 });
  }
}
