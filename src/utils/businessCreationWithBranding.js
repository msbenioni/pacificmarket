import { sanitizeBusinessPayload } from "@/utils/dataTransformers";
import {
  BUSINESS_MEDIA_FIELDS,
  sanitizeBusinessMediaPayload,
  prepareBusinessBrandingPayload,
  generateAndUploadDefaultBusinessAssets,
} from "@/utils/brandingUploadUtils";
import { SUBSCRIPTION_TIER } from "@/constants/unifiedConstants";

const CREATE_FIELD_PASSTHROUGH = [
  "owner_user_id",
  "visibility_tier",
  "visibility_mode",
  "created_at",
  "updated_at",
  "created_date",
  "status",
  "is_verified",
  "is_claimed",
  "subscription_tier",
  "claimed_at",
  "claimed_by",
  "created_by",
  "source",
  "referred_by_business_id",
];

const stripFileFields = (payload = /** @type {{ logo_file?: File; banner_file?: File; mobile_banner_file?: File }} */ ({})) => {
  const next = { ...payload };
  delete next.logo_file;
  delete next.banner_file;
  delete next.mobile_banner_file;
  return next;
};

const pickDefinedMediaFields = (payload = {}) => {
  const media = {};
  BUSINESS_MEDIA_FIELDS.forEach((field) => {
    if (payload[field] !== undefined) {
      media[field] = payload[field];
    }
  });
  return media;
};

export const createBusinessWithBranding = async ({
  supabase,
  businessesData = /** @type {{ business_name?: string; business_handle?: string; subscription_tier?: string; owner_user_id?: string; status?: string; visibility_tier?: string; visibility_mode?: string; created_at?: string; updated_at?: string; created_date?: string; is_verified?: boolean; is_claimed?: boolean; claimed_at?: string; claimed_by?: string; created_by?: string; source?: string; logo_url?: string; banner_url?: string; mobile_banner_url?: string; }} */ ({}),
  businessInsightsData = /** @type {{}} */ ({}),
  files = /** @type {{ logo_file?: File; banner_file?: File; mobile_banner_file?: File }} */ ({}),
  removals = /** @type {{ logo_remove?: boolean; banner_remove?: boolean; mobile_banner_remove?: boolean }} */ ({}),
  allowCustomBranding = true,
  createRow,
  updateRow,
}) => {
  if (!supabase) {
    throw new Error("Supabase client is required.");
  }

  if (typeof createRow !== "function") {
    throw new Error("createRow callback is required.");
  }

  const basePayload = stripFileFields({
    ...businessesData,
    ...businessInsightsData,
  });

  const sanitizedIncomingMedia = sanitizeBusinessMediaPayload(
    pickDefinedMediaFields(basePayload),
    { allowRootRelative: false }
  );

  BUSINESS_MEDIA_FIELDS.forEach((field) => {
    delete basePayload[field];
  });

  const initialCreatePayload = sanitizeBusinessPayload({
    ...basePayload,
    ...sanitizedIncomingMedia,
  });

  CREATE_FIELD_PASSTHROUGH.forEach((field) => {
    if (basePayload[field] !== undefined) {
      initialCreatePayload[field] = basePayload[field];
    }
  });

  // Debug log to verify referral field persistence
  console.log("🔍 createBusinessWithBranding final payload:", {
    hasReferral: !!initialCreatePayload.referred_by_business_id,
    referralValue: initialCreatePayload.referred_by_business_id,
    subscriptionTier: initialCreatePayload.subscription_tier,
    payloadKeys: Object.keys(initialCreatePayload)
  });

  const createdRow = await createRow(initialCreatePayload);

  if (!createdRow?.id) {
    throw new Error("Business creation failed: missing created row ID.");
  }

  const filesToUpload = allowCustomBranding ? files : {};

  const preparedBranding = await prepareBusinessBrandingPayload({
    supabase,
    businessId: createdRow.id,
    businessesData: pickDefinedMediaFields({ ...createdRow, ...businessesData }),
    files: filesToUpload,
    removals,
  });

  const generatedDefaultUrls = await generateAndUploadDefaultBusinessAssets({
    supabase,
    businessId: createdRow.id,
    businessName: businessesData.business_name || "Business",
    businessHandle: businessesData.business_handle,
    currentMedia: {
      ...createdRow,
      ...preparedBranding,
    },
  });

  const finalMediaPayload = sanitizeBusinessMediaPayload(
    {
      ...preparedBranding,
      ...generatedDefaultUrls,
    },
    { allowRootRelative: false }
  );

  const changedMediaPayload = pickDefinedMediaFields(finalMediaPayload);

  // Auto-assign homepage visibility for Moana tier (only if not manually set)
  // visibility_tier = what is shown
  // visibility_mode = who controls it  
  // subscription_tier = entitlement/default, not final editorial placement
  const resultingTier = businessesData.subscription_tier || SUBSCRIPTION_TIER.VAKA;
  const resultingMode = businessesData.visibility_mode || 'auto';
  
  // Split payloads for clarity
  const changedBusinessPayload = {};
  
  if (resultingMode === 'manual') {
    // Manual mode: preserve incoming admin-set visibility explicitly
    if (businessesData.visibility_tier) {
      changedBusinessPayload.visibility_tier = businessesData.visibility_tier;
    }
  } else {
    // Auto mode: compute from tier
    if (resultingTier === SUBSCRIPTION_TIER.MOANA) {
      changedBusinessPayload.visibility_tier = 'homepage';
    } else {
      // Non-Moana tier in auto mode - use 'pacific-businesses' for directory visibility
      changedBusinessPayload.visibility_tier = 'pacific-businesses';
    }
  }

  // Merge media and business payloads before update
  const finalPayload = {
    ...changedMediaPayload,
    ...changedBusinessPayload
  };

  if (Object.keys(finalPayload).length === 0) {
    return createdRow;
  }

  if (typeof updateRow === "function") {
    const updatedViaCallback = await updateRow(createdRow.id, finalPayload);
    return updatedViaCallback || { ...createdRow, ...finalPayload };
  }

  const { data: updatedRow, error: updateError } = await supabase
    .from("businesses")
    .update(finalPayload)
    .eq("id", createdRow.id)
    .select()
    .single();

  if (updateError) {
    throw updateError;
  }

  return updatedRow || { ...createdRow, ...finalPayload };
};
