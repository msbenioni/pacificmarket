import {
  generateBusinessLogo,
  generateBusinessBanner,
  generateMobileBanner,
  svgDataUrlToFile,
} from "@/utils/businessImageGenerator";
import { isPersistentMediaUrl } from "@/utils/mediaUrlUtils";

const MEDIA_BUCKET = "admin-listings";

const MEDIA_SLOTS = {
  logo_url: { fileKey: "logo_file", folder: "logos" },
  banner_url: { fileKey: "banner_file", folder: "banners" },
  mobile_banner_url: { fileKey: "mobile_banner_file", folder: "mobile-banners" },
};

export const BUSINESS_MEDIA_FIELDS = Object.keys(MEDIA_SLOTS);

const sanitizePathSegment = (value = "business") =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "business";

const inferFileExtension = (file) => {
  if (file?.name && file.name.includes(".")) {
    return file.name.split(".").pop().toLowerCase();
  }

  if (file?.type === "image/svg+xml") return "svg";
  if (file?.type === "image/webp") return "webp";
  if (file?.type === "image/png") return "png";
  if (file?.type === "image/jpeg") return "jpg";
  return "bin";
};

export const sanitizeBusinessMediaPayload = (
  payload = {},
  { allowRootRelative = false } = {}
) => {
  const sanitized = { ...payload };

  BUSINESS_MEDIA_FIELDS.forEach((field) => {
    const value = sanitized[field];

    if (value === undefined) {
      return;
    }

    // Preserve explicit null for removal operations.
    if (value === null) {
      return;
    }

    if (!isPersistentMediaUrl(value, { allowRootRelative })) {
      delete sanitized[field];
    }
  });

  return sanitized;
};

export const uploadBusinessMediaFile = async ({ supabase, businessId, field, file }) => {
  const slot = MEDIA_SLOTS[field];

  if (!slot) {
    throw new Error(`Unknown media field: ${field}`);
  }

  const businessSegment = sanitizePathSegment(businessId);
  const extension = inferFileExtension(file);
  const filePath = `${slot.folder}/${businessSegment}-${Date.now()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(filePath, file, {
      upsert: true,
      cacheControl: "3600",
      contentType: file?.type,
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data: publicUrlData } = supabase.storage
    .from(MEDIA_BUCKET)
    .getPublicUrl(filePath);

  if (!publicUrlData?.publicUrl) {
    throw new Error(`Failed to get public URL for ${field}`);
  }

  return publicUrlData.publicUrl;
};

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
    for (const [field, config] of Object.entries(MEDIA_SLOTS)) {
      const file = files?.[config.fileKey];
      if (!file) {
        continue;
      }

      uploadedUrls[field] = await uploadBusinessMediaFile({
        supabase,
        businessId,
        field,
        file,
      });
    }

    return uploadedUrls;
  } catch (error) {
    console.error("Error uploading branding files:", error);
    throw error;
  }
};

/**
 * Generate and upload default branding assets for any missing media fields.
 * Returns only the URLs that were generated/uploaded in this call.
 */
export const generateAndUploadDefaultBusinessAssets = async ({
  supabase,
  businessId,
  businessName,
  businessHandle,
  currentMedia = /** @type {{ logo_url?: string | null; banner_url?: string | null; mobile_banner_url?: string | null }} */ ({}),
}) => {
  const existing = sanitizeBusinessMediaPayload({ ...currentMedia });
  const explicitlyRemoved = {
    logo_url: currentMedia?.logo_url === null,
    banner_url: currentMedia?.banner_url === null,
    mobile_banner_url: currentMedia?.mobile_banner_url === null,
  };
  const filesToUpload = {};
  const safeHandle = sanitizePathSegment(businessHandle || businessName || businessId);

  if (!existing.logo_url && !explicitlyRemoved.logo_url) {
    const logoDataUrl = generateBusinessLogo(businessName || "Business");
    if (logoDataUrl) {
      filesToUpload.logo_file = await svgDataUrlToFile(logoDataUrl, `${safeHandle}-logo`);
    }
  }

  if (!existing.banner_url && !explicitlyRemoved.banner_url) {
    const bannerDataUrl = generateBusinessBanner(businessName || "Business");
    if (bannerDataUrl) {
      filesToUpload.banner_file = await svgDataUrlToFile(bannerDataUrl, `${safeHandle}-banner`);
    }
  }

  if (!existing.mobile_banner_url && !explicitlyRemoved.mobile_banner_url) {
    const mobileBannerDataUrl = generateMobileBanner(businessName || "Business");
    if (mobileBannerDataUrl) {
      filesToUpload.mobile_banner_file = await svgDataUrlToFile(
        mobileBannerDataUrl,
        `${safeHandle}-mobile-banner`
      );
    }
  }

  if (!filesToUpload.logo_file && !filesToUpload.banner_file && !filesToUpload.mobile_banner_file) {
    return {};
  }

  return uploadBusinessBrandingFiles({
    supabase,
    businessId,
    files: filesToUpload,
  });
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
  removals = /** @type {{ logo_remove?: boolean; banner_remove?: boolean; mobile_banner_remove?: boolean }} */ ({})
}) => {
  try {
    // Step 1: Start with incoming payload and sanitize media fields defensively.
    let sanitizedData = { ...businessesData };
    const sanitizedMedia = sanitizeBusinessMediaPayload({
      logo_url: sanitizedData.logo_url,
      banner_url: sanitizedData.banner_url,
      mobile_banner_url: sanitizedData.mobile_banner_url,
    });

    delete sanitizedData.logo_url;
    delete sanitizedData.banner_url;
    delete sanitizedData.mobile_banner_url;
    sanitizedData = {
      ...sanitizedData,
      ...sanitizedMedia,
    };
    
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
      
      // Validate that files uploaded successfully
      const uploadValidationErrors = [];
      if (files.logo_file && !uploadedUrls.logo_url) {
        uploadValidationErrors.push("Logo file was provided but no URL was returned from upload");
      }
      if (files.banner_file && !uploadedUrls.banner_url) {
        uploadValidationErrors.push("Banner file was provided but no URL was returned from upload");
      }
      if (files.mobile_banner_file && !uploadedUrls.mobile_banner_url) {
        uploadValidationErrors.push("Mobile banner file was provided but no URL was returned from upload");
      }
      
      if (uploadValidationErrors.length > 0) {
        throw new Error(`Upload validation failed: ${uploadValidationErrors.join(', ')}`);
      }
    }
    
    // Step 4: Merge uploaded URLs into final payload
    // PRECEDENCE: Uploaded files win over removal flags for the same field in the same save operation.
    // This means if a user uploads a new logo file and also has logo_remove: true in the same payload,
    // the uploaded file URL will be saved (upload takes precedence over removal).
    const finalPayload = {
      ...sanitizedData,
      ...uploadedUrls
    };
    
    // Step 5: Final safety check - ensure no blob/transient URLs remain
    const safePayload = sanitizeBusinessMediaPayload(finalPayload);
    
    return safePayload;
    
  } catch (error) {
    console.error("Error preparing branding payload:", error);
    throw error;
  }
};
