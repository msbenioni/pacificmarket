/**
 * CSV export utilities for admin dashboard
 * No React dependencies - can be used anywhere
 */

/**
 * Export businesses to CSV
 */
export function exportBusinessesToCSV(businesses) {
  const fields = [
    "business_name",
    "business_handle",
    "description",
    "industry",
    "country",
    "city",
    "status",
    "subscription_tier",
    "is_verified",
    "is_claimed",
    "business_email",
    "business_website",
  ];

  const header = fields.join(",");
  const rows = businesses.map((b) =>
    fields.map((f) => `"${(b[f] ?? "").toString().replace(/"/g, '""')}"`).join(",")
  );

  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "pacific_market_registry.csv";
  a.click();
  URL.revokeObjectURL(url); // Clean up
}
