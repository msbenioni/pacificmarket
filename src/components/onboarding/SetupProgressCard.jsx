"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, ChevronRight, Sparkles } from "lucide-react";
import { useOnboardingStatus } from "../../hooks/useOnboardingStatus";
import { onboardingUI } from "./onboardingUI";

/**
 * Premium Setup Progress Card
 * Shows user's onboarding progress with clear next action
 */
export function SetupProgressCard({
  onOpenProfileModal,
  onOpenClaimModal,
  onOpenAddModal,
}) {
  const [isMounted, setIsMounted] = useState(false);
  const {
    onboardingStatus,
    getStepStatus,
    getStepTitle,
    getStepDescription,
    loading,
  } = useOnboardingStatus();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || loading) {
    return (
      <div className={onboardingUI.premiumCard + " animate-pulse"}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="h-4 w-32 rounded bg-slate-200 mb-3" />
            <div className="h-3 w-48 rounded bg-slate-100" />
          </div>
          <div className="h-12 w-12 rounded-2xl bg-slate-100 shrink-0" />
        </div>

        <div className="mt-6 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-slate-100 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="h-3 w-32 rounded bg-slate-200 mb-2" />
                <div className="h-2.5 w-44 rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 h-11 rounded-xl bg-slate-200" />
      </div>
    );
  }

  if (onboardingStatus.isComplete) {
    return <CompletionCard />;
  }

  const handleContinue = () => {
    switch (onboardingStatus.nextAction) {
      case "complete-profile":
        onOpenProfileModal?.();
        break;
      case "claim-or-add":
        onOpenClaimModal?.();
        break;
      case "complete-business-profiles":
        onOpenAddModal?.();
        break;
      default:
        break;
    }
  };

  const handleSkip = () => {
    if (onboardingStatus.nextAction === "complete-business-profiles") {
      return;
    }
  };

  const remainingSteps =
    onboardingStatus.totalSteps - onboardingStatus.completedSteps;

  return (
    <div className={onboardingUI.premiumCard}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#c9a84c]/20 bg-[#c9a84c]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0a1628]">
            <Sparkles className="w-3.5 h-3.5 text-[#c9a84c]" />
            Setup Progress
          </div>

          <h3 className={onboardingUI.mainTitle}>
            Finish your setup
          </h3>
          <p className={onboardingUI.body}>
            {remainingSteps} quick step{remainingSteps !== 1 ? "s" : ""} left to
            complete your Pacific Discovery Network profile.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-[#0d4f4f]/10 bg-white/90 px-4 py-3 shrink-0 self-start">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0d4f4f]/10 text-[#0d4f4f] font-bold">
            {onboardingStatus.completedSteps}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Completed
            </p>
            <p className="text-sm font-semibold text-[#0a1628]">
              {onboardingStatus.completedSteps}/{onboardingStatus.totalSteps}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className={onboardingUI.progressLabel}>
            Progress
          </span>
          <span className={onboardingUI.progressValue}>
            {Math.round(
              (onboardingStatus.completedSteps / onboardingStatus.totalSteps) *
                100
            )}
            %
          </span>
        </div>

        <div className={onboardingUI.progressBar}>
          <div
            className={onboardingUI.progressBarFill}
            style={{
              width: `${
                (onboardingStatus.completedSteps /
                  onboardingStatus.totalSteps) *
                100
              }%`,
            }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3 mb-6">
        {[1, 2, 3].map((step) => {
          const status = getStepStatus(step);
          const title = getStepTitle(step);
          const description = getStepDescription(step);

          const isCompleted = status === "completed";
          const isCurrent = status === "current";

          return (
            <div
              key={step}
              className={`flex items-start gap-3 rounded-2xl border px-4 py-3 transition ${
                isCompleted
                  ? onboardingUI.statusCompleted
                  : isCurrent
                  ? onboardingUI.statusCurrent
                  : onboardingUI.statusPending
              }`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                  isCompleted
                    ? onboardingUI.statusIconCompleted
                    : isCurrent
                    ? onboardingUI.statusIconCurrent
                    : onboardingUI.statusIconPending
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <span>{step}</span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p
                  className={`text-sm font-semibold ${
                    isCompleted
                      ? onboardingUI.statusTextCompleted
                      : isCurrent
                      ? onboardingUI.statusTextCurrent
                      : onboardingUI.statusTextPending
                  }`}
                >
                  {title}
                </p>
                <p
                  className={`mt-1 text-xs leading-5 ${
                    isCompleted
                      ? onboardingUI.statusDescCompleted
                      : isCurrent
                      ? onboardingUI.statusDescCurrent
                      : onboardingUI.statusDescPending
                  }`}
                >
                  {description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className={onboardingUI.mobileFooter}>
        <div className="order-2 sm:order-1">
          {onboardingStatus.nextAction === "complete-business-profiles" && (
            <button
              onClick={handleSkip}
              className={onboardingUI.fullWidthSecondaryButton}
            >
              Do this later
            </button>
          )}
        </div>

        <div className="order-1 sm:order-2 w-full sm:w-auto">
          <button
            onClick={handleContinue}
            className={onboardingUI.fullWidthPrimaryButton}
          >
            <span>Continue setup</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Trust Message */}
      <div className="mt-5 pt-4 border-t border-[#0d4f4f]/10">
        <p className="text-xs text-slate-600 text-center leading-5">
          This helps verify ownership and represent Pacific enterprise with care,
          credibility, and visibility.
        </p>
      </div>
    </div>
  );
}

/**
 * Completion Card - shown when onboarding is complete
 */
function CompletionCard() {
  return (
    <div className={onboardingUI.successCard}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
          <CheckCircle2 className="w-7 h-7" />
        </div>

        <div className="min-w-0">
          <h3 className={onboardingUI.mainTitle}>
            All set!
          </h3>
          <p className={onboardingUI.body}>
            Your profile is complete and ready to go. You can now manage your
            business listings with confidence.
          </p>
        </div>
      </div>
    </div>
  );
}