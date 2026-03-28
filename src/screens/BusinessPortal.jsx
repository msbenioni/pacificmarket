"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { createPageUrl } from "@/utils";
import { CheckCircle, UserCircle2, AlertCircle, ArrowRight, ChevronRight } from "lucide-react";
import { canAccessBusinessFeatures } from "@/utils/roleHelpers";
import HeroStandard from "../components/shared/HeroStandard";
import {
  SUBSCRIPTION_TIER,
  getTierDisplayName,
} from "@/constants/unifiedConstants";
import { useOnboardingStatus } from "@/hooks/useOnboardingStatus";
import { ClaimAddBusinessModal } from "@/components/onboarding/ClaimAddBusinessModal";
import {
  ModalWrapper,
  ModalHeader,
  ModalContent,
  ModalFooter,
} from "@/components/shared/ModalWrapper";
import { getBusinessOwnerName } from "@/utils/businessHelpers";
import PortalShell from "@/components/portal/PortalShell";
import { portalUI } from "@/components/portal/portalUI";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";
import { useToast } from "@/components/ui/toast/ToastProvider";

// New tab components
import BusinessesTab from "@/components/portal/BusinessesTab";
import ClaimsTab from "@/components/portal/ClaimsTab";
import BusinessToolsTab from "@/components/portal/BusinessToolsTab";

// New constants
import { PORTAL_TABS, getTabStatus } from "@/constants/portalTabs";

// Custom hooks
import { useBusinessPortalData } from "@/hooks/useBusinessPortalData";
import { useBusinessOperations } from "@/hooks/useBusinessOperations";
import { usePortalState } from "@/hooks/usePortalState";
import { useProfileCompletion } from "@/hooks/useProfileCompletion";

