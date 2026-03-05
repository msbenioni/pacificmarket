import Link from "next/link";
import { createPageUrl } from "@/utils";
import { CheckCircle, X, Star, Shield, Zap, ArrowRight } from "lucide-react";
import ChevronStrip from "../components/home/ChevronStrip";
import HeroRegistry from "../components/shared/HeroRegistry";
import { useState } from "react";
import { ClaimAddBusinessModal } from "../components/onboarding/ClaimAddBusinessModal";

const plans = [
  {
    id: "free",
    name: "Basic Listing",
    price: "Free",
    period: "",
    description: "List with pride — represent your island, your people, and your craft. Join the registry and help grow Pacific visibility worldwide.",
    bestFor: "Identity-first visibility (Free)",
    color: "border-gray-200",
    headerBg: "bg-gray-50",
    badge: null,
    cta: "Get Listed Free",
    ctaClass: "bg-white border-2 border-[#0a1628] text-[#0a1628] hover:bg-[#0a1628] hover:text-white",
    features: [
      { label: "Basic registry listing", included: true },
      { label: "Business name, country & category", included: true },
      { label: "Public discoverability", included: true },
      { label: "Registry record number", included: true },
      { label: "Logo + banner image", included: false },
      { label: "Full business profile", included: false },
      { label: "Verified badge", included: false },
      { label: "Priority search placement", included: false },
      { label: "Invoice generator", included: false },
      { label: "QR code generator", included: false },
      { label: "Homepage spotlight", included: false },
    ],
  },
  {
    id: "verified",
    name: "Verified",
    price: "$9",
    period: "/month",
    description: "A verified business identity with your logo and banner image — plus login access so you can update anytime.",
    bestFor: "Trusted identity ($9/mo)",
    color: "border-[#0d4f4f]",
    headerBg: "bg-[#0d4f4f]",
    badge: null,
    cta: "Get Verified",
    ctaClass: "bg-[#0d4f4f] text-white hover:bg-[#1a6b6b]",
    icon: Shield,
    identity: [
      { title: "Logo upload", desc: "Upload 1 logo to brand your listing." },
      { title: "Banner image", desc: "Upload 1 banner image for a premium profile." },
    ],
    includesLabel: "Everything in Basic",
    adds: [
      "Logo & banner upload (1 each)",
      "Full business profile",
      "Verified badge",
      "Priority search placement",
    ],
    features: [
      { label: "Basic registry listing", included: true },
      { label: "Business name, country & category", included: true },
      { label: "Public discoverability", included: true },
      { label: "Registry record number", included: true },
      { label: "Logo + banner image", included: true },
      { label: "Full business profile", included: true },
      { label: "Verified badge", included: true },
      { label: "Priority search placement", included: true },
      { label: "Invoice generator", included: false },
      { label: "QR code generator", included: false },
      { label: "Homepage spotlight", included: false },
    ],
  },
  {
    id: "featured_plus",
    name: "Featured+",
    price: "$29",
    period: "/month",
    description: "Maximum visibility plus included business tools — invoices and QR codes to help you sell faster.",
    bestFor: "Premium growth + tools ($29/mo)",
    color: "border-[#c9a84c]",
    headerBg: "bg-gradient-to-br from-[#c9a84c] to-[#b8973b]",
    badge: "Most Popular",
    cta: "Go Featured+",
    ctaClass: "bg-[#c9a84c] text-[#0a1628] hover:bg-[#b8973b]",
    icon: Star,
    apps: [
      { title: "Invoice Generator", desc: "Create invoices in seconds for customers." },
      { title: "QR Code Generator", desc: "Share a scannable link at markets & online." },
    ],
    includesLabel: "Everything in Verified",
    adds: [
      "Invoice Generator (app)",
      "QR Code Generator (app)",
      "Homepage Spotlight",
    ],
    features: [
      { label: "Basic registry listing", included: true },
      { label: "Business name, country & category", included: true },
      { label: "Public discoverability", included: true },
      { label: "Registry record number", included: true },
      { label: "Logo + banner image", included: true },
      { label: "Full business profile", included: true },
      { label: "Verified badge", included: true },
      { label: "Priority search placement", included: true },
      { label: "Invoice generator", included: true },
      { label: "QR code generator", included: true },
      { label: "Homepage spotlight", included: true },
    ],
  },
];

