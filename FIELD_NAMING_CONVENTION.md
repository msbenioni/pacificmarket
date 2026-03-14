# 🏗️ Field Naming Convention Standard

## 🎯 Overview

This document establishes a standardized naming convention for all form fields and database columns to ensure consistency across the Pacific Market application.

---

## 📋 Naming Principles

### **🔤 General Rules**
1. **snake_case** for all database columns
2. **camelCase** for form field names
3. **Descriptive and clear** - avoid abbreviations unless widely understood
4. **Consistent terminology** across all forms and tables
5. **No duplicate field names** for the same concept

### **📊 Data Type Conventions**
- **Arrays** → `*_array` suffix (e.g., `social_links_array`)
- **Boolean flags** → `is_*` prefix (e.g., `is_verified`)
- **Timestamps** → `*_at` suffix (e.g., `created_at`)
- **IDs** → `*_id` suffix (e.g., `business_id`)
- **Counts** → `*_count` suffix (e.g., `employee_count`)

---

## 🏢 Standardized Field Mappings

### **📋 Core Business Fields**

| Form Field | Database Column | Table | Notes |
|-----------|----------------|-------|-------|
| `name` | `name` | `businesses` | ✅ Already standard |
| `businessHandle` | `business_handle` | `businesses` | ✅ Already standard |
| `shortDescription` | `tagline` | `businesses` | ✅ Already standard |
| `tagline` | `tagline` | `businesses` | ✅ Already standard |
| `description` | `description` | `businesses` | ✅ Already standard |
| `industry` | `industry` | `businesses` | ✅ Already standard |
| `country` | `country` | `businesses` | ✅ Already standard |
| `city` | `city` | `businesses` | ✅ Already standard |
| `yearStarted` | `year_started` | `businesses` | ✅ Already standard |
| `businessType` | `business_type` | `businesses` | ✅ Already standard |
| `businessStructure` | `business_structure` | `businesses` | ✅ Already standard |

### **📞 Contact Information Fields**

| Form Field | Database Column | Table | Notes |
|-----------|----------------|-------|-------|
| `contactEmail` | `contact_email` | `businesses` | ✅ Already standard |
| `contactPhone` | `contact_phone` | `businesses` | ✅ Already standard |
| `publicPhone` | `public_phone` | `businesses` | ✅ Already standard |
| `contactWebsite` | `contact_website` | `businesses` | **STANDARDIZE** (replace `website`) |
| `businessHours` | `business_hours` | `businesses` | ✅ Already standard |
| `privateBusinessPhone` | `private_business_phone` | `business_insights` | ✅ Already standard |
| `privateBusinessEmail` | `private_business_email` | `business_insights` | ✅ Already standard |

### **🖼️ Media & Branding Fields**

| Form Field | Database Column | Table | Notes |
|-----------|----------------|-------|-------|
| `logoUrl` | `logo_url` | `businesses` | ✅ Already standard |
| `bannerUrl` | `banner_url` | `businesses` | ✅ Already standard |
| `socialLinksArray` | `social_links` | `businesses` | **STANDARDIZE** (JSONB array) |

### **🏭 Business Operations Fields**

| Form Field | Database Column | Table | Notes |
|-----------|----------------|-------|-------|
| `businessOperatingStatus` | `business_operating_status` | `businesses` / `business_insights` | ✅ Already standard |
| `businessAge` | `business_age` | `business_insights` | ✅ Already standard |
| `teamSizeBand` | `team_size_band` | `businesses` / `business_insights` | **STANDARDIZE** (replace `team_size`) |
| `isBusinessRegistered` | `business_registered` | `businesses` / `business_insights` | **STANDARDIZE** |
| `employsAnyone` | `employs_anyone` | `business_insights` | ✅ Already standard |
| `employsFamilyCommunity` | `employs_family_community` | `business_insights` | ✅ Already standard |
| `salesChannelsArray` | `sales_channels` | `business_insights` | **STANDARDIZE** (JSONB array) |
| `revenueBand` | `revenue_band` | `businesses` / `business_insights` | ✅ Already standard |

### **👤 Founder & Personal Fields**

