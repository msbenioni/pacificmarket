import { useEffect, useCallback, useState, useRef } from "react";
import { useFormPersistence } from "./useFormPersistence";

/**
 * Hook to warn users before they lose unsaved form data by closing tabs or navigating away
 * Shows browser confirmation dialog when there are unsaved changes
 */
export function useTabPersistenceWarning(hasUnsavedChanges, formKey = "form") {
  
  // Handle before unload event (browser close/tab close)
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges()) {
        const message = `You have unsaved changes in your ${formKey}. Are you sure you want to leave?`;
        e.preventDefault();
        e.returnValue = message; // Required for some browsers
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges, formKey]);

  // Handle page visibility changes (user switches tabs/apps)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && hasUnsavedChanges()) {
        console.log(`⚠️ Unsaved changes detected in ${formKey}. Data is automatically saved locally.`);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [hasUnsavedChanges, formKey]);
}

/**
 * Enhanced hook that combines form persistence with tab warnings
 */
export function useFormWithPersistence(formKey, initialData = {}) {
  const {
    formData,
    setFormData,
    updateFormData,
    updateField,
    resetForm,
    clearPersistedData,
    hasUnsavedChanges,
  } = useFormPersistence(formKey, initialData);

  // Add tab persistence warning
  useTabPersistenceWarning(hasUnsavedChanges, formKey);

  return {
    formData,
    setFormData,
    updateFormData,
    updateField,
    resetForm,
    clearPersistedData,
    hasUnsavedChanges,
  };
}

/**
 * Hook to monitor and restore form data when user returns to tab
 */
export function useFormRestore(formKey, initialData = {}) {
  const [isRestored, setIsRestored] = useState(false);
  const hasLoggedRestore = useRef(false);
  
  useEffect(() => {
    // Check if there's persisted data when component mounts
    const storageKey = `form_data_${formKey}`;
    
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsedData = JSON.parse(stored);
          const hasChanges = JSON.stringify(parsedData) !== JSON.stringify(initialData);
          
          if (hasChanges && !hasLoggedRestore.current) {
            hasLoggedRestore.current = true;
            setIsRestored(true);
            console.log(`📝 Restored form data for ${formKey} from previous session`);
            
            // Auto-hide the restored message after 5 seconds
            const timeout = setTimeout(() => setIsRestored(false), 5000);
            return () => clearTimeout(timeout);
          }
        }
      } catch (error) {
        console.warn(`Error checking for restored form data:`, error);
      }
    }
  }, [formKey, initialData]);

  return { isRestored };
}
