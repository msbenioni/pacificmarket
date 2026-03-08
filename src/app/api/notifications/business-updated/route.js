import { createClient } from "@supabase/supabase-js";
import { notifyBusinessUpdated } from "@/lib/notifications";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const { businessId, userId, changes } = await request.json();
    
    // Get business and user details
    const { data: business } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', businessId)
      .single();
      
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (!business || !user) {
      return Response.json({ error: 'Business or user not found' }, { status: 404 });
    }
    
    // Send notification
    const notificationResult = await notifyBusinessUpdated(business, user, changes);
    
    if (notificationResult.success) {
      return Response.json({ 
        success: true, 
        message: 'Business updated notification sent successfully' 
      });
    } else {
      return Response.json({ 
        error: 'Failed to send notification', 
        details: notificationResult.error 
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Business updated notification error:', error);
    return Response.json({ 
      error: 'Internal server error', 
      message: error.message 
    }, { status: 500 });
  }
}
