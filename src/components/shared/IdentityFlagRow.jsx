import React from "react";
import { getFlagItemsWithOverflow } from "@/utils/flagIdentityUtils";

export default function IdentityFlagRow({ 
  identities, 
  size = 20, 
  maxFlags = 3, 
  showLabels = false, 
  textClassName = "text-sm text-gray-600",
  className = "flex items-center gap-2" 
}) {
  const { items, overflow } = getFlagItemsWithOverflow(identities, { maxItems: maxFlags });

  if (!items.length) return null;

  return (
    <div className={className}>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-1">
          <div 
            className="w-5 h-5 rounded-full overflow-hidden ring-1 ring-black/5"
            style={{ width: size, height: size }}
          >
            {item.flagCode ? (
              <img
                src={`https://flagcdn.com/w${size}/${item.flagCode.toLowerCase()}.png`}
                alt={item.displayLabel}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
            ) : null}
            {!item.flagCode && (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
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
