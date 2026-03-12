# 📚 Pacific Market Documentation

## 📋 **Documentation Index**

### **🎯 Core Documentation**
- [**DOCUMENTATION.md**](./DOCUMENTATION.md) - Complete project overview and architecture
- [**SETUP.md**](./SETUP.md) - Development and deployment setup guide
- [**README.md**](../README.md) - Quick start guide

### **💳 Integration Guides**
- [**STRIPE_SETUP.md**](./STRIPE_SETUP.md) - Stripe payment integration detailed setup

### **📊 Data & Analytics**
- [**SUPABASE_AUDIT_REPORT.md**](./SUPABASE_AUDIT_REPORT.md) - Database schema and analysis
- [**FOUNDER_INSIGHTS_DATA_MAPPING.md**](./FOUNDER_INSIGHTS_DATA_MAPPING.md) - Analytics data structure

---

## 🗂️ **Documentation Structure**

This `docs/` folder contains essential project documentation:

### **Essential Reading (All Developers)**
1. **[SETUP.md](./SETUP.md)** - Get the project running locally
2. **[DOCUMENTATION.md](./DOCUMENTATION.md)** - Understand the architecture
3. **[STRIPE_SETUP.md](./STRIPE_SETUP.md)** - Configure payments

### **Reference Materials**
4. **[SUPABASE_AUDIT_REPORT.md](./SUPABASE_AUDIT_REPORT.md)** - Database reference
5. **[FOUNDER_INSIGHTS_DATA_MAPPING.md](./FOUNDER_INSIGHTS_DATA_MAPPING.md)** - Analytics reference

---

## 🚀 **Quick Start for New Developers**

### **1. Setup (5 minutes)**
```bash
git clone [repository]
cd pacific-market
npm install
# Create .env.local (see SETUP.md)
npm run dev
```

### **2. Essential Reading**
- Read [SETUP.md](./SETUP.md) for complete configuration
- Review [DOCUMENTATION.md](./DOCUMENTATION.md) for architecture overview
- Check [STRIPE_SETUP.md](./STRIPE_SETUP.md) for payment setup

### **3. Key Files to Understand**
- `src/lib/supabase/queries/businesses.ts` - Database queries
- `src/lib/business/helpers.ts` - Business logic
- `src/components/` - Reusable UI components

---

## 🎯 **Current Project State**

### **✅ Completed Features**
- **User Authentication** - Supabase auth with email confirmation
- **Business Registry** - Searchable business database
- **Stripe Integration** - Subscription tiers (Mana $4.99, Moana $29)
- **Email System** - Resend transactional emails
- **Navigation** - Next.js router implementation

### **🔧 Recent Updates (March 2026)**
- Fixed email redirects to production domain
- Migrated from `window.location.href` to Next.js router
- Cleaned up environment variables
- Consolidated documentation

### **📊 Current Statistics**
- 36 Active Businesses
- 7 Countries represented
- 22 Industry categories
- Full payment integration

---

## 🛠 **Development Guidelines**

### **Code Standards**
- **Framework**: Next.js 16.1.6 with React 18
- **Styling**: TailwindCSS utility classes
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe
- **Email**: Resend

### **Key Patterns**
- Use shared queries from `src/lib/supabase/queries/`
- Import business helpers from `src/lib/business/helpers.ts`
- Follow component naming conventions (PascalCase)
- Use TypeScript types from `src/types/`

---

## 🚨 **Troubleshooting**

### **Common Issues**
1. **Supabase Connection** - Check environment variables
2. **Email Redirects** - Verify Supabase dashboard settings
3. **Stripe Integration** - Check webhook configuration
4. **Build Issues** - Clear `.next` folder

### **Debug Resources**
- Browser console for JavaScript errors
- Network tab for API failures
- Supabase dashboard for database issues
- Stripe dashboard for payment problems

---

## 📞 **Support & Resources**

### **External Services**
- **Supabase Dashboard**: https://app.supabase.com
- **Stripe Dashboard**: https://dashboard.stripe.com
- **Resend Dashboard**: https://resend.com
- **Netlify Dashboard**: https://app.netlify.com

### **Internal Resources**
- **Database Dump**: `database/full_dump_20260312_230301.sql`
- **Environment Variables**: See [SETUP.md](./SETUP.md)
- **Component Library**: `src/components/`

---

## 📝 **Documentation Maintenance**

This documentation is actively maintained. Remove outdated content and update with:
- New features
- Architecture changes
- Updated environment variables
- New integration requirements

**Last Updated**: March 2026
**Version**: 2.0 (Consolidated Documentation)
