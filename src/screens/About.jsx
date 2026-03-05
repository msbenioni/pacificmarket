import Link from "next/link";
import { createPageUrl } from "@/utils";
import { useState } from "react";
import { ClaimAddBusinessModal } from "@/components/onboarding/ClaimAddBusinessModal";
import {
  Shield,
  Globe,
  BookOpen,
  Users,
  ArrowRight,
  FileText,
  Search,
  Award,
  BadgeCheck,
  Sparkles,
} from "lucide-react";
import HeroRegistry from "../components/shared/HeroRegistry";

export default function About() {
  const [showModal, setShowModal] = useState(false);

  const principles = [
    {
      icon: Shield,
      title: "Registry Standards",
      desc: "Structured fields and consistent categories designed for credible analysis and long-term use.",
      tone: "text-[#00c4cc]",
    },
    {
      icon: BookOpen,
      title: "Cultural Integrity",
      desc: "Cultural identity and language are treated as core data — captured with care and context.",
      tone: "text-[#c9a84c]",
    },
    {
      icon: Globe,
      title: "Global Discoverability",
      desc: "Makes Pacific-owned enterprise easier to find worldwide — for customers, partners, and supporters.",
      tone: "text-[#00c4cc]",
    },
    {
      icon: Users,
      title: "Pacific-led Stewardship",
      desc: "Built in Aotearoa and guided by Pacific values, with community benefit at the centre.",
      tone: "text-[#c9a84c]",
    },
  ];

  const steps = [
    {
      icon: FileText,
      step: "01",
      title: "Application submitted",
      desc: "A structured application is submitted with ownership, identity, and business details (and any supporting evidence available).",
    },
    {
      icon: Search,
      step: "02",
      title: "Registry review",
      desc: "Listings are reviewed against registry standards for completeness, clarity, and consistency.",
    },
    {
      icon: Shield,
      step: "03",
      title: "Verification checks",
      desc: "For Verified listings, additional checks help confirm authenticity and legitimacy.",
    },
    {
      icon: Award,
      step: "04",
      title: "Record activated",
      desc: "Approved listings are published with their tier, verification status, and registry metadata.",
    },
  ];

  return (
    <div className="bg-[#f8f9fc]">
      {/* Hero */}
      <HeroRegistry
        badge="About"
        title="A Registry Built on Data Integrity & Cultural Pride"
        subtitle=""
        description="Pacific Market creates a structured, living record of Pacific-owned enterprise — built in Aotearoa, serving Pacific communities globally, and trusted for discovery, research, and partnerships."
      />

      {/* Definition band (white card, clear chapter break) */}
      <section className="py-12 bg-[#f8f9fc]">
        <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="bg-white border border-gray-200/70 rounded-2xl shadow-[0_18px_50px_rgba(10,22,40,0.08)] p-8">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#0a1628] flex items-center justify-center flex-shrink-0">
                <BadgeCheck className="w-5 h-5 text-[#00c4cc]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#0d4f4f]">
                  What Pacific Market is
                </p>
                <h2 className="text-2xl font-bold text-[#0a1628] mt-2">
                  The first global registry of Pacific-owned enterprise
                </h2>
                <p className="text-gray-600 mt-3 leading-relaxed">
                  Pacific Market is built like a registry — not just a directory — with a consistent structure that supports
                  trustworthy discovery today and meaningful insight over time.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {[
                    "Registry-standard structure",
                    "Pacific-led cultural integrity",
                    "Visibility + research insight over time",
                  ].map((chip) => (
                    <span
                      key={chip}
                      className="px-3 py-1 rounded-full border border-gray-200 bg-[#fbfcff] text-sm text-[#0a1628]/80"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subtle separator line */}
      <div className="w-full flex justify-center py-8">
        <div className="w-[28rem] h-px bg-gradient-to-r from-transparent via-[#c9a84c]/30 to-transparent"></div>
      </div>

      {/* Why a Registry Matters (light canvas) */}
      <section className="py-20 bg-[#f8f9fc]">
        <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-end">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#0d4f4f] mb-3 block">
                Our mission
              </span>
              <h2 className="text-3xl font-bold text-[#0a1628] mb-6">Why a Registry Matters</h2>

              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Pacific-owned businesses are often undercounted, misclassified, or invisible in mainstream datasets —
                  which impacts visibility, funding, and recognition.
                </p>
                <p>
                  Pacific Market changes that by capturing businesses in a consistent registry format, while preserving the
                  cultural context that standard business databases leave out.
                </p>
                <p>
                  The result is a discoverable, trustworthy dataset that grows over time — for community benefit today and
                  research value tomorrow.
                </p>
              </div>

              <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-[0_12px_40px_rgba(10,22,40,0.07)]">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-[#c9a84c]" />
                  <p className="text-sm font-semibold text-[#0a1628]">Built in Aotearoa, serving the Pacific globally</p>
                </div>
                <p className="text-sm text-gray-600">
                  We're doing groundwork to include businesses that may not be online yet — so the registry reflects real
                  Pacific enterprise, not just what can be easily scraped.
                </p>
              </div>
            </div>

            {/* Principles cards */}
            <div className="grid grid-cols-2 gap-4">
              {principles.map((item) => (
                <div
                  key={item.title}
                  className="bg-white border border-gray-200/70 rounded-2xl p-5 shadow-[0_12px_40px_rgba(10,22,40,0.07)] hover:shadow-[0_18px_50px_rgba(10,22,40,0.10)] transition-shadow"
                >
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-b from-[#0a1628] to-[#07101d] flex items-center justify-center mb-4">
                    <item.icon className={`w-5 h-5 ${item.tone}`} />
                  </div>
                  <h3 className="font-bold text-[#0a1628] text-sm mb-1">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Clear chapter break: White panel with borders */}
      <section className="py-20 bg-white border-y border-gray-200/70">
        <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#0d4f4f] mb-3 block">
              Trust & quality
            </span>
            <h2 className="text-3xl font-bold text-[#0a1628] mb-4">What makes the registry trustworthy</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-sm">
              Pacific Market is designed to be useful to everyday communities and credible for research. That means clear
              scope, consistent structure, and transparent verification signals.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Clear scope",
                desc: "Insights reflect approved & active listings. Counts change as records are updated or newly approved.",
              },
              {
                title: "Consistent structure",
                desc: "Standardised fields (industry, location, identity) enable meaningful comparison over time.",
              },
              {
                title: "Transparent verification",
                desc: "Verified listings complete additional checks so partners and researchers can interpret confidence levels.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-gray-200 bg-[#fbfcff] p-6 shadow-[0_12px_40px_rgba(10,22,40,0.06)]"
              >
                <h3 className="text-sm font-bold text-[#0a1628]">{card.title}</h3>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Verification process on tinted background (obvious new chapter) */}
      <section className="py-20 bg-[#eef0f5] border-y border-gray-200/70">
        <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#0d4f4f] mb-3 block">
              Process
            </span>
            <h2 className="text-3xl font-bold text-[#0a1628] mb-4">How verification works</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-sm">
              Every listing is reviewed before publishing. Verified listings go through additional checks to strengthen
              trust and authenticity.
            </p>

            <div className="mt-4 text-xs text-[#0a1628]/55">
              <span className="font-semibold text-[#0a1628]">Active</span> = approved & visible •{" "}
              <span className="font-semibold text-[#0a1628]">Verified</span> = additional checks completed
            </div>
          </div>

          <div className="relative">
            {/* connecting line (desktop only) */}
            <div className="hidden lg:block absolute left-0 right-0 top-10 h-px bg-gray-300/70" />

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step) => (
                <div
                  key={step.step}
                  className="bg-white border border-gray-200/70 rounded-2xl p-6 shadow-[0_12px_40px_rgba(10,22,40,0.06)] relative"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#0a1628] flex items-center justify-center">
                      <step.icon className="w-5 h-5 text-[#00c4cc]" />
                    </div>
                    <span className="text-3xl font-black text-gray-200">{step.step}</span>
                  </div>
                  <h3 className="font-bold text-[#0a1628] text-sm mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Optional: add a small help note */}
          <div className="mt-10 max-w-3xl mx-auto">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-[0_12px_40px_rgba(10,22,40,0.06)]">
              <p className="text-sm text-gray-600 leading-relaxed">
                <span className="font-semibold text-[#0a1628]">Note:</span> Verification is designed to be rigorous but fair.
                If a business does not have certain documents, we still aim to capture the record accurately and work with the
                owner to improve completeness over time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stewards (white panel) */}
      <section className="py-20 bg-white border-y border-gray-200/70">
        <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#0d4f4f] mb-3 block">
              Stewards of the registry
            </span>
            <h2 className="text-3xl font-bold text-[#0a1628] mb-4">Built and stewarded in Aotearoa</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-sm">
              Pacific Market is founded and stewarded in Aotearoa with a commitment to cultural integrity, data quality,
              and long-term community benefit.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-gray-200 bg-[#fbfcff] p-8 shadow-[0_12px_40px_rgba(10,22,40,0.06)]">
              <h3 className="text-lg font-bold text-[#0a1628]">Jasmin Benioni</h3>
              <p className="text-sm font-semibold text-[#0d4f4f] mt-1">Founder, Product & Technology</p>
              <p className="text-sm text-gray-600 mt-4 leading-relaxed">
                Leads the registry platform, data systems, and technical development — ensuring Pacific Market is reliable,
                scalable, and built to a registry standard.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-[#fbfcff] p-8 shadow-[0_12px_40px_rgba(10,22,40,0.06)]">
              <h3 className="text-lg font-bold text-[#0a1628]">Daniel Maine</h3>
              <p className="text-sm font-semibold text-[#0d4f4f] mt-1">Founder, Partnerships & Growth</p>
              <p className="text-sm text-gray-600 mt-4 leading-relaxed">
                Leads outreach, partnerships, and community engagement — helping businesses get listed and building the
                relationships that grow the registry.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Want to partner, sponsor a report, or request structured data access?
            </p>
            <Link
              href={createPageUrl("Contact")}
              className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-[#0d4f4f] hover:underline"
            >
              Contact the registry team <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA (light canvas, premium card) */}
      <section className="py-20 bg-[#f8f9fc]">
        <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
          <div className="rounded-2xl p-12 bg-gradient-to-b from-[#0a1628] to-[#07101d] relative overflow-hidden border border-[#0d4f4f] shadow-[0_18px_60px_rgba(10,22,40,0.25)]">
            <div className="absolute inset-0 opacity-15 pointer-events-none">
              <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-[#c9a84c] blur-3xl" />
            </div>

            <div className="relative">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to register your business?</h2>
              <p className="text-slate-300 mb-8 max-w-xl mx-auto">
                Join the registry and put your business on the Pacific Market map — reviewed with care and built to last.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setShowModal(true)}
                  className="inline-flex items-center justify-center gap-2 bg-[#c9a84c] hover:bg-[#b8973b] text-[#0a1628] font-bold px-8 py-4 rounded-xl transition-all text-sm"
                >
                  Submit a business <ArrowRight className="w-4 h-4" />
                </button>
                <Link
                  href={createPageUrl("Registry")}
                  className="inline-flex items-center justify-center gap-2 border border-[#00c4cc] text-[#00c4cc] hover:bg-[#00c4cc]/10 font-semibold px-8 py-4 rounded-xl transition-all text-sm"
                >
                  Explore the registry
                </Link>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-6">
            For research access, bulk exports, or methodology questions, contact the registry team.
          </p>
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
