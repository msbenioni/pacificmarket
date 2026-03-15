# 📚 Pacific Market Documentation

> **📅 Last Updated:** March 2026  
> **🎯 Current State:** Form consolidation complete, database optimized

---

## 📋 **Documentation Index**

### **🎯 Core Documentation**
- [**ARCHITECTURE.md**](./ARCHITECTURE.md) - Complete project architecture and data flow
- [**SETUP.md**](./SETUP.md) - Development and deployment setup guide
- [**DATABASE.md**](./DATABASE.md) - Database schema and field mappings
- [**FORMS.md**](./FORMS.md) - Form structure and field mappings

### **🔧 Development Guides**
- [**SHARED_PATTERNS.md**](./SHARED_PATTERNS.md) - Shared utilities and patterns
- [**STRIPE_SETUP.md**](./STRIPE_SETUP.md) - Stripe payment integration setup

### **📊 Reference Documentation**
- [**FIELD_MAPPING.md**](./FIELD_MAPPING.md) - Complete field mapping reference
- [**VISIBLE_FIELDS.md**](./VISIBLE_FIELDS.md) - Public profile visible fields

---

## 🗂️ **Project Overview**

### **✅ Current Architecture**

The Pacific Market platform uses a **3-table architecture** for business data:

- **`businesses` table** - Public business data (25 fields)
- **`business_insights` table** - Internal business tracking (5 fields)
- **`founder_insights` table** - Founder-specific data (25+ fields)

### **✅ Recent Consolidation**

**Form consolidation complete:**
- ✅ Removed 11 unnecessary fields from business_insights
- ✅ Eliminated duplicate fields across tables
- ✅ Streamlined form sections and UI components
- ✅ Optimized database queries and data flow
- ✅ Cleaned up documentation and codebase

### **✅ Key Features**

- **Business Profiles** - Public business directory with search and filtering
- **Business Management** - Owner portal for managing business information
- **Founder Insights** - Internal tracking of business growth and challenges
- **Payment Integration** - Stripe integration for subscription tiers
- **Admin Dashboard** - Business approval and management tools

---

## 🚀 **Getting Started**

### **1. Quick Setup**
```bash
# Clone the repository
git clone <repository-url>
cd pacific-market

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Run the development server
npm run dev
```

### **2. Database Setup**
See [**DATABASE.md**](./DATABASE.md) for complete database setup instructions.

### **3. Development Workflow**
See [**SHARED_PATTERNS.md**](./SHARED_PATTERNS.md) for development patterns and utilities.

---

## 📊 **Data Architecture**

### **Businesses Table (Public Data)**
- **Core Identity:** name, business_handle, tagline, description
- **Visual Assets:** logo_url, banner_url, mobile_banner_url
- **Contact Info:** contact_email, contact_phone, contact_website, business_hours
- **Location:** country, industry, city
- **Business Details:** year_started, business_structure, team_size_band, revenue_band
- **Registration:** business_registered
- **Status:** status, is_verified, is_claimed, is_homepage_featured

### **Business Insights Table (Internal Data)**
- **Business Stage:** business_stage
- **Challenges:** top_challenges_array
- **Registration:** is_business_registered
- **Private Contact:** private_business_phone, private_business_email

### **Data Flow**
```
Form Input → transformBusinessFormData() → {businessesData, businessInsightsData}
                                                    ↓
                                          Parallel saves to both tables
                                                    ↓
                                          getBusinessById() merges data
                                                    ↓
                                              Form populated with merged data
```

---

## 🎯 **Form Structure**

### **BusinessProfileForm Sections**
- **CoreInfo** - Business name, handle, description
- **BrandMedia** - Logo and banner images
- **Location** - Country, city, industry
- **Overview** - Year started, structure, team size, revenue, registration
- **Financial** - Financial challenges (simplified)
- **Challenges** - Top business challenges
- **Growth** - Goals and import/export status
- **Community** - Collaboration and mentorship options

### **Field Mapping**
See [**FIELD_MAPPING.md**](./FIELD_MAPPING.md) for complete field-to-table mappings.

---

## 🔒 **Security & Privacy**

### **Data Protection**
- **Public vs Internal** - Clear separation of public and private data
- **RLS Policies** - Row-level security for all tables
- **Field Validation** - Server-side validation for all inputs
- **Privacy Controls** - Sensitive data not exposed in public profiles

### **Access Control**
- **Owner Access** - Business owners can manage their own businesses
- **Admin Access** - Admins can approve and manage all businesses
- **Public Access** - Read-only access to approved business profiles

---

## 📈 **Performance Optimizations**

### **Database Optimizations**
- **Field Selection** - Only query necessary fields
- **Indexing** - Proper indexes on frequently queried columns
- **Data Merging** - Efficient merge of data from multiple tables
- **Caching** - Query result caching for better performance

### **Frontend Optimizations**
- **Lazy Loading** - Components loaded on demand
- **Image Optimization** - Optimized image loading and serving
- **Form Validation** - Client-side validation with server-side verification
- **State Management** - Efficient state management with minimal re-renders

---

## 🛠️ **Development Tools**

### **Code Quality**
- **ESLint** - Code linting and formatting
- **TypeScript** - Type safety and better development experience
- **Prettier** - Code formatting
- **Husky** - Git hooks for code quality

### **Testing**
- **Unit Tests** - Component and utility testing
- **Integration Tests** - API and database testing
- **E2E Tests** - End-to-end testing for critical user flows

---

## 📞 **Support & Contributing**

### **Getting Help**
- Review the documentation in this folder
- Check the [**SHARED_PATTERNS.md**](./SHARED_PATTERNS.md) for common patterns
- Review existing issues and pull requests

### **Contributing**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Update documentation as needed
5. Submit a pull request

---

## 📝 **Documentation Maintenance**

This documentation reflects the **current state** of the Pacific Market platform. All archived and outdated documentation has been moved to the `docs/archive/` folder and is not included in this consolidated documentation set.

### **Keeping Documentation Updated**
- Update this file when major architectural changes occur
- Keep field mapping documentation in sync with database schema
- Update setup guides when deployment processes change
- Archive outdated documentation instead of deleting

---

## 🎉 **Project Status**

**✅ Complete:**
- Form consolidation and optimization
- Database schema cleanup
- Field mapping standardization
- Documentation consolidation

**🔄 In Progress:**
- Performance monitoring and optimization
- Additional feature development
- User experience improvements

**📋 Planned:**
- Enhanced analytics and reporting
- Advanced search and filtering
- Mobile app development

---

**This documentation represents the current, optimized state of the Pacific Market platform.** 🎯
