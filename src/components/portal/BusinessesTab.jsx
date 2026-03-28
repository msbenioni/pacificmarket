"use client";

import { Plus, Building2, Crown } from "lucide-react";
import { shouldShowUpgradePrompt } from "@/utils/businessHelpers";
import { createPageUrl } from "@/utils";
import { useToast } from "@/components/ui/toast/ToastProvider";
import BusinessCard from "./BusinessCard";
import AddBusinessCard from "./AddBusinessCard";
import EmptyState from "./EmptyState";

export default function BusinessesTab({
  user,
  businesses,
  editingBusinessId,
  draftBusiness,
  savingEdit,
  insightsSubmitting,
  tierInfo,
  checkoutLoading,
  onBusinessAction,
  onClaimAddAction,
  onUpgradeClick,
  showAddBusiness,
  onAddBusinessSuccess,
  onAddBusinessCancel,
  onShowAddBusiness,
  handleAddBusiness,
  isProfileComplete,
}) {
  const { toast } = useToast();
  const handleEmptyStateAction = (action) => {
    switch (action) {
      case "completeProfile":
        // Navigate to profile settings
        window.location.href = createPageUrl("ProfileSettings");
        break;
      case "claim":
        onClaimAddAction("claim");
        break;
      case "add":
        onShowAddBusiness();
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
              <Building2 className="h-3 w-3" />
              My Businesses
            </div>
            <h1 className="mt-3 text-2xl font-bold text-[#0a1628] sm:text-3xl">
              Manage your businesses
            </h1>
            <p className="mt-2 text-slate-600">
              Edit your business profiles, manage branding, and track performance.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onClaimAddAction("claim")}
              className="inline-flex items-center gap-2 rounded-xl border border-[#0d4f4f] bg-[#0d4f4f] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#122040]"
            >
              <Plus className="h-4 w-4" />
              Claim Business
            </button>
            
            <button
              onClick={onShowAddBusiness}
              className="inline-flex items-center gap-2 rounded-xl border border-[#0d4f4f] bg-[#0d4f4f] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#122040]"
            >
              <Plus className="h-4 w-4" />
              Add Business
            </button>

            {shouldShowUpgradePrompt(businesses) && (
              <button
                onClick={onUpgradeClick}
                disabled={checkoutLoading}
                className="inline-flex items-center gap-2 rounded-xl border border-[#c9a84c] bg-[#c9a84c] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#b8973b] disabled:opacity-50"
              >
                <Crown className="h-4 w-4" />
                {checkoutLoading ? "Processing..." : "Upgrade"}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Businesses List */}
      <div className="space-y-4">
        {businesses.length === 0 && !showAddBusiness ? (
          <EmptyState
            user={user}
            onboardingStatus={onboardingStatus}
            onAction={handleEmptyStateAction}
          />
        ) : (
          <div className="space-y-6">
            {showAddBusiness && (
              <AddBusinessCard
                onAddSuccess={handleAddBusiness}
                onCancel={onAddBusinessCancel}
                saving={savingEdit}
                onboardingStatus={onboardingStatus}
              />
            )}

            {businesses.map((business) => (
              <BusinessCard
                key={business.id}
                business={business}
                user={user}
                tierInfo={tierInfo}
                editingBusinessId={editingBusinessId}
                draftBusiness={draftBusiness}
                isEditing={editingBusinessId === business.id}
                insightsSubmitting={insightsSubmitting}
                onEdit={() => onBusinessAction("edit", business.id)}
                onCancel={() => onBusinessAction("cancel", business.id)}
                onSave={(data) => onBusinessAction("save", business.id, data)}
                onDraftChange={(data) => onBusinessAction("draftChange", business.id, data)}
                onDelete={() => onBusinessAction("delete", business.id)}
                onInsightsSubmit={(data) => onBusinessAction("insightsSubmit", business.id, data)}
                onUpgrade={onUpgradeClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}