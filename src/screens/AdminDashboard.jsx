"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { getSupabase } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import {
  Building2,
  CheckCircle,
  Clock,
  XCircle,
  Users,
  Shield,
  Search,
  Filter,
  Download,
  Plus,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";

import PortalShell from "@/components/portal/PortalShell";
import HeroRegistry from "@/components/shared/HeroRegistry";
import { BUSINESS_STATUS } from "@/constants/unifiedConstants";
import { COUNTRIES, INDUSTRIES, getCountryDisplayName, getIndustryDisplayName, getTierDisplayName } from "@/constants/unifiedConstants";

function createPageUrl(page) {
  return `/${page}`;
}

const TABS = [
  { id: "active", label: "Active", icon: CheckCircle, color: "text-green-600", status: BUSINESS_STATUS.ACTIVE },
  { id: "pending", label: "Pending", icon: Clock, color: "text-yellow-600", status: BUSINESS_STATUS.PENDING },
  { id: "claims", label: "Claims", icon: Shield, color: "text-blue-600" },
  { id: "insights", label: "Insights", icon: Users, color: "text-purple-600" },
];

const buttonCls = "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all";
const primaryButtonCls = `${buttonCls} bg-[#0a1628] text-white hover:bg-[#122040]`;
const secondaryButtonCls = `${buttonCls} border border-gray-200 bg-white text-[#0a1628] hover:bg-gray-50`;
const mobileButtonCls = `${buttonCls} border border-gray-200 bg-white text-[#0a1628] hover:bg-gray-50`;
const filterButtonCls = `${buttonCls} border border-gray-200 bg-white text-[#0a1628] hover:bg-gray-50`;

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

