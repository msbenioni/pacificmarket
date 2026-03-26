"use client";

import { useState, useEffect } from "react";
import { isPersistentMediaUrl } from "@/utils/mediaUrlUtils";

/**
 * Hook for managing media preview state with removal flag support
 * 
 * @param {Object} options - Media state options
 * @param {File} options.file - The selected file (null if no file selected)
 * @param {string} options.persistedUrl - The persisted/starter URL to use as fallback
 * @param {boolean} options.removeFlag - Whether the media is marked for removal
 * @returns {Object} - Media state object
 */
export function useMediaState({ file, persistedUrl, removeFlag = false }) {
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    // If marked for removal, don't show any preview
    if (removeFlag) {
      setPreviewUrl("");
      return;
    }

    if (file) {
      // Create object URL for local file preview
      const newUrl = URL.createObjectURL(file);
      setPreviewUrl(newUrl);
      
      // Cleanup function to revoke object URL
      return () => URL.revokeObjectURL(newUrl);
    } else {
      // Use persisted/starter URL if no local file and not marked for removal
      const displayUrl = isPersistentMediaUrl(persistedUrl, { allowRootRelative: true })
        ? persistedUrl
        : "";
      setPreviewUrl(displayUrl);
    }
  }, [file, persistedUrl, removeFlag]);

  // Derive media state
  const hasImage = !!previewUrl && !removeFlag;
  const isRemoved = removeFlag;
  const isLocalPreview = !!file && !removeFlag;
  const isPersistedPreview = !file && !!persistedUrl && !removeFlag;

  return {
    displayUrl: previewUrl,
    hasImage,
    isRemoved,
    isLocalPreview,
    isPersistedPreview,
  };
}
