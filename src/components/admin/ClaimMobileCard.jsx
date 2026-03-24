import { CheckCircle, XCircle } from "lucide-react";

import { getLogoUrl } from "@/utils/bannerUtils";
import { getBadgeStyles } from "@/components/admin/helpers/adminFormatting";

export default function ClaimMobileCard({ claim, business, onApprove, onDeny }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return { text: "Approved", style: getBadgeStyles("success") };
      case "rejected":
        return { text: "Rejected", style: getBadgeStyles("danger") };
      case "pending":
        return { text: "Pending", style: getBadgeStyles("warning") };
      default:
        return { text: status || "Unknown", style: getBadgeStyles("neutral") };
    }
  };

  const statusBadge = getStatusBadge(claim.status);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-[#0a1628] to-[#0d4f4f]">
          <img src={getLogoUrl(business)} alt="" className="h-full w-full object-cover" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="break-words text-sm font-semibold text-[#0a1628]">
              {business?.business_name || "Unknown Business"}
            </h3>
            <span
              className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${statusBadge.style}`}
            >
              {statusBadge.text}
            </span>
          </div>

          <p className="mt-1 text-xs text-gray-500">
            {business?.country || "Unknown"} · {business?.industry || "Unknown"}
          </p>

          <div className="mt-2 space-y-1">
            <p className="text-xs text-gray-600">
              <span className="font-medium">Business Email:</span>{" "}
              {claim.business_email || "Not provided"}
            </p>
            {claim.business_phone && (
              <p className="text-xs text-gray-600">
                <span className="font-medium">Business Phone:</span>{" "}
                {claim.business_phone}
              </p>
            )}
            <p className="text-xs text-gray-600">
              <span className="font-medium">Role:</span>{" "}
              {claim.role || "Not specified"}
            </p>
            <p className="text-xs text-gray-600">
              <span className="font-medium">Claim Type:</span>{" "}
              {claim.claim_type || "Standard request"}
            </p>
            {claim.message && (
              <p className="text-xs text-gray-600">
                <span className="font-medium">Message:</span> {claim.message}
              </p>
            )}
          </div>

          <p className="mt-2 text-xs text-gray-400">
            Requested{" "}
            {claim.created_at || claim.created_date
              ? new Date(
                  claim.created_at || claim.created_date
                ).toLocaleDateString()
              : "—"}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {claim.status === "pending" && (
          <>
            <button
              onClick={onApprove}
              className={`inline-flex min-h-[40px] items-center gap-1 rounded-lg border px-3 py-2 text-xs font-semibold ${getBadgeStyles(
                "success"
              )}`}
            >
              <CheckCircle className="h-3.5 w-3.5" />
              Approve
            </button>
            <button
              onClick={onDeny}
              className={`inline-flex min-h-[40px] items-center gap-1 rounded-lg border px-3 py-2 text-xs font-semibold ${getBadgeStyles(
                "danger"
              )}`}
            >
              <XCircle className="h-3.5 w-3.5" />
              Deny
            </button>
          </>
        )}
      </div>
    </div>
  );
}
