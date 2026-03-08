"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createPageUrl } from "@/utils";
import { getSupabase } from "@/lib/supabase/client";
import {
  Building2,
  Plus,
  Edit,
  Star,
  Shield,
  CheckCircle,
  ChevronRight,
  AlertTriangle,
  Trash2,
  Search,
  Users,
  X,
  Filter,
  Clock,
  XCircle,
  Download,
  Eye,
} from "lucide-react";
import DetailedBusinessForm, { FORM_MODES } from "@/components/forms/DetailedBusinessForm";
import {
  COUNTRIES,
  INDUSTRIES,
  BUSINESS_STATUS,
  BUSINESS_TIER,
  BUSINESS_SOURCE,
  getTierDisplayName,
} from "@/constants/unifiedConstants";
import HeroRegistry from "@/components/shared/HeroRegistry";
import FounderInsightsSummary from "@/components/insights/FounderInsightsSummary";
import { isAdmin as checkIsAdmin } from "@/utils/roleHelpers";
import PortalShell from "@/components/portal/PortalShell";
import { useToast } from "@/components/ui/toast/ToastProvider";

const TABS = [
  { id: "active", label: "Active", icon: CheckCircle, color: "text-green-600", status: BUSINESS_STATUS.ACTIVE },
  { id: "pending", label: "Pending", icon: Clock, color: "text-yellow-600", status: BUSINESS_STATUS.PENDING },
  { id: "claims", label: "Claims", icon: Shield, color: "text-blue-600" },
  { id: "insights", label: "Insights", icon: Users, color: "text-purple-600" },
  { id: "rejected", label: "Rejected", icon: XCircle, color: "text-red-500", status: BUSINESS_STATUS.REJECTED },
];

const getBadgeStyles = (variant) => {
  const styles = {
    success: "bg-green-100 text-green-800 border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    danger: "bg-red-100 text-red-800 border-red-200",
    info: "bg-blue-100 text-blue-800 border-blue-200",
    premium: "bg-amber-100 text-amber-800 border-amber-200",
    neutral: "bg-gray-100 text-gray-800 border-gray-200",
  };
  return styles[variant] || styles.neutral;
};

const mobileButtonCls =
  "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition";
const primaryButtonCls =
  `${mobileButtonCls} bg-[#0a1628] text-white hover:bg-[#122040]`;
const secondaryButtonCls =
  `${mobileButtonCls} border border-gray-200 bg-white text-[#0a1628] hover:bg-gray-50`;
const filterButtonCls =
  `${mobileButtonCls} border border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200`;

function AdminBusinessMobileCard({
  business,
  onApprove,
  onReject,
  onEdit,
  onDelete,
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#0a1628] to-[#0d4f4f]">
          <span className="text-sm font-bold text-white">
            {business.name?.[0] || "?"}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-[#0a1628] break-words">
              {business.name}
            </h3>

            <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${getBadgeStyles("neutral")}`}>
              {business.subscription_tier || "vaka"}
            </span>

            {business.verified && (
              <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${getBadgeStyles("success")}`}>
                Verified
              </span>
            )}
          </div>

          <p className="mt-1 text-xs text-gray-500">
            {business.country || "Unknown"} · {business.industry || "No industry"}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Submitted {business.created_date ? new Date(business.created_date).toLocaleDateString() : "—"}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {business.status === BUSINESS_STATUS.PENDING && (
          <>
            <button
              onClick={onApprove}
              className={`inline-flex min-h-[40px] items-center gap-1 rounded-lg border px-3 py-2 text-xs font-semibold ${getBadgeStyles("success")}`}
            >
              <CheckCircle className="h-3.5 w-3.5" />
              Approve
            </button>
            <button
              onClick={onReject}
              className={`inline-flex min-h-[40px] items-center gap-1 rounded-lg border px-3 py-2 text-xs font-semibold ${getBadgeStyles("danger")}`}
            >
              <XCircle className="h-3.5 w-3.5" />
              Reject
            </button>
          </>
        )}

        <button
          onClick={onEdit}
          className={`${secondaryButtonCls} min-h-[40px] px-3 py-2 text-xs`}
        >
          <Edit className="h-3.5 w-3.5" />
          Edit
        </button>

        <Link
          href={createPageUrl("BusinessProfile") + `?handle=${business.business_handle || business.id}`}
          className={`${secondaryButtonCls} min-h-[40px] px-3 py-2 text-xs`}
        >
          <Eye className="h-3.5 w-3.5" />
          View
        </Link>

        <button
          onClick={onDelete}
          className="inline-flex min-h-[40px] items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </button>
      </div>
    </div>
  );
}

