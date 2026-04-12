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
import { useEffect, useState } from 'react';
import EmailMarketingDashboard from "../admindashboard/EmailMarketingDashboard";
import WelcomeStoryGenerator from "../social-generator/WelcomeStoryGenerator";
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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Local UI state (excluding editing state which is handled by parent)
  const [activeTab, setActiveTab] = useState('businesses');

  // Load active tab from localStorage on client side only
  useEffect(() => {
    const savedTab = localStorage.getItem('admin-active-tab');
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);
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

  // Calculate executive stats - only on client
  const _executiveStats = isClient ? createExecutiveStats(businesses, claims) : [];
  const activeFilterCount = Object.values(filters).filter((v) => v !== "").length;

  // Handle tab change
  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    businessActions.cancelEditingBusiness();
  };

  // Save active tab to localStorage when it changes
  useEffect(() => {
    if (activeTab) {
      localStorage.setItem('admin-active-tab', activeTab);
    }
  }, [activeTab]);

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

  return (
    <PortalShell>
      <HeroStandard
        badge="Admin Dashboard"
        title="Pacific Discovery Network Registry"
        subtitle="Administrative control center for business listings"
        description=""
        showStats={false}
        stats={[]}
        actions={null}
      />

      {/* Executive stats - only render on client to prevent hydration mismatch */}
      {isClient && _executiveStats.length > 0 && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {_executiveStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className={`text-2xl font-bold ${stat.color || "text-gray-900"}`}>
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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
              {/* Data-driven tabs: re-render from props, safe to conditionally mount */}
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

              {/* Stateful tabs: keep mounted to preserve in-progress work.
                  Hidden via CSS display:none so React state survives tab switches. */}

              <div style={{ display: activeTab === "presentations" ? "block" : "none" }}>
                <PresentationsTab />
              </div>

              <div style={{ display: activeTab === "email" ? "block" : "none" }}>
                <EmailMarketingDashboard />
              </div>

              <div style={{ display: activeTab === "spotlight" ? "block" : "none" }}>
                <WelcomeStoryGenerator businesses={businesses} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
