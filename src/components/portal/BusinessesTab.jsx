import { Search } from "lucide-react";
import { BUTTON_STYLES } from "@/constants/portalUI";
import { shouldShowUpgradePrompt } from "@/utils/businessHelpers";
import BusinessCard from "./BusinessCard";
import EmptyState from "./EmptyState";
import UpgradePrompt from "./UpgradePrompt";
import ReferralDashboard from "@/components/referrals/ReferralDashboard";

export default function BusinessesTab({
  businesses,
  user,
  profiles,
  onboardingStatus,
  editingBusinessId,
  draftBusiness,
  savingEdit,
  insightsSubmitting,
  insightsStarted,
  tierInfo,
  checkoutLoading,
  onBusinessAction,
  onClaimAddAction,
  onUpgradeClick,
}) {
  const handleBusinessCardAction = (action, businessId, data) => {
    switch (action) {
      case "edit":
        onBusinessAction("edit", businessId);
        break;
      case "cancel":
        onBusinessAction("cancel", businessId);
        break;
      case "save":
        onBusinessAction("save", businessId, data);
        break;
      case "delete":
        onBusinessAction("delete", businessId);
        break;
      case "addOwner":
        onBusinessAction("addOwner", businessId);
        break;
      case "logoUpload":
        onBusinessAction("logoUpload", businessId, data);
        break;
      default:
        console.warn(`Unknown business action: ${action}`);
    }
  };

  const handleEmptyStateAction = (action) => {
    switch (action) {
      case "claim":
        onClaimAddAction("claim");
        break;
      case "add":
        onClaimAddAction("add");
        break;
      default:
        console.warn(`Unknown empty state action: ${action}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
            Business Management
          </p>
          <h2 className="text-2xl font-bold text-[#0a1628] mb-2">
            My Registry Records
          </h2>
          <p className="text-gray-600">
            Claim an existing business or add your own listing once your profile is set up.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 w-full sm:w-auto">
          <button
            onClick={() => handleEmptyStateAction("claim")}
            disabled={onboardingStatus.needsProfile}
            className={BUTTON_STYLES.primary}
          >
            Claim Business
          </button>

          <button
            onClick={() => handleEmptyStateAction("add")}
            disabled={onboardingStatus.needsProfile}
            className={BUTTON_STYLES.secondary}
          >
            Add Business
          </button>
        </div>
      </div>

      {/* Upgrade Prompt */}
      {shouldShowUpgradePrompt(businesses) && (
        <UpgradePrompt
          onUpgradeClick={onUpgradeClick}
          checkoutLoading={checkoutLoading}
          user={user}
        />
      )}

      {/* Business List or Empty State */}
      {businesses.length === 0 ? (
        <EmptyState
          type="noBusinesses"
          onboardingStatus={onboardingStatus}
          onAction={handleEmptyStateAction}
        />
      ) : (
        <div className="space-y-5">
          {businesses.map((business) => (
            <BusinessCard
              key={business.id}
              business={business}
              user={user}
              profiles={profiles}
              isEditing={editingBusinessId === business.id}
              draftBusiness={draftBusiness}
              savingEdit={savingEdit}
              insightsSubmitting={insightsSubmitting}
              insightsStarted={insightsStarted}
              tierInfo={tierInfo}
              onEdit={() => handleBusinessCardAction("edit", business.id)}
              onCancel={() => handleBusinessCardAction("cancel", business.id)}
              onSave={(data) => handleBusinessCardAction("save", business.id, data)}
              onDelete={() => handleBusinessCardAction("delete", business.id)}
              onAddOwner={() => handleBusinessCardAction("addOwner", business.id)}
              onLogoUpload={(e, id) => handleBusinessCardAction("logoUpload", id, e)}
              onInsightsSubmit={(data) => handleBusinessCardAction("insightsSubmit", business.id, data)}
            />
          ))}
        </div>
      )}

      {/* Referral Dashboard */}
      {businesses.length > 0 && (
        <ReferralDashboard
          businessId={businesses[0]?.id}
          businessHandle={businesses[0]?.business_handle}
        />
      )}
    </div>
  );
}
