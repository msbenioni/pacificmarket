# Owner/Admin Role System Guide

## 🎯 **New Role System: Owner + Admin**

Instead of dealing with NULL constraints, we're converting to a cleaner system:
- **`owner`** - Business users (your business account will become 'owner')
- **`admin`** - Administrators only

## 🚀 **Benefits of Owner/Admin System:**

### **✅ Cleaner Logic:**
```javascript
// Before (complex)
if (!user.role || user.role === null) {
  // regular user logic
} else if (user.role === 'admin') {
  // admin logic
}

// After (simple)
if (user.role === 'owner') {
  // business owner logic
} else if (user.role === 'admin') {
  // admin logic
}
```

### **✅ No Constraint Issues:**
- No NULL values to worry about
- Clean enum with just two values
- No database constraint violations

### **✅ Clear Business Meaning:**
- `owner` = Business owner/account holder
- `admin` = Platform administrator

## 📋 **Migration Steps:**

### **1. Run the Migration:**
```sql
-- Execute: database_migrations/fix_role_owner_admin.sql
```

**What it does:**
1. Converts all 'buyer'/'seller' → 'owner'
2. Creates new enum: ('owner', 'admin')
3. Updates column type safely
4. Removes duplicate views
5. Preserves admin roles

### **2. Update Application Code:**

#### **Role Checking:**
```javascript
// Import role helpers
import { isAdmin, isOwner, canAccessBusinessFeatures } from '@/utils/roleHelpers';

// In components
const isAdminUser = isAdmin(user);
const isBusinessOwner = isOwner(user);
const canAccessBusiness = canAccessBusinessFeatures(user);
```

#### **Navigation Logic:**
```javascript
// Show different navigation based on role
if (isOwner(user)) {
  // Show Business Portal link
}
if (isAdmin(user)) {
  // Show Admin Dashboard link
}
```

#### **Route Protection:**
```javascript
// Protect admin routes
if (!isAdmin(user)) {
  router.push('/businessportal');
}

// Protect business features
if (!canAccessBusinessFeatures(user)) {
  router.push('/registry');
}
```

## 🔄 **Expected Results:**

### **Database Changes:**
```sql
-- Before migration:
role = 'buyer'  (your business account)
role = 'seller' (if any exist)
role = 'admin'  (administrators)

-- After migration:
role = 'owner'  (your business account ✅)
role = 'admin'  (administrators ✅)
```

### **Application Behavior:**
- **Your business account**: `role = 'owner'` - full business portal access
- **Admin accounts**: `role = 'admin'` - admin + business portal access
- **New signups**: Will get `role = 'owner'` (need to update signup flow)

## 📝 **Code Updates Needed:**

### **1. Update Signup Flow:**
```javascript
// In BusinessLogin.jsx or signup component
// Set new users as 'owner' by default
const { error } = await supabase
  .from('profiles')
  .upsert({
    id: userData.id,
    role: 'owner', // New default
    display_name: userData.user_metadata?.full_name,
    // ... other fields
  });
```

### **2. Update Role Checks:**
Search and replace old role logic:
```bash
# Find old role checks
grep -r "role.*===" src/
grep -r "buyer" src/
grep -r "seller" src/

# Replace with new logic
# role === 'buyer' → isOwner(user)
# role === 'admin' → isAdmin(user)
```

### **3. Update UI Components:**
```javascript
// In Layout.jsx, AdminDashboard.jsx, etc.
// Use new role helpers for conditional rendering
{isOwner(user) && <BusinessPortalLink />}
{isAdmin(user) && <AdminDashboardLink />}
```

## 🧪 **Testing Checklist:**

### **Database Verification:**
```sql
-- Check role distribution
SELECT role, COUNT(*) FROM profiles GROUP BY role;
-- Should show: owner = X, admin = Y

-- Check your specific account
SELECT role, display_name, email FROM profiles WHERE email = 'your@email.com';
-- Should show: role = 'owner'
```

### **Application Testing:**
- [ ] Business account shows `role = 'owner'`
- [ ] Admin accounts show `role = 'admin'`
- [ ] Business portal accessible to owners
- [ ] Admin dashboard accessible to admins only
- [ ] Navigation shows correct links
- [ ] Role-based features work correctly

## 🔄 **Rollback Plan:**

If needed, rollback with:
```sql
-- Reverse the enum changes
ALTER TYPE app_role RENAME TO app_role_new;
CREATE TYPE app_role AS ENUM ('buyer', 'seller', 'admin');
ALTER TABLE profiles ALTER COLUMN role TYPE app_role USING role::text::app_role;
DROP TYPE app_role_new;
```

## 🎊 **Success Criteria:**

After implementing:
- ✅ Your business account shows `role = 'owner'`
- ✅ No more 'buyer'/'seller' roles in database
- ✅ Clean role logic throughout application
- ✅ Business portal works for owners
- ✅ Admin features work for admins
- ✅ No duplicate views
- ✅ New signups get 'owner' role

## 🚀 **Ready to Execute:**

1. **Run the migration**: `fix_role_owner_admin.sql`
2. **Update signup flow** to set 'owner' as default
3. **Update role checks** to use new helpers
4. **Test thoroughly** to ensure everything works

**This gives you a clean, owner/admin role system without any NULL constraint issues!** 🎯
