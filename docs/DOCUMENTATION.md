# 📚 Pacific Market Documentation

## 🎯 **Project Overview**

**Pacific Market** is the first global structured registry of Pacific-owned businesses. The platform provides a searchable database that helps people discover, connect with, and support Pacific enterprises worldwide.

### **Key Statistics (Current)**
- **36 Active Businesses** registered
- **7 Countries** represented  
- **22 Industry Categories** covered
- **2 Verified Business Profiles**
- **1 Pending Claim Request**
- **Full Stripe Integration** for subscription tiers
- **Email Authentication** with Supabase redirects

---

## 🛠 **Technology Stack**

### **Frontend**
- **Framework**: Next.js 16.1.6 (React 18)
- **Styling**: TailwindCSS with custom design system
- **UI Components**: Radix UI + shadcn/ui components
- **Icons**: Lucide React
- **State Management**: React Hooks + TanStack Query
- **Forms**: React Hook Form + Zod validation

### **Backend & Database**
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **API**: RESTful endpoints via Supabase

### **Payment & Email**
- **Payments**: Stripe (subscription tiers)
- **Email**: Resend (transactional emails)
- **Deployment**: Netlify (static hosting)

---

## 🚀 **Deployment & Environment**

### **Environment Variables**
```env
# App URLs
NEXT_PUBLIC_APP_PROD_URL=https://pacificmarket.co.nz

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://[project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon_key]
SUPABASE_SERVICE_ROLE_KEY=[service_role_key]
SUPABASE_CONNECTION_STRING=postgresql://[connection_string]
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=public

# Stripe Configuration
STRIPE_SECRET_KEY=[secret_key]
STRIPE_WEBHOOK_SECRET=[webhook_secret]
STRIPE_WEBHOOK_URL_ENDPOINT=https://pacificmarket.co.nz/.netlify/functions/stripe-webhook
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=[publishable_key]
STRIPE_PRICE_ID_MANA_NZD=[price_id]
STRIPE_PRICE_ID_MANA_AUD=[price_id]
STRIPE_PRICE_ID_MANA_USD=[price_id]
STRIPE_PRICE_ID_MOANA_NZD=[price_id]
STRIPE_PRICE_ID_MOANA_AUD=[price_id]
STRIPE_PRICE_ID_MOANA_USD=[price_id]

# Email (Resend)
RESEND_API_KEY=[api_key]
RESEND_FROM_EMAIL=admin@pacificmarket.co.nz
```

### **Supabase Dashboard Configuration**
- **Site URL**: `https://pacificmarket.co.nz`
- **Redirect URLs**: `https://pacificmarket.co.nz/*`

---

## 💳 **Stripe Integration**

### **Subscription Tiers**
- **Mana Tier**: $4.99/month - Verified business with enhanced profile
- **Moana Tier**: $29.00/month - Premium tier with business tools

### **Multi-Currency Support**
- **NZD**: Primary currency for New Zealand customers
- **AUD**: Australian customers
- **USD**: International customers

### **Key Features**
- **Secure Checkout**: Stripe-hosted payment pages
- **Subscription Management**: Automatic billing and renewals
- **Webhook Integration**: Real-time subscription status updates
- **Customer Portal**: Self-service subscription management

---

## 🔄 **Recent Improvements (March 2026)**

### **Authentication & Navigation Updates**
- **Fixed Supabase email redirects** - All confirmation emails now redirect to `https://pacificmarket.co.nz`
- **Updated Next.js navigation** - Replaced all `window.location.href` with proper `router.push()`
- **Cleaned up environment variables** - Removed unused Supabase redirect URLs

### **Files Updated**
- `src/screens/BusinessLogin.jsx` - Fixed email redirect URL
- `src/app/customer-portal/page.jsx` - Fixed magic link redirects
- `src/hooks/useStripeCheckout.js` - Updated Stripe redirect URLs
- `src/app/api/stripe/checkout/route.js` - Fixed API redirect URLs
- `src/app/api/emails/owner-invite/route.js` - Updated email invitation links
- All navigation components - Migrated to Next.js router

---

## 🏗️ **Architecture Overview**

### **Shared Query System**
All business data access uses centralized query functions:
- `src/lib/supabase/queries/businesses.ts` - Standardized database queries
- `src/lib/business/helpers.ts` - Business logic and display helpers
- `src/types/business.ts` - TypeScript type definitions

### **Key Components**
- **BusinessAvatar.jsx** - Business logos with verification badges
- **BusinessBadgeGroup.jsx** - Status and tier badges
- **BusinessContactLinks.jsx** - Contact information display

---

## 📊 **Database Schema**

### **Core Tables**
- **businesses** - Business information and profiles
- **profiles** - User account information
- **claim_requests** - Business ownership claims
- **business_insights_snapshots** - Analytics data
- **subscription_tiers** - Stripe subscription management

### **Backup & Maintenance**
- **Full Database Dump**: `database/full_dump_20260312_230301.sql`
- **Regular Backups**: Automated via Supabase

---

## 🛠 **Development Guidelines**

### **Code Standards**
- **Language**: JavaScript/TypeScript hybrid
- **Styling**: TailwindCSS utility classes
- **Components**: Functional components with hooks
- **State**: Local state with useState, global state with React Query

### **File Naming Conventions**
- **Components**: PascalCase (e.g., `BusinessCard.jsx`)
- **Utilities**: camelCase (e.g., `formatDate.js`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `BUSINESS_STATUS.js`)
- **Pages**: kebab-case (e.g., `business-portal.jsx`)

---

## 🚨 **Troubleshooting**

### **Common Issues**
1. **Supabase Connection** - Check environment variables and dashboard settings
2. **Stripe Integration** - Verify webhook endpoints and price IDs
3. **Email Redirects** - Ensure Supabase dashboard has correct redirect URLs
4. **Build Issues** - Clear `.next` folder and reinstall dependencies

### **Debugging Tips**
- Check browser console for JavaScript errors
- Use Network tab for API request failures
- Verify environment variables in deployment settings
- Test Stripe webhooks with CLI tools

---

## 📝 **Setup Instructions**

### **Local Development**
1. Clone repository and navigate to project directory
2. Install dependencies: `npm install`
3. Create `.env.local` with required environment variables
4. Run development server: `npm run dev`

### **Production Deployment**
- **Platform**: Netlify
- **Build Command**: `npm run build`
- **Environment Variables**: Configure in Netlify dashboard
- **Domain**: https://pacificmarket.co.nz

---

## 🔗 **Quick Links**

**For New Developers:**
1. Start with [README.md](../README.md) for setup
2. Review this document for full overview
3. Check [STRIPE_SETUP.md](./STRIPE_SETUP.md) for payment integration

**For Current Development:**
1. Reference shared query system in `src/lib/supabase/queries/`
2. Use business helpers in `src/lib/business/helpers.ts`
3. Follow component patterns in `src/components/`

**For Database & Analytics:**
1. Use full database dump for schema reference
2. Check Supabase dashboard for real-time data
3. Monitor Stripe dashboard for subscription activity
