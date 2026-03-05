import { useState, useEffect } from "react";
import Link from "next/link";
import { createPageUrl } from "@/utils";
import { pacificMarket } from "@/lib/pacificMarketClient";
import { Building2, Plus, Edit, Star, Shield, CheckCircle, Upload, LogOut, FileText, QrCode, ChevronRight, AlertCircle, Trash2, Zap, Search, Users } from "lucide-react";
import CulturalIdentitySelect from "@/components/shared/CulturalIdentitySelect";
import HeroRegistry from "../components/shared/HeroRegistry";
import { TIER_BENEFITS, COUNTRIES, CATEGORIES, IDENTITIES } from "@/components/formConstants";
import BusinessSearch from "@/components/BusinessSearch";
import DetailedBusinessForm from "@/components/forms/DetailedBusinessForm";

export default function BusinessPortal() {
  const [user, setUser] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [claims, setClaims] = useState([]);
  const [owners, setOwners] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("my-businesses");
  const [editingBusiness, setEditingBusiness] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [claiming, setClaiming] = useState(false);
  const [showAddOwnerModal, setShowAddOwnerModal] = useState(null);
  const [newOwnerForm, setNewOwnerForm] = useState({ name: "", email: "" });
  const [addingOwner, setAddingOwner] = useState(false);

  useEffect(() => {
    pacificMarket.auth.me().then(u => {
      if (!u) { setLoading(false); return; }
      setUser(u);
      Promise.all([
        pacificMarket.entities.Business.filter({ owner_user_id: u.id }),
        pacificMarket.entities.ClaimRequest.filter({ user_id: u.id }),
        pacificMarket.entities.BusinessOwner.list(),
      ]).then(([b, c, o]) => { 
        setBusinesses(b); 
        setClaims(c);
        const ownersMap = {};
        o.forEach(owner => {
          if (!ownersMap[owner.business_id]) ownersMap[owner.business_id] = [];
          ownersMap[owner.business_id].push(owner);
        });
        setOwners(ownersMap);
        setLoading(false); 
      });
    }).catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await pacificMarket.entities.Business.update(editingBusiness.id, editingBusiness);
    setBusinesses(prev => prev.map(b => b.id === editingBusiness.id ? editingBusiness : b));
    setEditingBusiness(null);
    setSaving(false);
  };

  const handleLogoUpload = async (e, businessId) => {
    const file = e.target.files[0];
    if (!file) return;
    const { file_url } = await pacificMarket.integrations.Core.UploadFile({ file });
    await pacificMarket.entities.Business.update(businessId, { logo_url: file_url });
    setBusinesses(prev => prev.map(b => b.id === businessId ? { ...b, logo_url: file_url } : b));
    if (editingBusiness?.id === businessId) setEditingBusiness(prev => ({ ...prev, logo_url: file_url }));
  };

  const submitClaimRequest = async () => {
    if (!selectedBusiness) return;
    setClaiming(true);
    try {
      await pacificMarket.entities.ClaimRequest.create({
        business_id: selectedBusiness.id,
        user_id: user.id,
        user_email: user.email,
        business_name: selectedBusiness.name,
        status: "pending",
      });
      setClaims(prev => [...prev, { business_id: selectedBusiness.id, business_name: selectedBusiness.name, user_email: user.email, status: "pending", created_date: new Date() }]);
      setShowClaimModal(false);
      setSelectedBusiness(null);
    } catch (error) {
      // error handling
    }
    setClaiming(false);
  };

  const handleAddOwner = async (businessId) => {
    if (!newOwnerForm.name || !newOwnerForm.email) return;
    setAddingOwner(true);
    try {
      const owner = await pacificMarket.entities.BusinessOwner.create({
        business_id: businessId,
        email: newOwnerForm.email,
        name: newOwnerForm.name,
        is_primary: false,
        status: "pending",
      });

      await pacificMarket.functions.invoke('owner-invite', {
        ownerEmail: newOwnerForm.email,
        ownerName: newOwnerForm.name,
        businessName: businesses.find(b => b.id === businessId)?.name,
        businessId: businessId,
      });

      setOwners(prev => ({
        ...prev,
        [businessId]: [...(prev[businessId] || []), owner],
      }));
      setShowAddOwnerModal(null);
      setNewOwnerForm({ name: "", email: "" });
    } catch (error) {
      // error handling
    }
    setAddingOwner(false);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#0d4f4f] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  // Temporarily removed auth check for testing
  // if (!user) {
  //   return (
  //     <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center">
  //       <div className="text-center bg-white border border-gray-100 rounded-2xl p-12 max-w-sm">
  //         <AlertCircle className="w-10 h-10 text-orange-400 mx-auto mb-4" />
  //         <h2 className="text-xl font-bold text-[#0a1628] mb-2">Sign In Required</h2>
  //         <p className="text-gray-500 mb-6">Please sign in to access the Business Owner Portal.</p>
  //         <Link href={createPageUrl("Login")} className="inline-flex items-center gap-2 bg-[#0a1628] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#122040]">
  //           Sign In <ArrowRight className="w-4 h-4" />
  //         </Link>
  //       </div>
  //     </div>
  //   );
  // }

  const tierInfo = {
    free: { label: "Free", color: "text-gray-500 bg-gray-100" },
    verified: { label: "Verified", color: "text-[#0d4f4f] bg-[#0d4f4f]/10", icon: Shield },
    featured_plus: { label: "Featured+", color: "text-[#c9a84c] bg-[#c9a84c]/10", icon: Star },
  };

  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0d4f4f] bg-white";

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      {/* Header */}
      <HeroRegistry
        badge="Business Owner Portal"
        title={`Welcome, ${user?.full_name?.split(" ")[0] || "Owner"}`}
        subtitle={user?.email}
        description=""
        actions={null}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-gray-100 rounded-2xl p-1 mb-8 overflow-x-auto scrollbar-hide">
          {[
            { id: "my-businesses", label: "My Businesses", icon: Building2 },
            { id: "claims", label: "Claim Requests", icon: CheckCircle },
            { id: "tools", label: "Business Tools", icon: FileText },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex-shrink-0 ${
                activeTab === tab.id ? "bg-[#0a1628] text-white" : "text-gray-500 hover:text-[#0a1628]"
              }`}>
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* My Businesses */}
        {activeTab === "my-businesses" && (
          <div>
            <div className="flex items-center justify-between mb-5 gap-2 flex-wrap">
              <h2 className="font-bold text-[#0a1628]">My Registry Records</h2>
              <div className="flex gap-2">
                <button onClick={() => setShowClaimModal(true)}
                  className="flex items-center gap-2 bg-white border border-gray-200 hover:border-[#0d4f4f] text-[#0d4f4f] text-sm font-semibold px-4 py-2 rounded-xl transition-all">
                  <Search className="w-4 h-4" /> Claim Business
                </button>
                <Link href={createPageUrl("ApplyListing")}
                  className="flex items-center gap-2 bg-[#0d4f4f] hover:bg-[#1a6b6b] text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all">
                  <Plus className="w-4 h-4" /> Add Business
                </Link>
              </div>
            </div>

             {/* Upgrade Banner */}
             {businesses.length > 0 && !businesses.some(b => b.tier !== "free") && (
               <div className="mb-6 bg-gradient-to-r from-[#0d4f4f]/10 to-[#c9a84c]/10 border border-[#0d4f4f]/20 rounded-2xl p-5">
                 <div className="flex items-start gap-4">
                   <div className="w-12 h-12 rounded-xl bg-[#0d4f4f]/20 flex items-center justify-center flex-shrink-0">
                     <Zap className="w-6 h-6 text-[#0d4f4f]" />
                   </div>
                   <div className="flex-1 min-w-0">
                     <h3 className="font-bold text-[#0a1628] mb-1">Unlock More with Verified or Featured+</h3>
                     <p className="text-gray-600 text-sm mb-3">Boost your visibility and access premium features.</p>
                     <div className="grid sm:grid-cols-2 gap-3 mb-3">
                       <div>
                         <div className="text-xs font-bold text-[#0d4f4f] mb-1">Verified ${TIER_BENEFITS.verified.price.split("/")[0].slice(1)}/mo</div>
                         <ul className="text-xs text-gray-600 space-y-0.5">
                           <li>✓ Verified badge</li>
                           <li>✓ Logo & banner images</li>
                           <li>✓ Enhanced profile</li>
                         </ul>
                       </div>
                       <div>
                         <div className="text-xs font-bold text-[#c9a84c] mb-1">Featured+ ${TIER_BENEFITS.featured_plus.price.split("/")[0].slice(1)}/mo</div>
                         <ul className="text-xs text-gray-600 space-y-0.5">
                           <li>✓ Everything in Verified</li>
                           <li>✓ Featured placement</li>
                           <li>✓ Business tools</li>
                         </ul>
                       </div>
                     </div>
                     <Link href={createPageUrl("Pricing")} className="inline-flex items-center gap-2 bg-[#0d4f4f] hover:bg-[#1a6b6b] text-white text-xs font-bold px-4 py-2 rounded-lg transition-all">
                       View Plans <ChevronRight className="w-3 h-3" />
                     </Link>
                   </div>
                 </div>
               </div>
             )}
            {businesses.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
                <Building2 className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-500 mb-2">Manage Your Business</h3>
                <p className="text-gray-400 text-sm mb-6">Choose how you'd like to get started with your business listing.</p>
                
                <div className="max-w-md mx-auto space-y-3">
                  <button
                    onClick={() => setShowClaimModal(true)}
                    className="w-full bg-[#0d4f4f] hover:bg-[#1a6b6b] text-white font-semibold px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Shield className="w-5 h-5" />
                    Claim Existing Business
                  </button>
                  
                  <div className="text-center text-gray-400 text-sm">or</div>
                  
                  <Link 
                    href={createPageUrl("ApplyListing")} 
                    className="w-full bg-white border-2 border-[#0d4f4f] text-[#0d4f4f] hover:bg-[#0d4f4f] hover:text-white font-semibold px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Submit New Business
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {businesses.map(b => (
                  <div key={b.id} className="bg-white border border-gray-100 rounded-2xl p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0a1628] to-[#0d4f4f] flex items-center justify-center flex-shrink-0 overflow-hidden cursor-pointer relative group">
                        {b.logo_url ? <img src={b.logo_url} alt="" className="w-full h-full object-cover" /> : <img src="/pm_logo.png" alt="Pacific Market" className="w-full h-full object-cover" />}
                        <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                          <Upload className="w-4 h-4 text-white" />
                          <input type="file" accept="image/*" className="hidden" onChange={e => handleLogoUpload(e, b.id)} />
                        </label>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-bold text-[#0a1628]">{b.name}</span>
                          {b.verified && <CheckCircle className="w-4 h-4 text-[#00c4cc]" />}
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tierInfo[b.tier]?.color || "text-gray-500 bg-gray-100"}`}>{tierInfo[b.tier]?.label}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${b.status === "approved" ? "bg-green-100 text-green-700" : b.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>{b.status}</span>
                        </div>
                        <p className="text-gray-400 text-xs">{b.city ? `${b.city}, ` : ""}{b.country} · {b.category}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setEditingBusiness(b)}
                          className="flex items-center gap-1 text-xs border border-gray-200 px-3 py-2 rounded-xl hover:border-[#0d4f4f] hover:text-[#0d4f4f] transition-all">
                          <Edit className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button onClick={() => setShowAddOwnerModal(b.id)}
                          className="flex items-center gap-1 text-xs border border-gray-200 px-3 py-2 rounded-xl hover:border-[#0d4f4f] hover:text-[#0d4f4f] transition-all">
                          <Users className="w-3.5 h-3.5" /> Owners
                        </button>
                        <Link href={createPageUrl("BusinessProfile") + `?handle=${b.shop_handle || b.id}`}
                          className="flex items-center gap-1 text-xs text-[#0d4f4f] px-3 py-2 rounded-xl hover:bg-[#0d4f4f]/5 transition-all">
                          View <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                      </div>

                      {owners[b.id]?.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-50">
                        <p className="text-xs text-gray-500 font-semibold mb-2">Business Owners</p>
                        <div className="space-y-1.5">
                          {owners[b.id].map(o => (
                            <div key={o.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                              <div className="text-xs">
                                <p className="font-medium text-[#0a1628]">{o.name}</p>
                                <p className="text-gray-500">{o.email}</p>
                              </div>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                o.status === "active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                              }`}>{o.status}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      )}

                      {b.tier === "free" && (
                      <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                        <span className="text-xs text-gray-400">Upgrade to unlock logo, full profile, and verified badge</span>
                        <Link href={createPageUrl("Pricing")} className="text-xs font-semibold text-[#c9a84c] hover:underline flex items-center gap-1">
                          Upgrade <ChevronRight className="w-3 h-3" />
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Claim Requests */}
        {activeTab === "claims" && (
          <div>
            <h2 className="font-bold text-[#0a1628] mb-5">Claim Requests</h2>
            {claims.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
                <CheckCircle className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-500 mb-2">No claim requests</h3>
                <p className="text-gray-400 text-sm">When you claim a business, it will appear here for tracking.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {claims.map(c => (
                  <div key={c.id} className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-[#0a1628] text-sm">{c.business_name || c.business_id}</span>
                      <p className="text-gray-400 text-xs mt-0.5">Submitted {new Date(c.created_date).toLocaleDateString()}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                      c.status === "approved" ? "bg-green-100 text-green-700"
                      : c.status === "denied" ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                    }`}>{c.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tools */}
        {activeTab === "tools" && (
          <div>
            <h2 className="font-bold text-[#0a1628] mb-2">Business Tools</h2>
            <p className="text-gray-400 text-sm mb-6">Available to Featured+ subscribers.</p>
            {businesses.some(b => b.tier === "featured_plus") ? (
              <div className="grid sm:grid-cols-2 gap-5">
                <Link href={createPageUrl("InvoiceGenerator")}
                  className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:border-[#0d4f4f]/30 transition-all group">
                  <FileText className="w-8 h-8 text-[#0d4f4f] mb-4" />
                  <h3 className="font-bold text-[#0a1628] mb-2">Invoice Generator</h3>
                  <p className="text-gray-400 text-sm mb-4">Create professional invoices with your Pacific business branding.</p>
                  <span className="text-sm font-semibold text-[#0d4f4f] group-hover:gap-2 flex items-center gap-1">Open Tool <ChevronRight className="w-4 h-4" /></span>
                </Link>
                <Link href={createPageUrl("QRCodeGenerator")}
                  className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:border-[#0d4f4f]/30 transition-all group">
                  <QrCode className="w-8 h-8 text-[#0d4f4f] mb-4" />
                  <h3 className="font-bold text-[#0a1628] mb-2">QR Code Generator</h3>
                  <p className="text-gray-400 text-sm mb-4">Generate QR codes linking to your registry profile or custom URL.</p>
                  <span className="text-sm font-semibold text-[#0d4f4f] group-hover:gap-2 flex items-center gap-1">Open Tool <ChevronRight className="w-4 h-4" /></span>
                </Link>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-[#c9a84c]/10 to-[#c9a84c]/5 border border-[#c9a84c]/30 rounded-2xl p-8 text-center">
                <Star className="w-10 h-10 text-[#c9a84c] mx-auto mb-4" />
                <h3 className="font-bold text-[#0a1628] mb-2">Featured+ Required</h3>
                <p className="text-gray-500 text-sm mb-5">Upgrade at least one business to Featured+ to unlock the Invoice and QR Code generators.</p>
                <Link href={createPageUrl("Pricing")} className="inline-flex items-center gap-2 bg-[#c9a84c] hover:bg-[#b8973b] text-white font-bold px-6 py-3 rounded-xl text-sm transition-all">
                  View Plans <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Claim Business Modal */}
      {showClaimModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => { setShowClaimModal(false); setSelectedBusiness(null); }} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-[#0a1628]">Claim Another Business</h3>
              <button onClick={() => { setShowClaimModal(false); setSelectedBusiness(null); }} className="text-gray-400 hover:text-gray-600">×</button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 text-sm mb-4">Search for a business by name to claim ownership.</p>
              <BusinessSearch 
                onSelect={setSelectedBusiness}
                onError={() => {}}
                placeholder="e.g. Tala Pacific Consulting"
              />
            </div>
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex gap-3">
              <button onClick={() => { setShowClaimModal(false); setSelectedBusiness(null); }} 
                className="flex-1 border border-gray-200 text-gray-600 font-medium py-2.5 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
              {selectedBusiness && (
                <button onClick={submitClaimRequest} disabled={claiming} className="flex-1 bg-green-600 text-white font-bold py-2.5 rounded-xl text-sm hover:bg-green-700 disabled:opacity-50">
                  {claiming ? "Submitting..." : "Request Claim"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Owner Modal */}
      {showAddOwnerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddOwnerModal(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-[#0a1628]">Add Business Owner</h3>
              <button onClick={() => setShowAddOwnerModal(null)} className="text-gray-400 hover:text-gray-600">×</button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-gray-600 text-sm">Add another person to manage this business. They'll receive an invite to claim access.</p>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Full Name</label>
                <input value={newOwnerForm.name} onChange={e => setNewOwnerForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. John Smith" className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Email</label>
                <input value={newOwnerForm.email} onChange={e => setNewOwnerForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="john@example.com" type="email" className={inputCls} />
              </div>
              {owners[showAddOwnerModal]?.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-900"><strong>Current Owners:</strong> {owners[showAddOwnerModal].map(o => o.name).join(", ")}</p>
                </div>
              )}
            </div>
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex gap-3">
              <button onClick={() => setShowAddOwnerModal(null)} className="flex-1 border border-gray-200 text-gray-600 font-medium py-2.5 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
              <button onClick={() => handleAddOwner(showAddOwnerModal)} disabled={addingOwner || !newOwnerForm.name || !newOwnerForm.email} 
                className="flex-1 bg-[#0d4f4f] text-white font-bold py-2.5 rounded-xl text-sm hover:bg-[#1a6b6b] disabled:opacity-50">
                {addingOwner ? "Sending..." : "Add Owner"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
       {editingBusiness && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/50" onClick={() => setEditingBusiness(null)} />
           <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
             <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
               <h3 className="font-bold text-[#0a1628]">Edit Listing</h3>
               <button onClick={() => setEditingBusiness(null)} className="text-gray-400 hover:text-gray-600">×</button>
             </div>
             <div className="p-6">
               <DetailedBusinessForm 
                 initialData={editingBusiness}
                 onSubmit={handleSave}
                 isLoading={saving}
                 excludeFields={["handle", "languages"]}
               />
             </div>
             <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex gap-3">
               <button onClick={() => setEditingBusiness(null)} className="flex-1 border border-gray-200 text-gray-600 font-medium py-2.5 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
               <button onClick={handleSave} disabled={saving} className="flex-1 bg-[#0d4f4f] text-white font-bold py-2.5 rounded-xl text-sm hover:bg-[#1a6b6b] disabled:opacity-50">
                 {saving ? "Saving..." : "Save Changes"}
               </button>
             </div>
           </div>
         </div>
       )}
    </div>
  );
}