import { Sparkles, ShieldCheck, LineChart, UserCircle2 } from "lucide-react";
import { CARD_STYLES } from "@/constants/portalUI";
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
  setInsightsProgress,
}) {
  const hasInsights = !!insightSnapshots?.[0];

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Premium Header */}
      <section className="relative overflow-hidden rounded-[28px] border border-[#0d4f4f]/10 bg-gradient-to-br from-white via-[#f7fbfb] to-[#eef6f6] p-5 sm:p-7 shadow-[0_18px_50px_rgba(10,22,40,0.08)]">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(13,79,79,0.07),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(201,168,76,0.10),transparent_24%)]" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#0d4f4f]/10 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0d4f4f] shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Profile & Insights
            </div>

            <h2 className="mt-4 text-2xl font-bold tracking-tight text-[#0a1628] sm:text-3xl">
              Build a stronger business profile
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-[15px]">
              Complete your profile and share founder insights so your business can be
              better represented, easier to discover, and better supported over time.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-[420px]">
            <div className="rounded-2xl border border-white/80 bg-white/90 p-3 shadow-sm">
              <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#0d4f4f]/10 text-[#0d4f4f]">
                <UserCircle2 className="h-4.5 w-4.5" />
              </div>
              <p className="text-xs font-medium text-slate-500">Profile</p>
              <p className="mt-1 text-sm font-semibold text-[#0a1628]">Foundation</p>
            </div>

            <div className="rounded-2xl border border-white/80 bg-white/90 p-3 shadow-sm">
              <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#00c4cc]/10 text-[#0d4f4f]">
                <LineChart className="h-4.5 w-4.5" />
              </div>
              <p className="text-xs font-medium text-slate-500">Insights</p>
              <p className="mt-1 text-sm font-semibold text-[#0a1628]">Growth context</p>
            </div>

            <div className="rounded-2xl border border-white/80 bg-white/90 p-3 shadow-sm">
              <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#c9a84c]/10 text-[#8a6b18]">
                <ShieldCheck className="h-4.5 w-4.5" />
              </div>
              <p className="text-xs font-medium text-slate-500">Visibility</p>
              <p className="mt-1 text-sm font-semibold text-[#0a1628]">Better matching</p>
            </div>

            <div className="rounded-2xl border border-white/80 bg-white/90 p-3 shadow-sm">
              <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <Sparkles className="h-4.5 w-4.5" />
              </div>
              <p className="text-xs font-medium text-slate-500">Status</p>
              <p className="mt-1 text-sm font-semibold text-[#0a1628]">
                {hasInsights ? "Started" : "Ready"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Guided intro strip */}
      <section className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-base font-semibold text-[#0a1628]">
              Complete this in two parts
            </h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Start with your profile details, then continue with founder insights.
              You can save section by section and come back anytime.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
              Save as you go
            </span>
            <span className="inline-flex items-center rounded-full border border-[#0d4f4f]/10 bg-[#0d4f4f]/5 px-3 py-1 text-xs font-medium text-[#0d4f4f]">
              Mobile friendly
            </span>
          </div>
        </div>
      </section>

      {/* Profile section */}
      <section className="rounded-[26px] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)] overflow-hidden">
        <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-4 py-4 sm:px-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Step 1
          </p>
          <h3 className="mt-1 text-lg font-semibold text-[#0a1628]">
            Profile foundation
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Keep your personal and account information complete so your business profile
            is ready for trust, visibility, and support features.
          </p>
        </div>

        <div className="bg-white p-0">
          <ProfileSettingsAccordion onComplete={onProfileComplete} />
        </div>
      </section>

      {/* Founder insights section */}
      <section className="rounded-[26px] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)] overflow-hidden">
        <div className="border-b border-slate-200 bg-gradient-to-r from-[#f8fbfb] via-white to-[#fcfaf4] px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0d4f4f]">
                Step 2
              </p>
              <h3 className="mt-1 text-lg font-semibold text-[#0a1628]">
                Founder story & growth insights
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-slate-600">
                Share the story behind your business, what drives you, what challenges
                you are navigating, and where you want to grow next.
              </p>
            </div>

            <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
              {insightsSubmitting ? "Saving..." : hasInsights ? "In progress" : "Not started"}
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <FounderInsightsAccordion
            businessId={businesses?.[0]?.id ?? null}
            onSubmit={onFounderInsightsSubmit}
            isLoading={insightsSubmitting}
            initialData={insightSnapshots?.[0] || null}
            onStart={() => setInsightsProgress(true)}
          />
        </div>
      </section>
    </div>
  );
}