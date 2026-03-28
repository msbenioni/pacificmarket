/**
 * Pure filter functions for admin dashboard
 * No React dependencies - can be used anywhere
 */

/**
 * Filter businesses based on status, search query, and filters
 */
export function filterBusinesses(businesses, businessesFilter, searchQuery, filters) {
  let filteredBusinesses = businesses;

  // Apply status filter
  if (businessesFilter !== "all") {
    filteredBusinesses = filteredBusinesses.filter(
      (b) => b.status === businessesFilter
    );
  }

  // Apply search query
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filteredBusinesses = filteredBusinesses.filter(
      (business) =>
        business.business_name?.toLowerCase().includes(q) ||
        business.description?.toLowerCase().includes(q) ||
        business.industry?.toLowerCase().includes(q) ||
        business.country?.toLowerCase().includes(q)
    );
  }

  // Apply country filter
  if (filters.country) {
    filteredBusinesses = filteredBusinesses.filter(
      (business) => business.country === filters.country
    );
  }

  // Apply industry filter
  if (filters.industry) {
    filteredBusinesses = filteredBusinesses.filter(
      (business) => business.industry === filters.industry
    );
  }

  // Apply tier filter
  if (filters.tier) {
    filteredBusinesses = filteredBusinesses.filter(
      (business) => business.subscription_tier === filters.tier
    );
  }

  // Apply verified filter
  if (filters.is_verified !== "") {
    const isVerified = filters.is_verified === "true";
    filteredBusinesses = filteredBusinesses.filter(
      (business) => business.is_verified === isVerified
    );
  }

  return filteredBusinesses;
}

/**
 * Filter claims based on status and search query
 */
export function filterClaims(claims, claimsFilter, searchQuery, businesses) {
  let filteredClaims = claims;

  // Apply status filter
  if (claimsFilter !== "all") {
    filteredClaims = filteredClaims.filter((c) => c.status === claimsFilter);
  }

  // Apply search query
  if (searchQuery) {
    const q = searchQuery.toLowerCase();

    filteredClaims = filteredClaims.filter((claim) => {
      const business = businesses.find((b) => b.id === claim.business_id);

      return (
        claim.business_email?.toLowerCase().includes(q) ||
        claim.business_phone?.toLowerCase().includes(q) ||
        business?.business_name?.toLowerCase().includes(q) ||
        business?.description?.toLowerCase().includes(q) ||
        business?.country?.toLowerCase().includes(q) ||
        business?.industry?.toLowerCase().includes(q)
      );
    });
  }

  return filteredClaims;
}

/**
 * Get filter options for businesses dropdown
 */
export function getBusinessesFilterOptions(businesses) {
  return [
    {
      value: "active",
      label: `Active (${businesses.filter((b) => b.status === "active").length})`,
    },
    {
      value: "pending",
      label: `Pending (${businesses.filter((b) => b.status === "pending").length})`,
    },
    {
      value: "rejected",
      label: `Rejected (${businesses.filter((b) => b.status === "rejected").length})`,
    },
    {
      value: "all",
      label: `All (${businesses.length})`,
    },
  ];
}

/**
 * Get filter options for claims dropdown
 */
export function getClaimsFilterOptions(claims) {
  return [
    {
      value: "all",
      label: `All Claims (${claims.length})`,
    },
    {
      value: "pending",
      label: `Pending (${claims.filter((c) => c.status === 'pending').length})`,
    },
    {
      value: "approved",
      label: `Approved (${claims.filter((c) => c.status === 'approved').length})`,
    },
    {
      value: "rejected",
      label: `Rejected (${claims.filter((c) => c.status === 'rejected').length})`,
    },
  ];
}

/**
 * Get empty state message for businesses based on filter
 */
export function getBusinessesEmptyMessage(businessesFilter) {
  switch (businessesFilter) {
    case "active":
      return "No active businesses found.";
    case "pending":
      return "No pending businesses found.";
    case "rejected":
      return "No rejected businesses found.";
    default:
      return "No businesses found.";
  }
}

/**
 * Get empty state message for claims based on filter
 */
export function getClaimsEmptyMessage(claimsFilter) {
  switch (claimsFilter) {
    case "all":
      return "No claim requests found.";
    case "pending":
      return "No pending claims found.";
    case "approved":
      return "No approved claims found.";
    case "rejected":
      return "No rejected claims found.";
    default:
      return "No claims found.";
  }
}
