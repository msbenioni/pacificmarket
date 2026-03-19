# 🔗 Field Mapping Reference

> **📅 Last Updated:** March 2026  
> **🎯 Current State:** Optimized field mappings after form consolidation

---

## 📋 **Table of Contents**

1. [Quick Reference](#quick-reference)
2. [Businesses Table Fields](#businesses-table-fields)
3. [Business Insights Table Fields](#business-insights-table-fields)
4. [Founder Insights Table Fields](#founder-insights-table-fields)
5. [Form to Database Mapping](#form-to-database-mapping)
6. [Public Profile Fields](#public-profile-fields)

---

## ⚡ **Quick Reference**

### **✅ Field Count Summary**

| Table | Field Count | Purpose | Visibility |
|-------|-------------|---------|------------|
| **businesses** | 25 fields | Public business data | Public (with privacy controls) |
| **business_insights** | 5 fields | Internal tracking | Internal/admin only |
| **founder_insights** | 25+ fields | Founder data | Founder/admin only |
| **Total** | ~55 fields | Complete business profile | Mixed visibility |

### **✅ Field Distribution**

| Category | Businesses | Business Insights | Founder Insights |
|----------|------------|------------------|------------------|
| **Identity** | 4 | 0 | 3 |
| **Contact** | 7 | 2 | 0 |
| **Location** | 3 | 0 | 0 |
| **Business Details** | 5 | 1 | 3 |
| **Financial** | 1 | 0 | 2 |
| **Growth/Challenges** | 0 | 1 | 2 |
| **Cultural** | 0 | 0 | 2 |
| **System** | 5 | 1 | 3 |

---

## 🏢 **Businesses Table Fields**

| Field | Form Section | Data Type | Required | Public | Notes |
|-------|--------------|-----------|----------|--------|-------|
| **id** | - | UUID | Auto | ❌ | Primary key |
| **business_name** | CoreInfo | TEXT | ✅ | ✅ | Business name |
| **business_handle** | CoreInfo | TEXT | ✅ | ✅ | Unique identifier |
| **tagline** | CoreInfo | TEXT | ❌ | ✅ | Short description |
| **description** | CoreInfo | TEXT | ❌ | ✅ | Full description |
| **logo_url** | BrandMedia | TEXT | ❌ | ✅ | Business logo |
| **banner_url** | BrandMedia | TEXT | ❌ | ✅ | Desktop banner |
| **mobile_banner_url** | BrandMedia | TEXT | ❌ | ✅ | Mobile banner |
| **business_contact_person** | ContactDetails | TEXT | ❌ | ❌ | Contact person (private) |
| **business_email** | ContactDetails | TEXT | ❌ | ✅ | Business email |
| **business_phone** | ContactDetails | TEXT | ❌ | ✅ | Business phone |
| **business_website** | ContactDetails | TEXT | ❌ | ✅ | Website URL |
| **business_hours** | ContactDetails | TEXT | ❌ | ✅ | Operating hours |
| **address** | Location | TEXT | ❌ | ❌ | Street address |
| **suburb** | Location | TEXT | ❌ | ❌ | Suburb/Area |
| **city** | Location | TEXT | ❌ | ✅ | Business city |
| **state_region** | Location | TEXT | ❌ | ❌ | State/Region |
| **postal_code** | Location | TEXT | ❌ | ❌ | Postal code |
| **country** | Location | TEXT | ✅ | ✅ | Business location |
| **industry** | Location | TEXT | ✅ | ✅ | Business industry |
| **year_started** | Overview | TEXT | ❌ | ✅ | Founding year |
| **business_structure** | Overview | TEXT | ❌ | ✅ | Legal structure |
| **team_size_band** | Overview | TEXT | ❌ | ✅ | Team size category |
| **revenue_band** | Overview | TEXT | ❌ | ✅ | Revenue category |
| **is_business_registered** | Overview | BOOLEAN | ❌ | ❌ | Registration status |
| **role** | CoreInfo | TEXT | ❌ | ❌ | User role in business |
| **status** | - | TEXT | Auto | ✅ | Business status |
| **is_verified** | - | BOOLEAN | Auto | ✅ | Verification status |
| **is_claimed** | - | BOOLEAN | Auto | ✅ | Claim status |
| **is_homepage_featured** | - | BOOLEAN | Auto | ✅ | Homepage feature |
| **owner_user_id** | - | UUID | Auto | ❌ | Owner reference |
| **created_by** | - | UUID | Auto | ❌ | Creator reference |
| **source** | - | TEXT | Auto | ❌ | Data source |
| **profile_completeness** | - | TEXT | Auto | ❌ | Completion percentage |
| **referral_code** | - | TEXT | ❌ | ❌ | Referral tracking |

---

## 📈 **Business Insights Table Fields**

| Field | Form Section | Data Type | Required | Visibility | Notes |
|-------|--------------|-----------|----------|------------|-------|
| **id** | - | UUID | Auto | Internal | Primary key |
| **business_id** | - | UUID | Auto | Internal | Foreign key |
| **user_id** | - | UUID | Auto | Internal | User reference |
| **snapshot_year** | - | INTEGER | Auto | Internal | Year snapshot |
| **business_stage** | Overview | TEXT | ❌ | Internal | Current business stage |
| **top_challenges_array** | Challenges | TEXT[] | ❌ | Internal | Business challenges |
| **is_business_registered** | Overview | BOOLEAN | ❌ | Internal | Registration status |
| **private_business_phone** | - | TEXT | ❌ | Internal | Private phone |
| **private_business_email** | - | TEXT | ❌ | Internal | Private email |
| **submitted_date** | - | TIMESTAMP | Auto | Internal | Submission time |
| **created_at** | - | TIMESTAMP | Auto | Internal | Creation time |
| **updated_at** | - | TIMESTAMP | Auto | Internal | Update time |

---

## 👤 **Founder Insights Table Fields**

| Field | Form Section | Data Type | Required | Visibility | Notes |
|-------|--------------|-----------|----------|------------|-------|
| **id** | - | UUID | Auto | Founder/Admin | Primary key |
| **user_id** | - | UUID | Auto | Founder/Admin | User reference |
| **snapshot_year** | - | INTEGER | Auto | Founder/Admin | Year snapshot |
| **gender** | Community | TEXT | ❌ | Founder/Admin | Founder gender |
| **age_range** | Community | TEXT | ❌ | Founder/Admin | Age category |
| **years_entrepreneurial** | - | TEXT | ❌ | Founder/Admin | Years in business |
| **businesses_founded** | - | TEXT | ❌ | Founder/Admin | Number founded |
| **founder_role** | - | TEXT | ❌ | Founder/Admin | Current role |
| **founder_story** | Community | TEXT | ❌ | Founder/Admin | Personal story |
| **collaboration_interest** | Community | BOOLEAN | ❌ | Founder/Admin | Collaboration interest |
| **mentorship_offering** | Community | BOOLEAN | ❌ | Founder/Admin | Mentorship offering |
| **open_to_future_contact** | Community | BOOLEAN | ❌ | Founder/Admin | Future contact |
| **pacific_identity** | - | TEXT[] | ❌ | Founder/Admin | Pacific identity |
| **serves_pacific_communities** | - | TEXT | ❌ | Founder/Admin | Communities served |
| **culture_influences_business** | - | BOOLEAN | ❌ | Founder/Admin | Cultural influence |
| **culture_influence_details** | - | TEXT | ❌ | Founder/Admin | Cultural details |
| **angel_investor_interest** | - | TEXT | ❌ | Founder/Admin | Investor interest |
| **investor_capacity** | - | TEXT | ❌ | Founder/Admin | Investment capacity |
| **goals_details** | - | TEXT | ❌ | Founder/Admin | Personal goals |
| **goals_next_12_months_array** | - | TEXT[] | ❌ | Founder/Admin | 12-month goals |
| **mentorship_access** | - | BOOLEAN | ❌ | Founder/Admin | Mentorship access |
| **barriers_to_mentorship** | - | TEXT | ❌ | Founder/Admin | Mentorship barriers |
| **submitted_date** | - | TIMESTAMP | Auto | Founder/Admin | Submission time |
| **created_at** | - | TIMESTAMP | Auto | Founder/Admin | Creation time |
| **updated_at** | - | TIMESTAMP | Auto | Founder/Admin | Update time |

---

## 🗂️ **Form to Database Mapping**

### **✅ BusinessProfileForm Sections**

| Form Section | Target Table(s) | Field Count | Notes |
|--------------|-----------------|-------------|-------|
| **CoreInfo** | businesses | 4 | Core business identity (name, handle, tagline, description) |
| **ContactDetails** | businesses | 5 | Business contact information |
| **Location** | businesses | 6 | Full address and location details |
| **BrandMedia** | businesses | 3 | Visual assets (logo, banners) |
| **BusinessOverview** | businesses + business_insights | 5 | Business details and stage |
| **Challenges** | business_insights | 1 | Business challenges |
| **Community** | founder_insights | 6 | Founder-specific data |

### **✅ Data Transformation Flow**

```javascript
// Input: Form Data Object
const formData = {
  business_name: "Business Name",
  business_handle: "business-name",
  // ... all form fields
};

// Transformation
const { businessesData, businessInsightsData } = transformBusinessFormData(formData);

// Output: Split Data for Database
businessesData = {
  business_name: "Business Name",
  business_handle: "business-name",
  // ... businesses table fields
};

businessInsightsData = {
  business_stage: "growth-stage",
  top_challenges_array: ["challenge1", "challenge2"],
  // ... business_insights table fields
};
```

---

## 👁️ **Public Profile Fields**

### **✅ Always Visible**

| Field | Source | Display Location |
|-------|--------|------------------|
| **business_name** | businesses.business_name | Profile title |
| **logo_url** | businesses.logo_url | Profile image |
| **tagline** | businesses.tagline | Subtitle |
| **description** | businesses.description | Full description |
| **city** | businesses.city | Location badge |
| **country** | businesses.country | Location badge |
| **industry** | businesses.industry | Industry badge |
| **is_verified** | businesses.is_verified | Verification badge |

### **✅ Conditionally Visible**

| Field | Source | Condition | Display Location |
|-------|--------|-----------|------------------|
| **business_email** | businesses.business_email | If provided | Contact button |
| **business_phone** | businesses.business_phone | If provided | Contact button |
| **business_website** | businesses.business_website | If provided | Website link |
| **business_hours** | businesses.business_hours | If provided | Hours section |
| **team_size_band** | businesses.team_size_band | If provided | Details section |
| **revenue_band** | businesses.revenue_band | If provided | Details section |
| **year_started** | businesses.year_started | If provided | Details section |

### **❌ Never Visible Publicly**

| Field | Source | Reason |
|-------|--------|--------|
| **business_contact_person** | businesses | Privacy |
| **address** | businesses | Privacy |
| **suburb** | businesses | Privacy |
| **state_region** | businesses | Privacy |
| **postal_code** | businesses | Privacy |
| **role** | businesses | Privacy |
| **private_business_phone** | business_insights | Privacy |
| **private_business_email** | business_insights | Privacy |
| **top_challenges_array** | business_insights | Internal |
| **business_stage** | business_insights | Internal |
| **All founder_insights fields** | founder_insights | Privacy |

---

## 🔄 **Data Flow Summary**

### **✅ Save Process**

```
User Input
    ↓
Client Validation
    ↓
Form Submission
    ↓
transformBusinessFormData()
    ↓
┌─────────────────┬─────────────────┐
│   businesses    │ business_insights│
│     Data        │      Data       │
└─────────────────┴─────────────────┘
    ↓                    ↓
Parallel Saves        Parallel Saves
    ↓                    ↓
Success Response ← Success Response
```

### **✅ Load Process**

```
Business ID
    ↓
getBusinessById()
    ↓
Query businesses table
    ↓
Query business_insights table
    ↓
Data Merge: {...businessesData, ...insightsData}
    ↓
Form Initialization
    ↓
UI Render
```

---

## 📊 **Field Validation Rules**

### **✅ Required Fields**

| Field | Validation | Error Message |
|-------|-------------|---------------|
| **business_name** | Not empty | Business name is required |
| **business_handle** | Not empty, unique, format | Business handle is required |
| **country** | Not empty | Country is required |
| **industry** | Not empty | Industry is required |

### **✅ Format Validation**

| Field | Format | Example |
|-------|--------|---------|
| **business_handle** | /^[a-z0-9-]+$/ | "my-business-123" |
| **business_email** | Email format | "user@example.com" |
| **business_website** | URL format | "https://example.com" |

### **✅ Array Validation**

| Field | Max Items | Validation |
|-------|-----------|------------|
| **top_challenges_array** | 5 | Maximum 5 challenges |

---

## 🎯 **Recent Changes**

### **✅ Field Name Standardization (March 2026)**

**Businesses table field renames:**
- `name` → `business_name`
- `contact_email` → `business_email`
- `contact_phone` → `business_phone`
- `contact_website` → `business_website`
- `business_registered` → `is_business_registered`

**New fields added:**
- `business_contact_person` - Contact person name
- `address` - Street address
- `suburb` - Suburb/Area
- `state_region` - State/Region
- `postal_code` - Postal code
- `role` - User role in business

**Fields removed:**
- `business_owner` - Moved to `business_contact_person`
- `business_owner_email` - Removed for privacy
- `additional_owner_emails` - Removed for simplicity
- `languages_spoken` - Removed
- `cultural_identity` - Removed
- `sales_channels` - Removed

### **✅ Fields Removed from business_insights (March 2026)**
- expansion_plans
- support_needed_next_array
- current_support_sources_array
- hiring_intentions
- current_funding_source
- funding_amount_needed
- funding_purpose
- investment_stage
- investment_exploration
- community_impact_areas_array
- industry (duplicate)

### **✅ Impact**

- **Consistent naming** - All business fields now use `business_` prefix
- **Better privacy** - Private contact fields properly separated
- **Complete addresses** - Full address support with all components
- **Database size reduced** - 11 fields removed from business_insights
- **Form complexity reduced** - Fewer fields to fill out
- **Performance improved** - Smaller data payloads
- **User experience enhanced** - Simpler, more intuitive forms

---

## 📞 **Field Support**

### **✅ Adding New Fields**

1. **Update Form State** - Add to BusinessProfileForm state
2. **Create UI Component** - Add to appropriate form section
3. **Update Data Transformer** - Map to correct table
4. **Update Validation** - Add validation rules
5. **Update Documentation** - Update this mapping

### **✅ Field Changes**

1. **Database Migration** - Create migration script
2. **Update Forms** - Modify form components
3. **Update Transformers** - Update data mapping
4. **Update Queries** - Modify database queries
5. **Update Documentation** - Keep docs in sync

---

**This field mapping reference reflects the current optimized state of the Pacific Market platform.** 🎯
