import { Plus, Building2 } from "lucide-react";
import { shouldShowUpgradePrompt } from "@/utils/businessHelpers";
import BusinessCard from "./BusinessCard";
import EmptyState from "./EmptyState";
import UpgradePrompt from "./UpgradePrompt";

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
      case "draftChange":
        onBusinessAction("draftChange", businessId, data);
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
      case "bannerUpload":
        onBusinessAction("bannerUpload", businessId, data);
        break;
      case "insightsSubmit":
        onBusinessAction("insightsSubmit", businessId, data);
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
      <section className="relative overflow-hidden rounded-[28px] border border-[#0d4f4f]/10 bg-gradient-to-br from-white via-[#f7fbfb] to-[#eef6f6] p-5 shadow-[0_18px_50px_rgba(10,22,40,0.08)] sm:p-7">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(13,79,79,0.07),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(201,168,76,0.10),transparent_24%)]" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#0d4f4f]/10 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0d4f4f] shadow-sm">
              <Building2 className="h-3.5 w-3.5" />
              My Businesses
            </div>

            <h2 className="mt-4 text-2xl font-bold tracking-tight text-[#0a1628] sm:text-3xl">
              Manage your registry records
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-[15px]">
              Open each business to manage grouped sections like listing details, media,
              owners, and insights in a cleaner workflow.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => handleEmptyStateAction("claim")}
              disabled={onboardingStatus.needsProfile}
              className="inline-flex items-center justify-center rounded-xl border border-[#0d4f4f]/15 bg-white px-4 py-3 text-sm font-semibold text-[#0d4f4f] shadow-sm transition hover:border-[#0d4f4f]/30 hover:bg-[#f8fbfb] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Claim Business
            </button>

            <button
              onClick={() => handleEmptyStateAction("add")}
              disabled={onboardingStatus.needsProfile}
              className="inline-flex items-center justify-center rounded-xl bg-[#0d4f4f] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0a3d3d] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Business
            </button>
          </div>
        </div>
      </section>

      {shouldShowUpgradePrompt(businesses) && (
        <UpgradePrompt
          onUpgradeClick={onUpgradeClick}
          checkoutLoading={checkoutLoading}
          user={user}
        />
      )}

      {businesses.length === 0 ? (
        <EmptyState
          type="noBusinesses"
          onboardingStatus={onboardingStatus}
          onAction={handleEmptyStateAction}
        />
      ) : (
        <div className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
          {businesses.map((business, index) => (
            <div
              key={business.id}
              className={index !== businesses.length - 1 ? "border-b border-slate-100" : ""}
            >
              <BusinessCard
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
                onDraftChange={(updater) =>
                  handleBusinessCardAction("draftChange", business.id, updater)
                }
                onSave={(data) => handleBusinessCardAction("save", business.id, data)}
                onDelete={() => handleBusinessCardAction("delete", business.id)}
                onAddOwner={() => handleBusinessCardAction("addOwner", business.id)}
                onLogoUpload={(e, id) => handleBusinessCardAction("logoUpload", id, e)}
                onBannerUpload={(e, id) => handleBusinessCardAction("bannerUpload", id, e)}
                onInsightsSubmit={(data) =>
                  handleBusinessCardAction("insightsSubmit", business.id, data)
                }
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