export default function Pricing() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="bg-[#f8f9fc]">
      {/* Hero */}
      <HeroRegistry
        badge="Pricing Plans"
        title="Invest in Your Pacific Business Identity"
        subtitle=""
        description="Start free, upgrade when ready. Verified builds trust with a complete branded profile. Featured+ adds tools that help you sell and scale."
      />

      {/* Plans */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            {plans.map(plan => (
              <div key={plan.id} className="relative pt-4">
                {/* Badge sits above the card */}
                {plan.badge && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
                    <span className="bg-[#c9a84c] text-[#0a1628] text-xs font-bold px-4 py-1 rounded-full shadow">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className={`bg-white border-2 rounded-2xl overflow-hidden transition-all flex flex-col h-full
                shadow-md hover:shadow-xl hover:-translate-y-1
                ${plan.id === "featured_plus" ? "ring-2 ring-[#c9a84c]/40" : ""}
                ${plan.color}`}>
                  {/* Header */}
                  <div className={`${plan.headerBg} p-6`}>
                    <div className="flex items-center gap-2 mb-2">
                      {plan.icon && <plan.icon className={`w-5 h-5 ${plan.id === "featured_plus" ? "text-[#0a1628]" : "text-[#00c4cc]"}`} />}
                      <span className={`font-bold text-sm ${
                        plan.id === "free" ? "text-[#0a1628]"
                        : plan.id === "featured_plus" ? "text-[#0a1628]"
                        : "text-white"
                      }`}>{plan.name}</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-4xl font-black ${
                        plan.id === "free" ? "text-[#0a1628]"
                        : plan.id === "featured_plus" ? "text-[#0a1628]"
                        : "text-white"
                      }`}>{plan.price}</span>
                      {plan.period && <span className={`text-sm ${plan.id === "featured_plus" ? "text-[#0a1628]/70" : "text-white/70"}`}>{plan.period}</span>}
                    </div>
                  </div>

                  {/* Body — grows to fill height */}
                  <div className="p-6 flex flex-col flex-1">
                    <p className="text-gray-500 text-xs leading-relaxed mb-4">{plan.description}</p>
                    
                    {plan.bestFor && (
                      <div className="text-xs text-gray-600 mb-6">
                        <span className="font-semibold">Best for:</span> {plan.bestFor}
                      </div>
                    )}

                    {plan.id === "free" && (
                      <div className="text-[11px] text-gray-500 leading-relaxed -mt-3 mb-6">
                        Every listing strengthens Pacific representation and makes our businesses easier to find and support.
                      </div>
                    )}

                    {/* Premium blocks */}
                    {plan.identity?.length ? (
                      <div className="mb-5 rounded-xl border border-[#00c4cc]/25 bg-[#00c4cc]/5 p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-[#0d4f4f]">
                            Identity Upgrade
                          </div>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/70 border border-[#00c4cc]/20 text-[#0a1628]">
                            Verified
                          </span>
                        </div>

                        <div className="grid gap-2">
                          {plan.identity.map((x) => (
                            <div key={x.title} className="rounded-lg bg-white border border-gray-200 p-3">
                              <div className="text-xs font-semibold text-[#0a1628]">{x.title}</div>
                              <div className="text-[11px] text-gray-500 mt-1">{x.desc}</div>
                            </div>
                          ))}
                        </div>

                        {plan.identityNote && (
                          <div className="text-[11px] text-gray-600 mt-3">
                            {plan.identityNote}
                          </div>
                        )}
                      </div>
                    ) : null}

                    {plan.apps?.length ? (
                      <div className="mb-5 rounded-xl border border-[#c9a84c]/35 bg-[#fff7db] p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-[#0a1628]">
                            Included Apps
                          </div>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/70 border border-[#c9a84c]/30 text-[#0a1628]">
                            Featured+
                          </span>
                        </div>

                        <div className="grid gap-2">
                          {plan.apps.map((x) => (
                            <div key={x.title} className="rounded-lg bg-white border border-[#c9a84c]/25 p-3">
                              <div className="text-xs font-semibold text-[#0a1628]">{x.title}</div>
                              <div className="text-[11px] text-gray-600 mt-1">{x.desc}</div>
                            </div>
                          ))}
                        </div>

                        {plan.appsNote && (
                          <div className="text-[11px] text-gray-700 mt-3">
                            {plan.appsNote}
                          </div>
                        )}
                      </div>
                    ) : null}

                    {/* Includes + Adds (compact) */}
                    <div className="flex-1">
                      {plan.id === "free" ? (
                        // FREE keeps full list
                        <ul className="space-y-2.5">
                          {plan.features.map(f => (
                            <li key={f.label} className="flex items-center gap-2.5">
                              {f.included ? (
                                <CheckCircle className="w-4 h-4 text-[#0d4f4f] flex-shrink-0" />
                              ) : (
                                <X className="w-4 h-4 text-gray-200 flex-shrink-0" />
                              )}
                              <span className={`text-xs ${f.included ? "text-gray-700" : "text-gray-300"}`}>
                                {f.label}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        // VERIFIED + FEATURED+: compact summary
                        <div className="rounded-xl border border-gray-200 bg-white p-4">
                          <div className="flex items-center gap-2 text-xs font-semibold text-[#0a1628]">
                            <CheckCircle className="w-4 h-4 text-[#0d4f4f]" />
                            {plan.includesLabel}
                          </div>

                          <p className="text-[11px] text-gray-500 mt-1">
                            Includes all core registry visibility and public discoverability.
                          </p>

                          <div className="mt-4">
                            <div className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-2">
                              Adds
                            </div>
                            <ul className="space-y-2">
                              {plan.adds?.map((item) => (
                                <li key={item} className="flex items-start gap-2">
                                  <Star
                                    className={`w-4 h-4 flex-shrink-0 ${
                                      plan.id === "featured_plus" ? "text-[#c9a84c]" : "text-[#00c4cc]"
                                    }`}
                                  />
                                  <span className="text-xs text-gray-700">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* CTA always at bottom */}
                    <div className="mt-6">
                      <button 
                        onClick={() => setShowModal(true)}
                        className={`inline-flex w-full justify-center items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition ${plan.ctaClass}`}
                      >
                        {plan.cta} {plan.id !== "free" && <ArrowRight className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 bg-[#f0f2f8] px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-[#0a1628] mb-10 text-center">Full Comparison</h2>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#0a1628]">
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-xs uppercase tracking-wider w-1/2">Feature</th>
                  {plans.map(p => (
                    <th key={p.id} className="text-center py-4 px-4">
                      <div className={`inline-block font-bold text-xs px-3 py-1 rounded-full ${
                        p.id === "free" ? "bg-white/10 text-gray-300"
                        : p.id === "verified" ? "bg-[#00c4cc]/20 text-[#00c4cc]"
                        : "bg-[#c9a84c]/25 text-[#c9a84c]"
                      }`}>{p.name}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {plans[2].features.map((f, i) => {
                  const rowLabel = f.label;
                  const isKeyRow =
                    rowLabel === "Logo + banner image" ||
                    rowLabel === "Invoice generator" ||
                    rowLabel === "QR code generator";

                  return (
                    <tr
                      key={i}
                      className={`border-b border-gray-100 transition-colors
                      ${isKeyRow ? "bg-[#fff7db]" : i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                      hover:bg-gray-50`}
                    >
                      <td className={`py-3 px-6 text-xs font-medium
                        ${isKeyRow ? "text-[#0a1628]" : "text-gray-700"}`}>
                        <div className="flex items-center gap-2">
                          {isKeyRow && <Star className="w-4 h-4 text-[#c9a84c]" />}
                          {rowLabel}
                          {rowLabel === "Logo + banner image" && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#00c4cc]/15 text-[#0d4f4f]">
                              Verified key benefit
                            </span>
                          )}
                          {(rowLabel === "Invoice generator" || rowLabel === "QR code generator") && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#c9a84c]/25 text-[#0a1628]">
                              Featured+ key benefit
                            </span>
                          )}
                        </div>
                      </td>
                      {plans.map(plan => (
                        <td key={plan.id} className="text-center py-3 px-4">
                          {plan.features[i].included
                            ? <CheckCircle className={`w-4 h-4 ${isKeyRow ? "text-[#c9a84c]" : "text-[#0d4f4f]"} mx-auto`} />
                            : <X className="w-4 h-4 text-gray-300 mx-auto" />}
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
      
      {/* Modal */}
      <ClaimAddBusinessModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onClaimSelected={() => setShowModal(false)}
        onAddSelected={() => setShowModal(false)}
      />
    </div>
  );
}