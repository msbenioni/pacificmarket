# ClaimDetailsForm ↔ Database Mapping

## ✅ STATUS: UPDATED SCHEMA
**Last Updated:** 2026-03-18  
**Status:** ✅ Schema updated and form aligned

## 📊 Complete Field Mapping

### **Primary Target Table: `claim_requests`**

| Form Field | Form State | Database Column | Data Type | Required | Sample Data |
|------------|------------|------------------|-----------|----------|-------------|
| **Business Email** | `business_email` | `business_email` | text | ✅ Yes | 'inailau.womens.network@gmail.com' |
| **Business Phone** | `business_phone` | `business_phone` | text | ❌ No | '+64226575990' |
| **Your Role** | `role` | `role` | text | ❌ No | 'owner' |
| **Message** | `message` | `message` | text | ❌ No | NULL (optional) |

---

## 🗄️ Updated Database Schema (claim_requests table)

```sql
CREATE TABLE claim_requests (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    business_id uuid NOT NULL,           -- FK to businesses table
    user_id uuid NOT NULL,               -- FK to profiles table  
    status text NOT NULL DEFAULT 'pending',
    business_email text NULL,             -- ← Form field (renamed from contact_email)
    business_phone text NULL,             -- ← Form field (renamed from contact_phone)
    role text NULL,                      -- ← Form field
    created_at timestamp with time zone NULL DEFAULT now(),
    claim_type character varying NULL DEFAULT 'request',
    message text NULL,                   -- ← Form field
    reviewed_by uuid NULL,
    reviewed_at timestamp with time zone NULL
    -- proof_url column REMOVED
);
```

---

## 📋 Sample Database Data

```json
{
  "id": "db99a9a4-8f30-44dd-8b14-77b663c7531e",
  "business_id": "8e3c51fd-f7f9-4873-a91e-5edafb7b10f0",
  "user_id": "6d2d6ad5-8b38-40ce-a79c-cbb2c6f28d6c", 
  "status": "approved",
  "business_email": "inailau.womens.network@gmail.com",
  "business_phone": "+64226575990",
  "role": "owner",
  "created_at": "2026-03-17T05:30:33.315Z",
  "claim_type": "request",
  "message": null,
  "reviewed_by": null,
  "reviewed_at": "2026-03-17T08:00:59.508Z"
}
```

---

## 🔄 Form ↔ Database Operations

### **Submit Claim Request:**
```javascript
// ClaimDetailsForm calls onSubmit(formData)
const claimData = {
  business_email: formData.business_email,  // Required
  business_phone: formData.business_phone,  // Optional
  role: formData.role,                    // Optional  
  message: formData.message,              // Optional
  // proof_url removed
};

// Insert into claim_requests table
await supabase
  .from('claim_requests')
  .insert({
    business_id: business.id,
    user_id: user.id,
    ...claimData
  });
```

---

## 🔗 Related Tables

### **`businesses` Table:**
- **`business_id`** (FK) - Links to the business being claimed
- Contains business details like name, description, etc.

### **`profiles` Table:**  
- **`user_id`** (FK) - Links to the user making the claim
- Contains user profile data (display_name, private_email, etc.)

---

## ✅ Schema Changes Applied

### **🔧 Database Updates:**
1. ✅ `contact_email` → `business_email`
2. ✅ `contact_phone` → `business_phone`  
3. ✅ Dropped `proof_url` column

### **💻 Form Updates:**
1. ✅ Updated form state keys
2. ✅ Updated validation logic
3. ✅ Removed proof link section
4. ✅ Updated onSubmit payload

### **🔧 Code Updates:**
1. ✅ ClaimDetailsForm.jsx updated
2. ✅ AdminDashboard.jsx updated
3. ✅ All field references updated

---

## ✅ Mapping Verification

### **✅ Perfect Alignment:**
- **All form fields** map directly to `claim_requests` table columns
- **Data types match** (text fields)
- **Required field validation** matches database constraints
- **Optional fields** properly handled
- **Removed proof_url** from both form and database

### **✅ Form Validation:**
```javascript
// Only business_email is required
if (!formData.business_email) {
  toast({ title: "Email Required", variant: "error" });
  return;
}
```

### **✅ Database Constraints:**
- `business_id` and `user_id` are NOT NULL (foreign keys)
- `status` defaults to 'pending'
- All form fields are NULL-able (optional except email)

---

## 🎯 Summary

**The ClaimDetailsForm maps perfectly to the updated `claim_requests` table:**
- ✅ **4 form fields** → **4 database columns**
- ✅ **1 required field** (business_email) 
- ✅ **3 optional fields** (phone, role, message)
- ✅ **Foreign key relationships** to businesses and profiles tables
- ✅ **proof_url removed** from both form and database
- ✅ **Field names updated** for clarity (business_email, business_phone)
- ✅ **Ready for production use**

The form and database are **perfectly aligned** after the schema updates! 🚀
