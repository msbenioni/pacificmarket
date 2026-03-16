"use client";

import { Fragment, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { getAdminBusinesses } from "@/lib/supabase/queries/businesses";
import toast from "react-hot-toast";
import {
  ChevronRight,
  ChevronUp,
  Search,
  Filter,
  Download,
  X,
  Plus,
  Building2,
  CheckCircle,
  Clock,
  Shield,
  XCircle,
  AlertTriangle,
} from "lucide-react";

import PortalShell from "@/components/portal/PortalShell";
import HeroStandard from "../components/shared/HeroStandard";
import BusinessProfileForm from "@/components/forms/BusinessProfileForm";
import { BUSINESS_STATUS } from "@/constants/unifiedConstants";
import {
  COUNTRIES,
  INDUSTRIES,
  getCountryDisplayName,
  getIndustryDisplayName,
  getTierDisplayName,
} from "@/constants/unifiedConstants";
import { getLogoUrl } from '@/utils/bannerUtils';

const TABS = [
  { id: "active", label: "Active", icon: CheckCircle, color: "text-green-600", status: BUSINESS_STATUS.ACTIVE },
  { id: "pending", label: "Pending", icon: Clock, color: "text-yellow-600", status: BUSINESS_STATUS.PENDING },
  { id: "claims", label: "Claims", icon: Shield, color: "text-blue-600" },
];

const buttonCls = "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all";
const primaryButtonCls = `${buttonCls} bg-[#0a1628] text-white hover:bg-[#122040]`;
const secondaryButtonCls = `${buttonCls} border border-gray-200 bg-white text-[#0a1628] hover:bg-gray-50`;
const mobileButtonCls = `${buttonCls} border border-gray-200 bg-white text-[#0a1628] hover:bg-gray-50`;
const filterButtonCls = `${buttonCls} border border-gray-200 bg-white text-[#0a1628] hover:bg-gray-50`;

/** @type {Record<string, any>} */
const emptyBusinessForm = {
  name: "",
  business_handle: "",
  description: "",
  tagline: "",
  contact_name: "",
  contact_email: "",
  contact_phone: "",
  contact_website: "",
  business_hours: "",
  country: "",
  city: "",
  suburb: "",
  address: "",
  state_region: "",
  postal_code: "",
  industry: "",
  year_started: null,
  business_structure: "",
  subscription_tier: "vaka",
  status: BUSINESS_STATUS.PENDING,
  team_size_band: "",
  cultural_identity: "",
  languages_spoken: [],
  is_verified: false,
  claimed: false,
  homepage_featured: false,
  logo_url: "",
  banner_url: "",
  mobile_banner_url: "",
  logo_file: null,
  banner_file: null,
  mobile_banner_file: null,
};

function sanitizeBusinessPayload(formData) {
  const {
    id,
    created_date,
    updated_at,
    verification_source,
    logo_file,
    banner_file,
    mobile_banner_file,
    ...updateData
  } = formData;

  /** @type {Record<string, any>} */
  const safeUpdateData = Object.entries(updateData).reduce((acc, [key, value]) => {
    if (value === undefined) return acc;

    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed === "") return acc;
      acc[key] = trimmed;
      return acc;
    }

    if (value === null) return acc;

    acc[key] = value;
    return acc;
  }, /** @type {Record<string, any>} */ ({}));

  return { id, safeUpdateData };
}

function getBadgeStyles(type) {
  const styles = {
    success: "border-green-200 bg-green-50 text-green-700",
    danger: "border-red-200 bg-red-50 text-red-700",
    warning: "border-yellow-200 bg-yellow-50 text-yellow-700",
    info: "border-blue-200 bg-blue-50 text-blue-700",
    neutral: "border-gray-200 bg-gray-50 text-gray-700",
    premium: "border-purple-200 bg-purple-50 text-purple-700",
  };
  return styles[type] || styles.neutral;
}

