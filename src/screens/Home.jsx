import { useState, useEffect } from "react";
import Link from "next/link";
import { createPageUrl } from "@/utils";
import { pacificMarket } from "@/lib/pacificMarketClient";
import { ArrowRight, CheckCircle, Globe, Shield, Star, BookOpen, Search, Award, ChevronRight } from "lucide-react";
import { BUSINESS_STATUS, BUSINESS_TIER } from "@/constants/business";
import StatsBar from "../components/home/StatsBar";
import BusinessCard from "../components/registry/BusinessCard";
import FeaturedSpotlight from "../components/home/FeaturedSpotlight";

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    pacificMarket.entities.Business.filter(
      { status: BUSINESS_STATUS.ACTIVE, subscription_tier: BUSINESS_TIER.FEATURED_PLUS },
      "-created_date",
      6
    )
      .then(setFeatured)
      .catch(() => {});
  }, []);

  const values = [
    {
      icon: Shield,
      title: "Professional Registry",
      description: "A structured, verified registry designed to meet the standard of official business records — not a casual directory.",
      color: "text-[#00c4cc]"
    },
    {
      icon: Globe,
      title: "Global Discoverability",
      description: "Pacific-owned enterprises visible to partners, investors, and communities across the world.",
      color: "text-[#c9a84c]"
    },
    {
      icon: CheckCircle,
      title: "Verified Identity",
      description: "Verification processes ensure authenticity of ownership, cultural identity, and business legitimacy.",
      color: "text-[#00c4cc]"
    },
    {
      icon: BookOpen,
      title: "Cultural Integrity",
      description: "Data governance that respects and preserves Pacific cultural context, languages, and identity.",
      color: "text-[#c9a84c]"
    },
  ];

  return (
    <div className="bg-[#f8f9fc]">
      {/* Hero – Pacific expressive, registry-first */}
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
          <div className="grid lg:grid-cols-12 gap-10 items-start lg:items-center">
            {/* Left: Title panel */}
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-2 bg-white/90 border border-white/40 rounded-full px-3 py-1.5 shadow-sm backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-[#00c4cc]" />
                <span className="text-xs font-semibold tracking-wider uppercase text-[#0d4f4f]">
                  Connecting Pacific Enterprises Worldwide
                </span>
              </div>

              <div className="mt-5 bg-[#0a1628]/62 backdrop-blur-md border border-white/10 rounded-2xl p-7 shadow-xl">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-[1.02]">
                  The Global Registry for{" "}
                  <span className="text-[#00c4cc]">Pacific-Owned</span>{" "}
                  <span className="text-[#c9a84c]">Enterprises</span>
                </h1>

                <div className="mt-4 h-[3px] w-44 rounded-full bg-gradient-to-r from-[#00c4cc] via-[#c9a84c] to-transparent" />

                <p className="mt-4 text-base sm:text-lg text-white/90">
                Find Pacific-owned enterprises worldwide in a structured registry built for verification, discoverability, and trusted business data.
              </p>
              </div>
            </div>

            {/* Right: Search Card */}
            <div className="lg:col-span-7">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-7 relative overflow-hidden">
                {/* watermark motif behind card (super subtle) */}
                <div className="absolute -right-10 -top-10 w-72 h-72 rounded-full bg-[#00c4cc]/10 blur-2xl" />
                <div className="absolute -left-10 -bottom-10 w-72 h-72 rounded-full bg-[#c9a84c]/10 blur-2xl" />

                <div className="relative">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Registry Search
                    </h2>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <CheckCircle className="w-4 h-4 text-[#00c4cc]" />
                    <span>Built with Cultural Respect</span>
                  </div>
                </div>

                {/* Single search field */}
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search by business name, keyword, country, or industry…"
                      className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3.5
                                 focus:outline-none focus:ring-2 focus:ring-[#00c4cc]
                                 text-[#0a1628] placeholder:text-slate-400"
                      suppressHydrationWarning
                    />
                  </div>

                  {/* Icon-only button */}
                  <Link
                    href={createPageUrl("Registry")}
                    className="shrink-0 inline-flex items-center justify-center
                               w-12 h-12 rounded-xl
                               bg-[#00c4cc] hover:bg-[#00aab0]
                               text-[#0a1628] transition-all"
                    aria-label="Search registry"
                    title="Search registry"
                  >
                    <Search className="w-5 h-5" />
                  </Link>
                </div>

                <div className="mt-4 text-center">
                  <Link
                    href={createPageUrl("ApplyListing")}
                    className="text-sm font-semibold text-[#0d4f4f] hover:text-[#0a1628] transition-all"
                  >
                    Not listed? Submit a Business →
                  </Link>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>

        {/* Spacer so content below doesn't overlap */}
        <div className="h-[120px]" />

        {/* Trust Row */}
        <div className="border-t border-gray-200 bg-[#f8f9fc]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap gap-6 text-xs text-slate-500">
            {[
              "Human-Reviewed Records",
              "Verification Standards",
              "Structured Data Governance",
              "Open Access Registry",
            ].map((t) => (
              <div key={t} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#00c4cc]" />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <StatsBar />

      {/* Value Blocks */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-[#0a1628] mb-4">Why Pacific Market Registry</h2>
          <p className="text-gray-500 max-w-xl mx-auto">Built on the principle that Pacific business identity deserves the same structural recognition as any global registry.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all group">
              <div className="w-11 h-11 rounded-xl bg-[#0a1628] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <v.icon className={`w-5 h-5 ${v.color}`} />
              </div>
              <h3 className="font-bold text-[#0a1628] mb-2 text-sm">{v.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{v.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Businesses */}
      {featured.length > 0 && (
        <section className="py-16 bg-[#eef0f5] border-y border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-[#c9a84c]" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#c9a84c]">Featured Enterprises</span>
                </div>
                <h2 className="text-2xl font-bold text-[#0a1628]">Registry Spotlight</h2>
              </div>
              <Link href={createPageUrl("Registry")} className="flex items-center gap-1 text-sm font-medium text-[#0d4f4f] hover:gap-2 transition-all">
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <FeaturedSpotlight businesses={featured} />
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="rounded-2xl p-12 bg-gradient-to-b from-[#0a1628] to-[#07101d] relative overflow-hidden border border-[#0d4f4f]">
            <div className="absolute inset-0 opacity-15 pointer-events-none">
              <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-[#c9a84c] blur-3xl" />
            </div>
            <div className="relative">
              <Award className="w-10 h-10 text-[#c9a84c] mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-4">Is Your Business Registered?</h2>
              <p className="text-slate-300 mb-8 max-w-xl mx-auto">Submit a record for review, verify Pacific ownership, and strengthen discoverability through the official registry.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href={createPageUrl("ApplyListing")}
                  className="inline-flex items-center justify-center gap-2 bg-[#c9a84c] hover:bg-[#b8973b] text-[#0a1628] font-bold px-8 py-4 rounded-xl transition-all text-sm">
                  Submit Your Business <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href={createPageUrl("Registry")}
                  className="inline-flex items-center justify-center gap-2 border border-[#00c4cc] text-[#00c4cc] hover:bg-[#00c4cc]/10 font-semibold px-8 py-4 rounded-xl transition-all text-sm">
                  Search the Registry
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}