| Form Field | Database Column | Table | Notes |
|-----------|----------------|-------|-------|
| `gender` | `gender` | `founder_insights` | ✅ Already standard |
| `ageRange` | `age_range` | `founder_insights` | ✅ Already standard |
| `yearsEntrepreneurial` | `years_entrepreneurial` | `founder_insights` | ✅ Already standard |
| `businessesFounded` | `businesses_founded` | `founder_insights` | ✅ Already standard |
| `founderRole` | `founder_role` | `founder_insights` | ✅ Already standard |
| `founderStory` | `founder_story` | `founder_insights` | ✅ Already standard |
| `founderMotivationArray` | `founder_motivation_array` | `founder_insights` | ✅ Already standard |

### **🌏 Pacific Context Fields**

| Form Field | Database Column | Table | Notes |
|-----------|----------------|-------|-------|
| `pacificIdentityArray` | `pacific_identity` | `founder_insights` | **STANDARDIZE** (JSONB array) |
| `basedInCountry` | `based_in_country` | `founder_insights` | ✅ Already standard |
| `basedInCity` | `based_in_city` | `founder_insights` | ✅ Already standard |
| `servesPacificCommunities` | `serves_pacific_communities` | `founder_insights` | ✅ Already standard |
| `cultureInfluencesBusiness` | `culture_influences_business` | `founder_insights` | ✅ Already standard |
| `cultureInfluenceDetails` | `culture_influence_details` | `founder_insights` | ✅ Already standard |
| `familyCommunityResponsibilitiesAffectBusiness` | `family_community_responsibilities_affect_business` | `founder_insights` | **SHORTEN** |
| `responsibilitiesImpactDetails` | `responsibilities_impact_details` | `founder_insights` | ✅ Already standard |
| `culturalIdentityArray` | `cultural_identity` | `businesses` | **STANDARDIZE** (JSONB array) |
| `languagesSpokenArray` | `languages_spoken` | `businesses` | **STANDARDIZE** (JSONB array) |

### **💰 Financial & Growth Fields**

| Form Field | Database Column | Table | Notes |
|-----------|----------------|-------|-------|
| `fundingSource` | `current_funding_source` | `business_insights` | ✅ Already standard |
| `fundingAmountNeeded` | `funding_amount_needed` | `business_insights` | ✅ Already standard |
| `fundingPurpose` | `funding_purpose` | `business_insights` | ✅ Already standard |
| `investmentStage` | `investment_stage` | `business_insights` | ✅ Already standard |
| `revenueStreamsArray` | `revenue_streams` | `business_insights` | **STANDARDIZE** (JSONB array) |
| `businessStage` | `business_stage` | `business_insights` | **STANDARDIZE** (replace `growth_stage`) |
| `fullTimeEmployeeCount` | `full_time_employee_count` | **NEW FIELD** | **ADD** |
| `partTimeEmployeeCount` | `part_time_employee_count` | **NEW FIELD** | **ADD** |

### **🤝 Support & Community Fields**

| Form Field | Database Column | Table | Notes |
|-----------|----------------|-------|-------|
| `topChallengesArray` | `top_challenges` | `business_insights` | **STANDARDIZE** (JSONB array) |
| `supportNeededNextArray` | `support_needed_next` | `business_insights` | **STANDARDIZE** (JSONB array) |
| `currentSupportSourcesArray` | `current_support_sources` | `business_insights` | **STANDARDIZE** (JSONB array) |
| `hasMentorshipAccess` | `mentorship_access` | `founder_insights` | **STANDARDIZE** |
| `offersMentorship` | `mentorship_offering` | `founder_insights` | **STANDARDIZE** |
| `barriersToMentorship` | `barriers_to_mentorship` | `founder_insights` | ✅ Already standard |
| `angelInvestorInterest` | `angel_investor_interest` | `founder_insights` | ✅ Already standard |
| `investorCapacity` | `investor_capacity` | `founder_insights` | ✅ Already standard |
| `hasCollaborationInterest` | `collaboration_interest` | `founder_insights` | **STANDARDIZE** |
| `isOpenToFutureContact` | `open_to_future_contact` | `founder_insights` | **STANDARDIZE** |
| `communityImpactAreasArray` | `community_impact_areas` | `business_insights` | **STANDARDIZE** (JSONB array) |
| `goalsNext12MonthsArray` | `goals_next_12_months_array` | `founder_insights` | ✅ Already standard |

