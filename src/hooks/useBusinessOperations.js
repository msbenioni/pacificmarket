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

      const sanitizedPayload = sanitizeBusinessPayload(businessData);
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

      const { error } = await supabase
        .from("businesses")
        .update(sanitizedPayload)
        .eq("id", businessData.id);

      if (error) throw error;

      await refetchPortalData();
      cancelEditingBusiness();
      
      toast({
        title: "Business Updated",
        description: "Your business details have been saved successfully.",
        variant: "success",
      });
    } catch (error) {
      console.error("Error updating business:", error);
      toast({
        title: "Save Failed",
        description: `Failed to save business: ${error.message || "Unknown error"}`,
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
