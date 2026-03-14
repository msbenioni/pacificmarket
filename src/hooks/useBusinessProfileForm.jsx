import { useState } from "react";
import { transformBusinessFormData, sanitizeForBusinessesTable, sanitizeForBusinessInsightsTable } from "@/utils/businessDataTransformer";

export const useBusinessProfileForm = ({ businessId, onSave, initialData = null }) => {
  const [submitting, setSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errors, setErrors] = useState({ submit: undefined });

  const handleSave = async ({ businessId, publicData, privateData, files = {}, saveAll = false }) => {
    setSubmitting(true);
    setErrors({ submit: undefined });

    try {
      // Sanitize data for each table
      const sanitizedPublicData = sanitizeForBusinessesTable(publicData);
      const sanitizedPrivateData = sanitizeForBusinessInsightsTable(privateData);

      // Call the parent save handler
      await onSave({
        businessId,
        publicData: sanitizedPublicData,
        privateData: sanitizedPrivateData,
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
    // Transform the form data
    const { publicData, privateData } = transformBusinessFormData(formData);
    
    // For section saves, we might want to only save relevant fields
    // This could be enhanced to only save fields from the specific section
    return await handleSave({
      businessId,
      publicData,
      privateData,
      saveAll: false,
    });
  };

  const handleSaveAll = async (formData) => {
    // Transform the form data
    const { publicData, privateData } = transformBusinessFormData(formData);
    
    return await handleSave({
      businessId,
      publicData,
      privateData,
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
