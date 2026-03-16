import Link from "next/link";
import { useRouter } from "next/navigation";
import { createPageUrl } from "@/utils";
import {
  CheckCircle,
  X,
  Shield,
  ArrowRight,
  Waves,
  Compass,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState, useEffect } from "react";
import { ClaimAddBusinessModal } from "@/components/onboarding/ClaimAddBusinessModal";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";
import { SUBSCRIPTION_TIER, getTierDisplayName } from "@/constants/unifiedConstants";
import { TIER_BENEFITS } from "@/constants/tierBenefits";
import HeroStandard from "../components/shared/HeroStandard";

const plans = [
  {
    id: SUBSCRIPTION_TIER.VAKA,
    name: TIER_BENEFITS.vaka.label,
    subtitle: TIER_BENEFITS.vaka.subtitle,
    price: TIER_BENEFITS.vaka.price,
    period: "",
    description: TIER_BENEFITS.vaka.description,
    bestFor: "Getting discovered with a strong, credible starting presence",
    badge: null,
    icon: Compass,
    border: "border-slate-200",
    headerTone: "bg-white",
    accent: "text-[#0a1628]",
    cta: "Start with Vaka",
    ctaClass:
      "bg-white border-2 border-[#0a1628] text-[#0a1628] hover:bg-[#0a1628] hover:text-white",
    highlights: TIER_BENEFITS.vaka.features,
    features: TIER_BENEFITS.vaka.features.map((feature) => ({
      label: feature,
      included: true,
    })),
  },
  {
    id: SUBSCRIPTION_TIER.MANA,
    name: TIER_BENEFITS.mana.label,
    subtitle: TIER_BENEFITS.mana.subtitle,
    price: TIER_BENEFITS.mana.price,
    period: "/month",
    description: TIER_BENEFITS.mana.description,
    bestFor: "Businesses ready for a stronger public presence and more trust",
    badge: null,
    icon: Shield,
    border: "border-[#0d4f4f]",
    headerTone: "bg-gradient-to-br from-[#0d4f4f] to-[#0a5d5d]",
    accent: "text-white",
    cta: "Choose Mana",
    ctaClass: "bg-[#0d4f4f] text-white hover:bg-[#1a6b6b]",
    highlights: TIER_BENEFITS.mana.features.slice(0, 3),
    features: [
      ...TIER_BENEFITS.vaka.features.map((feature) => ({
        label: feature,
        included: true,
      })),
      ...TIER_BENEFITS.mana.features.map((feature) => ({
        label: feature,
        included: true,
      })),
    ],
  },
  {
    id: SUBSCRIPTION_TIER.MOANA,
    name: TIER_BENEFITS.moana.label,
    subtitle: TIER_BENEFITS.moana.subtitle,
    price: TIER_BENEFITS.moana.price,
    period: "/month",
    description: TIER_BENEFITS.moana.description,
    bestFor: "Businesses ready to expand visibility, reach, and momentum",
    badge: "Most Popular",
    icon: Waves,
    border: "border-[#c9a84c]",
    headerTone: "bg-gradient-to-br from-[#c9a84c] to-[#b8973b]",
    accent: "text-[#0a1628]",
    cta: "Choose Moana",
    ctaClass: "bg-[#c9a84c] text-[#0a1628] hover:bg-[#b8973b]",
    highlights: TIER_BENEFITS.moana.features.slice(0, 4),
    features: [
      ...TIER_BENEFITS.vaka.features.map((feature) => ({
        label: feature,
        included: true,
      })),
      ...TIER_BENEFITS.mana.features.map((feature) => ({
        label: feature,
        included: true,
      })),
      ...TIER_BENEFITS.moana.features.map((feature) => ({
        label: feature,
        included: true,
      })),
    ],
  },
];

