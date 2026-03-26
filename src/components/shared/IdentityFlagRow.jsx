import React from "react";
import { Globe } from "lucide-react";
import { getFlagItemsWithOverflow, getFlagAssetUrl } from "@/utils/flagIdentityUtils";

function FlagVisual({ code, displayName, size, className }) {
  const flagUrl = getFlagAssetUrl(code);

  return (
    <>
      <img
        src={flagUrl}
        alt={displayName}
        style={{ width: size, height: size, objectFit: "cover" }}
        className={`rounded-md shadow-sm ring-1 ring-black/5 ${className}`}
        onError={(e) => {
          const target = e.currentTarget;
          target.style.display = "none";
          const fallback = target.nextElementSibling;
          if (fallback instanceof HTMLElement) {
            fallback.style.display = "flex";
          }
        }}
      />
      <div
        className={`hidden items-center justify-center rounded-md bg-slate-100 text-[#0d4f4f] shadow-sm ring-1 ring-black/5 ${className}`}
        style={{ width: size, height: size }}
      >
        <Globe size={size * 0.6} />
      </div>
    </>
  );
}

export default function IdentityFlagRow({ 
  identities, 
  size = 20, 
  maxFlags = 3, 
  showLabels = false, 
  textClassName = "text-sm text-gray-600",
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
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-1">
          <div 
            className="rounded-full overflow-hidden ring-1 ring-black/5"
            style={{ width: size, height: size }}
          >
            {item.flagCode ? (
              <FlagVisual
                code={item.flagCode}
                displayName={item.displayLabel}
                size={size}
                className=""
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-100 text-[#0d4f4f] shadow-sm">
                <Globe size={size * 0.6} />
              </div>
            )}
          </div>
          {showLabels && (
            <span className={textClassName}>{item.displayLabel}</span>
          )}
        </div>
      ))}
      {overflow > 0 && (
        <span className={`text-xs text-gray-500 ${textClassName}`}>
          +{overflow}
        </span>
      )}
    </div>
  );
}
