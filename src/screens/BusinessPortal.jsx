"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createPageUrl } from "@/utils";
import { getUserBusinesses, deleteBusiness } from "@/lib/supabase/queries/businesses";
import {
  Building2,
  Plus,
  Star,
  CheckCircle,
  Upload,
  FileText,
  QrCode,
  ChevronRight,
  AlertCircle,
  Trash2,
  Zap,
  Search,
  Users,
  Mail,
} from "lucide-react";
import { canAccessBusinessFeatures } from "@/utils/roleHelpers";
import HeroRegistry from "../components/shared/HeroRegistry";
import { TIER_BENEFITS } from "@/constants/businessProfile";
import {
  BUSINESS_TIER,
  BUSINESS_STATUS,
  getTierDisplayName,
  COUNTRIES,
  INDUSTRIES,
} from "@/constants/unifiedConstants";
import InlineBusinessForm from "@/components/forms/InlineBusinessForm";
import FounderInsightsAccordion from "@/components/forms/FounderInsightsAccordion";
import { useOnboardingStatus } from "@/hooks/useOnboardingStatus";
import { ClaimAddBusinessModal } from "@/components/onboarding/ClaimAddBusinessModal";
import CancelClaimButton from "@/components/claims/CancelClaimButton";
import { ProfileSetupModal } from "@/components/onboarding/ProfileSetupModal";
import {
  ModalWrapper,
  ModalHeader,
  ModalContent,
  ModalFooter,
} from "@/components/shared/ModalWrapper";
import { getBusinessOwnerName } from "@/utils/businessHelpers";
import PortalShell from "@/components/portal/PortalShell";
import { portalUI } from "@/components/portal/portalUI";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";
import { useToast } from "@/components/ui/toast/ToastProvider";
import ReferralDashboard from "@/components/referrals/ReferralDashboard";

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

  const [editingBusinessId, setEditingBusinessId] = useState(null);
  const [draftBusiness, setDraftBusiness] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const { createCheckoutSession, loading: checkoutLoading } = useStripeCheckout();
  const { toast } = useToast();

  const {
    onboardingStatus,
    loading: onboardingLoading,
    refetch: refetchOnboardingStatus,
  } = useOnboardingStatus();

  const getCountryLabel = (countryValue) => {
    const country = COUNTRIES.find((c) => c.value === countryValue);
    return country ? country.label : countryValue;
  };

  const getIndustryLabel = (industryValue) => {
    const industry = INDUSTRIES.find((i) => i.value === industryValue);
    return industry ? industry.label : industryValue;
  };

  const refetchPortalData = async (u = user) => {
    if (!u?.id) return;

    try {
      const { getSupabase } = await import("@/lib/supabase/client");
      const supabase = getSupabase();

      const { data: businessesData, error: businessesError } = await getUserBusinesses(u.id);

      if (businessesError) {
        console.error("Error fetching businesses:", businessesError);
        throw businessesError;
      }

      const [claimsResult, profilesResult] = await Promise.all([
        supabase
          .from("claim_requests")
          .select(`
            id, business_id, user_id, status, contact_email, contact_phone,
            verification_documents, rejection_reason, reviewed_by, reviewed_at,
            business_name, user_email, role, proof_url, created_at
          `)
          .eq("user_id", u.id),
        supabase
          .from("profiles")
          .select(`
            id, email, display_name, role, country, city, primary_cultural,
            languages, gdpr_consent, gdpr_consent_date, status, invited_by,
            invited_date, pending_business_id, pending_business_name
          `),
      ]);

      setBusinesses(businessesData || []);
      setClaims(claimsResult.data || []);
      setProfiles(profilesResult.data || []);

      const { data: snapshotData, error: snapshotError } = await supabase
        .from("business_insights_snapshots")
        .select("*")
        .eq("user_id", u.id)
        .order("submitted_date", { ascending: false });

      if (snapshotError) {
        console.error("Error fetching founder insights snapshots:", snapshotError);
      }

      setInsightSnapshots(snapshotData || []);
    } catch (e) {
      console.error("Refetch portal data error:", e);
    }
  };

  useEffect(() => {
    const loadPortalData = async () => {
      try {
        const { getSupabase } = await import("@/lib/supabase/client");
        const supabase = getSupabase();

        const {
          data: { user: authUser },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !authUser) {
          setLoading(false);
          return;
        }

        const { data: profileData } = await supabase
          .from("profiles")
          .select(`
            id, email, display_name, role, country, city, primary_cultural,
            languages, gdpr_consent, gdpr_consent_date, status, invited_by,
            invited_date, pending_business_id, pending_business_name
          `)
          .eq("id", authUser.id)
          .single();

        const enhancedUser = {
          ...authUser,
          role: profileData?.role || "owner",
          permissions: profileData?.role === "admin" ? ["read", "write", "delete"] : [],
          full_name:
            profileData?.display_name ||
            authUser.user_metadata?.full_name ||
            authUser.user_metadata?.display_name,
          display_name:
            profileData?.display_name ||
            authUser.user_metadata?.display_name ||
            authUser.user_metadata?.full_name,
        };

        setUser(enhancedUser);
        await refetchPortalData(enhancedUser);
      } catch (error) {
        console.error("Error loading portal data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPortalData();
  }, []);

  const sanitizeBusinessPayload = (formData) => {
    const {
      id,
      created_at,
      created_date,
      updated_at,
      verification_source,
      logo_file,
      banner_file,
      owner_user_id,
      created_by,
      claimed_at,
      claimed_by,
      profile_completeness,
      referral_code,
      source,
      visibility_tier,
      social_links,
      primary_market,
      growth_stage,
      business_operating_status,
      business_age,
      full_time_employees,
      part_time_employees,
      business_registered,
      sales_channels,
      import_export_status,
      revenue_band,
      competitive_advantage,
      ...rest
    } = formData;

    const allowedFields = [
      "name",
      "business_handle",
      "short_description",
      "description",
      "contact_name",
      "contact_email",
      "contact_phone",
      "contact_website",
      "business_hours",
      "country",
      "city",
      "suburb",
      "address",
      "state_region",
      "postal_code",
      "industry",
      "year_started",
      "business_structure",
      "subscription_tier",
      "status",
      "team_size_band",
      "cultural_identity",
      "languages_spoken",
      "verified",
      "claimed",
      "homepage_featured",
      "logo_url",
      "banner_url",
    ];

    /** @type {Record<string, any>} */
    const safeUpdateData = allowedFields.reduce((acc, key) => {
      const value = rest[key];

      if (value === undefined) return acc;

      if (typeof value === "string") {
        acc[key] = value.trim();
        return acc;
      }

      if (Array.isArray(value)) {
        acc[key] = value;
        return acc;
      }

      acc[key] = value;
      return acc;
    }, {});

    return { id, safeUpdateData };
  };

  const startEditingBusiness = (business) => {
    setEditingBusinessId(business.id);
    setDraftBusiness({
      ...business,
      languages_spoken: Array.isArray(business.languages_spoken)
        ? business.languages_spoken
        : [],
    });
  };

  const cancelEditingBusiness = () => {
    setEditingBusinessId(null);
    setDraftBusiness(null);
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
          toast({
            title: "Logo Upload Failed",
            description: "Failed to upload logo. Using existing logo URL.",
            variant: "error",
          });
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
          toast({
            title: "Banner Upload Failed",
            description: "Failed to upload banner. Using existing banner URL.",
            variant: "error",
          });
        }
      }

      /** @type {Record<string, any>} */
      const payload = {
        ...updatedData,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("businesses").update(payload).eq("id", id);

      if (error) throw error;

      setBusinesses((prev) => prev.map((b) => (b.id === id ? { ...b, ...payload } : b)));
      cancelEditingBusiness();

      toast({
        title: "Business Updated",
        description: "Your changes were saved successfully.",
        variant: "success",
      });
    } catch (error) {
      console.error("Error updating business:", error);
      toast({
        title: "Update Failed",
        description: error?.message || "Unable to update the business.",
        variant: "error",
      });
    } finally {
      setSavingEdit(false);
    }
  };

  const handleLogoUpload = async (e, businessId) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { getSupabase } = await import("@/lib/supabase/client");
      const supabase = getSupabase();

      const bucket = "admin-listings";
      const folder = "logos";
      const filePath = `${folder}/${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
      const fileUrl = data.publicUrl;

      const { error: updateError } = await supabase
        .from("businesses")
        .update({ logo_url: fileUrl, updated_at: new Date().toISOString() })
        .eq("id", businessId);

      if (updateError) throw updateError;

      setBusinesses((prev) =>
        prev.map((b) => (b.id === businessId ? { ...b, logo_url: fileUrl } : b))
      );

      if (editingBusinessId === businessId) {
        setDraftBusiness((prev) => (prev ? { ...prev, logo_url: fileUrl } : prev));
      }

      toast({
        title: "Logo Updated",
        description: "Business logo has been successfully updated.",
        variant: "success",
      });
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload logo. Please try again.",
        variant: "error",
      });
    }
  };

  const handleDeleteBusiness = (businessId) => {
    setDeleteConfirmBusiness(businessId);
  };

  const confirmDeleteBusiness = async () => {
    if (!deleteConfirmBusiness) return;

    try {
      const { error } = await deleteBusiness(deleteConfirmBusiness);
      if (error) throw error;

      setBusinesses((prev) => prev.filter((b) => b.id !== deleteConfirmBusiness));

      if (editingBusinessId === deleteConfirmBusiness) {
        cancelEditingBusiness();
      }

      toast({
        title: "Business Deleted",
        description: "The business has been successfully deleted.",
        variant: "success",
      });

      setDeleteConfirmBusiness(null);
    } catch (error) {
      console.error("Error deleting business:", error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete business. Please try again.",
        variant: "error",
      });
    }
  };

  const handleAddOwner = async (businessId) => {
    if (!newOwnerForm.name || !newOwnerForm.email) {
      toast({
        title: "Validation Error",
        description: "Please fill in both name and email fields",
        variant: "error",
      });
      return;
    }

    setAddingOwner(true);

    try {
      const { getSupabase } = await import("@/lib/supabase/client");
      const supabase = getSupabase();

      const businessName = businesses.find((b) => b.id === businessId)?.name;

      const { data: existingProfile } = await supabase
        .from("profiles")
        .select(`
          id, email, display_name, role, country, city, primary_cultural,
          languages, gdpr_consent, gdpr_consent_date, status, invited_by,
          invited_date, pending_business_id, pending_business_name
        `)
        .eq("email", newOwnerForm.email.toLowerCase().trim())
        .single();

      if (existingProfile) {
        const { data: existingBusiness } = await supabase
          .from("businesses")
          .select("id, owner_user_id")
          .eq("id", businessId)
          .eq("owner_user_id", existingProfile.id)
          .single();

        if (existingBusiness) {
          toast({
            title: "Duplicate Owner",
            description: "This person already manages this business.",
            variant: "error",
          });
          return;
        }

        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            pending_business_id: businessId,
            pending_business_name: businessName,
            invited_by: user?.id,
            invited_date: new Date().toISOString(),
          })
          .eq("id", existingProfile.id);

        if (updateError) throw updateError;
      } else {
        const { error: createError } = await supabase.from("profiles").insert({
          email: newOwnerForm.email.toLowerCase().trim(),
          display_name: newOwnerForm.name.trim(),
          pending_business_id: businessId,
          pending_business_name: businessName,
          invited_by: user?.id,
          invited_date: new Date().toISOString(),
          status: "pending_invitation",
        });

        if (createError) throw createError;
      }

      const emailResponse = await fetch("/api/emails/owner-invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ownerEmail: newOwnerForm.email.toLowerCase().trim(),
          ownerName: newOwnerForm.name.trim(),
          businessName,
          businessId,
        }),
      });

      if (!emailResponse.ok) {
        console.error("Failed to send invitation email");
      }

      toast({
        title: "Invitation Sent",
        description: `Invitation sent to ${newOwnerForm.email}. They will receive an email to accept the invitation.`,
        variant: "success",
      });

      setShowAddOwnerModal(null);
      setNewOwnerForm({ name: "", email: "" });
      await refetchPortalData();
    } catch (error) {
      console.error("Error adding owner:", error);
      toast({
        title: "Invitation Failed",
        description: "Failed to send invitation. Please try again.",
        variant: "error",
      });
    } finally {
      setAddingOwner(false);
    }
  };

  const handleFounderInsightsSubmit = async (insightsData) => {
    setInsightsSubmitting(true);

    try {
      const { getSupabase } = await import("@/lib/supabase/client");
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
            updated_at: new Date().toISOString(),
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#0d4f4f] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !canAccessBusinessFeatures(user)) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center">
        <div className="text-center bg-white border border-gray-100 rounded-2xl p-12 max-w-sm">
          <AlertCircle className="w-10 h-10 text-orange-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#0a1628] mb-2">Access Required</h2>
          <p className="text-gray-500 mb-6">
            Business owner or admin access required to view this portal.
          </p>
          <Link
            href={createPageUrl("BusinessLogin")}
            className="inline-flex items-center gap-2 bg-[#0a1628] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#122040]"
          >
            Sign In <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const tierInfo = {
    [BUSINESS_TIER.VAKA]: {
      label: getTierDisplayName(BUSINESS_TIER.VAKA),
      color: "text-gray-500 bg-gray-100",
    },
    [BUSINESS_TIER.MANA]: {
      label: getTierDisplayName(BUSINESS_TIER.MANA),
      color: "text-[#0d4f4f] bg-[#0d4f4f]/10",
    },
    [BUSINESS_TIER.MOANA]: {
      label: getTierDisplayName(BUSINESS_TIER.MOANA),
      color: "text-[#c9a84c] bg-[#c9a84c]/10",
    },
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
          <div className={portalUI.tabsWrap}>
            {[
              {
                id: "my-businesses",
                label: "My Businesses",
                mobileLabel: "Businesses",
                icon: Building2,
                count: businesses.length,
              },
              {
                id: "claims",
                label: "Claim Requests",
                mobileLabel: "Claims",
                icon: CheckCircle,
                count: claims.length,
              },
              {
                id: "insights",
                label: "Founder Insights",
                mobileLabel: "Insights",
                icon: Users,
                status:
                  insightSnapshots.length > 0
                    ? "completed"
                    : insightsStarted
                    ? "started"
                    : "not-started",
              },
              {
                id: "tools",
                label: "Business Tools",
                mobileLabel: "Tools",
                icon: FileText,
              },
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

          {activeTab === "my-businesses" && (
            <div className="space-y-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className={portalUI.sectionKicker}>Business Management</p>
                  <h2 className={portalUI.sectionTitle}>My Registry Records</h2>
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
                    className={onboardingStatus.needsProfile ? disabledActionCls : secondaryActionCls}
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
                    <button onClick={() => setShowProfileModal(true)} className={secondaryActionCls}>
                      <Users className="w-4 h-4" />
                      Complete Profile
                    </button>
                  )}
                </div>
              </div>

              {businesses.length > 0 &&
                !businesses.some((b) => b.subscription_tier !== BUSINESS_TIER.VAKA) && (
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
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#c9a84c] px-5 py-3 text-sm font-bold text-[#0a1628] hover:bg-[#d8b865] transition disabled:opacity-50 min-h-[44px] w-full sm:w-auto"
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

                          <button onClick={() => setShowProfileModal(true)} className={primaryActionCls}>
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

                    const metaParts = [
                      b.city ? `${b.city}, ${getCountryLabel(b.country)}` : getCountryLabel(b.country),
                      getIndustryLabel(b.industry),
                    ].filter(Boolean);

                    const isEditing = editingBusinessId === b.id;

                    return (
                      <div key={b.id} className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                        <div className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gradient-to-br from-[#0a1628] to-[#0d4f4f]">
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
                                    alt="Pacific Market"
                                    className="h-full w-full object-cover"
                                  />
                                )}
                              </div>

                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2 flex-wrap">
                                  <h3 className="text-lg font-semibold text-[#0a1628]">{b.name}</h3>
                                  <span className={`rounded-full border px-2 py-1 text-xs font-medium ${tierStyles}`}>
                                    {tierInfo[b.subscription_tier]?.label || "vaka"}
                                  </span>
                                  {b.verified && (
                                    <span className="rounded-full px-2 py-1 text-xs font-medium bg-emerald-100/80 text-emerald-700 border border-emerald-200">
                                      Verified
                                    </span>
                                  )}
                                </div>

                                <p className="text-sm text-gray-600 mb-3">{metaParts.join(" · ")}</p>

                                <div className="flex flex-wrap gap-2">
                                  <button
                                    onClick={() => {
                                      if (isEditing) {
                                        cancelEditingBusiness();
                                      } else {
                                        startEditingBusiness(b);
                                      }
                                    }}
                                    className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                                      isEditing
                                        ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        : "bg-[#0d4f4f] text-white hover:bg-[#1a6b6b]"
                                    }`}
                                  >
                                    {isEditing ? "Cancel" : "Edit"}
                                  </button>

                                  <button
                                    onClick={() => handleDeleteBusiness(b.id)}
                                    className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 transition"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                    Delete
                                  </button>

                                  <button
                                    onClick={() => setShowAddOwnerModal(b.id)}
                                    className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 transition"
                                  >
                                    <Users className="h-3 w-3" />
                                    Add Owner
                                  </button>

                                  <label className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 transition cursor-pointer">
                                    <Upload className="h-3 w-3" />
                                    Logo
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => handleLogoUpload(e, b.id)}
                                      className="hidden"
                                    />
                                  </label>
                                </div>

                                {b.owner_user_id && (
                                  <p className="mt-3 text-xs text-slate-500">
                                    Owner: {getBusinessOwnerName(b.owner_user_id, profiles)}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {isEditing && draftBusiness && (
                          <div className="border-t border-gray-200 bg-gray-50 p-6">
                            <InlineBusinessForm
                              title={`Edit ${b.name}`}
                              formData={draftBusiness}
                              setFormData={setDraftBusiness}
                              onSave={() => saveBusiness(draftBusiness)}
                              onCancel={cancelEditingBusiness}
                              saving={savingEdit}
                              mode="edit"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {businesses.length > 0 && (
                <ReferralDashboard
                  businessId={businesses[0]?.id}
                  businessHandle={businesses[0]?.business_handle}
                />
              )}
            </div>
          )}

          {activeTab === "claims" && (
            <div>
              <h2 className="font-bold text-[#0a1628] mb-5">Claim Requests</h2>

              {claims.length === 0 ? (
                <div className="bg-white/70 border border-dashed border-gray-200 rounded-2xl p-12 text-center">
                  <CheckCircle className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-600 mb-2">No claim requests</h3>
                  <p className="text-slate-500 text-sm">
                    When you claim a business, it will appear here for tracking.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {claims.map((c) => (
                    <div
                      key={c.id}
                      className={`${portalUI.card} flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between`}
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-[#0a1628] truncate">
                          {c.business_name || c.business_id}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Submitted {c.created_at ? new Date(c.created_at).toLocaleDateString() : "—"}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
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

          {activeTab === "insights" && (
            <div className="space-y-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className={portalUI.sectionKicker}>Founder Journey</p>
                  <h2 className={portalUI.sectionTitle}>Share Your Founder Journey</h2>
                  <p className={portalUI.sectionDesc}>
                    Your responses help Pacific Market build a clearer understanding of founder experiences
                    across Pacific communities. By identifying common challenges, growth patterns, and
                    opportunities, we can highlight where founders need more visibility, tools, and practical support.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className={`${portalUI.card} p-4 sm:p-8 mt-4`}>
                  <FounderInsightsAccordion
                    businessId={null}
                    onSubmit={handleFounderInsightsSubmit}
                    isLoading={insightsSubmitting}
                    initialData={insightSnapshots[0]}
                    onStart={() => setInsightsStarted(true)}
                  />
                </div>
              </div>

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
                        The more we understand founder experiences, the better we can spotlight patterns,
                        gaps, and opportunities across Pacific business communities.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-gray-200 bg-white/90 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0d4f4f]">Research</p>
                    <p className="mt-1 text-sm font-semibold text-[#0a1628]">Shared founder insight</p>
                    <p className="mt-2 text-xs text-slate-600">
                      Build a clearer view of founder experiences across Pacific communities.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-white/90 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#00c4cc]">Support</p>
                    <p className="mt-1 text-sm font-semibold text-[#0a1628]">Better support</p>
                    <p className="mt-2 text-xs text-slate-600">
                      Highlight where founders need more visibility, tools, and practical help.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-white/90 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#c9a84c]">Visibility</p>
                    <p className="mt-1 text-sm font-semibold text-[#0a1628]">Stronger founder voice</p>
                    <p className="mt-2 text-xs text-slate-600">
                      Help strengthen the visibility of Pacific founders across the registry.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "tools" && (
            <div>
              <h2 className="font-bold text-[#0a1628] mb-2">Business Tools</h2>
              <p className="text-slate-600 text-sm mb-6">Available to Moana subscribers.</p>

              {businesses.some((b) => b.subscription_tier === BUSINESS_TIER.MOANA) ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  <Link
                    href={createPageUrl("InvoiceGenerator")}
                    className={`${portalUI.card} hover:shadow-[0_18px_45px_rgba(10,22,40,0.12)] hover:border-[#0d4f4f]/30 transition-all group`}
                  >
                    <FileText className="w-8 h-8 text-[#0d4f4f] mb-4" />
                    <h3 className="font-bold text-[#0a1628] mb-2">Invoice Generator</h3>
                    <p className="text-slate-600 text-sm mb-4">
                      Create professional invoices with your Pacific business branding.
                    </p>
                    <span className="text-sm font-semibold text-[#0d4f4f] group-hover:gap-2 flex items-center gap-1">
                      Open Tool <ChevronRight className="w-4 h-4" />
                    </span>
                  </Link>

                  <Link
                    href={createPageUrl("QRCodeGenerator")}
                    className={`${portalUI.card} hover:shadow-[0_18px_45px_rgba(10,22,40,0.12)] hover:border-[#0d4f4f]/30 transition-all group`}
                  >
                    <QrCode className="w-8 h-8 text-[#0d4f4f] mb-4" />
                    <h3 className="font-bold text-[#0a1628] mb-2">QR Code Generator</h3>
                    <p className="text-slate-600 text-sm mb-4">
                      Generate QR codes linking to your registry profile or custom URL.
                    </p>
                    <span className="text-sm font-semibold text-[#0d4f4f] group-hover:gap-2 flex items-center gap-1">
                      Open Tool <ChevronRight className="w-4 h-4" />
                    </span>
                  </Link>

                  <Link
                    href={createPageUrl("signature-generator")}
                    className={`${portalUI.card} hover:shadow-[0_18px_45px_rgba(10,22,40,0.12)] hover:border-[#0d4f4f]/30 transition-all group`}
                  >
                    <Mail className="w-8 h-8 text-[#0d4f4f] mb-4" />
                    <h3 className="font-bold text-[#0a1628] mb-2">Email Signature</h3>
                    <p className="text-slate-600 text-sm mb-4">
                      Create professional email signatures with your business branding.
                    </p>
                    <span className="text-sm font-semibold text-[#0d4f4f] group-hover:gap-2 flex items-center gap-1">
                      Open Tool <ChevronRight className="w-4 h-4" />
                    </span>
                  </Link>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-[#c9a84c]/10 to-[#c9a84c]/5 border border-[#c9a84c]/30 rounded-2xl p-8 text-center">
                  <Star className="w-10 h-10 text-[#c9a84c] mx-auto mb-4" />
                  <h3 className="font-bold text-[#0a1628] mb-2">Featured+ Required</h3>
                  <p className="text-slate-600 text-sm mb-5">
                    Upgrade at least one business to Featured+ to unlock the Invoice and QR Code generators.
                  </p>
                  <Link
                    href={createPageUrl("Pricing")}
                    className="inline-flex items-center justify-center gap-2 bg-[#c9a84c] hover:bg-[#b8973b] text-white font-bold px-6 py-3 rounded-xl text-sm transition-all min-h-[44px] w-full sm:w-auto"
                  >
                    View Plans <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showAddOwnerModal && (
        <ModalWrapper
          isOpen={showAddOwnerModal}
          onClose={() => setShowAddOwnerModal(null)}
          className="max-w-md"
        >
          <ModalHeader
            title="Add Business Owner"
            onClose={() => setShowAddOwnerModal(null)}
          />

          <ModalContent>
            <p className="text-slate-600 text-sm mb-4">
              Add another person to manage this business. They'll receive an invite to claim access.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  value={newOwnerForm.name}
                  onChange={(e) => setNewOwnerForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. John Smith"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Email
                </label>
                <input
                  value={newOwnerForm.email}
                  onChange={(e) => setNewOwnerForm((p) => ({ ...p, email: e.target.value }))}
                  placeholder="john@example.com"
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              {showAddOwnerModal &&
                businesses.find((b) => b.id === showAddOwnerModal)?.owner_user_id && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-900">
                      <strong>Current Owner:</strong>{" "}
                      {getBusinessOwnerName(
                        businesses.find((b) => b.id === showAddOwnerModal)?.owner_user_id,
                        profiles
                      )}
                    </p>
                  </div>
                )}
            </div>
          </ModalContent>

          <ModalFooter>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3">
              <button
                onClick={() => setShowAddOwnerModal(null)}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#0d4f4f] hover:border-[#0d4f4f] transition w-full sm:w-auto min-h-[44px]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAddOwner(showAddOwnerModal)}
                disabled={addingOwner}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0d4f4f] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#1a6b6b] transition shadow-[0_12px_30px_rgba(13,79,79,0.35)] disabled:opacity-50 w-full sm:w-auto min-h-[44px]"
              >
                {addingOwner ? "Adding..." : "Add Owner"}
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
                Are you sure you want to delete this business? This action cannot be undone.
                Please make sure you no longer need this listing before continuing.
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