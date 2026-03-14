import { useState } from "react";
import { transformBusinessFormData } from "@/utils/businessDataTransformer";

export const useBusinessProfileForm = ({ businessId, onSave, initialData = null }) => {
  const [submitting, setSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errors, setErrors] = useState({ submit: undefined });

  const handleSave = async ({ businessId, businessesData, businessInsightsData, files = {}, saveAll = false }) => {
    setSubmitting(true);
    setErrors({ submit: undefined });

    try {
      // Call the parent save handler with table-based structure
      await onSave({
        businessId,
        businessesData,
        businessInsightsData,
        files,
        saveAll,
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
      
      return { success: true };
    } catch (error) {
      console.error("Failed to save business profile:", error);
      const errorMessage = error?.message || "Failed to save business profile. Please try again.";
      
      setErrors((prev) => ({
        ...prev,
        submit: errorMessage,
      }));

      return { success: false, error: errorMessage };
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveSection = async (formData, sectionKey) => {
    // Transform the form data to table-based structure
    const { businessesData, businessInsightsData } = transformBusinessFormData(formData);
    
    // For section saves, we might want to only save relevant fields
    // This could be enhanced to only save fields from the specific section
    return await handleSave({
      businessId,
      businessesData,
      businessInsightsData,
      saveAll: false,
    });
  };

  const handleSaveAll = async (formData) => {
    // Transform the form data to table-based structure
    const { businessesData, businessInsightsData } = transformBusinessFormData(formData);
    
    return await handleSave({
      businessId,
      businessesData,
      businessInsightsData,
      saveAll: true,
    });
  };

  const clearErrors = () => {
    setErrors({ submit: undefined });
  };

  const resetSuccess = () => {
    setSaveSuccess(false);
  };

  return {
    submitting,
    saveSuccess,
    errors,
    handleSave,
    handleSaveSection,
    handleSaveAll,
    clearErrors,
    resetSuccess,
  };
};