### **🔧 Admin & System Fields**

| Form Field | Database Column | Table | Notes |
|-----------|----------------|-------|-------|
| `status` | `status` | `businesses` | ✅ Already standard |
| `isVerified` | `verified` | `businesses` | **STANDARDIZE** |
| `isClaimed` | `claimed` | `businesses` | **STANDARDIZE** |
| `subscriptionTier` | `subscription_tier` | `businesses` | ✅ Already standard |
| `isHomepageFeatured` | `homepage_featured` | `businesses` | **STANDARDIZE** |
| `ownerUserId` | `owner_user_id` | `businesses` | ✅ Already standard |
| `businessOwner` | `business_owner` | `businesses` | ✅ Already standard |
| `businessOwnerEmail` | `business_owner_email` | `businesses` | ✅ Already standard |
| `additionalOwnerEmailsArray` | `additional_owner_emails` | `businesses` | **STANDARDIZE** (JSONB array) |
| `dataSource` | `source` | `businesses` | ✅ Already standard |
| `createdAt` | `created_at` | `businesses` | ✅ Already standard |
| `updatedAt` | `updated_at` | `businesses` | ✅ Already standard |

---

## 🔄 Required Changes

### **🔧 Field Name Standardizations**

#### **1. Contact Fields**
- `website` → `contactWebsite` (use `contactWebsite` consistently)
- `team_size` → `teamSizeBand` (use `teamSizeBand` consistently)
- `growth_stage` → `businessStage` (use `businessStage` consistently)

#### **2. Boolean Fields**
- `verified` → `isVerified`
- `claimed` → `isClaimed`
- `homepage_featured` → `isHomepageFeatured`
- `business_registered` → `isBusinessRegistered`
- `employs_anyone` → `employsAnyone`
- `employs_family_community` → `employsFamilyCommunity`
- `culture_influences_business` → `cultureInfluencesBusiness`
- `mentorship_access` → `hasMentorshipAccess`
- `mentorship_offering` → `offersMentorship`
- `collaboration_interest` → `hasCollaborationInterest`
- `open_to_future_contact` → `isOpenToFutureContact`

#### **3. Array Fields**
- Add `Array` suffix to form field names for clarity:
  - `social_links` → `socialLinksArray`
  - `sales_channels` → `salesChannelsArray`
  - `top_challenges` → `topChallengesArray`
  - `support_needed_next` → `supportNeededNextArray`
  - `current_support_sources` → `currentSupportSourcesArray`
  - `revenue_streams` → `revenueStreamsArray`
  - `community_impact_areas` → `communityImpactAreasArray`
  - `goals_next_12_months` → `goalsNext12MonthsArray`
  - `founder_motivation_array` → `founderMotivationArray`
  - `pacific_identity` → `pacificIdentityArray`
  - `cultural_identity` → `culturalIdentityArray`
  - `languages_spoken` → `languagesSpokenArray`
  - `additional_owner_emails` → `additionalOwnerEmailsArray`

#### **4. New Fields**
- Add detailed employee count fields:
  - `full_time_employee_count` → `fullTimeEmployeeCount`
  - `part_time_employee_count` → `partTimeEmployeeCount`

#### **5. Long Field Names**
- `family_community_responsibilities_affect_business` → `familyCommunityResponsibilitiesImpact`
- `family_community_responsibilities_affect_business` → `familyCommunityResponsibilitiesImpact` (shortened)

---

## 📝 Implementation Strategy

### **Phase 1: Database Schema Updates**
```sql
-- Add new fields
ALTER TABLE businesses ADD COLUMN full_time_employee_count INTEGER;
ALTER TABLE businesses ADD COLUMN part_time_employee_count INTEGER;

-- Rename columns (if needed)
-- Note: Consider migration strategy for existing data
```

