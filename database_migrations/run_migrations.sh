#!/bin/bash

# Database Migration Runner
# Execute migrations in the correct order for Pacific Market private fields

echo "🚀 Starting Pacific Market Database Migrations..."
echo "⚠️  Make sure you have a database backup before proceeding!"

# Set your database connection details
# Update these values with your actual database connection
DB_HOST="localhost"
DB_PORT="5432"
DB_NAME="pacific_market"
DB_USER="postgres"
DB_PASSWORD="your_password"

# Check if psql is available
if ! command -v psql &> /dev/null; then
    echo "❌ Error: psql is not installed or not in PATH"
    exit 1
fi

# Function to execute SQL file
execute_sql() {
    local sql_file=$1
    local description=$2
    
    echo "📝 Executing: $description"
    echo "📄 File: $sql_file"
    
    if psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$sql_file"; then
        echo "✅ Success: $description"
    else
        echo "❌ Failed: $description"
        echo "⚠️  Please check the error above and fix manually"
        return 1
    fi
}

# Execute migrations in order
echo ""
echo "🔄 Step 1: Adding private fields to tables..."
execute_sql "add_private_fields.sql" "Add private fields to businesses and profiles tables"

if [ $? -eq 0 ]; then
    echo ""
    echo "🔄 Step 2: Creating analytics views..."
    execute_sql "create_analytics_views.sql" "Create analytics views and functions"
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ All migrations completed successfully!"
        echo ""
        echo "📊 Migration Summary:"
        echo "  • Added 11 private fields to businesses table"
        echo "  • Added 10 private fields to profiles table"
        echo "  • Created analytics views for safe data access"
        echo "  • Set up Row Level Security (RLS) policies"
        echo "  • Created helpful analytics functions"
        echo ""
        echo "🔐 Privacy Protection:"
        echo "  • Private fields only accessible to owners and admins"
        echo "  • Public views exclude all private data"
        echo "  • Analytics functions require admin privileges"
        echo ""
        echo "🎯 Next Steps:"
        echo "  1. Test the application with new profile fields"
        echo "  2. Verify privacy controls are working"
        echo "  3. Update application code to use new fields"
        echo ""
        echo "⚡ To rollback: psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f remove_private_fields.sql"
    else
        echo ""
        echo "⚠️  Step 2 failed, but Step 1 was completed"
        echo "🔧 You may need to manually check the views and functions"
        echo "⚡ To rollback: psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f remove_private_fields.sql"
    fi
else
    echo ""
    echo "❌ Migration failed at Step 1"
    echo "🔧 Please fix the errors above and retry"
    echo "⚡ To rollback: psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f remove_private_fields.sql"
fi

echo ""
echo "🏁 Migration process completed!"
