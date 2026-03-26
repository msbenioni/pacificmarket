"use client";

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * 🏆 SHARED FORM HOOK - Standardized Form Pattern
 * 
 * This hook provides a consistent data flow pattern for all forms in the application.
 * It handles:
 * - Local state management
 * - Parent-child synchronization
 * - Data persistence during interactions
 * - Debug logging
 * - Auto-save functionality
 * - Error handling
 * - Form lifecycle management
 */

export const FORM_MODES = {
  CREATE: 'create',
  EDIT: 'edit',
  ADMIN_CREATE: 'admin-create',
  ADMIN_EDIT: 'admin-edit',
  EMBEDDED: 'embedded',
};

export const AUTO_SAVE_CONFIG = {
  DISABLED: 'disabled',
  ON_CHANGE: 'on-change',
  ON_BLUR: 'on-blur',
  ON_SECTION_TOGGLE: 'on-section-toggle',
};

/**
 * 🎯 Main Shared Form Hook
 * 
 * @param {Object} options - Form configuration options
 * @returns {Object} Form state and handlers
 */
export function useSharedForm({
  initialData = null,
  onDataChange = null,
  onSave = null,
  onValidate = null,
  defaultState = {},
  mode = FORM_MODES.CREATE,
  autoSave = AUTO_SAVE_CONFIG.DISABLED,
  debug = false,
  autoSaveDelay = 1000,
  preserveData = true,
  dependencyFields = [],
} = {}) {
  // 🏗️ Core State Management
  const [formData, setFormData] = useState(() => buildInitialState(initialData, defaultState));
  const [originalData, setOriginalData] = useState(() => initialData);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedData, setLastSavedData] = useState(null);
  const [errors, setErrors] = useState({});
  const [warnings, setWarnings] = useState({});
  
  // 🔄 Auto-save State
  const [autoSaveStatus, setAutoSaveStatus] = useState('idle'); // 'idle' | 'pending' | 'saving' | 'success' | 'error'
  const autoSaveTimeoutRef = useRef(null);
  
  // 📊 Form Lifecycle State
  const [hasStarted, setHasStarted] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [submitAttempts, setSubmitAttempts] = useState(0);

  // 🐛 Debug Logging
  const log = useCallback((message, data = null, level = 'info') => {
    if (!debug) return;
    
    const timestamp = new Date().toISOString();
    const prefix = `[useSharedForm:${mode}] ${timestamp}`;
    
    switch (level) {
      case 'error':
        console.error(prefix, message, data);
        break;
      case 'warn':
        console.warn(prefix, message, data);
        break;
      case 'info':
      default:
        console.log(prefix, message, data);
        break;
    }
  }, [debug, mode]);

  // 🏗️ Build Initial State
  function buildInitialState(data, defaults) {
    if (!data && !defaults) return {};
    
    const state = { ...defaults };
    
    if (data) {
      // Deep merge data with defaults
      Object.keys(data).forEach(key => {
        if (Array.isArray(data[key])) {
          state[key] = [...data[key]];
        } else if (typeof data[key] === 'object' && data[key] !== null) {
          state[key] = { ...data[key] };
        } else {
          state[key] = data[key];
        }
      });
    }
    
    return state;
  }

  // 🔄 Re-initialize Form When Dependencies Change
  useEffect(() => {
    const hasDependencyChanged = dependencyFields.some(field => {
      const currentValue = initialData?.[field];
      const originalValue = originalData?.[field];
      return JSON.stringify(currentValue) !== JSON.stringify(originalValue);
    });

    if (hasDependencyChanged) {
      log('Dependency changed, re-initializing form', { dependencyFields, initialData });
      const newState = buildInitialState(initialData, defaultState);
      setFormData(newState);
      setOriginalData(initialData);
      setIsDirty(false);
      setErrors({});
      setWarnings({});
    }
  }, [initialData, originalData, dependencyFields, log]);

  // 🔄 Initialize Form
  useEffect(() => {
    if (!isInitialized && initialData) {
      log('Form initializing', { initialData, mode });
      const newState = buildInitialState(initialData, defaultState);
      setFormData(newState);
      setOriginalData(initialData);
      setIsInitialized(true);
      log('Form initialized', { newState });
    }
  }, [initialData, defaultState, isInitialized, log]);

  // 🔄 Parent Sync - Notify parent of changes
  useEffect(() => {
    if (onDataChange && isDirty) {
      log('Notifying parent of data change', { formData, isDirty });
      onDataChange(formData, isDirty);
    }
  }, [formData, isDirty, onDataChange, log]);

  // 🧹 Cleanup Auto-save Timeout
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  // 🎯 Core Form Handlers

  /**
   * Update a single form field
   */
  const updateField = useCallback((field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      log('Field updated', { field, value, oldValue: prev[field] });
      return newData;
    });
    
    // Mark as dirty if value changed from original
    if (originalData?.[field] !== value) {
      setIsDirty(true);
      setHasStarted(true);
    }
    
    // Clear field-specific errors when user updates
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [originalData, errors, log]);

  /**
   * Update multiple form fields
   */
  const updateFields = useCallback((updates) => {
    setFormData(prev => {
      const newData = { ...prev, ...updates };
      log('Fields updated', { updates, oldData: prev });
      return newData;
    });
    
    // Check if any field changed from original
    const hasChanges = Object.keys(updates).some(field => 
      originalData?.[field] !== updates[field]
    );
    
    if (hasChanges) {
      setIsDirty(true);
      setHasStarted(true);
    }
  }, [originalData, log]);

  /**
   * Update nested form field (for objects/arrays)
   */
  const updateNestedField = useCallback((fieldPath, value) => {
    setFormData(prev => {
      const newData = { ...prev };
      const keys = fieldPath.split('.');
      let current = newData;
      
      // Navigate to the parent object
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      // Set the final value
      current[keys[keys.length - 1]] = value;
      
      log('Nested field updated', { fieldPath, value });
      return newData;
    });
    
    setIsDirty(true);
    setHasStarted(true);
  }, [log]);

  /**
   * Add item to array field
   */
  const addArrayItem = useCallback((field, item) => {
    setFormData(prev => {
      const currentArray = Array.isArray(prev[field]) ? prev[field] : [];
      const newArray = [...currentArray, item];
      log('Array item added', { field, item, newLength: newArray.length });
      return { ...prev, [field]: newArray };
    });
    
    setIsDirty(true);
    setHasStarted(true);
  }, [log]);

  /**
   * Remove item from array field
   */
  const removeArrayItem = useCallback((field, index) => {
    setFormData(prev => {
      const currentArray = Array.isArray(prev[field]) ? prev[field] : [];
      const newArray = currentArray.filter((_, i) => i !== index);
      log('Array item removed', { field, index, removedItem: currentArray[index] });
      return { ...prev, [field]: newArray };
    });
    
    setIsDirty(true);
    setHasStarted(true);
  }, [log]);

  /**
   * Toggle array item (add if not present, remove if present)
   */
  const toggleArrayItem = useCallback((field, item) => {
    setFormData(prev => {
      const currentArray = Array.isArray(prev[field]) ? prev[field] : [];
      const itemIndex = currentArray.indexOf(item);
      
      let newArray;
      if (itemIndex > -1) {
        newArray = currentArray.filter((_, i) => i !== itemIndex);
        log('Array item toggled (removed)', { field, item });
      } else {
        newArray = [...currentArray, item];
        log('Array item toggled (added)', { field, item });
      }
      
      return { ...prev, [field]: newArray };
    });
    
    setIsDirty(true);
    setHasStarted(true);
  }, [log]);

  // 💾 Save Operations

  /**
   * Trigger auto-save if enabled
   */
  const triggerAutoSave = useCallback(() => {
    if (autoSave === AUTO_SAVE_CONFIG.DISABLED || !onSave) return;
    
    log('Auto-save triggered', { autoSave, delay: autoSaveDelay });
    
    // Clear existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    
    // Set new timeout
    setAutoSaveStatus('pending');
    autoSaveTimeoutRef.current = setTimeout(async () => {
      try {
        setAutoSaveStatus('saving');
        await handleSave(true); // true = auto-save
        setAutoSaveStatus('success');
        log('Auto-save completed successfully');
        
        // Clear success status after 2 seconds
        setTimeout(() => setAutoSaveStatus('idle'), 2000);
      } catch (error) {
        setAutoSaveStatus('error');
        log('Auto-save failed', error, 'error');
        
        // Clear error status after 3 seconds
        setTimeout(() => setAutoSaveStatus('idle'), 3000);
      }
    }, autoSaveDelay);
  }, [autoSave, autoSaveDelay, onSave, log]);

  /**
   * Handle form save (manual or auto)
   */
  const handleSave = useCallback(async (isAutoSave = false) => {
    if (!onSave) {
      log('Save attempted but no onSave handler provided', null, 'warn');
      return false;
    }
    
    // Validate form if validator provided
    if (onValidate) {
      const validationResult = onValidate(formData);
      if (validationResult !== true) {
        setErrors(validationResult.errors || {});
        setWarnings(validationResult.warnings || {});
        log('Validation failed', validationResult);
        return false;
      }
    }
    
    setIsSaving(true);
    setSubmitAttempts(prev => prev + 1);
    
    try {
      log(`${isAutoSave ? 'Auto-save' : 'Manual save'} starting`, { formData });
      
      const result = await onSave(formData, {
        mode,
        isAutoSave,
        originalData,
        submitAttempts: submitAttempts + 1,
      });
      
      // Update last saved data
      setLastSavedData({ ...formData });
      setOriginalData({ ...formData });
      setIsDirty(false);
      setErrors({});
      
      log(`${isAutoSave ? 'Auto-save' : 'Manual save'} completed successfully`, { result });
      return result;
      
    } catch (error) {
      log(`${isAutoSave ? 'Auto-save' : 'Manual save'} failed`, error, 'error');
      setErrors(prev => ({
        ...prev,
        submit: error.message || 'Save failed. Please try again.',
      }));
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [formData, mode, originalData, submitAttempts, onSave, onValidate, log]);

  /**
   * Reset form to original data
   */
  const resetForm = useCallback(() => {
    log('Form reset to original data', { originalData });
    const resetState = buildInitialState(originalData, defaultState);
    setFormData(resetState);
    setIsDirty(false);
    setErrors({});
    setWarnings({});
    setHasStarted(false);
    
    // Clear auto-save
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
      setAutoSaveStatus('idle');
    }
  }, [originalData, defaultState, log]);

  /**
   * Clear form completely
   */
  const clearForm = useCallback(() => {
    log('Form cleared');
    const clearedState = buildInitialState(null, defaultState);
    setFormData(clearedState);
    setOriginalData(null);
    setIsDirty(false);
    setErrors({});
    setWarnings({});
    setHasStarted(false);
    setLastSavedData(null);
    
    // Clear auto-save
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
      setAutoSaveStatus('idle');
    }
  }, [defaultState, log]);

  // 🔄 Field Change Handlers with Auto-save

  /**
   * Handle field change with auto-save trigger
   */
  const handleFieldChange = useCallback((field, value) => {
    updateField(field, value);
    
    // Trigger auto-save if enabled
    if (autoSave === AUTO_SAVE_CONFIG.ON_CHANGE) {
      triggerAutoSave();
    }
  }, [updateField, autoSave, triggerAutoSave]);

  /**
   * Handle multiple field changes with auto-save trigger
   */
  const handleFieldsChange = useCallback((updates) => {
    updateFields(updates);
    
    // Trigger auto-save if enabled
    if (autoSave === AUTO_SAVE_CONFIG.ON_CHANGE) {
      triggerAutoSave();
    }
  }, [updateFields, autoSave, triggerAutoSave]);

  // 📊 Form State Helpers

  /**
   * Check if field has changed from original
   */
  const isFieldDirty = useCallback((field) => {
    return JSON.stringify(formData[field]) !== JSON.stringify(originalData?.[field]);
  }, [formData, originalData]);

  /**
   * Get all dirty fields
   */
  const getDirtyFields = useCallback(() => {
    const dirtyFields = {};
    Object.keys(formData).forEach(field => {
      if (isFieldDirty(field)) {
        dirtyFields[field] = formData[field];
      }
    });
    return dirtyFields;
  }, [formData, isFieldDirty]);

  /**
   * Check if form is valid
   */
  const isValid = useCallback(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);

  /**
   * Get form summary for debugging
   */
  const getFormSummary = useCallback(() => {
    return {
      mode,
      isDirty,
      isSaving,
      isValid: isValid(),
      hasStarted,
      isInitialized,
      autoSaveStatus,
      fieldCount: Object.keys(formData).length,
      dirtyFieldCount: Object.keys(getDirtyFields()).length,
      errorCount: Object.keys(errors).length,
      warningCount: Object.keys(warnings).length,
      submitAttempts,
      hasOriginalData: !!originalData,
      hasLastSavedData: !!lastSavedData,
    };
  }, [mode, isDirty, isSaving, isValid, hasStarted, isInitialized, autoSaveStatus, formData, getDirtyFields, errors, warnings, submitAttempts, originalData, lastSavedData]);

  // 🎯 Return Form Interface
  return {
    // 📊 Form State
    formData,
    originalData,
    isDirty,
    isSaving,
    errors,
    warnings,
    hasStarted,
    isInitialized,
    autoSaveStatus,
    submitAttempts,
    lastSavedData,

    // 🎯 Field Handlers
    updateField,
    updateFields,
    updateNestedField,
    addArrayItem,
    removeArrayItem,
    toggleArrayItem,

    // 🔄 Change Handlers (with auto-save)
    handleFieldChange,
    handleFieldsChange,

    // 💾 Save Operations
    handleSave,
    triggerAutoSave,

    // 🔄 Form Management
    resetForm,
    clearForm,

    // 📊 Helpers
    isFieldDirty,
    getDirtyFields,
    isValid,
    getFormSummary,

    // 🛠️ Utilities
    log,
  };
}

