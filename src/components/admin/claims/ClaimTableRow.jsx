import { CheckCircle, XCircle } from "lucide-react";
import { getBadgeStyles } from "@/components/admin/helpers/adminFormatting";
import { getLogoUrl } from "@/utils/bannerUtils";
import AdminStatusBadge from "../AdminStatusBadge";

/**
 * Individual claim table row component
 * Renders a single claim row in the desktop table
 */

export default function ClaimTableRow({ claim, business, onApprove, onReject }) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-[#0a1628] to-[#0d4f4f]">
            <img
              src={getLogoUrl(business)}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <div className="font-medium text-gray-900">
              {business?.business_name || "Unknown Business"}
            </div>
            <div className="text-sm text-gray-500">
              {business?.country || "Unknown"} · {business?.industry || "Unknown"}
            </div>
          </div>
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="text-sm">
          <div className="font-medium text-gray-900">{claim.business_email}</div>
          {claim.business_phone && (
            <div className="text-gray-500">{claim.business_phone}</div>
          )}
        </div>
      </td>
      <td className="px-4 py-4">
        <AdminStatusBadge status={claim.status} kind="claim" />
      </td>
      <td className="px-4 py-4 text-sm text-gray-500">
        {claim.created_at || claim.created_date
          ? new Date(claim.created_at || claim.created_date).toLocaleDateString()
          : "—"}
      </td>
      <td className="px-4 py-4 text-right">
        {claim.status === "pending" && (
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={onApprove}
              className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold ${getBadgeStyles(
                "success"
              )}`}
            >
              <CheckCircle className="h-3 w-3" />
              Approve
            </button>
            <button
              onClick={onReject}
              className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold ${getBadgeStyles(
                "danger"
              )}`}
            >
              <XCircle className="h-3 w-3" />
              Reject
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}
