import { useState, useEffect, useCallback } from "react";

/**
 * Hook for persisting form data in localStorage
 * Prevents data loss when user navigates away or switches tabs
 */
export function useFormPersistence(formKey, initialData = {}) {
  const storageKey = `form_data_${formKey}`;
  
  // Initialize form state from localStorage or initialData
  const [formData, setFormData] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsedData = JSON.parse(stored);
          // Merge with initialData to ensure all fields exist
          return { ...initialData, ...parsedData };
        }
      } catch (error) {
        console.warn(`Error loading form data from localStorage:`, error);
      }
    }
    return initialData;
  });

  // Save to localStorage whenever formData changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(storageKey, JSON.stringify(formData));
      } catch (error) {
        console.warn(`Error saving form data to localStorage:`, error);
      }
    }
  }, [formData, storageKey]);

  // Update form data
  const updateFormData = useCallback((updates) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  // Update specific field
  const updateField = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  // Reset form to initial data
  const resetForm = useCallback(() => {
    setFormData(initialData);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(storageKey);
    }
  }, [initialData, storageKey]);

  // Clear persisted data (for when form is successfully submitted)
  const clearPersistedData = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(storageKey);
    }
  }, [storageKey]);

  // Check if form has unsaved changes
  const hasUnsavedChanges = useCallback(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null;
    if (!stored) return false;
    
    try {
      const parsedData = JSON.parse(stored);
      // Compare with initialData to check if there are changes
      return JSON.stringify(parsedData) !== JSON.stringify(initialData);
    } catch (error) {
      return false;
    }
  }, [storageKey, initialData]);

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
 * Hook for managing multiple forms with persistence
 * Useful when you have different form types (create, edit, etc.)
 */
export function useFormManager() {
  // Get all persisted form keys
  const getAllPersistedForms = useCallback(() => {
    if (typeof window === 'undefined') return [];
    
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('form_data_')) {
        keys.push(key.replace('form_data_', ''));
      }
    }
    return keys;
  }, []);

  // Clear all persisted form data
  const clearAllPersistedForms = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    const keys = getAllPersistedForms();
    keys.forEach(formKey => {
      localStorage.removeItem(`form_data_${formKey}`);
    });
  }, [getAllPersistedForms]);

  // Clear specific form data
  const clearForm = useCallback((formKey) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`form_data_${formKey}`);
    }
  }, []);

  return {
    getAllPersistedForms,
    clearAllPersistedForms,
    clearForm,
  };
}
