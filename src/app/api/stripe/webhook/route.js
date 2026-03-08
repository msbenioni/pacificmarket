import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { notifyPlanUpgraded } from "@/lib/notifications";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

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
        
        // Get business and user info
        const { data: business } = await supabase
          .from('businesses')
          .select('*')
          .eq('stripe_customer_id', session.customer)
          .single();
          
        const { data: user } = await supabase
          .from('users')
          .select('*')
          .eq('id', business.user_id)
          .single();
        
        if (business && user) {
          // Determine plan from session metadata
          const newPlan = session.metadata?.plan || 'premium';
          const previousPlan = business.listing_tier || 'basic';
          
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
            // Update subscription status
            await supabase
              .from('businesses')
              .update({
                subscription_status: 'active',
                subscription_period_end: new Date(subscription.current_period_end * 1000).toISOString()
              })
              .eq('id', business.id);
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
          .from('users')
          .select('*')
          .eq('id', business.user_id)
          .single();
        
        if (business && user) {
          // Map price to plan
          const planMap = {
            'price_basic': 'basic',
            'price_premium': 'premium',
            'price_enterprise': 'enterprise'
          };
          
          const newPlan = planMap[subscription.items.data[0]?.price?.lookup_key] || 'basic';
          const previousPlan = business.listing_tier || 'basic';
          
          // Send notification if plan changed
          if (newPlan !== previousPlan) {
            await notifyPlanUpgraded(business, user, previousPlan, newPlan);
            
            // Update business plan
            await supabase
              .from('businesses')
              .update({ listing_tier: newPlan })
              .eq('id', business.id);
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
          // Downgrade to basic plan
          await supabase
            .from('businesses')
            .update({
              listing_tier: 'basic',
              subscription_status: 'cancelled',
              stripe_customer_id: null
            })
            .eq('id', business.id);
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
