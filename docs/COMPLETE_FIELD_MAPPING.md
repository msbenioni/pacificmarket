# 📊 Complete Field Mapping - All Forms to Database Tables

> **📅 Last Updated:** March 2026 - Form consolidation complete  
> **🏗️ Architecture:** 3-table structure (businesses, business_insights, founder_insights)

---

## 📋 Table of Contents

1. [Businesses Table Fields](#businesses-table-fields)
2. [Business Insights Table Fields](#business-insights-table-fields)
3. [Founder Insights Table Fields](#founder-insights-table-fields)
4. [Form Sections Mapping](#form-sections-mapping)
5. [Data Flow Summary](#data-flow-summary)

---

## 🏢 Businesses Table Fields

**Purpose:** Public business data displayed on Insights/Registry pages

| Field | Form Section | UI Component | Data Type | Required | Notes |
|-------|--------------|--------------|-----------|----------|-------|
| **id** | - | - | UUID | Auto | Primary key |
| **name** | CoreInfo | BusinessProfileForm | TEXT | ✅ | Business name |
| **business_handle** | CoreInfo | BusinessProfileForm | TEXT | ✅ | Unique identifier |
| **tagline** | CoreInfo | BusinessProfileForm | TEXT | ❌ | Brief description |
| **description** | CoreInfo | BusinessProfileForm | TEXT | ❌ | Full description |
| **logo_url** | BrandMedia | BusinessProfileForm | TEXT | ❌ | Business logo |
| **banner_url** | BrandMedia | BusinessProfileForm | TEXT | ❌ | Desktop banner |
| **mobile_banner_url** | BrandMedia | BusinessProfileForm | TEXT | ❌ | Mobile banner |
| **business_owner** | CoreInfo | BusinessProfileForm | TEXT | ❌ | Owner name |
| **business_owner_email** | CoreInfo | BusinessProfileForm | TEXT | ❌ | Owner email |
| **additional_owner_emails** | CoreInfo | BusinessProfileForm | TEXT[] | ❌ | Multiple owners |
| **contact_email** | CoreInfo | BusinessProfileForm | TEXT | ❌ | Public contact |
| **contact_phone** | CoreInfo | BusinessProfileForm | TEXT | ❌ | Public phone |
| **contact_website** | CoreInfo | BusinessProfileForm | TEXT | ❌ | Website URL |
| **business_hours** | CoreInfo | BusinessProfileForm | TEXT | ❌ | Operating hours |
| **country** | Location | BusinessProfileForm | TEXT | ✅ | Business location |
| **industry** | Location | BusinessProfileForm | TEXT | ✅ | Business industry |
| **city** | Location | BusinessProfileForm | TEXT | ✅ | Business city |
| **year_started** | Overview | BusinessProfileForm | TEXT | ❌ | Founding year |
| **business_structure** | Overview | BusinessProfileForm | TEXT | ❌ | Legal structure |
| **team_size_band** | Overview | BusinessProfileForm | TEXT | ❌ | Team size category |
| **revenue_band** | Overview | BusinessProfileForm | TEXT | ❌ | Revenue category |
| **status** | - | - | TEXT | Auto | Business status |
| **is_verified** | - | - | BOOLEAN | Auto | Verification status |
| **is_claimed** | - | - | BOOLEAN | Auto | Claim status |
| **is_homepage_featured** | - | - | BOOLEAN | Auto | Homepage feature |
| **owner_user_id** | - | - | UUID | Auto | Owner reference |
| **created_by** | - | - | UUID | Auto | Creator reference |
| **source** | - | - | TEXT | Auto | Data source |
| **profile_completeness** | - | - | TEXT | Auto | Completion % |
| **referral_code** | - | - | TEXT | ❌ | Referral tracking |
| **social_links** | - | - | JSONB | ❌ | Social media URLs |
| **business_registered** | Overview | BusinessProfileForm | BOOLEAN | ❌ | Legal registration |
| **full_time_employees** | - | - | INTEGER | ❌ | Employee count |
| **part_time_employees** | - | - | INTEGER | ❌ | Part-time count |
| **sales_channels** | - | - | TEXT[] | ❌ | Sales channels |
| **import_export_status** | - | - | TEXT | ❌ | Trade status |
| **primary_market** | - | - | TEXT | ❌ | Main market |
| **competitive_advantage** | - | - | TEXT | ❌ | Advantage description |
| **visibility_tier** | - | - | TEXT | Auto | Visibility level |
| **languages_spoken** | - | - | TEXT[] | ❌ | Languages |
| **cultural_identity** | - | - | TEXT[] | ❌ | Cultural identity |
| **subscription_tier** | - | - | TEXT | Auto | Subscription level |

---

## 📈 Business Insights Table Fields

**Purpose:** Internal business tracking data (not public)

| Field | Form Section | UI Component | Data Type | Required | Notes |
|-------|--------------|--------------|-----------|----------|-------|
| **id** | - | - | UUID | Auto | Primary key |
| **business_id** | - | - | UUID | Auto | Foreign key |
| **user_id** | - | - | UUID | Auto | User reference |
| **snapshot_year** | - | - | INTEGER | Auto | Year snapshot |
| **submitted_date** | - | - | TIMESTAMP | Auto | Submission time |
| **created_at** | - | - | TIMESTAMP | Auto | Creation time |
| **updated_at** | - | - | TIMESTAMP | Auto | Update time |
| **business_stage** | Overview | BusinessProfileForm | TEXT | ❌ | Current stage |
| **top_challenges_array** | Challenges | BusinessProfileForm | TEXT[] | ❌ | Challenges list |
| **hiring_intentions** | Challenges | BusinessProfileForm | TEXT | ❌ | Hiring plans |
| **is_business_registered** | Overview | BusinessProfileForm | BOOLEAN | ❌ | Registration status |
| **current_funding_source** | Financial | BusinessProfileForm | TEXT | ❌ | Current funding |
| **funding_amount_needed** | Financial | BusinessProfileForm | TEXT | ❌ | Amount needed |
| **funding_purpose** | Financial | BusinessProfileForm | TEXT | ❌ | Funding purpose |
| **investment_stage** | Financial | BusinessProfileForm | TEXT | ❌ | Investment stage |
| **investment_exploration** | Financial | BusinessProfileForm | TEXT | ❌ | Exploration status |
| **community_impact_areas_array** | Community | BusinessProfileForm | TEXT[] | ❌ | Impact areas |
| **support_needed_next_array** | Community | BusinessProfileForm | TEXT[] | ❌ | Support needs |
| **current_support_sources_array** | Community | BusinessProfileForm | TEXT[] | ❌ | Current support |
| **expansion_plans** | Growth | BusinessProfileForm | TEXT | ❌ | Expansion plans |
| **industry** | - | - | TEXT | ❌ | Industry (duplicate) |
| **private_business_phone** | - | - | TEXT | ❌ | Private phone |
| **private_business_email** | - | - | TEXT | ❌ | Private email |

---

## 👤 Founder Insights Table Fields

**Purpose:** Founder-specific personal data and insights

| Field | Form Section | UI Component | Data Type | Required | Notes |
|-------|--------------|--------------|-----------|----------|-------|
| **id** | - | - | UUID | Auto | Primary key |
| **user_id** | - | - | UUID | Auto | User reference |
| **snapshot_year** | - | - | INTEGER | Auto | Year snapshot |
| **submitted_date** | - | - | TIMESTAMP | Auto | Submission time |
| **created_at** | - | - | TIMESTAMP | Auto | Creation time |
| **updated_at** | - | - | TIMESTAMP | Auto | Update time |
| **gender** | Community | CommunitySection | TEXT | ❌ | Founder gender |
| **age_range** | Community | CommunitySection | TEXT | ❌ | Age category |
| **years_entrepreneurial** | - | - | TEXT | ❌ | Years in business |
| **entrepreneurial_background** | - | - | TEXT | ❌ | Background details |
| **businesses_founded** | - | - | TEXT | ❌ | Number founded |
| **family_entrepreneurial_background** | - | - | BOOLEAN | ❌ | Family background |
| **founder_role** | - | - | TEXT | ❌ | Current role |
| **founder_story** | Community | CommunitySection | TEXT | ❌ | Personal story |
| **founder_motivation_array** | - | - | TEXT[] | ❌ | Motivation factors |
| **pacific_identity** | - | - | TEXT[] | ❌ | Pacific identity |
| **serves_pacific_communities** | - | - | TEXT | ❌ | Communities served |
| **culture_influences_business** | - | - | BOOLEAN | ❌ | Cultural influence |
| **culture_influence_details** | - | - | TEXT | ❌ | Cultural details |
| **family_community_responsibilities_affect_business** | - | - | TEXT[] | ❌ | Responsibilities |
| **responsibilities_impact_details** | - | - | TEXT | ❌ | Impact details |
| **mentorship_access** | - | - | BOOLEAN | ❌ | Mentorship access |
| **mentorship_offering** | Community | CommunitySection | BOOLEAN | ❌ | Offering mentorship |
| **barriers_to_mentorship** | - | - | TEXT | ❌ | Mentorship barriers |
| **angel_investor_interest** | - | - | TEXT | ❌ | Investor interest |
| **investor_capacity** | - | - | TEXT | ❌ | Investment capacity |
| **collaboration_interest** | Community | CommunitySection | BOOLEAN | ❌ | Collaboration interest |
| **open_to_future_contact** | Community | CommunitySection | BOOLEAN | ❌ | Future contact |
| **goals_details** | - | - | TEXT | ❌ | Personal goals |
| **goals_next_12_months_array** | - | - | TEXT[] | ❌ | 12-month goals |

---

## 📝 Form Sections Mapping

### **BusinessProfileForm Sections**

| Section | Fields | Target Tables |
|---------|--------|---------------|
| **CoreInfo** | name, business_handle, tagline, description, business_owner, business_owner_email, additional_owner_emails, contact_email, contact_phone, contact_website, business_hours | **businesses** |
| **BrandMedia** | logo_url, banner_url, mobile_banner_url | **businesses** |
| **Location** | country, industry, city | **businesses** |
| **Overview** | year_started, business_structure, team_size_band, business_stage, revenue_band, is_business_registered | **businesses** + **business_insights** |
| **Financial** | current_funding_source, funding_amount_needed, funding_purpose, investment_stage, investment_exploration | **business_insights** |
| **Challenges** | top_challenges_array, support_needed_next_array | **business_insights** |
| **Growth** | growth_stage, goals_next_12_months_array, goals_details | **business_insights** |
| **Community** | community_impact_areas_array, current_support_sources_array, expansion_plans | **business_insights** |

### **CommunitySection (Founder Insights)**

| Field | Target Table |
|-------|--------------|
| community_impact_areas_array | **business_insights** |
| collaboration_interest | **founder_insights** |
| mentorship_offering | **founder_insights** |
| open_to_future_contact | **founder_insights** |
| founder_story | **founder_insights** |
| age_range | **founder_insights** |
| gender | **founder_insights** |

### **FounderInsightsForm.Shared**

| Field | Target Table |
|-------|--------------|
| gender | **founder_insights** |
| age_range | **founder_insights** |
| years_entrepreneurial | **founder_insights** |
| businesses_founded | **founder_insights** |
| founder_role | **founder_insights** |
| founder_story | **founder_insights** |
| industry | **businesses** |
| team_size_band | **businesses** |
| revenue_band | **businesses** |

---

## 🔄 Data Flow Summary

### **Save Flow:**
1. **Form Submission** → `transformBusinessFormData()`
2. **Data Split** → `businessesData` + `businessInsightsData`
3. **Filter Empty Values** → `filterEmptyValues()`
4. **Database Save** → Parallel saves to both tables
5. **RLS Policies** → Row-level security applied

### **Load Flow:**
1. **Query** → `getBusinessById()` queries both tables
2. **Data Merge** → `{ ...businessesData, ...insightsData }`
3. **Form Initialize** → Form populated with merged data
4. **Display** → UI shows appropriate fields from merged data

### **Key Principles:**
- **Single Source of Truth** - No duplicate fields across tables
- **Public vs Private** - Clear separation between public and internal data
- **Data Integrity** - Proper foreign key relationships and constraints
- **Security** - RLS policies control access to sensitive data

---

## 🎯 Recent Consolidation Changes

### **✅ Removed Duplicate Fields:**
- **team_size_band** - Now only in `businesses` table
- **revenue_band** - Now only in `businesses` table  
- **based_in_country** - Removed from `founder_insights`
- **based_in_city** - Removed from `founder_insights`
- **business_operating_status** - Completely removed
- **business_age** - Completely removed
- **employs_anyone** - Completely removed
- **employs_family_community** - Completely removed

### **✅ Data Structure Optimized:**
- **Cleaner schema** - No duplicate columns
- **Better performance** - Smaller tables, faster queries
- **Simplified logic** - Single source of truth for each field
- **Improved UX** - Fewer form fields, less confusion
