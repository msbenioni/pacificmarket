import { useMemo } from "react";
import { Shield } from "lucide-react";
import ClaimMobileCard from "@/components/admin/ClaimMobileCard";
import AdminEmptyState from "../AdminEmptyState";
import AdminTabFilterBar from "../AdminTabFilterBar";
import ClaimsTable from "../claims/ClaimsTable";
import {
  filterClaims,
  getClaimsFilterOptions,
  getClaimsEmptyMessage,
} from "@/utils/admin/adminFilters";

/**
 * Claims tab component
 * Renders the claims filter, empty state, mobile cards, and desktop table
 */

export default function ClaimsTab({
  claims,
  businesses,
  searchQuery,
  claimsFilter,
  setClaimsFilter,
  claimActions,
}) {
  // Memoize filtered claims to avoid recalculating on every render
  const filteredClaims = useMemo(() => {
    return filterClaims(claims, claimsFilter, searchQuery, businesses);
  }, [claims, claimsFilter, searchQuery, businesses]);

  // Memoize filter options
  const filterOptions = useMemo(() => {
    return getClaimsFilterOptions(claims);
  }, [claims]);

  // Create business by ID map for efficient lookups
  const businessById = useMemo(() => {
    return businesses.reduce((acc, business) => {
      acc[business.id] = business;
      return acc;
    }, {});
  }, [businesses]);

  return (
    <div className="space-y-4">
      <AdminTabFilterBar
        label="Filter"
        value={claimsFilter}
        onChange={setClaimsFilter}
        options={filterOptions}
      />

      {filteredClaims.length === 0 ? (
        <AdminEmptyState
          icon={Shield}
          message={getClaimsEmptyMessage(claimsFilter)}
        />
      ) : (
        <>
          {/* Mobile view */}
          <div className="space-y-3 lg:hidden">
            {filteredClaims.map((claim) => {
              const business = businessById[claim.business_id];
              return (
                <ClaimMobileCard
                  key={claim.id}
                  claim={claim}
                  business={business}
                  onApprove={() => claimActions.updateClaim(claim, "approved")}
                  onDeny={() => claimActions.updateClaim(claim, "rejected")}
                />
              );
            })}
          </div>

          {/* Desktop view */}
          <ClaimsTable
            claims={filteredClaims}
            businesses={businesses}
            onApprove={(claim) => claimActions.updateClaim(claim, "approved")}
            onReject={(claim) => claimActions.updateClaim(claim, "rejected")}
          />
        </>
      )}
    </div>
  );
}
