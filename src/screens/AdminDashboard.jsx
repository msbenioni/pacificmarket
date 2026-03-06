import { useState, useEffect } from "react";
import Link from "next/link";
import { createPageUrl } from "@/utils";
import { getSupabase } from "@/lib/supabase/client";
import { Building2, Plus, Edit, Star, Shield, CheckCircle, Upload, FileText, QrCode, ChevronRight, AlertCircle, Trash2, Zap, Search, Users, X, Filter, Calendar, TrendingUp, Globe, Award, Clock, XCircle, AlertTriangle, Download, Eye } from "lucide-react";
import DetailedBusinessForm, { FORM_MODES } from "@/components/forms/DetailedBusinessForm";
import { COUNTRIES, CATEGORIES } from "@/constants/businessProfile";
import { BUSINESS_STATUS, BUSINESS_TIER, BUSINESS_SOURCE, getTierDisplayName } from "@/constants/business";
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

// Premium color scheme for governance console
const COLORS = {
  navy: "#0a1628",
  navyHover: "#122040", 
  teal: "#0d4f4f",
  tealHover: "#1a6b6b",
  gold: "#c9a84c",
  goldHover: "#b8973b",
  surface: {
    page: "#f8f9fc",
    primary: "#ffffff",
    elevated: "#ffffff",
    status: {
      success: "#f0fdf4",
      warning: "#fffbeb", 
      danger: "#fef2f2",
      info: "#f0f9ff",
      premium: "#fffbeb"
    }
  }
};