function ClaimMobileCard({ claim, business, onApprove, onDeny }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#0a1628] to-[#0d4f4f]">
          <span className="text-sm font-bold text-white">
            {business?.name?.[0] || "?"}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-[#0a1628] break-words">
              {business?.name || "Unknown Business"}
            </h3>
            <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${getBadgeStyles("info")}`}>
              Claim Request
            </span>
          </div>

          <p className="mt-1 text-xs text-gray-500">
            {business?.country || "Unknown"} · {business?.industry || "Unknown"}
          </p>
          <p className="mt-1 text-xs text-gray-500 break-all">{claim.user_email}</p>
          <p className="mt-1 text-xs text-gray-400">
            Requested {claim.created_date ? new Date(claim.created_date).toLocaleDateString() : "—"}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={onApprove}
          className={`inline-flex min-h-[40px] items-center gap-1 rounded-lg border px-3 py-2 text-xs font-semibold ${getBadgeStyles("success")}`}
        >
          <CheckCircle className="h-3.5 w-3.5" />
          Approve
        </button>
        <button
          onClick={onDeny}
          className={`inline-flex min-h-[40px] items-center gap-1 rounded-lg border px-3 py-2 text-xs font-semibold ${getBadgeStyles("danger")}`}
        >
          <XCircle className="h-3.5 w-3.5" />
          Deny
        </button>
      </div>
    </div>
  );
}

function InsightMobileCard({ business, snapshot, onView }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-[#0a1628]">{business.name}</h3>
            <span className={`rounded-full border px-2 py-0.5 text-[11px] ${getBadgeStyles("neutral")}`}>
              {business.subscription_tier}
            </span>
            {business.verified && (
              <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${getBadgeStyles("premium")}`}>
                Verified
              </span>
            )}
          </div>

          <p className="mt-1 text-xs text-gray-500">
            {business.country} · {business.industry || "No industry"}
          </p>

          {business.founder_snapshot_completed_at && (
            <p className="mt-1 text-xs text-gray-400">
              Submitted {new Date(business.founder_snapshot_completed_at).toLocaleDateString()}
            </p>
          )}

          {snapshot && (
            <div className="mt-3 flex flex-wrap gap-2">
              {snapshot.year_started && (
                <span className={`rounded-full border px-2 py-0.5 text-[11px] ${getBadgeStyles("neutral")}`}>
                  Year: {snapshot.year_started}
                </span>
              )}
              {snapshot.team_size_band && (
                <span className={`rounded-full border px-2 py-0.5 text-[11px] ${getBadgeStyles("neutral")}`}>
                  Team: {snapshot.team_size_band}
                </span>
              )}
              {snapshot.business_stage && (
                <span className={`rounded-full border px-2 py-0.5 text-[11px] ${getBadgeStyles("neutral")}`}>
                  Stage: {snapshot.business_stage}
                </span>
              )}
            </div>
          )}
        </div>

        <button
          onClick={onView}
          className="inline-flex min-h-[40px] items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-[#0d4f4f] hover:bg-[#0d4f4f]/5"
        >
          View
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [businesses, setBusinesses] = useState([]);
  const [claims, setClaims] = useState([]);
  const [insightSnapshots, setInsightSnapshots] = useState([]);
  const [activeTab, setActiveTab] = useState("active");
  const [editingBusiness, setEditingBusiness] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [currentEditStep, setCurrentEditStep] = useState(1);
  const [creatingBusiness, setCreatingBusiness] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedInsightBusiness, setSelectedInsightBusiness] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    country: "",
    industry: "",
    tier: "",
    verified: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  const { toast } = useToast();

  const getLatestSnapshot = (businessId) =>
    insightSnapshots.find((s) => s.business_id === businessId);

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        const supabase = getSupabase();

        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          setLoading(false);
          return;
        }

        const { data: profileData } = await supabase
          .from("profiles")
          .select("role, display_name")
          .eq("id", user.id)
          .single();

        const enhancedUser = {
          ...user,
          role: profileData?.role || "owner",
          permissions: profileData?.role === "admin" ? ["read", "write", "delete"] : [],
          full_name:
            profileData?.display_name ||
            user.user_metadata?.full_name ||
            user.user_metadata?.display_name,
          display_name:
            profileData?.display_name ||
            user.user_metadata?.display_name ||
            user.user_metadata?.full_name,
        };

        setUser(enhancedUser);

        if (checkIsAdmin(enhancedUser)) {
          setIsAdmin(true);

          const [businessesResult, claimsResult] = await Promise.all([
            supabase
              .from("businesses")
              .select("*")
              .order("created_date", { ascending: false })
              .limit(200),
            supabase
              .from("claim_requests")
              .select("*")
              .order("created_date", { ascending: false })
              .limit(100),
          ]);

          const loadedBusinesses = businessesResult.data || [];
          const loadedClaims = claimsResult.data || [];

          setBusinesses(loadedBusinesses);
          setClaims(loadedClaims);

          const businessIds = loadedBusinesses.map((business) => business.id);
          let snapshots = [];

          if (businessIds.length) {
            const { data } = await supabase
              .from("business_insights_snapshots")
              .select("*")
              .in("business_id", businessIds)
              .order("submitted_date", { ascending: false });

            snapshots = data || [];
          }

          setInsightSnapshots(snapshots);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error loading admin data:", error);
        setLoading(false);
      }
    };

    loadAdminData();
  }, []);

  const createVerifiedBusinessUpdates = () => ({
    subscription_tier: BUSINESS_TIER.VAKA,
    verified: true,
  });

  const updateStatus = async (business, status) => {
    try {
      const supabase = getSupabase();

      const updates =
        status === BUSINESS_STATUS.ACTIVE
          ? { status, ...createVerifiedBusinessUpdates() }
          : { status };

      const { error } = await supabase
        .from("businesses")
        .update(updates)
        .eq("id", business.id);

      if (error) throw error;

      setBusinesses((prev) =>
        prev.map((b) => (b.id === business.id ? { ...b, ...updates } : b))
      );

      toast({
        title: "Status Updated",
        description:
          status === BUSINESS_STATUS.ACTIVE
            ? "Business approved and automatically verified!"
            : `Business status has been updated to ${status}.`,
        variant: "success",
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update business status. Please try again.",
        variant: "error",
      });
    }
  };

  const handleEditStepChange = (stepInfo) => {
    setCurrentEditStep(stepInfo.currentStep);
  };

  const saveBusiness = async (formData) => {
    setSavingEdit(true);
    try {
      const supabase = getSupabase();

      const { id, ...updateData } = formData;

      const safeUpdateData = Object.keys(updateData).reduce((acc, key) => {
        if (
          !["updated_date", "created_date", "verification_source", "tagline", "website"].includes(key)
        ) {
          acc[key] = updateData[key];
        }
        return acc;
      }, {});

      const { error } = await supabase
        .from("businesses")
        .update(safeUpdateData)
        .eq("id", id);

      if (error) throw error;

      setBusinesses((prev) =>
        prev.map((b) => (b.id === id ? { ...b, ...safeUpdateData } : b))
      );
      setEditingBusiness(null);
      setCurrentEditStep(1);

      toast({
        title: "Business Updated",
        description: "Business updated successfully.",
        variant: "success",
      });
    } catch (error) {
      console.error("Error updating business:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update business. Please try again.",
        variant: "error",
      });
    } finally {
      setSavingEdit(false);
    }
  };

  const deleteBusiness = async (id) => {
    if (!confirm("Delete this business record? This cannot be undone.")) return;

    try {
      const supabase = getSupabase();
      const { error } = await supabase.from("businesses").delete().eq("id", id);

      if (error) throw error;

      setBusinesses((prev) => prev.filter((b) => b.id !== id));

      toast({
        title: "Business Deleted",
        description: "Business has been successfully deleted.",
        variant: "success",
      });
    } catch (error) {
      console.error("Error deleting business:", error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete business. Please try again.",
        variant: "error",
      });
    }
  };

  const updateClaim = async (claim, status) => {
    try {
      const supabase = getSupabase();

      const { error: claimError } = await supabase
        .from("claim_requests")
        .update({ status })
        .eq("id", claim.id);

      if (claimError) throw claimError;

      setClaims((prev) =>
        prev.map((c) => (c.id === claim.id ? { ...c, status } : c))
      );

      if (status === "approved") {
        const businessUpdates = {
          owner_user_id: claim.user_id,
          claimed: true,
          status: BUSINESS_STATUS.ACTIVE,
          ...createVerifiedBusinessUpdates(),
        };

        const { error: businessError } = await supabase
          .from("businesses")
          .update(businessUpdates)
          .eq("id", claim.business_id);

        if (businessError) throw businessError;

        setBusinesses((prev) =>
          prev.map((b) =>
            b.id === claim.business_id ? { ...b, ...businessUpdates } : b
          )
        );
      }

      toast({
        title: `Claim ${status}`,
        description:
          status === "approved"
            ? "Claim approved and business automatically verified!"
            : `Claim request has been ${status}.`,
        variant: status === "approved" ? "success" : "default",
      });
    } catch (error) {
      console.error("Error updating claim:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update claim request. Please try again.",
        variant: "error",
      });
    }
  };

  const createBusiness = async (formData) => {
    setCreatingBusiness(true);
    try {
      const supabase = getSupabase();

      const businessData = {
        owner_user_id: formData.owner_user_id ?? null,
        claimed: formData.claimed ?? false,
        status: BUSINESS_STATUS.ACTIVE,
        ...createVerifiedBusinessUpdates(),
        ...formData,
      };

      const { data, error } = await supabase
        .from("businesses")
        .insert(businessData)
        .select("*")
        .single();

      if (error) throw error;

      setBusinesses((prev) => [data, ...prev]);
      setShowCreateForm(false);

      toast({
        title: "Business Created & Verified",
        description: "The listing was created and automatically verified.",
        variant: "success",
      });
    } catch (error) {
      console.error("Error creating business:", error);
      toast({
        title: "Create Failed",
        description: "Unable to create the listing.",
        variant: "error",
      });
    } finally {
      setCreatingBusiness(false);
    }
  };

  const exportCSV = () => {
    const fields = [
      "name",
      "business_handle",
      "industry",
      "country",
      "city",
      "status",
      "subscription_tier",
      "verified",
      "claimed",
      "contact_email",
      "website",
    ];
    const header = fields.join(",");
    const rows = businesses.map((b) =>
      fields
        .map((f) => `"${(b[f] ?? "").toString().replace(/"/g, '""')}"`)
        .join(",")
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pacific_market_registry.csv";
    a.click();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f9fc]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#0d4f4f] border-t-transparent" />
      </div>
    );
  }

  if (!user || !checkIsAdmin(user)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f9fc] px-4">
        <div className="max-w-sm rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
          <AlertTriangle className="mx-auto mb-4 h-10 w-10 text-red-400" />
          <h2 className="mb-2 text-xl font-bold text-[#0a1628]">Access Denied</h2>
          <p className="mb-6 text-sm text-gray-500">
            Admin access required to view this page.
          </p>
          <Link
            href={createPageUrl("BusinessLogin")}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0a1628] px-6 py-3 text-sm font-semibold text-white hover:bg-[#122040]"
          >
            Sign In <ChevronRight className="h-4 w-4" />
          </Link>
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
          business.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
    if (filters.verified !== "") {
      const isVerified = filters.verified === "true";
      data = data.filter((business) => business.verified === isVerified);
    }

    return data;
  };

  const filteredData = getFilteredData();

  const pendingCount = businesses.filter((b) => b.status === BUSINESS_STATUS.PENDING).length;
  const pendingClaimsCount = claims.filter((c) => c.status === "pending").length;

  const executiveStats = [
    {
      label: "Total Businesses",
      value: businesses.length,
      color: "text-blue-600",
    },
    {
      label: "Verified",
      value: businesses.filter((b) => b.verified).length,
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

  const activeClaims = claims.filter((c) => c.status === "pending");
  const activeInsights = businesses.filter((b) => b.founder_snapshot_completed);

  const activeFilterCount = Object.values(filters).filter((v) => v !== "").length;

  return (
    <PortalShell>
      <HeroRegistry
        badge="Admin Dashboard"
        title="Pacific Market Registry"
        subtitle="Administrative control center for business listings and insights"
        description=""
        showStats={true}
        stats={executiveStats}
        actions={null}
      />

      <div className="min-h-screen bg-[#f8f9fc]">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          {/* Action Row */}
          <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="w-full lg:max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search businesses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="min-h-[44px] w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm focus:border-[#0d4f4f] focus:bg-white focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={
                      showFilters
                        ? `${mobileButtonCls} bg-[#0d4f4f] text-white hover:bg-[#1a6b6b]`
                        : filterButtonCls
                    }
                  >
                    <Filter className="h-4 w-4" />
                    Filters
                    {activeFilterCount > 0 && (
                      <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[11px]">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setShowCreateForm(true)}
                    className={primaryButtonCls}
                  >
                    <Plus className="h-4 w-4" />
                    Create Listing
                  </button>
                </div>
              </div>

              {showFilters && (
                <div className="border-t border-gray-200 pt-4">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                    <select
                      value={filters.country}
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, country: e.target.value }))
                      }
                      className="min-h-[44px] rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-[#0d4f4f] focus:outline-none"
                    >
                      <option value="">All Countries</option>
                      {COUNTRIES.map((country) => (
                        <option key={`country-${country.value}`} value={country.value}>
                          {country.label}
                        </option>
                      ))}
                    </select>

                    <select
                      value={filters.industry}
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, industry: e.target.value }))
                      }
                      className="min-h-[44px] rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-[#0d4f4f] focus:outline-none"
                    >
                      <option value="">All Industries</option>
                      {INDUSTRIES.map((industry) => (
                        <option key={`industry-${industry.value}`} value={industry.value}>
                          {industry.label}
                        </option>
                      ))}
                    </select>

                    <select
                      value={filters.tier}
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, tier: e.target.value }))
                      }
                      className="min-h-[44px] rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-[#0d4f4f] focus:outline-none"
                    >
                      <option value="">All Tiers</option>
                      <option value="vaka">Vaka</option>
                      <option value="mana">Mana</option>
                      <option value="moana">Moana</option>
                    </select>

                    <select
                      value={filters.verified}
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, verified: e.target.value }))
                      }
                      className="min-h-[44px] rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-[#0d4f4f] focus:outline-none"
                    >
                      <option value="">All Verification</option>
                      <option value="true">Verified</option>
                      <option value="false">Not Verified</option>
                    </select>
                  </div>

                  <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:justify-end">
                    <button
                      onClick={() =>
                        setFilters({
                          country: "",
                          industry: "",
                          tier: "",
                          verified: "",
                        })
                      }
                      className={secondaryButtonCls}
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            {/* Tabs */}
            <div className="border-b border-gray-200 p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="overflow-x-auto">
                  <div className="flex min-w-max gap-1 rounded-xl bg-gray-50 p-1">
                    {TABS.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`inline-flex min-h-[44px] items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                          activeTab === tab.id
                            ? "bg-white text-[#0a1628] shadow-sm"
                            : "text-gray-600 hover:text-[#0a1628]"
                        }`}
                      >
                        <tab.icon
                          className={`h-4 w-4 ${activeTab === tab.id ? "text-[#0d4f4f]" : ""}`}
                        />
                        {tab.label}
                        {tab.id === "pending" && pendingCount > 0 && (
                          <span className="rounded-full bg-yellow-500 px-1.5 py-0.5 text-[11px] text-white">
                            {pendingCount}
                          </span>
                        )}
                        {tab.id === "claims" && pendingClaimsCount > 0 && (
                          <span className="rounded-full bg-blue-500 px-1.5 py-0.5 text-[11px] text-white">
                            {pendingClaimsCount}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={exportCSV} className={secondaryButtonCls}>
                  <Download className="h-4 w-4" />
                  Export CSV
                </button>
              </div>
            </div>

            <div className="p-4">
              {/* Claims */}
              {activeTab === "claims" && (
                <div className="space-y-3">
                  {activeClaims.length === 0 ? (
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-12 text-center">
                      <Shield className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                      <p className="text-sm text-gray-500">No pending claim requests.</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3 lg:hidden">
                        {activeClaims.map((claim) => {
                          const business = businesses.find((b) => b.id === claim.business_id);
                          return (
                            <ClaimMobileCard
                              key={claim.id}
                              claim={claim}
                              business={business}
                              onApprove={() => updateClaim(claim, "approved")}
                              onDeny={() => updateClaim(claim, "denied")}
                            />
                          );
                        })}
                      </div>

                      <div className="hidden lg:block space-y-3">
                        {activeClaims.map((claim) => {
                          const business = businesses.find((b) => b.id === claim.business_id);
                          return (
                            <div
                              key={claim.id}
                              className="rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
                            >
                              <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#0a1628] to-[#0d4f4f]">
                                  <span className="text-sm font-bold text-white">
                                    {business?.name?.[0] || "?"}
                                  </span>
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="mb-1 flex flex-wrap items-center gap-2">
                                    <span className="font-semibold text-[#0a1628]">
                                      {business?.name || "Unknown Business"}
                                    </span>
                                    <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${getBadgeStyles("info")}`}>
                                      Claim Request
                                    </span>
                                    {business && (
                                      <span className={`rounded-full border px-2 py-0.5 text-xs ${getBadgeStyles("neutral")}`}>
                                        {business.subscription_tier}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-500">
                                    {business?.country || "Unknown"} · {business?.industry || "Unknown"} · {claim.user_email}
                                  </p>
                                  <p className="mt-1 text-xs text-gray-400">
                                    Requested {new Date(claim.created_date).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="flex flex-shrink-0 items-center gap-2">
                                  <button
                                    onClick={() => updateClaim(claim, "approved")}
                                    className={`inline-flex items-center gap-1 rounded-xl border px-3 py-1.5 text-xs font-semibold ${getBadgeStyles("success")}`}
                                  >
                                    <CheckCircle className="h-3 w-3" /> Approve
                                  </button>
                                  <button
                                    onClick={() => updateClaim(claim, "denied")}
                                    className={`inline-flex items-center gap-1 rounded-xl border px-3 py-1.5 text-xs font-semibold ${getBadgeStyles("danger")}`}
                                  >
                                    <XCircle className="h-3 w-3" /> Deny
                                  </button>
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

              {/* Insights */}
              {activeTab === "insights" && (
                <div className="space-y-4">
                  {activeInsights.length === 0 ? (
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-12 text-center">
                      <Users className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                      <p className="text-sm text-gray-500">No founder insights submitted yet.</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3 lg:hidden">
                        {activeInsights.map((business) => (
                          <InsightMobileCard
                            key={business.id}
                            business={business}
                            snapshot={getLatestSnapshot(business.id)}
                            onView={() => setSelectedInsightBusiness(business)}
                          />
                        ))}
                      </div>

                      <div className="hidden lg:block space-y-4">
                        {activeInsights.map((business) => (
                          <div
                            key={business.id}
                            className="rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="mb-2 flex items-center gap-2">
                                  <h4 className="font-semibold text-[#0a1628]">{business.name}</h4>
                                  <span className={`rounded-full border px-2 py-1 text-xs ${getBadgeStyles("neutral")}`}>
                                    {business.subscription_tier}
                                  </span>
                                  {business.verified && (
                                    <span className={`rounded-full border px-2 py-1 text-xs font-medium ${getBadgeStyles("premium")}`}>
                                      Verified
                                    </span>
                                  )}
                                </div>

                                <div className="mb-3 flex flex-wrap items-center gap-4 text-xs text-gray-600">
                                  <span>
                                    {business.country} • {business.industry || "No industry"}
                                  </span>
                                  {business.founder_snapshot_completed_at && (
                                    <span>
                                      Submitted {new Date(business.founder_snapshot_completed_at).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>

                                {getLatestSnapshot(business.id) && (
                                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                                    <span>Year: {getLatestSnapshot(business.id).year_started}</span>
                                    <span>Team: {getLatestSnapshot(business.id).team_size_band}</span>
                                    <span>Stage: {getLatestSnapshot(business.id).business_stage}</span>
                                  </div>
                                )}
                              </div>

                              <button
                                onClick={() => setSelectedInsightBusiness(business)}
                                className="flex items-center gap-1 text-xs font-medium text-[#0d4f4f] hover:text-[#0a1628]"
                              >
                                View Details <ChevronRight className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Business Tabs */}
              {activeTab !== "claims" && activeTab !== "insights" && (
                <div className="space-y-3">
                  {filteredData.length === 0 ? (
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-12 text-center">
                      <Building2 className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                      <p className="text-sm text-gray-500">No {activeTab} businesses found.</p>
                    </div>
                  ) : (
                    <>
                      {/* Mobile cards */}
                      <div className="space-y-3 lg:hidden">
                        {filteredData.map((business) => (
                          <AdminBusinessMobileCard
                            key={business.id}
                            business={business}
                            onApprove={() => updateStatus(business, BUSINESS_STATUS.ACTIVE)}
                            onReject={() => updateStatus(business, BUSINESS_STATUS.REJECTED)}
                            onEdit={() => {
                              setEditingBusiness(business);
                              setCurrentEditStep(1);
                            }}
                            onDelete={() => deleteBusiness(business.id)}
                          />
                        ))}
                      </div>

                      {/* Desktop table */}
                      <div className="hidden lg:block overflow-hidden rounded-xl border border-gray-200 bg-white">
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
                              <tr key={b.id} className="hover:bg-gray-50">
                                <td className="px-4 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#0a1628] to-[#0d4f4f]">
                                      <span className="text-xs font-bold text-white">
                                        {b.name?.[0]}
                                      </span>
                                    </div>
                                    <div>
                                      <div className="font-medium text-[#0a1628]">{b.name}</div>
                                      <div className="text-xs text-gray-500">
                                        {b.contact_email || "No email"}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-4">
                                  <div className="text-sm text-gray-600">
                                    {b.country} · {b.industry || "No industry"}
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    Submitted{" "}
                                    {b.created_date
                                      ? new Date(b.created_date).toLocaleDateString()
                                      : "—"}
                                  </div>
                                </td>
                                <td className="px-4 py-4">
                                  <div className="flex items-center gap-2">
                                    <span className={`rounded-full border px-2 py-1 text-xs font-medium ${getBadgeStyles(b.verified ? "premium" : "neutral")}`}>
                                      {b.subscription_tier}
                                    </span>
                                    {b.verified && (
                                      <span className={`rounded-full border px-2 py-1 text-xs font-medium ${getBadgeStyles("success")}`}>
                                        Verified
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-4 py-4">
                                  <div className="flex items-center justify-end gap-2">
                                    {b.status === BUSINESS_STATUS.PENDING && (
                                      <>
                                        <button
                                          onClick={() => updateStatus(b, BUSINESS_STATUS.ACTIVE)}
                                          className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs transition-all ${getBadgeStyles("success")}`}
                                        >
                                          <CheckCircle className="h-3 w-3" />
                                        </button>
                                        <button
                                          onClick={() => updateStatus(b, BUSINESS_STATUS.REJECTED)}
                                          className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs transition-all ${getBadgeStyles("danger")}`}
                                        >
                                          <XCircle className="h-3 w-3" />
                                        </button>
                                      </>
                                    )}

                                    <button
                                      onClick={() => {
                                        setEditingBusiness(b);
                                        setCurrentEditStep(1);
                                      }}
                                      className="rounded-lg border border-gray-200 p-1.5 transition-colors hover:border-[#0d4f4f] hover:text-[#0d4f4f]"
                                      title="Edit"
                                    >
                                      <Edit className="h-3 w-3" />
                                    </button>

                                    <Link
                                      href={createPageUrl("BusinessProfile") + `?handle=${b.business_handle || b.id}`}
                                      className="rounded-lg p-1.5 transition-colors hover:bg-[#0d4f4f]/5"
                                      title="View"
                                    >
                                      <Eye className="h-3.5 w-3.5" />
                                    </Link>

                                    <button
                                      onClick={() => deleteBusiness(b.id)}
                                      className="rounded-lg border border-red-200 p-1.5 text-red-500 transition-colors hover:bg-red-50"
                                      title="Delete"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
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

          {/* Edit Modal */}
          {editingBusiness && (
            <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
              <div
                className="absolute inset-0 bg-black/50"
                onClick={() => setEditingBusiness(null)}
              />
              <div className="relative w-full rounded-t-3xl bg-white shadow-2xl sm:max-w-3xl sm:rounded-2xl max-h-[92vh] overflow-y-auto">
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-4 py-4 sm:px-6">
                  <div>
                    <h3 className="font-bold text-[#0a1628]">
                      Edit: {editingBusiness.name}
                    </h3>
                    <p className="mt-1 text-xs text-gray-500">
                      Step {currentEditStep}
                    </p>
                  </div>
                  <button
                    onClick={() => setEditingBusiness(null)}
                    className="rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="p-4 sm:p-6">
                  <DetailedBusinessForm
                    onSubmit={saveBusiness}
                    isLoading={savingEdit}
                    initialData={editingBusiness}
                    onStepChange={handleEditStepChange}
                    mode={FORM_MODES.ADMIN_EDIT}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Create Modal */}
          {showCreateForm && (
            <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
              <div
                className="absolute inset-0 bg-black/50"
                onClick={() => setShowCreateForm(false)}
              />
              <div className="relative w-full rounded-t-3xl bg-white shadow-2xl sm:max-w-3xl sm:rounded-2xl max-h-[92vh] overflow-y-auto">
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-4 py-4 sm:px-6">
                  <h3 className="font-bold text-[#0a1628]">Create Business Listing</h3>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="p-4 sm:p-6">
                  <DetailedBusinessForm
                    onSubmit={createBusiness}
                    isLoading={creatingBusiness}
                    onStepChange={() => {}}
                    mode={FORM_MODES.ADMIN_CREATE}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Insight Detail Modal */}
          {selectedInsightBusiness && (
            <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
              <div
                className="absolute inset-0 bg-black/50"
                onClick={() => setSelectedInsightBusiness(null)}
              />
              <div className="relative w-full rounded-t-3xl bg-white shadow-2xl sm:max-w-4xl sm:rounded-2xl max-h-[92vh] overflow-y-auto">
                <div className="sticky top-0 z-10 border-b border-gray-200 bg-white p-4 sm:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-bold text-[#0a1628] sm:text-xl">
                        Founder Insights Details
                      </h2>
                      <p className="mt-1 text-sm text-gray-600">
                        {selectedInsightBusiness.name}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedInsightBusiness(null)}
                      className="rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  <FounderInsightsSummary
                    snapshot={getLatestSnapshot(selectedInsightBusiness.id)}
                    business={selectedInsightBusiness}
                    onEdit={() => {}}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PortalShell>
  );
}