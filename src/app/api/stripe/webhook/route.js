import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { notifyPlanUpgraded } from "@/lib/notifications";
import { SUBSCRIPTION_TIER } from "@/constants/unifiedConstants";
import { VISIBILITY_TIER } from "@/constants/visibilityConstants";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Helper function to find business by stripe_customer_id
async function getBusinessByStripeCustomerId(customerId) {
  const { data, error } = await supabase
    .from('businesses')
    .select('id, business_name, owner_user_id, subscription_tier, visibility_tier, visibility_mode')
    .eq('stripe_customer_id', customerId)
    .single();
    
  return { data, error };
}

export async function POST(request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-04-10",
  });
  const signature = request.headers.get("stripe-signature");
  const body = await request.text();

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        
        // Get business and user info using helper function
        const { data: business, error: businessError } = await getBusinessByStripeCustomerId(session.customer);
        
        if (businessError || !business) {
          console.error('Business not found for customer:', session.customer);
          break;
        }
          
        const { data: user } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', business.owner_user_id)
          .single();
        
        if (business && user) {
          // Determine tier from session metadata
          const newTier = session.metadata?.tier || SUBSCRIPTION_TIER.MANA;
          const previousTier = business.subscription_tier || SUBSCRIPTION_TIER.VAKA; // Use actual current tier
          
          // Auto-set homepage visibility for Moana tier
          const updateData = {
            subscription_tier: newTier,
            updated_at: new Date().toISOString()
          };
          
          // Set homepage visibility for Moana tier (only if not manually set)
          if (newTier === SUBSCRIPTION_TIER.MOANA && business.visibility_mode !== 'manual') {
            updateData.visibility_tier = VISIBILITY_TIER.HOMEPAGE;
            console.log(`Auto-featured business ${business.id} on homepage due to Moana upgrade`);
          }
          
          // Remove homepage visibility for non-Moana tier (only if auto mode)
          if (newTier !== SUBSCRIPTION_TIER.MOANA && business.visibility_mode !== 'manual' && business.visibility_tier === 'homepage') {
            updateData.visibility_tier = VISIBILITY_TIER.NONE; // Downgrade to standard visibility
            console.log(`Removed homepage visibility for business ${business.id} due to tier downgrade`);
          }
          
          // Update business with new tier and homepage visibility status
          await supabase
            .from('businesses')
            .update(updateData)
            .eq('id', business.id);
          
          // Send notification if tier changed
          if (newTier !== previousTier) {
            await notifyPlanUpgraded(business, user, previousTier, newTier);
          }
        }
        break;
      }
      
      case "invoice.payment_succeeded": {
        const invoice = event.data.object;
        
        // Handle subscription renewals
        if (invoice.subscription) {
          const subscriptionId = typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription.id;
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const { data: business } = await supabase
            .from('businesses')
            .select('*')
            .eq('stripe_customer_id', subscription.customer)
            .single();
            
          if (business) {
            // Create or update subscription record
            await supabase
              .from('subscriptions')
              .upsert({
                business_id: business.id,
                user_id: business.owner_user_id,
                stripe_subscription_id: subscriptionId,
                stripe_customer_id: subscription.customer,
                subscription_tier: SUBSCRIPTION_TIER.MANA, // Will be mapped from price lookup key
                status: 'active',
                current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
                current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
                cancel_at_period_end: subscription.cancel_at_period_end,
                updated_at: new Date().toISOString()
              })
              .eq('business_id', business.id);
          }
        }
        break;
      }
      
      case "customer.subscription.updated": {
        const subscription = event.data.object;
        
        const { data: business } = await supabase
          .from('businesses')
          .select('*')
          .eq('stripe_customer_id', subscription.customer)
          .single();
          
        const { data: user } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', business.owner_user_id)
          .single();
        
        if (business && user) {
          // Map Stripe price lookup keys to business tiers using shared constants
          const priceLookupKey = subscription.items.data[0]?.price?.lookup_key;
          let newTier;
          
          if (priceLookupKey === STRIPE_PRICE_LOOKUP_KEYS.MANA) {
            newTier = SUBSCRIPTION_TIER.MANA;
          } else if (priceLookupKey === STRIPE_PRICE_LOOKUP_KEYS.MOANA) {
            newTier = SUBSCRIPTION_TIER.MOANA;
          } else {
            newTier = SUBSCRIPTION_TIER.MANA; // Default fallback
          }
          
          const previousTier = business.subscription_tier || SUBSCRIPTION_TIER.VAKA; // Use actual current tier
          
          // Send notification if tier changed
          if (newTier !== previousTier) {
            await notifyPlanUpgraded(business, user, previousTier, newTier);
            
            // Auto-set homepage visibility for Moana tier
            const updateData = {
              subscription_tier: newTier,
              updated_at: new Date().toISOString()
            };
            
            // Set homepage visibility for Moana tier (only if not manually set)
            if (newTier === SUBSCRIPTION_TIER.MOANA && business.visibility_mode !== 'manual') {
              updateData.visibility_tier = VISIBILITY_TIER.HOMEPAGE;
              console.log(`Auto-featured business ${business.id} on homepage due to Moana upgrade`);
            }
            
            // Remove homepage visibility for non-Moana tier (only if auto mode)
            if (newTier !== SUBSCRIPTION_TIER.MOANA && business.visibility_mode !== 'manual' && business.visibility_tier === 'homepage') {
              updateData.visibility_tier = VISIBILITY_TIER.NONE; // Downgrade to standard visibility
              console.log(`Removed homepage visibility for business ${business.id} due to tier downgrade`);
            }
            
            // Update business with new tier and homepage visibility status
            await supabase
              .from('businesses')
              .update(updateData)
              .eq('id', business.id);
            
            // Create or update subscription record
            await supabase
              .from('subscriptions')
              .upsert({
                business_id: business.id,
                user_id: business.owner_user_id,
                stripe_subscription_id: subscription.id,
                stripe_customer_id: subscription.customer,
                subscription_tier: newTier,
                status: subscription.status,
                current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
                current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
                cancel_at_period_end: subscription.cancel_at_period_end,
                updated_at: new Date().toISOString()
              })
              .eq('business_id', business.id);
          }
        }
        break;
      }
      
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        
        const { data: business } = await supabase
          .from('businesses')
          .select('*')
          .eq('stripe_customer_id', subscription.customer)
          .single();
        
        if (business) {
          // Cancel subscription record
          await supabase
            .from('subscriptions')
            .update({
              status: 'cancelled',
              updated_at: new Date().toISOString()
            })
            .eq('business_id', business.id)
            .eq('stripe_subscription_id', subscription.id);
        }
        break;
      }
      
      default:
        break;
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(`Webhook Error: ${error.message}`, { status: 400 });
  }
}
