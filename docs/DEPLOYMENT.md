# 🚀 Deployment Guide

> **📅 Last Updated:** March 2026  
> **🎯 Platform:** Pacific Discovery Network

---

## 📋 **Table of Contents**

1. [Environment Setup](#environment-setup)
2. [Production Deployment](#production-deployment)
3. [Database Migrations](#database-migrations)
4. [Environment Variables](#environment-variables)
5. [Domain Configuration](#domain-configuration)

---

## 🌍 **Environment Setup**

### **Development Environment**

```bash
# Clone repository
git clone [repository-url]
cd pacific-market

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

### **Required Services**

- **Supabase** - Database and authentication
- **Stripe** - Payment processing
- **Google Workspace** - Email services
- **Netlify** - Hosting (or Vercel)

---

## 🚀 **Production Deployment**

### **Netlify Deployment**

1. **Connect Repository**
   - Link your Git repository to Netlify
   - Configure build settings

2. **Build Configuration**
   ```
   Build command: npm run build
   Publish directory: .next
   Node version: 18
   ```

3. **Environment Variables**
   - Add all production environment variables
   - Ensure `NEXT_PUBLIC_APP_PROD_URL` is set correctly

### **Vercel Alternative**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

---

## 🗄️ **Database Migrations**

### **Running Migrations**

```bash
# Using PowerShell script
.\check_and_fix_migration.ps1

# Or manual SQL execution
# Run migration files in Supabase SQL Editor
```

### **Migration Files Location**
- `database/migrations/` - Database schema changes
- `migrations/` - Application-level migrations

### **Common Migration Tasks**

```sql
-- Add new columns
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS mobile_banner_url TEXT;

-- Update views
DROP VIEW IF EXISTS public_businesses;
CREATE VIEW public_businesses AS SELECT ...;

-- Grant permissions
GRANT SELECT ON public_businesses TO authenticated;
```

---

## 🔧 **Environment Variables**

### **Core Configuration**

```bash
# Application
NEXT_PUBLIC_APP_PROD_URL=https://pacificdiscoverynetwork.com

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_CONNECTION_STRING=postgresql://connection-string
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=public

# Google Workspace SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=jasmin@pacificdiscoverynetwork.com
SMTP_PASS=your-app-password
SMTP_FROM_NAME=Pacific Discovery Network
SMTP_FROM_EMAIL=hello@pacificdiscoverynetwork.com

# Stripe
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Subscription Plans
STRIPE_PRICE_ID_MANA_NZD=price_...
STRIPE_PRICE_ID_MOANA_NZD=price_...
```

---

## 🌐 **Domain Configuration**

### **DNS Settings**

```
A record: pacificdiscoverynetwork.com → Netlify IP
CNAME: www → netlify.net
```

### **Supabase Configuration**

- **Site URL**: `https://pacificdiscoverynetwork.com`
- **Redirect URLs**: `https://pacificdiscoverynetwork.com/*`
- **Email SMTP**: Configure with Google Workspace

### **Stripe Webhooks**

- **Endpoint**: `https://pacificdiscoverynetwork.com/.netlify/functions/stripe-webhook`
- **Events**: 
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`

---

## 🔍 **Health Checks**

### **Post-Deployment Checklist**

- [ ] Database connectivity
- [ ] Authentication flow
- [ ] Email sending (test with Google Workspace)
- [ ] Stripe checkout functionality
- [ ] Business search and discovery
- [ ] Mobile responsiveness

### **Monitoring**

- **Netlify Analytics** - Site performance
- **Supabase Logs** - Database and auth issues
- **Stripe Dashboard** - Payment monitoring
- **Google Workspace** - Email delivery status

---

## 🚨 **Troubleshooting**

### **Common Issues**

**Build Failures**
```bash
# Clean build
rm -rf .next
npm run build
```

**Database Connection**
- Verify Supabase credentials
- Check connection string format
- Ensure RLS policies are correctly configured

**Email Issues**
- Verify Google Workspace SMTP settings
- Check app password configuration
- Test with different email addresses

**Payment Issues**
- Verify Stripe webhook endpoints
- Check webhook signing secrets
- Test with Stripe CLI for local development

---

## 📞 **Support**

For deployment issues:
- **Email**: `contact@pacificdiscoverynetwork.com`
- **Documentation**: Check individual service documentation
- **Emergency**: Review Netlify build logs and Supabase error logs

---

*Last updated: March 2026*
