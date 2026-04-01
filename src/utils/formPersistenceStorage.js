/**
 * Form Persistence Storage Utilities
 * Centralized storage contract for form draft persistence
 */

/**
 * Generate consistent storage keys for a form
 */
export function getFormStorageKeys(formKey) {
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
export function isFormRecentlyDiscarded(formKey, maxAgeMs = 15000) {
  if (typeof window === 'undefined') return false;
  
  try {
    const { discardMarker } = getFormStorageKeys(formKey);
    const marker = localStorage.getItem(discardMarker);
    
    console.log(`🔍 Checking discard marker for ${formKey}:`, marker ? 'found' : 'not found');
    
    if (!marker) {
      console.log(`📭 No discard marker found for ${formKey}`);
      return false;
    }
    
    const discardData = JSON.parse(marker);
    const now = Date.now();
    const age = now - discardData.discardedAt;
    
    console.log(`⏰ Discard marker age for ${formKey}: ${age}ms (max: ${maxAgeMs}ms)`);
    
    // Clean up expired markers
    if (age > maxAgeMs) {
      console.log(`🧹 Discard marker expired for ${formKey}, removing`);
      localStorage.removeItem(discardMarker);
      return false;
    }
    
    console.log(`🚫 Form ${formKey} was recently discarded (${age}ms ago)`);
    return true;
  } catch (error) {
    console.warn('Error checking discard marker:', error);
    return false;
  }
}

/**
 * Mark a form as discarded (suppresses next restore attempt)
 */
export function markFormAsDiscarded(formKey) {
  if (typeof window === 'undefined') return;
  
  try {
    const { discardMarker } = getFormStorageKeys(formKey);
    const marker = {
      discardedAt: Date.now(),
      formKey,
    };
    
    localStorage.setItem(discardMarker, JSON.stringify(marker));
    
    // Auto-cleanup after 20 seconds (longer than check window)
    setTimeout(() => {
      try {
        localStorage.removeItem(discardMarker);
        console.log(`🧹 Auto-cleanup: Discard marker removed for ${formKey}`);
      } catch (error) {
        // Ignore cleanup errors
      }
    }, 20000);
    
    console.log(`🗑️ Form ${formKey} marked as discarded (will prevent restore for 15 seconds)`);
  } catch (error) {
    console.warn('Error setting discard marker:', error);
  }
}

/**
 * Save form data with metadata
 */
export function saveFormData(formKey, data, metadata) {
  if (typeof window === 'undefined') return;
  
  try {
    const { formData, metadata: metaKey } = getFormStorageKeys(formKey);
    
    // Filter out non-serializable values (File objects, etc.)
    const serializableData = filterSerializableData(data);
    
    const fullMetadata = {
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
export function loadFormData(formKey) {
  if (typeof window === 'undefined') return { data: null, metadata: null, isRestored: false };
  
  try {
    // Check if form was recently discarded FIRST
    if (isFormRecentlyDiscarded(formKey)) {
      console.log(`🚫 Form ${formKey} was recently discarded, skipping restore`);
      return { data: null, metadata: null, isRestored: false };
    }
    
    const { formData, metadata: metaKey } = getFormStorageKeys(formKey);
    const stored = localStorage.getItem(formData);
    const storedMeta = localStorage.getItem(metaKey);
    
    if (!stored) {
      console.log(`📭 No stored data found for ${formKey}`);
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
 * Clear draft data only (preserves discard marker)
 */
export function clearDraftData(formKey) {
  if (typeof window === 'undefined') return;
  
  try {
    const { formData, metadata, baseline } = getFormStorageKeys(formKey);
    
    localStorage.removeItem(formData);
    localStorage.removeItem(metadata);
    localStorage.removeItem(baseline);
    
    console.log(`🗑️ Cleared draft data for form ${formKey} (discard marker preserved)`);
  } catch (error) {
    console.warn('Error clearing draft data:', error);
  }
}

/**
 * Clear discard marker only
 */
export function clearDiscardMarker(formKey) {
  if (typeof window === 'undefined') return;
  
  try {
    const { discardMarker } = getFormStorageKeys(formKey);
    localStorage.removeItem(discardMarker);
    
    console.log(`🧹 Cleared discard marker for form ${formKey}`);
  } catch (error) {
    console.warn('Error clearing discard marker:', error);
  }
}

/**
 * Clear all form data and metadata (including discard marker)
 */
export function clearAllFormPersistence(formKey) {
  if (typeof window === 'undefined') return;
  
  try {
    const { formData, metadata, baseline, discardMarker } = getFormStorageKeys(formKey);
    
    localStorage.removeItem(formData);
    localStorage.removeItem(metadata);
    localStorage.removeItem(baseline);
    localStorage.removeItem(discardMarker);
    
    console.log(`🗑️ Cleared all persistence data for form ${formKey}`);
  } catch (error) {
    console.warn('Error clearing all form persistence:', error);
  }
}

/**
 * Legacy function for backward compatibility - use specific functions above
 */
export function clearFormData(formKey) {
  clearAllFormPersistence(formKey);
}

/**
 * Save baseline data for dirty state comparison
 */
export function saveBaselineData(formKey, data) {
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
export function loadBaselineData(formKey) {
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
function filterSerializableData(data) {
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
    const filtered = {};
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
export function hasUnsavedChanges(formKey, currentData) {
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
export function getAllFormKeys() {
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
export function clearAllFormData() {
  if (typeof window === 'undefined') return;
  
  const keys = getAllFormKeys();
  keys.forEach(formKey => {
    clearAllFormPersistence(formKey);
  });
}
