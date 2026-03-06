const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

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
        
        // Downgrade to basic tier
        await downgradeBusinessToBasic(deletedSubscription);
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
  // This would update your database with the new subscription tier
  const metadata = subscription.metadata;
  const tier = metadata.tier;
  const userId = metadata.user_id;
  const businessId = metadata.business_id;

  console.log(`Updating user ${userId} business ${businessId} to tier ${tier}`);
  
  // TODO: Update your database here
  // Example: Update businesses table subscription_tier field
  // Note: New tier system uses vaka/mana/moana instead of basic/verified/featured_plus
  // await updateBusinessTier(businessId, tier);
}

async function downgradeBusinessToBasic(subscription) {
  const metadata = subscription.metadata;
  const userId = metadata.user_id;
  const businessId = metadata.business_id;

  console.log(`Downgrading user ${userId} business ${businessId} to vaka`);
  
  // TODO: Update your database to vaka tier (new basic)
  // Note: New tier system uses 'vaka' instead of 'basic'
  // await updateBusinessTier(businessId, 'vaka');
}
