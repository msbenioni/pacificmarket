import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { 
  saveFormData, 
  loadFormData, 
  clearFormData, 
  saveBaselineData, 
  hasUnsavedChanges as checkUnsavedChanges,
  markFormAsDiscarded,
  FormMetadata 
} from '@/utils/formPersistenceStorage';
import { generateFormKey, FormKeyOptions } from '@/utils/formPersistenceKeys';

export interface UseFormPersistenceV2Options {
  formKey: string;
  initialData: any;
  mode?: 'create' | 'edit';
  businessId?: string;
  onSaveSuccess?: () => void;
  onSaveFailure?: (error: any) => void;
}

export interface UseFormPersistenceV2Return {
  // Form state
  formData: any;
  setFormData: (data: any) => void;
  
  // Form updates
  updateFormData: (updates: any) => void;
  updateField: (field: string, value: any) => void;
  
  // Persistence control
  discardDraft: () => void;
  clearPersistedData: () => void;
  
  // State queries
  hasUnsavedChanges: () => boolean;
  isRestored: boolean;
  metadata: FormMetadata | null;
  
  // Actions
  markSaveSuccess: () => void;
  markSaveFailure: (error: any) => void;
}

/**
 * Consolidated form persistence hook
 * Single source of truth for all form persistence behavior
 */
export function useFormPersistenceV2(options: UseFormPersistenceV2Options): UseFormPersistenceV2Return {
  const { 
    formKey, 
    initialData, 
    mode = 'create', 
    businessId,
    onSaveSuccess,
    onSaveFailure
  } = options;
  
  // State management
  const [formData, setFormData] = useState<any>(initialData);
  const [isRestored, setIsRestored] = useState(false);
  const [metadata, setMetadata] = useState<FormMetadata | null>(null);
  
  // Refs to prevent duplicate operations
  const initializedRef = useRef(false);
  const baselineSetRef = useRef(false);
  const restoreLoggedRef = useRef(false);
  
  // Generate stable form key with validation
  const stableFormKey = useMemo(() => {
    try {
      if (mode === 'edit' && !businessId) {
        throw new Error('businessId is required for edit mode');
      }
      
      const keyOptions: FormKeyOptions = { mode, businessId: businessId || undefined };
      const key = generateFormKey(keyOptions);
      
      console.log(`🔑 Generated stable form key: ${key} (mode: ${mode}, businessId: ${businessId})`);
      return key;
    } catch (error) {
      console.error('Error generating form key:', error);
      return formKey; // Fallback to provided key
    }
  }, [mode, businessId, formKey]);
  
  // Initialize form data (load from storage or use initial data)
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    
    console.log(`🔧 Initializing form persistence for ${stableFormKey}`);
    
    const { data: storedData, metadata: storedMetadata, isRestored: wasRestored } = loadFormData(stableFormKey);
    
    if (wasRestored && storedData) {
      console.log(`📝 Restored form data for ${stableFormKey}`);
      setFormData(storedData);
      setIsRestored(true);
      setMetadata(storedMetadata);
      
      // Auto-hide restore notification after 5 seconds
      setTimeout(() => setIsRestored(false), 5000);
    } else {
      console.log(`🆕 Using initial data for ${stableFormKey}`);
      setFormData(initialData);
      setIsRestored(false);
      setMetadata(null);
    }
    
    // Set baseline after initialization
    if (!baselineSetRef.current) {
      baselineSetRef.current = true;
      const baselineData = wasRestored && storedData ? storedData : initialData;
      saveBaselineData(stableFormKey, baselineData);
    }
  }, [stableFormKey, initialData]);
  
  // Auto-save form data changes
  useEffect(() => {
    // Don't save on initial mount
    if (!initializedRef.current) return;
    
    // Don't save if data equals initial data and no previous draft existed
    if (!isRestored && JSON.stringify(formData) === JSON.stringify(initialData)) {
      return;
    }
    
    const metadata: Partial<FormMetadata> = {
      mode,
      businessId,
    };
    
    saveFormData(stableFormKey, formData, metadata);
    console.log(`💾 Auto-saved form data for ${stableFormKey}`);
  }, [formData, stableFormKey, initialData, isRestored, mode, businessId]);
  
  // Update form data
  const updateFormData = useCallback((updates: any) => {
    setFormData((prev: any) => ({ ...prev, ...updates }));
  }, []);
  
  // Update specific field
  const updateField = useCallback((field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  }, []);
  
  // Check if form has unsaved changes
  const hasUnsavedChanges = useCallback(() => {
    return checkUnsavedChanges(stableFormKey, formData);
  }, [stableFormKey, formData]);
  
  // Discard draft (cancel behavior)
  const discardDraft = useCallback(() => {
    console.log(`🗑️ Discarding draft for ${stableFormKey}`);
    
    // Mark as discarded to prevent immediate restore
    markFormAsDiscarded(stableFormKey);
    
    // Clear all persisted data
    clearFormData(stableFormKey);
    
    // Reset form to initial data
    setFormData(initialData);
    setIsRestored(false);
    setMetadata(null);
    
    // Reset baseline
    saveBaselineData(stableFormKey, initialData);
    
    console.log(`✅ Draft discarded successfully for ${stableFormKey}`);
  }, [stableFormKey, initialData]);
  
  // Clear persisted data (after successful save)
  const clearPersistedData = useCallback(() => {
    console.log(`🧹 Clearing persisted data for ${stableFormKey}`);
    clearFormData(stableFormKey);
    setIsRestored(false);
    setMetadata(null);
    
    // Update baseline to current data (since it was saved successfully)
    saveBaselineData(stableFormKey, formData);
  }, [stableFormKey, formData]);
  
  // Mark save success
  const markSaveSuccess = useCallback(() => {
    console.log(`✅ Marking save success for ${stableFormKey}`);
    clearPersistedData();
    onSaveSuccess?.();
  }, [stableFormKey, clearPersistedData, onSaveSuccess]);
  
  // Mark save failure
  const markSaveFailure = useCallback((error: any) => {
    console.log(`❌ Marking save failure for ${stableFormKey}:`, error);
    // Don't clear data on failure - keep the draft
    onSaveFailure?.(error);
  }, [stableFormKey, onSaveFailure]);
  
  return {
    // Form state
    formData,
    setFormData,
    
    // Form updates
    updateFormData,
    updateField,
    
    // Persistence control
    discardDraft,
    clearPersistedData,
    
    // State queries
    hasUnsavedChanges,
    isRestored,
    metadata,
    
    // Actions
    markSaveSuccess,
    markSaveFailure,
  };
}
