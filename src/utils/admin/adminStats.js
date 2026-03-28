/**
 * Pure functions for admin dashboard statistics
 * No React dependencies - can be used anywhere
 */

/**
 * Create executive stats for the admin dashboard
 */
export function createExecutiveStats(businesses, claims) {
  const pendingClaimsCount = claims.filter((c) => c.status === "pending").length;

  return [
    {
      label: "Total Businesses",
      value: businesses.length,
      color: "text-blue-600",
    },
    {
      label: "Verified",
      value: businesses.filter((b) => b.is_verified).length,
      color: "text-green-600",
    },
    {
      label: "Pending Claims",
      value: pendingClaimsCount,
      color: "text-purple-600",
    },
  ];
}

/**
 * Get pending claims count
 */
export function getPendingClaimsCount(claims) {
  return claims.filter((c) => c.status === "pending").length;
}
