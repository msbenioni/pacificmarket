import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Stripe price IDs for multiple currencies
const STRIPE_PRICE_IDS = {
  verified: {
    NZD: process.env.STRIPE_PRICE_ID_VERIFIED_NZD,
    AUD: process.env.STRIPE_PRICE_ID_VERIFIED_AUD,
    USD: process.env.STRIPE_PRICE_ID_VERIFIED_USD,
  },
  featured_plus: {
    NZD: process.env.STRIPE_PRICE_ID_FEATURED_PLUS_NZD,
    AUD: process.env.STRIPE_PRICE_ID_FEATURED_PLUS_AUD,
    USD: process.env.STRIPE_PRICE_ID_FEATURED_PLUS_USD,
  },
};

export async function POST(request) {
  const body = await request.json();
  const { tier, businessId, customerEmail, successUrl, cancelUrl } = body;

  try {
    // Debug logging
    console.log('Stripe checkout request:', { tier, businessId });
    console.log('Available price IDs:', STRIPE_PRICE_IDS);
    console.log('Environment variables:', {
      STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
      STRIPE_PRICE_ID_VERIFIED_NZD: !!process.env.STRIPE_PRICE_ID_VERIFIED_NZD,
      STRIPE_PRICE_ID_FEATURED_PLUS_NZD: !!process.env.STRIPE_PRICE_ID_FEATURED_PLUS_NZD
    });

    // Validate the tier
    if (!tier) {
      return Response.json({ error: "No tier specified" }, { status: 400 });
    }
    
    if (!STRIPE_PRICE_IDS[tier]) {
      return Response.json({ error: `Invalid tier specified: ${tier}. Available tiers: ${Object.keys(STRIPE_PRICE_IDS).join(', ')}` }, { status: 400 });
    }

    // Get the current user from the request
    const authHeader = request.headers.get('authorization');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        global: {
          headers: {
            Authorization: authHeader || '',
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return Response.json({ error: "User not authenticated" }, { status: 401 });
    }

    // Create or retrieve Stripe customer
    let customer;
    if (customerEmail) {
      // Try to find existing customer
      const customers = await stripe.customers.list({ email: customerEmail, limit: 1 });
      customer = customers.data[0];
    }

    if (!customer) {
      // Create new customer
      customer = await stripe.customers.create({
        email: customerEmail || user.email,
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Pacific Market User',
        metadata: {
          supabase_user_id: user.id
        }
      });
    }

    // Create checkout session with NZD as default (Stripe will handle currency conversion)
    console.log('Creating Stripe session with:', {
      customerId: customer.id,
      tier: tier,
      priceId: STRIPE_PRICE_IDS[tier].NZD,
      userEmail: user.email
    });

    // Fallback to test price if your price doesn't exist
    const priceId = STRIPE_PRICE_IDS[tier].NZD || 'price_1OaX3kFuLojGHmXuLuwUvOjQ'; // Stripe test price

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{ 
        price: priceId, // Use NZD price or fallback test price
        quantity: 1 
      }],
      success_url: successUrl || `${process.env.NEXT_PUBLIC_APP_PROD_URL}/business-portal?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_PROD_URL}/pricing?cancelled=true`,
      subscription_data: {
        metadata: {
          tier: tier,
          user_id: user.id,
          business_id: businessId || null,
          customer_email: customerEmail || user.email
        }
      },
      allow_promotion_codes: true
      // Stripe will automatically handle currency based on the price ID used
    });

    console.log('Stripe session created successfully:', session.id);

    return Response.json({ 
      sessionId: session.id,
      url: session.url 
    });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return Response.json({ error: error.message || "Failed to create checkout session" }, { status: 500 });
  }
}
