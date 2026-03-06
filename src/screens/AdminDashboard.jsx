import { useState, useEffect } from "react";
import Link from "next/link";
import { createPageUrl } from "@/utils";
import { pacificMarket } from "@/lib/pacificMarketClient";
import { CheckCircle, XCircle, Clock, Building2, Shield, Star, AlertTriangle, Edit, Trash2, Download, ChevronRight, Eye, X, AlertCircle, GitBranch } from "lucide-react";
import DetailedBusinessForm from "@/components/forms/DetailedBusinessForm";
import { CATEGORIES, COUNTRIES } from "@/constants/businessProfile";
import ProcessFlow from "@/components/admin/ProcessFlow";
import CulturalIdentitySelect from "@/components/shared/CulturalIdentitySelect";
import HeroRegistry from "@/components/shared/HeroRegistry";

const TABS = [
  { id: "pending", label: "Pending", icon: Clock, color: "text-yellow-600" },
  { id: "approved", label: "Approved", icon: CheckCircle, color: "text-green-600" },
  { id: "rejected", label: "Rejected", icon: XCircle, color: "text-red-500" },
  { id: "claims", label: "Claims", icon: Shield, color: "text-blue-600" },
  { id: "flow", label: "Process Flow", icon: GitBranch, color: "text-violet-600" },
];

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [businesses, setBusinesses] = useState([]);
  const [claims, setClaims] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [editingBusiness, setEditingBusiness] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [creatingBusiness, setCreatingBusiness] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    pacificMarket.auth.me().then(async u => {
      if (!u) { setLoading(false); return; }
      setUser(u);
      if (u.role === "admin") {
        setIsAdmin(true);
        const [b, c] = await Promise.all([
          pacificMarket.entities.Business.list("-created_date", 200),
          pacificMarket.entities.ClaimRequest.list("-created_date", 100),
        ]);
        setBusinesses(b);
        setClaims(c);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const updateStatus = async (business, status) => {
    await pacificMarket.entities.Business.update(business.id, { status });
    setBusinesses(prev => prev.map(b => b.id === business.id ? { ...b, status } : b));
  };

  const toggleVerified = async (business) => {
    const verified = !business.verified;
    await pacificMarket.entities.Business.update(business.id, { verified });
    setBusinesses(prev => prev.map(b => b.id === business.id ? { ...b, verified } : b));
  };

  const deleteBusiness = async (id) => {
    if (!confirm("Delete this business record? This cannot be undone.")) return;
    await pacificMarket.entities.Business.delete(id);
    setBusinesses(prev => prev.filter(b => b.id !== id));
  };

  const updateClaim = async (claim, status) => {
    await pacificMarket.entities.ClaimRequest.update(claim.id, { status });
    setClaims(prev => prev.map(c => c.id === claim.id ? { ...c, status } : c));
    if (status === "approved") {
      await pacificMarket.entities.Business.update(claim.business_id, { owner_user_id: claim.user_id, claimed: true });
      setBusinesses(prev => prev.map(b => b.id === claim.business_id ? { ...b, claimed: true, owner_user_id: claim.user_id } : b));
    }
  };

  const saveBusiness = async () => {
    setSavingEdit(true);
    await pacificMarket.entities.Business.update(editingBusiness.id, editingBusiness);
    setBusinesses(prev => prev.map(b => b.id === editingBusiness.id ? editingBusiness : b));
    setEditingBusiness(null);
    setSavingEdit(false);
  };

  const createBusiness = async (formData) => {
    setCreatingBusiness(true);
    const created = await pacificMarket.entities.Business.create({
      ...formData,
      status: "approved",
      claimed: false,
      owner_user_id: null,
    });
    setBusinesses(prev => [created, ...prev]);
    setShowCreateForm(false);
    setCreatingBusiness(false);
  };

  const exportCSV = () => {
    const fields = ["name", "country", "city", "category", "status", "tier", "verified", "claimed", "email", "website"];
    const header = fields.join(",");
    const rows = businesses.map(b => fields.map(f => `"${(b[f] ?? "").toString().replace(/"/g, '""')}"`).join(","));
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "pacific_market_registry.csv"; a.click();
  };

  if (loading) return <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#0d4f4f] border-t-transparent rounded-full animate-spin" /></div>;

  // Temporarily removed auth checks for testing
  // if (!user) {
  //   return (
  //     <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center">
  //       <div className="text-center bg-white border border-gray-100 rounded-2xl p-12 max-w-sm">
  //         <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-4" />
  //         <h2 className="text-xl font-bold text-[#0a1628] mb-2">Access Denied</h2>
  //         <p className="text-gray-500 mb-6">Admin access required to view this page.</p>
  //         <Link href={createPageUrl("Login")} className="inline-flex items-center gap-2 bg-[#0a1628] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#122040]">
  //           Sign In <ArrowRight className="w-4 h-4" />
  //         </Link>
  //       </div>
  //     </div>
  //   );
  // }

  // if (!isAdmin) return (
  //   <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center">
  //     <div className="text-center bg-white border border-gray-100 rounded-2xl p-12 max-w-sm">
  //       <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-4" />
  //       <h2 className="text-xl font-bold text-[#0a1628] mb-2">Access Denied</h2>
  //       <p className="text-gray-500 mb-6">Admin access required to view this page.</p>
  //       <Link href={createPageUrl("Login")} className="inline-flex items-center gap-2 bg-[#0a1628] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#122040]">
  //         Sign In <ArrowRight className="w-4 h-4" />
  //       </Link>
  //     </div>
  //   </div>
  // );

  const filtered = activeTab === "claims"
    ? null
    : businesses.filter(b => b.status === activeTab);

  const pendingCount = businesses.filter(b => b.status === "pending").length;
  const pendingClaimsCount = claims.filter(c => c.status === "pending").length;

  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0d4f4f] bg-white";

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      {/* Header */}
      <HeroRegistry
        badge="Admin · Governance Portal"
        title={`Welcome, ${user?.full_name?.split(" ")[0] || "Admin"}`}
        subtitle={user?.email}
        description=""
        showStats={true}
        stats={[
          { label: "Total Businesses", value: businesses.length, color: "text-[#00c4cc]" },
          { label: "Pending Review", value: pendingCount, color: "text-yellow-400" },
          { label: "Verified", value: businesses.filter(b => b.verified).length, color: "text-green-400" },
          { label: "Pending Claims", value: pendingClaimsCount, color: "text-blue-400" },
        ]}
        actions={
          <button onClick={exportCSV} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Create Business Button + Tabs */}
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div className="flex gap-1 bg-white border border-gray-100 rounded-2xl p-1 overflow-x-auto scrollbar-hide">
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex-shrink-0 ${
                  activeTab === tab.id ? "bg-[#0a1628] text-white" : "text-gray-500 hover:text-[#0a1628]"
                }`}>
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-white" : tab.color}`} />
                {tab.label}
                {tab.id === "pending" && pendingCount > 0 && <span className="bg-yellow-500 text-white text-xs px-1.5 py-0.5 rounded-full">{pendingCount}</span>}
                {tab.id === "claims" && pendingClaimsCount > 0 && <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">{pendingClaimsCount}</span>}
              </button>
            ))}
          </div>
          <button onClick={() => setShowCreateForm(true)} 
            className="flex items-center gap-2 bg-[#0d4f4f] hover:bg-[#0a5555] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all flex-shrink-0">
            <Building2 className="w-4 h-4" /> Create Listing
          </button>
        </div>

        {/* Process Flow Tab */}
        {activeTab === "flow" && <ProcessFlow />}

        {/* Claims Tab */}
        {activeTab === "claims" && (() => {
          const unclaimedBusinesses = businesses.filter(b => !b.claimed);
          return (
            <div className="space-y-3">
              {unclaimedBusinesses.length === 0 ? (
                <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
                  <Shield className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">All businesses are claimed.</p>
                </div>
              ) : unclaimedBusinesses.map(b => {
                const businessClaims = claims.filter(c => c.business_id === b.id);
                const pendingClaim = businessClaims.find(c => c.status === "pending");
                return (
                  <div key={b.id} className="bg-white border border-gray-100 rounded-2xl p-5">
                    <div className="flex items-start gap-4 flex-wrap mb-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0a1628] to-[#0d4f4f] flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">{b.name?.[0]}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-bold text-[#0a1628] text-sm">{b.name}</span>
                          <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-medium">Unclaimed</span>
                          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{b.subscription_tier}</span>
                        </div>
                        <p className="text-gray-400 text-xs">{b.country} · {b.category} · {b.email || "No email"}</p>
                        <p className="text-gray-400 text-xs mt-0.5">Created {new Date(b.created_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    {pendingClaim ? (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <AlertCircle className="w-4 h-4 text-yellow-600" />
                              <p className="font-semibold text-yellow-900 text-sm">Claim Request Pending</p>
                            </div>
                            <p className="text-yellow-800 text-xs">User: {pendingClaim.user_email}</p>
                            <p className="text-yellow-800 text-xs">Requested {new Date(pendingClaim.created_date).toLocaleDateString()}</p>
                            {pendingClaim.notes && <p className="text-yellow-800 text-xs mt-1">Notes: {pendingClaim.notes}</p>}
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button onClick={() => updateClaim(pendingClaim, "approved")}
                              className="flex items-center gap-1 text-xs bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-xl hover:bg-green-100">
                              <CheckCircle className="w-3 h-3" /> Approve
                            </button>
                            <button onClick={() => updateClaim(pendingClaim, "denied")}
                              className="flex items-center gap-1 text-xs bg-red-50 text-red-700 border border-red-200 px-3 py-1.5 rounded-xl hover:bg-red-100">
                              <XCircle className="w-3 h-3" /> Deny
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                        <p className="text-gray-600 text-xs">No claim requests yet. Business owner can claim this listing once they create an account.</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })()}

        {/* Business Tabs */}
        {activeTab !== "claims" && activeTab !== "flow" && (
          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
                <Building2 className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No {activeTab} businesses.</p>
              </div>
            ) : filtered.map(b => (
              <div key={b.id} className="bg-white border border-gray-100 rounded-2xl p-5">
                <div className="flex items-start gap-4 flex-wrap">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0a1628] to-[#0d4f4f] flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">{b.name?.[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-bold text-[#0a1628] text-sm">{b.name}</span>
                      {b.verified && <span className="text-xs px-2 py-0.5 bg-[#0d4f4f]/10 text-[#0d4f4f] rounded-full font-medium">Verified</span>}
                      <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{b.subscription_tier}</span>
                    </div>
                    <p className="text-gray-400 text-xs">{b.country} · {b.category} · {b.email || "No email"}</p>
                    <p className="text-gray-400 text-xs mt-0.5">Submitted {new Date(b.created_date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {b.status === "pending" && (
                      <>
                        <button onClick={() => updateStatus(b, "approved")}
                          className="flex items-center gap-1 text-xs bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-xl hover:bg-green-100">
                          <CheckCircle className="w-3 h-3" /> Approve
                        </button>
                        <button onClick={() => updateStatus(b, "rejected")}
                          className="flex items-center gap-1 text-xs bg-red-50 text-red-700 border border-red-200 px-3 py-1.5 rounded-xl hover:bg-red-100">
                          <XCircle className="w-3 h-3" /> Reject
                        </button>
                      </>
                    )}
                    <button onClick={() => toggleVerified(b)}
                      className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl border transition-all ${b.verified ? "bg-[#0d4f4f]/10 text-[#0d4f4f] border-[#0d4f4f]/20" : "bg-gray-50 text-gray-600 border-gray-200"}`}>
                      <Shield className="w-3 h-3" /> {b.verified ? "Unverify" : "Verify"}
                    </button>
                    <button onClick={() => setEditingBusiness(b)}
                      className="flex items-center gap-1 text-xs bg-gray-50 text-gray-600 border border-gray-200 px-3 py-1.5 rounded-xl hover:border-[#0d4f4f] hover:text-[#0d4f4f]">
                      <Edit className="w-3 h-3" /> Edit
                    </button>
                    <Link href={createPageUrl("BusinessProfile") + `?handle=${b.business_handle || b.id}`}
                      className="flex items-center gap-1 text-xs text-[#0d4f4f] px-2 py-1.5 rounded-xl hover:bg-[#0d4f4f]/5">
                      <Eye className="w-3.5 h-3.5" />
                    </Link>
                    <button onClick={() => deleteBusiness(b.id)}
                      className="flex items-center gap-1 text-xs bg-red-50 text-red-500 border border-red-100 px-3 py-1.5 rounded-xl hover:bg-red-100">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingBusiness && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setEditingBusiness(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-[#0a1628]">Edit: {editingBusiness.name}</h3>
              <button onClick={() => setEditingBusiness(null)} className="text-gray-400 text-xl">×</button>
            </div>
            <div className="p-6 space-y-4">
              {/* Business Identity */}
              <h4 className="font-semibold text-[#0a1628] text-sm mt-4">Business Identity</h4>
              {[["name","Business Name"],["handle","Registry Handle"]].map(([k,l]) => (
                <div key={k}>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{l}</label>
                  <input value={editingBusiness[k]||""} onChange={e => setEditingBusiness(p => ({...p,[k]:e.target.value}))} placeholder={k === "handle" ? "tala-pacific-consulting" : ""} className={inputCls} />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Country</label>
                <select value={editingBusiness.country||""} onChange={e => setEditingBusiness(p => ({...p, country: e.target.value}))} className={inputCls}>
                  <option value="">Select country</option>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">City</label>
                <input value={editingBusiness.city||""} onChange={e => setEditingBusiness(p => ({...p,city:e.target.value}))} placeholder="e.g. Auckland" className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Industry Category</label>
                <select value={editingBusiness.category||""} onChange={e => setEditingBusiness(p => ({...p, category: e.target.value}))} className={inputCls}>
                  <option value="">Select category</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              
              {/* Contact & Media */}
              <h4 className="font-semibold text-[#0a1628] text-sm mt-4">Contact & Media</h4>
              {[["email","Email"],["website","Website"],["phone","Phone"],["instagram","Instagram"],["facebook","Facebook"],["tiktok","TikTok"],["linkedin","LinkedIn"]].map(([k,l]) => (
                <div key={k}>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{l}</label>
                  <input value={editingBusiness[k]||""} onChange={e => setEditingBusiness(p => ({...p,[k]:e.target.value}))} className={inputCls} />
                </div>
              ))}
              
              {/* Description */}
              <h4 className="font-semibold text-[#0a1628] text-sm mt-4">Description</h4>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Tagline</label>
                <input maxLength={160} value={editingBusiness.short_description||""} onChange={e => setEditingBusiness(p => ({...p,short_description:e.target.value}))} placeholder="One-line description" className={inputCls} />
                <p className="text-xs text-gray-400 mt-1">{(editingBusiness.short_description||"").length}/160</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Description</label>
                <textarea value={editingBusiness.description||""} onChange={e => setEditingBusiness(p => ({...p,description:e.target.value}))} rows={4} className={`${inputCls} resize-none`} />
              </div>
              
              {/* Pacific Identity */}
              <h4 className="font-semibold text-[#0a1628] text-sm mt-4">Pacific Identity</h4>
              <div>
                <CulturalIdentitySelect
                  value={editingBusiness.cultural_identity || ""}
                  onChange={(value) => setEditingBusiness(p => ({ ...p, cultural_identity: value }))}
                />
              </div>
              
              {/* Status & Tier */}
              <h4 className="font-semibold text-[#0a1628] text-sm mt-4">Status & Tier</h4>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Tier</label>
                <select value={editingBusiness.tier||"free"} onChange={e => setEditingBusiness(p => ({...p, tier: e.target.value}))} className={inputCls}>
                  <option value="free">Free</option>
                  <option value="verified">Verified</option>
                  <option value="featured_plus">Featured+</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Status</label>
                <select value={editingBusiness.status||"pending"} onChange={e => setEditingBusiness(p => ({...p, status: e.target.value}))} className={inputCls}>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex gap-3">
              <button onClick={() => setEditingBusiness(null)} className="flex-1 border border-gray-200 text-gray-600 font-medium py-2.5 rounded-xl text-sm">Cancel</button>
              <button onClick={saveBusiness} disabled={savingEdit} className="flex-1 bg-[#0d4f4f] text-white font-bold py-2.5 rounded-xl text-sm disabled:opacity-50">
                 {savingEdit ? "Saving..." : "Save Changes"}
               </button>
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
                  <DetailedBusinessForm onSubmit={createBusiness} isLoading={creatingBusiness} showTierSelection={true} />
                </div>
              </div>
            </div>
          )}
          </div>
          );
          }