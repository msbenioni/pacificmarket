"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createPageUrl } from "@/utils";
import { getUserBusinesses, deleteBusiness } from "@/lib/supabase/queries/businesses";
import {
  Building2,
  Users,
  FileText,
  CheckCircle,
  User,
  Plus,
  Search,
  AlertCircle,
  Zap,
  ArrowRight,
  Star,
  TrendingUp,
  ChevronRight,
  Trash2,
  Upload,
  QrCode,
  Mail,
} from "lucide-react";
import { canAccessBusinessFeatures } from "@/utils/roleHelpers";
import HeroRegistry from "../components/shared/HeroRegistry";
import { TIER_BENEFITS } from "@/constants/businessProfile";
import {
  SUBSCRIPTION_TIER,
  BUSINESS_STATUS,
  getTierDisplayName,
  COUNTRIES,
  INDUSTRIES,
} from "@/constants/unifiedConstants";
import InlineBusinessForm from "@/components/forms/InlineBusinessForm";
import FounderInsightsAccordion from "@/components/forms/FounderInsightsAccordion";
import BusinessInsightsAccordion from "@/components/forms/BusinessInsightsAccordion";
import { useOnboardingStatus } from "@/hooks/useOnboardingStatus";
import { ClaimAddBusinessModal } from "@/components/onboarding/ClaimAddBusinessModal";
import CancelClaimButton from "@/components/claims/CancelClaimButton";
import ProfileSettingsAccordion from "@/components/onboarding/ProfileSettingsAccordion";
import {
  ModalWrapper,
  ModalHeader,
  ModalContent,
  ModalFooter,
} from "@/components/shared/ModalWrapper";
import { getBusinessOwnerName, getCountryLabel, getIndustryLabel } from "@/utils/businessHelpers";
import PortalShell from "@/components/portal/PortalShell";
import { portalUI } from "@/components/portal/portalUI";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";
import { useToast } from "@/components/ui/toast/ToastProvider";
import ReferralDashboard from "@/components/referrals/ReferralDashboard";

// New tab components
import BusinessesTab from "@/components/portal/BusinessesTab";
import ClaimsTab from "@/components/portal/ClaimsTab";
import ProfileInsightsTab from "@/components/portal/ProfileInsightsTab";
import BusinessToolsTab from "@/components/portal/BusinessToolsTab";

// New constants
import { PORTAL_TABS, getTabStatus } from "@/constants/portalTabs";
import { BUTTON_STYLES } from "@/constants/portalUI";

export default function BusinessPortal() {
  const router = useRouter();
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
        .from("founder_insights")
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

  const handleBusinessInsightsSubmit = async (insightsData) => {
    setInsightsSubmitting(true);

    try {
      const { getSupabase } = await import("@/lib/supabase/client");
      const supabase = getSupabase();

      const { data: existingData } = await supabase
        .from("business_insights")
        .select("*")
        .eq("business_id", insightsData.business_id)
        .eq("user_id", insightsData.user_id)
        .single();

      let result;

      if (existingData?.id) {
        result = await supabase
          .from("business_insights")
          .update({
            ...insightsData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingData.id)
          .select();
      } else {
        result = await supabase
          .from("business_insights")
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
        description: "Your business insights were saved successfully.",
        variant: "success",
      });
    } catch (error) {
      console.error("Error submitting business insights:", error);
      toast({
        title: "Save Failed",
        description: `Failed to save insights: ${error.message || "Unknown error"}`,
        variant: "error",
      });
    } finally {
      setInsightsSubmitting(false);
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
          .from("founder_insights")
          .update({
            ...insightsData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id)
          .eq("user_id", insightsData.user_id)
          .select();
      } else {
        result = await supabase
          .from("founder_insights")
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
      router.push(createPageUrl("Login"));
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
    [SUBSCRIPTION_TIER.VAKA]: {
      label: getTierDisplayName(SUBSCRIPTION_TIER.VAKA),
      color: "text-gray-500 bg-gray-100",
    },
    [SUBSCRIPTION_TIER.MANA]: {
      label: getTierDisplayName(SUBSCRIPTION_TIER.MANA),
      color: "text-[#0d4f4f] bg-[#0d4f4f]/10",
    },
    [SUBSCRIPTION_TIER.MOANA]: {
      label: getTierDisplayName(SUBSCRIPTION_TIER.MOANA),
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
            {PORTAL_TABS.map((tab) => ({
              ...tab,
              count: tab.id === "my-businesses" ? businesses.length : 
                     tab.id === "claims" ? claims.length : undefined,
              status: getTabStatus(tab.id, { insightSnapshots, insightsStarted }),
            })).map((tab) => (
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
              </button>
            ))}
          </div>

          {activeTab === "my-businesses" && (
            <BusinessesTab
              businesses={businesses}
              user={user}
              profiles={profiles}
              onboardingStatus={onboardingStatus}
              editingBusinessId={editingBusinessId}
              draftBusiness={draftBusiness}
              savingEdit={savingEdit}
              insightsSubmitting={insightsSubmitting}
              insightsStarted={insightsStarted}
              tierInfo={tierInfo}
              checkoutLoading={checkoutLoading}
              onBusinessAction={(action, businessId, data) => {
                switch (action) {
                  case "edit":
                    startEditingBusiness(businesses.find(b => b.id === businessId));
                    break;
                  case "cancel":
                    cancelEditingBusiness();
                    break;
                  case "save":
                    saveBusiness(data);
                    break;
                  case "delete":
                    setDeleteConfirmBusiness(businessId);
                    break;
                  case "addOwner":
                    setShowAddOwnerModal(businessId);
                    break;
                  case "logoUpload":
                    // Handle logo upload
                    break;
                  case "insightsSubmit":
                    handleBusinessInsightsSubmit(data);
                    break;
                }
              }}
              onClaimAddAction={(action) => {
                setClaimAddDefaultView(action);
                setShowClaimAddModal(true);
              }}
              onUpgradeClick={createCheckoutSession}
            />
          )}

          {activeTab === "claims" && (
            <ClaimsTab
              claims={claims}
              onCancelSuccess={() => refetchPortalData()}
            />
          )}

          {activeTab === "insights" && (
            <ProfileInsightsTab
              user={user}
              businesses={businesses}
              insightsSubmitting={insightsSubmitting}
              insightsStarted={insightsStarted}
              insightSnapshots={insightSnapshots}
              onProfileComplete={async () => {
                await refetchOnboardingStatus();
                await refetchPortalData();
              }}
              onFounderInsightsSubmit={handleFounderInsightsSubmit}
            />
          )}

          {activeTab === "tools" && (
            <BusinessToolsTab businesses={businesses} />
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

      </PortalShell>
  );
}