/**
 * 🎯 Helper: Create form-specific hook with defaults
 */
export function createFormHook(config = {}) {
  return (options = {}) => useSharedForm({ 
    initialData: null,
    onDataChange: null,
    onSave: null,
    onValidate: null,
    defaultState: {},
    mode: FORM_MODES.CREATE,
    autoSave: AUTO_SAVE_CONFIG.DISABLED,
    debug: false,
    autoSaveDelay: 1000,
    preserveData: true,
    dependencyFields: [],
    ...config, 
    ...options 
  });
}

/**
 * 🎯 Helper: Common validation patterns
 */
export const ValidationPatterns = {
  required: (value) => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return 'This field is required';
    }
    return null;
  },
  
  email: (value) => {
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Please enter a valid email address';
    }
    return null;
  },
  
  phone: (value) => {
    if (value && !/^\+?[\d\s-()]+$/.test(value)) {
      return 'Please enter a valid phone number';
    }
    return null;
  },
  
  url: (value) => {
    if (value && !/^https?:\/\/.+/.test(value)) {
      return 'Please enter a valid URL starting with http:// or https://';
    }
    return null;
  },
  
  minLength: (min) => (value) => {
    if (value && value.length < min) {
      return `Must be at least ${min} characters`;
    }
    return null;
  },
  
  maxLength: (max) => (value) => {
    if (value && value.length > max) {
      return `Must be no more than ${max} characters`;
    }
    return null;
  },
};

/**
 * 🎯 Helper: Create validator from patterns
 */
export function createValidator(fieldValidators) {
  return (formData) => {
    const errors = {};
    const warnings = {};
    
    Object.entries(fieldValidators).forEach(([field, validators]) => {
      const value = formData[field];
      const fieldValidators = Array.isArray(validators) ? validators : [validators];
      
      fieldValidators.forEach(validator => {
        if (typeof validator === 'function') {
          const result = validator(value);
          if (result) {
            if (typeof result === 'string') {
              errors[field] = result;
            } else if (result && typeof result === 'object' && result.type === 'warning') {
              warnings[field] = result.message;
            } else if (result && typeof result === 'object' && result.type === 'error') {
              errors[field] = result.message;
            }
          }
        }
      });
    });
    
    return Object.keys(errors).length === 0 ? true : { errors, warnings };
  };
}

export default useSharedForm;
