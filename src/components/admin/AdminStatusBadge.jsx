import { getBadgeStyles } from "@/components/admin/helpers/adminFormatting";

/**
 * Shared status badge component for admin dashboard
 * Renders status badges for businesses and claims
 */

export default function AdminStatusBadge({ status, kind = "business" }) {
  const getBadgeClass = () => {
    if (kind === "claim") {
      switch (status) {
        case "approved":
          return getBadgeStyles("success");
        case "rejected":
          return getBadgeStyles("danger");
        case "pending":
          return getBadgeStyles("warning");
        default:
          return getBadgeStyles("neutral");
      }
    } else {
      // business status
      switch (status) {
        case "active":
          return getBadgeStyles("success");
        case "pending":
          return getBadgeStyles("warning");
        case "rejected":
          return getBadgeStyles("danger");
        default:
          return getBadgeStyles("neutral");
      }
    }
  };

  const displayStatus = status
    ? status.charAt(0).toUpperCase() + status.slice(1)
    : "Unknown";

  return (
    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getBadgeClass()}`}>
      {displayStatus}
    </span>
  );
}
