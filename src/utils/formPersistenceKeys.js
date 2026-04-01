/**
 * Form Persistence Key Generation
 * Centralized key generation for form persistence
 */

/**
 * Generate a stable form key for persistence
 */
export function generateFormKey(options) {
  const { mode, businessId, prefix = 'admin_dashboard_business' } = options;
  
  if (mode === 'create') {
    return `${prefix}_create_draft`;
  }
  
  if (mode === 'edit') {
    if (!businessId) {
      throw new Error('businessId is required for edit mode');
    }
    return `${prefix}_edit_${businessId}`;
  }
  
  throw new Error(`Invalid mode: ${mode}`);
}

/**
 * Generate form key for create mode
 */
export function generateCreateFormKey(prefix) {
  return generateFormKey({ mode: 'create', prefix });
}

/**
 * Generate form key for edit mode
 */
export function generateEditFormKey(businessId, prefix) {
  return generateFormKey({ mode: 'edit', businessId, prefix });
}

/**
 * Parse a form key to extract metadata
 */
export function parseFormKey(formKey) {
  const parts = formKey.split('_');
  
  if (parts[parts.length - 1] === 'draft' && parts[parts.length - 2] === 'create') {
    // Create mode: prefix_create_draft
    const prefix = parts.slice(0, -2).join('_');
    return { mode: 'create', prefix };
  }
  
  if (parts[parts.length - 2] === 'edit') {
    // Edit mode: prefix_edit_businessId
    const businessId = parts[parts.length - 1];
    const prefix = parts.slice(0, -2).join('_');
    return { mode: 'edit', businessId, prefix };
  }
  
  throw new Error(`Invalid form key format: ${formKey}`);
}

/**
 * Validate that a form key matches expected business ID for edit mode
 */
export function validateEditFormKey(formKey, expectedBusinessId) {
  try {
    const parsed = parseFormKey(formKey);
    
    if (parsed.mode !== 'edit') {
      return false;
    }
    
    return parsed.businessId === expectedBusinessId;
  } catch (error) {
    return false;
  }
}
