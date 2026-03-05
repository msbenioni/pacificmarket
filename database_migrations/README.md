# Pacific Market Database Migrations

This directory contains database migration scripts for adding private profile fields to the Pacific Market application.

## 🎯 Purpose

These migrations add enhanced data capture capabilities while maintaining strict privacy controls:

- **Business Profile**: 11 new private fields for detailed analytics
- **Owner Profile**: 10 new private fields for personal insights
- **Privacy Protection**: Row Level Security (RLS) policies
- **Analytics Views**: Safe data access for research

## 📁 Files Overview

### Migration Scripts
- `add_private_fields.sql` - Main migration to add private fields
- `remove_private_fields.sql` - Rollback migration
- `create_analytics_views.sql` - Create views and analytics functions

### Execution Scripts
- `run_migrations.sh` - Linux/macOS migration runner
- `run_migrations.ps1` - Windows PowerShell migration runner
- `README.md` - This documentation file

## 🚀 Quick Start

### For Windows Users (Recommended)

1. **Update Database Connection**
   ```powershell
   # Edit run_migrations.ps1 and update these variables:
   $env:PGHOST = "your_host"
   $env:PGPORT = "5432"
   $env:PGDATABASE = "your_database"
   $env:PGUSER = "your_username"
   $env:PGPASSWORD = "your_password"
   ```

2. **Create Database Backup**
   ```powershell
   pg_dump -h your_host -U your_username -d your_database > backup_before_migration.sql
   ```

3. **Run Migration**
   ```powershell
   # Navigate to migrations directory
   cd "c:\Users\msben\Pacific Market\database_migrations"
   
   # Execute migration
   .\run_migrations.ps1
   ```

### For Linux/macOS Users

1. **Update Database Connection**
   ```bash
   # Edit run_migrations.sh and update these variables:
   DB_HOST="your_host"
   DB_PORT="5432"
   DB_NAME="your_database"
   DB_USER="your_username"
   DB_PASSWORD="your_password"
   ```

2. **Create Database Backup**
   ```bash
   pg_dump -h your_host -U your_username -d your_database > backup_before_migration.sql
   ```

3. **Run Migration**
   ```bash
   # Navigate to migrations directory
   cd database_migrations
   
   # Make script executable
   chmod +x run_migrations.sh
   
   # Execute migration
   ./run_migrations.sh
   ```

## 📊 What's Added

### Business Table Private Fields
| Field | Type | Description |
|-------|------|-------------|
| `business_structure` | TEXT | Legal structure (LLC, Corporation, etc.) |
| `annual_revenue_exact` | INTEGER | Exact annual revenue in USD |
| `full_time_employees` | INTEGER | Exact full-time employee count |
| `part_time_employees` | INTEGER | Exact part-time employee count |
| `primary_market` | TEXT | Main target market |
| `growth_stage` | TEXT | Detailed growth stage |
| `funding_source` | TEXT | Primary funding source |
| `business_challenges` | TEXT[] | Key business challenges |
| `future_plans` | TEXT | Growth/expansion plans |
| `tech_stack` | TEXT[] | Technologies used |
| `customer_segments` | TEXT[] | Primary customer types |
| `competitive_advantage` | TEXT | Unique selling proposition |

### Profiles Table Private Fields
| Field | Type | Description |
|-------|------|-------------|
| `education_level` | TEXT | Highest education achieved |
| `professional_background` | TEXT[] | Previous industries/roles |
| `business_networks` | TEXT[] | Professional networks |
| `mentorship_availability` | BOOLEAN | Available to mentor others |
| `investment_interest` | TEXT | Investment interests |
| `community_involvement` | TEXT[] | Community organizations |
| `skills_expertise` | TEXT[] | Professional skills |
| `business_goals` | TEXT | 1-5 year objectives |
| `challenges_faced` | TEXT[] | Business challenges |
| `success_factors` | TEXT[] | Key success factors |
| `preferred_collaboration` | TEXT[] | Collaboration preferences |

## 🔐 Privacy & Security

### Row Level Security (RLS)
- **Owner Access**: Users can only see their own private data
- **Admin Access**: Admins can access aggregated analytics
- **Public Access**: Private fields never exposed publicly

### Views Created
- `public_businesses` - Public business data only
- `public_profiles` - Public profile data only
- `analytics_businesses` - Full business data (admin only)
- `analytics_profiles` - Full profile data (admin only)

### Analytics Functions
- `get_business_stats()` - Public statistics
- `get_economic_insights()` - Private economic data (admin only)

## ⚠️ Important Notes

### Before Migration
- ✅ Create a full database backup
- ✅ Test in development environment first
- ✅ Review all field definitions
- ✅ Verify user permissions

### After Migration
- ✅ Test application functionality
- ✅ Verify privacy controls work
- ✅ Check analytics functions
- ✅ Monitor performance impact

### Rollback Plan
If issues occur, rollback with:
```sql
-- For Windows PowerShell
psql -f remove_private_fields.sql

-- For Linux/macOS
psql -h host -U user -d database -f remove_private_fields.sql
```

## 🧪 Testing

### Test Cases
1. **User Privacy**: Verify users can only see their own data
2. **Admin Access**: Test admin analytics functions
3. **Public Views**: Confirm no private data exposed
4. **Application**: Test profile forms with new fields
5. **Performance**: Check query performance with new indexes

### Verification Queries
```sql
-- Test public view (should exclude private fields)
SELECT * FROM public_businesses LIMIT 5;

-- Test analytics view (admin only)
SELECT * FROM analytics_businesses LIMIT 5;

-- Test privacy (should fail for non-owners)
SELECT annual_revenue_exact FROM businesses WHERE id = 'some_uuid';

-- Test analytics functions
SELECT * FROM get_business_stats();
SELECT * FROM get_economic_insights(); -- Admin only
```

## 📈 Impact Assessment

### Storage Impact
- **Business Table**: ~50KB per 1000 businesses
- **Profiles Table**: ~30KB per 1000 users
- **Indexes**: Additional indexes for performance

### Performance Impact
- **Queries**: Slightly slower due to RLS checks
- **Indexes**: Improved query performance on private fields
- **Views**: Optimized for different access patterns

## 🆘 Troubleshooting

### Common Issues
1. **Permission Denied**: Check RLS policies and user roles
2. **Migration Fails**: Verify database connection and permissions
3. **Views Empty**: Check if data exists and policies are correct
4. **Functions Missing**: Run analytics views migration

### Support Commands
```sql
-- Check table structure
\d businesses
\d profiles

-- Check RLS policies
\dp businesses
\dp profiles

-- Check indexes
\di businesses
\di profiles

-- Check views
\dv public_businesses
\dv analytics_businesses
```

## 📞 Support

For issues with these migrations:
1. Check the PostgreSQL logs
2. Review the migration output
3. Test with a small dataset first
4. Contact the database administrator

---

**Migration Version**: 1.0  
**Created**: 2025-03-05  
**Compatible**: PostgreSQL 13+  
**Environment**: Pacific Market Application
