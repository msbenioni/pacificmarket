"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { getAdminBusinesses } from "@/lib/supabase/queries/businesses";
import { isVerifiedBusiness, getBusinessTier, getBusinessTierDisplay } from "@/lib/business/helpers";
import toast from "react-hot-toast";
import {
  ChevronRight, ChevronDown, ChevronUp, Search, Filter, Download, Edit, Trash2, X, Plus, Users, Building2, TrendingUp, CheckCircle, Clock, Shield, XCircle, AlertTriangle
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
            Requested {claim.created_at || claim.created_date ? new Date(claim.created_at || claim.created_date).toLocaleDateString() : "—"}
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
              {getTierDisplayName(business.subscription_tier) || business.subscription_tier || "vaka"}
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

function InsightMobileCard({ insight }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
            {insight.business_name && (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0d4f4f] to-[#1a5c5c] text-white text-xs font-bold">
                {insight.business_name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-[#0a1628] break-words">
                {insight.business_name}
              </h3>
              <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${getBadgeStyles("neutral")}`}>
                {getTierDisplayName(insight.subscription_tier) || insight.subscription_tier || "vaka"}
              </span>
              {insight.verified && (
                <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${getBadgeStyles("success")}`}>
                  Verified
                </span>
              )}
            </div>

            <p className="mt-1 text-xs text-gray-500">
              {getCountryDisplayName(insight.business_country)} · {getIndustryDisplayName(insight.business_industry) || "No industry"}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Submitted {insight.submitted_date ? new Date(insight.submitted_date).toLocaleDateString() : "—"}
            </p>

            {insight.problem_solved && (
              <div className="mt-2">
                <p className="text-xs text-gray-600 line-clamp-2">{insight.problem_solved}</p>
              </div>
            )}

            <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
              {insight.team_size_band && (
                <span>Team: {insight.team_size_band}</span>
              )}
              {insight.growth_stage && (
                <span>Stage: {insight.growth_stage}</span>
              )}
              {insight.snapshot_year && (
                <span>Year: {insight.snapshot_year}</span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`inline-flex min-h-[40px] items-center gap-1 rounded-lg border px-3 py-2 text-xs font-semibold ${secondaryButtonCls}`}
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-3.5 w-3.5" />
                Hide Details
              </>
            ) : (
              <>
                View Details <ChevronRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Accordion Content */}
      {isExpanded && (
        <div className="border-t border-gray-200 bg-gray-50 p-4 space-y-4">
          {/* Business Information */}
          <div>
            <h4 className="text-sm font-semibold text-[#0a1628] mb-2">Business Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Country:</span>
                <p className="font-medium">
                  {getCountryDisplayName(insight.business_country) || 'Not specified'}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Industry:</span>
                <p className="font-medium">
                  {getIndustryDisplayName(insight.business_industry) || 'Not specified'}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Subscription Tier:</span>
                <p className="font-medium">
                  {getTierDisplayName(insight.subscription_tier) || insight.subscription_tier || 'vaka'}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Verified:</span>
                <p className="font-medium">
                  {insight.verified ? 'Yes' : 'No'}
                </p>
              </div>
            </div>
          </div>

          {/* Problem Solved */}
          {insight.problem_solved && (
            <div>
              <h4 className="text-sm font-semibold text-[#0a1628] mb-2">Problem Solved</h4>
              <p className="text-sm text-gray-700 bg-white p-3 rounded-lg">
                {insight.problem_solved}
              </p>
            </div>
          )}

          {/* Founder Story */}
          {insight.founder_story && (
            <div>
              <h4 className="text-sm font-semibold text-[#0a1628] mb-2">Founder Story</h4>
              <p className="text-sm text-gray-700 bg-white p-3 rounded-lg whitespace-pre-wrap">
                {insight.founder_story}
              </p>
            </div>
          )}

          {/* Business Details */}
          <div>
            <h4 className="text-sm font-semibold text-[#0a1628] mb-2">Business Details</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {insight.team_size_band && (
                <div>
                  <span className="text-gray-500">Team Size:</span>
                  <p className="font-medium">{insight.team_size_band}</p>
                </div>
              )}
              {insight.growth_stage && (
                <div>
                  <span className="text-gray-500">Business Stage:</span>
                  <p className="font-medium">{insight.growth_stage}</p>
                </div>
              )}
              {insight.snapshot_year && (
                <div>
                  <span className="text-gray-500">Snapshot Year:</span>
                  <p className="font-medium">{insight.snapshot_year}</p>
                </div>
              )}
              {insight.year_started && (
                <div>
                  <span className="text-gray-500">Year Started:</span>
                  <p className="font-medium">{insight.year_started}</p>
                </div>
              )}
            </div>
          </div>

          {/* Challenges */}
          {insight.top_challenges && insight.top_challenges.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-[#0a1628] mb-2">Top Challenges</h4>
              <div className="flex flex-wrap gap-2">
                {insight.top_challenges.map((challenge, index) => (
                  <span 
                    key={index}
                    className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700"
                  >
                    {challenge}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Motivations */}
          {insight.founder_motivation_array && insight.founder_motivation_array.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-[#0a1628] mb-2">Founder Motivations</h4>
              <div className="flex flex-wrap gap-2">
                {insight.founder_motivation_array.map((motivation, index) => (
                  <span 
                    key={index}
                    className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700"
                  >
                    {motivation}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

async function checkIsAdmin(user) {
  if (!user) return false;
  
  try {
    // Import getSupabase dynamically
    const { getSupabase } = await import("@/lib/supabase/client");
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
  const { user, loading: authLoading } = useAuth();
  const [dashboardLoading, setDashboardLoading] = useState(true);
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

  const [filters, setFilters] = useState({
    country: "",
    industry: "",
    tier: "",
    verified: "",
    claimStatus: "",
  });

  const loadAdminData = useCallback(async () => {
    if (!user) return;

    setDashboardLoading(true);

    try {
      // Import getSupabase dynamically
      const { getSupabase } = await import("@/lib/supabase/client");
      const supabase = getSupabase();
      
      console.log('🔄 Loading admin data for user:', user?.email);
      
      // Use the correct column names from the actual database schema
      const [businessesRes, claimsRes] = await Promise.all([
        getAdminBusinesses({ limit: 500, status: ['active', 'pending', 'rejected'] }),
        
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

      // Load insights from the single source of truth
      console.log('🔄 Loading insights from business_insights_snapshots...');
      let insightsRes = { data: [], error: null };
      try {
        insightsRes = await supabase
          .from("business_insights_snapshots")
          .select(`
            id, business_id, user_id, snapshot_year, submitted_date, year_started,
            problem_solved, team_size_band, business_model, family_involvement,
            customer_region, sales_channels, import_export_status, import_countries,
            export_countries, growth_stage, top_challenges, hiring_intentions,
            founder_role, founder_story, founder_motivation_array
          `)
          .order("submitted_date", { ascending: false })
          .limit(200);
        
        if (insightsRes.error && insightsRes.error.message && Object.keys(insightsRes.error).length > 0 && insightsRes.error.message.trim() !== '') {
          console.error('❌ Insights query error:', insightsRes.error);
        }
      } catch (insightsError) {
        console.error('❌ Insights query failed:', insightsError);
        insightsRes = { data: [], error: insightsError };
      }

      if (businessesRes.error) {
        console.error('❌ Businesses query error:', businessesRes.error);
        throw new Error(`Businesses query failed: ${businessesRes.error.message}`);
      }
      if (claimsRes.error) {
        console.error('❌ Claims query error:', claimsRes.error);
        throw new Error(`Claims query failed: ${claimsRes.error.message}`);
      }
      if (insightsRes.error && insightsRes.error.message && Object.keys(insightsRes.error).length > 0 && insightsRes.error.message.trim() !== '') {
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

        console.log('🔐 Admin status check:', {
          user: user?.email,
          isAdmin: adminStatus,
        });
      } catch (error) {
        console.error('❌ Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setCheckingAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user, authLoading]);

  useEffect(() => {
    console.log('🔐 Auth state:', {
      user: user?.email,
      userRole: user?.role,
      userRaw: user,
      isAdmin,
      authLoading,
      checkingAdmin,
      dashboardLoading,
    });
  }, [user, isAdmin, authLoading, checkingAdmin, dashboardLoading]);

  useEffect(() => {
    if (authLoading || checkingAdmin) return;

    if (user && isAdmin) {
      loadAdminData();
    } else {
      setDashboardLoading(false);
    }
  }, [user, isAdmin, authLoading, checkingAdmin, loadAdminData]);

  const updateStatus = async (business, newStatus) => {
    try {
      // Import getSupabase dynamically
      const { getSupabase } = await import("@/lib/supabase/client");
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
      // Import getSupabase dynamically
      const { getSupabase } = await import("@/lib/supabase/client");
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
      // Import getSupabase dynamically
      const { getSupabase } = await import("@/lib/supabase/client");
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
        const dateA = new Date(a.submitted_date || '').getTime();
        const dateB = new Date(b.submitted_date || '').getTime();
        return dateB - dateA;
      })[0];
  };

  const saveBusiness = async (formData) => {
    setSavingEdit(true);
    try {
      // Import getSupabase dynamically
      const { getSupabase } = await import("@/lib/supabase/client");
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
      // Import getSupabase dynamically
      const { getSupabase } = await import("@/lib/supabase/client");
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
          status, visibility_tier, verified, claimed, contact_email, contact_website,
          logo_url, owner_user_id, created_date, updated_date, subscription_tier
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
      "subscription_tier",
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
          <p className="mb-6 text-sm text-gray-500">
            Please sign in to access this page.
          </p>
          <button
            onClick={() => window.location.href = '/BusinessLogin'}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0d4f4f] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1a6b6b] transition-colors"
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
            onClick={() => window.location.href = '/'}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0d4f4f] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1a6b6b] transition-colors"
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
  
  // Use insights data directly from business_insights_snapshots
  const activeInsights = insights.map(snapshot => {
    const business = businesses.find(b => b.id === snapshot.business_id);
    return {
      ...snapshot,
      business_name: business?.name || 'Unknown Business',
      business_country: business?.country,
      business_industry: business?.industry,
      subscription_tier: business?.subscription_tier,
      verified: business?.verified
    };
  });

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
                                        {getTierDisplayName(business.subscription_tier) || business.subscription_tier || "vaka"}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-500">
                                    {business?.country || "Unknown"} · {business?.industry || "Unknown"} · {claim.user_email}
                                  </p>
                                  <p className="mt-1 text-xs text-gray-400">
                                    Requested {claim.created_at || claim.created_date ? new Date(claim.created_at || claim.created_date).toLocaleDateString() : "—"}
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
                        {activeInsights.map((insight) => (
                          <InsightMobileCard
                            key={insight.id}
                            insight={insight}
                          />
                        ))}
                      </div>

                      <div className="hidden lg:block space-y-4">
                        {activeInsights.map((insight) => (
                          <div
                            key={insight.id}
                            className="rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="mb-2 flex items-center gap-2">
                                  <h4 className="font-semibold text-[#0a1628]">{insight.business_name}</h4>
                                  <span className={`rounded-full border px-2 py-1 text-xs ${getBadgeStyles("neutral")}`}>
                                    {getTierDisplayName(insight.subscription_tier) || insight.subscription_tier || "vaka"}
                                  </span>
                                  {insight.verified && (
                                    <span className={`rounded-full border px-2 py-1 text-xs font-medium ${getBadgeStyles("premium")}`}>
                                      Verified
                                    </span>
                                  )}
                                </div>

                                <div className="mb-3 flex flex-wrap items-center gap-4 text-xs text-gray-600">
                                  <span>
                                    {getCountryDisplayName(insight.business_country)} • {getIndustryDisplayName(insight.business_industry) || "No industry"}
                                  </span>
                                  {insight.submitted_date && (
                                    <span>
                                      Submitted {new Date(insight.submitted_date).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>

                                {insight.problem_solved && (
                                  <div className="mb-3">
                                    <h5 className="text-xs font-semibold text-gray-700 mb-1">Problem Solved</h5>
                                    <p className="text-xs text-gray-600">{insight.problem_solved}</p>
                                  </div>
                                )}

                                <div className="grid grid-cols-2 gap-4 text-xs">
                                  {insight.team_size_band && (
                                    <div>
                                      <span className="font-medium text-gray-700">Team Size:</span>
                                      <span> {insight.team_size_band}</span>
                                    </div>
                                  )}
                                  {insight.growth_stage && (
                                    <div>
                                      <span className="font-medium text-gray-700">Stage:</span>
                                      <span> {insight.growth_stage}</span>
                                    </div>
                                  )}
                                  {insight.snapshot_year && (
                                    <div>
                                      <span className="font-medium text-gray-700">Year:</span>
                                      <span> {insight.snapshot_year}</span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex flex-shrink-0 items-center gap-2">
                                <div className="text-sm text-gray-500">
                                  Details available in mobile view
                                </div>
                              </div>
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
                                      {getTierDisplayName(b.subscription_tier) || b.subscription_tier || "vaka"}
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
