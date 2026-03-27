"use client";

import { Fragment, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { getAdminBusinesses } from "@/lib/supabase/queries/businesses";
import { useToast } from "@/components/ui/use-toast";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import {
  AlertTriangle,
  Building2,
  CheckCircle,
  Eye,
  Shield,
  Speech,
  XCircle,
} from "lucide-react";

import PortalShell from "@/components/portal/PortalShell";
import HeroStandard from "../components/shared/HeroStandard";
import BusinessProfileForm from "@/components/forms/BusinessProfileForm";
import AdminBusinessMobileCard from "@/components/admin/AdminBusinessMobileCard";
import AdminFiltersBar from "@/components/admin/AdminFiltersBar";
import AdminTabsBar from "@/components/admin/AdminTabsBar";
import ClaimMobileCard from "@/components/admin/ClaimMobileCard";
import PresentationsTab from "@/components/admin/PresentationsTab";
import EmailMarketingDashboard from "@/components/admindashboard/EmailMarketingDashboard";
import { formatDisplayList } from "@/utils/displayHelpers";
import { getBadgeStyles } from "@/components/admin/helpers/adminFormatting";
import {
  TABS,
  emptyBusinessForm,
  filterButtonCls,
  mobileButtonCls,
  primaryButtonCls,
  secondaryButtonCls,
} from "@/components/admin/constants/adminDashboardConstants";
import { BUSINESS_STATUS } from "@/constants/unifiedConstants";
import {
  COUNTRIES,
  INDUSTRIES,
  getCountryDisplayName,
  getIndustryDisplayName,
  getTierDisplayName,
} from "@/constants/unifiedConstants";
import { getLogoUrl } from "@/utils/bannerUtils";
import { createBusinessWithBranding } from "@/utils/businessCreationWithBranding";
import { formatDateConsistent } from "@/utils/dateUtils";

async function checkIsAdmin(user) {
  if (!user) return false;

  try {
    const { getSupabase } = await import("@/lib/supabase/client");
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (error || !data) {
      console.error("Error checking admin role:", error);
      return false;
    }

    return data.role === "admin";
  } catch (error) {
    console.error("Error checking admin role:", error);
    return false;
  }
}

export default function AdminDashboard() {
  const { confirm, confirmDestructive, DialogComponent } = useConfirmDialog();
  const { toast } = useToast();
  
  // Toast helper functions for consistent API
  const showSuccess = (title, description) =>
    toast({
      title,
      description,
    });

  const showError = (title, description) =>
    toast({
      title,
      description,
      variant: "destructive",
    });
  
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [activeTab, setActiveTab] = useState("active");

  const [businesses, setBusinesses] = useState([]);
  const [claims, setClaims] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [savingCreate, setSavingCreate] = useState(false);

  const [editingBusinessId, setEditingBusinessId] = useState(null);
  const [draftBusiness, setDraftBusiness] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const [filters, setFilters] = useState({
    country: "",
    industry: "",
    tier: "",
    is_verified: "",
  });

  // Fix hydration mismatch
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const loadAdminData = useCallback(async () => {
    if (!user) return;

    setDashboardLoading(true);

    try {
      const { getSupabase } = await import("@/lib/supabase/client");
      const supabase = getSupabase();

      const [businessesRes, claimsRes] = await Promise.all([
        getAdminBusinesses({
          limit: 500,
          status: ["active", "pending", "rejected"],
        }),
        supabase
          .from("claim_requests")
          .select(`
            id, business_id, user_id, status, business_email, business_phone,
            role, created_at, claim_type, message,
            reviewed_by, reviewed_at
          `)
          .eq("status", "pending")
          .order("created_at", { ascending: false })
          .limit(100),
      ]);

      if (businessesRes.error) {
        throw new Error(`Businesses query failed: ${businessesRes.error.message}`);
      }
      if (claimsRes.error) {
        throw new Error(`Claims query failed: ${claimsRes.error.message}`);
      }

      setBusinesses(businessesRes.data || []);
      setClaims(claimsRes.data || []);
    } catch (error) {
      console.error("Error loading admin data:", error);
      showError('Failed to load data', error.message || 'Unknown error');
    } finally {
      setDashboardLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (authLoading) return;

      if (!user) {
        setIsAdmin(false);
        setCheckingAdmin(false);
        setDashboardLoading(false);
        return;
      }

      try {
        setCheckingAdmin(true);
        const adminStatus = await checkIsAdmin(user);
        setIsAdmin(adminStatus);
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setCheckingAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user, authLoading]);

  useEffect(() => {
    if (authLoading || checkingAdmin) return;

    if (user && isAdmin) {
      loadAdminData();
    } else {
      setDashboardLoading(false);
    }
  }, [user, isAdmin, authLoading, checkingAdmin, loadAdminData]);

  const startEditingBusiness = (business) => {
    setEditingBusinessId(business.id);
    setDraftBusiness({
      ...emptyBusinessForm,
      ...business,
    });
  };

  const cancelEditingBusiness = () => {
    setEditingBusinessId(null);
    setDraftBusiness(null);
  };

  const resetCreateForm = () => {
    setShowCreateForm(false);
  };

  const updateStatus = async (business, newStatus) => {
    try {
      const { getSupabase } = await import("@/lib/supabase/client");
      const supabase = getSupabase();

      const updateData = {
        status: newStatus,
        updated_at: new Date().toISOString(),
      };

      if (
        business.status === BUSINESS_STATUS.PENDING &&
        newStatus === BUSINESS_STATUS.ACTIVE
      ) {
        updateData.is_claimed = true;
        updateData.is_verified = true;
        updateData.claimed_at = new Date().toISOString();
        updateData.claimed_by = user?.id;
      }

      const { data, error } = await supabase
        .from("businesses")
        .update(updateData)
        .eq("id", business.id)
        .select()
        .single();

      if (error) throw error;
      if (!data) {
        throw new Error("Status update completed but no updated row was returned.");
      }

      setBusinesses((prev) =>
        prev.map((b) => (b.id === business.id ? { ...b, ...data } : b))
      );

      await loadAdminData();
      showSuccess('Business status changed', `Status changed to ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);
      showError('Unable to update business status', 'Please try again.');
    }
  };

  const updateClaim = async (claim, newStatus) => {
    try {
      const { getSupabase } = await import("@/lib/supabase/client");
      const supabase = getSupabase();

      const { data, error } = await supabase
        .from("claim_requests")
        .update({
          status: newStatus,
          reviewed_at: new Date().toISOString(),
          reviewed_by: user?.id,
        })
        .eq("id", claim.id)
        .select();

      if (error) throw error;

      if (newStatus !== "pending") {
        setClaims((prev) => prev.filter((c) => c.id !== claim.id));
      } else {
        setClaims((prev) =>
          prev.map((c) => (c.id === claim.id ? { ...c, status: newStatus } : c))
        );
      }

      if (newStatus === "approved") {
        const matchedBusiness = businesses.find((b) => b.id === claim.business_id);
        if (matchedBusiness) {
          const { getSupabase } = await import("@/lib/supabase/client");
          const supabase = getSupabase();

          const { error: ownershipError } = await supabase
            .from("businesses")
            .update({
              owner_user_id: claim.user_id,
              claimed_at: new Date().toISOString(),
              claimed_by: claim.user_id,
              is_claimed: true,
              is_verified: true,
              updated_at: new Date().toISOString(),
            })
            .eq("id", claim.business_id);

          if (ownershipError) {
            console.error("Error updating business ownership:", ownershipError);
            throw ownershipError;
          }
        } else {
          console.error("Business not found for claim approval:", claim.business_id);
        }
      }

      await loadAdminData();
      showSuccess('Claim status changed', `Status changed to ${newStatus}`);
    } catch (error) {
      console.error("Error updating claim:", error);
      showError('Unable to update claim status', 'Please try again.');
    }
  };

  const deleteBusiness = async (businessId) => {
    const confirmed = await confirmDestructive({
      title: "Delete Business",
      description: "Are you sure you want to delete this business? This action cannot be undone.",
      confirmText: "Delete Business",
      cancelText: "Cancel"
    });
    
    if (!confirmed) return;

    try {
      const { getSupabase } = await import("@/lib/supabase/client");
      const supabase = getSupabase();

      const { error } = await supabase.from("businesses").delete().eq("id", businessId);

      if (error) throw error;

      setBusinesses((prev) => prev.filter((b) => b.id !== businessId));

      if (editingBusinessId === businessId) {
        cancelEditingBusiness();
      }

      showSuccess('Business deleted', 'The business has been permanently deleted.');
    } catch (error) {
      console.error("Error deleting business:", error);
      showError('Unable to delete business', 'Please try again.');
    }
  };

  const saveBusiness = async (payload) => {
    setSavingEdit(true);

    try {
      const { getSupabase } = await import("@/lib/supabase/client");
      const supabase = getSupabase();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error("Authentication required for admin operations");
      }

      const {
        businessId,
        businessesData = {},
        files = {},
        removals = {},
      } = payload;

      if (!businessId) {
        throw new Error("Missing business id for update.");
      }

      // Use FormData to support file uploads (File objects can't be JSON-serialized)
      const formData = new FormData();
      formData.append('businessesData', JSON.stringify(businessesData));
      formData.append('removals', JSON.stringify(removals));

      // Append actual file objects if present
      if (files.logo_file instanceof File) {
        formData.append('logo_file', files.logo_file);
      }
      if (files.banner_file instanceof File) {
        formData.append('banner_file', files.banner_file);
      }
      if (files.mobile_banner_file instanceof File) {
        formData.append('mobile_banner_file', files.mobile_banner_file);
      }

      const response = await fetch(`/api/admin/businesses/${businessId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.details
            ? `${errorData.error}: ${errorData.details}` 
            : (errorData.error || 'Failed to update business')
        );
      }

      const { business: data } = await response.json();

      setBusinesses((prev) =>
        prev.map((b) => (b.id === businessId ? { ...b, ...data } : b))
      );

      if (editingBusinessId === businessId) {
        setDraftBusiness((prev) => (prev ? { ...prev, ...data } : prev));
      }

      cancelEditingBusiness();
      showSuccess('Business updated', 'The business has been successfully updated.');

      return data;
    } catch (error) {
      showError('Unable to update business', error?.message || 'Please try again.');
      throw error;
    } finally {
      setSavingEdit(false);
    }
  };

  const createVerifiedBusiness = async (payload) => {
    setSavingCreate(true);

    try {
      const { getSupabase } = await import("@/lib/supabase/client");
      const supabase = getSupabase();

      const {
        businessesData = {},
        files = {},
        removals = {},
      } = payload;

      let businessData = {
        ...businessesData,
        status: BUSINESS_STATUS.ACTIVE,
        is_verified: true,
        is_claimed: true,
        created_date: new Date().toISOString().split("T")[0],
        updated_at: new Date().toISOString(),
      };

      const data = await createBusinessWithBranding({
        supabase,
        businessesData: businessData,
        files,
        removals,
        allowCustomBranding: true,
        createRow: async (payloadToCreate) => {
          const { data: createdRow, error } = await supabase
            .from("businesses")
            .insert(payloadToCreate)
            .select(`
              id,
              business_name,
              business_handle,
              description,
              industry,
              country,
              city,
              status,
              visibility_tier,
              is_verified,
              is_claimed,
              business_email,
              business_website,
              logo_url,
              banner_url,
              mobile_banner_url,
              owner_user_id,
              created_date,
              updated_at,
              subscription_tier
            `)
            .single();

          if (error) {
            throw error;
          }

          return createdRow;
        },
        updateRow: async (businessId, brandingPayload) => {
          const { data: updatedRow, error } = await supabase
            .from("businesses")
            .update({
              ...brandingPayload,
              updated_at: new Date().toISOString(),
            })
            .eq("id", businessId)
            .select(`
              id,
              business_name,
              business_handle,
              description,
              industry,
              country,
              city,
              status,
              visibility_tier,
              is_verified,
              is_claimed,
              business_email,
              business_website,
              logo_url,
              banner_url,
              mobile_banner_url,
              owner_user_id,
              created_date,
              updated_at,
              subscription_tier
            `)
            .single();

          if (error) {
            throw error;
          }

          return updatedRow;
        },
      });

      if (!data) {
        throw new Error("Insert completed but no business row was returned.");
      }

      setBusinesses((prev) => [data, ...prev]);
      resetCreateForm();
      showSuccess('Business created', 'The listing was created and automatically verified.');

      return data;
    } catch (error) {
      console.error("Error creating business:", error);
      showError('Unable to create business', error?.message || 'Please try again.');
      throw error;
    } finally {
      setSavingCreate(false);
    }
  };

  const exportCSV = () => {
    const fields = [
      "business_name",
      "business_handle",
      "description",
      "industry",
      "country",
      "city",
      "status",
      "subscription_tier",
      "is_verified",
      "is_claimed",
      "business_email",
      "business_website",
    ];

    const header = fields.join(",");
    const rows = businesses.map((b) =>
      fields.map((f) => `"${(b[f] ?? "").toString().replace(/"/g, '""')}"`).join(",")
    );

    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pacific_market_registry.csv";
    a.click();
  };

  if (authLoading || checkingAdmin || dashboardLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f9fc]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[#0d4f4f] border-t-transparent" />
          <h2 className="mb-2 text-xl font-bold text-[#0a1628]">
            {authLoading
              ? "Restoring Session"
              : checkingAdmin
              ? "Checking Access"
              : "Loading Dashboard"}
          </h2>
          <p className="text-sm text-gray-500">
            {authLoading
              ? "Signing you in..."
              : checkingAdmin
              ? "Verifying admin privileges..."
              : "Loading admin data..."}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f9fc] px-4">
        <div className="max-w-sm rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
          <AlertTriangle className="mx-auto mb-4 h-10 w-10 text-red-400" />
          <h2 className="mb-2 text-xl font-bold text-[#0a1628]">
            Authentication Required
          </h2>
          <p className="mb-6 text-sm text-gray-500">
            Please sign in to access this page.
          </p>
          <button
            onClick={() => router.push("/BusinessLogin")}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0d4f4f] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1a6b6b]"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f9fc] px-4">
        <div className="max-w-sm rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
          <AlertTriangle className="mx-auto mb-4 h-10 w-10 text-red-400" />
          <h2 className="mb-2 text-xl font-bold text-[#0a1628]">Access Denied</h2>
          <p className="mb-6 text-sm text-gray-500">
            Admin access required to view this page. Your account does not have admin privileges.
          </p>
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0d4f4f] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1a6b6b]"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const statusTab = TABS.find((tab) => tab.id === activeTab && tab.status);
  const filtered = statusTab
    ? businesses.filter((b) => b.status === statusTab.status)
    : [];

  const getFilteredData = () => {
    let data = filtered;

    if (searchQuery) {
      data = data.filter(
        (business) =>
          business.business_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          business.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          business.industry?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filters.country) {
      data = data.filter((business) => business.country === filters.country);
    }
    if (filters.industry) {
      data = data.filter((business) => business.industry === filters.industry);
    }
    if (filters.tier) {
      data = data.filter((business) => business.subscription_tier === filters.tier);
    }
    if (filters.is_verified !== "") {
      const isVerified = filters.is_verified === "true";
      data = data.filter((business) => business.is_verified === isVerified);
    }

    return data;
  };

  const getFilteredClaims = () => {
    let filteredClaims = claims;

    if (searchQuery) {
      filteredClaims = filteredClaims.filter((claim) => {
        const business = businesses.find((b) => b.id === claim.business_id);
        return (
          claim.business_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          claim.business_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          business?.business_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          business?.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    return filteredClaims;
  };

  const filteredData = getFilteredData();
  const filteredClaimsData = getFilteredClaims();

  const pendingCount = businesses.filter(
    (b) => b.status === BUSINESS_STATUS.PENDING
  ).length;
  const pendingClaimsCount = claims.filter((c) => c.status === "pending").length;

  const executiveStats = [
    {
      label: "Total Businesses",
      value: businesses.length,
      color: "text-blue-600",
    },
    {
      label: "Verified",
      value: businesses.filter((b) => b.is_verified).length,
      color: "text-green-600",
    },
    {
      label: "Pending Review",
      value: pendingCount,
      color: "text-yellow-600",
    },
    {
      label: "Pending Claims",
      value: pendingClaimsCount,
      color: "text-purple-600",
    },
  ];

  const activeFilterCount = Object.values(filters).filter((v) => v !== "").length;

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
            onToggleCreate={() => {
              setShowCreateForm((prev) => !prev);
              cancelEditingBusiness();
            }}
            showCreateForm={showCreateForm}
            COUNTRIES={COUNTRIES}
            INDUSTRIES={INDUSTRIES}
            primaryButtonCls={primaryButtonCls}
            secondaryButtonCls={secondaryButtonCls}
            mobileButtonCls={mobileButtonCls}
            filterButtonCls={filterButtonCls}
          />

          {showCreateForm && (
            <div className="mb-6">
              <BusinessProfileForm
                title="Create New Business"
                businessId={null}
                initialData={emptyBusinessForm}
                onSave={createVerifiedBusiness}
                onCancel={resetCreateForm}
                saving={savingCreate}
                mode="create"
                showAdminFields={true}
              />
            </div>
          )}

          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <AdminTabsBar
              tabs={TABS}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              pendingCount={pendingCount}
              pendingClaimsCount={pendingClaimsCount}
              onExport={exportCSV}
              onResetEditing={cancelEditingBusiness}
              secondaryButtonCls={secondaryButtonCls}
            />

            <div className="p-4">
              {activeTab === "claims" && (
                <div className="space-y-3">
                  {filteredClaimsData.length === 0 ? (
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-12 text-center">
                      <Shield className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                      <p className="text-sm text-gray-500">No claim requests found.</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3 lg:hidden">
                        {filteredClaimsData.map((claim) => {
                          const business = businesses.find(
                            (b) => b.id === claim.business_id
                          );
                          return (
                            <ClaimMobileCard
                              key={claim.id}
                              claim={claim}
                              business={business}
                              onApprove={() => updateClaim(claim, "approved")}
                              onDeny={() => updateClaim(claim, "rejected")}
                            />
                          );
                        })}
                      </div>

                      <div className="hidden space-y-3 lg:block">
                        {filteredClaimsData.map((claim) => {
                          const business = businesses.find(
                            (b) => b.id === claim.business_id
                          );
                          return (
                            <div
                              key={claim.id}
                              className="rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
                            >
                              <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-[#0a1628] to-[#0d4f4f]">
                                  <img
                                    src={getLogoUrl(business)}
                                    alt=""
                                    className="h-full w-full object-cover"
                                  />
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div className="mb-1 flex flex-wrap items-center gap-2">
                                    <span className="font-semibold text-[#0a1628]">
                                      {business?.business_name || "Unknown Business"}
                                    </span>
                                    <span
                                      className={`rounded-full border px-2 py-1 text-xs font-medium ${
                                        claim.status === "approved"
                                          ? getBadgeStyles("success")
                                          : claim.status === "rejected"
                                          ? getBadgeStyles("danger")
                                          : claim.status === "pending"
                                          ? getBadgeStyles("warning")
                                          : getBadgeStyles("neutral")
                                      }`}
                                    >
                                      {claim.status
                                        ? claim.status.charAt(0).toUpperCase() +
                                          claim.status.slice(1)
                                        : "Unknown"}
                                    </span>
                                    {business && (
                                      <span
                                        className={`rounded-full border px-2 py-1 text-xs ${getBadgeStyles(
                                          "neutral"
                                        )}`}
                                      >
                                        {getTierDisplayName(
                                          business.subscription_tier
                                        ) ||
                                          business.subscription_tier ||
                                          "vaka"}
                                      </span>
                                    )}
                                  </div>

                                  <p className="text-xs text-gray-500">
                                    {business?.country || "Unknown"} ·{" "}
                                    {business?.industry || "Unknown"} ·{" "}
                                    {claim.business_email}
                                  </p>

                                  <div className="mt-2 space-y-1">
                                    <p className="text-xs text-gray-600">
                                      <span className="font-medium">Contact:</span>{" "}
                                      {claim.business_email || "Not provided"}
                                    </p>
                                    {claim.business_phone && (
                                      <p className="text-xs text-gray-600">
                                        <span className="font-medium">Phone:</span>{" "}
                                        {claim.business_phone}
                                      </p>
                                    )}
                                    <p className="text-xs text-gray-600">
                                      <span className="font-medium">Role:</span>{" "}
                                      {claim.role || "Not specified"}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                      <span className="font-medium">Claim Type:</span>{" "}
                                      {claim.claim_type || "Standard request"}
                                    </p>
                                    {claim.message && (
                                      <p className="text-xs text-gray-600">
                                        <span className="font-medium">Message:</span>{" "}
                                        {claim.message}
                                      </p>
                                    )}
                                  </div>

                                  <p className="mt-1 text-xs text-gray-400">
                                    Requested{" "}
                                    {claim.created_at || claim.created_date
                                      ? new Date(
                                          claim.created_at || claim.created_date
                                        ).toLocaleDateString()
                                      : "—"}
                                  </p>
                                </div>

                                <div className="flex flex-shrink-0 items-center gap-2">
                                  {claim.status === "pending" && (
                                    <>
                                      <button
                                        onClick={() => updateClaim(claim, "approved")}
                                        className={`inline-flex items-center gap-1 rounded-xl border px-3 py-1.5 text-xs font-semibold ${getBadgeStyles(
                                          "success"
                                        )}`}
                                      >
                                        <CheckCircle className="h-3 w-3" />
                                        Approve
                                      </button>
                                      <button
                                        onClick={() => updateClaim(claim, "rejected")}
                                        className={`inline-flex items-center gap-1 rounded-xl border px-3 py-1.5 text-xs font-semibold ${getBadgeStyles(
                                          "danger"
                                        )}`}
                                      >
                                        <XCircle className="h-3 w-3" />
                                        Reject
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeTab === "presentations" && <PresentationsTab />}

              {activeTab === "email" && <EmailMarketingDashboard />}

              {activeTab !== "claims" && activeTab !== "presentations" && activeTab !== "email" && (
                <div className="space-y-3">
                  {filteredData.length === 0 ? (
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-12 text-center">
                      <Building2 className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                      <p className="text-sm text-gray-500">
                        No {activeTab} businesses found.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3 lg:hidden">
                        {filteredData.map((business) => (
                          <AdminBusinessMobileCard
                            key={business.id}
                            business={business}
                            isEditing={editingBusinessId === business.id}
                            draftBusiness={
                              editingBusinessId === business.id ? draftBusiness : null
                            }
                            onApprove={() =>
                              updateStatus(business, BUSINESS_STATUS.ACTIVE)
                            }
                            onReject={() =>
                              updateStatus(business, BUSINESS_STATUS.REJECTED)
                            }
                            onEdit={() => {
                              if (editingBusinessId === business.id) {
                                cancelEditingBusiness();
                              } else {
                                startEditingBusiness(business);
                                setShowCreateForm(false);
                              }
                            }}
                            onDelete={() => deleteBusiness(business.id)}
                            onSave={saveBusiness}
                            onCancel={cancelEditingBusiness}
                            savingEdit={savingEdit}
                          />
                        ))}
                      </div>

                      <div className="hidden overflow-hidden rounded-xl border border-gray-200 bg-white lg:block">
                        <table className="w-full">
                          <thead className="border-b border-gray-200 bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Business
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Details
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Status
                              </th>
                              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                Actions
                              </th>
                            </tr>
                          </thead>

                          <tbody className="divide-y divide-gray-200">
                            {filteredData.map((b) => (
                              <Fragment key={b.id}>
                                <tr className="hover:bg-gray-50">
                                  <td className="px-4 py-4">
                                    <div className="flex items-center gap-3">
                                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gradient-to-br from-[#0a1628] to-[#0d4f4f]">
                                        <img
                                          src={getLogoUrl(b)}
                                          alt=""
                                          className="h-full w-full object-cover"
                                          onError={(e) => {
                                            e.currentTarget.src = getLogoUrl(b);
                                          }}
                                        />
                                      </div>

                                      <div>
                                        <div className="font-medium text-[#0a1628]">
                                          {b.business_name}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          {b.business_email || "No email"}
                                        </div>
                                      </div>
                                    </div>
                                  </td>

                                  <td className="px-4 py-4">
                                    <div className="text-sm text-gray-600">
                                      {getCountryDisplayName(b.country)} ·{" "}
                                      {getIndustryDisplayName(b.industry) ||
                                        "No industry"}
                                    </div>

                                    {b.cultural_identity && (
                                      <div className="mt-1 text-xs text-gray-500">
                                        Cultural: {b.cultural_identity}
                                      </div>
                                    )}

                                    {b.languages_spoken && (
                                      <div className="mt-2">
                                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#00c4cc]">
                                          <Speech className="h-3 w-3 flex-shrink-0" />
                                          {formatDisplayList(b.languages_spoken, { max: 2, separator: " & " })}
                                        </span>
                                      </div>
                                    )}

                                    <div className="mt-1 text-xs text-gray-400">
                                      Submitted{" "}
                                      {b.created_date
                                        ? new Date(b.created_date).toLocaleDateString()
                                        : "—"}
                                    </div>
                                  </td>

                                  <td className="px-4 py-4">
                                    <div className="flex items-center gap-2">
                                      <span
                                        className={`rounded-full border px-2 py-1 text-xs font-medium ${getBadgeStyles(
                                          b.is_verified ? "premium" : "neutral"
                                        )}`}
                                      >
                                        {getTierDisplayName(b.subscription_tier) ||
                                          b.subscription_tier ||
                                          "vaka"}
                                      </span>
                                      {b.is_verified && (
                                        <span
                                          className={`rounded-full border px-2 py-1 text-xs font-medium ${getBadgeStyles(
                                            "success"
                                          )}`}
                                        >
                                          Verified
                                        </span>
                                      )}
                                    </div>
                                  </td>

                                  <td className="px-4 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                      <button
                                        onClick={() => {
                                          const businessHandle = b.business_handle || b.id;
                                          window.open(
                                            `/BusinessProfile?handle=${businessHandle}`,
                                            "_blank"
                                          );
                                        }}
                                        className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs transition-all ${secondaryButtonCls}`}
                                      >
                                        <Eye className="h-3 w-3" />
                                        View
                                      </button>

                                      {b.status === BUSINESS_STATUS.PENDING && (
                                        <>
                                          <button
                                            onClick={() =>
                                              updateStatus(b, BUSINESS_STATUS.ACTIVE)
                                            }
                                            className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs transition-all ${getBadgeStyles(
                                              "success"
                                            )}`}
                                          >
                                            <CheckCircle className="h-3 w-3" />
                                            Approve
                                          </button>

                                          <button
                                            onClick={() =>
                                              updateStatus(b, BUSINESS_STATUS.REJECTED)
                                            }
                                            className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs transition-all ${getBadgeStyles(
                                              "danger"
                                            )}`}
                                          >
                                            <XCircle className="h-3 w-3" />
                                            Deny
                                          </button>
                                        </>
                                      )}

                                      <button
                                        onClick={() => {
                                          setShowCreateForm(false);
                                          if (editingBusinessId === b.id) {
                                            cancelEditingBusiness();
                                          } else {
                                            startEditingBusiness(b);
                                          }
                                        }}
                                        className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs transition-all ${secondaryButtonCls}`}
                                      >
                                        {editingBusinessId === b.id ? "Close" : "Edit"}
                                      </button>

                                      <button
                                        onClick={() => deleteBusiness(b.id)}
                                        className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs transition-all ${getBadgeStyles(
                                          "danger"
                                        )}`}
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </td>
                                </tr>

                                {editingBusinessId === b.id && draftBusiness && (
                                  <tr>
                                    <td colSpan={4} className="bg-gray-50 px-4 py-5">
                                      <BusinessProfileForm
                                        title={`Edit ${b.business_name}`}
                                        businessId={b.id}
                                        initialData={draftBusiness}
                                        onSave={saveBusiness}
                                        onCancel={cancelEditingBusiness}
                                        saving={savingEdit}
                                        mode="edit"
                                        showAdminFields={true}
                                      />
                                    </td>
                                  </tr>
                                )}
                              </Fragment>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Confirmation Dialog */}
      {DialogComponent}
    </PortalShell>
  );
}