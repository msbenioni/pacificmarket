import Link from "next/link";
import { createPageUrl } from "@/utils";
import { CheckCircle, X, Star, Shield, ArrowRight, Waves, Compass, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { ClaimAddBusinessModal } from "@/components/onboarding/ClaimAddBusinessModal";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";
import { getSupabase } from "@/lib/supabase/client";
import { BUSINESS_TIER, mapLegacyTier, getTierDisplayName } from "@/constants/business";
import HeroRegistry from "../components/shared/HeroRegistry";

const plans = [
  {
    id: BUSINESS_TIER.VAKA,
    legacyTier: BUSINESS_TIER.BASIC,
    name: getTierDisplayName(BUSINESS_TIER.VAKA),
    subtitle: "Begin the journey",
    price: "Free",
    period: "",
    description:
      "Start your journey in the Pacific Market registry and make sure your business is counted, represented, and discoverable.",
    bestFor: "Early visibility and proud Pacific representation",
    badge: null,
    icon: Compass,
    border: "border-slate-200",
    headerTone: "bg-white",
    accent: "text-[#0a1628]",
    cta: "Start with Vaka",
    ctaClass:
      "bg-white border-2 border-[#0a1628] text-[#0a1628] hover:bg-[#0a1628] hover:text-white",
    highlights: [
      "Public registry listing",
      "Business name, country and category",
      "Discoverable across the platform",
      "Official registry record number",
    ],
    features: [
      { label: "Registry listing", included: true },
      { label: "Business name, country & category", included: true },
      { label: "Public discoverability", included: true },
      { label: "Registry record number", included: true },
      { label: "Logo upload", included: false },
      { label: "Banner image", included: false },
      { label: "Full business profile", included: false },
      { label: "Trust badge", included: false },
      { label: "Priority placement", included: false },
      { label: "Invoice generator", included: false },
      { label: "QR code generator", included: false },
      { label: "Homepage spotlight", included: false },
    ],
  },
  {
    id: BUSINESS_TIER.MANA,
    legacyTier: BUSINESS_TIER.VERIFIED,
    name: getTierDisplayName(BUSINESS_TIER.MANA),
    subtitle: "Build trust and presence",
    price: "$9",
    period: "/month",
    description:
      "Strengthen your presence with branding, a fuller profile, and stronger trust signals that help your business look established and credible.",
    bestFor: "Businesses ready for a stronger public presence",
    badge: null,
    icon: Shield,
    border: "border-[#0d4f4f]",
    headerTone: "bg-gradient-to-br from-[#0d4f4f] to-[#0a5d5d]",
    accent: "text-white",
    cta: "Choose Mana",
    ctaClass: "bg-[#0d4f4f] text-white hover:bg-[#1a6b6b]",
    highlights: [
      "Everything in Vaka",
      "Logo and banner image",
      "Full business profile",
      "Trust-focused profile upgrade",
      "Priority search placement",
    ],
    features: [
      { label: "Registry listing", included: true },
      { label: "Business name, country & category", included: true },
      { label: "Public discoverability", included: true },
      { label: "Registry record number", included: true },
      { label: "Logo upload", included: true },
      { label: "Banner image", included: true },
      { label: "Full business profile", included: true },
      { label: "Trust badge", included: true },
      { label: "Priority placement", included: true },
      { label: "Invoice generator", included: false },
      { label: "QR code generator", included: false },
      { label: "Homepage spotlight", included: false },
    ],
  },
  {
    id: BUSINESS_TIER.MOANA,
    legacyTier: BUSINESS_TIER.FEATURED_PLUS,
    name: getTierDisplayName(BUSINESS_TIER.MOANA),
    subtitle: "Expand your reach",
    price: "$29",
    period: "/month",
    description:
      "For businesses ready to lead with visibility, unlock premium placement, useful tools, and a stronger presence across Pacific Market.",
    bestFor: "Businesses ready to grow reach, visibility and momentum",
    badge: "Most Popular",
    icon: Waves,
    border: "border-[#c9a84c]",
    headerTone: "bg-gradient-to-br from-[#c9a84c] to-[#b8973b]",
    accent: "text-[#0a1628]",
    cta: "Choose Moana",
    ctaClass: "bg-[#c9a84c] text-[#0a1628] hover:bg-[#b8973b]",
    highlights: [
      "Everything in Mana",
      "Invoice generator",
      "QR code generator",
      "Premium visibility",
      "Homepage spotlight",
    ],
    features: [
      { label: "Registry listing", included: true },
      { label: "Business name, country & category", included: true },
      { label: "Public discoverability", included: true },
      { label: "Registry record number", included: true },
      { label: "Logo upload", included: true },
      { label: "Banner image", included: true },
      { label: "Full business profile", included: true },
      { label: "Trust badge", included: true },
      { label: "Priority placement", included: true },
      { label: "Invoice generator", included: true },
      { label: "QR code generator", included: true },
      { label: "Homepage spotlight", included: true },
    ],
  },
];

export default function Pricing() {
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [processingPlan, setProcessingPlan] = useState(null);
  const { createCheckoutSession, error } = useStripeCheckout();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = getSupabase();
        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser();
        setUser(currentUser);
      } catch {
        setUser(null);
      } finally {
        setPageLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleUpgrade = async (planId) => {
    if (!user) {
      window.location.href = createPageUrl("BusinessLogin");
      return;
    }

    setProcessingPlan(planId);

    try {
      if (planId === BUSINESS_TIER.VAKA) {
        setShowModal(true);
      } else {
        await createCheckoutSession({ tier: planId });
      }
    } finally {
      setProcessingPlan(null);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#0d4f4f] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9fc]">
      <HeroRegistry
        badge="Pricing"
        title="Choose the Presence That Fits Your Journey"
        subtitle=""
        description="Start with Vaka to be represented in the registry, move into Mana for stronger trust and branding, or choose Moana for premium visibility and practical tools designed to help Pacific businesses grow."
      />

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0d4f4f]">
              A Pacific business journey
            </p>
            <h2 className="mt-2 text-3xl font-bold text-[#0a1628]">
              {getTierDisplayName(BUSINESS_TIER.VAKA)} → {getTierDisplayName(BUSINESS_TIER.MANA)} → {getTierDisplayName(BUSINESS_TIER.MOANA)}
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-sm leading-6 text-slate-600">
              Begin the journey, strengthen your presence, then expand your reach.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3 items-stretch">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const isMoana = plan.id === BUSINESS_TIER.MOANA;

              return (
                <div key={plan.id} className={`relative ${isMoana ? "lg:-mt-3" : ""}`}>
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <span className="inline-flex items-center rounded-full bg-[#c9a84c] px-4 py-1 text-xs font-bold text-[#0a1628] shadow-md">
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <div
                    className={`h-full overflow-hidden rounded-[28px] border ${plan.border} bg-white shadow-[0_18px_50px_rgba(10,22,40,0.08)] transition-all hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(10,22,40,0.12)] ${
                      isMoana ? "ring-2 ring-[#c9a84c]/25" : ""
                    }`}
                  >
                    <div className={`${plan.headerTone} p-7`}>
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                            plan.id === BUSINESS_TIER.VAKA
                              ? "bg-[#0a1628]/5"
                              : plan.id === BUSINESS_TIER.MANA
                              ? "bg-white/10"
                              : "bg-white/40"
                          }`}
                        >
                          <Icon
                            className={`w-5 h-5 ${
                              plan.id === BUSINESS_TIER.MANA
                                ? "text-white"
                                : plan.id === BUSINESS_TIER.MOANA
                                ? "text-[#0a1628]"
                                : "text-[#0a1628]"
                            }`}
                          />
                        </div>
                        <div>
                          <p className={`text-lg font-bold ${plan.accent}`}>{plan.name}</p>
                          <p
                            className={`text-xs ${
                              plan.id === BUSINESS_TIER.MANA
                                ? "text-white/80"
                                : plan.id === BUSINESS_TIER.MOANA
                                ? "text-[#0a1628]/70"
                                : "text-slate-500"
                            }`}
                          >
                            {plan.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 flex items-end gap-1">
                        <span className={`text-4xl font-black ${plan.accent}`}>{plan.price}</span>
                        {plan.period && (
                          <span
                            className={`pb-1 text-sm ${
                              plan.id === BUSINESS_TIER.MANA
                                ? "text-white/80"
                                : plan.id === BUSINESS_TIER.MOANA
                                ? "text-[#0a1628]/70"
                                : "text-slate-500"
                            }`}
                          >
                            {plan.period}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex h-[calc(100%-148px)] flex-col p-7">
                      <p className="text-sm leading-6 text-slate-600">{plan.description}</p>

                      <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                          Best for
                        </p>
                        <p className="mt-1 text-sm text-[#0a1628]">{plan.bestFor}</p>
                      </div>

                      <div className="mt-6">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                          Highlights
                        </p>
                        <ul className="mt-3 space-y-3">
                          {plan.highlights.map((item) => (
                            <li key={item} className="flex items-start gap-2.5">
                              <CheckCircle
                                className={`mt-0.5 h-4 w-4 flex-shrink-0 ${
                                  plan.id === BUSINESS_TIER.MOANA ? "text-[#c9a84c]" : "text-[#0d4f4f]"
                                }`}
                              />
                              <span className="text-sm text-slate-700">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-6 border-t border-slate-200 pt-6">
                        <button
                          onClick={() => handleUpgrade(plan.id)}
                          disabled={processingPlan !== null}
                          className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition ${
                            processingPlan !== null ? "opacity-60 cursor-not-allowed" : plan.ctaClass
                          }`}
                        >
                          {processingPlan === plan.id ? (
                            <>
                              <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              {plan.cta}
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#f1f4f8] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0d4f4f]">
              Compare features
            </p>
            <h2 className="mt-2 text-2xl font-bold text-[#0a1628]">
              See what grows with each plan
            </h2>
            <p className="mt-3 text-sm text-slate-600 max-w-2xl mx-auto">
              Choose the level that matches where your business is now, then upgrade when you are ready for stronger identity or wider visibility.
            </p>
          </div>

          <div className="overflow-x-auto rounded-[24px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(10,22,40,0.06)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#0a1628]">
                  <th className="w-[42%] px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Feature
                  </th>
                  {plans.map((p) => (
                    <th key={p.id} className="px-4 py-4 text-center">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                          p.id === "vaka"
                            ? "bg-white/10 text-slate-300"
                            : p.id === "mana"
                            ? "bg-[#00c4cc]/20 text-[#8df3f6]"
                            : "bg-[#c9a84c]/20 text-[#f4e3a8]"
                        }`}
                      >
                        {p.name}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {plans[2].features.map((feature, i) => {
                  const label = feature.label;
                  const highlighted =
                    label === "Logo upload" ||
                    label === "Banner image" ||
                    label === "Invoice generator" ||
                    label === "QR code generator" ||
                    label === "Homepage spotlight";

                  return (
                    <tr
                      key={label}
                      className={`border-b border-slate-100 ${
                        highlighted ? "bg-[#fffaf0]" : i % 2 === 0 ? "bg-white" : "bg-slate-50/60"
                      }`}
                    >
                      <td className="px-6 py-3 text-xs font-medium text-slate-700">
                        <div className="flex items-center gap-2">
                          {highlighted && <Sparkles className="w-4 h-4 text-[#c9a84c]" />}
                          {label}
                        </div>
                      </td>

                      {plans.map((plan) => (
                        <td key={plan.id} className="px-4 py-3 text-center">
                          {plan.features[i].included ? (
                            <CheckCircle
                              className={`mx-auto h-4 w-4 ${
                                plan.id === BUSINESS_TIER.MOANA ? "text-[#c9a84c]" : "text-[#0d4f4f]"
                              }`}
                            />
                          ) : (
                            <X className="mx-auto h-4 w-4 text-slate-300" />
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <ClaimAddBusinessModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onClaimSelected={() => setShowModal(false)}
        onAddSelected={() => setShowModal(false)}
      />
    </div>
  );
}