### **Phase 2: Form Updates**
- Update all form components to use standardized field names
- Update data transformation functions
- Update validation schemas

### **Phase 3: Data Migration**
- Migrate existing data to new field names
- Update API endpoints
- Update data fetching logic

---

## 🎯 Validation Rules

### **✅ Field Name Validation**
```javascript
// Validation patterns for standardized names
const FIELD_PATTERNS = {
  // Boolean fields should start with 'is_'
  boolean: /^is_[a-z]+$/,
  
  // Array fields should end with '_array'
  array: /[a-z_]+_array$/,
  
  // Timestamp fields should end with '_at'
  timestamp: /[a-z_]+_at$/,
  
  // ID fields should end with '_id'
  id: /[a-z_]+_id$/,
  
  // Count fields should end with '_count'
  count: /[a-z_]+_count$/,
  
  // Standard snake_case for database
  database: /^[a-z_]+(_[a-z]+)*$/
};
```

### **✅ Data Type Consistency**
```javascript
// Array field transformations
const transformArrayField = (formData, fieldName) => {
  const arrayField = `${fieldName}Array`;
  return formData[formDataField] || [];
};

// Boolean field transformations
const transformBooleanField = (formData, fieldName) => {
  const booleanField = `is${fieldName.charAt(0).toUpperCase()}${fieldName.slice(1)}`;
  return formData[booleanField] || false;
};
```

---

## 🚀 Migration Checklist

### **📋 Database Changes**
- [ ] Add new fields to tables
- [ ] Consider column renaming strategy
- [ ] Update constraints and indexes
- [ ] Test data migration

### **📝 Form Updates**
- [ ] Update InlineBusinessForm field names
- [ ] Update DetailedBusinessForm field names
- [ ] Update FounderInsightsForm field names
- [ ] Update validation schemas

### **🔄 Data Transformations**
- [ ] Update save functions to use standardized names
- [ ] Update fetch functions to handle both old and new names
- [ ] Update form-to-database transformation logic
- [ ] Test data flow end-to-end

### **🧪 Testing**
- [ ] Unit tests for field transformations
- [ ] Integration tests for form submissions
- [ ] Data migration tests
- [ ] UI tests for form display

---

## 🎯 Confirmed Implementation Strategy

### **✅ User Decisions:**
1. **Rename database columns** - Direct column renaming
2. **No backward compatibility** - Clean break, all changes at once
3. **Array naming convention** - Use `Array` suffix for clarity
4. **Boolean prefix** - Use `is_` prefix for all boolean fields
5. **Employee count fields** - Remove completely from forms and database
6. **Description field strategy** - Use `tagline` consistently, migrate data from `tagline`

---

## 🔄 Database Schema Changes

### **🏢 businesses Table Updates**
```sql
-- Rename columns for consistency
ALTER TABLE businesses RENAME COLUMN website TO contact_website;
ALTER TABLE businesses RENAME COLUMN verified TO is_verified;
ALTER TABLE businesses RENAME COLUMN claimed TO is_claimed;
ALTER TABLE businesses RENAME COLUMN homepage_featured TO is_homepage_featured;
ALTER TABLE businesses RENAME COLUMN business_registered TO is_business_registered;

-- Migrate data from tagline to tagline
UPDATE businesses SET tagline = tagline WHERE tagline IS NOT NULL AND tagline IS NULL;
ALTER TABLE businesses DROP COLUMN tagline;

-- Remove employee count fields (if they exist)
-- ALTER TABLE businesses DROP COLUMN full_time_employee_count;
-- ALTER TABLE businesses DROP COLUMN part_time_employee_count;
```

### **📈 business_insights Table Updates**
```sql
-- Rename columns for consistency
ALTER TABLE business_insights RENAME COLUMN employs_anyone TO employs_anyone;
ALTER TABLE business_insights RENAME COLUMN employs_family_community TO employs_family_community;
ALTER TABLE business_insights RENAME COLUMN business_stage TO business_stage;

-- Remove employee count fields (if they exist)
-- ALTER TABLE business_insights DROP COLUMN full_time_employee_count;
-- ALTER TABLE business_insights DROP COLUMN part_time_employee_count;
```

