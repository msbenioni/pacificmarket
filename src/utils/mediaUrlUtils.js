const CONTROLLED_ROOT_RELATIVE_MEDIA_ASSETS = new Set([
  "/pm_logo.png",
  "/pacific_logo_banner.png",
]);

const normalizeMediaUrl = (value) => {
  if (typeof value !== "string") return "";
  return value.trim();
};

const isHttpMediaUrl = (value) => {
  const normalized = normalizeMediaUrl(value);
  if (!normalized) return false;

  try {
    const parsed = new URL(normalized);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

export const isControlledRootRelativeMediaUrl = (value) => {
  const normalized = normalizeMediaUrl(value);
  return CONTROLLED_ROOT_RELATIVE_MEDIA_ASSETS.has(normalized);
};

/**
 * Validates media URL strings against supported persisted URL patterns.
 * - DB payloads should use allowRootRelative: false (http/https only)
 * - UI rendering may use allowRootRelative: true for controlled starter assets
 */
export const isPersistentMediaUrl = (value, { allowRootRelative = false } = {}) => {
  const normalized = normalizeMediaUrl(value);
  if (!normalized) return false;

  if (isHttpMediaUrl(normalized)) {
    return true;
  }

  if (allowRootRelative && isControlledRootRelativeMediaUrl(normalized)) {
    return true;
  }

  return false;
};
