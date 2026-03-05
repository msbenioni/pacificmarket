"use client";

import React from "react";
import { Check } from "lucide-react";

export default function PremiumStepper({
  steps,
  currentStep,          // 0-based index
  completedUntil = -1,  // 0-based index; e.g. currentStep - 1
  onStepClick,          // optional: allow clicking steps
  className = "",
}) {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
        {steps.map((s, i) => {
          const isActive = i === currentStep;
          const isDone = i <= completedUntil;

          return (
            <React.Fragment key={s.key}>
              <button
                type="button"
                onClick={() => onStepClick?.(i)}
                disabled={!onStepClick}
                className={[
                  "group flex items-center gap-2 rounded-full px-3 py-2 whitespace-nowrap transition",
                  "border text-sm font-semibold",
                  isActive
                    ? "bg-[#0a1628] border-[#0a1628] text-white shadow-sm"
                    : isDone
                    ? "bg-white border-[#0d4f4f]/25 text-[#0a1628] hover:bg-[#0d4f4f]/[0.03]"
                    : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50",
                  onStepClick ? "cursor-pointer" : "cursor-default",
                ].join(" ")}
              >
                <span
                  className={[
                    "grid place-items-center h-6 w-6 rounded-full text-xs font-bold",
                    isActive
                      ? "bg-white/10 text-white"
                      : isDone
                      ? "bg-[#0d4f4f]/10 text-[#0d4f4f]"
                      : "bg-gray-100 text-gray-400",
                  ].join(" ")}
                >
                  {isDone ? <Check className="h-4 w-4" /> : i + 1}
                </span>

                <span className={isActive ? "text-white" : ""}>{s.label}</span>

                {/* optional: a tiny gold hint only on Review */}
                {s.key === "review" && !isActive && (
                  <span className="ml-1 h-2 w-2 rounded-full bg-[#c9a84c] opacity-60" />
                )}
              </button>

              {i < steps.length - 1 && (
                <div className="flex items-center gap-2 px-1">
                  <div
                    className={[
                      "h-[2px] w-6 rounded-full",
                      isDone ? "bg-[#0d4f4f]/25" : "bg-gray-200",
                    ].join(" ")}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* subtle section divider */}
      <div className="mt-4 h-px w-full bg-gray-100" />
    </div>
  );
}
