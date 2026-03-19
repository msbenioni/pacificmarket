# 🗄️ Database Documentation

> **📅 Last Updated:** March 2026  
> **🎯 Current State:** Optimized database architecture for Pacific Discovery Network

---

## 📋 **Table of Contents**

1. [Database Architecture](#database-architecture)
2. [Tables Overview](#tables-overview)
3. [Field Mappings](#field-mappings)
4. [Relationships](#relationships)
5. [Security](#security)
6. [Migrations](#migrations)

---

## 🏗️ **Database Architecture**

### **✅ Core Structure**

The Pacific Discovery Network platform uses a clean, optimized database architecture:

```
┌─────────────────┐  ┌──────────────────┐  ┌─────────────────────┐
│    businesses    │  │ business_insights│  │  founder_insights   │
│   (Public Data)  │  │ (Internal Data)  │  │  (Founder Data)     │
└─────────────────┘  └──────────────────┘  └─────────────────────┘
         │                     │                       │
         └─────────────────────┼───────────────────────┘
                               │
                    ┌─────────────────┐
                    │     profiles    │
                    │   (User Data)   │
                    └─────────────────┘
```

### **✅ Data Separation Principles**

- **Public Data** (`businesses`) - Customer-facing, searchable business information
- **Internal Data** (`business_insights`) - Business intelligence and tracking
- **Founder Data** (`founder_insights`) - Personal founder information and insights

---

## 📊 **Tables Overview**

### **🏢 Businesses Table**

**Purpose:** Public business data displayed on Insights/Registry pages  
**Fields:** 25 total

| Category | Fields | Count |
|----------|--------|-------|
| **Core Identity** | business_name, business_handle, tagline, description, role | 5 |
| **Visual Assets** | logo_url, banner_url, mobile_banner_url | 3 |
| **Contact Info** | business_email, business_phone, business_website, business_hours, business_contact_person | 5 |
| **Location** | address, suburb, city, state_region, postal_code, country, industry | 7 |
| **Business Details** | year_started, business_structure, team_size_band, revenue_band, is_business_registered | 5 |
| **Status** | status, is_verified, is_claimed, is_homepage_featured | 4 |
| **System** | owner_user_id, created_by, source, profile_completeness, referral_code | 5 |

### **📈 Business Insights Table**

**Purpose:** Internal business tracking data (not public)  
**Fields:** 5 total

| Category | Fields | Count |
|----------|--------|-------|
| **Business Stage** | business_stage | 1 |
| **Challenges** | top_challenges_array | 1 |
| **Registration** | is_business_registered | 1 |
| **Private Contact** | private_business_phone, private_business_email | 2 |

### **👤 Founder Insights Table**

**Purpose:** Founder-specific personal data and insights  
**Fields:** 25+ total

| Category | Fields | Count |
|----------|--------|-------|
| **Personal Info** | gender, age_range, years_entrepreneurial | 3 |
| **Business Info** | businesses_founded, founder_role, founder_story | 3 |
| **Pacific Identity** | pacific_identity, serves_pacific_communities | 2 |
| **Cultural Impact** | culture_influences_business, culture_influence_details | 2 |
| **Support** | mentorship_access, mentorship_offering, collaboration_interest | 3 |
| **Investment** | angel_investor_interest, investor_capacity | 2 |
| **Goals** | goals_details, goals_next_12_months_array | 2 |
| **System** | user_id, snapshot_year, submitted_date | 3 |

---

## 🔗 **Field Mappings**

### **✅ Form to Database Mapping**

| Form Section | Target Table | Fields |
|--------------|--------------|--------|
| **CoreInfo** | businesses | business_name, business_handle, tagline, description, role |
| **ContactDetails** | businesses | business_contact_person, business_email, business_phone, business_website, business_hours |
| **Location** | businesses | address, suburb, city, state_region, postal_code, country, industry |
| **BrandMedia** | businesses | logo_url, banner_url, mobile_banner_url |
| **BusinessOverview** | businesses + business_insights | year_started, business_structure, team_size_band, revenue_band, is_business_registered, business_stage |
| **Challenges** | business_insights | top_challenges_array |
| **Community** | founder_insights | collaboration_interest, mentorship_offering, open_to_future_contact |

### **✅ Data Flow**

```javascript
// Form Data Transformation
const { businessesData, businessInsightsData } = transformBusinessFormData(formData);

// Parallel Saves
await Promise.all([
  saveBusinessData(businessesData),
  saveBusinessInsightsData(businessInsightsData)
]);

// Data Loading (Merged)
const business = await getBusinessById(id);
// Returns: { ...businessesData, ...insightsData }
```

---

## 🔐 **Security**

### **✅ Row-Level Security (RLS)**

All tables have RLS policies implemented:

#### **Businesses Table**
- **Public Read** - Anyone can read active businesses
- **Owner Write** - Only business owners can update their businesses
- **Admin All** - Admins have full access

#### **Business Insights Table**
- **Owner Read/Write** - Only business owners can access insights
- **Admin All** - Admins have full access

#### **Founder Insights Table**
- **User Read/Write** - Users can only access their own insights
- **Admin All** - Admins have full access

### **✅ Data Privacy**

- **Public Fields** - Only customer-safe data exposed in public queries
- **Private Fields** - Sensitive data restricted to owners/admins
- **Field Validation** - Server-side validation for all inputs
- **Data Sanitization** - Empty values filtered before database operations

---

## 🔄 **Relationships**

### **✅ Foreign Key Relationships**

```
profiles (user_id) ────┐
                        ├─── businesses (owner_user_id)
                        └─── founder_insights (user_id)

businesses (id) ──── business_insights (business_id)
```

### **✅ Data Integrity**

- **Cascade Deletes** - User deletion removes associated business data
- **Unique Constraints** - One business insight per business per year
- **Referential Integrity** - All foreign keys properly constrained

---

## 📝 **Migrations**

### **✅ Recent Migrations**

1. **Form Consolidation** - Removed 11 unnecessary fields from business_insights
2. **Duplicate Removal** - Eliminated duplicate fields across tables
3. **Schema Optimization** - Streamlined table structures for better performance

### **✅ Migration Scripts**

All migration scripts are stored in `/database/migrations/`:

```
database/
├── migrations/
│   ├── 001_add_business_operations_fields.sql
│   ├── 004_add_revenue_band.sql
│   └── add_mobile_banner_url.sql
├── remove_unwanted_business_fields.sql (completed)
├── remove_duplicate_fields_from_insights.sql (completed)
├── remove_duplicate_location_fields.sql (completed)
└── remove_unnecessary_insights_fields.sql (completed)
```

---

## 🚀 **Performance**

### **✅ Query Optimization**

- **Field Selection** - Only query necessary fields
- **Indexing Strategy** - Proper indexes on frequently queried columns
- **Query Merging** - Efficient joins and data merging
- **Caching** - Query result caching for better performance

### **✅ Indexes**

```sql
-- Businesses Table
CREATE INDEX idx_businesses_status ON businesses(status);
CREATE INDEX idx_businesses_owner ON businesses(owner_user_id);
CREATE INDEX idx_businesses_handle ON businesses(business_handle);
CREATE INDEX idx_businesses_industry ON businesses(industry);
CREATE INDEX idx_businesses_country ON businesses(country);

-- Business Insights Table
CREATE INDEX idx_business_insights_business_id ON business_insights(business_id);
CREATE INDEX idx_business_insights_year ON business_insights(snapshot_year);

-- Founder Insights Table
CREATE INDEX idx_founder_insights_user_id ON founder_insights(user_id);
CREATE INDEX idx_founder_insights_year ON founder_insights(snapshot_year);
```

---

## 📊 **Current Schema Summary**

### **✅ Total Fields:**
- **Businesses:** 25 fields (public data)
- **Business Insights:** 5 fields (internal tracking)
- **Founder Insights:** 25+ fields (founder data)
- **Total:** ~55 fields across 3 tables

### **✅ Data Volume:**
- **Optimized for performance** with minimal redundant data
- **Clean separation** of public vs private information
- **Efficient queries** with proper indexing
- **Scalable architecture** for future growth

---

## 🛠️ **Database Maintenance**

### **✅ Regular Tasks**
- **Query Performance Monitoring** - Slow query analysis
- **Index Optimization** - Add/remove indexes as needed
- **Data Cleanup** - Remove orphaned or invalid data
- **Backup Verification** - Regular backup testing

### **✅ Monitoring**
- **Query Performance** - Track slow queries
- **Data Growth** - Monitor table sizes
- **User Activity** - Track access patterns
- **Error Rates** - Monitor database errors

---

## 📞 **Database Support**

### **✅ Getting Help**
- Review this documentation for schema questions
- Check migration scripts for schema changes
- Consult the development team for complex queries
- Use the database README for setup instructions

### **✅ Making Changes**
1. Create a migration script
2. Test in development environment
3. Update documentation
4. Submit for review
5. Deploy to production

---

**This database documentation reflects the current optimized state of the Pacific Market platform.** 🎯