### **👤 founder_insights Table Updates**
```sql
-- Rename columns for consistency
ALTER TABLE founder_insights RENAME COLUMN mentorship_access TO has_mentorship_access;
ALTER TABLE founder_insights RENAME COLUMN mentorship_offering TO offers_mentorship;
ALTER TABLE founder_insights RENAME COLUMN collaboration_interest TO has_collaboration_interest;
ALTER TABLE founder_insights RENAME COLUMN open_to_future_contact TO is_open_to_future_contact;

-- Shorten long field name
ALTER TABLE founder_insights RENAME COLUMN family_community_responsibilities_affect_business TO family_community_responsibilities_impact;
```

---

## 📝 Updated Field Mappings

### **📋 Core Business Fields (Updated)**

| Form Field | Database Column | Table | Action |
|-----------|----------------|-------|--------|
| `name` | `name` | `businesses` | ✅ Keep |
| `businessHandle` | `business_handle` | `businesses` | ✅ Keep |
| `tagline` | `tagline` | `businesses` | ✅ Keep (migrate data from tagline) |
| `description` | `description` | `businesses` | ✅ Keep |
| `industry` | `industry` | `businesses` | ✅ Keep |
| `country` | `country` | `businesses` | ✅ Keep |
| `city` | `city` | `businesses` | ✅ Keep |
| `yearStarted` | `year_started` | `businesses` | ✅ Keep |
| `businessType` | `business_type` | `businesses` | ✅ Keep |
| `businessStructure` | `business_structure` | `businesses` | ✅ Keep |

### **📞 Contact Information Fields (Updated)**

| Form Field | Database Column | Table | Action |
|-----------|----------------|-------|--------|
| `contactEmail` | `contact_email` | `businesses` | ✅ Keep |
| `contactPhone` | `contact_phone` | `businesses` | ✅ Keep |
| `publicPhone` | `public_phone` | `businesses` | ✅ Keep |
| `contactWebsite` | `contact_website` | `businesses` | ✅ Rename from `website` |
| `businessHours` | `business_hours` | `businesses` | ✅ Keep |
| `privateBusinessPhone` | `private_business_phone` | `business_insights` | ✅ Keep |
| `privateBusinessEmail` | `private_business_email` | `business_insights` | ✅ Keep |

### **🖼️ Media & Branding Fields (Updated)**

| Form Field | Database Column | Table | Action |
|-----------|----------------|-------|--------|
| `logoUrl` | `logo_url` | `businesses` | ✅ Keep |
| `bannerUrl` | `banner_url` | `businesses` | ✅ Keep |
| `socialLinksArray` | `social_links` | `businesses` | ✅ Keep (add Array suffix to form field) |

### **🏭 Business Operations Fields (Updated)**

| Form Field | Database Column | Table | Action |
|-----------|----------------|-------|--------|
| `businessOperatingStatus` | `business_operating_status` | `businesses` / `business_insights` | ✅ Keep |
| `businessAge` | `business_age` | `business_insights` | ✅ Keep |
| `teamSizeBand` | `team_size_band` | `businesses` / `business_insights` | ✅ Keep |
| `isBusinessRegistered` | `is_business_registered` | `businesses` / `business_insights` | ✅ Rename (add is_ prefix) |
| `employsAnyone` | `employs_anyone` | `business_insights` | ✅ Keep |
| `employsFamilyCommunity` | `employs_family_community` | `business_insights` | ✅ Keep |
| `salesChannelsArray` | `sales_channels` | `business_insights` | ✅ Keep (add Array suffix to form field) |
| `revenueBand` | `revenue_band` | `businesses` / `business_insights` | ✅ Keep |
| `businessStage` | `business_stage` | `business_insights` | ✅ Keep (standardize from growth_stage) |

### **👤 Founder & Personal Fields (Updated)**

