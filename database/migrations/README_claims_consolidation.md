# Claims Consolidation Migration

This migration consolidates the two separate claim systems into a single `claim_requests` table.

## Problem Solved
Previously, the system had two ways of tracking business ownership:
1. **Direct claims** - `is_claimed: true` + `owner_user_id` in businesses table
2. **Claim requests** - Separate `claim_requests` table with approval workflow

This caused confusion and missing claims in the business portal.

## Solution
All ownership changes now go through the `claim_requests` table with a unified structure:
- `claim_type: 'direct'` - For businesses created directly by owners
- `claim_type: 'request'` - For ownership claims that need approval
- `status: 'pending' | 'approved' | 'rejected'`

## Migration Steps

### 1. Run Migration Script
```bash
# Execute the migration to move existing direct claims to claim_requests
psql -d your_database -f database/migrations/006_consolidate_claims_to_single_table.sql
```

### 2. Verify Migration
Check that existing direct claims have been migrated:
```sql
SELECT COUNT(*) as migrated_claims 
FROM claim_requests 
WHERE claim_type = 'direct' AND status = 'approved';
```

### 3. Run Cleanup Script (Optional)
```bash
# Remove redundant columns from businesses table
psql -d your_database -f database/migrations/007_cleanup_businesses_claim_columns.sql
```

### 4. Update Application
The application code has been updated to:
- Only query the `claim_requests` table for claims
- Create approved claim requests for new business creation
- Handle both claim types in the UI with appropriate badges

## After Migration
- Single source of truth for all ownership claims
- Complete audit trail in one table
- Consistent workflow for all claim types
- Business portal shows all claims correctly

## Rollback Plan
If needed, you can restore from the `businesses_backup_claim_columns` table created during cleanup.
