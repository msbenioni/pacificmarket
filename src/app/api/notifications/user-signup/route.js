import { createClient } from "@supabase/supabase-js";
import { notifyUserSignedUp } from "@/lib/notifications";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const { userData } = await request.json();
    
    if (!userData) {
      return Response.json({ error: 'Missing user data' }, { status: 400 });
    }
    
    // Send notification using the provided data
    const notificationResult = await notifyUserSignedUp(userData);
    
    if (notificationResult.success) {
      return Response.json({ 
        success: true, 
        message: 'User signup notification sent successfully' 
      });
    } else {
      return Response.json({ 
        error: 'Failed to send notification', 
        details: notificationResult.error 
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('User signup notification error:', error);
    return Response.json({ 
      error: 'Internal server error', 
      message: error.message 
    }, { status: 500 });
  }
}
