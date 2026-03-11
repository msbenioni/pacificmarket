# Stripe Integration Setup Guide

## Overview
Pacific Market now has full Stripe checkout integration for subscription upgrades. Users can upgrade to "Mana" ($4.99/month) or "Moana" ($29/month) tiers directly from the pricing page or business portal.

## Environment Variables

Add these to your `.env.local` file:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...  # Your Stripe secret key
STRIPE_PUBLISHABLE_KEY=pk_test_...  # Your Stripe publishable key

# Stripe Price IDs (create these in Stripe Dashboard)
STRIPE_PRICE_MANA=price_...  # $4.99/month Mana tier
STRIPE_PRICE_MOANA=price_...  # $29/month Moana tier

# Existing URLs
NEXT_PUBLIC_APP_DEV_URL=http://localhost:3000
NEXT_PUBLIC_APP_PROD_URL=https://pacificmarket.co.nz
```

## Stripe Dashboard Setup

### 1. Create Products

1. Go to Stripe Dashboard → Products
2. Create two products:

#### Mana Product
- **Name**: "Pacific Market Mana"
- **Description**: "Verified business tier with logo, banner, and enhanced profile"
- **Price**: $9.00 USD/month
- **Recurring**: Monthly

#### Moana Product  
- **Name**: "Pacific Market Moana"
- **Description**: "Premium tier with all features plus business tools"
- **Price**: $29.00 USD/month
- **Recurring**: Monthly

### 2. Get Price IDs

After creating products, copy the Price IDs:
- `price_...` for Mana tier
- `price_...` for Moana tier

Add these to your environment variables as `STRIPE_PRICE_MANA` and `STRIPE_PRICE_MOANA`.

### 3. Configure Webhooks (Optional but Recommended)

#### For Netlify Deployment:
Create a webhook endpoint at: `https://your-domain.netlify.app/.netlify/functions/stripe-webhook`

#### For Vercel/Next.js Deployment:
Create a webhook endpoint at: `https://your-domain.com/api/stripe/webhook`

#### Events to listen for:
- `customer.subscription.created`
- `customer.subscription.updated` 
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

#### Webhook Secret:
After creating the webhook, copy the webhook signing secret and add to your environment variables:
```bash
STRIPE_WEBHOOK_SECRET=whsec_...  # Webhook signing secret
```

## How It Works

### 1. User Flow
1. User clicks "Upgrade Now" or "Go Featured+"
2. System creates Stripe checkout session
3. User is redirected to Stripe secure payment page
4. After payment, user returns to business portal
5. Subscription is activated in your database

### 2. Checkout Session Creation

The `/api/stripe/checkout` route:
- Validates user authentication
- Creates/retrieves Stripe customer
- Creates checkout session with metadata
- Returns Stripe checkout URL

### 3. Metadata Tracking

Each subscription includes metadata:
- `tier`: "mana" or "moana"
- `user_id`: Supabase user ID
- `business_id`: Business being upgraded (if applicable)
- `customer_email`: User's email

## Files Created/Updated

### New Files
- `src/hooks/useStripeCheckout.js` - Custom hook for checkout
- `src/app/api/stripe/checkout/route.js` - Stripe checkout API
- `netlify/functions/stripe-webhook.js` - Netlify webhook handler
- `STRIPE_SETUP.md` - This setup guide

### Updated Files
- `src/screens/Pricing.jsx` - Added Stripe checkout buttons
- `src/screens/BusinessPortal.jsx` - Added upgrade buttons

## Testing

### Development Testing
1. Use Stripe test keys (sk_test_*)
2. Test with Stripe test cards:
   - Card Number: 4242 4242 4242 4242
   - Expiry: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits

### Production Testing
1. Switch to live keys (sk_live_*)
2. Test with real payment methods
3. Monitor Stripe Dashboard for subscriptions

## Security Notes

- Never expose `STRIPE_SECRET_KEY` in frontend code
- Use environment variables for all sensitive data
- Validate webhook signatures in production
- Implement proper error handling for failed payments

## Troubleshooting

### Common Issues
1. **"Invalid tier specified"** - Check environment variables for price IDs
2. **"User not authenticated"** - Ensure user is logged in before checkout
3. **"No checkout URL returned"** - Check Stripe API key and price configuration

### Debug Mode
Add console logging to `/api/stripe/checkout/route.js` to debug issues.

## Next Steps

1. Set up Stripe webhook handlers for subscription management
2. Implement subscription status updates in your database
3. Add subscription management UI for users to cancel/change plans
4. Set up billing notifications and dunning emails

## Support

For Stripe-specific issues:
- Stripe Dashboard: https://dashboard.stripe.com
- Stripe Documentation: https://stripe.com/docs
- Pacific Market Code: Check the implemented files above
