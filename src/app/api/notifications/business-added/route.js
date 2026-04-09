import { notifyBusinessAdded } from "@/lib/notifications";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const { businessData, userData } = await request.json();
    
    if (!businessData || !userData) {
      return Response.json({ error: 'Missing required data' }, { status: 400 });
    }
    
    // Send notification using the provided data
    const notificationResult = await notifyBusinessAdded(businessData, userData);
    
    if (notificationResult.success) {
      return Response.json({ 
        success: true, 
        message: 'Business added notification sent successfully' 
      });
    } else {
      return Response.json({ 
        error: 'Failed to send notification', 
        details: notificationResult.error 
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Business added notification error:', error);
    return Response.json({ 
      error: 'Internal server error', 
      message: error.message 
    }, { status: 500 });
  }
}
