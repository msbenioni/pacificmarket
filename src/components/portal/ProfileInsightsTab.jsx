import { useState } from "react";
import { Sparkles, ShieldCheck, LineChart, UserCircle2, ChevronDown } from "lucide-react";
import { CARD_STYLES } from "@/constants/portalUI";
import ProfileSettingsAccordion from "@/components/onboarding/ProfileSettingsAccordion";
import FounderInsightsAccordion from "@/components/forms/FounderInsightsAccordion";

// Premium accordion component (matching InvoiceGenerator style)
function InsightsAccordionSection({
  id,
  title,
  subtitle,
  summary,
  icon: Icon,
  isOpen,
  onToggle,
  children,
}) {
  return (
    <div className="border-b border-gray-100 last:border-b-0 bg-gradient-to-r from-[#0a1628] to-[#0d4f4f] text-white">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-4 sm:px-5 py-4 text-left hover:bg-white/10 transition"
      >
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <Icon className="w-4 h-4 text-white" />
          </div>

          <div className="min-w-0">
            <div className="font-semibold text-white text-sm">{title}</div>
            {subtitle && (
              <div className="text-xs text-gray-300 mt-0.5">{subtitle}</div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {summary && (
            <div className="hidden md:block text-xs text-gray-300 text-right max-w-[140px] truncate">
              {summary}
            </div>
          )}
          <div className="text-gray-300 text-sm">
            {isOpen ? <ChevronDown className="w-4 h-4 rotate-180" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 bg-white">
          <div className="pt-1">{children}</div>
        </div>
      )}
    </div>
  );
}

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
  // Accordion state - multiple sections can be open
  const [openSections, setOpenSections] = useState(["profile", "insights"]);

  const toggleSection = (section) => {
    setOpenSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

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

          </div>
      </section>

      {/* Accordion Sections */}
      <div className="rounded-[26px] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)] overflow-hidden">
        
        {/* Profile Section */}
        <InsightsAccordionSection
          id="profile"
          title="Profile foundation"
          subtitle="Step 1"
          summary="Complete your personal and account information"
          icon={UserCircle2}
          isOpen={openSections.includes("profile")}
          onToggle={() => toggleSection("profile")}
        >
          <ProfileSettingsAccordion onComplete={onProfileComplete} />
        </InsightsAccordionSection>

        {/* Founder Insights Section */}
        <InsightsAccordionSection
          id="insights"
          title="Founder story & growth insights"
          subtitle="Step 2"
          summary="Share your business story and growth insights"
          icon={LineChart}
          isOpen={openSections.includes("insights")}
          onToggle={() => toggleSection("insights")}
        >
          <FounderInsightsAccordion
            businessId={businesses?.[0]?.id ?? null}
            onSubmit={onFounderInsightsSubmit}
            isLoading={insightsSubmitting}
            initialData={insightSnapshots?.[0] || null}
            onStart={() => setInsightsProgress(true)}
          />
        </InsightsAccordionSection>
      </div>
    </div>
  );
}