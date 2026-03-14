import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteBusiness, updateBusiness } from "@/lib/supabase/queries/businesses";
import { sanitizeBusinessPayload, validateBusinessData } from "@/utils/dataTransformers";
import { filterEmptyValues } from "@/utils/businessDataTransformer";
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
    
    if (!businessData || !businessData.businessId) {
      console.log("Early return: missing businessData or businessData.businessId");
      return;
    }

    // Debug the data structure
    console.log("Table-based data structure check:");
    console.log("- Has businessesData:", !!businessData.businessesData);
    console.log("- Has businessInsightsData:", !!businessData.businessInsightsData);
    console.log("- businessesData keys:", businessData.businessesData ? Object.keys(businessData.businessesData) : 'undefined');
    console.log("- businessInsightsData keys:", businessData.businessInsightsData ? Object.keys(businessData.businessInsightsData) : 'undefined');

    setSavingEdit(true);
    try {
      const { getSupabase } = await import("@/lib/supabase/client");
      const supabase = getSupabase();

      // Handle file uploads first
      let businessesDataForUpdate = {};
      
      // Extract the business data from the table-based structure
      if (businessData.businessesData) {
        businessesDataForUpdate = { ...businessData.businessesData };
        delete businessesDataForUpdate.logo_file;
        delete businessesDataForUpdate.banner_file;
        delete businessesDataForUpdate.mobile_banner_file;
      } else {
        throw new Error("Invalid data structure. Expected businessesData.");
      }
      
      // Upload logo if there's a new logo file
      if (businessData.files?.logo_file) {
        const file = businessData.files.logo_file;
        
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
        const fileName = `${businessData.businessId}-logo-${Date.now()}.${fileExt}`;
        const filePath = `logos/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('admin-listings')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('admin-listings')
          .getPublicUrl(filePath);

        businessesDataForUpdate.logo_url = publicUrl;
      }

      // Upload banner if there's a new banner file
      if (businessData.files?.banner_file) {
        const file = businessData.files.banner_file;
        
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
        const fileName = `${businessData.businessId}-banner-${Date.now()}.${fileExt}`;
        const filePath = `banners/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('admin-listings')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('admin-listings')
          .getPublicUrl(filePath);

        businessesDataForUpdate.banner_url = publicUrl;
      }

      // Upload mobile banner if there's a new mobile banner file
      if (businessData.files?.mobile_banner_file) {
        const file = businessData.files.mobile_banner_file;
        
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
        const fileName = `${businessData.businessId}-mobile-banner-${Date.now()}.${fileExt}`;
        const filePath = `mobile-banners/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('admin-listings')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('admin-listings')
          .getPublicUrl(filePath);

        businessesDataForUpdate.mobile_banner_url = publicUrl;
      }

      // Handle business insights data if provided
      let businessInsightsData = {};
      
      // Use the new unified form data structure
      if (businessData.businessesData && businessData.businessInsightsData) {
        // New unified form structure - data is already separated by table
        console.log('Using table-based data structure');
        console.log('Businesses data keys:', Object.keys(businessData.businessesData || {}));
        console.log('Business insights data keys:', Object.keys(businessData.businessInsightsData || {}));
        
        // Use the provided data directly
        businessInsightsData = { ...businessData.businessInsightsData };
      } else {
        // Error: Unsupported data structure
        throw new Error("Invalid data structure. Expected businessesData and businessInsightsData.");
      }

      console.log('Final businesses data for update:', businessesDataForUpdate);
      console.log('Final business insights data:', businessInsightsData);

      // Save public business data to businesses table
      const sanitizedPayload = sanitizeBusinessPayload(businessesDataForUpdate);
      console.log("Sanitized payload:", sanitizedPayload);
      
      console.log("Payload keys:", Object.keys(sanitizedPayload || {}));
      console.log("Payload values:", Object.values(sanitizedPayload || {}));
      
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

      // Check if payload is empty
      if (!sanitizedPayload || Object.keys(sanitizedPayload).length === 0) {
        console.error("Empty payload detected - nothing to update");
        toast({
          title: "No Changes Detected",
          description: "No valid fields to update. Please make some changes before saving.",
          variant: "error",
        });
        return;
      }

      console.log("Attempting to update business with:", {
        businessId: businessData.id,
        payloadFields: Object.keys(sanitizedPayload),
        payloadSize: JSON.stringify(sanitizedPayload).length
      });

      let businessError = null;
      let updateResult = null;
      
      try {
        const result = await supabase
          .from("businesses")
          .update(sanitizedPayload)
          .eq("id", businessData.businessId);
        
        updateResult = result;
        businessError = result.error;
        
        console.log("Supabase result:", {
          data: result.data,
          error: result.error,
          status: result.status,
          statusText: result.statusText,
          body: result.body
        });
      } catch (supabaseError) {
        console.error("Supabase operation threw exception:", supabaseError);
        businessError = supabaseError;
      }

      // Check for any type of error
      // Note: status 204 with no data is SUCCESS for UPDATE operations
      if (businessError || (updateResult?.status !== 204 && !updateResult?.data)) {
        const errorInfo = {
          error: businessError,
          errorType: typeof businessError,
          errorString: String(businessError),
          errorKeys: businessError ? Object.keys(businessError) : [],
          hasData: !!updateResult?.data,
          status: updateResult?.status,
          businessId: businessData.businessId,
          sanitizedPayload: sanitizedPayload,
          updateResult: updateResult
        };
        
        console.error("Business update error:", errorInfo);
        
        // Create a meaningful error message
        let errorMessage = "Unknown error occurred";
        if (businessError?.message) {
          errorMessage = businessError.message;
        } else if (businessError && typeof businessError === 'object') {
          errorMessage = `Database error: ${JSON.stringify(businessError)}`;
        } else if (typeof businessError === 'string') {
          errorMessage = businessError;
        } else if (updateResult?.status === 204) {
          // This is actually success, don't treat as error
          console.log("Update successful (status 204)");
        } else if (!updateResult?.data) {
          errorMessage = "No data returned from database - possible permission issue";
        }
        
        // Only throw error if it's actually an error (not 204 success)
        if (updateResult?.status !== 204) {
          throw new Error(`Failed to update business: ${errorMessage}`);
        }
      }

      // Save private data to business_insights table if any exists
      if (Object.keys(businessInsightsData).length > 0) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const currentYear = new Date().getFullYear();
        
        // Check if insights record exists for this year
        const { data: existingInsights, error: checkError } = await supabase
          .from("business_insights")
          .select("*")
          .eq("business_id", businessData.businessId)
          .eq("snapshot_year", currentYear)
          .maybeSingle();

        if (checkError) {
          console.error("Error checking existing insights:", checkError);
          throw new Error(`Failed to check business insights: ${checkError.message}`);
        }

        if (existingInsights) {
          // Update existing record
          const filteredInsightsData = filterEmptyValues(businessInsightsData);
          console.log("Filtered insights data:", filteredInsightsData);
          
          const { error: insightsError } = await supabase
            .from("business_insights")
            .update(filteredInsightsData)
            .eq("id", existingInsights.id);

          if (insightsError) {
            console.error("Business insights update error:", {
              error: insightsError,
              existingInsightsId: existingInsights.id,
              privateData: businessInsightsData
            });
            throw new Error(`Failed to update business insights: ${insightsError.message || JSON.stringify(insightsError)}`);
          }
        } else {
          // Create new record
          const filteredInsightsData = filterEmptyValues(businessInsightsData);
          console.log("Filtered insights data for insert:", filteredInsightsData);
          
          const { error: insightsError } = await supabase
            .from("business_insights")
            .insert({
              business_id: businessData.businessId,
              user_id: user.id,
              snapshot_year: currentYear,
              ...filteredInsightsData,
            });

          if (insightsError) {
            console.error("Business insights insert error:", {
              error: insightsError,
              businessId: businessData.businessId,
              userId: user.id,
              snapshotYear: currentYear,
              privateData: businessInsightsData
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
        businessId: businessData?.businessId || 'No ID',
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
