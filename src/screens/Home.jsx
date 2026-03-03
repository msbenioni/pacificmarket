import { useState, useEffect } from "react";
import Link from "next/link";
import { createPageUrl } from "@/utils";
import { pacificMarket } from "@/lib/pacificMarketClient";
import { ArrowRight, CheckCircle, Globe, Shield, Star, BookOpen, Search, Award, ChevronRight } from "lucide-react";
import { BUSINESS_STATUS, BUSINESS_TIER } from "@/constants/business";
import StatsBar from "../components/home/StatsBar";
import BusinessCard from "../components/registry/BusinessCard";
import FeaturedSpotlight from "../components/home/FeaturedSpotlight";
import HeroHomepage from "../components/shared/HeroHomepage";

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    pacificMarket.entities.Business.filter(
      { status: BUSINESS_STATUS.ACTIVE, subscription_tier: BUSINESS_TIER.FEATURED_PLUS },
      "-created_date"
    )
      .then(setFeatured)
      .catch(() => {});
  }, []);

  const values = [
    {
      icon: Shield,
      title: "Structured Registry",
      description: "The first global dataset of Pacific-owned enterprise — built to the standard of an official business registry, not a casual directory.",
      color: "text-[#00c4cc]"
    },
    {
      icon: Globe,
      title: "Diaspora Intelligence",
      description: "A geographic map of Pacific-owned businesses across countries — showing where Pacific enterprise is growing and where support is needed.",
      color: "text-[#c9a84c]"
    },
    {
      icon: CheckCircle,
      title: "Verified Ownership",
      description: "Verification ensures authenticity of Pacific ownership, cultural identity, and business legitimacy — data you can trust.",
      color: "text-[#00c4cc]"
    },
    {
      icon: BookOpen,
      title: "Cultural Data Layer",
      description: "Identity, language, and representation data preserved with cultural integrity — the kind of insight no census can provide.",
      color: "text-[#c9a84c]"
    },
  ];

  return (
    <div className="bg-[#f8f9fc]">
      {/* Hero – Pacific expressive, registry-first */}
      <HeroHomepage />

      {/* Stats Bar */}
      <StatsBar />

      {/* Value Blocks */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-[#0a1628] mb-4">More Than a Directory</h2>
          <p className="text-gray-500 max-w-xl mx-auto">Pacific Market is building the economic infrastructure layer for Pacific-owned enterprise — a visibility platform for communities and an intelligence platform for researchers, governments, and partners.</p>
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
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#c9a84c]">Featured Businesses</span>
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
              <h2 className="text-3xl font-bold text-white mb-4">Put Your Business on the Map</h2>
              <p className="text-slate-300 mb-8 max-w-xl mx-auto">Every listing strengthens the economic map of Pacific enterprise. Submit your business for review and become part of the first structured global registry of Pacific-owned enterprise.</p>
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