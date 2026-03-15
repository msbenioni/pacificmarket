# 🚀 Migration Execution Instructions

## 📋 Field Standardization Migration

This migration standardizes field names across all tables according to the new naming convention.

---

## 🔧 Option 1: Supabase SQL Editor (Recommended)

### **Step 1: Open Supabase SQL Editor**
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **"New query"**

### **Step 2: Execute Migration Script**
Copy and paste the following SQL into the editor:

```sql
-- ============================================================================
-- 🏢 businesses Table Updates
-- ============================================================================

-- 1. Rename columns for consistency
ALTER TABLE businesses RENAME COLUMN website TO contact_website;
ALTER TABLE businesses RENAME COLUMN verified TO is_verified;
ALTER TABLE businesses RENAME COLUMN claimed TO is_claimed;
ALTER TABLE businesses RENAME COLUMN homepage_featured TO is_homepage_featured;

-- 2. Migrate data from tagline to tagline
UPDATE businesses 
SET tagline = tagline 
WHERE tagline IS NOT NULL AND (tagline IS NULL OR tagline = '');

-- 3. Remove the old tagline column
ALTER TABLE businesses DROP COLUMN tagline;

-- ============================================================================
-- 👤 founder_insights Table Updates
-- ============================================================================

-- 1. Rename boolean columns for consistency
ALTER TABLE founder_insights RENAME COLUMN mentorship_access TO has_mentorship_access;
ALTER TABLE founder_insights RENAME COLUMN mentorship_offering TO offers_mentorship;
ALTER TABLE founder_insights RENAME COLUMN collaboration_interest TO has_collaboration_interest;
ALTER TABLE founder_insights RENAME COLUMN open_to_future_contact TO is_open_to_future_contact;

-- 2. Shorten long field name
ALTER TABLE founder_insights RENAME COLUMN family_community_responsibilities_affect_business TO family_community_responsibilities_impact;

-- ============================================================================
-- ✅ Verification Queries
-- ============================================================================

-- Check if all renames were successful
SELECT 
    'businesses' as table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'businesses' 
    AND column_name IN ('contact_website', 'is_verified', 'is_claimed', 'is_homepage_featured', 'tagline')
UNION ALL
SELECT 
    'founder_insights' as table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'founder_insights' 
    AND column_name IN ('has_mentorship_access', 'offers_mentorship', 'has_collaboration_interest', 'is_open_to_future_contact', 'family_community_responsibilities_impact')
ORDER BY table_name, column_name;

-- Verify data migration from tagline to tagline
SELECT 
    COUNT(*) as businesses_with_tagline,
    COUNT(CASE WHEN tagline IS NOT NULL AND tagline != '' THEN 1 END) as businesses_with_non_empty_tagline
FROM businesses;
```

### **Step 3: Run the Script**
1. Click **"Run"** to execute the migration
2. Review the results in the output panel
3. Verify that all column renames were successful

---

## 🔧 Option 2: Command Line (with Connection String)

If you prefer to use the command line, you'll need your Supabase connection string:

```bash
# Set environment variables
export SUPABASE_URL="your-supabase-url"
export SUPABASE_KEY="your-supabase-anon-key"

# Run the migration script
cd database
node run_migration.js
```

**To get your connection details:**
1. Go to Supabase project dashboard
2. Settings → API
3. Copy the **Project URL** and **anon public** key

---

## 🔧 Option 3: psql Command Line

If you have direct database access:

```bash
# Connect to your database
psql "postgresql://[user]:[password]@[host]:[port]/[database]"

-- Run the migration script
\i database/migration_001_field_standardization.sql
```

---

## ✅ Verification

After running the migration, verify the changes:

### **Check Businesses Table:**
```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'businesses' 
AND column_name IN ('contact_website', 'is_verified', 'is_claimed', 'is_homepage_featured', 'tagline');
```

### **Check Founder Insights Table:**
```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'founder_insights' 
AND column_name IN ('has_mentorship_access', 'offers_mentorship', 'has_collaboration_interest', 'is_open_to_future_contact', 'family_community_responsibilities_impact');
```

### **Check Data Migration:**
```sql
SELECT COUNT(*) as businesses_with_taglines 
FROM businesses 
WHERE tagline IS NOT NULL AND tagline != '';
```

---

## 🎯 Expected Results

After successful migration, you should see:

### **Businesses Table Changes:**
- ✅ `website` → `contact_website`
- ✅ `verified` → `is_verified`
- ✅ `claimed` → `is_claimed`
- ✅ `homepage_featured` → `is_homepage_featured`
- ✅ `tagline` data migrated to `tagline`
- ✅ `tagline` column removed

### **Founder Insights Table Changes:**
- ✅ `mentorship_access` → `has_mentorship_access`
- ✅ `mentorship_offering` → `offers_mentorship`
- ✅ `collaboration_interest` → `has_collaboration_interest`
- ✅ `open_to_future_contact` → `is_open_to_future_contact`
- ✅ `family_community_responsibilities_affect_business` → `family_community_responsibilities_impact`

---

## 🚨 Important Notes

### **⚠️ Backup First**
Before running the migration, create a backup:
```sql
CREATE TABLE businesses_backup AS SELECT * FROM businesses;
CREATE TABLE founder_insights_backup AS SELECT * FROM founder_insights;
```

### **⚠️ Test in Development**
Always test migrations in a development environment first.

### **⚠️ Update Application Code**
After migration, update your application code to use the new field names:
- Form components
- API endpoints
- Data transformation functions
- Validation schemas

---

## 🎉 Next Steps

After successful migration:

1. **Update form components** to use new field names
2. **Update transformation functions** 
3. **Update validation schemas**
4. **Test the application** thoroughly
5. **Deploy to production**

---

## 🆘 Troubleshooting

### **Migration Fails:**
- Check if columns exist before renaming
- Verify you have sufficient permissions
- Check for foreign key constraints

### **Data Loss:**
- Restore from backup tables if needed
- Verify data migration before dropping columns

### **Permission Errors:**
- Ensure you have admin privileges
- Check RLS policies that might block operations

---

**Ready to execute! 🚀**
