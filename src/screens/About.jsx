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
  BadgeCheck,
  Sparkles,
  Hammer,
  Store,
  HeartHandshake,
} from "lucide-react";
import HeroRegistry from "../components/shared/HeroRegistry";

export default function About() {

  const principles = [
    {
      icon: Shield,
      title: "Network Excellence",
      desc: "A dynamic ecosystem designed for meaningful connections, not just listings — where discovery leads to real relationships.",
      tone: "text-[#00c4cc]",
    },
    {
      icon: BookOpen,
      title: "Cultural Connection",
      desc: "Identity and culture flow through every connection, ensuring businesses are represented authentically and discovered meaningfully.",
      tone: "text-[#c9a84c]",
    },
    {
      icon: Globe,
      title: "Global Reach",
      desc: "Pacific businesses connect with global opportunities while maintaining their cultural roots and community values.",
      tone: "text-[#00c4cc]",
    },
    {
      icon: Users,
      title: "Pacific-led Innovation",
      desc: "Built by Pacific people, for Pacific enterprise — combining traditional values with modern network technology.",
      tone: "text-[#c9a84c]",
    },
  ];

  const steps = [
    {
      icon: FileText,
      step: "01",
      title: "Application submitted",
      desc: "A business is submitted with key ownership, identity, and listing information.",
    },
    {
      icon: Search,
      step: "02",
      title: "Listing review",
      desc: "The listing is reviewed for clarity, consistency, and fit with registry standards.",
    },
    {
      icon: Shield,
      step: "03",
      title: "Verification checks",
      desc: "Verified listings go through additional checks to strengthen trust and legitimacy.",
    },
    {
      icon: Award,
      step: "04",
      title: "Record activated",
      desc: "Approved businesses are published with their listing tier, metadata, and visibility status.",
    },
  ];

  const legacyCards = [
    {
      icon: Hammer,
      title: "Builders & Fixers",
      desc: "Pacific families have always built, repaired, adapted, and solved problems with skill, resilience, and resourcefulness.",
      tone: "text-[#00c4cc]",
    },
    {
      icon: Store,
      title: "Traders & Providers",
      desc: "From market stalls and family shops to service businesses and hospitality, enterprise has always been part of how we cared for our communities.",
      tone: "text-[#c9a84c]",
    },
    {
      icon: Sparkles,
      title: "Makers & Creators",
      desc: "Craft, design, sewing, food, art, and cultural making are not side notes — they are part of Pacific economic life and ingenuity.",
      tone: "text-[#00c4cc]",
    },
    {
      icon: HeartHandshake,
      title: "People-Centred Entrepreneurs",
      desc: "Pacific business has often been rooted in service, generosity, family, and collective advancement — without losing commercial intelligence.",
      tone: "text-[#c9a84c]",
    },
  ];

  return (
    <div className="bg-[#f8f9fc]">
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden bg-[#07101d]">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-20 w-[28rem] h-[28rem] rounded-full bg-[#c9a84c]/18 blur-3xl" />
          <div className="absolute top-1/2 -left-24 w-[24rem] h-[24rem] rounded-full bg-[#00c4cc]/10 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_35%)]" />
        </div>

        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)
              `,
              backgroundSize: "48px 48px",
            }}
          />
        </div>

        <div className="relative px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto py-14 sm:py-20 lg:py-24">
            <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-8 sm:gap-10 items-center">
              {/* Left content */}
              <div className="max-w-3xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-2 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-[#00c9cc]"></span>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-[#00c9cc]">
                    About Pacific Market
                  </span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-[1.05] text-white max-w-4xl">
                  Our Ancestors Built,
                  <span className="block text-[#c9a84c] mt-1">Traded, Made, and Led.</span>
                  <span className="block mt-1">Pacific Market Continues That Legacy.</span>
                </h1>

                <div className="w-28 h-1 rounded-full bg-gradient-to-r from-[#c9a84c] via-[#00c4cc] to-transparent mt-6 mb-6" />

                <p className="text-sm sm:text-lg text-slate-300 leading-6 sm:leading-relaxed max-w-2xl">
                  Pacific Market is a modern registry for Pacific-owned enterprise — designed to strengthen visibility, credibility, and recognition across communities, countries, and industries.
              </p>

                <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 sm:px-5 sm:py-4 max-w-2xl">
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    <span className="text-[#c9a84c] font-semibold">A core belief:</span>{" "}
                    Pacific enterprise did not begin here.
                    <br className="hidden sm:block" />
                    This platform simply makes it easier to see.
                  </p>
                </div>

                <div className="mt-6 sm:mt-8 flex flex-wrap gap-3">
                  {[
                    "Pacific-led",
                    "Legacy-led",
                    "Built in Aotearoa",
                  ].map((chip) => (
                    <span
                      key={chip}
                      className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/10 bg-white/5 text-xs sm:text-sm text-slate-200"
                    >
                      {chip}
                    </span>
                  ))}
                </div>

                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-4">
                  <Link
                    href={createPageUrl("BusinessLogin")}
                    className="inline-flex items-center justify-center gap-2 bg-[#c9a84c] hover:bg-[#b8973b] text-[#0a1628] font-bold px-6 py-3 sm:px-8 sm:py-4 rounded-xl transition-all text-sm shadow-[0_12px_30px_rgba(201,168,76,0.25)] w-full sm:w-auto min-h-[44px]"
                  >
                    Submit a business <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href={createPageUrl("Registry")}
                    className="inline-flex items-center justify-center gap-2 border border-[#00c4cc]/40 text-[#b3e5e5] hover:bg-[#00c4cc]/8 font-medium px-6 py-3 sm:px-8 sm:py-4 rounded-xl transition-all text-sm w-full sm:w-auto min-h-[44px]"
                  >
                    Explore the registry
                  </Link>
                </div>
              </div>

              {/* Right visual panel */}
              <div className="relative">
                <div className="relative rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.35)]">
                  <div className="aspect-[4/5] relative">
                    <Image
                      src="/about_hero.png"
                      alt="Pacific Market hero visual"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#07101d] via-[#07101d]/40 to-transparent" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Opening definition card */}
      <section className="relative z-10 -mt-8 sm:-mt-10 py-10 sm:py-12 bg-[#f8f9fc]">
        <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="bg-white border border-gray-200/70 rounded-2xl shadow-[0_18px_50px_rgba(10,22,40,0.08)] p-5 sm:p-8">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#0a1628] flex items-center justify-center flex-shrink-0">
                <BadgeCheck className="w-5 h-5 text-[#00c4cc]" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#0d4f4f]">
                  What Pacific Market is
                </p>
                <h2 className="text-xl sm:text-2xl font-bold text-[#0a1628] mt-2">
                  A structured registry for Pacific-owned businesses
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">
                  Pacific Market is not just a directory. It is a structured registry designed to represent Pacific-owned businesses with greater depth, clarity, and credibility.
                </p>
              </div>
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
                Because Pacific business deserves to be seen properly
              </h2>

              <div className="space-y-4 text-sm sm:text-base text-gray-600 leading-relaxed">
                <p>
                  Pacific-owned businesses are often undercounted, misrepresented, or absent from the places people search, study, and source from. That affects visibility, access, recognition, and long-term opportunity.
                </p>
                <p>
                  Pacific Market was created to help change that — by building a registry that is not only searchable, but intentional in how Pacific enterprise is represented.
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
                  Pacific Market is being built to reflect real Pacific enterprise — including businesses that may not have had polished digital visibility yet, but still carry deep value, skill, and legacy.
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
              Enterprise is not new to us
            </h2>
            <p className="text-gray-500 max-w-3xl mx-auto text-sm sm:text-base leading-relaxed">
              Long before modern platforms, Pacific families were already building livelihoods through trade, making, hosting, selling, repairing, feeding, farming, creating, and serving. Pacific Market is a modern continuation of that same spirit — just with better visibility, better structure, and a wider stage.
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
                <h3 className="text-sm font-bold text-[#0a1628] mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 sm:mt-12 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="space-y-4 text-sm sm:text-base text-gray-600 leading-relaxed">
                <p>
                  For many Pacific families, business was never something learned in a classroom.
                  It was something we saw, helped with, and grew up inside.
                </p>
                <p>
                  In our families it looked like this —
                  scraping coconut for the sauce that would be sold at the market stall,
                  preparing food together, setting up stalls, sharing the work.
                </p>
                <p>
                  Enterprise lived in the small everyday moments:
                  in the hands that prepared the food,
                  the minds that organised the stall,
                  and the families that worked together to make something from what they had.
                </p>
                <p>
                  That is the spirit behind Pacific Market.
                </p>
                <p>
                  This is not a borrowed idea of entrepreneurship.
                  It is a recognition that Pacific people have long carried business knowledge, capability, and ingenuity — even when it was not named that way.
                </p>
                <p className="text-[#0a1628] font-semibold">
                  Pacific Market simply exists to make that reality easier to see.
                </p>
              </div>
            </div>
            
            <div className="order-1 lg:order-2 flex justify-center">
              <div className="relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] lg:w-[400px] lg:h-[400px] rounded-[28px] overflow-hidden border border-gray-200 bg-white shadow-[0_20px_60px_rgba(10,22,40,0.08)]">
                <Image
                  src="/craft.png"
                  alt="Pacific founders craft"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial quote band */}
      <section className="py-10 bg-[#07101d] relative overflow-hidden border-y border-white/5">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-16 left-1/4 w-72 h-72 rounded-full bg-[#c9a84c]/12 blur-3xl" />
          <div className="absolute -bottom-20 right-1/4 w-80 h-80 rounded-full bg-[#00c4cc]/10 blur-3xl" />
        </div>

        <div className="relative px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-sm px-6 py-10 sm:px-10 sm:py-12 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-[11px] uppercase tracking-[0.24em] font-semibold text-[#c9a84c] mb-4">
                A Pacific Market belief
              </p>

              <blockquote className="text-xl sm:text-3xl lg:text-4xl font-bold leading-tight text-white">
                "Pacific people have never lacked enterprise.
                <span className="block mt-2 text-[#d8e1ea]">
                  What has often been lacking is visibility."
                </span>
              </blockquote>

              <div className="w-24 h-1 rounded-full bg-gradient-to-r from-transparent via-[#00c4cc] to-transparent mx-auto my-6" />

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
                Pacific Market helps close that gap with structure, pride, and a more respectful standard of representation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="py-12 sm:py-20 bg-[#f8f9fc]">
        <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#0d4f4f] mb-3 block">
              What guides the registry
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0a1628] mb-4">
              Built with pride, care, and structure
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base">
              Pacific Market is designed to feel culturally grounded and professionally credible at the same time.
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
                <h3 className="font-bold text-[#0a1628] text-sm mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
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
              Pacific Market is being shaped by founders who care deeply about visibility, trust, and long-term opportunity for Pacific-owned businesses — combining digital infrastructure, relationship-building, and a real respect for where Pacific enterprise comes from.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Jasmin */}
            <div className="group flex flex-col items-center space-y-6">
              <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] lg:w-[350px] lg:h-[350px] rounded-[28px] overflow-hidden border border-gray-200 bg-[#fbfcff] shadow-[0_16px_50px_rgba(10,22,40,0.08)] hover:shadow-[0_24px_70px_rgba(10,22,40,0.12)] transition-all">
                <Image
                  src="/jasmin.png"
                  alt="Jasmin Benioni"
                  fill
                  className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07101d]/60 via-[#07101d]/20 to-transparent" />

                <div className="absolute left-6 bottom-6 right-6">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 backdrop-blur-sm px-4 py-2">
                    <span className="w-2 h-2 rounded-full bg-[#c9a84c]" />
                    <span className="text-[11px] uppercase tracking-[0.18em] font-semibold text-white/90">
                      Founder Profile
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-center max-w-md space-y-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#0a1628]">Jasmin Benioni</h3>
                  <p className="text-xs sm:text-sm font-semibold text-[#0d4f4f] mt-1">
                    Founder, Technology, Systems & Platform Development
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full bg-[#0a1628] text-white text-[11px] font-semibold px-3 py-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#c9a84c]" />
                  Saasy Cookies
                </div>

                <div className="space-y-3 text-sm sm:text-base text-gray-600 leading-relaxed">
                  <p>
                    Jasmin is a software developer and founder of Saasy Cookies, an AI and digital infrastructure company focused on building practical systems that help businesses grow with stronger foundations.
                  </p>
                  <p>
                    Her work brings together technical problem-solving, structured thinking, and a belief that Pacific-owned businesses deserve digital spaces that feel credible, polished, and worthy of the value they already carry.
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-2">
                  {[
                    "Systems thinker",
                    "Builder", 
                    "Problem-solver",
                    "Pacific-led technology",
                  ].map((chip) => (
                    <span
                      key={chip}
                      className="px-3 py-1.5 rounded-full border border-gray-200 bg-white text-[11px] sm:text-xs text-[#0a1628]/80"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Daniel */}
            <div className="group flex flex-col items-center space-y-6">
              <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] lg:w-[350px] lg:h-[350px] rounded-[28px] overflow-hidden border border-gray-200 bg-[#fbfcff] shadow-[0_16px_50px_rgba(10,22,40,0.08)] hover:shadow-[0_24px_70px_rgba(10,22,40,0.12)] transition-all">
                <Image
                  src="/daniel.png"
                  alt="Daniel Maine"
                  fill
                  className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07101d]/60 via-[#07101d]/20 to-transparent" />

                <div className="absolute left-6 bottom-6 right-6">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 backdrop-blur-sm px-4 py-2">
                    <span className="w-2 h-2 rounded-full bg-[#00c4cc]" />
                    <span className="text-[11px] uppercase tracking-[0.18em] font-semibold text-white/90">
                      Founder Profile
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-center max-w-md space-y-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#0a1628]">Daniel Maine</h3>
                  <p className="text-xs sm:text-sm font-semibold text-[#0d4f4f] mt-1">
                    Founder, Partnerships, Visibility & Business Growth
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full bg-[#0a1628] text-white text-[11px] font-semibold px-3 py-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#00c4cc]" />
                  Oceanique Solutionz
                </div>

                <div className="space-y-3 text-sm sm:text-base text-gray-600 leading-relaxed">
                  <p>
                    Daniel is a business owner and founder of Oceanique Solutionz, a Destination Management Company built around connection, coordination, and creating meaningful business experiences.
                  </p>
                  <p>
                    Through his work, he brings a strong understanding of visibility, partnerships, and what it takes to grow trust with people, communities, and organisations in a way that feels practical and genuine.
                  </p>
                  <p>
                    His role helps ensure the platform is not only well built, but well connected — grounded in real relationships, community insight, and a commitment to wider recognition for Pacific businesses.
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-2">
                  {[
                    "Relationship-led",
                    "Business growth",
                    "Partnership builder",
                    "Community visibility",
                  ].map((chip) => (
                    <span
                      key={chip}
                      className="px-3 py-1.5 rounded-full border border-gray-200 bg-white text-[11px] sm:text-xs text-[#0a1628]/80"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Shared founder note */}
          <div className="mt-8 sm:mt-10 rounded-[28px] border border-[#c9a84c]/20 bg-gradient-to-r from-[#fffaf0] via-white to-[#f6fffe] p-5 sm:p-8 shadow-[0_12px_40px_rgba(10,22,40,0.05)]">
            <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#0d4f4f] mb-3">
                  Why this matters to us
                </p>
                <h3 className="text-xl sm:text-2xl font-bold text-[#0a1628] leading-snug">
                  We want Pacific Market to feel worthy of the people it represents.
                </h3>
              </div>

              <div className="space-y-4 text-sm sm:text-base text-gray-700 leading-relaxed">
                <p>
                  Pacific Market is not being built from distance.
                  It comes from lived understanding — from seeing the skill, care, and business intelligence that already exists across Pacific communities, often without the digital visibility it deserves.
                </p>
                <p>
                  We know many Pacific businesses carry deep value long before they have polished branding or strong online visibility. This platform exists to help close that gap with dignity, structure, and pride.
                </p>
                <p className="font-semibold text-[#0a1628]">
                  This is about building something modern that still honours where we come from.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 sm:mt-10 text-center">
            <p className="text-sm text-gray-500">
              Want to partner, contribute, or support the visibility of Pacific-owned businesses?
            </p>
            <Link
              href={createPageUrl("Contact")}
              className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-[#0d4f4f] hover:underline"
            >
              Contact the Pacific Market team <ArrowRight className="w-4 h-4" />
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
              How businesses enter the registry
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base">
              Pacific Market combines a warm, community-aware approach with a structured review process designed to keep the registry useful and trustworthy.
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
                    <span className="text-2xl sm:text-3xl font-black text-gray-200">{step.step}</span>
                  </div>
                  <h3 className="font-bold text-[#0a1628] text-sm mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 sm:mt-10 max-w-3xl mx-auto">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-[0_12px_40px_rgba(10,22,40,0.06)]">
              <p className="text-sm text-gray-600 leading-relaxed">
                <span className="font-semibold text-[#0a1628]">Note:</span> We aim to keep the process rigorous but fair. Not every business will begin with the same level of documentation or polish, and we want the registry to support visibility while improving completeness over time.
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
                Add your business to the Pacific record
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-6 mb-6 sm:mb-8 max-w-2xl mx-auto">
                Pacific business has always been here. Pacific Market helps give it the visibility, structure, and recognition it deserves. Join the registry with pride.
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
                  Explore the registry
                </Link>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-4 sm:mt-6">
            For partnerships, sponsorships, structured data access, or research enquiries, contact the Pacific Market team.
          </p>
        </div>
      </section>

      </div>
  );
}