export default function Pricing() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [processingPlan, setProcessingPlan] = useState(null);
  const [mobileComparePlan, setMobileComparePlan] = useState(SUBSCRIPTION_TIER.MOANA);
  const { createCheckoutSession, error } = useStripeCheckout();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { getSupabase } = await import("@/lib/supabase/client");
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
      if (planId === SUBSCRIPTION_TIER.VAKA) {
        router.push(createPageUrl("BusinessLogin"));
        return;
      }
      router.push(createPageUrl("BusinessLogin"));
      return;
    }

    setProcessingPlan(planId);

    try {
      if (planId === SUBSCRIPTION_TIER.VAKA) {
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
      <HeroStandard
        badge="Pricing"
        title="Choose the plan that matches your visibility goals."
        subtitle=""
        description="Pacific Discovery Network plans are designed to support every stage of business visibility — from getting discovered to building a stronger, more trusted presence."
        compact
      />

      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0d4f4f]">
              Built for growth
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-[#0a1628]">
              {getTierDisplayName(SUBSCRIPTION_TIER.VAKA)} →{" "}
              {getTierDisplayName(SUBSCRIPTION_TIER.MANA)} →{" "}
              {getTierDisplayName(SUBSCRIPTION_TIER.MOANA)}
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-sm sm:text-base leading-6 text-slate-600">
              Start with a strong foundation, strengthen your presence, then
              expand your reach when you are ready.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3 items-stretch">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const isMoana = plan.id === SUBSCRIPTION_TIER.MOANA;

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
                    className={`h-full flex flex-col overflow-hidden rounded-[28px] border ${plan.border} bg-white shadow-[0_18px_50px_rgba(10,22,40,0.08)] transition-all hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(10,22,40,0.12)] ${
                      isMoana ? "ring-2 ring-[#c9a84c]/25" : ""
                    }`}
                  >
                    <div className={`${plan.headerTone} p-5 sm:p-7`}>
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                            plan.id === SUBSCRIPTION_TIER.VAKA
                              ? "bg-[#0a1628]/5"
                              : plan.id === SUBSCRIPTION_TIER.MANA
                              ? "bg-white/10"
                              : "bg-white/40"
                          }`}
                        >
                          <Icon
                            className={`w-5 h-5 ${
                              plan.id === SUBSCRIPTION_TIER.MANA
                                ? "text-white"
                                : plan.id === SUBSCRIPTION_TIER.MOANA
                                ? "text-[#0a1628]"
                                : "text-[#0a1628]"
                            }`}
                          />
                        </div>
                        <div>
                          <p className={`text-base sm:text-lg font-bold ${plan.accent}`}>
                            {plan.name}
                          </p>
                          <p
                            className={`text-[11px] sm:text-xs ${
                              plan.id === SUBSCRIPTION_TIER.MANA
                                ? "text-white/80"
                                : plan.id === SUBSCRIPTION_TIER.MOANA
                                ? "text-[#0a1628]/70"
                                : "text-slate-500"
                            }`}
                          >
                            {plan.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 sm:mt-6 flex items-end gap-1">
                        <span className={`text-3xl sm:text-4xl font-black ${plan.accent}`}>
                          {plan.price}
                        </span>
                        {plan.period && (
                          <span
                            className={`pb-1 text-sm ${
                              plan.id === SUBSCRIPTION_TIER.MANA
                                ? "text-white/80"
                                : plan.id === SUBSCRIPTION_TIER.MOANA
                                ? "text-[#0a1628]/70"
                                : "text-slate-500"
                            }`}
                          >
                            {plan.period}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col p-5 sm:p-7">
                      <p className="text-[13px] sm:text-sm leading-6 text-slate-600">
                        {plan.description}
                      </p>

                      <div className="mt-3 sm:mt-4 rounded-xl sm:rounded-2xl bg-slate-50 px-4 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                          Best for
                        </p>
                        <p className="mt-1 text-sm text-[#0a1628]">{plan.bestFor}</p>
                      </div>

                      <div className="mt-4 sm:mt-6">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                          Highlights
                        </p>
                        <ul className="mt-3 space-y-2 sm:space-y-3">
                          {plan.highlights.map((item) => (
                            <li key={item} className="flex items-start gap-2.5">
                              <CheckCircle
                                className={`mt-0.5 h-4 w-4 flex-shrink-0 ${
                                  plan.id === SUBSCRIPTION_TIER.MOANA
                                    ? "text-[#c9a84c]"
                                    : "text-[#0d4f4f]"
                                }`}
                              />
                              <span className="text-[13px] sm:text-sm text-slate-700">
                                {item}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-auto border-t border-slate-200 pt-5 sm:pt-6">
                        <button
                          onClick={() => handleUpgrade(plan.id)}
                          disabled={
                            processingPlan !== null ||
                            (plan.id === SUBSCRIPTION_TIER.VAKA && user)
                          }
                          className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition min-h-[44px] ${
                            processingPlan !== null ||
                            (plan.id === SUBSCRIPTION_TIER.VAKA && user)
                              ? "opacity-60 cursor-not-allowed bg-gray-100 text-gray-500 border border-gray-200"
                              : plan.ctaClass
                          }`}
                        >
                          {processingPlan === plan.id ? (
                            <>
                              <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                              Processing...
                            </>
                          ) : plan.id === SUBSCRIPTION_TIER.VAKA && user ? (
                            <>
                              Current Plan
                              <CheckCircle className="w-4 h-4" />
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

      <section className="bg-[#f1f4f8] py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0d4f4f]">
              Compare features
            </p>
            <h2 className="mt-2 text-xl sm:text-2xl font-bold text-[#0a1628]">
              See what’s included at each level
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
              Choose the level that fits your business today, then upgrade when
              you are ready for stronger presentation, identity, and reach.
            </p>
          </div>

          <div className="lg:hidden space-y-4">
            {plans.map((plan) => {
              const isOpen = mobileComparePlan === plan.id;
              const accent =
                plan.id === SUBSCRIPTION_TIER.MOANA
                  ? "text-[#c9a84c]"
                  : plan.id === SUBSCRIPTION_TIER.MANA
                  ? "text-[#0d4f4f]"
                  : "text-[#0a1628]";

              return (
                <div
                  key={plan.id}
                  className="rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => setMobileComparePlan(isOpen ? null : plan.id)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-4"
                  >
                    <div className="text-left">
                      <p className="text-sm font-semibold text-[#0a1628]">{plan.name}</p>
                      <p className="text-xs text-slate-500">{plan.subtitle}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${accent}`}>{plan.price}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-slate-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-500" />
                      )}
                    </div>
                  </button>
                  {isOpen && (
                    <div className="border-t border-slate-100 px-4 pb-4 pt-3">
                      <ul className="space-y-2">
                        {plan.features.map((feature) => (
                          <li
                            key={feature.label}
                            className="flex items-start gap-2 text-xs text-slate-700"
                          >
                            <CheckCircle
                              className={`mt-0.5 h-4 w-4 flex-shrink-0 ${
                                plan.id === SUBSCRIPTION_TIER.MOANA
                                  ? "text-[#c9a84c]"
                                  : "text-[#0d4f4f]"
                              }`}
                            />
                            <span>{feature.label}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="hidden lg:block overflow-x-auto rounded-[24px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(10,22,40,0.06)]">
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
                    label === "Email signature generator" ||
                    label === "Homepage spotlight";

                  return (
                    <tr
                      key={label}
                      className={`border-b border-slate-100 ${
                        highlighted
                          ? "bg-[#fffaf0]"
                          : i % 2 === 0
                          ? "bg-white"
                          : "bg-slate-50/60"
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
                          {plan.features[i]?.included ? (
                            <CheckCircle
                              className={`mx-auto h-4 w-4 ${
                                plan.id === SUBSCRIPTION_TIER.MOANA
                                  ? "text-[#c9a84c]"
                                  : "text-[#0d4f4f]"
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