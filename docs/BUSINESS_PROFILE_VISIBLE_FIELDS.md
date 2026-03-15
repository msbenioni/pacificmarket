# 📋 Business Profile Visible Fields - Complete Reference

> **📅 Last Updated:** March 2026  
> **🎯 Purpose:** All fields that are publicly visible on business profiles

---

## 📊 Table of Contents

1. [Business Profile Page Fields](#business-profile-page-fields)
2. [Registry/Grid View Fields](#registrygrid-view-fields)
3. [Portal/Management View Fields](#portalmanagement-view-fields)
4. [Available Database Fields vs Visible Fields](#available-database-fields-vs-visible-fields)

---

## 🖥️ Business Profile Page Fields

**Location:** `/BusinessProfile` - Full business profile page

### **✅ Primary Header Section**

| Field | Display Location | UI Component | Database Source | Notes |
|-------|------------------|--------------|-----------------|-------|
| **name** | Main title | `<h1>` | businesses.name | Business name (required) |
| **tagline** | Subtitle/description | `<p>` | businesses.tagline | Short description |
| **description** | Full description | `<div>` | businesses.description | Long-form description |
| **logo_url** | Profile image | `<img>` | businesses.logo_url | Business logo |
| **banner_url** | Header banner | `<img>` | businesses.banner_url | Desktop banner |
| **mobile_banner_url** | Mobile banner | `<img>` | businesses.mobile_banner_url | Mobile banner |

### **✅ Verification & Status Badges**

| Field | Display Location | UI Component | Database Source | Notes |
|-------|------------------|--------------|-----------------|-------|
| **is_verified** | Verification badge | `<span>` | businesses.is_verified | Green "Verified" badge |
| **status** | Status badge | `<span>` | businesses.status | Active/draft/pending |
| **subscription_tier** | Tier badge | `<span>` | businesses.subscription_tier | Featured/Moana/etc |

### **✅ Location & Identity**

| Field | Display Location | UI Component | Database Source | Notes |
|-------|------------------|--------------|-----------------|-------|
| **city** | Location badge | `<span>` | businesses.city | City name |
| **country** | Location badge | `<span>` | businesses.country | Country name |
| **industry** | Industry badge | `<span>` | businesses.industry | Industry category |
| **cultural_identity** | Culture badge | `<span>` | businesses.cultural_identity | Pacific identity flag |

### **✅ Contact Information**

| Field | Display Location | UI Component | Database Source | Notes |
|-------|------------------|--------------|-----------------|-------|
| **contact_email** | Contact button | `<button>` | businesses.contact_email | Public email |
| **contact_phone** | Contact button | `<button>` | businesses.contact_phone | Public phone |
| **contact_website** | Website link | `<a>` | businesses.contact_website | Website URL |

### **✅ Languages**

| Field | Display Location | UI Component | Database Source | Notes |
|-------|------------------|--------------|-----------------|-------|
| **languages_spoken** | Languages section | `<span>` array | businesses.languages_spoken | Array of languages |

### **✅ Social Links**

| Field | Display Location | UI Component | Database Source | Notes |
|-------|------------------|--------------|-----------------|-------|
| **social_links** | Social media links | `<a>` array | businesses.social_links | JSONB with social URLs |

### **✅ Business Hours**

| Field | Display Location | UI Component | Database Source | Notes |
|-------|------------------|--------------|-----------------|-------|
| **business_hours** | Hours section | `<div>` | businesses.business_hours | Operating hours |

### **✅ Claim Status**

| Field | Display Location | UI Component | Database Source | Notes |
|-------|------------------|--------------|-----------------|-------|
| **claimed** | Claim section | `<div>` | businesses.claimed | Show claim form if false |
| **claimed_at** | Claim info | `<span>` | businesses.claimed_at | When claimed |
| **claimed_by** | Claim info | `<span>` | businesses.claimed_by | Who claimed |

---

## 🗂️ Registry/Grid View Fields

**Location:** Registry page - Grid/list view of all businesses

### **✅ Grid View (Compact)**

| Field | Display Location | UI Component | Database Source | Notes |
|-------|------------------|--------------|-----------------|-------|
| **name** | Card title | `<h3>` | businesses.name | Business name |
| **tagline** | Description | `<p>` | businesses.tagline | Short description |
| **logo_url** | Card image | `<img>` | businesses.logo_url | Business logo |
| **city** | Location | `<span>` | businesses.city | City name |
| **country** | Location | `<span>` | businesses.country | Country name |
| **industry** | Industry | `<span>` | businesses.industry | Industry category |
| **is_verified** | Verification icon | `<CheckCircle>` | businesses.is_verified | Green checkmark |
| **business_handle** | Link URL | Link href | businesses.business_handle | Profile link |

### **✅ List View (Expanded)**

| Field | Display Location | UI Component | Database Source | Notes |
|-------|------------------|--------------|-----------------|-------|
| **name** | List title | `<h3>` | businesses.name | Business name |
| **tagline** | Description | `<p>` | businesses.tagline | Short description |
| **description** | Description | `<p>` | businesses.description | Full description |
| **logo_url** | List image | `<img>` | businesses.logo_url | Business logo |
| **city** | Location | `<span>` | businesses.city | City name |
| **country** | Location | `<span>` | businesses.country | Country name |
| **industry** | Industry | `<span>` | businesses.industry | Industry category |
| **is_verified** | Verification icon | `<CheckCircle>` | businesses.is_verified | Green checkmark |
| **business_handle** | Link URL | Link href | businesses.business_handle | Profile link |

---

## 🔧 Portal/Management View Fields

**Location:** User portal - Business management cards

### **✅ Management Card View**

| Field | Display Location | UI Component | Database Source | Notes |
|-------|------------------|--------------|-----------------|-------|
| **name** | Card title | `<h3>` | businesses.name | Business name |
| **tagline** | Summary text | `<span>` | businesses.tagline | Short description |
| **city** | Summary text | `<span>` | businesses.city | Location info |
| **country** | Summary text | `<span>` | businesses.country | Location info |
| **industry** | Summary text | `<span>` | businesses.industry | Industry info |
| **logo_url** | Card image | `<img>` | businesses.logo_url | Business logo |
| **is_verified** | Verification badge | `<span>` | businesses.is_verified | Green badge |
| **status** | Status badge | `<span>` | businesses.status | Active/draft/pending |
| **subscription_tier** | Tier label | `<span>` | businesses.subscription_tier | Subscription level |
| **business_handle** | Link URL | Link href | businesses.business_handle | Profile link |

---

## 📊 Available Database Fields vs Visible Fields

### **✅ Publicly Visible Fields (from BUSINESS_PUBLIC_FIELDS)**

| Category | Fields | Visible? |
|----------|--------|----------|
| **Core Identity** | name, description, tagline, business_handle | ✅ All visible |
| **Visual Assets** | logo_url, banner_url, mobile_banner_url | ✅ All visible |
| **Contact Info** | contact_email, contact_phone, contact_website | ✅ All visible |
| **Location** | city, country, state_region, postal_code | ✅ Some visible |
| **Business Details** | industry, year_started, business_structure | ✅ Some visible |
| **Team Info** | team_size_band, full_time_employees, part_time_employees | ❌ Not visible publicly |
| **Financial** | revenue_band, sales_channels, import_export_status | ❌ Not visible publicly |
| **Verification** | is_verified, is_claimed, is_homepage_featured | ✅ Some visible |
| **Cultural** | languages_spoken, cultural_identity | ✅ Some visible |
| **Operations** | business_hours, competitive_advantage | ✅ Some visible |
| **System** | status, subscription_tier, created_at, updated_at | ✅ Some visible |

### **❌ Not Publicly Visible Fields**

| Category | Fields | Reason |
|----------|--------|--------|
| **Internal IDs** | id, owner_user_id, created_by, source | System use only |
| **Private Contact** | business_owner, business_owner_email, additional_owner_emails | Privacy |
| **Detailed Address** | address, suburb, state_region, postal_code | Privacy |
| **Financial Data** | revenue_band, sales_channels, import_export_status, primary_market | Privacy |
| **Team Details** | full_time_employees, part_time_employees, team_size_band | Privacy |
| **Business Metrics** | profile_completeness, referral_code | Internal use |
| **Claim Details** | claimed_at, claimed_by, visibility_tier | Internal use |
| **Social Links** | social_links | Only visible if populated |

---

## 🎯 Visibility Rules Summary

### **✅ Always Visible:**
- **name** - Business name
- **logo_url** - Business logo
- **description/tagline** - Business description
- **city, country** - Basic location
- **industry** - Business category
- **is_verified** - Verification status

### **✅ Conditionally Visible:**
- **contact_email/phone/website** - Only if provided
- **languages_spoken** - Only if array has values
- **cultural_identity** - Only if specified
- **business_hours** - Only if provided
- **social_links** - Only if populated
- **status** - Management view only
- **subscription_tier** - Management view only

### **❌ Never Visible Publicly:**
- **Internal IDs** - System use only
- **Owner details** - Privacy protection
- **Financial data** - Business sensitivity
- **Employee counts** - Business sensitivity
- **Detailed address** - Privacy protection
- **Claim details** - Internal tracking

---

## 🚀 Key Insights

### **✅ Public Profile Focus:**
- **Customer-facing** information prioritized
- **Privacy-sensitive** data hidden
- **Verification status** prominently displayed
- **Contact information** available when provided

### **✅ Data Hierarchy:**
1. **Essential** - Name, logo, description (always visible)
2. **Location** - City, country, industry (high visibility)
3. **Contact** - Email, phone, website (when provided)
4. **Cultural** - Languages, identity (when provided)
5. **Internal** - IDs, metrics, financials (never visible)

### **✅ Security & Privacy:**
- **Personal data** protected (owner details)
- **Financial data** private (revenue, employees)
- **Location data** limited (city/country only)
- **Contact data** optional (user-controlled)

---

## 📝 Implementation Notes

### **✅ Query Optimization:**
- **BUSINESS_PUBLIC_FIELDS** defines what's available
- **UI components** selectively display available data
- **RLS policies** control data access
- **Conditional rendering** handles empty/null values

### **✅ User Experience:**
- **Progressive disclosure** - More info on profile page
- **Responsive design** - Different layouts for different screens
- **Verification trust** - Badges build confidence
- **Contact control** - Users choose what to share
