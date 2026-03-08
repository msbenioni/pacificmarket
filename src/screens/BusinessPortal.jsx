import { useState, useEffect } from "react";
import Link from "next/link";
import { createPageUrl } from "@/utils";
import { getSupabase } from "@/lib/supabase/client";
import { Building2, Plus, Edit, Star, Shield, CheckCircle, Upload, FileText, QrCode, ChevronRight, AlertCircle, Trash2, Zap, Search, Users } from "lucide-react";
import { canAccessBusinessFeatures } from "@/utils/roleHelpers";
import HeroRegistry from "../components/shared/HeroRegistry";
import { TIER_BENEFITS } from "@/constants/businessProfile";
import { BUSINESS_TIER, BUSINESS_STATUS, getTierDisplayName, COUNTRIES, INDUSTRIES } from "@/constants/unifiedConstants";
import DetailedBusinessForm, { FORM_MODES } from "@/components/forms/DetailedBusinessForm";
import FounderInsightsAccordion from "@/components/forms/FounderInsightsAccordion";
import { useOnboardingStatus } from "@/hooks/useOnboardingStatus";
import { ClaimAddBusinessModal } from "@/components/onboarding/ClaimAddBusinessModal";
import CancelClaimButton from "@/components/claims/CancelClaimButton";
import { ProfileSetupModal } from "@/components/onboarding/ProfileSetupModal";
import { ModalWrapper, ModalHeader, ModalContent, ModalFooter, MODAL_SIZES } from "@/components/shared/ModalWrapper";
import { getBusinessOwner, getBusinessOwnerName } from "@/utils/businessHelpers";
import PortalShell from "@/components/portal/PortalShell";
import { portalUI } from "@/components/portal/portalUI";
import PortalBusinessCard from "@/components/portal/PortalBusinessCard";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";
import { useToast } from "@/components/ui/toast/ToastProvider";

