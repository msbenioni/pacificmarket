# Founder Insights Form Data Mapping (ARCHIVED)

## ⚠️ **ARCHIVED - This documentation reflects the OLD field structure**

### **� Archive Date:** March 15, 2026  
### **🎯 Reason:** Major field cleanup and simplification

---

## **🔧 Previous Form Field Mapping (ARCHIVED)**

### **1. Founder Background Section**
| Form Field | Database Column | Type | Status |
|------------|-----------------|------|--------|
| `gender` | `gender` | text | ✅ Kept |
| `age_range` | `age_range` | text | ✅ Kept |
| `years_entrepreneurial` | `years_entrepreneurial` | integer | ✅ Kept |
| `businesses_founded` | `businesses_founded` | integer | ✅ Kept |
| `founder_role` | `founder_role` | text | ✅ Kept |
| `founder_motivation_array` | `founder_motivation_array` | array | ✅ Kept |
| `founder_story` | `founder_story` | text | ✅ Kept |

### **2. Pacific Context Section**
| Form Field | Database Column | Type | Status |
|------------|-----------------|------|--------|
| `serves_pacific_communities` | `serves_pacific_communities` | boolean | ✅ Kept |
| `culture_influences_business` | `culture_influences_business` | boolean | ✅ Kept |
| `culture_influence_details` | `culture_influence_details` | text | ✅ Kept |
| `family_community_responsibilities_affect_business` | `family_community_responsibilities_affect_business` | boolean | ✅ Kept |
| `responsibilities_impact_details` | `responsibilities_impact_details` | text | ✅ Kept |

### **3. Financial & Investment Section (REMOVED)**
| Form Field | Database Column | Type | Status |
|------------|-----------------|------|--------|
| `current_funding_source` | `current_funding_source` | text | ❌ **REMOVED** |
| `investment_stage` | `investment_stage` | text | ❌ **REMOVED** |
| `revenue_streams` | `revenue_streams` | array | ❌ **REMOVED** |
| `financial_challenges` | `financial_challenges` | text | ❌ **REMOVED** |
| `funding_amount_needed` | `funding_amount_needed` | integer | ❌ **REMOVED** |
| `funding_purpose` | `funding_purpose` | text | ❌ **REMOVED** |
| `angel_investor_interest` | `angel_investor_interest` | boolean | ❌ **REMOVED** |
| `investor_capacity` | `investor_capacity` | text | ❌ **REMOVED** |

### **4. Challenges & Support Section (SIMPLIFIED)**
| Form Field | Database Column | Type | Status |
|------------|-----------------|------|--------|
| `top_challenges` | `top_challenges` | array | ✅ Kept |
| `support_needed_next` | `support_needed_next` | array | ❌ **REMOVED** |

### **5. Growth & Future Section (SIMPLIFIED)**
| Form Field | Database Column | Type | Status |
|------------|-----------------|------|--------|
| `business_stage` | `business_stage` | text | ✅ Kept |
| `goals_next_12_months_array` | `goals_next_12_months_array` | array | ✅ Kept |
| `goals_details` | `goals_details` | text | ✅ Kept |
| `hiring_intentions` | `hiring_intentions` | text | ❌ **REMOVED** |
| `expansion_plans` | `expansion_plans` | text | ❌ **REMOVED** |

### **6. Community & Impact Section (SIMPLIFIED)**
| Form Field | Database Column | Type | Status |
|------------|-----------------|------|--------|
| `community_impact_areas` | `community_impact_areas` | array | ❌ **REMOVED** |
| `collaboration_interest` | `collaboration_interest` | boolean | ✅ Kept |
| `mentorship_offering` | `mentorship_offering` | text | ✅ Kept |
| `open_to_future_contact` | `open_to_future_contact` | boolean | ✅ Kept |

---

## **� Field Removal Summary**

### **✅ Fields Removed (12 total):**
1. **Financial Section (8 fields):**
   - current_funding_source
   - investment_stage
   - revenue_streams
   - financial_challenges
   - funding_amount_needed
   - funding_purpose
   - angel_investor_interest
   - investor_capacity

2. **Support Fields (2 fields):**
   - support_needed_next
   - current_support_sources

3. **Growth Fields (2 fields):**
   - hiring_intentions
   - expansion_plans

4. **Community Field (1 field):**
   - community_impact_areas

### **✅ Fields Kept (16 total):**
- **Founder Background (7 fields)** - All kept
- **Pacific Context (5 fields)** - All kept
- **Growth & Future (3 fields)** - Simplified but kept
- **Community & Impact (3 fields)** - Simplified but kept
- **Challenges (1 field)** - Simplified but kept

---

## **� Current State (2026-03-15)**

### **✅ Updated Documentation:**
- **Current field mapping** → `documentation/FIELD_MAPPING.md`
- **Current forms structure** → `documentation/FORMS.md`
- **Current database schema** → `documentation/DATABASE.md`

### **✅ Key Changes:**
- **Financial section completely removed** from all forms
- **Support fields simplified** to only top challenges
- **Growth section simplified** to core goals and stage
- **Community section simplified** to collaboration and mentorship
- **All UI components updated** to reflect new structure
- **Database migrations executed** to remove columns

---

## **🎯 Migration Notes**

### **✅ Database Changes:**
```sql
-- Removed from founder_insights table
ALTER TABLE founder_insights 
DROP COLUMN IF EXISTS current_funding_source,
DROP COLUMN IF EXISTS investment_stage,
DROP COLUMN IF EXISTS revenue_streams,
DROP COLUMN IF EXISTS financial_challenges,
DROP COLUMN IF EXISTS funding_amount_needed,
DROP COLUMN IF EXISTS funding_purpose,
DROP COLUMN IF EXISTS angel_investor_interest,
DROP COLUMN IF EXISTS investor_capacity,
DROP COLUMN IF EXISTS support_needed_next_array,
DROP COLUMN IF EXISTS current_support_sources_array,
DROP COLUMN IF EXISTS hiring_intentions,
DROP COLUMN IF EXISTS expansion_plans,
DROP COLUMN IF EXISTS community_impact_areas_array;
```

### **✅ Form Changes:**
- **FounderInsightsSummary.jsx** - Removed financial section entirely
- **BusinessInsightsAccordion.jsx** - Simplified sections
- **BusinessProfileForm.jsx** - Removed financial section
- **All form sections** - Updated field mappings

---

## **📚 Reference Current Documentation**

For the **current** field structure and mappings, please refer to:

- **`documentation/FIELD_MAPPING.md`** - Current field mappings
- **`documentation/FORMS.md`** - Current form structure
- **`documentation/DATABASE.md`** - Current database schema

---

## **🎉 Archive Complete**

**This documentation is preserved for historical reference only.**

**The current system has been significantly simplified and streamlined.**

**All forms, components, and database structures have been updated accordingly.**

---

*Archived on March 15, 2026* �
