import { useState, useEffect } from "react";
import Link from "next/link";
import { createPageUrl } from "@/utils";
import {
  ArrowRight,
  CheckCircle,
  Globe,
  Shield,
  Star,
  Compass,
  Award,
  ChevronRight,
} from "lucide-react";
import { getHomepageBusinesses } from "@/lib/supabase/queries/businesses";
import StatsBar from "../components/home/StatsBar";
import FeaturedSpotlight from "../components/home/FeaturedSpotlight";
import HeroHomepage from "../components/shared/HeroHomepage";
import ToolsHomepageSnippet from "../components/ToolsHomepageSnippet";

export const dynamic = "force-dynamic";

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    const loadFeaturedBusinesses = async () => {
      try {
        const { data } = await getHomepageBusinesses({ limit: 12 });

        console.log("Homepage featured businesses:", data);
        setFeatured(data || []);
      } catch (error) {
        console.error("Error fetching featured businesses:", error);
      }
    };

    loadFeaturedBusinesses();
  }, []);

  const values = [
    {
      icon: Compass,
      title: "Meaningful Discovery",
      description:
        "Pacific Discovery Network helps people discover businesses with more context, credibility, and intention — not just names in a list.",
      color: "text-[#00c4cc]",
    },
    {
      icon: Globe,
      title: "Global Pacific Reach",
      description:
        "From Aotearoa to the wider Pacific and diaspora, businesses gain stronger visibility across regions, communities, and opportunities.",
      color: "text-[#c9a84c]",
    },
    {
      icon: Shield,
      title: "Trust and Credibility",
      description:
        "Structured profiles, stronger presentation, and trusted visibility help businesses build confidence with customers, partners, and communities.",
      color: "text-[#00c4cc]",
    },
    {
      icon: CheckCircle,
      title: "Built for Long-Term Growth",
      description:
        "This is more than exposure. It is a platform designed to support discoverability, connection, and the long-term visibility of Pacific enterprise.",
      color: "text-[#c9a84c]",
    },
  ];

  return (
    <div className="bg-[#f8f9fc]">
      {/* Hero */}
      <HeroHomepage/>

      {/* Stats Bar */}
      <StatsBar />

      {/* Value Blocks */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0a1628] mb-3 sm:mb-4">
            A Stronger Way to Discover Pacific Enterprise
          </h2>
          <p className="text-sm sm:text-base text-gray-500 max-w-2xl mx-auto leading-6">
            Pacific Discovery Network is designed to make Pacific businesses more
            visible, more trusted, and easier to discover. It brings together
            business presence, credibility, and connection in one premium
            platform.
          </p>
          <p className="text-xs font-semibold text-[#0a1628]/60 mt-3">
            Pacific-led. Discovery-driven. Built for visibility that lasts.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {values.map((v, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-[0_10px_30px_rgba(10,22,40,0.08)] hover:shadow-[0_18px_50px_rgba(10,22,40,0.12)] transition-all group"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-b from-[#0a1628] to-[#07101d] flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform">
                <v.icon className={`w-5 h-5 ${v.color}`} />
              </div>
              <h3 className="font-bold text-[#0a1628] mb-2 text-sm">{v.title}</h3>
              <p className="text-gray-500 text-sm leading-6">{v.description}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-6 sm:mt-8">
          <span className="px-4 py-2 bg-[#0a1628]/5 text-[#0a1628] text-xs font-medium rounded-full border border-[#0a1628]/10">
            Pacific business visibility
          </span>
          <span className="px-4 py-2 bg-[#0a1628]/5 text-[#0a1628] text-xs font-medium rounded-full border border-[#0a1628]/10">
            Trusted discovery experience
          </span>
          <span className="px-4 py-2 bg-[#0a1628]/5 text-[#0a1628] text-xs font-medium rounded-full border border-[#0a1628]/10">
            Connection across regions
          </span>
        </div>
      </section>

      {/* Tools Homepage Snippet */}
      <ToolsHomepageSnippet />

      {/* Featured Businesses */}
      {featured.length > 0 && (
        <section className="py-12 sm:py-16 bg-[#eef0f5] border-y border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 sm:mb-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-[#c9a84c]" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#c9a84c]">
                    Featured on the Network
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#0a1628]">
                  Pacific Businesses Worth Discovering
                </h2>
                <p className="text-sm sm:text-base text-gray-500 mt-2 max-w-xl leading-6">
                  Explore a selection of businesses building strong brands,
                  trusted visibility, and meaningful presence across the Pacific
                  business landscape.
                </p>
              </div>

              <Link
                href={createPageUrl("PacificBusinesses")}
                className="flex items-center gap-1 text-sm font-medium text-[#0d4f4f] hover:gap-2 transition-all self-start sm:self-auto"
              >
                Explore the network <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <FeaturedSpotlight businesses={featured} />
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="rounded-2xl p-7 sm:p-12 bg-gradient-to-b from-[#0a1628] to-[#07101d] relative overflow-hidden border border-[#0d4f4f]">
            <div className="absolute inset-0 opacity-15 pointer-events-none">
              <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-[#c9a84c] blur-3xl" />
            </div>

            <div className="relative">
              <Award className="w-10 h-10 text-[#c9a84c] mx-auto mb-4" />
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Put Your Business on the Pacific Discovery Network
              </h2>
              <p className="text-sm sm:text-base text-slate-300 mb-7 sm:mb-8 max-w-2xl mx-auto leading-6">
                Join a platform built to make Pacific businesses easier to
                discover, trust, and support. Strengthen your visibility, present
                your business with confidence, and become part of a growing
                network shaped for long-term impact.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href={createPageUrl("BusinessLogin") + "?mode=signup"}
                  className="inline-flex items-center justify-center gap-2 bg-[#c9a84c] hover:bg-[#b8973b] text-[#0a1628] font-bold px-8 py-4 rounded-xl transition-all text-sm w-full sm:w-auto min-h-[44px]"
                >
                  Join the Network <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href={createPageUrl("PacificBusinesses")}
                  className="inline-flex items-center justify-center gap-2 border border-[#00c4cc] text-[#00c4cc] hover:bg-[#00c4cc]/10 font-semibold px-8 py-4 rounded-xl transition-all text-sm w-full sm:w-auto min-h-[44px]"
                >
                  Explore Businesses
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}