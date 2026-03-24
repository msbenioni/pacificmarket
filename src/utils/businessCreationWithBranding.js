import { sanitizeBusinessPayload } from "@/utils/dataTransformers";
import {
  BUSINESS_MEDIA_FIELDS,
  sanitizeBusinessMediaPayload,
  prepareBusinessBrandingPayload,
  generateAndUploadDefaultBusinessAssets,
} from "@/utils/brandingUploadUtils";

const CREATE_FIELD_PASSTHROUGH = [
  "owner_user_id",
  "visibility_tier",
  "created_at",
  "updated_at",
  "created_date",
  "status",
  "is_verified",
  "is_claimed",
  "subscription_tier",
  "is_homepage_featured",
  "claimed_at",
  "claimed_by",
  "created_by",
  "source",
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
  businessesData = /** @type {{ business_name?: string; business_handle?: string; subscription_tier?: string; owner_user_id?: string; status?: string; visibility_tier?: string; created_at?: string; updated_at?: string; created_date?: string; is_verified?: boolean; is_claimed?: boolean; is_homepage_featured?: boolean; claimed_at?: string; claimed_by?: string; created_by?: string; source?: string; logo_url?: string; banner_url?: string; mobile_banner_url?: string; }} */ ({}),
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

  if (Object.keys(changedMediaPayload).length === 0) {
    return createdRow;
  }

  if (typeof updateRow === "function") {
    const updatedViaCallback = await updateRow(createdRow.id, changedMediaPayload);
    return updatedViaCallback || { ...createdRow, ...changedMediaPayload };
  }

  const { data: updatedRow, error: updateError } = await supabase
    .from("businesses")
    .update(changedMediaPayload)
    .eq("id", createdRow.id)
    .select()
    .single();

  if (updateError) {
    throw updateError;
  }

  return updatedRow || { ...createdRow, ...changedMediaPayload };
};
