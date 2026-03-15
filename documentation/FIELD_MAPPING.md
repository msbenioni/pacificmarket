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
| **name** | CoreInfo | TEXT | ✅ | ✅ | Business name |
| **business_handle** | CoreInfo | TEXT | ✅ | ✅ | Unique identifier |
| **tagline** | CoreInfo | TEXT | ❌ | ✅ | Short description |
| **description** | CoreInfo | TEXT | ❌ | ✅ | Full description |
| **logo_url** | BrandMedia | TEXT | ❌ | ✅ | Business logo |
| **banner_url** | BrandMedia | TEXT | ❌ | ✅ | Desktop banner |
| **mobile_banner_url** | BrandMedia | TEXT | ❌ | ✅ | Mobile banner |
| **business_owner** | CoreInfo | TEXT | ❌ | ❌ | Owner name (private) |
| **business_owner_email** | CoreInfo | TEXT | ❌ | ❌ | Owner email (private) |
| **additional_owner_emails** | CoreInfo | TEXT[] | ❌ | ❌ | Multiple owners (private) |
| **contact_email** | CoreInfo | TEXT | ❌ | ✅ | Public contact email |
| **contact_phone** | CoreInfo | TEXT | ❌ | ✅ | Public contact phone |
| **contact_website** | CoreInfo | TEXT | ❌ | ✅ | Website URL |
| **business_hours** | CoreInfo | TEXT | ❌ | ✅ | Operating hours |
| **country** | Location | TEXT | ✅ | ✅ | Business location |
| **industry** | Location | TEXT | ✅ | ✅ | Business industry |
| **city** | Location | TEXT | ❌ | ✅ | Business city |
| **year_started** | Overview | TEXT | ❌ | ✅ | Founding year |
| **business_structure** | Overview | TEXT | ❌ | ✅ | Legal structure |
| **team_size_band** | Overview | TEXT | ❌ | ✅ | Team size category |
| **revenue_band** | Overview | TEXT | ❌ | ✅ | Revenue category |
| **business_registered** | Overview | BOOLEAN | ❌ | ❌ | Registration status |
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
| **CoreInfo** | businesses | 10 | Core business identity and contact |
| **BrandMedia** | businesses | 3 | Visual assets |
| **Location** | businesses | 3 | Geographic information |
| **Overview** | businesses + business_insights | 6 | Business details and stage |
| **Financial** | - | 1 | Only financial_challenges (no DB storage) |
| **Challenges** | business_insights | 2 | Business challenges |
| **Growth** | businesses | 2 | Goals and trade status |
| **Community** | founder_insights | 6 | Founder-specific data |

### **✅ Data Transformation Flow**

```javascript
// Input: Form Data Object
const formData = {
  name: "Business Name",
  business_handle: "business-name",
  // ... all form fields
};

// Transformation
const { businessesData, businessInsightsData } = transformBusinessFormData(formData);

// Output: Split Data for Database
businessesData = {
  name: "Business Name",
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
| **name** | businesses.name | Profile title |
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
| **contact_email** | businesses.contact_email | If provided | Contact button |
| **contact_phone** | businesses.contact_phone | If provided | Contact button |
| **contact_website** | businesses.contact_website | If provided | Website link |
| **business_hours** | businesses.business_hours | If provided | Hours section |
| **team_size_band** | businesses.team_size_band | If provided | Details section |
| **revenue_band** | businesses.revenue_band | If provided | Details section |
| **year_started** | businesses.year_started | If provided | Details section |

### **❌ Never Visible Publicly**

| Field | Source | Reason |
|-------|--------|--------|
| **business_owner_email** | businesses | Privacy |
| **additional_owner_emails** | businesses | Privacy |
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
| **name** | Not empty | Business name is required |
| **business_handle** | Not empty, unique, format | Business handle is required |
| **country** | Not empty | Country is required |
| **industry** | Not empty | Industry is required |

### **✅ Format Validation**

| Field | Format | Example |
|-------|--------|---------|
| **business_handle** | /^[a-z0-9-]+$/ | "my-business-123" |
| **contact_email** | Email format | "user@example.com" |
| **contact_website** | URL format | "https://example.com" |

### **✅ Array Validation**

| Field | Max Items | Validation |
|-------|-----------|------------|
| **top_challenges_array** | 5 | Maximum 5 challenges |
| **additional_owner_emails** | 5 | Maximum 5 emails |

---

## 🎯 **Recent Changes**

### **✅ Fields Removed (March 2026)**

**From business_insights table:**
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

**From forms:**
- All financial fields from FinancialOverviewSection
- Support fields from ChallengesSection
- Growth fields from GrowthSection
- Community impact fields from CommunitySection

### **✅ Impact**

- **Database size reduced** - 11 fields removed from business_insights
- **Form complexity reduced** - Fewer fields to fill out
- **Performance improved** - Smaller data payloads
- **User experience enhanced** - Simpler forms

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