function ClaimMobileCard({ claim, business, onApprove, onDeny }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return { text: 'Approved', style: getBadgeStyles("success") };
      case 'rejected':
        return { text: 'Rejected', style: getBadgeStyles("danger") };
      case 'pending':
        return { text: 'Pending', style: getBadgeStyles("warning") };
      default:
        return { text: status || 'Unknown', style: getBadgeStyles("neutral") };
    }
  };

  const statusBadge = getStatusBadge(claim.status);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-[#0a1628] to-[#0d4f4f]">
          {business?.logo_url ? (
            <img
              src={business.logo_url}
              alt=""
              className="h-full w-full object-cover"
              onError={(e) => {
                console.warn('Failed to load claim mobile logo:', business.logo_url);
                e.currentTarget.src = '/pm_logo.png';
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

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-[#0a1628] break-words">
              {business?.name || "Unknown Business"}
            </h3>
            <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${statusBadge.style}`}>
              {statusBadge.text}
            </span>
          </div>

          <p className="mt-1 text-xs text-gray-500">
            {business?.country || "Unknown"} · {business?.industry || "Unknown"}
          </p>
          <p className="mt-1 text-xs text-gray-500 break-all">{claim.user_email}</p>
          <p className="mt-1 text-xs text-gray-400">
            Requested {claim.created_at ? new Date(claim.created_at).toLocaleDateString() : "—"}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {claim.status === 'pending' && (
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

function AdminBusinessMobileCard({ business, onApprove, onReject, onEdit, onDelete }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-[#0a1628] to-[#0d4f4f]">
          {business.logo_url ? (
            <img
              src={business.logo_url}
              alt=""
              className="h-full w-full object-cover"
              onError={(e) => {
                console.warn('Failed to load admin business mobile logo:', business.logo_url);
                e.currentTarget.src = '/pm_logo.png';
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

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-[#0a1628] break-words">
              {business.name}
            </h3>
            <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${getBadgeStyles("neutral")}`}>
              {getTierDisplayName(business.visibility_tier) || business.visibility_tier || "vaka"}
            </span>
            {business.verified && (
              <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${getBadgeStyles("success")}`}>
                Verified
              </span>
            )}
          </div>

          <p className="mt-1 text-xs text-gray-500">
            {getCountryDisplayName(business.country)} · {getIndustryDisplayName(business.industry) || "No industry"}
          </p>
          <p className="mt-1 text-xs text-gray-500 break-all">
            {business.contact_email || "No email"}
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
              Deny
            </button>
          </>
        )}
        <button
          onClick={onEdit}
          className={`inline-flex min-h-[40px] items-center gap-1 rounded-lg border px-3 py-2 text-xs font-semibold ${secondaryButtonCls}`}
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className={`inline-flex min-h-[40px] items-center gap-1 rounded-lg border px-3 py-2 text-xs font-semibold ${getBadgeStyles("danger")}`}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

function InsightMobileCard({ business, snapshot, onView }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-[#0a1628] to-[#0d4f4f]">
          {business.logo_url ? (
            <img
              src={business.logo_url}
              alt=""
              className="h-full w-full object-cover"
              onError={(e) => {
                console.warn('Failed to load insight mobile logo:', business.logo_url);
                e.currentTarget.src = '/pm_logo.png';
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

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-[#0a1628] break-words">
              {business.name}
            </h3>
            <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${getBadgeStyles("neutral")}`}>
              {getTierDisplayName(business.visibility_tier) || business.visibility_tier || "vaka"}
            </span>
            {business.verified && (
              <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${getBadgeStyles("success")}`}>
                Verified
              </span>
            )}
          </div>

          <p className="mt-1 text-xs text-gray-500">
            {getCountryDisplayName(business.country)} · {getIndustryDisplayName(business.industry) || "No industry"}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Submitted {business.founder_snapshot_completed_at ? new Date(business.founder_snapshot_completed_at).toLocaleDateString() : "—"}
          </p>

          {snapshot && (
            <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
              <span>Year: {snapshot.year_started}</span>
              <span>Team: {snapshot.team_size_band}</span>
              <span>Stage: {snapshot.business_stage}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={onView}
          className={`inline-flex min-h-[40px] items-center gap-1 rounded-lg border px-3 py-2 text-xs font-semibold ${secondaryButtonCls}`}
        >
          View Details <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

async function checkIsAdmin(user) {
  if (!user) return false;
  
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    if (error || !data) {
      console.error('Error checking admin role:', error);
      return false;
    }
    
    return data.role === 'admin';
  } catch (error) {
    console.error('Error checking admin role:', error);
    return false;
  }
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [activeTab, setActiveTab] = useState("active");
  const [businesses, setBusinesses] = useState([]);
  const [claims, setClaims] = useState([]);
  const [insights, setInsights] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState(null);
  const [currentEditStep, setCurrentEditStep] = useState(1);
  const [savingEdit, setSavingEdit] = useState(false);
  const [selectedInsightBusiness, setSelectedInsightBusiness] = useState(null);

  const [filters, setFilters] = useState({
    country: "",
    industry: "",
    tier: "",
    verified: "",
    claimStatus: "",
  });

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        setCheckingAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const adminStatus = await checkIsAdmin(user);
        setIsAdmin(adminStatus);
        console.log('🔐 Admin status check:', {
          user: user?.email,
          isAdmin: adminStatus
        });
      } catch (error) {
        console.error('❌ Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setCheckingAdmin(false);
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  // Debug user authentication state
  useEffect(() => {
    console.log('🔐 Auth state:', {
      user: user?.email,
      userRole: user?.role,
      userRaw: user,
      isAdmin: isAdmin,
      loading: loading,
      checkingAdmin: checkingAdmin
    });
  }, [user, isAdmin, loading, checkingAdmin]);

  useEffect(() => {
    // Only load data if user is authenticated as admin
    if (user && isAdmin && !checkingAdmin) {
      console.log('✅ User is admin, loading data...');
      loadAdminData();
    } else if (user && !checkingAdmin) {
      console.log('⚠️ User is authenticated but not an admin');
      setLoading(false);
    } else if (!user && !checkingAdmin) {
      console.log('⚠️ User not authenticated');
      setLoading(false);
    }
  }, [user, isAdmin, checkingAdmin]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const supabase = getSupabase();
      
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }
      
      console.log('🔄 Loading admin data for user:', user?.email);
      
      // Use the correct column names from the actual database schema
      const [businessesRes, claimsRes] = await Promise.all([
        supabase
          .from("businesses")
          .select(`
            id, name, description, short_description, logo_url, contact_website,
            contact_email, contact_phone, address, country, industry, city, 
            status, visibility_tier, verified, claimed, business_handle, 
            owner_user_id, created_at, updated_at, created_date
          `)
          .order("created_at", { ascending: false })
          .limit(500),
        
        supabase
          .from("claim_requests")
          .select(`
            id, business_id, user_id, status, contact_email, contact_phone,
            verification_documents, rejection_reason, reviewed_by, reviewed_at,
            business_name, user_email, role, proof_url, created_at, updated_at,
            notes, message, admin_notes, listing_contact_email, listing_contact_phone,
            created_date
          `)
          .order("created_at", { ascending: false })
          .limit(100)
      ]);

      console.log('🔍 Query results:', {
        businessesError: businessesRes.error,
        businessesCount: businessesRes.data?.length || 0,
        claimsError: claimsRes.error,
        claimsCount: claimsRes.data?.length || 0,
        sampleClaim: claimsRes.data?.[0]
      });

      // Try to load insights separately, but don't fail if it doesn't work
      let insightsRes = { data: [], error: null };
      try {
        insightsRes = await supabase
          .from("business_insights_snapshots")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(200);
      } catch (insightsError) {
        console.warn('⚠️ Insights table not available:', insightsError.message);
        insightsRes = { data: [], error: null };
      }

      if (businessesRes.error) {
        console.error('❌ Businesses query error:', businessesRes.error);
        throw new Error(`Businesses query failed: ${businessesRes.error.message}`);
      }
      if (claimsRes.error) {
        console.error('❌ Claims query error:', claimsRes.error);
        throw new Error(`Claims query failed: ${claimsRes.error.message}`);
      }
      if (insightsRes.error) {
        console.warn('⚠️ Insights query error:', insightsRes.error);
        // Don't throw error for insights, just continue with empty data
      }

      setBusinesses(businessesRes.data || []);
      setClaims(claimsRes.data || []);
      setInsights(insightsRes.data || []);
      
      console.log('✅ Admin data loaded successfully');
      console.log(`📊 Businesses: ${businessesRes.data?.length || 0}, Claims: ${claimsRes.data?.length || 0}, Insights: ${insightsRes.data?.length || 0}`);
      
      // Show sample of loaded data
      if (claimsRes.data && claimsRes.data.length > 0) {
        console.log('📄 Sample claim data:', claimsRes.data[0]);
      }
      
    } catch (error) {
      console.error("❌ Error loading admin data:", error);
      toast.error(`Failed to load data: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (business, newStatus) => {
    try {
      const supabase = getSupabase();
      
      const { error } = await supabase
        .from("businesses")
        .update({ 
          status: newStatus,
          updated_date: new Date().toISOString()
        })
        .eq("id", business.id);

      if (error) throw error;

      setBusinesses(prev => 
        prev.map(b => b.id === business.id ? { ...b, status: newStatus } : b)
      );

      toast.success(`Business status changed to ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Unable to update business status.");
    }
  };

  const updateClaim = async (claim, newStatus) => {
    try {
      const supabase = getSupabase();
      
      const { error } = await supabase
        .from("claim_requests")
        .update({ 
          status: newStatus,
          reviewed_at: new Date().toISOString(),
          reviewed_by: user?.id
        })
        .eq("id", claim.id);

      if (error) throw error;

      setClaims(prev => 
        prev.map(c => c.id === claim.id ? { ...c, status: newStatus } : c)
      );

      // If approved, update business status
      if (newStatus === "approved") {
        await updateStatus(
          businesses.find(b => b.id === claim.business_id),
          BUSINESS_STATUS.ACTIVE
        );
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
      const supabase = getSupabase();
      
      const { error } = await supabase
        .from("businesses")
        .delete()
        .eq("id", businessId);

      if (error) throw error;

      setBusinesses(prev => prev.filter(b => b.id !== businessId));

      toast.success("The business has been permanently deleted.");
    } catch (error) {
      console.error("Error deleting business:", error);
      toast.error("Unable to delete the business.");
    }
  };

  const getLatestSnapshot = (businessId) => {
    return insights
      .filter(snapshot => snapshot.business_id === businessId)
      .sort((a, b) => {
        const dateA = new Date(a.created_at || '').getTime();
        const dateB = new Date(b.created_at || '').getTime();
        return dateB - dateA;
      })[0];
  };

  const saveBusiness = async (formData) => {
    setSavingEdit(true);
    try {
      const supabase = getSupabase();

      const { id, ...updateData } = formData;
      const safeUpdateData = Object.keys(updateData).reduce((acc, key) => {
        if (
          !["updated_date", "created_date", "verification_source", "contact_website"].includes(key) &&
          updateData[key] !== ""
        ) {
          acc[key] = updateData[key];
        }
        return acc;
      }, {});

      const { error } = await supabase
        .from("businesses")
        .update({ ...safeUpdateData, updated_date: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;

      setBusinesses((prev) =>
        prev.map((b) => (b.id === id ? { ...b, ...safeUpdateData } : b))
      );
      setEditingBusiness(null);
      setCurrentEditStep(1);

      toast.success("The business has been successfully updated.");
    } catch (error) {
      console.error("Error updating business:", error);
      toast.error("Unable to update the business.");
    } finally {
      setSavingEdit(false);
    }
  };

  const createVerifiedBusiness = async (formData) => {
    try {
      const supabase = getSupabase();
      
      const businessData = {
        ...formData,
        status: BUSINESS_STATUS.ACTIVE,
        verified: true,
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("businesses")
        .insert(businessData)
        .select(`
          id, name, business_handle, description, industry, country, city, 
          status, visibility_tier, verified, claimed, contact_email, website,
          logo_url, owner_user_id, created_date, updated_date
        `)
        .single();

      if (error) throw error;

      setBusinesses((prev) => [data, ...prev]);
      setShowCreateForm(false);

      toast.success("The listing was created and automatically verified.");
    } catch (error) {
      console.error("Error creating business:", error);
      toast.error("Unable to create the listing.");
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
      "visibility_tier",
      "verified",
      "claimed",
      "contact_email",
      "contact_website",
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

  if (!user || !isAdmin || checkingAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f9fc] px-4">
        <div className="max-w-sm rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
          {checkingAdmin ? (
            <>
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#0d4f4f] border-t-transparent mx-auto mb-4" />
              <h2 className="mb-2 text-xl font-bold text-[#0a1628]">Checking Access</h2>
              <p className="mb-6 text-sm text-gray-500">
                Verifying admin permissions...
              </p>
            </>
          ) : !user ? (
            <>
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
            </>
          ) : (
            <>
              <AlertTriangle className="mx-auto mb-4 h-10 w-10 text-red-400" />
              <h2 className="mb-2 text-xl font-bold text-[#0a1628]">Access Denied</h2>
              <p className="mb-6 text-sm text-gray-500">
                Admin access required to view this page. Your account does not have admin privileges.
              </p>
              <Link
                href={createPageUrl("BusinessLogin")}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0a1628] px-6 py-3 text-sm font-semibold text-white hover:bg-[#122040]"
              >
                Sign In <ChevronRight className="h-4 w-4" />
              </Link>
            </>
          )}
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
      data = data.filter((business) => business.visibility_tier === filters.tier);
    }
    if (filters.verified !== "") {
      const isVerified = filters.verified === "true";
      data = data.filter((business) => business.verified === isVerified);
    }

    return data;
  };

  const getFilteredClaims = () => {
    let filteredClaims = claims;

    // Apply claim status filter
    if (filters.claimStatus) {
      filteredClaims = filteredClaims.filter((claim) => claim.status === filters.claimStatus);
    }

    // Apply search filter
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
  const activeInsights = businesses.filter((b) => b.founder_snapshot_completed);

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
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
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

                    {activeTab === "claims" && (
                      <select
                        value={filters.claimStatus}
                        onChange={(e) =>
                          setFilters((prev) => ({ ...prev, claimStatus: e.target.value }))
                        }
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
                          verified: "",
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

                      <div className="hidden lg:block space-y-3">
                        {filteredClaimsData.map((claim) => {
                          const business = businesses.find((b) => b.id === claim.business_id);
                          return (
                            <div
                              key={claim.id}
                              className="rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
                            >
                              <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-[#0a1628] to-[#0d4f4f]">
                                  {business?.logo_url ? (
                                    <img
                                      src={business.logo_url}
                                      alt=""
                                      className="h-full w-full object-cover"
                                      onError={(e) => {
                                        console.warn('Failed to load claim business logo:', business.logo_url);
                                        e.currentTarget.src = '/pm_logo.png';
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
                                <div className="min-w-0 flex-1">
                                  <div className="mb-1 flex flex-wrap items-center gap-2">
                                    <span className="font-semibold text-[#0a1628]">
                                      {business?.name || "Unknown Business"}
                                    </span>
                                    <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${
                                      claim.status === 'approved' ? getBadgeStyles("success") :
                                      claim.status === 'rejected' ? getBadgeStyles("danger") :
                                      claim.status === 'pending' ? getBadgeStyles("warning") :
                                      getBadgeStyles("neutral")
                                    }`}>
                                      {claim.status ? claim.status.charAt(0).toUpperCase() + claim.status.slice(1) : 'Unknown'}
                                    </span>
                                    {business && (
                                      <span className={`rounded-full border px-2 py-0.5 text-xs ${getBadgeStyles("neutral")}`}>
                                        {getTierDisplayName(business.visibility_tier) || business.visibility_tier || "vaka"}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-500">
                                    {business?.country || "Unknown"} · {business?.industry || "Unknown"} · {claim.user_email}
                                  </p>
                                  <p className="mt-1 text-xs text-gray-400">
                                    Requested {new Date(claim.created_at).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="flex flex-shrink-0 items-center gap-2">
                                  {claim.status === 'pending' && (
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
                                    {getTierDisplayName(business.visibility_tier) || business.visibility_tier || "vaka"}
                                  </span>
                                  {business.verified && (
                                    <span className={`rounded-full border px-2 py-1 text-xs font-medium ${getBadgeStyles("premium")}`}>
                                      Verified
                                    </span>
                                  )}
                                </div>

                                <div className="mb-3 flex flex-wrap items-center gap-4 text-xs text-gray-600">
                                  <span>
                                    {getCountryDisplayName(business.country)} • {getIndustryDisplayName(business.industry) || "No industry"}
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
                                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gradient-to-br from-[#0a1628] to-[#0d4f4f]">
                                      {b.logo_url ? (
                                        <img
                                          src={b.logo_url}
                                          alt=""
                                          className="h-full w-full object-cover"
                                          onError={(e) => {
                                            console.warn('Failed to load admin dashboard logo:', b.logo_url);
                                            e.currentTarget.src = '/pm_logo.png';
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
                                    {getCountryDisplayName(b.country)} · {getIndustryDisplayName(b.industry) || "No industry"}
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
                                      {getTierDisplayName(b.visibility_tier) || b.visibility_tier || "vaka"}
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
                                        setEditingBusiness(b);
                                        setCurrentEditStep(1);
                                      }}
                                      className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs transition-all ${secondaryButtonCls}`}
                                    >
                                      Edit
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
