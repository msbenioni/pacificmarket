import { useState } from 'react';
import { pacificMarket } from '@/lib/pacificMarketClient';

export function useStripeCheckout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createCheckoutSession = async ({ tier, businessId = null }) => {
    setLoading(true);
    setError(null);

    try {
      // Get current user
      const user = await pacificMarket.auth.me();
      if (!user) {
        throw new Error('You must be logged in to upgrade');
      }

      // Determine URLs based on environment
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? process.env.NEXT_PUBLIC_APP_PROD_URL 
        : process.env.NEXT_PUBLIC_APP_DEV_URL;

      const successUrl = `${baseUrl}/business-portal?success=true&session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${baseUrl}/pricing?cancelled=true`;

      // Get session token for authentication
    const { getSupabase } = await import('../lib/supabase/client');
    const supabase = getSupabase();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('No active session found');
    }

    // Create checkout session
    const response = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        tier,
        businessId,
        customerEmail: user.email,
        successUrl,
        cancelUrl
      }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create checkout session');
      }

      // Redirect to Stripe checkout
      if (result.url) {
        window.location.href = result.url;
      } else {
        throw new Error('No checkout URL returned');
      }

    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message || 'Failed to start checkout');
    } finally {
      setLoading(false);
    }
  };

  return {
    createCheckoutSession,
    loading,
    error
  };
}
