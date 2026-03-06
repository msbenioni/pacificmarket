import { useState, useEffect } from "react";
import Link from "next/link";
import { createPageUrl } from "@/utils";
import { getSupabase } from "@/lib/supabase/client";
import { Building2, Plus, Edit, Star, Shield, CheckCircle, Upload, FileText, QrCode, ChevronRight, AlertCircle, Trash2, Zap, Search, Users } from "lucide-react";
import { canAccessBusinessFeatures } from "@/utils/roleHelpers";
import HeroRegistry from "../components/shared/HeroRegistry";
import { TIER_BENEFITS } from "@/constants/businessProfile";
import { BUSINESS_TIER, BUSINESS_STATUS, getTierDisplayName } from "@/constants/business";
import DetailedBusinessForm, { FORM_MODES } from "@/components/forms/DetailedBusinessForm";
import FounderInsightsForm from "@/components/forms/FounderInsightsForm";
import FounderInsightsSummary from "@/components/insights/FounderInsightsSummary";
import { useOnboardingStatus } from "@/hooks/useOnboardingStatus";
import { SetupProgressCard } from "@/components/onboarding/SetupProgressCard";
import { ClaimAddBusinessModal } from "@/components/onboarding/ClaimAddBusinessModal";
import CancelClaimButton from "@/components/claims/CancelClaimButton";
import { ProfileSetupModal } from "@/components/onboarding/ProfileSetupModal";
import { ModalWrapper, ModalHeader, ModalContent, ModalFooter, MODAL_SIZES } from "@/components/shared/ModalWrapper";
import { getBusinessOwner, getBusinessOwnerName } from "@/utils/businessHelpers";
import PortalShell from "@/components/portal/PortalShell";
import { portalUI } from "@/components/portal/portalUI";
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
  const [editingBusiness, setEditingBusiness] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showAddOwnerModal, setShowAddOwnerModal] = useState(null);
  const [newOwnerForm, setNewOwnerForm] = useState({ name: "", email: "" });
  const [addingOwner, setAddingOwner] = useState(false);
  const [deleteConfirmBusiness, setDeleteConfirmBusiness] = useState(null);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [claiming, setClaiming] = useState(false);
  const [showInsightsModal, setShowInsightsModal] = useState(false);
  const [selectedBusinessForInsights, setSelectedBusinessForInsights] = useState(null);
  const [insightsSubmitting, setInsightsSubmitting] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showClaimAddModal, setShowClaimAddModal] = useState(false);
  const [claimAddDefaultView, setClaimAddDefaultView] = useState("choice");

  const { createCheckoutSession, loading: checkoutLoading } = useStripeCheckout();
  const { toast } = useToast();

  // Helper to get latest snapshot for a business
  const getLatestSnapshot = (businessId) =>
    insightSnapshots.find(s => s.business_id === businessId);

  // Onboarding state
  const { onboardingStatus, loading: onboardingLoading } = useOnboardingStatus();

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

      // Fetch insight snapshots for owned businesses
      const businessIds = businesses.map(b => b.id);
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

  const submitClaimRequest = async () => {
    if (!selectedBusiness) return;
    setClaiming(true);
    try {
      const supabase = getSupabase();
      const { error } = await supabase
        .from('claim_requests')
        .insert({
          business_id: selectedBusiness.id,
          user_id: user.id,
          user_email: user.email,
          business_name: selectedBusiness.name,
          status: "pending",
        });
      
      if (error) throw error;
      
      setClaims(prev => [...prev, { 
        business_id: selectedBusiness.id, 
        business_name: selectedBusiness.name, 
        user_email: user.email, 
        status: "pending", 
        created_date: new Date() 
      }]);
      setSelectedBusiness(null);
      
      toast({
        title: "Claim Submitted",
        description: "Your claim request has been submitted successfully.",
        variant: "success"
      });
    } catch (error) {
      console.error("Error submitting claim:", error);
      toast({
        title: "Claim Failed",
        description: "Failed to submit claim request. Please try again.",
        variant: "error"
      });
    } finally {
      setClaiming(false);
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
      const { getSupabase } = await import('../lib/supabase/client');
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
            full_name: newOwnerForm.name.trim(),
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

      // Save insights to database
      const { error } = await supabase
        .from('business_insights_snapshots')
        .insert(insightsData);

      if (error) throw error;

      // Show success message
      toast({
        title: "Founder Insights Submitted!",
        description: "Thank you for sharing your business journey. Your insights will help us better support Pacific entrepreneurs.",
        variant: "success"
      });

      // Close modal and reset
      setShowInsightsModal(false);
      setSelectedBusinessForInsights(null);
      
      // Upgrade business to Mana tier with comprehensive fields
      if (selectedBusinessForInsights) {
        const businessUpdates = {
          subscription_tier: BUSINESS_TIER.MANA,
          verified: true,
          founder_snapshot_completed: true,
          founder_snapshot_completed_at: new Date().toISOString()
        };
        
        const { error: updateError } = await supabase
          .from('businesses')
          .update(businessUpdates)
          .eq('id', selectedBusinessForInsights.id);
        
        if (updateError) throw updateError;
        
        setBusinesses(prev => prev.map(b => 
          b.id === selectedBusinessForInsights.id 
            ? { 
                ...b, 
                ...businessUpdates
              }
            : b
        ));
        
        // Refresh insight snapshots to include the new submission
        await refetchPortalData();
        
        toast({
          title: "Verified Upgrade Complete!",
          description: "Your business has been upgraded to Verified tier. Thank you for sharing your founder journey!",
          variant: "success"
        });
      }
      
    } catch (error) {
      console.error('Error submitting insights:', error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit insights. Please try again.",
        variant: "error"
      });
    } finally {
      setInsightsSubmitting(false);
    }
  };

  const handleUpgradeClick = async (tier) => {
    if (!user) {
      // Redirect to login
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
    
    // Legacy support
    basic: { label: getTierDisplayName(BUSINESS_TIER.BASIC), color: "text-gray-500 bg-gray-100" },
    verified: { label: getTierDisplayName(BUSINESS_TIER.VERIFIED), color: "text-[#0d4f4f] bg-[#0d4f4f]/10", icon: Shield },
    featured_plus: { label: getTierDisplayName(BUSINESS_TIER.FEATURED_PLUS), color: "text-[#c9a84c] bg-[#c9a84c]/10", icon: Star },
  };

  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0d4f4f] bg-white";

  return (
    <PortalShell>
      <HeroRegistry
        badge="Business Owner Portal"
        title={`Welcome, ${user?.full_name?.split(" ")[0] || "Owner"}`}
        subtitle={user?.email}
        description=""
        actions={null}
      />

      <div className={portalUI.wrap}>
        <div className={portalUI.shell}>
          {/* Tabs */}
          <div className={portalUI.tabsWrap}>
            {[
              { id: "my-businesses", label: "My Businesses", icon: Building2 },
              { id: "insights", label: "Founder Insights", icon: Users },
              { id: "claims", label: "Claim Requests", icon: CheckCircle },
              { id: "tools", label: "Business Tools", icon: FileText },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={portalUI.tabBtn(activeTab === tab.id)}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
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
                    Manage your business listings, update ownership details, and unlock more visibility through Verified or Featured+.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      setClaimAddDefaultView("claim");
                      setShowClaimAddModal(true);
                    }}
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#0d4f4f] hover:border-[#0d4f4f] transition"
                  >
                    <Search className="w-4 h-4 text-[#00c4cc]" />
                    Claim Business
                  </button>

                  <button
                    onClick={() => {
                      setClaimAddDefaultView("add");
                      setShowClaimAddModal(true);
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#0d4f4f] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#1a6b6b] transition shadow-[0_12px_30px_rgba(13,79,79,0.35)]"
                  >
                    <Plus className="w-4 h-4" />
                    Add Business
                  </button>
                </div>
              </div>

              {/* Upgrade Banner */}
              {businesses.length > 0 && !businesses.some((b) => b.subscription_tier !== "basic") && (
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
                          Unlock more with Verified or Featured+
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          Increase trust, showcase your visual identity, and unlock practical business tools designed to help Pacific businesses stand out.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleUpgradeClick('verified')}
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
                        {user ? 'Upgrade Now' : 'Sign Up to Upgrade'}
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-gray-200 bg-white/90 p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#00c4cc]">
                        Verified
                      </p>
                      <p className="mt-1 text-sm font-semibold text-[#0a1628]">
                        ${TIER_BENEFITS.verified.price.split("/")[0].slice(1)}/mo
                      </p>
                      <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
                        <li>• Verified badge</li>
                        <li>• Logo and banner support</li>
                        <li>• Stronger profile presentation</li>
                      </ul>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white/90 p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#00c4cc]">
                        Featured+
                      </p>
                      <p className="mt-1 text-sm font-semibold text-[#0a1628]">
                        ${TIER_BENEFITS.featured_plus.price.split("/")[0].slice(1)}/mo
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
                    <div className="rounded-2xl border border-amber-300/20 bg-amber-50/80 p-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          <AlertCircle className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-amber-800">
                            Complete your profile first
                          </h4>
                          <p className="mt-1 text-sm text-amber-700">
                            Your profile is needed to claim a business and keep the registry trustworthy.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-white/70 border border-dashed border-gray-200 rounded-2xl p-12 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-gray-200 bg-white/90">
                      <Building2 className="w-7 h-7 text-gray-400" />
                    </div>

                    <h3 className="text-lg font-bold text-[#0a1628]">
                      {onboardingStatus.needsProfile ? "Complete Your Profile First" : "Manage Your Business"}
                    </h3>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
                      {onboardingStatus.needsProfile
                        ? "Complete your profile to claim or add a business and keep the registry trustworthy."
                        : "Choose how you'd like to get started with your Pacific Market business listing."}
                    </p>

                    {!onboardingStatus.isComplete && (
                      <div className="mt-6">
                        <SetupProgressCard
                          onOpenProfileModal={() => setShowProfileModal(true)}
                          onOpenClaimModal={() => setShowClaimAddModal(true)}
                          onOpenAddModal={() => setShowClaimAddModal(true)}
                        />
                      </div>
                    )}
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {businesses.map((b) => {
                  const tierStyles =
                    b.subscription_tier === "featured_plus"
                      ? "bg-[#c9a84c]/14 text-[#f4e3a8] border border-[#c9a84c]/20"
                      : b.subscription_tier === "verified"
                      ? "bg-[#00c4cc]/12 text-[#8df3f6] border border-[#00c4cc]/20"
                      : "bg-gray-100/80 text-gray-600 border border-gray-200";

                  const statusStyles =
                    b.status === BUSINESS_STATUS.ACTIVE
                      ? "bg-emerald-100/80 text-emerald-700 border border-emerald-200"
                      : b.status === BUSINESS_STATUS.PENDING
                      ? "bg-amber-100/80 text-amber-700 border border-amber-200"
                      : "bg-red-100/80 text-red-700 border border-red-200";

                  return (
                    <div
                      key={b.id}
                      className="bg-white border border-gray-200 rounded-2xl p-5 shadow-[0_12px_40px_rgba(10,22,40,0.06)] transition hover:border-[#00c4cc]/20 hover:shadow-[0_18px_45px_rgba(0,0,0,0.1)] relative"
                    >
                      {/* Top-right action icons */}
                      <div className="absolute top-5 right-5 flex items-center gap-2">
                        <button
                          onClick={() => setEditingBusiness(b)}
                          className="p-2 rounded-lg text-gray-400 hover:text-[#0d4f4f] hover:bg-gray-50 transition"
                          title="Edit business"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBusiness(b.id)}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                          title="Remove business"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between pr-20">
                        {/* Left side */}
                        <div className="flex flex-1 items-start gap-4">
                          <div className="relative group h-14 w-14 flex-shrink-0 overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-[#0a1628] to-[#0d4f4f]">
                            {b.logo_url ? (
                              <img src={b.logo_url} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <img src="/pm_logo.png" alt="Pacific Market" className="h-full w-full object-cover" />
                            )}
                            <label className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/45 opacity-0 transition-opacity group-hover:opacity-100">
                              <Upload className="w-4 h-4 text-white" />
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleLogoUpload(e, b.id)}
                              />
                            </label>
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="truncate text-lg font-bold text-[#0a1628]">
                                {b.name}
                              </h3>

                              {b.verified && (
                                <CheckCircle className="w-4 h-4 text-[#00c4cc]" />
                              )}

                              {(b.subscription_tier === "verified" || b.subscription_tier === "featured_plus") && (
                                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${tierStyles}`}>
                                  {tierInfo[b.subscription_tier]?.label}
                                </span>
                              )}

                              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusStyles}`}>
                                {b.status}
                              </span>
                            </div>

                            <p className="mt-2 text-sm text-slate-600">
                              {b.city ? `${b.city}, ` : ""}
                              {b.country} · {b.industry}
                            </p>

                            {/* View Listing - Premium text link */}
                            <div className="mt-3">
                              <Link
                                href={createPageUrl("BusinessProfile") + `?handle=${b.business_handle || b.id}`}
                                className="inline-flex items-center gap-1 text-sm font-semibold text-[#0d4f4f] hover:text-[#1a6b6b] transition"
                              >
                                View Listing <ChevronRight className="w-4 h-4" />
                              </Link>
                            </div>

                            {b.owner_user_id && (
                              <div className="mt-4 max-w-md rounded-2xl border border-gray-200 bg-white/90 p-4">
                                <div className="flex items-center justify-between gap-3">
                                  <div className="min-w-0">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                                      Primary Owner
                                    </p>
                                    <p className="truncate text-sm font-semibold text-[#0a1628]">
                                      {getBusinessOwnerName(b.owner_user_id, profiles)}
                                    </p>
                                    <p className="truncate text-sm text-slate-600">
                                      {getBusinessOwner(b.owner_user_id, profiles)?.email}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-100/80 px-3 py-1 text-xs font-semibold text-emerald-700">
                                      Active
                                    </span>
                                    {/* Add Owner button in Primary Owner box */}
                                    <button
                                      onClick={() => setShowAddOwnerModal(b.id)}
                                      className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-[#0d4f4f] hover:border-[#0d4f4f] hover:bg-gray-50 transition"
                                      title="Add another owner"
                                    >
                                      <Users className="w-3 h-3" />
                                      Add Owner
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Footer strip */}
                      {b.subscription_tier === "basic" && (
                        <div className="mt-5 border-t border-gray-200 pt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm font-semibold text-[#0a1628]">
                              Ready to upgrade this listing?
                            </p>
                            <p className="text-sm text-slate-600">
                              Unlock logo, richer presentation, verification, and premium tools.
                            </p>
                          </div>
                  <Link
                              href={createPageUrl("Pricing")}
                              className="inline-flex items-center gap-2 text-sm font-semibold text-[#c9a84c] hover:text-[#f0d27b] transition"
                            >
                              View upgrade options
                              <ChevronRight className="w-4 h-4" />
                            </Link>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
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
                    <div key={c.id} className={`${portalUI.card} flex items-center justify-between`}>
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
                    Share Your Business Story
                  </h2>
                  <p className={portalUI.sectionDesc}>
                    Help us build the first comprehensive dataset of Pacific entrepreneurship. Your insights will strengthen support programs and research across the region.
                  </p>
                </div>
              </div>

              {/* Insights Status Cards */}
              <div className="space-y-4">
                {businesses.length === 0 ? (
                  <div className={`${portalUI.card} p-8 text-center`}>
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-[#0a1628] mb-2">No Businesses Yet</h3>
                    <p className="text-gray-600 mb-4">Add your first business to access the Founder Insights survey.</p>
                    <button
                      onClick={() => {
                        setClaimAddDefaultView("add");
                        setShowClaimAddModal(true);
                      }}
                      className="inline-flex items-center gap-2 bg-[#0d4f4f] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#1a6b6b] transition"
                    >
                      <Plus className="w-4 h-4" />
                      Add Business
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {businesses.map((business) => (
                      <div key={business.id} className={`${portalUI.card} p-6`}>
                        <div className="flex items-start justify-between gap-6">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              {business.logo_url ? (
                                <img src={business.logo_url} alt={business.name} className="w-12 h-12 rounded-xl object-cover" />
                              ) : (
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0a1628] to-[#0d4f4f] flex items-center justify-center">
                                  <span className="text-white font-bold text-lg">{business.name?.[0] || "?"}</span>
                                </div>
                              )}
                              <div>
                                <h3 className="font-bold text-[#0a1628]">{business.name}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                    business.subscription_tier === "verified"
                                      ? "bg-[#0d4f4f]/10 text-[#0d4f4f]"
                                      : "bg-gray-100 text-gray-600"
                                  }`}>
                                    {business.subscription_tier === "verified" ? "Verified" : "Basic"}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {business.country || "Unknown"} • {business.industry || "Unknown"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                              <div className="flex items-start gap-3">
                                <Users className="w-5 h-5 text-blue-600 mt-0.5" />
                                <div>
                                  <h4 className="font-semibold text-blue-900 text-sm">Founder Insights Reward</h4>
                                  <p className="text-blue-700 text-sm mt-1">
                                    Complete this survey to receive a <strong>complimentary Verified upgrade</strong> and help strengthen Pacific entrepreneurship data.
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => {
                                  setSelectedBusinessForInsights(business);
                                  setShowInsightsModal(true);
                                }}
                                className="inline-flex items-center gap-2 bg-[#0d4f4f] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#1a6b6b] transition"
                              >
                                <Users className="w-4 h-4" />
                                {business.founder_snapshot_completed ? "View Submitted Insights" : "Start Founder Insights"}
                              </button>

                              {business.founder_snapshot_completed && (
                                <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                                  <CheckCircle className="w-4 h-4" />
                                  Submitted {getLatestSnapshot(business.id)?.submitted_date ? 
                                    new Date(getLatestSnapshot(business.id).submitted_date).toLocaleDateString() : 
                                    'Recently'
                                  }
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                        Community Impact
                      </p>
                      <h3 className="mt-1 text-lg font-bold text-[#0a1628]">
                        Why Your Journey Matters
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        Your business story helps researchers, policymakers, and support organizations understand the unique challenges and opportunities facing Pacific entrepreneurs.
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
                      First Pacific Dataset
                    </p>
                    <p className="mt-2 text-xs text-slate-600">
                      Contribute to the largest structured dataset of Pacific entrepreneurship
                    </p>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-white/90 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#00c4cc]">
                      Support
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#0a1628]">
                      Better Programs
                    </p>
                    <p className="mt-2 text-xs text-slate-600">
                      Help organizations design better support for Pacific businesses
                    </p>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-white/90 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#c9a84c]">
                      Recognition
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#0a1628]">
                      Verified Status
                    </p>
                    <p className="mt-2 text-xs text-slate-600">
                      Receive complimentary Verified tier for your contribution
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
              <p className="text-slate-600 text-sm mb-6">Available to Featured+ subscribers.</p>
              {businesses.some((b) => b.subscription_tier === "featured_plus") ? (
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
            <div className="flex justify-between">
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
         <ModalWrapper isOpen={editingBusiness} onClose={() => setEditingBusiness(null)} className={MODAL_SIZES.lg}>
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
             <div className="flex justify-end">
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

      {/* Founder Insights Modal */}
      {showInsightsModal && selectedBusinessForInsights && (
        <ModalWrapper isOpen={showInsightsModal} onClose={() => setShowInsightsModal(false)} className={MODAL_SIZES.xl}>
          <ModalHeader 
            title="Founder Insights Survey"
            subtitle={`Share your journey for ${selectedBusinessForInsights.name}`}
            onClose={() => setShowInsightsModal(false)}
          />
          
          <ModalContent>
            {selectedBusinessForInsights.founder_snapshot_completed ? (
              <FounderInsightsSummary 
                snapshot={getLatestSnapshot(selectedBusinessForInsights.id)}
                business={selectedBusinessForInsights}
              />
            ) : (
              <>
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-blue-900">Why Share Your Insights?</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Your journey helps us build better support programs for Pacific entrepreneurs. Complete this survey to automatically upgrade to Verified tier.
                      </p>
                    </div>
                  </div>
                </div>
                
                <FounderInsightsForm 
                  businessId={selectedBusinessForInsights.id}
                  onSubmit={handleFounderInsightsSubmit}
                  isLoading={insightsSubmitting}
                />
              </>
            )}
          </ModalContent>
        </ModalWrapper>
      )}

      {/* Onboarding Modals */}
      <ProfileSetupModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onComplete={() => {
          setShowProfileModal(false);
          // After profile complete, show claim/add modal if needed
          if (!businesses.length && !claims.length) {
            setShowClaimAddModal(true);
          }
        }}
      />

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
          await refetchPortalData();         // refresh businesses instantly
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
            <div className="flex justify-between gap-3">
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
    </PortalShell>
  );
}