export default function BusinessPortal() {
  const searchParams = useSearchParams();
  
  // Check for claim flow parameters
  const claimParam = searchParams.get('claim');
  const businessId = searchParams.get('business');
  const businessName = searchParams.get('name');
  const isClaimFlow = claimParam === 'true' && businessId;
  
  // Custom hooks for data and state management
  const {
    user,
    businesses,
    claims,
    profiles,
    insightSnapshots,
    loading,
    refetchPortalData,
  } = useBusinessPortalData();

  // Profile completion check
  const {
    isCheckingProfile,
    profileIncomplete,
    profileData,
    getProfileCompletionStatus,
    isProfileComplete
  } = useProfileCompletion(user);

  const {
    editingBusinessId,
    draftBusiness,
    savingEdit,
    startEditingBusiness,
    updateDraftBusiness,
    cancelEditingBusiness,
    saveBusiness,
    handleDeleteBusiness,
    handleAddBusiness,
  } = useBusinessOperations(refetchPortalData);

  const {
    activeTab,
    setActiveTab,
    showAddOwnerModal,
    showClaimAddModal,
    claimAddDefaultView,
    newOwnerForm,
    addingOwner,
    insightsSubmitting,
    insightsStarted,
    showAddBusiness,
    setShowAddBusiness,
    setClaimAddModal,
    closeClaimAddModal,
    setAddOwnerModal,
    closeAddOwnerModal,
    setNewOwnerForm,
    setAddingOwner,
    setInsightsLoading,
    setInsightsProgress,
  } = usePortalState();

  const { createCheckoutSession, loading: checkoutLoading } = useStripeCheckout();
  const { toast } = useToast();

  // Handle claim flow - show claim modal if coming from claim flow
  useEffect(() => {
    if (isClaimFlow && user && !loading && isProfileComplete) {
      handleClaimFlow();
      
      // Clear URL parameters to avoid showing modal again on refresh
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
      
      toast({
        title: "Claim Business",
        description: `Please complete the claim form for ${businessName || 'this business'}`,
        variant: "info"
      });
    }
  }, [isClaimFlow, user, loading, businessName, isProfileComplete]);

  const {
    onboardingStatus,
    loading: onboardingLoading,
    refetch: refetchOnboardingStatus,
  } = useOnboardingStatus();

  // Handle add business success/cancel
  const handleAddBusinessSuccess = (createdBusiness) => {
    // Close add-business UI
    setShowAddBusiness(false);
    // Refresh portal data to show the new business
    refetchPortalData();
    // Future: could use createdBusiness for optimistic UI updates
  };

  const handleAddBusinessCancel = () => {
    setShowAddBusiness(false);
  };

  const handleShowAddBusiness = () => {
    if (!isProfileComplete) {
      toast({
        title: "Profile Incomplete",
        description: "Please complete your profile settings before adding a business.",
        variant: "warning",
      });
      return;
    }
    setShowAddBusiness(true);
  };

  const handleClaimFlow = () => {
    if (!isProfileComplete) {
      toast({
        title: "Profile Incomplete", 
        description: "Please complete your profile settings before claiming a business.",
        variant: "warning",
      });
      return;
    }
    // Proceed with claim flow
    setClaimAddModal('claim');
  };

  const handleBusinessAction = (action, data) => {
    switch (action) {
      case "delete":
        handleDeleteBusiness(data.businessId);
        break;
      case "addOwner":
        setAddOwnerModal(data.businessId);
        break;
      case "addBusiness":
        handleAddBusiness(data);
        break;
      default:
        console.warn(`Unknown business action: ${action}`);
    }
  };

  if (onboardingLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#0d4f4f] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !canAccessBusinessFeatures(user)) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center">
        <div className="text-center bg-white border border-gray-100 rounded-2xl p-12 max-w-sm">
          <AlertCircle className="w-10 h-10 text-orange-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#0a1628] mb-2">Access Required</h2>
          <p className="text-gray-500 mb-6">
            Business owner or admin access required to view this portal.
          </p>
          <Link
            href={createPageUrl("BusinessLogin")}
            className="inline-flex items-center gap-2 bg-[#0a1628] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#122040]"
          >
            Sign In <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  // Show profile completion prompt if profile is incomplete
  if (isCheckingProfile) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#0d4f4f] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (profileIncomplete) {
    const profileStatus = getProfileCompletionStatus();
    return (
      <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white border border-gray-100 rounded-2xl p-8 text-center">
          <UserCircle2 className="w-12 h-12 text-[#0d4f4f] mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#0a1628] mb-2">Complete Your Profile</h2>
          <p className="text-gray-500 mb-6">
            Before you can claim or add businesses, please complete your profile settings.
          </p>
          
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-2">Profile Completion</div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">Progress</span>
              <span className="text-xs font-semibold text-[#0d4f4f]">
                {profileStatus?.completionPercentage || 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-[#0d4f4f] h-2 rounded-full transition-all duration-300"
                style={{ width: `${profileStatus?.completionPercentage || 0}%` }}
              />
            </div>
          </div>

          <div className="space-y-2 text-left mb-6">
            <div className="flex items-center gap-2">
              {profileStatus?.displayName ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
              )}
              <span className="text-sm text-gray-600">Display Name</span>
            </div>
            <div className="flex items-center gap-2">
              {profileStatus?.city ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
              )}
              <span className="text-sm text-gray-600">City</span>
            </div>
            <div className="flex items-center gap-2">
              {profileStatus?.country ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
              )}
              <span className="text-sm text-gray-600">Country</span>
            </div>
            <div className="flex items-center gap-2">
              {profileStatus?.culturalIdentity ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
              )}
              <span className="text-sm text-gray-600">Cultural Identity</span>
            </div>
            <div className="flex items-center gap-2">
              {profileStatus?.languagesSpoken ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
              )}
              <span className="text-sm text-gray-600">Languages Spoken</span>
            </div>
          </div>

          <Link
            href={createPageUrl("ProfileSettings")}
            className="inline-flex items-center gap-2 bg-[#0d4f4f] hover:bg-[#1a6b6b] text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors w-full justify-center"
          >
            Complete Profile
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const tierInfo = {
    [SUBSCRIPTION_TIER.VAKA]: {
      label: getTierDisplayName(SUBSCRIPTION_TIER.VAKA),
      color: "text-gray-500 bg-gray-100",
    },
    [SUBSCRIPTION_TIER.MANA]: {
      label: getTierDisplayName(SUBSCRIPTION_TIER.MANA),
      color: "text-[#0d4f4f] bg-[#0d4f4f]/10",
    },
    [SUBSCRIPTION_TIER.MOANA]: {
      label: getTierDisplayName(SUBSCRIPTION_TIER.MOANA),
      color: "text-[#c9a84c] bg-[#c9a84c]/10",
    },
  };

  return (
    <PortalShell>
      <HeroStandard
        badge="Business Owner Portal"
        title={`Welcome back, ${user?.full_name?.split(" ")[0] || "Owner"}`}
        subtitle={user?.email}
        description=""
        actions={null}
        compact
      />

      <div className={portalUI.wrap}>
        <div className={portalUI.shell}>
          <div className={portalUI.tabsWrap}>
            {PORTAL_TABS.map((tab) => ({
              ...tab,
              count: tab.id === "my-businesses" ? businesses.length : 
                     tab.id === "claims" ? claims.length : undefined,
              status: getTabStatus(tab.id, { insightSnapshots, insightsStarted }),
            })).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={portalUI.tabBtn(activeTab === tab.id)}
              >
                <tab.icon className="w-4 h-4" />
                <span className="sm:hidden">{tab.mobileLabel || tab.label}</span>
                <span className="hidden sm:inline">{tab.label}</span>

                {tab.count !== undefined && (
                  <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-gray-100 text-gray-600 hidden md:inline-flex">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {activeTab === "my-businesses" && (
            <BusinessesTab
              businesses={businesses}
              user={user}
              onboardingStatus={onboardingStatus}
              editingBusinessId={editingBusinessId}
              draftBusiness={draftBusiness}
              savingEdit={savingEdit}
              insightsSubmitting={insightsSubmitting}
              tierInfo={tierInfo}
              checkoutLoading={checkoutLoading}
              onBusinessAction={handleBusinessAction}
              onClaimAddAction={handleClaimAddAction}
              onUpgradeClick={handleUpgradeClick}
              showAddBusiness={showAddBusiness}
              onAddBusinessSuccess={handleAddBusinessSuccess}
              onAddBusinessCancel={handleAddBusinessCancel}
              onShowAddBusiness={handleShowAddBusiness}
              isProfileComplete={isProfileComplete}
            />
          )}

          {activeTab === "claims" && (
            <ClaimsTab
              claims={claims}
              onCancelSuccess={() => refetchPortalData()}
            />
          )}

          {activeTab === "tools" && (
            <BusinessToolsTab businesses={businesses} />
          )}
        </div>
      </div>

      {showAddOwnerModal && (
        <ModalWrapper
          isOpen={showAddOwnerModal}
          onClose={() => closeAddOwnerModal()}
          className="max-w-md"
        >
          <ModalHeader
            title="Add Business Owner"
            onClose={() => closeAddOwnerModal()}
          />

          <ModalContent>
            <p className="text-slate-600 text-sm mb-4">
              Add another person to manage this business. They'll receive an invite to claim access.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  value={newOwnerForm.name}
                  onChange={(e) => setNewOwnerForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. John Smith"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Email
                </label>
                <input
                  value={newOwnerForm.email}
                  onChange={(e) => setNewOwnerForm((p) => ({ ...p, email: e.target.value }))}
                  placeholder="john@example.com"
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              {showAddOwnerModal &&
                businesses.find((b) => b.id === showAddOwnerModal)?.owner_user_id && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-900">
                      <strong>Current Owner:</strong>{" "}
                      {getBusinessOwnerName(
                        businesses.find((b) => b.id === showAddOwnerModal)?.owner_user_id,
                        profiles
                      )}
                    </p>
                  </div>
                )}
            </div>
          </ModalContent>

          <ModalFooter>
            <button
              onClick={() => closeAddOwnerModal()}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // Handle add owner logic here
                closeAddOwnerModal();
              }}
              disabled={addingOwner}
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {addingOwner ? "Adding..." : "Add Owner"}
            </button>
          </ModalFooter>
        </ModalWrapper>
      )}

      {showClaimAddModal && (
        <ClaimAddBusinessModal
          isOpen={showClaimAddModal}
          onClose={() => closeClaimAddModal()}
          defaultView={claimAddDefaultView}
          onClaimSelected={() => {
            closeClaimAddModal();
            refetchPortalData();
          }}
          onAddSelected={() => {
            closeClaimAddModal();
            refetchPortalData();
          }}
        />
      )}

    </PortalShell>
  );
}
