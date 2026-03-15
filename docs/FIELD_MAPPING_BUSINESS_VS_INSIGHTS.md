# 📊 Input Fields Mapping - Businesses vs Business Insights

> **📅 Last Updated:** March 2026  
> **🎯 Purpose:** Clear breakdown of which form fields go to which database table

---

## 📋 Table of Contents

1. [Businesses Table Fields](#businesses-table-fields)
2. [Business Insights Table Fields](#business-insights-table-fields)
3. [Field Mapping Summary](#field-mapping-summary)
4. [Data Flow Diagram](#data-flow-diagram)

---

## 🏢 Businesses Table Fields

**Purpose:** Public business data displayed on Insights/Registry pages  
**Table:** `businesses`  
**Visibility:** Public (with some privacy controls)

### **✅ Core Identity Fields**

| Input Field | Database Column | Form Section | Notes |
|-------------|----------------|--------------|-------|
| **name** | name | CoreInfo | Business name (required) |
| **business_handle** | business_handle | CoreInfo | Unique URL identifier |
| **tagline** | tagline | CoreInfo | Short description |
| **description** | description | CoreInfo | Full description |

### **✅ Visual Assets Fields**

| Input Field | Database Column | Form Section | Notes |
|-------------|----------------|--------------|-------|
| **logo_url** | logo_url | BrandMedia | Business logo |
| **banner_url** | banner_url | BrandMedia | Desktop banner |
| **mobile_banner_url** | mobile_banner_url | BrandMedia | Mobile banner |

### **✅ Contact Information Fields**

| Input Field | Database Column | Form Section | Notes |
|-------------|----------------|--------------|-------|
| **business_owner** | business_owner | CoreInfo | Owner name |
| **business_owner_email** | business_owner_email | CoreInfo | Owner email (private) |
| **additional_owner_emails** | additional_owner_emails | CoreInfo | Multiple owners (private) |
| **contact_email** | contact_email | CoreInfo | Public contact email |
| **contact_phone** | contact_phone | CoreInfo | Public contact phone |
| **contact_website** | contact_website | CoreInfo | Website URL |
| **business_hours** | business_hours | CoreInfo | Operating hours |

### **✅ Location & Business Details**

| Input Field | Database Column | Form Section | Notes |
|-------------|----------------|--------------|-------|
| **country** | country | Location | Business location country |
| **industry** | industry | Location | Business industry |
| **city** | city | Location | Business location city |
| **year_started** | year_started | Overview | Year business started |
| **business_structure** | business_structure | Overview | Legal structure |
| **team_size_band** | team_size_band | Overview | Team size category |
| **revenue_band** | revenue_band | Overview | Revenue category |

### **✅ System & Status Fields**

| Input Field | Database Column | Form Section | Notes |
|-------------|----------------|--------------|-------|
| **status** | status | - | Business status (auto) |
| **is_verified** | is_verified | - | Verification status (auto) |
| **is_claimed** | is_claimed | - | Claim status (auto) |
| **is_homepage_featured** | is_homepage_featured | - | Homepage feature (auto) |
| **business_registered** | business_registered | Overview | Legal registration status |

---

## 📈 Business Insights Table Fields

**Purpose:** Internal business tracking data (not public)  
**Table:** `business_insights`  
**Visibility:** Internal/admin only

### **✅ Business Stage & Growth**

| Input Field | Database Column | Form Section | Notes |
|-------------|----------------|--------------|-------|
| **business_stage** | business_stage | Overview | Current business stage |
| **expansion_plans** | expansion_plans | Growth | Expansion strategy |

### **✅ Challenges & Support**

| Input Field | Database Column | Form Section | Notes |
|-------------|----------------|--------------|-------|
| **top_challenges_array** | top_challenges_array | Challenges | Challenges list |
| **support_needed_next_array** | support_needed_next_array | Challenges | Support needs |
| **current_support_sources_array** | current_support_sources_array | Community | Current support |
| **hiring_intentions** | hiring_intentions | Challenges | Hiring plans |

### **✅ Financial & Investment**

| Input Field | Database Column | Form Section | Notes |
|-------------|----------------|--------------|-------|
| **current_funding_source** | current_funding_source | Financial | Current funding |
| **funding_amount_needed** | funding_amount_needed | Financial | Amount needed |
| **funding_purpose** | funding_purpose | Financial | Funding purpose |
| **investment_stage** | investment_stage | Financial | Investment stage |
| **investment_exploration** | investment_exploration | Financial | Exploration status |

### **✅ Community & Impact**

| Input Field | Database Column | Form Section | Notes |
|-------------|----------------|--------------|-------|
| **community_impact_areas_array** | community_impact_areas_array | Community | Impact areas |

### **✅ Private Contact Information**

| Input Field | Database Column | Form Section | Notes |
|-------------|----------------|--------------|-------|
| **private_business_phone** | private_business_phone | - | Private phone (internal) |
| **private_business_email** | private_business_email | - | Private email (internal) |

### **✅ Duplicate Field (Internal)**

| Input Field | Database Column | Form Section | Notes |
|-------------|----------------|--------------|-------|
| **industry** | industry | - | Industry (duplicate for internal use) |

---

## 📊 Field Mapping Summary

### **✅ Total Field Count**

| Table | Field Count | Purpose | Visibility |
|-------|-------------|---------|------------|
| **businesses** | 25 fields | Public business data | Public (with privacy controls) |
| **business_insights** | 16 fields | Internal tracking | Internal/admin only |
| **Total** | 41 fields | Complete business profile | Mixed visibility |

### **✅ Field Distribution by Category**

| Category | Businesses Table | Business Insights Table | Total |
|----------|------------------|------------------------|-------|
| **Identity** | 4 fields | 0 fields | 4 fields |
| **Visual Assets** | 3 fields | 0 fields | 3 fields |
| **Contact Info** | 7 fields | 2 fields | 9 fields |
| **Location** | 4 fields | 0 fields | 4 fields |
| **Business Details** | 4 fields | 1 field | 5 fields |
| **Financial** | 1 field | 5 fields | 6 fields |
| **Growth/Challenges** | 0 fields | 5 fields | 5 fields |
| **Community** | 0 fields | 2 fields | 2 fields |
| **System** | 4 fields | 0 fields | 4 fields |
| **Duplicates** | 0 fields | 1 field | 1 field |

---

## 🔄 Data Flow Diagram

```
📝 Form Input
     ↓
🔄 transformBusinessFormData()
     ↓
┌─────────────────┬─────────────────┐
│   businesses    │ business_insights│
│     Data        │      Data       │
└─────────────────┴─────────────────┘
     ↓                      ↓
🏢 businesses table    📈 business_insights table
     ↓                      ↓
🌐 Public Display      🔒 Internal Use
```

### **✅ Save Process:**
1. **User fills form** → All fields in `formData` object
2. **Data transformation** → `transformBusinessFormData()` splits data
3. **Parallel saves** → Both tables updated simultaneously
4. **RLS policies** → Row-level security applied

### **✅ Load Process:**
1. **Query both tables** → `getBusinessById()` fetches from both
2. **Data merge** → `{ ...businessesData, ...insightsData }`
3. **Form populate** → Form initialized with merged data
4. **UI display** → Appropriate fields shown based on context

---

## 🎯 Key Principles

### **✅ Public vs Internal Separation:**

**Businesses Table (Public):**
- **Customer-facing** information
- **Marketing and discovery** data
- **Basic contact** information
- **Location and identity** details

**Business Insights Table (Internal):**
- **Business intelligence** data
- **Growth tracking** information
- **Financial details** (private)
- **Support needs** (internal)

### **✅ Data Integrity Rules:**

**No Duplicates (Except by Design):**
- **team_size_band** and **revenue_band** only in businesses table
- **based_in_country** and **based_in_city** completely removed
- **industry** appears in both (for different purposes)

**Boolean Field Handling:**
- **is_business_registered** converted to proper boolean
- **Empty values filtered** before database operations
- **Type consistency** maintained across tables

---

## 📝 Quick Reference

### **✅ Businesses Table (25 fields):**
```
name, business_handle, tagline, description, logo_url, banner_url, 
mobile_banner_url, business_owner, business_owner_email, additional_owner_emails,
contact_email, contact_phone, contact_website, business_hours, country, 
industry, city, year_started, business_structure, team_size_band, revenue_band,
status, is_verified, is_claimed, is_homepage_featured, business_registered
```

### **✅ Business Insights Table (16 fields):**
```
business_stage, top_challenges_array, hiring_intentions, is_business_registered,
current_funding_source, funding_amount_needed, funding_purpose, investment_stage,
investment_exploration, community_impact_areas_array, support_needed_next_array,
current_support_sources_array, expansion_plans, industry, private_business_phone,
private_business_email
```

---

## 🚀 Summary

**✅ Clear separation** between public and internal data  
**✅ No unnecessary duplicates** after recent cleanup  
**✅ Proper data transformation** with boolean handling  
**✅ Efficient data flow** with parallel saves and merged loads  
**✅ Privacy protection** for sensitive business information  

**This mapping ensures proper data organization and security!** 🎉
