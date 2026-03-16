import { createServiceClient } from '@/lib/server-auth';
import { randomBytes } from 'crypto';

const serviceClient = createServiceClient();

// Generate secure unsubscribe token using crypto
function generateUnsubscribeToken() {
  return randomBytes(24).toString('base64url');
}

export async function POST(request) {
  try {
    const { email, generateToken = false } = await request.json();

    // Validate email if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return Response.json({ error: 'Invalid email address' }, { status: 400 });
      }
    }

    // Generate unsubscribe token and store it
    const token = generateUnsubscribeToken();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    const { data, error } = await serviceClient
      .from('email_unsubscribe_tokens')
      .insert({
        token,
        email: email?.toLowerCase().trim(),
        expires_at: expiresAt.toISOString(),
        created_at: new Date().toISOString()
      })
      .select('token, expires_at')
      .single();

    if (error) {
      console.error('Failed to generate unsubscribe token:', error);
      return Response.json({ error: 'Failed to generate unsubscribe token' }, { status: 500 });
    }

    return Response.json({
      success: true,
      token: data.token,
      expires_at: data.expires_at,
      unsubscribe_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://pacificdiscoverynetwork.com'}/unsubscribe?token=${data.token}`
    });

  } catch (error) {
    console.error('Unsubscribe token API error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Validate token and return email
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return Response.json({ error: 'Token is required' }, { status: 400 });
    }

    // Validate token and check if it's expired
    const { data: tokenData, error: tokenError } = await serviceClient
      .from('email_unsubscribe_tokens')
      .select('email, expires_at, used_at')
      .eq('token', token)
      .single();

    if (tokenError) {
      return Response.json({ error: 'Invalid or expired token' }, { status: 400 });
    }

    // Check if token is expired
    if (new Date(tokenData.expires_at) < new Date()) {
      return Response.json({ error: 'Token has expired' }, { status: 400 });
    }

    // Check if token has already been used
    if (tokenData.used_at) {
      return Response.json({ error: 'Token has already been used' }, { status: 400 });
    }

    return Response.json({
      success: true,
      email: tokenData.email,
      expires_at: tokenData.expires_at
    });

  } catch (error) {
    console.error('Validate token error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
