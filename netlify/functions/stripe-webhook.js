const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.handler = async (event, context) => {
  const sig = event.headers['stripe-signature'];
  let webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  try {
    const eventObj = stripe.webhooks.constructEvent(event.body, sig, webhookSecret);

    switch (eventObj.type) {
      case 'customer.subscription.created':
        const subscription = eventObj.data.object;
        console.log('Subscription created:', subscription.id);
        
        // Update business subscription tier in database
        await updateBusinessSubscription(subscription);
        break;

      case 'customer.subscription.updated':
        const updatedSubscription = eventObj.data.object;
        console.log('Subscription updated:', updatedSubscription.id);
        
        // Handle subscription changes (upgrades/downgrades)
        await updateBusinessSubscription(updatedSubscription);
        break;

      case 'customer.subscription.deleted':
        const deletedSubscription = eventObj.data.object;
        console.log('Subscription deleted:', deletedSubscription.id);
        
        // Downgrade to vaka tier
        await downgradeBusinessToVaka(deletedSubscription);
        break;

      case 'invoice.payment_succeeded':
        const invoice = eventObj.data.object;
        console.log('Payment succeeded for invoice:', invoice.id);
        
        // Could send receipt email here
        break;

      case 'invoice.payment_failed':
        const failedInvoice = eventObj.data.object;
        console.log('Payment failed for invoice:', failedInvoice.id);
        
        // Could send payment failure notification here
        break;

      default:
        console.log(`Unhandled event type: ${eventObj.type}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };

  } catch (error) {
    console.error('Webhook error:', error);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

async function updateBusinessSubscription(subscription) {
  try {
    const metadata = subscription.metadata;
    const tier = metadata.tier;
    const userId = metadata.user_id;
    const businessId = metadata.business_id;

    console.log(`Updating user ${userId} business ${businessId} to tier ${tier}`);
    
    // Validate tier value (only paid tiers come through Stripe)
    const validTiers = ['mana', 'moana']; // Vaka is free, not in Stripe
    if (!validTiers.includes(tier)) {
      throw new Error(`Invalid tier: ${tier}. Only paid tiers (mana, moana) should come through Stripe.`);
    }

    // Update business subscription tier in database
    const { data, error } = await supabase
      .from('businesses')
      .update({ 
        subscription_tier: tier,
        updated_at: new Date().toISOString()
      })
      .eq('id', businessId);

    if (error) {
      console.error('Database update error:', error);
      throw error;
    }

    console.log(`Successfully updated business ${businessId} to tier ${tier}`);
    return data;

  } catch (error) {
    console.error('Error updating business subscription:', error);
    throw error;
  }
}

async function downgradeBusinessToVaka(subscription) {
  try {
    const metadata = subscription.metadata;
    const userId = metadata.user_id;
    const businessId = metadata.business_id;

    console.log(`Downgrading user ${userId} business ${businessId} to vaka`);
    
    // Update business to vaka tier
    const { data, error } = await supabase
      .from('businesses')
      .update({ 
        subscription_tier: 'vaka',
        updated_at: new Date().toISOString()
      })
      .eq('id', businessId);

    if (error) {
      console.error('Database downgrade error:', error);
      throw error;
    }

    console.log(`Successfully downgraded business ${businessId} to vaka tier`);
    return data;

  } catch (error) {
    console.error('Error downgrading business subscription:', error);
    throw error;
  }
}
