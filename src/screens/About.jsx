import Link from "next/link";
import Image from "next/image";
import { createPageUrl } from "@/utils";
import {
  Shield,
  Globe,
  BookOpen,
  Users,
  ArrowRight,
  FileText,
  Search,
  Award,
  Sparkles,
  Hammer,
  Store,
  HeartHandshake,
} from "lucide-react";
import HeroStandard from "@/components/shared/HeroStandard";

export default function About() {
  const principles = [
    {
      icon: Shield,
      title: "Trusted Discovery",
      desc: "A platform designed for meaningful discovery and stronger business visibility — not just listings.",
      tone: "text-[#00c4cc]",
    },
    {
      icon: BookOpen,
      title: "Cultural Connection",
      desc: "Identity and culture matter. We want Pacific businesses to be discovered in ways that feel respectful and true.",
      tone: "text-[#c9a84c]",
    },
    {
      icon: Globe,
      title: "Global Reach",
      desc: "Pacific-owned businesses deserve stronger visibility across communities, countries, and opportunities.",
      tone: "text-[#00c4cc]",
    },
    {
      icon: Users,
      title: "Pacific-led Vision",
      desc: "Built by Pacific founders, with a long-term focus on visibility, trust, and economic recognition.",
      tone: "text-[#c9a84c]",
    },
  ];

  const steps = [
    {
      icon: FileText,
      step: "01",
      title: "Business submitted",
      desc: "A business profile is submitted with key ownership, identity, and business details.",
    },
    {
      icon: Search,
      step: "02",
      title: "Profile reviewed",
      desc: "The profile is reviewed for clarity, completeness, and fit with platform standards.",
    },
    {
      icon: Shield,
      step: "03",
      title: "Verification considered",
      desc: "Some businesses may go through additional checks to strengthen trust and credibility.",
    },
    {
      icon: Award,
      step: "04",
      title: "Published for discovery",
      desc: "Approved businesses become visible on the platform and easier to discover across the network.",
    },
  ];

  const legacyCards = [
    {
      icon: Hammer,
      title: "Builders & Fixers",
      desc: "Pacific families have long built, repaired, adapted, and solved problems with skill and resilience.",
      tone: "text-[#00c4cc]",
    },
    {
      icon: Store,
      title: "Traders & Providers",
      desc: "From market stalls to service businesses, enterprise has always been part of how we supported our communities.",
      tone: "text-[#c9a84c]",
    },
    {
      icon: Sparkles,
      title: "Makers & Creators",
      desc: "Food, craft, design, sewing, art, and cultural making are part of Pacific innovation and economic life.",
      tone: "text-[#00c4cc]",
    },
    {
      icon: HeartHandshake,
      title: "People-Centred Entrepreneurs",
      desc: "Pacific business has often been rooted in service, family, generosity, and collective progress.",
      tone: "text-[#c9a84c]",
    },
  ];

  return (
    <div className="bg-[#f8f9fc]">
      <HeroStandard
        badge="About Pacific Discovery Network"
        title="Built to make Pacific business easier to discover."
        subtitle=""
        description="Pacific Discovery Network is a premium platform designed to strengthen the visibility, credibility, and discoverability of Pacific-owned businesses across Aotearoa, the Pacific, and beyond."
        actions={
          <>
            <Link
              href={createPageUrl("BusinessLogin")}
              className="inline-flex items-center justify-center gap-2 bg-[#c9a84c] hover:bg-[#b8973b] text-[#0a1628] font-bold px-6 py-3 rounded-xl transition-all text-sm min-h-[44px]"
            >
              Submit a business <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href={createPageUrl("Registry")}
              className="inline-flex items-center justify-center gap-2 border border-white/20 bg-white/10 hover:bg-white/15 text-white font-semibold px-6 py-3 rounded-xl transition-all text-sm min-h-[44px]"
            >
              Explore businesses
            </Link>
          </>
        }
      />

      {/* Opening definition card */}
      <section className="py-10 sm:py-12 bg-[#f8f9fc]">
        <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="bg-white border border-gray-200/70 rounded-2xl shadow-[0_18px_50px_rgba(10,22,40,0.08)] p-5 sm:p-8">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#0d4f4f]">
                What Pacific Discovery Network is
              </p>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0a1628] mt-2">
                A discovery platform for Pacific-owned businesses
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">
                Pacific Discovery Network is designed to help Pacific-owned
                businesses become easier to find, understand, and trust — with
                stronger visibility, clearer representation, and a more premium
                digital presence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full flex justify-center py-6 sm:py-8">
        <div className="w-40 sm:w-[28rem] h-px bg-gradient-to-r from-transparent via-[#c9a84c]/30 to-transparent"></div>
      </div>

      {/* Why it exists */}
      <section className="py-12 sm:py-20 bg-[#f8f9fc]">
        <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#0d4f4f] mb-3 block">
                Why we built this
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0a1628] mb-4 sm:mb-6">
                Because Pacific business deserves stronger visibility
              </h2>

              <div className="space-y-4 text-sm sm:text-base text-gray-600 leading-relaxed">
                <p>
                  Pacific-owned businesses are often underrepresented in the
                  places people search, source, study, and discover from. That
                  affects visibility, recognition, and long-term opportunity.
                </p>
                <p>
                  Pacific Discovery Network was created to help change that —
                  with a platform built to make Pacific business easier to
                  discover in a way that feels credible, intentional, and
                  respectful.
                </p>
              </div>

              <div className="mt-6 sm:mt-8 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-[0_12px_40px_rgba(10,22,40,0.07)]">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-[#c9a84c]" />
                  <p className="text-xs sm:text-sm font-semibold text-[#0a1628]">
                    Built in Aotearoa, with a global Pacific vision
                  </p>
                </div>
                <p className="text-sm sm:text-base text-gray-600">
                  We are building for real Pacific enterprise — including
                  businesses that may still be growing their digital visibility,
                  but already carry real value, capability, and legacy.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[28px] overflow-hidden border border-gray-200 bg-white shadow-[0_20px_60px_rgba(10,22,40,0.10)]">
                <div className="relative h-[300px] sm:h-[420px] w-full">
                  <Image
                    src="/why_we_built_this.png"
                    alt="Pacific legacy and enterprise"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Legacy section */}
      <section className="py-12 sm:py-20 bg-white border-y border-gray-200/70">
        <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#0d4f4f] mb-3 block">
              Pacific legacy
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0a1628] mb-4">
              Enterprise has always been part of who we are
            </h2>
            <p className="text-gray-500 max-w-3xl mx-auto text-sm sm:text-base leading-relaxed">
              Long before modern platforms, Pacific families were already
              building livelihoods through trade, food, service, making,
              creating, repairing, selling, and working together. Pacific
              Discovery Network is a modern way of giving that enterprise
              stronger visibility.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {legacyCards.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-gray-200 bg-[#fbfcff] p-5 sm:p-6 shadow-[0_12px_40px_rgba(10,22,40,0.06)] hover:shadow-[0_18px_50px_rgba(10,22,40,0.10)] transition-shadow"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-b from-[#0a1628] to-[#07101d] flex items-center justify-center mb-4">
                  <item.icon className={`w-5 h-5 ${item.tone}`} />
                </div>
                <h3 className="text-sm font-bold text-[#0a1628] mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 sm:mt-12 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="space-y-4 text-sm sm:text-base text-gray-600 leading-relaxed">
                <p>
                  For many Pacific families, business was never something distant
                  or abstract. It was something we saw, helped with, and grew up
                  around.
                </p>
                <p>
                  It looked like preparing food together, setting up market
                  stalls, serving customers, solving problems, and making
                  something valuable from what we had.
                </p>
                <p>
                  That same spirit of enterprise, capability, and contribution is
                  still here today.
                </p>
                <p className="text-[#0a1628] font-semibold">
                  Pacific Discovery Network exists to help make that easier to
                  see.
                </p>
              </div>
            </div>

            <div className="order-1 lg:order-2 flex justify-center">
              <div className="relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] lg:w-[400px] lg:h-[400px] rounded-[28px] overflow-hidden border border-gray-200 bg-white shadow-[0_20px_60px_rgba(10,22,40,0.08)]">
                <Image
                  src="/craft.png"
                  alt="Pacific founders craft"
                  fill
                  sizes="(max-width: 640px) 300px, (max-width: 1024px) 350px, 400px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="py-12 sm:py-20 bg-[#f8f9fc]">
        <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#0d4f4f] mb-3 block">
              What guides the platform
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0a1628] mb-4">
              Built with care, trust, and visibility in mind
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base">
              Pacific Discovery Network is designed to feel culturally grounded,
              professionally credible, and genuinely useful for both businesses
              and the people discovering them.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {principles.map((item) => (
              <div
                key={item.title}
                className="bg-white border border-gray-200/70 rounded-2xl p-5 sm:p-6 shadow-[0_12px_40px_rgba(10,22,40,0.07)] hover:shadow-[0_18px_50px_rgba(10,22,40,0.10)] transition-shadow"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-b from-[#0a1628] to-[#07101d] flex items-center justify-center mb-4">
                  <item.icon className={`w-5 h-5 ${item.tone}`} />
                </div>
                <h3 className="font-bold text-[#0a1628] text-sm mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founders */}
      <section className="py-14 sm:py-24 bg-white border-y border-gray-200/70 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#c9a84c]/6 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[#00c4cc]/5 blur-3xl" />
        </div>

        <div className="relative px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#0d4f4f] mb-3 block">
              Meet the founders
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0a1628] mb-4">
              Built by founders who understand both people and systems
            </h2>
            <p className="text-gray-500 max-w-3xl mx-auto text-sm sm:text-base leading-relaxed">
              Pacific Discovery Network is being shaped by founders who care
              deeply about visibility, trust, and long-term opportunity for
              Pacific-owned businesses.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            <div className="group flex flex-col items-center space-y-6">
              <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] lg:w-[350px] lg:h-[350px] rounded-[28px] overflow-hidden border border-gray-200 bg-[#fbfcff] shadow-[0_16px_50px_rgba(10,22,40,0.08)] hover:shadow-[0_24px_70px_rgba(10,22,40,0.12)] transition-all">
                <Image
                  src="/jasmin.png"
                  alt="Jasmin Benioni"
                  fill
                  sizes="(max-width: 640px) 280px, (max-width: 1024px) 320px, 350px"
                  className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                />
              </div>

              <div className="text-center max-w-md space-y-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#0a1628]">
                    Jasmin Benioni
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-[#0d4f4f] mt-1">
                    Founder, Technology, Systems & Platform Development
                  </p>
                </div>

                <a href="https://www.saasycookies.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#0a1628] text-white text-[11px] font-semibold px-3 py-1 hover:bg-[#1a2e40] transition-colors">
                  <Sparkles className="w-3.5 h-3.5 text-[#c9a84c]" />
                  SaaSy Cookies
                </a>

                <div className="space-y-3 text-sm sm:text-base text-gray-600 leading-relaxed">
                  <p>
                    Jasmin is a software developer and founder of Saasy Cookies,
                    focused on building practical systems that help businesses
                    grow with stronger digital foundations.
                  </p>
                  <p>
                    Her work combines technical thinking, structured problem
                    solving, and a strong belief that Pacific-owned businesses
                    deserve polished, credible, and useful digital spaces.
                  </p>
                </div>
              </div>
            </div>

            <div className="group flex flex-col items-center space-y-6">
              <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] lg:w-[350px] lg:h-[350px] rounded-[28px] overflow-hidden border border-gray-200 bg-[#fbfcff] shadow-[0_16px_50px_rgba(10,22,40,0.08)] hover:shadow-[0_24px_70px_rgba(10,22,40,0.12)] transition-all">
                <Image
                  src="/daniel.png"
                  alt="Daniel Maine"
                  fill
                  sizes="(max-width: 640px) 280px, (max-width: 1024px) 320px, 350px"
                  className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                />
              </div>

              <div className="text-center max-w-md space-y-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#0a1628]">
                    Daniel Maine
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-[#0d4f4f] mt-1">
                    Founder, Partnerships, Visibility & Business Growth
                  </p>
                </div>

                <a href="https://www.oceaniquesolutionz.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#0a1628] text-white text-[11px] font-semibold px-3 py-1 hover:bg-[#1a2e40] transition-colors">
                  <Globe className="w-3.5 h-3.5 text-[#00c4cc]" />
                  Oceanique SolutioNZ
                </a>

                <div className="space-y-3 text-sm sm:text-base text-gray-600 leading-relaxed">
                  <p>
                    Daniel is a business owner and founder of Oceanique
                    Solutionz, bringing strong experience in relationships,
                    partnerships, visibility, and practical business growth.
                  </p>
                  <p>
                    His role helps ensure the platform is not only well built,
                    but well connected — grounded in community insight and real
                    relationships.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 sm:mt-10 rounded-[28px] border border-[#c9a84c]/20 bg-gradient-to-r from-[#fffaf0] via-white to-[#f6fffe] p-5 sm:p-8 shadow-[0_12px_40px_rgba(10,22,40,0.05)]">
            <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#0d4f4f] mb-3">
                  Why this matters to us
                </p>
                <h3 className="text-xl sm:text-2xl font-bold text-[#0a1628] leading-snug">
                  We want Pacific Discovery Network to feel worthy of the people
                  it represents.
                </h3>
              </div>

              <div className="space-y-4 text-sm sm:text-base text-gray-700 leading-relaxed">
                <p>
                  This platform comes from lived understanding — from seeing the
                  skill, care, and business intelligence that already exists
                  across Pacific communities, even when it is not always visible
                  online.
                </p>
                <p>
                  We know many Pacific businesses carry real value long before
                  they have polished branding or strong digital visibility. This
                  platform exists to help close that gap with dignity, structure,
                  and pride.
                </p>
                <p className="font-semibold text-[#0a1628]">
                  This is about building something modern that still honours
                  where we come from.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 sm:mt-10 text-center">
            <p className="text-sm text-gray-500">
              Want to partner, contribute, or support the visibility of
              Pacific-owned businesses?
            </p>
            <Link
              href={createPageUrl("Contact")}
              className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-[#0d4f4f] hover:underline"
            >
              Contact the Pacific Discovery Network team{" "}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust section */}
      <section className="py-12 sm:py-20 bg-[#eef0f5] border-y border-gray-200/70">
        <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#0d4f4f] mb-3 block">
              Trust & process
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0a1628] mb-4">
              How businesses join the platform
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base">
              Pacific Discovery Network combines a warm, community-aware approach
              with a structured review process designed to keep the platform
              useful and trustworthy.
            </p>
          </div>

          <div className="relative">
            <div className="hidden lg:block absolute left-0 right-0 top-10 h-px bg-gray-300/70" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {steps.map((step) => (
                <div
                  key={step.step}
                  className="bg-white border border-gray-200/70 rounded-2xl p-5 sm:p-6 shadow-[0_12px_40px_rgba(10,22,40,0.06)] relative"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#0a1628] flex items-center justify-center">
                      <step.icon className="w-5 h-5 text-[#00c4cc]" />
                    </div>
                    <span className="text-2xl sm:text-3xl font-black text-gray-200">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="font-bold text-[#0a1628] text-sm mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 sm:mt-10 max-w-3xl mx-auto">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-[0_12px_40px_rgba(10,22,40,0.06)]">
              <p className="text-sm text-gray-600 leading-relaxed">
                <span className="font-semibold text-[#0a1628]">Note:</span> We
                aim to keep the process structured but fair. Not every business
                will begin with the same level of documentation or polish, and
                the platform is designed to support visibility while improving
                completeness over time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-20 bg-[#f8f9fc]">
        <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
          <div className="rounded-2xl p-7 sm:p-12 bg-gradient-to-b from-[#0a1628] to-[#07101d] relative overflow-hidden border border-[#0d4f4f] shadow-[0_18px_60px_rgba(10,22,40,0.25)]">
            <div className="absolute inset-0 opacity-15 pointer-events-none">
              <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-[#c9a84c] blur-3xl" />
            </div>

            <div className="relative">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Add your business to Pacific Discovery Network
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-6 mb-6 sm:mb-8 max-w-2xl mx-auto">
                Join a platform built to make Pacific-owned businesses easier to
                discover, trust, and support.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href={createPageUrl("BusinessLogin")}
                  className="inline-flex items-center justify-center gap-2 bg-[#c9a84c] hover:bg-[#b8973b] text-[#0a1628] font-bold px-6 py-3 sm:px-8 sm:py-4 rounded-xl transition-all text-sm w-full sm:w-auto min-h-[44px]"
                >
                  Submit a business <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href={createPageUrl("Registry")}
                  className="inline-flex items-center justify-center gap-2 border border-[#00c4cc] text-[#00c4cc] hover:bg-[#00c4cc]/10 font-semibold px-6 py-3 sm:px-8 sm:py-4 rounded-xl transition-all text-sm w-full sm:w-auto min-h-[44px]"
                >
                  Explore businesses
                </Link>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-4 sm:mt-6">
            For partnerships, sponsorships, or research enquiries, contact the
            Pacific Discovery Network team.
          </p>
        </div>
      </section>
    </div>
  );
}