| Form Field | Database Column | Table | Action |
|-----------|----------------|-------|--------|
| `gender` | `gender` | `founder_insights` | ✅ Keep |
| `ageRange` | `age_range` | `founder_insights` | ✅ Keep |
| `yearsEntrepreneurial` | `years_entrepreneurial` | `founder_insights` | ✅ Keep |
| `businessesFounded` | `businesses_founded` | `founder_insights` | ✅ Keep |
| `founderRole` | `founder_role` | `founder_insights` | ✅ Keep |
| `founderStory` | `founder_story` | `founder_insights` | ✅ Keep |
| `founderMotivationArray` | `founder_motivation_array` | `founder_insights` | ✅ Keep (add Array suffix to form field) |

### **🌏 Pacific Context Fields (Updated)**

| Form Field | Database Column | Table | Action |
|-----------|----------------|-------|--------|
| `pacificIdentityArray` | `pacific_identity` | `founder_insights` | ✅ Keep (add Array suffix to form field) |
| `basedInCountry` | `based_in_country` | `founder_insights` | ✅ Keep |
| `basedInCity` | `based_in_city` | `founder_insights` | ✅ Keep |
| `servesPacificCommunities` | `serves_pacific_communities` | `founder_insights` | ✅ Keep |
| `cultureInfluencesBusiness` | `culture_influences_business` | `founder_insights` | ✅ Keep |
| `cultureInfluenceDetails` | `culture_influence_details` | `founder_insights` | ✅ Keep |
| `familyCommunityResponsibilitiesImpact` | `family_community_responsibilities_impact` | `founder_insights` | ✅ Rename (shortened) |
| `responsibilitiesImpactDetails` | `responsibilities_impact_details` | `founder_insights` | ✅ Keep |
| `culturalIdentityArray` | `cultural_identity` | `businesses` | ✅ Keep (add Array suffix to form field) |
| `languagesSpokenArray` | `languages_spoken` | `businesses` | ✅ Keep (add Array suffix to form field) |

### **💰 Financial & Growth Fields (Updated)**

| Form Field | Database Column | Table | Action |
|-----------|----------------|-------|--------|
| `fundingSource` | `current_funding_source` | `business_insights` | ✅ Keep |
| `fundingAmountNeeded` | `funding_amount_needed` | `business_insights` | ✅ Keep |
| `fundingPurpose` | `funding_purpose` | `business_insights` | ✅ Keep |
| `investmentStage` | `investment_stage` | `business_insights` | ✅ Keep |
| `revenueStreamsArray` | `revenue_streams` | `business_insights` | ✅ Keep (add Array suffix to form field) |

### **🤝 Support & Community Fields (Updated)**

| Form Field | Database Column | Table | Action |
|-----------|----------------|-------|--------|
| `topChallengesArray` | `top_challenges` | `business_insights` | ✅ Keep (add Array suffix to form field) |
| `supportNeededNextArray` | `support_needed_next` | `business_insights` | ✅ Keep (add Array suffix to form field) |
| `currentSupportSourcesArray` | `current_support_sources` | `business_insights` | ✅ Keep (add Array suffix to form field) |
| `hasMentorshipAccess` | `has_mentorship_access` | `founder_insights` | ✅ Rename (add has_ prefix) |
| `offersMentorship` | `offers_mentorship` | `founder_insights` | ✅ Rename |
| `barriersToMentorship` | `barriers_to_mentorship` | `founder_insights` | ✅ Keep |
| `angelInvestorInterest` | `angel_investor_interest` | `founder_insights` | ✅ Keep |
| `investorCapacity` | `investor_capacity` | `founder_insights` | ✅ Keep |
| `hasCollaborationInterest` | `has_collaboration_interest` | `founder_insights` | ✅ Rename (add has_ prefix) |
| `isOpenToFutureContact` | `is_open_to_future_contact` | `founder_insights` | ✅ Rename (add is_ prefix) |
| `communityImpactAreasArray` | `community_impact_areas` | `business_insights` | ✅ Keep (add Array suffix to form field) |
| `goalsNext12MonthsArray` | `goals_next_12_months_array` | `founder_insights` | ✅ Keep |

### **🔧 Admin & System Fields (Updated)**

