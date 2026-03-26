import React from "react";
import { Globe } from "lucide-react";
import { getFlagItems, getFlagAssetUrl } from "@/utils/flagIdentityUtils";

function Tooltip({ label, children }) {
  return (
    <div className="group relative inline-flex items-center">
      {children}
      <div className="pointer-events-none absolute bottom-full left-1/2 z-[9999] mb-1 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#0a1628] px-2 py-1 text-[10px] font-medium text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
        {label}
        <div className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 bg-[#0a1628]" />
      </div>
    </div>
  );
}

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

function SingleFlagIcon({
  item,
  size = 24,
  className = "",
  showTooltip = true,
}) {
  const { displayLabel, flagCode } = item;

  const content = flagCode ? (
    <FlagVisual
      code={flagCode}
      displayName={displayLabel}
      size={size}
      className={className}
    />
  ) : (
    <div
      className={`flex items-center justify-center rounded-md bg-slate-100 text-[#0d4f4f] shadow-sm ring-1 ring-black/5 ${className}`}
      style={{ width: size, height: size }}
    >
      <Globe size={size * 0.6} />
    </div>
  );

  return showTooltip ? <Tooltip label={displayLabel}>{content}</Tooltip> : content;
}

export default function FlagIcon({
  identity,
  size = 24,
  className = "",
  showTooltip = true,
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
        size={size}
        className={className}
        showTooltip={showTooltip}
      />
    );
  }

  return (
    <div className="flex items-center gap-1">
      {flagItems.map((item, index) => (
        <SingleFlagIcon
          key={index}
          item={item}
          size={size}
          className={className}
          showTooltip={showTooltip}
        />
      ))}
    </div>
  );
}
