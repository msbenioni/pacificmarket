import Link from "next/link";
import { createPageUrl } from "@/utils";
import { CheckCircle, X, Star, Shield, Zap, ArrowRight } from "lucide-react";
import ChevronStrip from "../components/home/ChevronStrip";

const plans = [
  {
    id: "free",
    name: "Basic Listing",
    price: "Free",
    period: "",
    description: "Get your business on the registry and discoverable by the Pacific community.",
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
      { label: "Logo & cover image", included: false },
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
    description: "The standard for professional Pacific business identity. Trusted, verified, and fully profiled.",
    color: "border-[#0d4f4f]",
    headerBg: "bg-[#0d4f4f]",
    badge: null,
    cta: "Get Verified",
    ctaClass: "bg-[#0d4f4f] text-white hover:bg-[#1a6b6b]",
    icon: Shield,
    features: [
      { label: "Basic registry listing", included: true },
      { label: "Business name, country & category", included: true },
      { label: "Public discoverability", included: true },
      { label: "Registry record number", included: true },
      { label: "Logo & cover image", included: true },
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
    description: "Maximum visibility, business tools, and homepage spotlight for growing Pacific enterprises.",
    color: "border-[#c9a84c]",
    headerBg: "bg-gradient-to-br from-[#c9a84c] to-[#b8973b]",
    badge: "Most Popular",
    cta: "Go Featured+",
    ctaClass: "bg-[#c9a84c] text-[#0a1628] hover:bg-[#b8973b]",
    icon: Star,
    features: [
      { label: "Basic registry listing", included: true },
      { label: "Business name, country & category", included: true },
      { label: "Public discoverability", included: true },
      { label: "Registry record number", included: true },
      { label: "Logo & cover image", included: true },
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
  return (
    <div className="bg-[#f8f9fc]">
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[720px]">
        <div className="absolute inset-0">
          <img
            src="/hero.png"
            alt="Pacific Ocean horizon"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/18 via-black/0 to-black/0" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/90 border border-white/40 rounded-full px-3 py-1.5 shadow-sm backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[#00c4cc]" />
              <span className="text-xs font-semibold tracking-wider uppercase text-[#0d4f4f]">
                Connecting Pacific Enterprises Worldwide
              </span>
            </div>

            <div className="mt-5 bg-[#0a1628]/62 backdrop-blur-md border border-white/10 rounded-2xl p-7 shadow-xl">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-[1.02]">
                Invest in Your{" "}
                <span className="text-[#00c4cc]">Pacific Business</span>{" "}
                <span className="text-[#c9a84c]">Identity</span>
              </h1>

              <div className="mt-4 h-[3px] w-44 rounded-full bg-gradient-to-r from-[#00c4cc] via-[#c9a84c] to-transparent" />

              <p className="mt-4 text-base sm:text-lg text-white/90">
                Choose the plan that reflects your commitment to professional Pacific business representation.
              </p>
            </div>
          </div>
        </div>
      </section>

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

                <div className={`bg-white border-2 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col h-full ${plan.color}`}>
                  {/* Header */}
                  <div className={`${plan.headerBg} p-6`}>
                    <div className="flex items-center gap-2 mb-2">
                      {plan.icon && <plan.icon className={`w-5 h-5 ${plan.id === "featured_plus" ? "text-[#0a1628]" : "text-[#00c4cc]"}`} />}
                      <span className={`font-bold text-sm ${plan.id === "free" ? "text-[#0a1628]" : "text-white"}`}>{plan.name}</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-4xl font-black ${plan.id === "free" ? "text-[#0a1628]" : "text-white"}`}>{plan.price}</span>
                      {plan.period && <span className={`text-sm ${plan.id === "featured_plus" ? "text-[#0a1628]/70" : "text-white/70"}`}>{plan.period}</span>}
                    </div>
                  </div>

                  {/* Body — grows to fill height */}
                  <div className="p-6 flex flex-col flex-1">
                    <p className="text-gray-500 text-xs leading-relaxed mb-6">{plan.description}</p>

                    <ul className="space-y-2.5 flex-1">
                      {plan.features.map(f => (
                        <li key={f.label} className="flex items-center gap-2.5">
                          {f.included
                            ? <CheckCircle className="w-4 h-4 text-[#0d4f4f] flex-shrink-0" />
                            : <X className="w-4 h-4 text-gray-200 flex-shrink-0" />}
                          <span className={`text-xs ${f.included ? "text-gray-700" : "text-gray-300"}`}>{f.label}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA always at bottom */}
                    <div className="mt-6">
                      <Link href={createPageUrl("ApplyListing")} className="inline-flex items-center gap-2 bg-[#0a1628] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#122040]">
                        {plan.cta} {plan.id !== "free" && <ArrowRight className="w-4 h-4 inline ml-1" />}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 bg-[#f0f2f8] border-y border-gray-200 px-4 sm:px-6 lg:px-8">
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
                {plans[2].features.map((f, i) => (
                  <tr key={i} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                    <td className="py-3 px-6 text-gray-700 text-xs font-medium">{f.label}</td>
                    {plans.map(plan => (
                      <td key={plan.id} className="text-center py-3 px-4">
                        {plan.features[i].included
                          ? <CheckCircle className="w-4 h-4 text-[#0d4f4f] mx-auto" />
                          : <X className="w-4 h-4 text-gray-300 mx-auto" />}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <ChevronStrip />

      {/* FAQ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-[#0a1628] mb-8 text-center">Common Questions</h2>
          <div className="space-y-4">
            {[
              { q: "What does 'Verified' actually mean?", a: "Our governance team reviews your business identity, ownership, and cultural connection. A verified badge signals to the community and partners that your record has been independently confirmed." },
              { q: "Can I upgrade or downgrade my plan?", a: "Yes. You can upgrade at any time from your customer portal. Downgrades take effect at the end of your billing period." },
              { q: "Is there a fee to submit a free listing?", a: "No. Submitting a basic listing is completely free. Your application goes through admin review before being published." },
              { q: "What are the business tools?", a: "Featured+ includes a professional Invoice Generator and a QR Code Generator linked to your registry profile — designed for day-to-day Pacific business operations." },
            ].map((faq, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-md hover:shadow-xl transition-all">
                <h3 className="font-bold text-[#0a1628] text-sm mb-2">{faq.q}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}