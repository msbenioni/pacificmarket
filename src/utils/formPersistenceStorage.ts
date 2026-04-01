/**
 * Form Persistence Storage Utilities
 * Centralized storage contract for form draft persistence
 */

export interface FormStorageKeys {
  formData: string;
  metadata: string;
  baseline: string;
  discardMarker: string;
}

export interface FormMetadata {
  createdAt: number;
  updatedAt: number;
  formKey: string;
  mode: 'create' | 'edit';
  businessId?: string;
  version: string;
}

export interface FormDiscardMarker {
  discardedAt: number;
  formKey: string;
}

/**
 * Generate consistent storage keys for a form
 */
export function getFormStorageKeys(formKey: string): FormStorageKeys {
  return {
    formData: `form_data_${formKey}`,
    metadata: `form_meta_${formKey}`,
    baseline: `form_baseline_${formKey}`,
    discardMarker: `form_discard_${formKey}`,
  };
}

/**
 * Check if a form was recently discarded (to prevent restore)
 */
export function isFormRecentlyDiscarded(formKey: string, maxAgeMs: number = 5000): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const { discardMarker } = getFormStorageKeys(formKey);
    const marker = localStorage.getItem(discardMarker);
    
    if (!marker) return false;
    
    const discardData: FormDiscardMarker = JSON.parse(marker);
    const now = Date.now();
    
    // Clean up expired markers
    if (now - discardData.discardedAt > maxAgeMs) {
      localStorage.removeItem(discardMarker);
      return false;
    }
    
    return true;
  } catch (error) {
    console.warn('Error checking discard marker:', error);
    return false;
  }
}

/**
 * Mark a form as discarded (suppresses next restore attempt)
 */
export function markFormAsDiscarded(formKey: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const { discardMarker } = getFormStorageKeys(formKey);
    const marker: FormDiscardMarker = {
      discardedAt: Date.now(),
      formKey,
    };
    
    localStorage.setItem(discardMarker, JSON.stringify(marker));
    
    // Auto-cleanup after 10 seconds
    setTimeout(() => {
      try {
        localStorage.removeItem(discardMarker);
      } catch (error) {
        // Ignore cleanup errors
      }
    }, 10000);
    
    console.log(`🗑️ Form ${formKey} marked as discarded`);
  } catch (error) {
    console.warn('Error setting discard marker:', error);
  }
}

/**
 * Save form data with metadata
 */
export function saveFormData(formKey: string, data: any, metadata: Partial<FormMetadata>): void {
  if (typeof window === 'undefined') return;
  
  try {
    const { formData, metadata: metaKey } = getFormStorageKeys(formKey);
    
    // Filter out non-serializable values (File objects, etc.)
    const serializableData = filterSerializableData(data);
    
    const fullMetadata: FormMetadata = {
      createdAt: Date.now(),
      updatedAt: Date.now(),
      formKey,
      mode: metadata.mode || 'create',
      businessId: metadata.businessId,
      version: '1.0',
      ...metadata,
    };
    
    localStorage.setItem(formData, JSON.stringify(serializableData));
    localStorage.setItem(metaKey, JSON.stringify(fullMetadata));
    
    console.log(`💾 Saved form data for ${formKey}`);
  } catch (error) {
    console.warn('Error saving form data:', error);
  }
}

/**
 * Load form data if it exists and wasn't discarded
 */
export function loadFormData(formKey: string): { data: any; metadata: FormMetadata | null; isRestored: boolean } {
  if (typeof window === 'undefined') return { data: null, metadata: null, isRestored: false };
  
  try {
    // Check if form was recently discarded
    if (isFormRecentlyDiscarded(formKey)) {
      console.log(`🚫 Form ${formKey} was recently discarded, skipping restore`);
      return { data: null, metadata: null, isRestored: false };
    }
    
    const { formData, metadata: metaKey } = getFormStorageKeys(formKey);
    const stored = localStorage.getItem(formData);
    const storedMeta = localStorage.getItem(metaKey);
    
    if (!stored) {
      return { data: null, metadata: null, isRestored: false };
    }
    
    const data = JSON.parse(stored);
    const metadata = storedMeta ? JSON.parse(storedMeta) : null;
    
    console.log(`📝 Loaded form data for ${formKey}`);
    return { data, metadata, isRestored: true };
  } catch (error) {
    console.warn('Error loading form data:', error);
    return { data: null, metadata: null, isRestored: false };
  }
}

/**
 * Clear all form data and metadata
 */
export function clearFormData(formKey: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const { formData, metadata, baseline, discardMarker } = getFormStorageKeys(formKey);
    
    localStorage.removeItem(formData);
    localStorage.removeItem(metadata);
    localStorage.removeItem(baseline);
    localStorage.removeItem(discardMarker);
    
    console.log(`🗑️ Cleared all data for form ${formKey}`);
  } catch (error) {
    console.warn('Error clearing form data:', error);
  }
}

/**
 * Save baseline data for dirty state comparison
 */
export function saveBaselineData(formKey: string, data: any): void {
  if (typeof window === 'undefined') return;
  
  try {
    const { baseline } = getFormStorageKeys(formKey);
    const serializableData = filterSerializableData(data);
    
    localStorage.setItem(baseline, JSON.stringify(serializableData));
    console.log(`📊 Saved baseline for ${formKey}`);
  } catch (error) {
    console.warn('Error saving baseline:', error);
  }
}

/**
 * Load baseline data for dirty state comparison
 */
export function loadBaselineData(formKey: string): any {
  if (typeof window === 'undefined') return null;
  
  try {
    const { baseline } = getFormStorageKeys(formKey);
    const stored = localStorage.getItem(baseline);
    
    if (!stored) return null;
    
    return JSON.parse(stored);
  } catch (error) {
    console.warn('Error loading baseline:', error);
    return null;
  }
}

/**
 * Filter out non-serializable values from form data
 */
function filterSerializableData(data: any): any {
  if (data === null || data === undefined) return data;
  
  if (data instanceof File) {
    // Don't persist File objects, but preserve metadata
    return {
      _fileInfo: {
        name: data.name,
        size: data.size,
        type: data.type,
        lastModified: data.lastModified,
      },
      _isFile: true,
    };
  }
  
  if (Array.isArray(data)) {
    return data.map(filterSerializableData);
  }
  
  if (typeof data === 'object') {
    const filtered: any = {};
    for (const [key, value] of Object.entries(data)) {
      filtered[key] = filterSerializableData(value);
    }
    return filtered;
  }
  
  return data;
}

/**
 * Check if form has unsaved changes by comparing with baseline
 */
export function hasUnsavedChanges(formKey: string, currentData: any): boolean {
  try {
    const baseline = loadBaselineData(formKey);
    
    if (!baseline) {
      // No baseline means no changes to compare against
      return false;
    }
    
    const currentSerializable = filterSerializableData(currentData);
    return JSON.stringify(currentSerializable) !== JSON.stringify(baseline);
  } catch (error) {
    console.warn('Error checking unsaved changes:', error);
    return false;
  }
}

/**
 * Get all form keys that have persisted data
 */
export function getAllFormKeys(): string[] {
  if (typeof window === 'undefined') return [];
  
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('form_data_')) {
      const formKey = key.replace('form_data_', '');
      keys.push(formKey);
    }
  }
  return keys;
}

/**
 * Clear all form data and metadata
 */
export function clearAllFormData(): void {
  if (typeof window === 'undefined') return;
  
  const keys = getAllFormKeys();
  keys.forEach(formKey => {
    clearFormData(formKey);
  });
}
