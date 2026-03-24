import { useState, useEffect } from "react";
import { isPersistentMediaUrl } from "@/utils/mediaUrlUtils";

/**
 * Hook for managing media preview URLs with safe object URL lifecycle
 * 
 * @param {File} file - The selected file (null if no file selected)
 * @param {string} persistedUrl - The persisted/starter URL to use as fallback
 * @returns {string} - The preview URL to display (local file or persisted URL)
 */
export const useMediaPreview = (file, persistedUrl) => {
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (file) {
      // Create object URL for local file preview
      const newUrl = URL.createObjectURL(file);
      setPreviewUrl(newUrl);
      
      // Cleanup function to revoke object URL
      return () => URL.revokeObjectURL(newUrl);
    } else {
      // Use persisted/starter URL if no local file
      const displayUrl = isPersistentMediaUrl(persistedUrl, { allowRootRelative: true })
        ? persistedUrl
        : "";
      setPreviewUrl(displayUrl);
    }
  }, [file, persistedUrl]);

  return previewUrl;
};
