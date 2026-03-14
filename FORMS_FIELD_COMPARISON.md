# 📊 Forms Field Comparison & Database Mapping

## 🎯 Overview

This document provides a comprehensive comparison of all input fields across the different forms in the Pacific Market application, showing where each field saves to and fetches from in the database.

---

## 📋 Table of Contents

1. [Core Business Fields](#core-business-fields)
2. [Contact Information Fields](#contact-information-fields)
3. [Media & Branding Fields](#media--branding-fields)
4. [Business Operations Fields](#business-operations-fields)
5. [Founder & Personal Fields](#founder--personal-fields)
6. [Pacific Context Fields](#pacific-context-fields)
7. [Financial & Growth Fields](#financial--growth-fields)
8. [Support & Community Fields](#support--community-fields)
9. [Admin & System Fields](#admin--system-fields)

---

## 🏢 Core Business Fields

| Field | InlineBusinessForm | DetailedBusinessForm | FounderInsightsForm | Database Table | Database Column | Notes |
|-------|-------------------|-------------------|-------------------|---------------|----------------|-------|
| **name** | ✅ | ✅ | ❌ | `businesses` | `name` | Required field |
| **business_handle** | ✅ | ✅ | ❌ | `businesses` | `business_handle` | Unique identifier |
| **tagline** | ✅ | ✅ | ❌ | `businesses` | `tagline` | Brief description |
| **tagline** | ❌ | ✅ | ❌ | `businesses` | `tagline` | Alternative to tagline |
| **description** | ✅ | ✅ | ❌ | `businesses` | `description` | Full description |
| **industry** | ✅ | ✅ | ✅ | `businesses` / `business_insights` | `industry` | Business classification |
| **country** | ✅ | ✅ | ❌ | `businesses` | `country` | Business location |
| **city** | ✅ | ✅ | ❌ | `businesses` | `city` | Business location |
| **year_started** | ❌ | ✅ | ❌ | `businesses` / `business_insights` | `year_started` | When business started |

---

## 📞 Contact Information Fields

| Field | InlineBusinessForm | DetailedBusinessForm | FounderInsightsForm | Database Table | Database Column | Notes |
|-------|-------------------|-------------------|-------------------|---------------|----------------|-------|
| **contact_email** | ✅ | ✅ | ❌ | `businesses` | `contact_email` | Public contact email |
| **contact_phone** | ❌ | ✅ | ❌ | `businesses` | `contact_phone` | Public contact phone |
| **public_phone** | ✅ | ❌ | ❌ | `businesses` | `public_phone` | Alternative public phone |
| **private_business_phone** | ✅ | ❌ | ❌ | `business_insights` | `private_business_phone` | Private contact phone |
| **private_business_email** | ✅ | ❌ | ❌ | `business_insights` | `private_business_email` | Private contact email |
| **contact_website** | ✅ | ✅ | ❌ | `businesses` | `contact_website` | Public website |
| **website** | ❌ | ✅ | ❌ | `businesses` | `website` | Alternative website field |
| **business_hours** | ✅ | ❌ | ❌ | `businesses` | `business_hours` | Operating hours |

---

## 🖼️ Media & Branding Fields

| Field | InlineBusinessForm | DetailedBusinessForm | FounderInsightsForm | Database Table | Database Column | Notes |
|-------|-------------------|-------------------|-------------------|---------------|----------------|-------|
| **logo_url** | ✅ | ✅ | ❌ | `businesses` | `logo_url` | Business logo URL |
| **banner_url** | ✅ | ✅ | ❌ | `businesses` | `banner_url` | Business banner URL |
| **logo_file** | ✅ | ❌ | ❌ | **File Upload** | **Storage** | Temporary file upload |
| **banner_file** | ✅ | ❌ | ❌ | **File Upload** | **Storage** | Temporary file upload |
| **social_links** | ❌ | ✅ | ❌ | `businesses` | `social_links` | JSONB object `{platform: url}` |

---

## 🏭 Business Operations Fields

| Field | InlineBusinessForm | DetailedBusinessForm | FounderInsightsForm | Database Table | Database Column | Notes |
|-------|-------------------|-------------------|-------------------|---------------|----------------|-------|
| **business_operating_status** | ❌ | ✅ | ✅ | `businesses` / `business_insights` | `business_operating_status` | Operating status |
| **business_age** | ❌ | ✅ | ✅ | `business_insights` | `business_age` | How long business has operated |
| **team_size_band** | ❌ | ✅ | ✅ | `businesses` / `business_insights` | `team_size_band` | Team size category |
| **team_size** | ✅ | ❌ | ❌ | **Legacy** | **Not Used** | Legacy field |
| **business_registered** | ❌ | ✅ | ✅ | `businesses` / `business_insights` | `business_registered` | Legal registration status |
| **employs_anyone** | ❌ | ✅ | ✅ | `business_insights` | `employs_anyone` | Has employees |
| **employs_family_community** | ❌ | ✅ | ✅ | `business_insights` | `employs_family_community` | Employs family/community |
| **sales_channels** | ❌ | ✅ | ❌ | `business_insights` | `sales_channels` | JSONB array of channels |
| **revenue_band** | ❌ | ✅ | ✅ | `businesses` / `business_insights` | `revenue_band` | Revenue category |

---

## 👤 Founder & Personal Fields

| Field | InlineBusinessForm | DetailedBusinessForm | FounderInsightsForm | Database Table | Database Column | Notes |
|-------|-------------------|-------------------|-------------------|---------------|----------------|-------|
| **gender** | ❌ | ❌ | ✅ | `founder_insights` | `gender` | Founder gender |
| **age_range** | ❌ | ❌ | ✅ | `founder_insights` | `age_range` | Founder age range |
| **years_entrepreneurial** | ❌ | ❌ | ✅ | `founder_insights` | `years_entrepreneurial` | Years as entrepreneur |
| **businesses_founded** | ❌ | ❌ | ✅ | `founder_insights` | `businesses_founded` | Number of businesses founded |
| **founder_role** | ❌ | ❌ | ✅ | `founder_insights` | `founder_role` | Role in business |
| **founder_story** | ❌ | ❌ | ✅ | `founder_insights` | `founder_story` | Founder's story |
| **founder_motivation_array** | ❌ | ❌ | ✅ | `founder_insights` | `founder_motivation_array` | Motivation factors (JSONB array) |

---

## 🌏 Pacific Context Fields

| Field | InlineBusinessForm | DetailedBusinessForm | FounderInsightsForm | Database Table | Database Column | Notes |
|-------|-------------------|-------------------|-------------------|---------------|----------------|-------|
| **pacific_identity** | ❌ | ❌ | ✅ | `founder_insights` | `pacific_identity` | Pacific identity (JSONB array) |
| **based_in_country** | ❌ | ❌ | ✅ | `founder_insights` | `based_in_country` | Country where based |
| **based_in_city** | ❌ | ❌ | ✅ | `founder_insights` | `based_in_city` | City where based |
| **serves_pacific_communities** | ❌ | ❌ | ✅ | `founder_insights` | `serves_pacific_communities` | Serves Pacific communities |
| **culture_influences_business** | ❌ | ❌ | ✅ | `founder_insights` | `culture_influences_business` | Culture influences business |
| **culture_influence_details** | ❌ | ❌ | ✅ | `founder_insights` | `culture_influence_details` | Cultural influence details |
| **family_community_responsibilities_affect_business** | ❌ | ❌ | ✅ | `founder_insights` | `family_community_responsibilities_affect_business` | Family responsibilities impact |
| **cultural_identity** | ❌ | ✅ | ❌ | `businesses` | `cultural_identity` | Cultural identity (JSONB array) |
| **languages_spoken** | ❌ | ✅ | ❌ | `businesses` | `languages_spoken` | Languages spoken (JSONB array) |

---

## 💰 Financial & Growth Fields

| Field | InlineBusinessForm | DetailedBusinessForm | FounderInsightsForm | Database Table | Database Column | Notes |
|-------|-------------------|-------------------|-------------------|---------------|----------------|-------|
| **funding_source** | ❌ | ✅ | ✅ | `business_insights` | `current_funding_source` | Current funding source |
| **funding_amount_needed** | ❌ | ❌ | ❌ | `business_insights` | `funding_amount_needed` | Funding amount needed |
| **funding_purpose** | ❌ | ❌ | ❌ | `business_insights` | `funding_purpose` | Purpose of funding |
| **investment_stage** | ❌ | ❌ | ✅ | `business_insights` | `investment_stage` | Investment stage |
| **revenue_streams** | ❌ | ❌ | ✅ | `business_insights` | `revenue_streams` | Revenue streams (JSONB array) |
| **growth_stage** | ❌ | ✅ | ❌ | `business_insights` | `business_stage` | Business growth stage |
| **business_stage** | ❌ | ❌ | ❌ | `business_insights` | `business_stage` | Alternative to growth_stage |
| **full_time_employees** | ❌ | ✅ | ❌ | **Not Mapped** | **Not Used** | Detailed employee count |
| **part_time_employees** | ❌ | ✅ | ❌ | **Not Mapped** | **Not Used** | Detailed employee count |

---

## 🤝 Support & Community Fields

| Field | InlineBusinessForm | DetailedBusinessForm | FounderInsightsForm | Database Table | Database Column | Notes |
|-------|-------------------|-------------------|-------------------|---------------|----------------|-------|
| **top_challenges** | ❌ | ❌ | ✅ | `business_insights` | `top_challenges` | Top challenges (JSONB array) |
| **support_needed_next** | ❌ | ❌ | ✅ | `business_insights` | `support_needed_next` | Support needed (JSONB array) |
| **current_support_sources** | ❌ | ❌ | ✅ | `business_insights` | `current_support_sources` | Current support sources |
| **mentorship_access** | ❌ | ❌ | ✅ | `founder_insights` | `mentorship_access` | Has mentorship access |
| **mentorship_offering** | ❌ | ❌ | ✅ | `founder_insights` | `mentorship_offering` | Offers mentorship |
| **barriers_to_mentorship** | ❌ | ❌ | ✅ | `founder_insights` | `barriers_to_mentorship` | Barriers to mentorship |
| **angel_investor_interest** | ❌ | ❌ | ✅ | `founder_insights` | `angel_investor_interest` | Angel investor interest |
| **investor_capacity** | ❌ | ❌ | ✅ | `founder_insights` | `investor_capacity` | Investor capacity |
| **collaboration_interest** | ❌ | ❌ | ✅ | `founder_insights` | `collaboration_interest` | Collaboration interest |
| **open_to_future_contact** | ❌ | ❌ | ✅ | `founder_insights` | `open_to_future_contact` | Open to future contact |
| **community_impact_areas** | ❌ | ❌ | ✅ | `business_insights` | `community_impact_areas` | Community impact (JSONB array) |
| **goals_next_12_months_array** | ❌ | ❌ | ✅ | `founder_insights` | `goals_next_12_months_array` | Goals (JSONB array) |

---

## 🔧 Admin & System Fields

| Field | InlineBusinessForm | DetailedBusinessForm | FounderInsightsForm | Database Table | Database Column | Notes |
|-------|-------------------|-------------------|-------------------|---------------|----------------|-------|
| **status** | ✅ | ❌ | ❌ | `businesses` | `status` | Business status |
| **verified** | ✅ | ❌ | ❌ | `businesses` | `verified` | Verification status |
| **claimed** | ✅ | ❌ | ❌ | `businesses` | `claimed` | Claim status |
| **subscription_tier** | ✅ | ❌ | ❌ | `businesses` | `subscription_tier` | Subscription tier |
| **homepage_featured** | ✅ | ❌ | ❌ | `businesses` | `homepage_featured` | Homepage featured |
| **owner_user_id** | ❌ | ❌ | ❌ | `businesses` | `owner_user_id` | Business owner |
| **business_owner** | ✅ | ❌ | ❌ | `businesses` | `business_owner` | Business owner name |
| **business_owner_email** | ✅ | ❌ | ❌ | `businesses` | `business_owner_email` | Business owner email |
| **additional_owner_emails** | ✅ | ❌ | ❌ | `businesses` | `additional_owner_emails` | Additional owners (JSONB array) |
| **source** | ❌ | ❌ | ❌ | `businesses` | `source` | Data source |
| **created_at** | ❌ | ❌ | ❌ | `businesses` | `created_at` | Creation timestamp |
| **updated_at** | ❌ | ❌ | ❌ | `businesses` | `updated_at` | Update timestamp |

---

## 📊 Field Mapping Summary

### **🏢 businesses Table Fields**
- **Core:** `name`, `business_handle`, `description`, `tagline`, `tagline`
- **Contact:** `contact_email`, `contact_phone`, `public_phone`, `contact_website`, `website`, `business_hours`
- **Location:** `country`, `city`, `suburb`, `address`, `state_region`, `postal_code`
- **Classification:** `industry`, `business_type`, `business_structure`
- **Media:** `logo_url`, `banner_url`
- **Ownership:** `business_owner`, `business_owner_email`, `additional_owner_emails`
- **Metrics:** `year_started`, `team_size_band`, `employee_count`, `revenue_band`
- **Status:** `status`, `verified`, `claimed`, `subscription_tier`, `visibility_tier`
- **Operations:** `business_operating_status`, `business_registered`
- **Social:** `social_links` (JSONB), `website`
- **Cultural:** `cultural_identity`, `languages_spoken` (JSONB arrays)
- **System:** `owner_user_id`, `source`, `created_at`, `updated_at`

### **📈 business_insights Table Fields**
- **Basics:** `year_started`, `team_size_band`, `industry`, `business_operating_status`
- **Growth:** `business_stage`, `top_challenges`, `business_age`, `revenue_band`
- **Operations:** `employs_anyone`, `employs_family_community`, `business_registered`
- **Financial:** `current_funding_source`, `funding_amount_needed`, `investment_stage`
- **Support:** `community_impact_areas`, `support_needed_next`, `current_support_sources`
- **Contact:** `private_business_phone`, `private_business_email`
- **Sales:** `sales_channels` (JSONB)

### **👤 founder_insights Table Fields**
- **Personal:** `gender`, `age_range`, `years_entrepreneurial`, `founder_role`, `founder_story`
- **Background:** `founder_motivation_array`, `businesses_founded`, `entrepreneurial_background`
- **Pacific:** `pacific_identity`, `based_in_country`, `based_in_city`, `serves_pacific_communities`
- **Culture:** `culture_influences_business`, `culture_influence_details`, `family_community_responsibilities_affect_business`
- **Support:** `mentorship_access`, `mentorship_offering`, `barriers_to_mentorship`
- **Investment:** `angel_investor_interest`, `investor_capacity`, `collaboration_interest`
- **Goals:** `goals_next_12_months_array`

---

## 🔄 Data Flow Patterns

### **💾 Save Operations**
1. **InlineBusinessForm** → `businesses` table (direct save)
2. **DetailedBusinessForm** → `businesses` table (with field transformations)
3. **FounderInsightsForm** → `founder_insights` table (separate table)

### **📥 Fetch Operations**
1. **Business data** → `businesses` table
2. **Business insights** → `business_insights` table (linked by `business_id`)
3. **Founder insights** → `founder_insights` table (linked by `user_id`)

### **🔄 Field Transformations**
- **social_links**: Form array `{platform, url}` → Database JSONB `{platform: url}`
- **Arrays**: Form arrays → Database JSONB arrays
- **Field mapping**: `tagline` ↔ `tagline`, `website` ↔ `contact_website`

---

## 🎯 Key Observations

### **✅ Well-Mapped Fields**
- Core business fields are consistently mapped to `businesses` table
- Contact information has clear public/private separation
- Cultural and identity fields use JSONB arrays appropriately

### **⚠️ Inconsistent Usage**
- `team_size` vs `team_size_band` - Different forms use different fields
- `website` vs `contact_website` - Multiple field names for same purpose
- `growth_stage` vs `business_stage` - Field name inconsistency

### **🔧 Recommendations**
1. **Standardize field names** across forms (e.g., always use `team_size_band`)
2. **Document transformations** clearly in form components
3. **Consider consolidating** similar fields to reduce confusion
4. **Add validation** to ensure data consistency across tables

---

## 📝 Implementation Notes

### **🏗️ Form-Specific Logic**
- **InlineBusinessForm**: Direct mapping to `businesses` table
- **DetailedBusinessForm**: Field transformations before save to `businesses`
- **FounderInsightsForm**: Separate `founder_insights` table with `business_id` linking

### **🔄 Data Transformations**
```javascript
// Example: social_links transformation
// Form format: [{ platform: 'instagram', url: 'https://...' }]
// Database format: { instagram: 'https://...' }

const transformSocialLinksToDB = (socialLinks) => {
  if (!Array.isArray(socialLinks)) return {};
  return socialLinks.reduce((acc, link) => {
    if (link.platform && link.url) {
      acc[link.platform] = link.url;
    }
    return acc;
  }, {});
};
```

### **📊 Array Handling**
- Form arrays → Database JSONB arrays for storage
- Database JSONB arrays → Form arrays for display
- Use proper JSON serialization/deserialization

---

*This comparison table provides a comprehensive overview of all form fields and their database mappings to help with form development, data migration, and system maintenance.*
