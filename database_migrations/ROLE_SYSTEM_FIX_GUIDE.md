# Role System Fix Guide

## 🚨 Issues Identified

### 1. **Incorrect Role Values**
- **Problem**: New business accounts are getting `role = 'buyer'` in the database
- **Expected**: Role should be `NULL` for regular users, only `admin` for administrators
- **Root Cause**: The `app_role` enum includes 'buyer', 'seller', 'admin' with 'buyer' as default

### 2. **Duplicate Profile Views**
- **Problem**: Both `profiles` table and `public.profiles` view exist with same data
- **Issue**: Redundant data storage and potential confusion
- **Root Cause**: Migration created `public_profiles` view that duplicates the main table

## 🔧 Solution Overview

### **Phase 1: Database Schema Fix**

#### **Step 1: Run the Role Fix Migration**
```sql
-- Execute this in Supabase SQL Editor
-- File: database_migrations/fix_role_enum_and_views.sql
```

**What this does:**
1. Updates existing profiles to set `role = NULL` for all non-admin users
2. Drops the old `app_role` enum ('buyer', 'seller', 'admin')
3. Creates new simplified `app_role` enum ('admin' only)
4. Recreates the `role` column with `NULL` default
5. Removes the redundant `public_profiles` view
6. Updates the `analytics_profiles` view to use the main table

#### **Step 2: Update Admin Roles**
After running the migration, you'll need to manually restore admin roles:

```sql
-- Identify admin users from admin_users table
SELECT owner_user_id FROM admin_users;

-- Update their profiles to have admin role
UPDATE profiles 
SET role = 'admin' 
WHERE id IN (SELECT owner_user_id FROM admin_users WHERE role = 'admin');
```

### **Phase 2: Application Code Updates**

#### **✅ Already Fixed:**
- `pacificMarketClient.js` - Updated to use `role` instead of `role_text`

#### **🔍 Check These Files:**
Search for any remaining references to old role system:

```bash
# Search for role_text references
grep -r "role_text" src/

# Search for buyer/seller role checks
grep -r "'buyer'" src/
grep -r "'seller'" src/

# Search for role comparisons
grep -r "role.*===" src/
```

#### **🔄 Update Role Logic:**
Replace any code that checks for buyer/seller roles:

```javascript
// OLD (remove this)
if (user.role === 'buyer' || user.role === 'seller') {
  // regular user logic
}

// NEW (use this)
if (!user.role || user.role === null) {
  // regular user logic  
} else if (user.role === 'admin') {
  // admin logic
}
```

### **Phase 3: Testing & Verification**

#### **Database Verification:**
```sql
-- Check role distribution
SELECT role, COUNT(*) FROM profiles GROUP BY role;

-- Verify admin users have correct roles
SELECT p.id, p.role, au.owner_user_id, au.role 
FROM profiles p 
LEFT JOIN admin_users au ON p.id = au.owner_user_id 
WHERE au.owner_user_id IS NOT NULL;

-- Check that public_profiles view is gone
SELECT * FROM information_schema.views WHERE table_name = 'public_profiles';
```

#### **Application Testing:**
1. **New User Signup**: Should create profile with `role = NULL`
2. **Admin Login**: Should show `role = 'admin'`
3. **Regular User Login**: Should show `role = NULL`
4. **Role-based Features**: Admin-only features should work correctly

## 📋 Step-by-Step Execution

### **1. Backup Current Data**
```sql
-- Export current profiles for safety
SELECT * FROM profiles INTO OUTFILE '/tmp/profiles_backup.csv' WITH CSV HEADER;
```

### **2. Run Migration**
```bash
# In Supabase Dashboard SQL Editor:
-- Copy and paste contents of: database_migrations/fix_role_enum_and_views.sql
-- Execute the script
```

### **3. Restore Admin Roles**
```sql
-- Update admin users to have admin role
UPDATE profiles 
SET role = 'admin' 
WHERE id IN (
  SELECT owner_user_id 
  FROM admin_users 
  WHERE role = 'admin'
);
```

### **4. Test Application**
- Create a new user account
- Verify role is NULL in database
- Test admin login
- Test regular user features

### **5. Clean Up**
```sql
-- Verify everything looks good
SELECT role, COUNT(*) FROM profiles GROUP BY role ORDER BY role DESC;
```

## 🚨 Important Notes

### **Breaking Changes:**
- Any code checking for 'buyer' or 'seller' roles will break
- Admin users need to be manually restored after migration
- Role-based UI components need updating

### **Data Safety:**
- Migration sets all non-admin roles to NULL
- Admin roles preserved in admin_users table for restoration
- Rollback script available if needed

### **Future Considerations:**
- Simplified role system: NULL = regular user, 'admin' = administrator
- No more buyer/seller distinction
- Easier to maintain and understand

## 🔄 Rollback Plan

If something goes wrong, run the rollback script:

```sql
-- In Supabase Dashboard SQL Editor:
-- Copy and paste contents of: database_migrations/rollback_role_enum_fix.sql
-- Execute to restore previous state
```

**Note:** Rollback will lose any role changes made after the fix.

## ✅ Success Criteria

After completing this fix:

1. ✅ New users have `role = NULL`
2. ✅ Admin users have `role = 'admin'`
3. ✅ No 'buyer' or 'seller' roles exist
4. ✅ No duplicate `public_profiles` view
5. ✅ Application works correctly with simplified roles
6. ✅ Admin-only features function properly

## 🎯 Expected Outcome

- **Cleaner Database**: No redundant role values
- **Simpler Logic**: NULL = regular user, admin = administrator
- **No Duplicates**: Single source of truth for profile data
- **Better Performance**: No unnecessary views
- **Clearer Code**: Easier to understand role checks

---

**Ready to execute?** Run the migration script in Supabase SQL Editor to fix the role system!
