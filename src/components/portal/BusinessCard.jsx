import { useState } from "react";
import {
  Edit,
  Trash2,
  Users,
  Upload,
  Building2,
} from "lucide-react";
import { BUTTON_STYLES, CARD_STYLES, TIER_STYLES } from "@/constants/portalUI";
import { BUSINESS_CARD_ACTIONS } from "@/constants/businessCardConfig";
import { 
  getBusinessDisplayInfo, 
  getBusinessActions,
  getBusinessOwnerName 
} from "@/utils/businessHelpers";
import InlineBusinessForm from "@/components/forms/InlineBusinessForm";
import BusinessInsightsAccordion from "@/components/forms/BusinessInsightsAccordion";

export default function BusinessCard({
  business,
  user,
  profiles,
  isEditing = false,
  draftBusiness,
  savingEdit,
  insightsSubmitting,
  insightsStarted,
  tierInfo,
  onEdit,
  onCancel,
  onSave,
  onDelete,
  onAddOwner,
  onLogoUpload,
  onInsightsSubmit,
}) {
  const displayInfo = getBusinessDisplayInfo(business);
  const actions = getBusinessActions(business, user, isEditing);

  const handleActionClick = (action) => {
    switch (action.handler) {
      case "startEditingBusiness":
        onEdit(business);
        break;
      case "cancelEditingBusiness":
        onCancel();
        break;
      case "handleDeleteBusiness":
        onDelete(business.id);
        break;
      case "handleAddOwner":
        onAddOwner(business.id);
        break;
      case "handleLogoUpload":
        // This is handled by the label element's input
        break;
      default:
        console.warn(`Unknown action: ${action.handler}`);
    }
  };

  const renderActionButton = (action) => {
    const style = BUTTON_STYLES[action.style] || BUTTON_STYLES.icon;
    const Icon = action.icon || Edit;

    if (action.isLabel) {
      return (
        <label className={style}>
          <Icon className="h-3 w-3" />
          {action.label}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onLogoUpload(e, business.id)}
            className="hidden"
          />
        </label>
      );
    }

    return (
      <button
        onClick={() => handleActionClick(action)}
        className={style}
      >
        <Icon className="h-3 w-3" />
        {action.label}
      </button>
    );
  };

  return (
    <div className={CARD_STYLES.business}>
      <div className={CARD_STYLES.businessHeader}>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gradient-to-br from-[#0a1628] to-[#0d4f4f]">
              {displayInfo.logoUrl ? (
                <img
                  src={displayInfo.logoUrl}
                  alt=""
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/pm_logo.png";
                  }}
                />
              ) : (
                <img
                  src="/pm_logo.png"
                  alt="Pacific Market"
                  className="h-full w-full object-cover"
                />
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h3 className="text-lg font-semibold text-[#0a1628]">
                  {displayInfo.name}
                </h3>
                <span className={TIER_STYLES.status + " " + displayInfo.tierStyles}>
                  {tierInfo[displayInfo.subscriptionTier]?.label || "vaka"}
                </span>
                {displayInfo.isVerified && (
                  <span className={TIER_STYLES.verified}>
                    Verified
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-600 mb-3">
                {displayInfo.metaDescription}
              </p>

              <div className="flex flex-wrap gap-2">
                {actions.map(renderActionButton)}
              </div>

              {business.owner_user_id && (
                <p className="mt-3 text-xs text-slate-500">
                  Owner: {getBusinessOwnerName(business.owner_user_id, profiles)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {isEditing && draftBusiness && (
        <div className={CARD_STYLES.businessContent}>
          <InlineBusinessForm
            title={`Edit ${business.name}`}
            formData={draftBusiness}
            setFormData={onSave} // This will be setDraftBusiness in parent
            onSave={() => onSave(draftBusiness)} // This will be saveBusiness in parent
            onCancel={onCancel}
            saving={savingEdit}
            mode="edit"
          />
        </div>
      )}

      <div className={CARD_STYLES.businessContent}>
        <h4 className="text-sm font-semibold text-[#0a1628] mb-4">Business Insights</h4>
        <BusinessInsightsAccordion
          businessId={business.id}
          onSubmit={onInsightsSubmit}
          isLoading={insightsSubmitting}
          onStart={() => insightsStarted(true)}
        />
      </div>
    </div>
  );
}
