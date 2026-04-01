import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { 
  saveFormData, 
  loadFormData, 
  clearDraftData,
  clearAllFormPersistence,
  saveBaselineData, 
  hasUnsavedChanges as checkUnsavedChanges,
  markFormAsDiscarded,
  getFormStorageKeys
} from '@/utils/formPersistenceStorage.js';
import { generateFormKey } from '@/utils/formPersistenceKeys.js';

/**
 * Consolidated form persistence hook
 * Single source of truth for all form persistence behavior
 */
export function useFormPersistenceV2(options) {
  const { 
    formKey, 
    initialData, 
    mode = 'create', 
    businessId,
    onSaveSuccess,
    onSaveFailure
  } = options;
  
  // State management
  const [formData, setFormData] = useState(initialData);
  const [isRestored, setIsRestored] = useState(false);
  const [metadata, setMetadata] = useState(null);
  
  // Refs to prevent duplicate operations
  const initializedRef = useRef(false);
  const baselineSetRef = useRef(false);
  const restoreLoggedRef = useRef(false);
  
  // Refs to suppress autosave during critical operations
  const isDiscardingRef = useRef(false);
  const isClearingAfterSaveRef = useRef(false);
  const skipNextAutosaveRef = useRef(false);
  
  // Generate stable form key with validation
  const stableFormKey = useMemo(() => {
    try {
      if (mode === 'edit' && !businessId) {
        throw new Error('businessId is required for edit mode');
      }
      
      const keyOptions = { mode, businessId: businessId || undefined };
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
    
    console.log(`🔧 Initializing form persistence for ${stableFormKey} (mode: ${mode})`);
    
    // DEBUG: Check what exists in localStorage for create mode
    if (mode === 'create' && stableFormKey === 'admin_dashboard_business_create_draft') {
      const { formData, metadata, baseline, discardMarker } = getFormStorageKeys(stableFormKey);
      console.log(`🔍 DEBUG - Checking localStorage for create form:`);
      console.log(`  - formData key: ${formData}`, localStorage.getItem(formData) ? 'EXISTS' : 'EMPTY');
      console.log(`  - metadata key: ${metadata}`, localStorage.getItem(metadata) ? 'EXISTS' : 'EMPTY');
      console.log(`  - baseline key: ${baseline}`, localStorage.getItem(baseline) ? 'EXISTS' : 'EMPTY');
      console.log(`  - discardMarker key: ${discardMarker}`, localStorage.getItem(discardMarker) ? 'EXISTS' : 'EMPTY');
      
      // If there's old data but no discard marker, it might be from before our fix
      // Force clear it to ensure clean state
      if (localStorage.getItem(formData) && !localStorage.getItem(discardMarker)) {
        console.log(`🧹 DETECTED OLD CREATE DATA - Force clearing to ensure clean state`);
        clearAllFormPersistence(stableFormKey);
        console.log(`✅ Old create data force cleared`);
      }
    }
    
    const { data: storedData, metadata: storedMetadata, isRestored: wasRestored } = loadFormData(stableFormKey);
    
    if (wasRestored && storedData) {
      console.log(`📝 Restored form data for ${stableFormKey} (mode: ${mode})`);
      setFormData(storedData);
      setIsRestored(true);
      setMetadata(storedMetadata);
      
      // Auto-hide restore notification after 5 seconds
      setTimeout(() => setIsRestored(false), 5000);
    } else {
      console.log(`🆕 Using clean initial data for ${stableFormKey} (mode: ${mode})`);
      setFormData(initialData);
      setIsRestored(false);
      setMetadata(null);
    }
    
    // Set baseline after initialization
    if (!baselineSetRef.current) {
      baselineSetRef.current = true;
      // For create mode, always use clean initial data as baseline
      // For edit mode, use restored data or initial data
      const baselineData = mode === 'create' ? initialData : (wasRestored && storedData ? storedData : initialData);
      saveBaselineData(stableFormKey, baselineData);
      console.log(`📊 Baseline set for ${stableFormKey} (mode: ${mode})`);
    }
  }, [stableFormKey, initialData, mode]);
  
  // Auto-save form data changes
  useEffect(() => {
    // Don't save on initial mount
    if (!initializedRef.current) return;
    
    // Suppress autosave during critical operations
    if (isDiscardingRef.current) {
      console.log(`🚫 Autosave suppressed: discard in progress for ${stableFormKey}`);
      return;
    }
    
    if (isClearingAfterSaveRef.current) {
      console.log(`🚫 Autosave suppressed: clear-after-save in progress for ${stableFormKey}`);
      return;
    }
    
    if (skipNextAutosaveRef.current) {
      console.log(`🚫 Autosave suppressed: skip flag set for ${stableFormKey}`);
      skipNextAutosaveRef.current = false;
      return;
    }
    
    // Don't save if data equals initial data and no previous draft existed
    if (!isRestored && JSON.stringify(formData) === JSON.stringify(initialData)) {
      return;
    }
    
    const metadata = {
      mode,
      businessId,
    };
    
    saveFormData(stableFormKey, formData, metadata);
    console.log(`💾 Auto-saved form data for ${stableFormKey}`);
  }, [formData, stableFormKey, initialData, isRestored, mode, businessId]);
  
  // Update form data
  const updateFormData = useCallback((updates) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);
  
  // Update specific field
  const updateField = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);
  
  // Check if form has unsaved changes
  const hasUnsavedChanges = useCallback(() => {
    return checkUnsavedChanges(stableFormKey, formData);
  }, [stableFormKey, formData]);
  
  // Discard draft (cancel behavior) - async for proper cleanup
  const discardDraft = useCallback(async () => {
    console.log(`🗑️ DISCARD DRAFT STARTED for ${stableFormKey} (mode: ${mode})`);
    
    // Set discard flag to suppress autosave
    isDiscardingRef.current = true;
    
    // For CREATE mode: permanent deletion of all persistence data
    if (mode === 'create') {
      console.log(`🔥 CREATE MODE: Performing permanent deletion of all persistence data`);
      
      // Clear ALL persistence data (including discard marker) - this is authoritative
      clearAllFormPersistence(stableFormKey);
      console.log(`✅ ALL persistence data permanently deleted for create form ${stableFormKey}`);
      
      // Reset form to clean initial data
      setFormData(initialData);
      setIsRestored(false);
      setMetadata(null);
      console.log(`✅ Create form state reset to clean initial data`);
      
      // Reset baseline to clean initial data
      saveBaselineData(stableFormKey, initialData);
      console.log(`✅ Create baseline reset to clean initial data`);
      
    } else {
      // For EDIT mode: use discard marker for race condition protection
      console.log(`🔧 EDIT MODE: Using discard marker for race protection`);
      
      // Mark as discarded to prevent immediate restore
      markFormAsDiscarded(stableFormKey);
      console.log(`✅ Discard marker set for edit form ${stableFormKey}`);
      
      // Clear draft data ONLY (preserves discard marker for race protection)
      clearDraftData(stableFormKey);
      console.log(`✅ Edit draft data cleared (discard marker preserved)`);
      
      // Reset form to initial data
      setFormData(initialData);
      setIsRestored(false);
      setMetadata(null);
      console.log(`✅ Edit form state reset`);
      
      // Reset baseline
      saveBaselineData(stableFormKey, initialData);
      console.log(`✅ Edit baseline reset`);
    }
    
    // Wait a moment to ensure cleanup is complete before navigation
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Clear discard flag
    isDiscardingRef.current = false;
    console.log(`🔓 Discard flag cleared for ${stableFormKey}`);
    
    console.log(`🎉 DRAFT DISCARD COMPLETED for ${stableFormKey}`);
  }, [stableFormKey, initialData, mode]);
  
  // Clear persisted data (after successful save)
  const clearPersistedData = useCallback(() => {
    console.log(`🧹 Clearing persisted data for ${stableFormKey}`);
    
    // Set clear flag to suppress autosave
    isClearingAfterSaveRef.current = true;
    
    // Clear ALL persistence data (including discard marker)
    clearAllFormPersistence(stableFormKey);
    setIsRestored(false);
    setMetadata(null);
    
    // Update baseline to current data (since it was saved successfully)
    saveBaselineData(stableFormKey, formData);
    
    // Clear flag after a short delay
    setTimeout(() => {
      isClearingAfterSaveRef.current = false;
      console.log(`🔓 Clear-after-save flag cleared for ${stableFormKey}`);
    }, 1000);
  }, [stableFormKey, formData]);
  
  // Mark save success
  const markSaveSuccess = useCallback(() => {
    console.log(`✅ Marking save success for ${stableFormKey}`);
    clearPersistedData();
    onSaveSuccess?.();
  }, [stableFormKey, clearPersistedData, onSaveSuccess]);
  
  // Mark save failure
  const markSaveFailure = useCallback((error) => {
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
