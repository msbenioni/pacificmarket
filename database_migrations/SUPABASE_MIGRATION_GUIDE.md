# Supabase Migration Guide for Pacific Market

## 🎯 How to Run the Migration with Supabase

Since you're using Supabase, you have several options to run the database migrations:

## Option 1: Supabase Dashboard (Recommended)

1. **Go to Supabase Dashboard**
   - Navigate to https://supabase.com/dashboard
   - Select your project: `mnmisjprswpuvcojnbip`

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Run Migration Step 1**
   ```sql
   -- Copy and paste the contents of add_private_fields.sql
   -- Then click "Run" to execute
   ```

4. **Run Migration Step 2**
   ```sql
   -- Copy and paste the contents of create_analytics_views.sql  
   -- Then click "Run" to execute
   ```

## Option 2: Supabase CLI (Advanced)

1. **Install Supabase CLI** (if not already installed)
   ```bash
   npm install -g supabase
   ```

2. **Link to your project**
   ```bash
   supabase link --project-ref mnmisjprswpuvcojnbip
   ```

3. **Run migrations**
   ```bash
   # From the migrations directory
   supabase db push add_private_fields.sql
   supabase db push create_analytics_views.sql
   ```

## Option 3: Direct Connection (Requires Service Role Key)

1. **Get Service Role Key** from Supabase Dashboard
   - Settings → API → service_role (hidden)

2. **Run with psql**
   ```bash
   psql "postgresql://postgres.mnmisjprswpuvcojnbip.supabase.co:5432/postgres" \
        -f add_private_fields.sql
   ```

## 📋 Migration Files to Run

### Step 1: `add_private_fields.sql`
- ✅ Adds 11 private fields to businesses table
- ✅ Adds 10 private fields to profiles table
- ✅ Creates indexes for performance
- ✅ Sets up Row Level Security (RLS)

### Step 2: `create_analytics_views.sql`
- ✅ Creates public views (excludes private data)
- ✅ Creates analytics views (admin only)
- ✅ Creates helpful analytics functions
- ✅ Sets up proper permissions

## 🔍 Verification Steps

After running the migrations, verify they worked:

```sql
-- Check if new columns exist in businesses table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'businesses' 
AND column_name IN ('business_structure', 'annual_revenue_exact', 'full_time_employees')
ORDER BY column_name;

-- Check if new columns exist in profiles table  
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name IN ('education_level', 'professional_background', 'mentorship_availability')
ORDER BY column_name;

-- Test analytics function (should work)
SELECT * FROM get_business_stats();

-- Test public view (should exclude private fields)
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'public_businesses'
ORDER BY column_name;
```

## ⚠️ Important Notes

1. **Backup First**: Always create a backup before running migrations
2. **Test Locally**: Run migrations on a test environment first
3. **Check Permissions**: Ensure your Supabase role has admin privileges
4. **Monitor Performance**: New fields and indexes may affect query performance

## 🚀 Quick Start

**For immediate execution:**

1. Open Supabase Dashboard: https://supabase.com/dashboard/project/mnmisjprswpuvcojnbip
2. Go to SQL Editor
3. Copy contents of `add_private_fields.sql`
4. Click "Run"
5. Copy contents of `create_analytics_views.sql`  
6. Click "Run"

## 🔄 Rollback Plan

If you need to rollback:

```sql
-- Run this in Supabase SQL Editor
-- Copy contents of remove_private_fields.sql
```

## 📞 Support

If you encounter issues:
1. Check Supabase logs in Dashboard
2. Verify your role has sufficient permissions
3. Test with a single column first
4. Contact Supabase support if needed

---

**Project**: Pacific Market  
**Database**: PostgreSQL (Supabase)  
**Migration Version**: 1.0
