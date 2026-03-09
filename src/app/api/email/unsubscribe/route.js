import { createServiceClient } from '@/lib/server-auth';
import { Resend } from 'resend';

// Create a service client for public operations
const serviceClient = createServiceClient();
const resend = new Resend(process.env.RESEND_API_KEY);

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
      // Token-based unsubscribe
      const tokenResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pacificmarket.co.nz'}/api/email/token?token=${token}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!tokenResponse.ok) {
        return Response.json({ error: 'Invalid or expired token' }, { status: 400 });
      }
      
      const tokenData = await tokenResponse.json();
      if (!tokenData.success) {
        return Response.json({ error: tokenData.error }, { status: 400 });
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
      message: successMessage,
      data: data ? {
        email: data.email,
        status: data.status,
        unsubscribed_at: data.updated_at
      } : null
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
