# Pacific Market Database Schema

## Overview

This directory contains the complete database schema for Pacific Market, a platform connecting Pacific businesses with comprehensive business management and insights features.

## Files

### 📋 Schema Files

- **`pacific_market_complete_schema.sql`** - Complete database schema with all tables, RLS policies, functions, and triggers
- **`apply_clean_schema.sql`** - Migration script to safely apply the new schema while preserving existing data
- **`README.md`** - This documentation file

### 📁 Archive Directory

- **`clean_backup/`** - Contains all previous SQL files that have been archived for reference

## Database Structure

### Core Tables

#### 📊 `profiles`
Extended user profiles with cultural identity and professional background information.

**Key Fields:**
- `user_id` - Links to auth.users
- `email`, `full_name`, `avatar_url`
- `cultural_identity[]` - Pacific cultural identity array
- `languages_spoken[]` - Languages user speaks
- `professional_background` - Professional experience
- `profile_completeness` - 0-100 completion percentage

#### 🏢 `businesses`
Main business listings with public information and ownership details.

**Key Fields:**
- `owner_user_id` - Business owner
- `name`, `business_handle`, `description`
- Contact info: `contact_email`, `contact_phone`, `public_phone`
- Location: `country`, `city`, `address`
- Media: `logo_url`, `banner_url`
- Ownership: `business_owner`, `business_owner_email`, `additional_owner_emails[]`
- Status: `verified`, `claimed`, `subscription_tier`
- Cultural: `cultural_identity[]`, `languages_spoken[]`

#### 🔍 `business_insights` (Private)
Business operational data and insights, not visible to public.

**Key Fields:**
- `business_id`, `user_id`, `snapshot_year`
- Business metrics: `revenue_band`, `team_size_band`, `business_stage`
- Financial: `funding_amount_needed`, `investment_stage`
- Operations: `sales_channels`, `import_export_status`
- **Private contact**: `private_business_phone`, `private_business_email`

#### 👥 `founder_insights` (Private)
Founder personal data and journey insights.

**Key Fields:**
- `user_id`, `snapshot_year`
- Personal: `gender`, `age_range`, `years_entrepreneurial`
- Pacific identity: `pacific_identity[]`, `based_in_country`
- Support: `mentorship_access`, `collaboration_interest`
- Goals: `goals_next_12_months_array[]`

#### 🔔 `notifications`
User notifications and system alerts.

**Key Fields:**
- `user_id`, `type`, `title`, `message`
- `read`, `read_at`, `created_at`
- `data` - JSON metadata

## Security Features

### 🔒 Row Level Security (RLS)

All tables have RLS policies implemented:

- **Users** can only access their own data
- **Admins** have full access to all data
- **Public** can view active, verified business listings
- **Additional owners** can access businesses they're invited to

### 🛡️ Data Separation

- **Public data** → `businesses` table
- **Private business data** → `business_insights` table  
- **Private founder data** → `founder_insights` table

## Key Features

### 🔄 Automatic Timestamps

- `created_at` - Set when record is created
- `updated_at` - Automatically updated on changes (via triggers)

### 🎯 Business Handles

- Auto-generated unique handles (e.g., "pacific-market-demo")
- Lowercase, hyphenated format
- Fallback to numbers if conflicts

### 📊 Performance Indexes

Optimized indexes for:
- User lookups
- Business searches
- Geographic queries
- Array fields (GIN indexes)

## Migration Process

### 🚀 Quick Start

1. **Backup existing data:**
   ```sql
   -- Run apply_clean_schema.sql (includes automatic backup)
   ```

2. **Apply new schema:**
   ```sql
   \i database/pacific_market_complete_schema.sql
   ```

3. **Migrate data:**
   ```sql
   -- apply_clean_schema.sql handles migration automatically
   ```

4. **Verify migration:**
   ```sql
   -- Check counts in migration summary
   SELECT COUNT(*) FROM profiles;
   SELECT COUNT(*) FROM businesses;
   SELECT COUNT(*) FROM business_insights;
   SELECT COUNT(*) FROM founder_insights;
   ```

### 🔄 Migration Steps

1. **Backup** - Creates backup_* tables with existing data
2. **Cleanup** - Drops old objects (views, triggers, policies, tables)
3. **Create** - Applies new clean schema
4. **Migrate** - Transfers data from backup tables to new schema
5. **Verify** - Confirms data integrity

## Data Relationships

```
profiles (1) ←→ (many) businesses
    ↓
    ↓
business_insights (many) ←→ (1) businesses
    ↓
    ↓
founder_insights (1) ←→ (1) profiles
```

## API Integration

### 📡 Frontend Mapping

The frontend components map to these tables:

- **ProfileSettings** → `profiles` table
- **InlineBusinessForm** → `businesses` table  
- **BusinessInsightsAccordion** → `business_insights` table
- **FounderInsightsAccordion** → `founder_insights` table

### 🔐 Authentication

- Uses Supabase Auth for user management
- RLS policies enforce data access
- JWT tokens contain user roles

## Development Notes

### 🧪 Testing

- Sample data available in schema (commented out)
- Use backup tables for testing migrations
- RLS can be temporarily disabled for debugging

### 📝 Schema Version

- Current version: **v1.0**
- Migration scripts maintain backward compatibility
- Version tracking in database comments

### 🛠️ Maintenance

- Regular backups recommended before schema changes
- Test migrations in development first
- Monitor RLS policy performance

## Troubleshooting

### 🚨 Common Issues

1. **RLS blocking access** - Check user authentication
2. **Migration failures** - Verify backup tables exist
3. **Handle conflicts** - Schema includes auto-generation
4. **Array field errors** - Use proper JSON/GIN syntax

### 🔧 Debug Queries

```sql
-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'businesses';

-- Verify indexes
SELECT * FROM pg_indexes WHERE tablename = 'businesses';

-- Check data integrity
SELECT COUNT(*) FROM businesses WHERE owner_user_id IS NULL;
```

## Support

For database issues:
1. Check migration logs
2. Verify Supabase connection
3. Review RLS policies
4. Test with admin role

---

**Last Updated:** 2026-03-14  
**Schema Version:** v1.0  
**Compatible with:** Supabase PostgreSQL 15+