async function checkIsAdmin(user) {
  if (!user) return false;

  try {
    const { getSupabase } = await import("@/lib/supabase/client");
    const supabase = getSupabase();

    const { data, error } = await supabase.from("profiles").select("role").eq("id", user.id).single();

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

function ClaimMobileCard({ claim, business, onApprove, onDeny }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return { text: "Approved", style: getBadgeStyles("success") };
      case "rejected":
        return { text: "Rejected", style: getBadgeStyles("danger") };
      case "pending":
        return { text: "Pending", style: getBadgeStyles("warning") };
      default:
        return { text: status || "Unknown", style: getBadgeStyles("neutral") };
    }
  };

  const statusBadge = getStatusBadge(claim.status);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-[#0a1628] to-[#0d4f4f]">
          <img
            src={getLogoUrl(business)}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="break-words text-sm font-semibold text-[#0a1628]">
              {business?.name || "Unknown Business"}
            </h3>
            <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${statusBadge.style}`}>
              {statusBadge.text}
            </span>
          </div>

          <p className="mt-1 text-xs text-gray-500">
            {business?.country || "Unknown"} · {business?.industry || "Unknown"}
          </p>
          <p className="mt-1 break-all text-xs text-gray-500">{claim.user_email}</p>
          <p className="mt-1 text-xs text-gray-400">
            Requested{" "}
            {claim.created_at || claim.created_date
              ? new Date(claim.created_at || claim.created_date).toLocaleDateString()
              : "—"}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {claim.status === "pending" && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}

function AdminBusinessMobileCard({
  business,
  isEditing,
  draftBusiness,
  setDraftBusiness,
  onApprove,
  onReject,
  onEdit,
  onDelete,
  onSave,
  onCancel,
  savingEdit,
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-[#0a1628] to-[#0d4f4f]">
          <img
            src={getLogoUrl(business)}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="break-words text-sm font-semibold text-[#0a1628]">{business.name}</h3>
            <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${getBadgeStyles("neutral")}`}>
              {getTierDisplayName(business.subscription_tier) || business.subscription_tier || "vaka"}
            </span>
            {business.is_verified && (
              <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${getBadgeStyles("success")}`}>
                Verified
              </span>
            )}
          </div>

          <p className="mt-1 text-xs text-gray-500">
            {getCountryDisplayName(business.country)} · {getIndustryDisplayName(business.industry) || "No industry"}
          </p>
          <p className="mt-1 break-all text-xs text-gray-500">{business.contact_email || "No email"}</p>
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
              Deny
            </button>
          </>
        )}

        <button
          onClick={onEdit}
          className={`inline-flex min-h-[40px] items-center gap-1 rounded-lg border px-3 py-2 text-xs font-semibold ${secondaryButtonCls}`}
        >
          {isEditing ? "Close" : "Edit"}
        </button>

        <button
          onClick={onDelete}
          className={`inline-flex min-h-[40px] items-center gap-1 rounded-lg border px-3 py-2 text-xs font-semibold ${getBadgeStyles("danger")}`}
        >
          Delete
        </button>
      </div>

      {isEditing && draftBusiness && (
        <div className="mt-4 border-t border-gray-200 pt-4">
          <BusinessProfileForm
            title={`Edit ${business.name}`}
            businessId={business.id}
            initialData={draftBusiness}
            onSave={onSave}
            onCancel={onCancel}
            saving={savingEdit}
            mode="edit"
            showAdminFields={true}
          />
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
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
  const [createForm, setCreateForm] = useState({ ...emptyBusinessForm });
  const [savingCreate, setSavingCreate] = useState(false);

  const [editingBusinessId, setEditingBusinessId] = useState(null);
  const [draftBusiness, setDraftBusiness] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const [filters, setFilters] = useState({
    country: "",
    industry: "",
    tier: "",
    is_verified: "",
    claimStatus: "",
  });

  const loadAdminData = useCallback(async () => {
    if (!user) return;

    setDashboardLoading(true);

    try {
      const { getSupabase } = await import("@/lib/supabase/client");
      const supabase = getSupabase();

      const [businessesRes, claimsRes] = await Promise.all([
        getAdminBusinesses({ limit: 500, status: ["active", "pending", "rejected"] }),
        supabase
          .from("claim_requests")
          .select(`
            id, business_id, user_id, status, contact_email, contact_phone,
            role, proof_url, created_at, claim_type, message,
            reviewed_by, reviewed_at
          `)
          .order("created_at", { ascending: false })
          .limit(100),
      ]);

      if (businessesRes.error) throw new Error(`Businesses query failed: ${businessesRes.error.message}`);
      if (claimsRes.error) throw new Error(`Claims query failed: ${claimsRes.error.message}`);

      setBusinesses(businessesRes.data || []);
      setClaims(claimsRes.data || []);
    } catch (error) {
      console.error("Error loading admin data:", error);
      toast.error(`Failed to load data: ${error.message || "Unknown error"}`);
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
      languages_spoken: Array.isArray(business.languages_spoken) ? business.languages_spoken : [],
    });
  };

  const cancelEditingBusiness = () => {
    setEditingBusinessId(null);
    setDraftBusiness(null);
  };

  const resetCreateForm = () => {
    setShowCreateForm(false);
    setCreateForm({ ...emptyBusinessForm });
  };

  const updateStatus = async (business, newStatus) => {
    try {
      const { getSupabase } = await import("@/lib/supabase/client");
      const supabase = getSupabase();

      const { error } = await supabase
        .from("businesses")
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", business.id);

      if (error) throw error;

      setBusinesses((prev) => prev.map((b) => (b.id === business.id ? { ...b, status: newStatus } : b)));
      toast.success(`Business status changed to ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Unable to update business status.");
    }
  };

  const updateClaim = async (claim, newStatus) => {
    try {
      const { getSupabase } = await import("@/lib/supabase/client");
      const supabase = getSupabase();

      const { error } = await supabase
        .from("claim_requests")
        .update({
          status: newStatus,
          reviewed_at: new Date().toISOString(),
          reviewed_by: user?.id,
        })
        .eq("id", claim.id);

      if (error) throw error;

      setClaims((prev) => prev.map((c) => (c.id === claim.id ? { ...c, status: newStatus } : c)));

      if (newStatus === "approved") {
        const matchedBusiness = businesses.find((b) => b.id === claim.business_id);
        if (matchedBusiness) {
          await updateStatus(matchedBusiness, BUSINESS_STATUS.ACTIVE);
        }
      }

      toast.success(`Claim status changed to ${newStatus}`);
    } catch (error) {
      console.error("Error updating claim:", error);
      toast.error("Unable to update claim status.");
    }
  };

  const deleteBusiness = async (businessId) => {
    if (!confirm("Are you sure you want to delete this business? This action cannot be undone.")) {
      return;
    }

    try {
      const { getSupabase } = await import("@/lib/supabase/client");
      const supabase = getSupabase();

      const { error } = await supabase.from("businesses").delete().eq("id", businessId);

      if (error) throw error;

      setBusinesses((prev) => prev.filter((b) => b.id !== businessId));

      if (editingBusinessId === businessId) {
        cancelEditingBusiness();
      }

      toast.success("The business has been permanently deleted.");
    } catch (error) {
      console.error("Error deleting business:", error);
      toast.error("Unable to delete the business.");
    }
  };

  const saveBusiness = async (formData) => {
    setSavingEdit(true);

    try {
      const { getSupabase } = await import("@/lib/supabase/client");
      const supabase = getSupabase();

      const { id, safeUpdateData } = sanitizeBusinessPayload(formData);

      if (!id) {
        throw new Error("Missing business id for update.");
      }

      /** @type {Record<string, any>} */
      let updatedData = { ...safeUpdateData };

      if (formData.logo_file) {
        try {
          const file = formData.logo_file;
          const filePath = `logos/${id}-${Date.now()}-${file.name}`;

          const { error: uploadError } = await supabase.storage
            .from("admin-listings")
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data: logoPublicUrlData } = supabase.storage
            .from("admin-listings")
            .getPublicUrl(filePath);

          if (logoPublicUrlData?.publicUrl) {
            updatedData.logo_url = logoPublicUrlData.publicUrl;
          }
        } catch (uploadError) {
          console.error("Error uploading logo:", uploadError);
          toast.error("Failed to upload logo. Using existing logo URL.");
        }
      }

      if (formData.banner_file) {
        try {
          const file = formData.banner_file;
          const filePath = `banners/${id}-${Date.now()}-${file.name}`;

          const { error: uploadError } = await supabase.storage
            .from("admin-listings")
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data: bannerPublicUrlData } = supabase.storage
            .from("admin-listings")
            .getPublicUrl(filePath);

          if (bannerPublicUrlData?.publicUrl) {
            updatedData.banner_url = bannerPublicUrlData.publicUrl;
          }
        } catch (uploadError) {
          console.error("Error uploading banner:", uploadError);
          toast.error("Failed to upload banner. Using existing banner URL.");
        }
      }

      const payload = {
        ...updatedData,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("businesses").update(payload).eq("id", id);

      if (error) throw error;

      setBusinesses((prev) => prev.map((b) => (b.id === id ? { ...b, ...payload } : b)));
      cancelEditingBusiness();

      toast.success("The business has been successfully updated.");
    } catch (error) {
      // Enhanced error logging for debugging
      const errorDetails = {
        message: error?.message || error?.toString() || 'Unknown error',
        details: error?.details || null,
        stack: error?.stack || null,
        formData: formData ? {
          id: formData.id,
          name: formData.name,
          hasLogoFile: !!formData.logo_file,
          hasBannerFile: !!formData.banner_file,
          updateKeys: Object.keys(formData).filter(key => !['id', 'logo_file', 'banner_file'].includes(key))
        } : 'No formData',
        timestamp: new Date().toISOString()
      };
      
      console.error("Error updating business:", errorDetails);
      toast.error(errorDetails.message || "Unable to update the business.");
    } finally {
      setSavingEdit(false);
    }
  };

  const createVerifiedBusiness = async (formData) => {
    setSavingCreate(true);

    try {
      const { getSupabase } = await import("@/lib/supabase/client");
      const supabase = getSupabase();

      const { safeUpdateData } = sanitizeBusinessPayload(formData);

      /** @type {Record<string, any>} */
      let businessData = {
        ...safeUpdateData,
        status: formData.status || BUSINESS_STATUS.ACTIVE,
        is_verified: formData.is_verified ?? true,
        is_claimed: formData.is_claimed ?? false,
        created_date: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (formData.logo_file) {
        try {
          const file = formData.logo_file;
          const filePath = `logos/new-${Date.now()}-${file.name}`;

          const { error: uploadError } = await supabase.storage
            .from("admin-listings")
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data: logoPublicUrlData } = supabase.storage
            .from("admin-listings")
            .getPublicUrl(filePath);

          if (logoPublicUrlData?.publicUrl) {
            businessData.logo_url = logoPublicUrlData.publicUrl;
          }
        } catch (uploadError) {
          console.error("Error uploading logo:", uploadError);
          toast.error("Failed to upload logo.");
        }
      }

      if (formData.banner_file) {
        try {
          const file = formData.banner_file;
          const filePath = `banners/new-${Date.now()}-${file.name}`;

          const { error: uploadError } = await supabase.storage
            .from("admin-listings")
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data: bannerPublicUrlData } = supabase.storage
            .from("admin-listings")
            .getPublicUrl(filePath);

          if (bannerPublicUrlData?.publicUrl) {
            businessData.banner_url = bannerPublicUrlData.publicUrl;
          }
        } catch (uploadError) {
          console.error("Error uploading banner:", uploadError);
          toast.error("Failed to upload banner.");
        }
      }

      const { data, error } = await supabase
        .from("businesses")
        .insert(businessData)
        .select(`
          id, name, business_handle, description, industry, country, city,
          status, visibility_tier, is_verified, claimed, contact_email, contact_website,
          logo_url, banner_url, owner_user_id, created_date, updated_at, subscription_tier
        `)
        .single();

      if (error) throw error;

      setBusinesses((prev) => [data, ...prev]);
      resetCreateForm();

      toast.success("The listing was created and automatically is_verified.");
    } catch (error) {
      console.error("Error creating business:", error);
      toast.error(error?.message || "Unable to create the listing.");
    } finally {
      setSavingCreate(false);
    }
  };

  const exportCSV = () => {
    const fields = [
      "name",
      "business_handle",
      "description",
      "industry",
      "country",
      "city",
      "status",
      "subscription_tier",
      "is_verified",
      "claimed",
      "contact_email",
      "contact_website",
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
            {authLoading ? "Restoring Session" : checkingAdmin ? "Checking Access" : "Loading Dashboard"}
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
          <h2 className="mb-2 text-xl font-bold text-[#0a1628]">Authentication Required</h2>
          <p className="mb-6 text-sm text-gray-500">Please sign in to access this page.</p>
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
  const filtered = statusTab ? businesses.filter((b) => b.status === statusTab.status) : [];

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
    if (filters.is_verified !== "") {
      const isVerified = filters.is_verified === "true";
      data = data.filter((business) => business.is_verified === isVerified);
    }

    return data;
  };

  const getFilteredClaims = () => {
    let filteredClaims = claims;

    if (filters.claimStatus) {
      filteredClaims = filteredClaims.filter((claim) => claim.status === filters.claimStatus);
    }

    if (searchQuery) {
      filteredClaims = filteredClaims.filter((claim) => {
        const business = businesses.find((b) => b.id === claim.business_id);
        return (
          claim.user_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          claim.business_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          business?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          business?.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    return filteredClaims;
  };

  const filteredData = getFilteredData();
  const filteredClaimsData = getFilteredClaims();

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
                      className="min-h-[44px] w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm transition-colors focus:border-[#0d4f4f] focus:bg-white focus:outline-none"
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
                      <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[11px]">{activeFilterCount}</span>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setShowCreateForm((prev) => !prev);
                      cancelEditingBusiness();
                    }}
                    className={primaryButtonCls}
                  >
                    <Plus className="h-4 w-4" />
                    {showCreateForm ? "Close Create" : "Create Listing"}
                  </button>
                </div>
              </div>

              {showFilters && (
                <div className="border-t border-gray-200 pt-4">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
                    <select
                      value={filters.country}
                      onChange={(e) => setFilters((prev) => ({ ...prev, country: e.target.value }))}
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
                      onChange={(e) => setFilters((prev) => ({ ...prev, industry: e.target.value }))}
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
                      onChange={(e) => setFilters((prev) => ({ ...prev, tier: e.target.value }))}
                      className="min-h-[44px] rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-[#0d4f4f] focus:outline-none"
                    >
                      <option value="">All Tiers</option>
                      <option value="vaka">Vaka</option>
                      <option value="mana">Mana</option>
                      <option value="moana">Moana</option>
                    </select>

                    <select
                      value={filters.is_verified}
                      onChange={(e) => setFilters((prev) => ({ ...prev, is_verified: e.target.value }))}
                      className="min-h-[44px] rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-[#0d4f4f] focus:outline-none"
                    >
                      <option value="">All Verification</option>
                      <option value="true">Verified</option>
                      <option value="false">Not Verified</option>
                    </select>

                    {activeTab === "claims" && (
                      <select
                        value={filters.claimStatus}
                        onChange={(e) => setFilters((prev) => ({ ...prev, claimStatus: e.target.value }))}
                        className="min-h-[44px] rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-[#0d4f4f] focus:outline-none"
                      >
                        <option value="">All Claim Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    )}
                  </div>

                  <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:justify-end">
                    <button
                      onClick={() =>
                        setFilters({
                          country: "",
                          industry: "",
                          tier: "",
                          is_verified: "",
                          claimStatus: "",
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

          {showCreateForm && (
            <div className="mb-6">
              <BusinessProfileForm
                title="Create New Business"
                businessId={null}
                initialData={createForm}
                onSave={() => createVerifiedBusiness(createForm)}
                onCancel={resetCreateForm}
                saving={savingCreate}
                mode="create"
                showAdminFields={true}
              />
            </div>
          )}

          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="overflow-x-auto">
                  <div className="flex min-w-max gap-1 rounded-xl bg-gray-50 p-1">
                    {TABS.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          cancelEditingBusiness();
                        }}
                        className={`inline-flex min-h-[44px] items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                          activeTab === tab.id
                            ? "bg-white text-[#0a1628] shadow-sm"
                            : "text-gray-600 hover:text-[#0a1628]"
                        }`}
                      >
                        <tab.icon className={`h-4 w-4 ${activeTab === tab.id ? "text-[#0d4f4f]" : ""}`} />
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
                          const business = businesses.find((b) => b.id === claim.business_id);
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
                          const business = businesses.find((b) => b.id === claim.business_id);
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
                                      {business?.name || "Unknown Business"}
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
                                        ? claim.status.charAt(0).toUpperCase() + claim.status.slice(1)
                                        : "Unknown"}
                                    </span>
                                    {business && (
                                      <span className={`rounded-full border px-2 py-1 text-xs ${getBadgeStyles("neutral")}`}>
                                        {getTierDisplayName(business.subscription_tier) ||
                                          business.subscription_tier ||
                                          "vaka"}
                                      </span>
                                    )}
                                  </div>

                                  <p className="text-xs text-gray-500">
                                    {business?.country || "Unknown"} · {business?.industry || "Unknown"} ·{" "}
                                    {claim.user_email}
                                  </p>
                                  <p className="mt-1 text-xs text-gray-400">
                                    Requested{" "}
                                    {claim.created_at || claim.created_date
                                      ? new Date(claim.created_at || claim.created_date).toLocaleDateString()
                                      : "—"}
                                  </p>
                                </div>

                                <div className="flex flex-shrink-0 items-center gap-2">
                                  {claim.status === "pending" && (
                                    <>
                                      <button
                                        onClick={() => updateClaim(claim, "approved")}
                                        className={`inline-flex items-center gap-1 rounded-xl border px-3 py-1.5 text-xs font-semibold ${getBadgeStyles("success")}`}
                                      >
                                        <CheckCircle className="h-3 w-3" /> Approve
                                      </button>
                                      <button
                                        onClick={() => updateClaim(claim, "rejected")}
                                        className={`inline-flex items-center gap-1 rounded-xl border px-3 py-1.5 text-xs font-semibold ${getBadgeStyles("danger")}`}
                                      >
                                        <XCircle className="h-3 w-3" /> Reject
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

              {activeTab !== "claims" && (
                <div className="space-y-3">
                  {filteredData.length === 0 ? (
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-12 text-center">
                      <Building2 className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                      <p className="text-sm text-gray-500">No {activeTab} businesses found.</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3 lg:hidden">
                        {filteredData.map((business) => (
                          <AdminBusinessMobileCard
                            key={business.id}
                            business={business}
                            isEditing={editingBusinessId === business.id}
                            draftBusiness={editingBusinessId === business.id ? draftBusiness : null}
                            setDraftBusiness={setDraftBusiness}
                            onApprove={() => updateStatus(business, BUSINESS_STATUS.ACTIVE)}
                            onReject={() => updateStatus(business, BUSINESS_STATUS.REJECTED)}
                            onEdit={() => {
                              if (editingBusinessId === business.id) {
                                cancelEditingBusiness();
                              } else {
                                startEditingBusiness(business);
                                setShowCreateForm(false);
                              }
                            }}
                            onDelete={() => deleteBusiness(business.id)}
                            onSave={() => saveBusiness(draftBusiness)}
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
                                        {b.logo_url ? (
                                          <img
                                            src={b.logo_url}
                                            alt=""
                                            className="h-full w-full object-cover"
                                            onError={(e) => {
                                              e.currentTarget.src = "/pm_logo.png";
                                            }}
                                          />
                                        ) : (
                                          <img
                                            src="/pm_logo.png"
                                            alt="Pacific Discovery Network"
                                            className="h-full w-full object-cover"
                                          />
                                        )}
                                      </div>

                                      <div>
                                        <div className="font-medium text-[#0a1628]">{b.name}</div>
                                        <div className="text-xs text-gray-500">{b.contact_email || "No email"}</div>
                                      </div>
                                    </div>
                                  </td>

                                  <td className="px-4 py-4">
                                    <div className="text-sm text-gray-600">
                                      {getCountryDisplayName(b.country)} ·{" "}
                                      {getIndustryDisplayName(b.industry) || "No industry"}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                      Submitted {b.created_date ? new Date(b.created_date).toLocaleDateString() : "—"}
                                    </div>
                                  </td>

                                  <td className="px-4 py-4">
                                    <div className="flex items-center gap-2">
                                      <span
                                        className={`rounded-full border px-2 py-1 text-xs font-medium ${getBadgeStyles(
                                          b.is_verified ? "premium" : "neutral"
                                        )}`}
                                      >
                                        {getTierDisplayName(b.subscription_tier) || b.subscription_tier || "vaka"}
                                      </span>
                                      {b.is_verified && (
                                        <span
                                          className={`rounded-full border px-2 py-1 text-xs font-medium ${getBadgeStyles("success")}`}
                                        >
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
                                            Approve
                                          </button>

                                          <button
                                            onClick={() => updateStatus(b, BUSINESS_STATUS.REJECTED)}
                                            className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs transition-all ${getBadgeStyles("danger")}`}
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
                                        className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs transition-all ${getBadgeStyles("danger")}`}
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
                                        title={`Edit ${b.name}`}
                                        businessId={b.id}
                                        initialData={draftBusiness}
                                        onSave={() => saveBusiness(draftBusiness)}
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
    </PortalShell>
  );
}