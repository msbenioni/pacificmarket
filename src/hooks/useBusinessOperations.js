import { useState } from "react";
import { getSupabase } from "@/lib/supabase/client";
import {
  prepareBusinessBrandingPayload,
} from "@/utils/brandingUploadUtils";
import { createBusinessWithBranding } from "@/utils/businessCreationWithBranding";
import { deleteBusiness, createBusiness } from "@/lib/supabase/queries/businesses";
import { sanitizeBusinessPayload, validateBusinessData } from "@/utils/dataTransformers";
import { useToast } from "@/components/ui/toast/ToastProvider";
import { SUBSCRIPTION_TIER } from "@/constants/unifiedConstants";

export function useBusinessOperations(refetchPortalData) {
  const { toast } = useToast();
  const [editingBusinessId, setEditingBusinessId] = useState(null);
  const [draftBusiness, setDraftBusiness] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [deleteConfirmBusiness, setDeleteConfirmBusiness] = useState(null);

  const startEditingBusiness = (business) => {
    setEditingBusinessId(business.id);
    setDraftBusiness(business);
  };

  const updateDraftBusiness = (updatedDraft) => {
    setDraftBusiness(updatedDraft);
  };

  const cancelEditingBusiness = () => {
    setEditingBusinessId(null);
    setDraftBusiness(null);
  };

  const validatePayload = ({ payload, context }) => {
    const validation = validateBusinessData(payload);
    if (validation.isValid) {
      return { isValid: true };
    }

    const message = `Please check these fields: ${Object.keys(validation.errors).join(", ")}`;
    console.error(`${context} validation errors:`, validation.errors);
    toast({
      title: "Validation Error",
      description: message,
      variant: "error",
    });
    return { isValid: false, message, errors: validation.errors };
  };

  const saveBusiness = async (businessData) => {
    console.log("🎯 saveBusiness called:", {
      businessId: businessData?.businessId,
      hasBusinessesData: !!businessData?.businessesData,
      hasBusinessInsightsData: !!businessData?.businessInsightsData,
      hasFiles: !!(businessData?.files && Object.keys(businessData.files).some((key) => businessData.files[key])),
      hasRemovals: !!(businessData?.removals && Object.values(businessData.removals).some(Boolean))
    });

    if (!businessData || !businessData.businessId) {
      const message = "Missing businessId - cannot save business.";
      toast({
        title: "Save Failed",
        description: message,
        variant: "error",
      });
      throw new Error(message);
    }

    if (!businessData.businessesData) {
      const message = "Missing businessesData - cannot save business.";
      toast({
        title: "Save Failed",
        description: message,
        variant: "error",
      });
      throw new Error(message);
    }

    setSavingEdit(true);
    const supabase = getSupabase();

    try {
      const { businessesData, businessInsightsData = {}, files = {}, removals = {} } = businessData;

      let businessesPayload = { ...businessesData };
      delete businessesPayload.logo_file;
      delete businessesPayload.banner_file;
      delete businessesPayload.mobile_banner_file;

      const subscriptionTier = businessesPayload.subscription_tier || SUBSCRIPTION_TIER.VAKA;
      const canUploadImages =
        subscriptionTier === SUBSCRIPTION_TIER.MANA || subscriptionTier === SUBSCRIPTION_TIER.MOANA;
      const hasFileUploads = Object.keys(files).some((key) => files[key]);

      if (!canUploadImages && hasFileUploads) {
        console.log("🎨 Vaka plan detected - ignoring uploaded files.");
      }

      const brandingPayload = await prepareBusinessBrandingPayload({
        supabase,
        businessId: businessData.businessId,
        businessesData: businessesPayload,
        files: canUploadImages ? files : {},
        removals,
      });

      console.log("🗄️ Branding payload prepared:", {
        logo_url: brandingPayload.logo_url ? "URL present" : "null/empty",
        banner_url: brandingPayload.banner_url ? "URL present" : "null/empty",
        mobile_banner_url: brandingPayload.mobile_banner_url ? "URL present" : "null/empty",
      });

      const consolidatedPayload = {
        ...brandingPayload,
        ...businessInsightsData,
      };

      const sanitizedPayload = sanitizeBusinessPayload(consolidatedPayload);
      const validationResult = validatePayload({ payload: sanitizedPayload, context: "Save" });

      if (!validationResult.isValid) {
        throw new Error(`Validation failed: ${validationResult.message}`);
      }

      if (!sanitizedPayload || Object.keys(sanitizedPayload).length === 0) {
        const message = "No valid fields to update. Please make changes before saving.";
        toast({
          title: "No Changes Detected",
          description: message,
          variant: "error",
        });
        throw new Error(message);
      }

      console.log("🗄️ Final payload before DB update:", {
        businessId: businessData.businessId,
        payloadFields: Object.keys(sanitizedPayload),
        brandingFields: {
          logo_url: sanitizedPayload.logo_url ? "URL present" : "null/empty",
          banner_url: sanitizedPayload.banner_url ? "URL present" : "null/empty",
          mobile_banner_url: sanitizedPayload.mobile_banner_url ? "URL present" : "null/empty",
        },
      });

      const { data: updatedBusiness, error: updateError } = await supabase
        .from("businesses")
        .update(sanitizedPayload)
        .eq("id", businessData.businessId)
        .select()
        .single();

      if (updateError) {
        console.error("Business update error:", updateError);
        throw new Error(`Failed to update business: ${updateError.message}`);
      }

      if (!updatedBusiness) {
        throw new Error("No data returned from database update.");
      }

      console.log("💾 DB updated row:", {
        id: updatedBusiness.id,
        logo_url: updatedBusiness.logo_url ? "URL present" : "null/empty",
        banner_url: updatedBusiness.banner_url ? "URL present" : "null/empty",
        mobile_banner_url: updatedBusiness.mobile_banner_url ? "URL present" : "null/empty",
      });

      await refetchPortalData();
      cancelEditingBusiness();

      toast({
        title: "Business Updated",
        description: "Your business details have been saved successfully.",
        variant: "success",
      });

      console.log("✅ Returning saved row:", {
        id: updatedBusiness.id,
        logo_url: updatedBusiness.logo_url ? "URL present" : "null/empty",
        banner_url: updatedBusiness.banner_url ? "URL present" : "null/empty",
        mobile_banner_url: updatedBusiness.mobile_banner_url ? "URL present" : "null/empty",
      });

      return updatedBusiness;
    } catch (error) {
      const message = error?.message || error?.toString() || "Unknown error";
      console.error("❌ Error updating business:", {
        message,
        businessId: businessData?.businessId,
        stack: error?.stack || null,
      });
      toast({
        title: "Save Failed",
        description: `Failed to save business: ${message}`,
        variant: "error",
      });
      throw error;
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteBusiness = async (businessId) => {
    if (!businessId) return;

    try {
      const error = await deleteBusiness(businessId);
      if (error) throw error;

      await refetchPortalData();
      setDeleteConfirmBusiness(null);
    } catch (error) {
      console.error("Error deleting business:", error);
    }
  };

  const handleAddBusiness = async (businessData) => {
    console.log("handleAddBusiness called with:", businessData);
    
    if (!businessData || !businessData.businessesData) {
      console.error("Invalid business data structure");
      toast({
        title: "Error",
        description: "Invalid business data provided",
        variant: "error"
      });
      return;
    }

    try {
      const supabase = getSupabase();

      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error("User not authenticated");
      }

      const { businessesData, businessInsightsData = {}, files = {}, removals = {} } = businessData;
      const subscriptionTier = businessesData.subscription_tier || SUBSCRIPTION_TIER.VAKA;
      const canUploadImages =
        subscriptionTier === SUBSCRIPTION_TIER.MANA || subscriptionTier === SUBSCRIPTION_TIER.MOANA;

      if (!canUploadImages && Object.keys(files).some((key) => files[key])) {
        console.log("🎨 Vaka plan detected - ignoring custom branding uploads.");
      }

      const baseCreatePayload = {
        ...businessesData,
        owner_user_id: user.id,
        status: "pending",
      };

      const validationResult = validatePayload({ payload: baseCreatePayload, context: "Create" });
      if (!validationResult.isValid) {
        return;
      }

      const newBusiness = await createBusinessWithBranding({
        supabase,
        businessesData: baseCreatePayload,
        businessInsightsData,
        files,
        removals,
        allowCustomBranding: canUploadImages,
        createRow: async (payloadToCreate) => {
          const { data, error } = await createBusiness(payloadToCreate);
          if (error) {
            throw error;
          }
          return data;
        },
      });

      console.log("Business created successfully:", newBusiness);

      await refetchPortalData();
      
      // Customize success message based on subscription tier
      const successMessage = !canUploadImages 
        ? "Business created! Your Vaka plan includes basic listing features. Upgrade to Mana or Moana to unlock custom branding and advanced features."
        : "Business created! Your business has been submitted for review and will appear in pending status.";
      
      toast({
        title: "Business Created",
        description: successMessage,
        variant: "success",
      });
    } catch (error) {
      console.error("Error creating business:", error);
      toast({
        title: "Creation Failed",
        description: `Failed to create business: ${error.message || "Unknown error"}`,
        variant: "error",
      });
    }
  };

  return {
    editingBusinessId,
    draftBusiness,
    savingEdit,
    deleteConfirmBusiness,
    setDeleteConfirmBusiness,
    startEditingBusiness,
    updateDraftBusiness,
    cancelEditingBusiness,
    saveBusiness,
    handleDeleteBusiness,
    handleAddBusiness,
  };
}
