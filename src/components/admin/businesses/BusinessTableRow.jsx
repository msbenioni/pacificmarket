import { CheckCircle, XCircle, ExternalLink } from "lucide-react";
import { BUSINESS_STATUS, getCountryDisplayName, getIndustryDisplayName, getTierDisplayName } from "@/constants/unifiedConstants";
import { getBadgeStyles } from "@/components/admin/helpers/adminFormatting";
import { getLogoUrl } from "@/utils/bannerUtils";
import AdminStatusBadge from "../AdminStatusBadge";

/**
 * Individual business table row component
 * Renders a single business row in the desktop table
 */

export default function BusinessTableRow({ business, isEditing, onEdit, onDelete, onApprove, onReject, onViewProfile }) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gradient-to-br from-[#0a1628] to-[#0d4f4f]">
            <img
              src={getLogoUrl(business)}
              alt=""
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.src = getLogoUrl(business);
              }}
            />
          </div>
          <div>
            <div className="font-medium text-gray-900">
              {business.business_name}
            </div>
            <div className="text-sm text-gray-500">
              {getCountryDisplayName(business.country)} · {getIndustryDisplayName(business.industry)}
            </div>
          </div>
        </div>
      </td>

      <td className="px-4 py-4">
        <div className="text-sm text-gray-500">
          {business.business_email && <div>{business.business_email}</div>}
          {business.business_website && (
            <div>
              <a
                href={business.business_website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Website
              </a>
            </div>
          )}
        </div>
      </td>

      <td className="px-4 py-4">
        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
          {
            vaka: 'bg-yellow-100 text-yellow-800',
            mana: 'bg-purple-100 text-purple-800',
            moana: 'bg-blue-100 text-blue-800',
          }[business.subscription_tier] || 'bg-yellow-100 text-yellow-800'
        }`}>
          {getTierDisplayName(business.subscription_tier) || 'Vaka'}
        </span>
      </td>

      <td className="px-4 py-4">
        <AdminStatusBadge status={business.status} kind="business" />
      </td>

      <td className="px-4 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onViewProfile(business)}
            className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
          >
            <ExternalLink className="h-3 w-3" />
            View Profile
          </button>
          
          <button
            onClick={onEdit}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {isEditing ? "Close" : "Edit"}
          </button>

          {business.status === BUSINESS_STATUS.PENDING && (
            <>
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
            </>
          )}
        </div>
      </td>
    </tr>
  );
}