export default function BusinessPortal() {
  const [user, setUser] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [claims, setClaims] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [insightSnapshots, setInsightSnapshots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("my-businesses");
  const [deleteConfirmBusiness, setDeleteConfirmBusiness] = useState(null);
  const [showAddOwnerModal, setShowAddOwnerModal] = useState(null);
  const [addingOwner, setAddingOwner] = useState(false);
  const [newOwnerForm, setNewOwnerForm] = useState({ name: "", email: "" });
  const [showClaimAddModal, setShowClaimAddModal] = useState(false);
  const [claimAddDefaultView, setClaimAddDefaultView] = useState("claim");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [insightsSubmitting, setInsightsSubmitting] = useState(false);
  const [insightsStarted, setInsightsStarted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState(null);

  const { createCheckoutSession, loading: checkoutLoading } = useStripeCheckout();
  const { toast } = useToast();

  // Helper functions to format database values to readable labels
  const getCountryLabel = (countryValue) => {
    const country = COUNTRIES.find(c => c.value === countryValue);
    return country ? country.label : countryValue;
  };

  const getIndustryLabel = (industryValue) => {
    const industry = INDUSTRIES.find(i => i.value === industryValue);
    return industry ? industry.label : industryValue;
  };

  // Onboarding state
  const {
    onboardingStatus,
    loading: onboardingLoading,
    refetch: refetchOnboardingStatus,
  } = useOnboardingStatus();

  const refetchPortalData = async (u = user) => {
    if (!u?.id) return;

    try {
      const supabase = getSupabase();

      const [businessesResult, claimsResult, profilesResult] = await Promise.all([
        supabase
          .from('businesses')
          .select('*')
          .eq('owner_user_id', u.id),
        supabase
          .from('claim_requests')
          .select('*')
          .eq('user_id', u.id),
        supabase
          .from("profiles")
          .select("*"),
      ]);

      const businesses = businessesResult.data || [];
      const claims = claimsResult.data || [];
      const profiles = profilesResult.data || [];

      setBusinesses(businesses);
      setClaims(claims);
      setProfiles(profiles);

      // Fetch general founder insights for this user
      let snapshots = [];
      const { data: snapshotData, error: snapshotError } = await supabase
        .from("business_insights_snapshots")
        .select("*")
        .eq("user_id", u.id)
        .order("submitted_date", { ascending: false });

      if (snapshotError) {
        console.error("Error fetching founder insights snapshots:", snapshotError);
      } else {
        snapshots = snapshotData || [];
      }

      setInsightSnapshots(snapshots);
    } catch (e) {
      console.error("Refetch portal data error:", e);
    }
  };

  useEffect(() => {
    const loadPortalData = async () => {
      try {
        const supabase = getSupabase();
        
        // Get current user with profile data
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          setLoading(false);
          return;
        }

        // Get user profile for role and display info
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
        await refetchPortalData(enhancedUser);
        setLoading(false);
      } catch (error) {
        console.error("Error loading portal data:", error);
        setLoading(false);
      }
    };

    loadPortalData();
  }, []);

  const handleSave = async (formData) => {
    setSaving(true);
    try {
      const supabase = getSupabase();
      
      // Filter out potentially problematic fields
      const { id, ...updateData } = formData;
      const safeUpdateData = Object.keys(updateData).reduce((acc, key) => {
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
      
      setBusinesses(prev => prev.map(b => b.id === formData.id ? { ...b, ...safeUpdateData } : b));
      setEditingBusiness(null);
      toast({
        title: "Business Updated",
        description: "Your changes were saved successfully.",
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
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e, businessId) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      const supabase = getSupabase();
      
      // Upload file to Supabase storage
      const bucket = "admin-listings";
      const folder = "logos";
      const filePath = `${folder}/${Date.now()}-${file.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);
      
      const file_url = data.publicUrl;
      
      // Update business with new logo URL
      const { error: updateError } = await supabase
        .from('businesses')
        .update({ logo_url: file_url })
        .eq('id', businessId);
      
      if (updateError) throw updateError;
      
      setBusinesses(prev => prev.map(b => b.id === businessId ? { ...b, logo_url: file_url } : b));
      if (editingBusiness?.id === businessId) {
        setEditingBusiness(prev => ({ ...prev, logo_url: file_url }));
      }
      
      toast({
        title: "Logo Updated",
        description: "Business logo has been successfully updated.",
        variant: "success"
      });
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload logo. Please try again.",
        variant: "error"
      });
    }
  };

  const handleDeleteBusiness = (businessId) => {
    setDeleteConfirmBusiness(businessId);
  };

  const handleAddOwner = async (businessId) => {
    if (!newOwnerForm.name || !newOwnerForm.email) {
      toast({
        title: "Validation Error",
        description: "Please fill in both name and email fields",
        variant: "error"
      });
      return;
    }
    
    setAddingOwner(true);
    try {
      // Check if profile already exists
      const supabase = getSupabase();
      
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', newOwnerForm.email.toLowerCase().trim())
        .single();

      if (existingProfile) {
        // Profile exists, check if they already have access to this business
        const { data: existingBusiness } = await supabase
          .from('businesses')
          .select('*')
          .eq('id', businessId)
          .eq('owner_user_id', existingProfile.id)
          .single();

        if (existingBusiness) {
          toast({
            title: "Duplicate Owner",
            description: "This person already manages this business.",
            variant: "error"
          });
          return;
        }

        // Create a pending ownership record in profiles
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            pending_business_id: businessId,
            pending_business_name: businesses.find(b => b.id === businessId)?.name,
            invited_by: user?.id,
            invited_date: new Date().toISOString(),
          })
          .eq('id', existingProfile.id);

        if (updateError) throw updateError;
      } else {
        // Create a pending profile record
        const { error: createError } = await supabase
          .from('profiles')
          .insert({
            email: newOwnerForm.email.toLowerCase().trim(),
            display_name: newOwnerForm.name.trim(),
            pending_business_id: businessId,
            pending_business_name: businesses.find(b => b.id === businessId)?.name,
            invited_by: user?.id,
            invited_date: new Date().toISOString(),
            status: 'pending_invitation',
          });

        if (createError) throw createError;
      }

      // Send invitation email
      const emailResponse = await fetch('/api/emails/owner-invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ownerEmail: newOwnerForm.email.toLowerCase().trim(),
          ownerName: newOwnerForm.name.trim(),
          businessName: businesses.find(b => b.id === businessId)?.name,
          businessId: businessId,
        }),
      });

      if (!emailResponse.ok) {
        console.error('Failed to send invitation email');
        // Don't throw error - the invitation was created, just email failed
      }

      // Show success message
      toast({
        title: "Invitation Sent",
        description: `Invitation sent to ${newOwnerForm.email}. They will receive an email to accept the invitation.`,
        variant: "success"
      });
      
      // Close modal and reset form
      setShowAddOwnerModal(null);
      setNewOwnerForm({ name: "", email: "" });
      
      // Refresh business data
      await refetchPortalData();
      
    } catch (error) {
      console.error('Error adding owner:', error);
      toast({
        title: "Invitation Failed",
        description: "Failed to send invitation. Please try again.",
        variant: "error"
      });
    } finally {
      setAddingOwner(false);
    }
  };

  const confirmDeleteBusiness = async () => {
    if (!deleteConfirmBusiness) return;
    
    try {
      const supabase = getSupabase();
      const { error } = await supabase
        .from('businesses')
        .delete()
        .eq('id', deleteConfirmBusiness);
      
      if (error) throw error;
      
      setBusinesses(prev => prev.filter(b => b.id !== deleteConfirmBusiness));
      toast({
        title: "Business Deleted",
        description: "The business has been successfully deleted.",
        variant: "success"
      });
      setDeleteConfirmBusiness(null);
    } catch (error) {
      console.error("Error deleting business:", error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete business. Please try again.",
        variant: "error"
      });
    }
  };

  const handleFounderInsightsSubmit = async (insightsData) => {
    setInsightsSubmitting(true);
    try {
      const supabase = getSupabase();

      const existing = insightSnapshots.find(
        (snapshot) =>
          snapshot.user_id === insightsData.user_id &&
          snapshot.business_id === (insightsData.business_id ?? null)
      );

      let result;

      if (existing?.id) {
        result = await supabase
          .from("business_insights_snapshots")
          .update({
            ...insightsData,
            updated_date: new Date().toISOString(),
          })
          .eq("id", existing.id)
          .eq("user_id", insightsData.user_id)
          .select();
      } else {
        result = await supabase
          .from("business_insights_snapshots")
          .insert({
            ...insightsData,
            submitted_date: new Date().toISOString(),
          })
          .select();
      }

      const { error } = result;
      if (error) throw error;

      await refetchPortalData();

      toast({
        title: "Saved",
        description: "Your founder insights were saved successfully.",
        variant: "success",
      });
    } catch (error) {
      console.error("Error submitting insights:", error);
      toast({
        title: "Save Failed",
        description: `Failed to save insights: ${error.message || "Unknown error"}`,
        variant: "error",
      });
    } finally {
      setInsightsSubmitting(false);
    }
  };

  const handleUpgradeClick = async (tier) => {
    if (loading) return;
    if (!user) {
      window.location.href = createPageUrl("Login");
      return;
    }
    
    await createCheckoutSession({ tier });
  };

  if (loading) return (
    <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#0d4f4f] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user || !canAccessBusinessFeatures(user)) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center">
        <div className="text-center bg-white border border-gray-100 rounded-2xl p-12 max-w-sm">
          <AlertCircle className="w-10 h-10 text-orange-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#0a1628] mb-2">Access Required</h2>
          <p className="text-gray-500 mb-6">Business owner or admin access required to view this portal.</p>
          <Link href={createPageUrl("BusinessLogin")} className="inline-flex items-center gap-2 bg-[#0a1628] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#122040]">
            Sign In <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const tierInfo = {
    [BUSINESS_TIER.VAKA]: { label: getTierDisplayName(BUSINESS_TIER.VAKA), color: "text-gray-500 bg-gray-100" },
    [BUSINESS_TIER.MANA]: { label: getTierDisplayName(BUSINESS_TIER.MANA), color: "text-[#0d4f4f] bg-[#0d4f4f]/10", icon: Shield },
    [BUSINESS_TIER.MOANA]: { label: getTierDisplayName(BUSINESS_TIER.MOANA), color: "text-[#c9a84c] bg-[#c9a84c]/10", icon: Star },
  };


const disabledActionCls =
  "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold border border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed min-h-[44px] w-full sm:w-auto";

const secondaryActionCls =
  "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold border border-gray-200 bg-white text-[#0d4f4f] hover:border-[#0d4f4f] transition min-h-[44px] w-full sm:w-auto";

const primaryActionCls =
  "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold bg-[#0d4f4f] text-white hover:bg-[#1a6b6b] transition shadow-[0_12px_30px_rgba(13,79,79,0.35)] min-h-[44px] w-full sm:w-auto";
  return (
    <PortalShell>
      <HeroRegistry
        badge="Business Owner Portal"
        title={`Welcome back, ${user?.full_name?.split(" ")[0] || "Owner"}`}
        subtitle={user?.email}
        description=""
        actions={null}
        compact
      />

      <div className={portalUI.wrap}>
        <div className={portalUI.shell}>
          {/* Tabs */}
          <div className={portalUI.tabsWrap}>
            {[
              { id: "my-businesses", label: "My Businesses", mobileLabel: "Businesses", icon: Building2, count: businesses.length },
              { id: "claims", label: "Claim Requests", mobileLabel: "Claims", icon: CheckCircle, count: claims.length },
              { id: "insights", label: "Founder Insights", mobileLabel: "Insights", icon: Users, status: insightSnapshots.length > 0 ? "completed" : insightsStarted ? "started" : "not-started" },
              { id: "tools", label: "Business Tools", mobileLabel: "Tools", icon: FileText },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={portalUI.tabBtn(activeTab === tab.id)}
              >
                <tab.icon className="w-4 h-4" />
                <span className="sm:hidden">{tab.mobileLabel || tab.label}</span>
                <span className="hidden sm:inline">{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-gray-100 text-gray-600 hidden md:inline-flex">
                    {tab.count}
                  </span>
                )}
                {tab.status === "completed" && (
                  <CheckCircle className="w-4 h-4 ml-2 text-green-600 hidden md:inline-flex" />
                )}
                {tab.status === "started" && (
                  <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded-full border border-blue-300 bg-blue-50 text-blue-600 hidden md:inline-flex">
                    started
                  </span>
                )}
                {tab.status === "not-started" && (
                  <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded-full border border-gray-300 text-gray-500 hidden md:inline-flex">
                    not started
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* My Businesses */}
          {activeTab === "my-businesses" && (
            <div className="space-y-6">
              {/* Section header */}
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className={portalUI.sectionKicker}>
                    Business Management
                  </p>
                  <h2 className={portalUI.sectionTitle}>
                    My Registry Records
                  </h2>
                  <p className={portalUI.sectionDesc}>
                    Claim an existing business or add your own listing once your profile is set up.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      if (!onboardingStatus.needsProfile) {
                        setClaimAddDefaultView("claim");
                        setShowClaimAddModal(true);
                      }
                    }}
                    disabled={onboardingLoading || onboardingStatus.needsProfile}
                    className={onboardingStatus.needsProfile ? disabledActionCls : secondaryActionCls + " min-h-[44px] w-full sm:w-auto"}
                  >
                    <Search className="w-4 h-4" />
                    Claim Business
                  </button>

                  <button
                    onClick={() => {
                      if (!onboardingStatus.needsProfile) {
                        setClaimAddDefaultView("add");
                        setShowClaimAddModal(true);
                      }
                    }}
                    disabled={onboardingLoading || onboardingStatus.needsProfile}
                    className={onboardingStatus.needsProfile ? disabledActionCls : primaryActionCls}
                  >
                    <Plus className="w-4 h-4" />
                    Add Business
                  </button>

                  {!onboardingLoading && onboardingStatus.needsProfile && (
                    <button
                      onClick={() => setShowProfileModal(true)}
                      className={secondaryActionCls}
                    >
                      <Users className="w-4 h-4" />
                      Complete Profile
                    </button>
                  )}
                </div>
              </div>

              {/* Upgrade Banner */}
              {businesses.length > 0 && !businesses.some((b) => b.subscription_tier !== BUSINESS_TIER.VAKA) && (
                <div className="rounded-[28px] border border-[#00c4cc]/20 bg-gradient-to-r from-[#00c4cc]/10 via-white to-[#c9a84c]/10 p-6 shadow-[0_18px_50px_rgba(10,22,40,0.08)]">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border border-[#c9a84c]/20 bg-[#c9a84c]/12">
                        <Zap className="w-6 h-6 text-[#f2d98b]" />
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c9a84c]">
                          Growth Opportunity
                        </p>
                        <h3 className="mt-1 text-lg font-bold text-[#0a1628]">
                          Unlock more with Mana or Moana
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          Increase trust, showcase your visual identity, and unlock practical business tools designed to help Pacific businesses stand out.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleUpgradeClick(BUSINESS_TIER.MANA)}
                    disabled={checkoutLoading}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#c9a84c] px-5 py-3 text-sm font-bold text-[#0a1628] hover:bg-[#d8b865] transition disabled:opacity-50"
                  >
                    {checkoutLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-[#0a1628]/30 border-t-[#0a1628] rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        {user ? "Upgrade Now" : "Sign Up to Upgrade"}
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-gray-200 bg-white/90 p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#00c4cc]">
                        Mana
                      </p>
                      <p className="mt-1 text-sm font-semibold text-[#0a1628]">
                        ${TIER_BENEFITS[BUSINESS_TIER.MANA].price.split("/")[0].slice(1)}/mo
                      </p>
                      <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
                        <li>• Verified badge</li>
                        <li>• Logo and banner support</li>
                        <li>• Stronger profile presentation</li>
                      </ul>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white/90 p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#00c4cc]">
                        Moana
                      </p>
                      <p className="mt-1 text-sm font-semibold text-[#0a1628]">
                        ${TIER_BENEFITS[BUSINESS_TIER.MOANA].price.split("/")[0].slice(1)}/mo
                      </p>
                      <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
                        <li>• Everything in Verified</li>
                        <li>• Featured placement in registry</li>
                        <li>• Invoice and QR tools</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {businesses.length === 0 ? (
                <div className="space-y-6">
                  {onboardingStatus.needsProfile && (
                    <div className="rounded-2xl border border-[#c9a84c]/25 bg-[#c9a84c]/8 p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-[#c9a84c] mt-0.5" />
                        <div>
                          <h4 className="text-sm font-semibold text-[#0a1628]">
                            Complete your profile to get started
                          </h4>
                          <p className="mt-1 text-sm text-slate-600">
                            Once your profile is ready, you'll be able to claim a business or add a new one.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="rounded-2xl border border-dashed border-gray-200 bg-white/80 p-6 sm:p-12 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-gray-200 bg-white">
                      <Building2 className="w-7 h-7 text-gray-400" />
                    </div>

                    <h3 className="text-lg font-bold text-[#0a1628]">
                      {onboardingStatus.needsProfile ? "Start with your profile" : "No businesses yet"}
                    </h3>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
                      {onboardingStatus.needsProfile
                        ? "Your profile helps confirm ownership details before you manage business listings."
                        : "Claim an existing business or add your own listing to begin managing your presence in Pacific Market."}
                    </p>

                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                      {onboardingStatus.needsProfile ? (
                        <>
                          <button disabled className={disabledActionCls}>
                            <Search className="w-4 h-4" />
                            Claim Business
                          </button>

                          <button disabled className={disabledActionCls}>
                            <Plus className="w-4 h-4" />
                            Add Business
                          </button>

                          <button
                            onClick={() => setShowProfileModal(true)}
                            className={primaryActionCls}
                          >
                            Complete Profile
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setClaimAddDefaultView("claim");
                              setShowClaimAddModal(true);
                            }}
                            className={secondaryActionCls}
                          >
                            <Search className="w-4 h-4" />
                            Claim Business
                          </button>

                          <button
                            onClick={() => {
                              setClaimAddDefaultView("add");
                              setShowClaimAddModal(true);
                            }}
                            className={primaryActionCls}
                          >
                            <Plus className="w-4 h-4" />
                            Add Business
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
{businesses.map((b) => {
  const tierStyles =
    b.subscription_tier === BUSINESS_TIER.MOANA
      ? "bg-[#c9a84c]/14 text-[#0a1628] border border-[#c9a84c]/20"
      : b.subscription_tier === BUSINESS_TIER.MANA
      ? "bg-[#00c4cc]/12 text-[#0d4f4f] border border-[#00c4cc]/20"
      : "bg-gray-100/80 text-gray-600 border border-gray-200";

  const statusStyles =
    b.status === BUSINESS_STATUS.ACTIVE
      ? "bg-emerald-100/80 text-emerald-700 border border-emerald-200"
      : b.status === BUSINESS_STATUS.PENDING
      ? "bg-amber-100/80 text-amber-700 border border-amber-200"
      : "bg-red-100/80 text-red-700 border border-red-200";

  const owner = b.owner_user_id ? getBusinessOwner(b.owner_user_id, profiles) : null;

  const metaParts = [
    b.city ? `${b.city}, ${getCountryLabel(b.country)}` : getCountryLabel(b.country),
    getIndustryLabel(b.industry),
  ].filter(Boolean);

  return (
    <PortalBusinessCard
      key={b.id}
      business={b}
      tierLabel={b.subscription_tier ? tierInfo[b.subscription_tier]?.label : null}
      tierStyles={tierStyles}
      statusStyles={statusStyles}
      metaLine={metaParts.join(" · ")}
      ownerName={b.owner_user_id ? getBusinessOwnerName(b.owner_user_id, profiles) : null}
      ownerEmail={owner?.email || null}
      onEdit={() => setEditingBusiness(b)}
      onDelete={() => handleDeleteBusiness(b.id)}
      onAddOwner={() => setShowAddOwnerModal(b.id)}
      onLogoUpload={(e) => handleLogoUpload(e, b.id)}
      primaryActionCls={primaryActionCls}
      showUpgradePrompt={b.subscription_tier === BUSINESS_TIER.VAKA}
    />
  );
})}                </div>
              )}
            </div>
          )}

          {/* Claim Requests */}
          {activeTab === "claims" && (
            <div>
              <h2 className="font-bold text-[#0a1628] mb-5">Claim Requests</h2>
              {claims.length === 0 ? (
                <div className="bg-white/70 border border-dashed border-gray-200 rounded-2xl p-12 text-center">
                  <CheckCircle className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-600 mb-2">No claim requests</h3>
                  <p className="text-slate-500 text-sm">When you claim a business, it will appear here for tracking.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {claims.map(c => (
                    <div
  key={c.id}
  className={`${portalUI.card} flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between`}
>
                      <div className="min-w-0">
                        <p className="font-semibold text-[#0a1628] truncate">{c.business_name || c.business_id}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          Submitted {new Date(c.created_date).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold rounded-full px-3 py-1 border border-amber-200 bg-amber-50 text-amber-700">
                          {c.status}
                        </span>

                        {c.status === "pending" && (
                          <CancelClaimButton
                            claimId={c.id}
                            onCancelSuccess={() => refetchPortalData()}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Founder Insights */}
          {activeTab === "insights" && (
            <div className="space-y-6">
              {/* Section header */}
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className={portalUI.sectionKicker}>
                    Founder Journey
                  </p>
                  <h2 className={portalUI.sectionTitle}>
                    Share Your Founder Journey
                  </h2>
                  <p className={portalUI.sectionDesc}>
Your responses help Pacific Market build a clearer understanding of founder experiences across Pacific communities. By identifying common challenges, growth patterns, and opportunities, we can highlight where founders need more visibility, tools, and practical support.                  </p>
                </div>
              </div>

              {/* Insights Status Cards */}
                      
                      <div>
                        <div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className={`${portalUI.card} p-8 mt-4`}>
                          <FounderInsightsAccordion 
                            businessId={null}
                            onSubmit={handleFounderInsightsSubmit}
                            isLoading={insightsSubmitting}
                            initialData={insightSnapshots[0]}
                            onStart={() => setInsightsStarted(true)}
                          />
                        </div>
                      </div>

              {/* Benefits Section */}
              <div className="rounded-[28px] border border-[#0d4f4f]/20 bg-gradient-to-r from-[#0d4f4f]/10 via-white to-[#00c4cc]/10 p-6 shadow-[0_18px_50px_rgba(10,22,40,0.08)]">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border border-[#0d4f4f]/20 bg-[#0d4f4f]/12">
                      <Users className="w-6 h-6 text-[#0d4f4f]" />
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0d4f4f]">
                        Why We Collect This
                      </p>
                      <h3 className="mt-1 text-lg font-bold text-[#0a1628]">
                        Turning founder insight into practical support
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        The more we understand founder experiences, the better we can spotlight patterns, gaps, and opportunities across Pacific business communities.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-gray-200 bg-white/90 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0d4f4f]">
                      Research
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#0a1628]">
                      Shared founder insight
                    </p>
                    <p className="mt-2 text-xs text-slate-600">
                      Build a clearer view of founder experiences across Pacific communities.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-white/90 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#00c4cc]">
                      Support
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#0a1628]">
                      Better support
                    </p>
                    <p className="mt-2 text-xs text-slate-600">
                      Highlight where founders need more visibility, tools, and practical help.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-white/90 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#c9a84c]">
                      Visibility
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#0a1628]">
                      Stronger founder voice
                    </p>
                    <p className="mt-2 text-xs text-slate-600">
                      Help strengthen the visibility of Pacific founders across the registry.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tools */}
          {activeTab === "tools" && (
            <div>
              <h2 className="font-bold text-[#0a1628] mb-2">Business Tools</h2>
              <p className="text-slate-600 text-sm mb-6">Available to Moana subscribers.</p>
              {businesses.some((b) => b.subscription_tier === BUSINESS_TIER.MOANA) ? (
                <div className="grid sm:grid-cols-2 gap-5">
                  <Link href={createPageUrl("InvoiceGenerator")}
                    className={`${portalUI.card} hover:shadow-[0_18px_45px_rgba(10,22,40,0.12)] hover:border-[#0d4f4f]/30 transition-all group`}
                  >
                    <FileText className="w-8 h-8 text-[#0d4f4f] mb-4" />
                    <h3 className="font-bold text-[#0a1628] mb-2">Invoice Generator</h3>
                    <p className="text-slate-600 text-sm mb-4">Create professional invoices with your Pacific business branding.</p>
                    <span className="text-sm font-semibold text-[#0d4f4f] group-hover:gap-2 flex items-center gap-1">Open Tool <ChevronRight className="w-4 h-4" /></span>
                  </Link>
                  <Link href={createPageUrl("QRCodeGenerator")}
                    className={`${portalUI.card} hover:shadow-[0_18px_45px_rgba(10,22,40,0.12)] hover:border-[#0d4f4f]/30 transition-all group`}
                  >
                    <QrCode className="w-8 h-8 text-[#0d4f4f] mb-4" />
                    <h3 className="font-bold text-[#0a1628] mb-2">QR Code Generator</h3>
                    <p className="text-slate-600 text-sm mb-4">Generate QR codes linking to your registry profile or custom URL.</p>
                    <span className="text-sm font-semibold text-[#0d4f4f] group-hover:gap-2 flex items-center gap-1">Open Tool <ChevronRight className="w-4 h-4" /></span>
                  </Link>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-[#c9a84c]/10 to-[#c9a84c]/5 border border-[#c9a84c]/30 rounded-2xl p-8 text-center">
                  <Star className="w-10 h-10 text-[#c9a84c] mx-auto mb-4" />
                  <h3 className="font-bold text-[#0a1628] mb-2">Featured+ Required</h3>
                  <p className="text-slate-600 text-sm mb-5">Upgrade at least one business to Featured+ to unlock the Invoice and QR Code generators.</p>
                  <Link href={createPageUrl("Pricing")} className="inline-flex items-center gap-2 bg-[#c9a84c] hover:bg-[#b8973b] text-white font-bold px-6 py-3 rounded-xl text-sm transition-all">
                    View Plans <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Owner Modal */}
      {showAddOwnerModal && (
        <ModalWrapper isOpen={showAddOwnerModal} onClose={() => setShowAddOwnerModal(null)} className="max-w-md">
          <ModalHeader 
            title="Add Business Owner"
            onClose={() => setShowAddOwnerModal(null)}
          />
          
          <ModalContent>
            <p className="text-slate-600 text-sm mb-4">Add another person to manage this business. They'll receive an invite to claim access.</p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
                <input 
                  value={newOwnerForm.name} 
                  onChange={e => setNewOwnerForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. John Smith" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Email</label>
                <input 
                  value={newOwnerForm.email} 
                  onChange={e => setNewOwnerForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="john@example.com" 
                  type="email" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              {showAddOwnerModal && businesses.find(b => b.id === showAddOwnerModal)?.owner_user_id && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-900"><strong>Current Owner:</strong> {getBusinessOwnerName(businesses.find(b => b.id === showAddOwnerModal)?.owner_user_id, profiles)}</p>
                </div>
              )}
            </div>
          </ModalContent>
          
          <ModalFooter>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3">
              <button 
                onClick={() => setShowAddOwnerModal(null)} 
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#0d4f4f] hover:border-[#0d4f4f] transition"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleAddOwner(showAddOwnerModal)} 
                disabled={addingOwner} 
                className="inline-flex items-center gap-2 rounded-xl bg-[#0d4f4f] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#1a6b6b] transition shadow-[0_12px_30px_rgba(13,79,79,0.35)] disabled:opacity-50"
              >
                {addingOwner ? "Adding..." : "Add Owner"}
              </button>
            </div>
          </ModalFooter>
        </ModalWrapper>
      )}

      {/* Edit Modal */}
       {editingBusiness && (
         <ModalWrapper isOpen={!!editingBusiness} onClose={() => setEditingBusiness(null)} className={MODAL_SIZES.lg}>
           <ModalHeader 
             title="Edit Listing"
             onClose={() => setEditingBusiness(null)}
           />
           
           <ModalContent>
             <DetailedBusinessForm 
               onSubmit={handleSave}
               isLoading={saving}
               initialData={editingBusiness}
               onStepChange={() => {}}
               mode={editingBusiness ? FORM_MODES.BUSINESS_EDIT : FORM_MODES.BUSINESS_CREATE}
             />
           </ModalContent>
           
           <ModalFooter>
             <div className="flex sm:justify-end">
               <button 
                 onClick={() => setEditingBusiness(null)} 
                 className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-[#0a1628] hover:bg-gray-50 transition"
               >
                 Cancel
               </button>
             </div>
           </ModalFooter>
         </ModalWrapper>
       )}

      <ClaimAddBusinessModal
        isOpen={showClaimAddModal}
        onClose={() => setShowClaimAddModal(false)}
        defaultView={claimAddDefaultView}
        onClaimSelected={async () => {
          setShowClaimAddModal(false);
          setActiveTab("claims");
          await refetchPortalData();
        }}
        onAddSelected={async () => {
          setShowClaimAddModal(false);
          await refetchPortalData();
        }}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirmBusiness && (
        <ModalWrapper 
          isOpen={!!deleteConfirmBusiness} 
          onClose={() => setDeleteConfirmBusiness(null)} 
          className="max-w-md"
        >
          <ModalHeader 
            title="Delete Business"
            onClose={() => setDeleteConfirmBusiness(null)}
          />
          
          <ModalContent>
            <div className="text-center py-4">
              <Trash2 className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#0a1628] mb-2">Delete Business</h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete this business? This action cannot be undone. Please make sure you no longer need this listing before continuing.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-sm text-red-800">
                  <strong>Important:</strong> This will permanently remove your business listing from Pacific Market.
                </p>
              </div>
            </div>
          </ModalContent>
          
          <ModalFooter>
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => setDeleteConfirmBusiness(null)} 
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#0d4f4f] hover:border-[#0d4f4f] transition"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDeleteBusiness} 
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-700 transition"
              >
                <Trash2 className="w-4 h-4" />
                Delete Business
              </button>
            </div>
          </ModalFooter>
        </ModalWrapper>
      )}
      <ProfileSetupModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onComplete={async () => {
          setShowProfileModal(false);
          await refetchOnboardingStatus();
          await refetchPortalData();
        }}
      />
    </PortalShell>
  );
}