#!/bin/bash

# Database Migration Execution Script
# Purpose: Execute the database migration using Supabase connection
# Date: 2026-03-15

# Database connection details from .env.local
DB_HOST="db.mnmisjprswpuvcojnbip.supabase.co"
DB_PORT="5432"
DB_NAME="postgres"
DB_USER="postgres"
DB_PASSWORD="MontBlanc3001"

# Migration file path
MIGRATION_FILE="database/migration_2026_03_15.sql"

echo "🚀 Starting Database Migration..."
echo "📅 Date: $(date)"
echo "🗄️  Database: ${DB_HOST}:${DB_PORT}/${DB_NAME}"
echo "📁 Migration file: ${MIGRATION_FILE}"
echo ""

# Check if migration file exists
if [ ! -f "$MIGRATION_FILE" ]; then
    echo "❌ Migration file not found: $MIGRATION_FILE"
    exit 1
fi

echo "✅ Migration file found"

# Execute migration
echo "🔄 Executing migration..."
PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$MIGRATION_FILE"

# Check execution result
if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Migration completed successfully!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Test all forms (FounderInsightsForm, BusinessInsightsAccordion)"
    echo "2. Verify data integrity in the database"
    echo "3. Test user workflows end-to-end"
    echo "4. Remove backup tables when confident:"
    echo "   DROP TABLE founder_insights_backup;"
    echo "   DROP TABLE business_insights_backup;"
else
    echo ""
    echo "❌ Migration failed!"
    echo "🔄 Please check the error messages above"
    echo "💡 You can restore from backup tables if needed:"
    echo "   -- Restore founder_insights:"
    echo "   TRUNCATE TABLE founder_insights;"
    echo "   INSERT INTO founder_insights SELECT * FROM founder_insights_backup;"
    echo ""
    echo "   -- Restore business_insights:"
    echo "   TRUNCATE TABLE business_insights;"
    echo "   INSERT INTO business_insights SELECT * FROM business_insights_backup;"
    exit 1
fi
