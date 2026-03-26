import React from "react";
import { Globe } from "lucide-react";
import { getFlagItems } from "@/utils/flagIdentityUtils";

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
  const width = size;
  const height = size;
  const flagUrl = `https://flagcdn.com/w${width}/${code.toLowerCase()}.png`;

  return (
    <>
      <img
        src={flagUrl}
        alt={displayName}
        style={{ width, height: size, objectFit: "cover" }}
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
        style={{ width, height: size }}
      >
        <Globe size={size * 0.6} />
      </div>
    </>
  );
}

function SingleFlagIcon({
  identity,
  size = 24,
  className = "",
  showTooltip = true,
}) {
  const flagItems = getFlagItems(identity);
  if (!flagItems.length) return null;

  const { displayLabel, flagCode } = flagItems[0];

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
  const flagItems = getFlagItems(identity, { maxItems: maxFlags, debug: true });

  if (!flagItems.length) return null;

  if (flagItems.length === 1) {
    return (
      <SingleFlagIcon
        identity={flagItems[0].identity}
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
          identity={item.identity}
          size={size}
          className={className}
          showTooltip={showTooltip}
        />
      ))}
    </div>
  );
}
