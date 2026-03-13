import { CheckCircle } from "lucide-react";
import { BUTTON_STYLES, CARD_STYLES } from "@/constants/portalUI";
import CancelClaimButton from "@/components/claims/CancelClaimButton";

export default function ClaimsTab({ 
  claims, 
  onCancelSuccess 
}) {
  const getStatusBadge = (status) => {
    const baseClass = "text-xs font-semibold rounded-full px-3 py-1 border ";
    
    switch (status) {
      case "pending":
        return baseClass + "border-amber-200 bg-amber-50 text-amber-700";
      case "approved":
        return baseClass + "border-green-200 bg-green-50 text-green-700";
      case "rejected":
        return baseClass + "border-red-200 bg-red-50 text-red-700";
      default:
        return baseClass + "border-gray-200 bg-gray-50 text-gray-700";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString();
  };

  if (claims.length === 0) {
    return (
      <div className={CARD_STYLES.empty}>
        <CheckCircle className="w-10 h-10 text-gray-400 mx-auto mb-3" />
        <h3 className="font-semibold text-gray-600 mb-2">No claim requests</h3>
        <p className="text-slate-500 text-sm">
          When you claim a business, it will appear here for tracking.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {claims.map((claim) => (
        <div key={claim.id} className={CARD_STYLES.business}>
          <div className="p-4 sm:p-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="font-semibold text-[#0a1628] truncate">
                {claim.business_name || claim.business_id}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Submitted {formatDate(claim.created_at)}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <span className={getStatusBadge(claim.status)}>
                {claim.status}
              </span>

              {claim.status === "pending" && (
                <CancelClaimButton
                  claimId={claim.id}
                  onCancelSuccess={onCancelSuccess}
                />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
