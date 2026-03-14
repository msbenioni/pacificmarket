#!/bin/bash

# Migration runner script for business_insights column fixes
# Uses environment variables for database connection

echo "Starting business_insights column migration..."

# Check if required environment variables are set
if [ -z "$DATABASE_URL" ] && [ -z "$SUPABASE_DB_URL" ]; then
    echo "Error: DATABASE_URL or SUPABASE_DB_URL environment variable not set"
    echo "Please set your database connection string as an environment variable"
    exit 1
fi

# Use the appropriate database URL
DB_URL="${DATABASE_URL:-$SUPABASE_DB_URL}"

echo "Using database URL: ${DB_URL:0:20}..." # Show first 20 chars for verification

# Run the migration
echo "Executing SQL migration..."
psql "$DB_URL" -f migrations/fix_business_insights_columns.sql

if [ $? -eq 0 ]; then
    echo "✅ Migration completed successfully!"
    echo "The following columns have been renamed:"
    echo "  - top_challenges → top_challenges_array"
    echo "  - community_impact_areas → community_impact_areas_array"
    echo "  - support_needed_next → support_needed_next_array"
    echo "  - current_support_sources → current_support_sources_array"
    echo "  - business_registered → is_business_registered"
else
    echo "❌ Migration failed!"
    echo "Please check the error messages above"
    exit 1
fi
