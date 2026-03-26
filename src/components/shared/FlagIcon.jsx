import React from "react";
import { Globe } from "lucide-react";
import { DISPLAY_TO_FLAG_COUNTRY, COUNTRY_FLAG_CODES } from "@/constants/unifiedConstants";
import { resolveCanonicalLabel, parseIdentities, dedupe } from "@/utils/parsingUtils";
import { FLAG_CONFIG } from "@/constants/flagConfig";

/**
 * Get canonical display label for an identity
 */
function getDisplayLabel(identity) {
  return resolveCanonicalLabel(identity);
}

/**
 * Get flag country for a display identity
 */
function getFlagCountry(identity) {
  const label = getDisplayLabel(identity);
  return DISPLAY_TO_FLAG_COUNTRY[label] || label || null;
}

/**
 * Get ISO flag code for an identity
 */
function getFlagCode(identity) {
  const country = getFlagCountry(identity);
  return country ? COUNTRY_FLAG_CODES[country] || null : null;
}

/**
 * Get flag asset URL (SVG for better scaling)
 */
function getFlagAssetUrl(code) {
  if (!code) return null;
  return `https://flagcdn.com/${code.toLowerCase()}.svg`;
}

/**
 * Process identity into flag item
 */
const processIdentity = (identity) => {
  const displayLabel = getDisplayLabel(identity);
  const flagCountry = getFlagCountry(identity);
  const flagCode = getFlagCode(identity);
  
  return {
    identity,
    displayLabel,
    flagCountry,
    flagCode,
  };
};

/**
 * Get parsed flag items for rendering
 */
function getFlagItems(input, options = {}) {
  const { maxItems = null } = options;

  try {
    const identities = dedupe(parseIdentities(input)).filter(Boolean);

    console.log("[FlagIcon] identity resolution", {
      input,
      identities,
      mapped: identities.map((identity) => {
        const item = processIdentity(identity);
        const flagUrl = getFlagAssetUrl(item.flagCode);

        return {
          ...item,
          flagUrl,
        };
      }),
    });

    let flagItems = identities
      .map(processIdentity)
      .filter((item) => item && item.displayLabel);

    if (maxItems && maxItems > 0) {
      flagItems = flagItems.slice(0, maxItems);
    }

    return flagItems;
  } catch (error) {
    console.error("[FlagIcon] getFlagItems failed", { input, error });
    return [];
  }
}

/**
 * Get flag items with overflow information
 */
function getFlagItemsWithOverflow(input, options = {}) {
  const { maxItems = 3 } = options;
  
  const allItems = getFlagItems(input);
  const items = allItems.slice(0, maxItems);
  const overflow = Math.max(0, allItems.length - maxItems);
  
  return { items, overflow };
}

/**
 * Shared styling object for flag containers
 */
const getFlagContainerStyles = (className = "", additionalClasses = "") => ({
  style: {
    width: `${FLAG_CONFIG.SHAPE.RECTANGLE.width}px`, 
    height: `${FLAG_CONFIG.SHAPE.RECTANGLE.height}px`,
    borderRadius: "6px !important"
  },
  className: `bg-white shadow-md ring-1 ring-black/10 ${className} ${additionalClasses}`
});

/**
 * Shared error handler for flag images
 */
const handleFlagError = (e, code, displayName) => {
  console.error("[FlagVisual] image failed", {
    code,
    displayName,
    src: e.currentTarget.src,
  });
  const target = e.currentTarget;
  target.style.display = "none";
  const fallback = target.nextElementSibling;
  if (fallback instanceof HTMLElement) {
    fallback.style.display = "flex";
  }
};

/**
 * Shared FlagVisual component
 * Single source of truth for all flag rendering across the application
 */
function FlagVisual({ code, displayName, className = "" }) {
  const flagUrl = getFlagAssetUrl(code);

  console.log("[FlagVisual] rendering", { code, displayName, flagUrl });

  return (
    <div className="group relative inline-flex">
      <img
        src={flagUrl}
        alt={displayName}
        title={displayName}
        style={{ 
          ...getFlagContainerStyles(className).style,
          objectFit: "cover"
        }}
        className={getFlagContainerStyles(className).className}
        onError={(e) => handleFlagError(e, code, displayName)}
      />
      <div
        className={`hidden items-center justify-center text-[#0d4f4f] shadow-md ring-1 ring-black/10 ${className}`}
        style={getFlagContainerStyles(className).style}
        title={displayName}
      >
        <Globe size={FLAG_CONFIG.SHAPE.RECTANGLE.width * FLAG_CONFIG.FALLBACK.SCALE_FACTOR} />
      </div>
    </div>
  );
}

/**
 * Shared Flag Overflow Indicator
 * Used for "+3 more" type displays
 */
function FlagOverflowIndicator({ count, className = "" }) {
  if (count <= 0) return null;
  
  const styles = getFlagContainerStyles(className, "inline-flex items-center justify-center text-gray-600 text-xs font-medium");
  
  return (
    <div 
      style={styles.style}
      className={styles.className}
      title={`+${count} more`}
    >
      +{count}
    </div>
  );
}

function SingleFlagIcon({
  item,
  className = "",
}) {
  return (
    <FlagVisual
      code={item.flagCode}
      displayName={item.displayLabel}
      className={className}
    />
  );
}

/**
 * IdentityFlagRow component
 * Displays multiple flags with overflow handling
 */
export function IdentityFlagRow({ 
  identities, 
  maxFlags = 3, 
  className = "flex items-center gap-2" 
}) {
  let items = [];
  let overflow = 0;

  try {
    const result = getFlagItemsWithOverflow(identities, { maxItems: maxFlags });
    items = result.items || [];
    overflow = result.overflow || 0;
  } catch (error) {
    console.error("[IdentityFlagRow] failed to resolve flags", { identities, error });
    return null;
  }

  if (!items.length) return null;

  return (
    <div className={className}>
      <div className="flex items-center gap-1">
        {items.map((item, index) => (
          <FlagVisual
            key={index}
            code={item.flagCode}
            displayName={item.displayLabel}
            className="inline-flex"
          />
        ))}
        
        <FlagOverflowIndicator count={overflow} />
      </div>
    </div>
  );
}

// Export all flag utilities for backward compatibility
export { 
  getDisplayLabel, 
  getFlagCountry, 
  getFlagCode, 
  getFlagAssetUrl, 
  getFlagItems, 
  getFlagItemsWithOverflow 
};

// Export shared components for backward compatibility
export { FlagVisual, FlagOverflowIndicator };

export default function FlagIcon({
  identity,
  className = "",
  maxFlags = 3,
}) {
  let flagItems = [];
  try {
    flagItems = getFlagItems(identity, { maxItems: maxFlags });
  } catch (error) {
    console.error("[FlagIcon] failed to resolve flags", { identity, error });
    flagItems = [];
  }

  if (!flagItems.length) return null;

  if (flagItems.length === 1) {
    return (
      <SingleFlagIcon
        item={flagItems[0]}
        className={className}
      />
    );
  }

  return (
    <div className="flex items-center gap-1">
      {flagItems.map((item, index) => (
        <SingleFlagIcon
          key={index}
          item={item}
          className={className}
        />
      ))}
    </div>
  );
}
