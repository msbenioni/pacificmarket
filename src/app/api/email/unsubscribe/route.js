import { createServiceClient } from '@/lib/server-auth';

// Create a service client for public operations
const serviceClient = createServiceClient();

export async function POST(request) {
  try {
    const { email, token } = await request.json();

    // Support both email and token-based unsubscribe
    if (!email && !token) {
      return Response.json({ error: 'Email or token is required' }, { status: 400 });
    }

    let normalizedEmail;
    
    if (email) {
      // Direct email unsubscribe (legacy support)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return Response.json({ error: 'Invalid email address' }, { status: 400 });
      }
      normalizedEmail = email.toLowerCase().trim();
    } else if (token) {
      // Token-based unsubscribe - validate token directly
      const { data: tokenData, error: tokenError } = await serviceClient
        .from('email_unsubscribe_tokens')
        .select('email, expires_at')
        .eq('token', token)
        .single();

      if (tokenError) {
        return Response.json({ error: 'Invalid or expired token' }, { status: 400 });
      }

      // Check if token is expired
      if (new Date(tokenData.expires_at) < new Date()) {
        return Response.json({ error: 'Token has expired' }, { status: 400 });
      }

      normalizedEmail = tokenData.email;
    }

    // Update subscriber status using service client (bypasses RLS)
    const { data, error } = await serviceClient
      .from('email_subscribers')
      .update({ 
        status: 'unsubscribed',
        updated_at: new Date().toISOString()
      })
      .eq('email', normalizedEmail)
      .select('email, status, updated_at')
      .single();

    // Generic success message for privacy
    const successMessage = "If this email is on our mailing list, it has been unsubscribed.";

    // Log the unsubscribe for analytics
    await serviceClient
      .from('email_events')
      .insert({
        campaign_id: null, // Direct unsubscribe, not campaign-specific
        recipient_id: null,
        event_type: 'unsubscribe',
        event_data: {
          email: normalizedEmail,
          method: token ? 'token_link' : 'direct_email',
          timestamp: new Date().toISOString()
        }
      });

    return Response.json({
      success: true,
      message: "If this email is on our mailing list, it has been unsubscribed."
    });

  } catch (error) {
    console.error('Unsubscribe API error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Also support GET requests for unsubscribe page to check status
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return Response.json({ error: 'Email parameter is required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return Response.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Check current subscriber status
    const { data, error } = await serviceClient
      .from('email_subscribers')
      .select('email, status, first_name, created_at')
      .eq('email', normalizedEmail)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Check subscriber status error:', error);
      return Response.json({ error: 'Failed to check subscriber status' }, { status: 500 });
    }

    return Response.json({
      success: true,
      subscriber: data || null,
      is_subscribed: data ? data.status === 'subscribed' : false
    });

  } catch (error) {
    console.error('Unsubscribe check API error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
