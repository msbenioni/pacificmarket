# 🚀 Pacific Market Setup Guide

## 📋 **Prerequisites**

- Node.js 18+ installed
- Git installed
- Supabase account and project
- Stripe account (for payments)
- Resend account (for emails)

## 🛠 **Local Development Setup**

### **1. Clone Repository**
```bash
git clone [repository-url]
cd pacific-market
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Environment Variables**
Create `.env.local` file with:

```env
# App URLs
NEXT_PUBLIC_APP_PROD_URL=https://pacificmarket.co.nz

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_CONNECTION_STRING=postgresql://connection-string
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=public

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...  # Use test keys for development
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_WEBHOOK_URL_ENDPOINT=http://localhost:3000/api/stripe/webhook

# Stripe Price IDs (create in Stripe Dashboard)
STRIPE_PRICE_ID_MANA_NZD=price_...
STRIPE_PRICE_ID_MANA_AUD=price_...
STRIPE_PRICE_ID_MANA_USD=price_...
STRIPE_PRICE_ID_MOANA_NZD=price_...
STRIPE_PRICE_ID_MOANA_AUD=price_...
STRIPE_PRICE_ID_MOANA_USD=price_...

# Email (Resend)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=admin@pacificmarket.co.nz
```

### **4. Run Development Server**
```bash
npm run dev
```
Visit `http://localhost:3000`

---

## 💳 **Stripe Setup**

### **1. Create Products**
In Stripe Dashboard → Products:

#### **Mana Product**
- **Name**: "Pacific Market Mana"
- **Description**: "Verified business tier with logo, banner, and enhanced profile"
- **Price**: $4.99 NZD/month (and AUD/USD equivalents)
- **Recurring**: Monthly

#### **Moana Product**
- **Name**: "Pacific Market Moana"
- **Description**: "Premium tier with all features plus business tools"
- **Price**: $29.00 NZD/month (and AUD/USD equivalents)
- **Recurring**: Monthly

### **2. Configure Webhooks**
Create webhook endpoint: `http://localhost:3000/api/stripe/webhook`

**Events to listen for:**
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

---

## 🔧 **Supabase Setup**

### **1. Authentication Settings**
In Supabase Dashboard → Authentication → Settings:
- **Site URL**: `http://localhost:3000` (development) or `https://pacificmarket.co.nz` (production)
- **Redirect URLs**: `http://localhost:3000/*` (development) or `https://pacificmarket.co.nz/*` (production)

### **2. Database Tables**
Core tables are automatically created. Key tables:
- `businesses` - Business information
- `profiles` - User accounts
- `claim_requests` - Business ownership claims
- `business_insights_snapshots` - Analytics data

### **3. Storage**
Create public storage bucket named `public` for business logos and files.

---

## 📧 **Email Setup (Resend)**

### **1. Verify Domain**
- Add `pacificmarket.co.nz` to your Resend account
- Verify DNS records (TXT, MX, CNAME)

### **2. Configure From Email**
- Use `admin@pacificmarket.co.nz` as verified sender
- Update `RESEND_FROM_EMAIL` in environment variables

---

## 🚀 **Production Deployment**

### **1. Netlify Setup**
1. Connect repository to Netlify
2. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
3. Add environment variables (use production values)

### **2. Update Production URLs**
- **Supabase Dashboard**: Update Site URL to `https://pacificmarket.co.nz`
- **Stripe Webhooks**: Update endpoint to `https://pacificmarket.co.nz/.netlify/functions/stripe-webhook`

### **3. DNS Configuration**
Point domain to Netlify:
```
A record: pacificmarket.co.nz → Netlify IP
CNAME: www → netlify.net
```

---

## 🧪 **Testing**

### **Development Testing**
```bash
# Test with Stripe test cards
Card Number: 4242 4242 4242 4242
Expiry: Any future date
CVC: Any 3 digits
ZIP: Any 5 digits
```

### **Email Testing**
- Test email confirmation flows
- Verify business claim emails
- Test Stripe invoice emails

---

## 🚨 **Common Issues**

### **Supabase Connection**
```bash
# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### **Build Issues**
```bash
# Clean build
rm -rf .next
npm run build
```

### **Stripe Webhooks**
- Use Stripe CLI for local testing: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
- Verify webhook signing secret matches environment variable

---

## 📚 **Useful Resources**

- **Main Documentation**: [DOCUMENTATION.md](./DOCUMENTATION.md)
- **Stripe Dashboard**: https://dashboard.stripe.com
- **Supabase Dashboard**: https://app.supabase.com
- **Resend Dashboard**: https://resend.com
- **Netlify Dashboard**: https://app.netlify.com

---

## 🔄 **Environment Switching**

### **Development (.env.local)**
```env
NEXT_PUBLIC_APP_PROD_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_...
```

### **Production (Netlify Environment Variables)**
```env
NEXT_PUBLIC_APP_PROD_URL=https://pacificmarket.co.nz
STRIPE_SECRET_KEY=sk_live_...
```

---

## 🎯 **Next Steps**

1. **Complete local setup** and verify all services work
2. **Test user registration** and email confirmation
3. **Test Stripe checkout** with test cards
4. **Deploy to staging** for final testing
5. **Deploy to production** and monitor closely
