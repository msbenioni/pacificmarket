import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteBusiness, updateBusiness } from "@/lib/supabase/queries/businesses";
import { sanitizeBusinessPayload, validateBusinessData } from "@/utils/dataTransformers";
import { createPageUrl } from "@/utils";
import { useToast } from "@/components/ui/toast/ToastProvider";

export function useBusinessOperations(refetchPortalData) {
  const router = useRouter();
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
    console.log("updateDraftBusiness called with:", updatedDraft);
    setDraftBusiness(updatedDraft);
  };

  const cancelEditingBusiness = () => {
    setEditingBusinessId(null);
    setDraftBusiness(null);
  };

  const saveBusiness = async (businessData) => {
    console.log("saveBusiness called with:", businessData);
    
    if (!businessData || !businessData.id) {
      console.log("Early return: missing businessData or businessData.id");
      return;
    }

    setSavingEdit(true);
    try {
      const { getSupabase } = await import("@/lib/supabase/client");
      const supabase = getSupabase();

      // Handle file uploads first
      let updatedData = { ...businessData };
      
      // Upload logo if there's a new logo file
      if (businessData.logo_file) {
        const file = businessData.logo_file;
        
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
          throw new Error(`Unsupported file type: ${file.type}. Please use JPG, PNG, GIF, or WebP images.`);
        }
        
        // Validate file size (5MB max)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
          throw new Error(`File too large: ${Math.round(file.size / 1024 / 1024)}MB. Maximum size is 5MB.`);
        }
        
        const fileExt = file.name.split('.').pop();
        const fileName = `${businessData.id}-logo-${Date.now()}.${fileExt}`;
        const filePath = `logos/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('admin-listings')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('admin-listings')
          .getPublicUrl(filePath);

        updatedData.logo_url = publicUrl;
        delete updatedData.logo_file; // Remove file object from data
      }

      // Upload banner if there's a new banner file
      if (businessData.banner_file) {
        const file = businessData.banner_file;
        
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
          throw new Error(`Unsupported file type: ${file.type}. Please use JPG, PNG, GIF, or WebP images.`);
        }
        
        // Validate file size (5MB max)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
          throw new Error(`File too large: ${Math.round(file.size / 1024 / 1024)}MB. Maximum size is 5MB.`);
        }
        
        const fileExt = file.name.split('.').pop();
        const fileName = `${businessData.id}-banner-${Date.now()}.${fileExt}`;
        const filePath = `banners/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('admin-listings')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('admin-listings')
          .getPublicUrl(filePath);

        updatedData.banner_url = publicUrl;
        delete updatedData.banner_file; // Remove file object from data
      }

      // Separate public and private data
      const publicBusinessData = { ...updatedData };
      const privateBusinessData = {};

      // Fields that should go to business_insights table
      const privateFields = ['private_business_phone', 'private_business_email'];
      
      privateFields.forEach(field => {
        if (publicBusinessData[field] !== undefined) {
          privateBusinessData[field] = publicBusinessData[field];
          delete publicBusinessData[field]; // Remove from public data
        }
      });

      console.log('Public business data:', publicBusinessData);
      console.log('Private business data:', privateBusinessData);

      // Save public business data to businesses table
      const sanitizedPayload = sanitizeBusinessPayload(publicBusinessData);
      console.log("Sanitized payload:", sanitizedPayload);
      
      const validation = validateBusinessData(sanitizedPayload);
      console.log("Validation result:", validation);

      if (!validation.isValid) {
        console.error("Validation errors:", validation.errors);
        toast({
          title: "Validation Error",
          description: `Please check these fields: ${Object.keys(validation.errors).join(", ")}`,
          variant: "error",
        });
        return;
      }

      const { error: businessError } = await supabase
        .from("businesses")
        .update(sanitizedPayload)
        .eq("id", businessData.id);

      if (businessError) {
        console.error("Business update error:", {
          error: businessError,
          businessId: businessData.id,
          sanitizedPayload: sanitizedPayload
        });
        throw new Error(`Failed to update business: ${businessError.message || JSON.stringify(businessError)}`);
      }

      // Save private data to business_insights table if any exists
      if (Object.keys(privateBusinessData).length > 0) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const currentYear = new Date().getFullYear();
        
        // Check if insights record exists for this year
        const { data: existingInsights } = await supabase
          .from("business_insights")
          .select("*")
          .eq("business_id", businessData.id)
          .eq("snapshot_year", currentYear)
          .single();

        if (existingInsights) {
          // Update existing record
          const { error: insightsError } = await supabase
            .from("business_insights")
            .update(privateBusinessData)
            .eq("id", existingInsights.id);

          if (insightsError) {
            console.error("Business insights update error:", {
              error: insightsError,
              existingInsightsId: existingInsights.id,
              privateData: privateBusinessData
            });
            throw new Error(`Failed to update business insights: ${insightsError.message || JSON.stringify(insightsError)}`);
          }
        } else {
          // Create new record
          const { error: insightsError } = await supabase
            .from("business_insights")
            .insert({
              business_id: businessData.id,
              user_id: user.id,
              snapshot_year: currentYear,
              ...privateBusinessData,
            });

          if (insightsError) {
            console.error("Business insights insert error:", {
              error: insightsError,
              businessId: businessData.id,
              userId: user.id,
              snapshotYear: currentYear,
              privateData: privateBusinessData
            });
            throw new Error(`Failed to save business insights: ${insightsError.message || JSON.stringify(insightsError)}`);
          }
        }
      }

      await refetchPortalData();
      cancelEditingBusiness();
      
      toast({
        title: "Business Updated",
        description: "Your business details have been saved successfully.",
        variant: "success",
      });
    } catch (error) {
      // Enhanced error logging for debugging
      const errorDetails = {
        message: error?.message || error?.toString() || 'Unknown error',
        details: error?.details || null,
        stack: error?.stack || null,
        businessId: businessData?.id || 'No ID',
        businessName: businessData?.name || 'No name',
        timestamp: new Date().toISOString()
      };
      
      console.error("Error updating business:", errorDetails);
      toast({
        title: "Save Failed",
        description: `Failed to save business: ${errorDetails.message}`,
        variant: "error",
      });
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

  const handleLogoUpload = async (event, businessId) => {
    const file = event.target.files[0];
    if (!file || !businessId) return;

    try {
      const { getSupabase } = await import("@/lib/supabase/client");
      const supabase = getSupabase();

      const fileExt = file.name.split('.').pop();
      const fileName = `${businessId}-${Date.now()}.${fileExt}`;
      const filePath = `business-logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('business-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('business-assets')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('businesses')
        .update({ logo_url: publicUrl })
        .eq('id', businessId);

      if (updateError) throw updateError;

      await refetchPortalData();
    } catch (error) {
      console.error("Error uploading logo:", error);
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
    handleLogoUpload,
  };
}
