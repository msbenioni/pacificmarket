import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { getBusinessById } from "@/lib/supabase/queries/businesses";
import { notifyPlanUpgraded } from "@/lib/notifications";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Helper function to find business by stripe_customer_id
async function getBusinessByStripeCustomerId(customerId) {
  const { data, error } = await supabase
    .from('businesses')
    .select('id, name, owner_user_id')
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
          // Determine plan from session metadata
          const newPlan = session.metadata?.plan || 'premium';
          const previousPlan = 'basic'; // Will be replaced with subscription lookup
          
          // Send notification if plan changed
          if (newPlan !== previousPlan) {
            await notifyPlanUpgraded(business, user, previousPlan, newPlan);
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
                plan_type: 'premium', // Will be mapped from price lookup key
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
          // Map price to plan
          const planMap = {
            'price_basic': 'basic',
            'price_premium': 'premium',
            'price_enterprise': 'enterprise'
          };
          
          const newPlan = planMap[subscription.items.data[0]?.price?.lookup_key] || 'basic';
          const previousPlan = 'basic'; // Will be replaced with subscription lookup
          
          // Send notification if plan changed
          if (newPlan !== previousPlan) {
            await notifyPlanUpgraded(business, user, previousPlan, newPlan);
            
            // Create or update subscription record
            await supabase
              .from('subscriptions')
              .upsert({
                business_id: business.id,
                user_id: business.owner_user_id,
                stripe_subscription_id: subscription.id,
                stripe_customer_id: subscription.customer,
                plan_type: newPlan,
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
