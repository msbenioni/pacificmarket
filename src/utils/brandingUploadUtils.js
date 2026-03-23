import { getSupabase } from '../lib/supabase/client';

/**
 * Upload business branding files to Supabase Storage
 * @param {Object} params - Upload parameters
 * @param {Object} params.supabase - Supabase client
 * @param {string} params.businessId - Business ID for folder structure
 * @param {Object} params.files - Files to upload
 * @param {File} params.files.logo_file - Logo file (optional)
 * @param {File} params.files.banner_file - Banner file (optional)
 * @param {File} params.files.mobile_banner_file - Mobile banner file (optional)
 * @returns {Promise<Object>} Object with uploaded URLs
 */
export const uploadBusinessBrandingFiles = async ({ supabase, businessId, files }) => {
  const uploadedUrls = {};
  
  try {
    // Upload logo if provided
    if (files.logo_file) {
      const file = files.logo_file;
      const filePath = `logos/${businessId}-${Date.now()}-${file.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from("admin-listings")
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      const { data: publicUrlData } = supabase.storage
        .from("admin-listings")
        .getPublicUrl(filePath);
      
      if (publicUrlData?.publicUrl) {
        uploadedUrls.logo_url = publicUrlData.publicUrl;
      }
    }
    
    // Upload banner if provided
    if (files.banner_file) {
      const file = files.banner_file;
      const filePath = `banners/${businessId}-${Date.now()}-${file.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from("admin-listings")
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      const { data: publicUrlData } = supabase.storage
        .from("admin-listings")
        .getPublicUrl(filePath);
      
      if (publicUrlData?.publicUrl) {
        uploadedUrls.banner_url = publicUrlData.publicUrl;
      }
    }
    
    // Upload mobile banner if provided
    if (files.mobile_banner_file) {
      const file = files.mobile_banner_file;
      const filePath = `mobile-banners/${businessId}-${Date.now()}-${file.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from("admin-listings")
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      const { data: publicUrlData } = supabase.storage
        .from("admin-listings")
        .getPublicUrl(filePath);
      
      if (publicUrlData?.publicUrl) {
        uploadedUrls.mobile_banner_url = publicUrlData.publicUrl;
      }
    }
    
    return uploadedUrls;
  } catch (error) {
    console.error("Error uploading branding files:", error);
    throw error;
  }
};

/**
 * Remove blob URLs from payload to prevent them from being saved to database
 * @param {Object} payload - The payload to sanitize
 * @returns {Object} Sanitized payload with blob URLs removed
 */
export const stripTransientImageUrls = (payload) => {
  const sanitized = { ...payload };
  
  // Remove blob URLs from branding fields
  if (sanitized.logo_url && sanitized.logo_url.startsWith('blob:')) {
    sanitized.logo_url = '';
  }
  if (sanitized.banner_url && sanitized.banner_url.startsWith('blob:')) {
    sanitized.banner_url = '';
  }
  if (sanitized.mobile_banner_url && sanitized.mobile_banner_url.startsWith('blob:')) {
    sanitized.mobile_banner_url = '';
  }
  
  return sanitized;
};

/**
 * Centralized branding save orchestration helper
 * Handles sanitization, upload, URL merging, and removal flags
 * @param {Object} params - Save parameters
 * @param {Object} params.supabase - Supabase client
 * @param {string} params.businessId - Business ID for folder structure
 * @param {Object} params.businessesData - Business data to save
 * @param {Object} params.files - Files to upload
 * @param {Object} params.removals - Removal flags (optional)
 * @param {boolean} params.removals.logo_remove - Remove logo flag
 * @param {boolean} params.removals.banner_remove - Remove banner flag
 * @param {boolean} params.removals.mobile_banner_remove - Remove mobile banner flag
 * @returns {Promise<Object>} Final safe payload ready for database save
 */
export const prepareBusinessBrandingPayload = async ({ 
  supabase, 
  businessId, 
  businessesData, 
  files = {}, 
  removals = {} 
}) => {
  console.log("🎨 Preparing branding payload:", {
    businessId,
    hasFiles: Object.keys(files).filter(key => files[key]).length,
    removals: Object.keys(removals).filter(key => removals[key])
  });

  try {
    // Step 1: Sanitize incoming payload to remove any blob URLs
    let sanitizedData = stripTransientImageUrls(businessesData);
    
    // Step 2: Handle removal flags
    if (removals.logo_remove) {
      sanitizedData.logo_url = null;
    }
    if (removals.banner_remove) {
      sanitizedData.banner_url = null;
    }
    if (removals.mobile_banner_remove) {
      sanitizedData.mobile_banner_url = null;
    }
    
    // Step 3: Upload new files if present
    let uploadedUrls = {};
    const hasFiles = files.logo_file || files.banner_file || files.mobile_banner_file;
    
    if (hasFiles) {
      uploadedUrls = await uploadBusinessBrandingFiles({
        supabase,
        businessId,
        files
      });
      
      console.log("📤 Upload results:", uploadedUrls);
    }
    
    // Step 4: Merge uploaded URLs into final payload
    const finalPayload = {
      ...sanitizedData,
      ...uploadedUrls
    };
    
    // Step 5: Final safety check - ensure no blob URLs remain
    const safePayload = stripTransientImageUrls(finalPayload);
    
    console.log("✅ Final safe payload prepared:", {
      logo_url: safePayload.logo_url ? 'URL present' : 'null/empty',
      banner_url: safePayload.banner_url ? 'URL present' : 'null/empty', 
      mobile_banner_url: safePayload.mobile_banner_url ? 'URL present' : 'null/empty'
    });
    
    return safePayload;
    
  } catch (error) {
    console.error("❌ Error preparing branding payload:", error);
    throw error;
  }
};