| Form Field | Database Column | Table | Action |
|-----------|----------------|-------|--------|
| `status` | `status` | `businesses` | ✅ Keep |
| `isVerified` | `is_verified` | `businesses` | ✅ Rename (add is_ prefix) |
| `isClaimed` | `is_claimed` | `businesses` | ✅ Rename (add is_ prefix) |
| `subscriptionTier` | `subscription_tier` | `businesses` | ✅ Keep |
| `isHomepageFeatured` | `is_homepage_featured` | `businesses` | ✅ Rename (add is_ prefix) |
| `ownerUserId` | `owner_user_id` | `businesses` | ✅ Keep |
| `businessOwner` | `business_owner` | `businesses` | ✅ Keep |
| `businessOwnerEmail` | `business_owner_email` | `businesses` | ✅ Keep |
| `additionalOwnerEmailsArray` | `additional_owner_emails` | `businesses` | ✅ Keep (add Array suffix to form field) |
| `dataSource` | `source` | `businesses` | ✅ Keep |
| `createdAt` | `created_at` | `businesses` | ✅ Keep |
| `updatedAt` | `updated_at` | `businesses` | ✅ Keep |

---

## 🚀 Implementation Plan

### **Phase 1: Database Schema Updates**
```sql
-- Execute all column renames in sequence
-- Migrate data from tagline to tagline
-- Remove tagline column
-- Test data integrity
```

### **Phase 2: Form Field Updates**
- Update all form components to use new field names
- Remove `shortDescription` from all forms
- Add `Array` suffix to all array field names
- Update boolean field names with `is_`/`has_` prefixes

### **Phase 3: Data Transformation Logic**
- Update save functions to use new field names
- Update fetch functions to use new field names
- Remove old field name references
- Test data flow end-to-end

### **Phase 4: Testing & Validation**
- Unit tests for field transformations
- Integration tests for form submissions
- Data migration validation
- UI tests for form display

---

## 📝 Data Migration Script

### **🔄 tagline → tagline Migration**
```sql
-- Migrate data from tagline to tagline
UPDATE businesses 
SET tagline = tagline 
WHERE tagline IS NOT NULL AND tagline IS NULL;

-- Verify migration
SELECT COUNT(*) as records_migrated 
FROM businesses 
WHERE tagline IS NOT NULL;

-- Remove old column
ALTER TABLE businesses DROP COLUMN tagline;
```

---

## 🎯 Final Implementation Checklist

### **📋 Database Changes**
- [ ] Rename `website` → `contact_website`
- [ ] Rename boolean fields with `is_`/`has_` prefixes
- [ ] Migrate `tagline` → `tagline`
- [ ] Drop `tagline` column
- [ ] Test data integrity

### **📝 Form Updates**
- [ ] Update InlineBusinessForm field names
- [ ] Update DetailedBusinessForm field names
- [ ] Update FounderInsightsForm field names
- [ ] Remove `shortDescription` references
- [ ] Add `Array` suffix to array fields
- [ ] Update boolean field names

### **🔄 Code Updates**
- [ ] Update transformation functions
- [ ] Update validation schemas
- [ ] Update API endpoints
- [ ] Update data fetching logic

### **🧪 Testing**
- [ ] Unit tests for field transformations
- [ ] Integration tests for form submissions
- [ ] Data migration tests
- [ ] UI tests for form display

---

## 🎉 Ready to Implement

**All decisions confirmed and implementation plan ready!**

**Key Changes:**
- ✅ **Database column renaming** - Direct approach
- ✅ **No backward compatibility** - Clean break
- ✅ **Array naming** - `Array` suffix for clarity
- ✅ **Boolean prefixes** - `is_`/`has_` for consistency
- ✅ **Remove employee counts** - Clean up unused fields
- ✅ **Use tagline only** - Migrate data from `tagline`

**Ready to proceed with implementation!** 🚀

---

## 🎉 Conclusion

This naming convention will provide:
- **Consistency** across all forms and database tables
- **Clarity** in field purposes and data types
- **Maintainability** for future development
- **Scalability** for adding new fields

**Please review the proposed standardizations and confirm any changes or preferences you'd like to make!** 🚀