// Badge system for consistent styling
const getBadgeStyles = (variant) => {
  const styles = {
    success: "bg-green-100 text-green-800 border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200", 
    danger: "bg-red-100 text-red-800 border-red-200",
    info: "bg-blue-100 text-blue-800 border-blue-200",
    premium: "bg-amber-100 text-amber-800 border-amber-200",
    neutral: "bg-gray-100 text-gray-800 border-gray-200"
  };
  return styles[variant] || styles.neutral;
};

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
  
  // Premium search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    country: "",
    industry: "",
    tier: "",
    verified: ""
  });
  const [showFilters, setShowFilters] = useState(false);
  
  const { toast } = useToast();

  // Helper to get latest snapshot for a business
  const getLatestSnapshot = (businessId) =>
    insightSnapshots.find(s => s.business_id === businessId);

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        const supabase = getSupabase();
        
        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          setLoading(false);
          return;
        }

        // Get user profile for role information
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role, display_name')
          .eq('id', user.id)
          .single();

        const enhancedUser = { 
          ...user, 
          role: profileData?.role || 'owner',
          permissions: profileData?.role === 'admin' ? ['read', 'write', 'delete'] : [],
          full_name: profileData?.display_name || user.user_metadata?.full_name || user.user_metadata?.display_name,
          display_name: profileData?.display_name || user.user_metadata?.display_name || user.user_metadata?.full_name
        };

        setUser(enhancedUser);
        if (checkIsAdmin(enhancedUser)) {
          setIsAdmin(true);
          
          // Load businesses and claims in parallel
          const [businessesResult, claimsResult] = await Promise.all([
            supabase
              .from('businesses')
              .select('*')
              .order('created_date', { ascending: false })
              .limit(200),
            supabase
              .from('claim_requests')
              .select('*')
              .order('created_date', { ascending: false })
              .limit(100)
          ]);

          const businesses = businessesResult.data || [];
          const claims = claimsResult.data || [];
          
          setBusinesses(businesses);
          setClaims(claims);

          // Fetch insight snapshots for all businesses
          const businessIds = businesses.map(business => business.id);
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
  verified_date: new Date().toISOString(),
});

  const updateStatus = async (business, status) => {
    try {
      const supabase = getSupabase();
      
      // If approving a business, automatically verify it
      const updates = status === BUSINESS_STATUS.ACTIVE 
        ? { status, ...createVerifiedBusinessUpdates() }
        : { status };
      
      const { error } = await supabase
        .from('businesses')
        .update(updates)
        .eq('id', business.id);
        
      if (error) throw error;
      
      setBusinesses(prev => prev.map(b => b.id === business.id ? { ...b, ...updates } : b));
      
      toast({
        title: "Status Updated",
        description: status === BUSINESS_STATUS.ACTIVE 
          ? "Business approved and automatically verified!" 
          : `Business status has been updated to ${status}.`,
        variant: "success"
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update business status. Please try again.",
        variant: "error"
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
      
      // Filter out any fields that might cause database issues
      const { id, ...updateData } = formData;
      
      // Remove potentially problematic fields
      const safeUpdateData = Object.keys(updateData).reduce((acc, key) => {
        // Only include fields that we know exist in the database
        if (!['updated_date', 'created_date', 'verification_source'].includes(key)) {
          acc[key] = updateData[key];
        }
        return acc;
      }, {});
      
      const { error } = await supabase
        .from('businesses')
        .update(safeUpdateData)
        .eq('id', id);
      
      if (error) throw error;
      
      setBusinesses(prev => prev.map(b => b.id === id ? { ...b, ...safeUpdateData } : b));
      setEditingBusiness(null);
      setCurrentEditStep(1); // Reset step when closing
      toast({
        title: "Business Updated",
        description: "Business updated successfully.",
        variant: "success"
      });
    } catch (error) {
      console.error("Error updating business:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update business. Please try again.",
        variant: "error"
      });
    } finally {
      setSavingEdit(false);
    }
  };

  const deleteBusiness = async (id) => {
    if (!confirm("Delete this business record? This cannot be undone.")) return;
    
    try {
      const supabase = getSupabase();
      const { error } = await supabase
        .from('businesses')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setBusinesses(prev => prev.filter(b => b.id !== id));
      
      toast({
        title: "Business Deleted",
        description: "Business has been successfully deleted.",
        variant: "success"
      });
    } catch (error) {
      console.error("Error deleting business:", error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete business. Please try again.",
        variant: "error"
      });
    }
  };

  const updateClaim = async (claim, status) => {
  try {
    const supabase = getSupabase();
    
    // Update claim status
    const { error: claimError } = await supabase
      .from('claim_requests')
      .update({ status })
      .eq('id', claim.id);
    
    if (claimError) throw claimError;
    
    setClaims(prev => prev.map(c => c.id === claim.id ? { ...c, status } : c));
    
    if (status === "approved") {
      // Update business to set owner, mark as claimed, set status to active, and auto-verify
      const businessUpdates = { 
        owner_user_id: claim.user_id, 
        claimed: true,
        status: BUSINESS_STATUS.ACTIVE,
        ...createVerifiedBusinessUpdates()
      };
      
      const { error: businessError } = await supabase
        .from('businesses')
        .update(businessUpdates)
        .eq('id', claim.business_id);
      
      if (businessError) throw businessError;
      
      setBusinesses(prev => prev.map(b => b.id === claim.business_id ? { 
        ...b, 
        ...businessUpdates
      } : b));
    }
    
    toast({
      title: `Claim ${status}`,
      description: status === "approved" 
        ? "Claim approved and business automatically verified!" 
        : `Claim request has been ${status}.`,
      variant: status === "approved" ? "success" : "default"
    });
  } catch (error) {
    console.error("Error updating claim:", error);
    toast({
      title: "Update Failed",
      description: "Failed to update claim request. Please try again.",
      variant: "error"
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
      status: BUSINESS_STATUS.ACTIVE, // Admin-created businesses start as active
      ...createVerifiedBusinessUpdates(),
      ...formData,
    };
    
    const { data, error } = await supabase
      .from('businesses')
      .insert(businessData)
      .select('*')
      .single();
    
    if (error) throw error;
    
    setBusinesses(prev => [data, ...prev]);
    setShowCreateForm(false);
    toast({
      title: "Business Created & Verified",
      description: "The listing was created and automatically verified.",
      variant: "success"
    });
  } catch (error) {
    console.error("Error creating business:", error);
    toast({
      title: "Create Failed",
      description: "Unable to create the listing.",
      variant: "error"
    });
  } finally {
    setCreatingBusiness(false);
  }
};

  const exportCSV = () => {
    const fields = ["name", "business_handle", "industry", "country", "city", "status", "subscription_tier", "verified", "claimed", "contact_email", "website"];
    const header = fields.join(",");
    const rows = businesses.map(b => fields.map(f => `"${(b[f] ?? "").toString().replace(/"/g, '""')}"`).join(","));
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "pacific_market_registry.csv"; a.click();
  };

  if (loading) return <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#0d4f4f] border-t-transparent rounded-full animate-spin" /></div>;

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center">
        <div className="text-center bg-white border border-gray-100 rounded-2xl p-12 max-w-sm">
          <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#0a1628] mb-2">Access Denied</h2>
          <p className="text-gray-500 mb-6">Admin access required to view this page.</p>
          <Link href={createPageUrl("BusinessLogin")} className="inline-flex items-center gap-2 bg-[#0a1628] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#122040]">
            Sign In <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  if (!checkIsAdmin(user)) return (
    <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center">
      <div className="text-center bg-white border border-gray-100 rounded-2xl p-12 max-w-sm">
        <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-[#0a1628] mb-2">Access Denied</h2>
        <p className="text-gray-500 mb-6">Admin access required to view this page.</p>
        <Link href={createPageUrl("BusinessLogin")} className="inline-flex items-center gap-2 bg-[#0a1628] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#122040]">
          Sign In <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );

  const statusTab = TABS.find(tab => tab.id === activeTab && tab.status);
  const filtered = statusTab
    ? businesses.filter(b => b.status === statusTab.status)
    : [];

  // Premium search and filter logic
  const getFilteredData = () => {
    let data = filtered;
    
    // Apply search query
    if (searchQuery) {
      data = data.filter(business => 
        business.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.industry?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply filters
    if (filters.country) {
      data = data.filter(business => business.country === filters.country);
    }
    if (filters.industry) {
      data = data.filter(business => business.industry === filters.industry);
    }
    if (filters.tier) {
      data = data.filter(business => business.subscription_tier === filters.tier);
    }
    if (filters.verified !== "") {
      const isVerified = filters.verified === "true";
      data = data.filter(business => business.verified === isVerified);
    }
    
    return data;
  };

  const filteredData = getFilteredData();

  const pendingCount = businesses.filter(b => b.status === BUSINESS_STATUS.PENDING).length;
  const pendingClaimsCount = claims.filter(c => c.status === "pending").length;

  // Executive stats for premium dashboard
  const executiveStats = [
    { label: "Total Businesses", value: businesses.length, color: "text-blue-600", bgColor: "bg-blue-50" },
    { label: "Verified", value: businesses.filter(b => b.verified).length, color: "text-green-600", bgColor: "bg-green-50" },
    { label: "Pending Review", value: pendingCount, color: "text-yellow-600", bgColor: "bg-yellow-50" },
    { label: "Pending Claims", value: pendingClaimsCount, color: "text-purple-600", bgColor: "bg-purple-50" },
  ];

  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0d4f4f] bg-white";

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

      <div className="bg-[#f8f9fc] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          
          {/* Level 2: Main Action Row */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              {/* Search */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search businesses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0d4f4f] bg-gray-50 focus:bg-white transition-colors"
                  />
                </div>
              </div>
              
              {/* Filters */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    showFilters 
                      ? 'bg-[#0d4f4f] text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {(filters.country || filters.industry || filters.tier || filters.verified !== "") && (
                    <span className="bg-white/20 text-white text-xs px-1.5 py-0.5 rounded-full">
                      {Object.values(filters).filter(v => v).length}
                    </span>
                  )}
                </button>
                
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="flex items-center gap-2 bg-[#0a1628] hover:bg-[#122040] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all"
                >
                  <Plus className="w-4 h-4" /> Create Listing
                </button>
              </div>
            </div>
            
            {/* Filter Panel */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <select
                    value={filters.country}
                    onChange={(e) => setFilters(prev => ({ ...prev, country: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0d4f4f]"
                  >
                    <option value="">All Countries</option>
                    {COUNTRIES.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                  <select
                    value={filters.industry}
                    onChange={(e) => setFilters(prev => ({ ...prev, industry: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0d4f4f]"
                  >
                    <option value="">All Industries</option>
                    {CATEGORIES.map(industry => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                  <select
                    value={filters.tier}
                    onChange={(e) => setFilters(prev => ({ ...prev, tier: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0d4f4f]"
                  >
                    <option value="">All Tiers</option>
                    <option value="vaka">Vaka</option>
                    <option value="mana">Mana</option>
                    <option value="moana">Moana</option>
                  </select>
                  <select
                    value={filters.verified}
                    onChange={(e) => setFilters(prev => ({ ...prev, verified: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0d4f4f]"
                  >
                    <option value="">All Verification</option>
                    <option value="true">Verified</option>
                    <option value="false">Not Verified</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Level 3: Tabbed Work Areas */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
            {/* Tabs */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex gap-1 bg-gray-50 rounded-xl p-1">
                {TABS.map(tab => (
                  <button 
                    key={tab.id} 
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all flex-shrink-0 ${
                      activeTab === tab.id 
                        ? "bg-white text-[#0a1628] shadow-sm" 
                        : "text-gray-600 hover:text-[#0a1628]"
                    }`}
                  >
                    <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-[#0d4f4f]" : ""}`} />
                    {tab.label}
                    {tab.id === "pending" && pendingCount > 0 && (
                      <span className="bg-yellow-500 text-white text-xs px-1.5 py-0.5 rounded-full">{pendingCount}</span>
                    )}
                    {tab.id === "claims" && pendingClaimsCount > 0 && (
                      <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">{pendingClaimsCount}</span>
                    )}
                  </button>
                ))}
              </div>
              
              {/* Export CSV Button */}
              <button onClick={exportCSV} className="flex items-center gap-2 bg-[#0d4f4f] hover:bg-[#1a6b6b] text-white text-sm font-medium px-4 py-2 rounded-lg transition-all">
                <Download className="w-4 h-4" /> Export CSV
              </button>
            </div>

            {/* Level 4: Data Views */}
            <div className="p-4">
              {/* Claims Tab */}
              {activeTab === "claims" && (
                <div className="space-y-3">
                  {claims.filter(c => c.status === "pending").length === 0 ? (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
                      <Shield className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">No pending claim requests.</p>
                    </div>
                  ) : claims.filter(c => c.status === "pending").map(claim => {
                    const business = businesses.find(b => b.id === claim.business_id);
                    return (
                      <div key={claim.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0a1628] to-[#0d4f4f] flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-sm">{business?.name?.[0] || "?"}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="font-semibold text-[#0a1628]">{business?.name || "Unknown Business"}</span>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getBadgeStyles('info')}`}>Claim Request</span>
                              {business && <span className={`px-2 py-0.5 rounded-full text-xs ${getBadgeStyles('neutral')}`}>{business.subscription_tier}</span>}
                            </div>
                            <p className="text-gray-500 text-xs">{business?.country || "Unknown"} · {business?.industry || "Unknown"} · {claim.user_email}</p>
                            <p className="text-gray-400 text-xs mt-1">Requested {new Date(claim.created_date).toLocaleDateString()}</p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button onClick={() => updateClaim(claim, "approved")}
                              className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl border transition-all ${getBadgeStyles('success')}`}>
                              <CheckCircle className="w-3 h-3" /> Approve
                            </button>
                            <button onClick={() => updateClaim(claim, "denied")}
                              className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl border transition-all ${getBadgeStyles('danger')}`}>
                              <XCircle className="w-3 h-3" /> Deny
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Insights Tab */}
              {activeTab === "insights" && (
                <div className="space-y-4">
                  {businesses.filter(b => b.founder_snapshot_completed).length === 0 ? (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
                      <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">No founder insights submitted yet.</p>
                    </div>
                  ) : businesses.filter(b => b.founder_snapshot_completed).map(business => (
                    <div key={business.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-[#0a1628]">{business.name}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs ${getBadgeStyles('neutral')}`}>
                              {business.subscription_tier}
                            </span>
                            {business.verified && (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeStyles('premium')}`}>
                                Verified
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-4 text-xs text-gray-600 mb-3">
                            <span>{business.country} • {business.industry || "No industry"}</span>
                            {business.founder_snapshot_completed_at && (
                              <span>Submitted {new Date(business.founder_snapshot_completed_at).toLocaleDateString()}</span>
                            )}
                          </div>
                          
                          {getLatestSnapshot(business.id) && (
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>Year: {getLatestSnapshot(business.id).year_started}</span>
                              <span>Team: {getLatestSnapshot(business.id).team_size_band}</span>
                              <span>Stage: {getLatestSnapshot(business.id).business_stage}</span>
                            </div>
                          )}
                        </div>
                        
                        <button 
                          onClick={() => setSelectedInsightBusiness(business)}
                          className="text-xs text-[#0d4f4f] hover:text-[#0a1628] font-medium flex items-center gap-1"
                        >
                          View Details <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Business Tabs - Premium Table View */}
              {activeTab !== "claims" && activeTab !== "insights" && (
                <div className="space-y-1">
                  {filteredData.length === 0 ? (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
                      <Building2 className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">No {activeTab} businesses found.</p>
                    </div>
                  ) : (
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {filteredData.map(b => (
                            <tr key={b.id} className="hover:bg-gray-50">
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0a1628] to-[#0d4f4f] flex items-center justify-center">
                                    <span className="text-white font-bold text-xs">{b.name?.[0]}</span>
                                  </div>
                                  <div>
                                    <div className="font-medium text-[#0a1628]">{b.name}</div>
                                    <div className="text-xs text-gray-500">{b.contact_email || "No email"}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <div className="text-sm text-gray-600">
                                  {b.country} · {b.industry || "No industry"}
                                </div>
                                <div className="text-xs text-gray-400">
                                  Submitted {new Date(b.created_date).toLocaleDateString()}
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-2">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeStyles(b.verified ? 'premium' : 'neutral')}`}>
                                    {b.subscription_tier}
                                  </span>
                                  {b.verified && (
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeStyles('success')}`}>
                                      Verified
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <div className="flex items-center justify-end gap-2">
                                  {b.status === BUSINESS_STATUS.PENDING && (
                                    <>
                                      <button onClick={() => updateStatus(b, BUSINESS_STATUS.ACTIVE)}
                                        className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg border transition-all ${getBadgeStyles('success')}`}>
                                        <CheckCircle className="w-3 h-3" />
                                      </button>
                                      <button onClick={() => updateStatus(b, BUSINESS_STATUS.REJECTED)}
                                        className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg border transition-all ${getBadgeStyles('danger')}`}>
                                        <XCircle className="w-3 h-3" />
                                      </button>
                                    </>
                                  )}
                                  <button onClick={() => {
                                    setEditingBusiness(b);
                                    setCurrentEditStep(1); // Reset to first step when opening
                                  }}
                                    className="p-1.5 rounded-lg border border-gray-200 hover:border-[#0d4f4f] hover:text-[#0d4f4f] transition-colors"
                                    title="Edit"
                                  >
                                    <Edit className="w-3 h-3" />
                                  </button>
                                  <Link href={createPageUrl("BusinessProfile") + `?handle=${b.business_handle || b.id}`}
                                    className="p-1.5 rounded-lg hover:bg-[#0d4f4f]/5 transition-colors"
                                    title="View"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </Link>
                                  <button onClick={() => deleteBusiness(b.id)}
                                    className="p-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Modals */}
          {/* Edit Modal */}
          {editingBusiness && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/50" onClick={() => setEditingBusiness(null)} />
              <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                  <h3 className="font-bold text-[#0a1628]">Edit: {editingBusiness.name}</h3>
                  <button onClick={() => setEditingBusiness(null)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6">
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

          {/* Create Business Modal */}
          {showCreateForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/50" onClick={() => setShowCreateForm(false)} />
              <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                  <h3 className="font-bold text-[#0a1628]">Create Business Listing</h3>
                  <button onClick={() => setShowCreateForm(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6">
                  <DetailedBusinessForm onSubmit={createBusiness} isLoading={creatingBusiness} onStepChange={() => {}} mode={FORM_MODES.ADMIN_CREATE} />
                </div>
              </div>
            </div>
          )}

          {/* Admin Insights Detail Modal */}
          {selectedInsightBusiness && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-[#0a1628]">Founder Insights Details</h2>
                      <p className="text-sm text-gray-600 mt-1">{selectedInsightBusiness.name}</p>
                    </div>
                    <button
                      onClick={() => setSelectedInsightBusiness(null)}
                      className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <FounderInsightsSummary 
                    snapshot={getLatestSnapshot(selectedInsightBusiness.id)}
                    business={selectedInsightBusiness}
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