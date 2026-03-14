# Database Migration: Fix Business Insights Column Names

## Purpose

This migration renames columns in the `business_insights` table to match the application's naming conventions.

## Column Changes

| Current Name | New Name |
|--------------|----------|
| `top_challenges` | `top_challenges_array` |
| `community_impact_areas` | `community_impact_areas_array` |
| `support_needed_next` | `support_needed_next_array` |
| `current_support_sources` | `current_support_sources_array` |
| `business_registered` | `is_business_registered` |

## Prerequisites

1. **PostgreSQL client tools** (psql) must be installed
   - Windows: Download from https://www.postgresql.org/download/windows/
   - Mac: `brew install postgresql`
   - Linux: `sudo apt-get install postgresql-client`

2. **Database connection string** set as environment variable:
   ```bash
   export DATABASE_URL="postgresql://username:password@host:port/database"
   # OR for Supabase
   export SUPABASE_DB_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"
   ```

## Running the Migration

### Option 1: PowerShell (Windows)

```powershell
# Set environment variable
$env:DATABASE_URL = "postgresql://username:password@host:port/database"

# Run migration
.\migrations\run_migration.ps1
```

### Option 2: Bash (Linux/Mac/WSL)

```bash
# Set environment variable
export DATABASE_URL="postgresql://username:password@host:port/database"

# Run migration
chmod +x migrations/run_migration.sh
./migrations/run_migration.sh
```

### Option 3: Direct SQL

```bash
# Set environment variable
export DATABASE_URL="postgresql://username:password@host:port/database"

# Run SQL directly
psql "$DATABASE_URL" -f migrations/fix_business_insights_columns.sql
```

## Verification

After running the migration, you can verify the changes by checking the Insights page in the application. The console error should be resolved.

## Rollback

If you need to rollback the changes, run the reverse migration:

```sql
-- Rollback script
ALTER TABLE business_insights 
RENAME COLUMN top_challenges_array TO top_challenges;

ALTER TABLE business_insights 
RENAME COLUMN community_impact_areas_array TO community_impact_areas;

ALTER TABLE business_insights 
RENAME COLUMN support_needed_next_array TO support_needed_next;

ALTER TABLE business_insights 
RENAME COLUMN current_support_sources_array TO current_support_sources;

ALTER TABLE business_insights 
RENAME COLUMN is_business_registered TO business_registered;
```

## Troubleshooting

### "psql: command not found"
- Install PostgreSQL client tools
- Add psql to your system PATH

### "Connection refused"
- Check your database URL is correct
- Ensure your database is accessible
- Verify firewall settings

### "Permission denied"
- Ensure your database user has ALTER TABLE permissions
- Check if the database is in read-only mode

## Environment Variables

The migration scripts support these environment variables:

- `DATABASE_URL` - Primary database connection string
- `SUPABASE_DB_URL` - Supabase database connection string (fallback)

Example Supabase connection string format:
```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```
