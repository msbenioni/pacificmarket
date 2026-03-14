# 📚 Pacific Market Documentation

## 📋 **Documentation Index**

### **🎯 Core Documentation**
- [**SHARED_PATTERNS.md**](./SHARED_PATTERNS.md) - Shared utilities and patterns (NEW)
- [**DOCUMENTATION.md**](./DOCUMENTATION.md) - Complete project overview and architecture
- [**SETUP.md**](./SETUP.md) - Development and deployment setup guide
- [**README.md**](../README.md) - Quick start guide

### **💳 Integration Guides**
- [**STRIPE_SETUP.md**](./STRIPE_SETUP.md) - Stripe payment integration detailed setup

### **📊 Database & Architecture**
- [**database/README.md**](../database/README.md) - Database schema and structure

### **📁 Archive (Completed Work)**
- [**archive/**](./archive/) - Completed migrations and analyses

---

## 🗂️ **Documentation Structure**

This `docs/` folder contains essential project documentation:

### **Essential Reading (All Developers)**
1. **[SHARED_PATTERNS.md](./SHARED_PATTERNS.md)** - Shared utilities and patterns ⭐
2. **[SETUP.md](./SETUP.md)** - Get the project running locally
3. **[DOCUMENTATION.md](./DOCUMENTATION.md)** - Understand the architecture
4. **[STRIPE_SETUP.md](./STRIPE_SETUP.md)** - Configure payments

### **Reference Materials**
5. **[database/README.md](../database/README.md)** - Database reference
6. **[archive/**](./archive/)** - Completed work and historical analyses

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
- Read [SHARED_PATTERNS.md](./SHARED_PATTERNS.md) for shared utilities ⭐
- Read [SETUP.md](./SETUP.md) for complete configuration
- Review [DOCUMENTATION.md](./DOCUMENTATION.md) for architecture overview
- Check [STRIPE_SETUP.md](./STRIPE_SETUP.md) for payment setup

### **3. Key Files to Understand**
- `src/utils/bannerUtils.js` - Shared banner/logo utilities ⭐
- `src/utils/businessHelpers.js` - Business display helpers ⭐
- `src/lib/supabase/queries/businesses.ts` - Database queries
- `src/utils/businessDataTransformer.js` - Data transformation utilities ⭐

---

## 🎯 **Current Project State**

### **✅ Completed Features**
- **User Authentication** - Supabase auth with email confirmation
- **Business Registry** - Searchable business database
- **Stripe Integration** - Subscription tiers (Mana $4.99, Moana $29)
- **Email System** - Resend transactional emails
- **Navigation** - Next.js router implementation
- **Shared Patterns** - Centralized utilities for media assets ⭐

### **🔧 Recent Updates (March 2026)**
- **Shared Pattern Implementation** - 27+ components using centralized utilities ⭐
- **Mobile Banner Support** - Mobile-first banner handling across platform ⭐
- **Automatic Fallbacks** - No manual error handling needed ⭐
- **Code Consolidation** - 80%+ reduction in duplicate logic ⭐
- **Documentation Reorganization** - Consolidated and archived completed work

### **📊 Current Statistics**
- 36 Active Businesses
- 7 Countries represented
- 22 Industry categories
- Full payment integration
- **27+ components** using shared patterns
- **Complete mobile banner support**

---

## 🛠 **Development Guidelines**

### **Code Standards**
- **Framework**: Next.js 16.1.6 with React 18
- **Styling**: TailwindCSS utility classes
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe
- **Email**: Resend

### **🎯 Shared Patterns (NEW)**
- **Media Assets**: Use `getLogoUrl()` and `getBannerUrl()` from `bannerUtils.js` ⭐
- **Business Display**: Use helpers from `businessHelpers.js` ⭐
- **Data Transformation**: Use utilities from `businessDataTransformer.js` ⭐
- **Database Queries**: Use shared queries from `lib/supabase/queries/businesses.ts` ⭐

### **Key Patterns**
- **Always use shared utilities** - Don't duplicate fallback logic
- **Mobile-first design** - Use `getBannerUrl()` for responsive banners
- **Consistent data handling** - Use shared transformers
- **TypeScript types** - Use types from `src/types/business.ts`

---

## 🚨 **Troubleshooting**

### **Common Issues**
1. **Supabase Connection** - Check environment variables
2. **Email Redirects** - Verify Supabase dashboard settings
3. **Stripe Integration** - Check webhook configuration
4. **Build Issues** - Clear `.next` folder
5. **Media Assets** - Use shared utilities, not manual fallbacks

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
- **Shared Utilities**: `src/utils/` ⭐

---

## 📝 **Documentation Maintenance**

This documentation is actively maintained. Remove outdated content and update with:
- New features
- Architecture changes
- Updated environment variables
- New integration requirements
- **Shared pattern updates** ⭐

**Last Updated**: March 2026
**Version**: 3.0 (Shared Patterns Integration)
