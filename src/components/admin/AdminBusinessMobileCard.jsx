import { CheckCircle, XCircle, Gift, Users, Clock } from "lucide-react";

import BusinessProfileForm from "@/components/forms/BusinessProfileForm";
import {
  BUSINESS_STATUS,
  getCountryDisplayName,
  getIndustryDisplayName,
  getTierDisplayName,
} from "@/constants/unifiedConstants";
import { getBusinessReferralRewards } from "@/lib/supabase/queries/referralRewards";
import { getBadgeStyles } from "@/components/admin/helpers/adminFormatting";
import { secondaryButtonCls } from "@/components/admin/constants/adminDashboardConstants";
import { getLogoUrl } from "@/utils/bannerUtils";

export default function AdminBusinessMobileCard({
  business,
  isEditing,
  draftBusiness,
  onApprove,
  onReject,
  onEdit,
  onDelete,
  onSave,
  onCancel,
  savingEdit,
  onApplyReferralReward,
  applyingReferralReward,
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-[#0a1628] to-[#0d4f4f]">
          <img src={getLogoUrl(business)} alt="" className="h-full w-full object-cover" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="break-words text-sm font-semibold text-[#0a1628]">
              {business.business_name}
            </h3>
            <span
              className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${getBadgeStyles(
                "neutral"
              )}`}
            >
              {getTierDisplayName(business.subscription_tier) ||
                business.subscription_tier ||
                "vaka"}
            </span>
            {business.is_verified && (
              <span
                className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${getBadgeStyles(
                  "success"
                )}`}
              >
                Verified
              </span>
            )}
          </div>

          <p className="mt-1 text-xs text-gray-500">
            {getCountryDisplayName(business.country)} ·{" "}
            {getIndustryDisplayName(business.industry) || "No industry"}
          </p>
          <p className="mt-1 break-all text-xs text-gray-500">
            {business.business_email || "No email"}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Submitted{" "}
            {business.created_date
              ? new Date(business.created_date).toLocaleDateString()
              : "—"}
          </p>

          {/* Referral Information */}
          {business.referred_by_business_id && (
            <div className="mt-2 rounded-lg bg-gray-50 p-2">
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <Users className="h-3 w-3" />
                <span>
                  Referred by: {business.referrer_business ? 
                    `${business.referrer_business.business_name}${business.referrer_business.business_handle ? ` (@${business.referrer_business.business_handle})` : ''}` 
                    : 'Unknown business'
                  }
                </span>
              </div>
              <div className="mt-1 flex items-center gap-1 text-xs">
                {business.referral_reward_applied ? (
                  <>
                    <Gift className="h-3 w-3 text-green-600" />
                    <span className="text-green-600">Both businesses received 31 days</span>
                  </>
                ) : business.status === 'active' ? (
                  <>
                    <Clock className="h-3 w-3 text-yellow-600" />
                    <span className="text-yellow-600">Processing dual rewards...</span>
                  </>
                ) : (
                  <>
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-400">Dual rewards pending activation</span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {business.status === BUSINESS_STATUS.PENDING && (
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
              onClick={onReject}
              className={`inline-flex min-h-[40px] items-center gap-1 rounded-lg border px-3 py-2 text-xs font-semibold ${getBadgeStyles(
                "danger"
              )}`}
            >
              <XCircle className="h-3.5 w-3.5" />
              Deny
            </button>
          </>
        )}

        <button
          onClick={onEdit}
          className={`inline-flex min-h-[40px] items-center gap-1 rounded-lg border px-3 py-2 text-xs font-semibold ${secondaryButtonCls}`}
        >
          {isEditing ? "Close" : "Edit"}
        </button>

        <button
          onClick={onDelete}
          className={`inline-flex min-h-[40px] items-center gap-1 rounded-lg border px-3 py-2 text-xs font-semibold ${getBadgeStyles(
            "danger"
          )}`}
        >
          Delete
        </button>

      </div>

      {isEditing && draftBusiness && (
        <div className="mt-4 border-t border-gray-200 pt-4">
          <BusinessProfileForm
            title={`Edit ${business.business_name}`}
            businessId={business.id}
            initialData={draftBusiness}
            onSave={onSave}
            onCancel={onCancel}
            saving={savingEdit}
            mode="edit"
            showAdminFields={true}
          />
        </div>
      )}
    </div>
  );
}
