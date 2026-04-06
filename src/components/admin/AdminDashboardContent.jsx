import AdminFiltersBar from "@/components/admin/AdminFiltersBar";
import AdminTabsBar from "@/components/admin/AdminTabsBar";
import {
  TABS,
  emptyBusinessForm,
  filterButtonCls,
  mobileButtonCls,
  primaryButtonCls,
  secondaryButtonCls,
} from "@/components/admin/constants/adminDashboardConstants";
import BusinessProfileForm from "@/components/forms/BusinessProfileForm";
import PortalShell from "@/components/portal/PortalShell";
import HeroStandard from "@/components/shared/HeroStandard";
import { COUNTRIES, INDUSTRIES } from "@/constants/unifiedConstants";
import { exportBusinessesToCSV } from "@/utils/admin/adminExport";
import { createExecutiveStats } from "@/utils/admin/adminStats";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import EmailMarketingDashboard from "../admindashboard/EmailMarketingDashboard";
import SpotlightGenerator from "../social-generator/SpotlightGenerator";
import { ClientListManager } from "./ClientListManager";
import PresentationsTab from "./PresentationsTab";
import BusinessesTab from "./tabs/BusinessesTab";
import ClaimsTab from "./tabs/ClaimsTab";

/**
 * Main admin dashboard content component
 * Handles the dashboard layout and tab rendering
 */

export default function AdminDashboardContent({
  _user,
  businesses,
  claims,
  _dashboardLoading,
  businessActions,
  claimActions,
  showCreateForm = false,
}) {
  const router = useRouter();

  // Local UI state (excluding editing state which is handled by parent)
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('admin-active-tab') || 'businesses';
    }
    return 'businesses';
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    country: "",
    industry: "",
    tier: "",
    is_verified: "",
  });
  const [claimsFilter, setClaimsFilter] = useState("all");
  const [businessesFilter, setBusinessesFilter] = useState("active");

  // Fix hydration mismatch
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Calculate executive stats
  const executiveStats = createExecutiveStats(businesses, claims);
  const activeFilterCount = Object.values(filters).filter((v) => v !== "").length;

  // Handle tab change
  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin-active-tab', newTab);
    }
    businessActions.cancelEditingBusiness();
  };

  // Handle create form navigation
  const handleCreateBusiness = () => {
    businessActions.cancelEditingBusiness();
    // Navigate to create view on same page (seamless)
    router.push("/AdminDashboard?view=create");
  };

  // Handle reset editing
  const handleResetEditing = () => {
    businessActions.cancelEditingBusiness();
  };

  // Handle export CSV
  const handleExportCSV = () => {
    exportBusinessesToCSV(businesses);
  };

  if (!isClient) {
    return null; // Prevent hydration mismatch
  }

  return (
    <PortalShell>
      <HeroStandard
        badge="Admin Dashboard"
        title="Pacific Discovery Network Registry"
        subtitle="Administrative control center for business listings"
        description=""
        showStats={true}
        stats={executiveStats}
        actions={null}
      />

      <div className="min-h-screen bg-[#f8f9fc]">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <AdminFiltersBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            activeFilterCount={activeFilterCount}
            filters={filters}
            setFilters={setFilters}
            onToggleCreate={handleCreateBusiness}
            COUNTRIES={COUNTRIES}
            INDUSTRIES={INDUSTRIES}
            primaryButtonCls={primaryButtonCls}
            secondaryButtonCls={secondaryButtonCls}
            mobileButtonCls={mobileButtonCls}
            filterButtonCls={filterButtonCls}
          />

          {showCreateForm && (
            <div className="max-w-6xl mx-auto px-4 py-8">
              <BusinessProfileForm
                title="Create New Business"
                businessId={null}
                initialData={emptyBusinessForm}
                onSave={businessActions.createVerifiedBusiness}
                onCancel={() => {
                  router.push("/AdminDashboard");
                }}
                saving={businessActions.savingCreate}
                mode="create"
                showAdminFields={true}
              />
            </div>
          )}

          {businessActions.editingBusinessId && (
            <div className="max-w-6xl mx-auto px-4 py-8">
              <BusinessProfileForm
                title="Edit Business"
                businessId={businessActions.editingBusinessId}
                initialData={businessActions.draftBusiness}
                onSave={businessActions.saveBusiness}
                onCancel={businessActions.cancelEditingBusiness}
                saving={businessActions.savingEdit}
                mode="edit"
                showAdminFields={true}
              />
            </div>
          )}

          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <AdminTabsBar
              tabs={TABS}
              activeTab={activeTab}
              setActiveTab={handleTabChange}
              pendingClaimsCount={claims.filter((c) => c.status === "pending").length}
              onExport={handleExportCSV}
              onResetEditing={handleResetEditing}
              secondaryButtonCls={secondaryButtonCls}
            />
            <div className="p-4">
              {activeTab === "businesses" && (
                <BusinessesTab
                  businesses={businesses}
                  searchQuery={searchQuery}
                  filters={filters}
                  businessesFilter={businessesFilter}
                  setBusinessesFilter={setBusinessesFilter}
                  editingBusinessId={businessActions.editingBusinessId}
                  draftBusiness={businessActions.draftBusiness}
                  savingEdit={businessActions.savingEdit}
                  businessActions={businessActions}
                />
              )}

              {activeTab === "claims" && (
                <ClaimsTab
                  claims={claims}
                  businesses={businesses}
                  searchQuery={searchQuery}
                  claimsFilter={claimsFilter}
                  setClaimsFilter={setClaimsFilter}
                  claimActions={claimActions}
                />
              )}

              {activeTab === "client-discovery" && <ClientListManager />}

              {activeTab === "presentations" && <PresentationsTab />}

              {activeTab === "email" && <EmailMarketingDashboard />}

              {activeTab === "spotlight" && (
                <SpotlightGenerator businesses={businesses} />
              )}
            </div>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
