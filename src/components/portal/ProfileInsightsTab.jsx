import { BUTTON_STYLES, CARD_STYLES } from "@/constants/portalUI";
import ProfileSettingsAccordion from "@/components/onboarding/ProfileSettingsAccordion";
import FounderInsightsAccordion from "@/components/forms/FounderInsightsAccordion";

export default function ProfileInsightsTab({
  user,
  businesses,
  insightsSubmitting,
  insightsStarted,
  insightSnapshots,
  onProfileComplete,
  onFounderInsightsSubmit,
}) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
            Business Insights
          </p>
          <h2 className="text-2xl font-bold text-[#0a1628] mb-2">
            Business Performance & Analytics
          </h2>
          <p className="text-gray-600">
            Capture founder and business insights to help build a stronger profile,
            improve visibility, and unlock better support over time.
          </p>
        </div>
      </div>

      {/* Profile Settings */}
      <div className={CARD_STYLES.portal + " p-0"}>
        <ProfileSettingsAccordion
          onComplete={onProfileComplete}
        />
      </div>

      {/* Founder Insights */}
      <div className={CARD_STYLES.portal}>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-[#0a1628] mb-1">
            Founder Insights
          </h3>
          <p className="text-sm text-gray-600">
            Share your founder journey, goals, and business context.
          </p>
        </div>

        <FounderInsightsAccordion
          businessId={businesses[0]?.id ?? null}
          onSubmit={onFounderInsightsSubmit}
          isLoading={insightsSubmitting}
          initialData={insightSnapshots[0] || null}
          onStart={() => insightsStarted(true)}
        />
      </div>
    </div>
  );
}
