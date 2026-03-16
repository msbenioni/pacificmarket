import { useState, useEffect } from "react";
import Link from "next/link";
import { createPageUrl } from "@/utils";
import { ArrowRight, CheckCircle, Globe, Shield, Star, BookOpen, Award, ChevronRight } from "lucide-react";
import { getHomepageBusinesses } from "@/lib/supabase/queries/businesses";
import { isVerifiedBusiness, getBusinessTier, getBusinessTierDisplay } from "@/lib/business/helpers";
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
      icon: Shield,
      title: "Connected Discovery",
      description:
        "More than search — Pacific businesses are part of an interconnected network that makes meaningful discovery and collaboration possible.",
      color: "text-[#00c4cc]"
    },
    {
      icon: Globe,
      title: "Global Pacific Reach",
      description:
        "From local communities to global markets, Pacific-owned businesses can reach customers and partners who value authentic Pacific enterprise.",
      color: "text-[#c9a84c]"
    },
    {
      icon: CheckCircle,
      title: "Trust Through Connection",
      description:
        "Verified businesses build stronger relationships through transparent profiles, real connections, and community trust.",
      color: "text-[#00c4cc]"
    },
    {
      icon: BookOpen,
      title: "Living Pacific Network",
      description:
        "Pacific identity, innovation, and enterprise flow through a dynamic network that grows stronger with every business that joins.",
      color: "text-[#c9a84c]"
    },
  ];

  return (
    <div className="bg-[#f8f9fc]">
      {/* Hero */}
      <HeroHomepage
        badge="Global Pacific Discovery Network"
        title="Connect. Discover. Grow Together."
        mobileTitle="Discover Pacific businesses worldwide."
        subtitle=""
        description="Pacific Discovery Network connects the global Pacific business ecosystem — making it easier to discover, connect with, and support Pacific-owned businesses across oceans, industries, and communities."
        mobileDescription="Showcase your business with trust, visibility, and pride. Pacific Discovery Network is built to connect Pacific enterprise worldwide."
        primaryCtaText="Join the Network"
        primaryCtaHref={createPageUrl("BusinessLogin") + "?mode=signup"}
        secondaryCtaText="Discover Businesses"
        secondaryCtaHref={createPageUrl("Registry")}
      />

      {/* Stats Bar */}
      <StatsBar />

      {/* Value Blocks */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0a1628] mb-3 sm:mb-4">
            Built to Connect Pacific Enterprise Globally
          </h2>
          <p className="text-sm sm:text-base text-gray-500 max-w-2xl mx-auto leading-6">
            Pacific Discovery Network is more than a directory — it's a living network that connects Pacific businesses with customers, partners, and opportunities across the globe. We make discovery meaningful and connections lasting.
          </p>
          <p className="text-xs font-semibold text-[#0a1628]/60 mt-3">
            Built Pacific-led. Designed for connection. Shaped for global impact.
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
            Pacific pride in business
          </span>
          <span className="px-4 py-2 bg-[#0a1628]/5 text-[#0a1628] text-xs font-medium rounded-full border border-[#0a1628]/10">
            Global discoverability
          </span>
          <span className="px-4 py-2 bg-[#0a1628]/5 text-[#0a1628] text-xs font-medium rounded-full border border-[#0a1628]/10">
            Long-term economic visibility
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
                    Featured Businesses
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#0a1628]">
                  Pacific Businesses Leading with Visibility
                </h2>
                <p className="text-sm sm:text-base text-gray-500 mt-2 max-w-xl leading-6">
                  These businesses are showing what strong Pacific representation looks like — visible, branded, and easy to discover.
                </p>
              </div>

              <Link
                href={createPageUrl("Registry")}
                className="flex items-center gap-1 text-sm font-medium text-[#0d4f4f] hover:gap-2 transition-all self-start sm:self-auto"
              >
                View all <ChevronRight className="w-4 h-4" />
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
                Connect Your Business to the Pacific Network
              </h2>
              <p className="text-sm sm:text-base text-slate-300 mb-7 sm:mb-8 max-w-2xl mx-auto leading-6">
                Every business added to Pacific Discovery Network strengthens our global network. Join the discovery platform, build your connections, and help show that Pacific people are not only rich in culture — we are rich in capability, enterprise, and ambition too.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href={createPageUrl("BusinessLogin") + "?mode=signup"}
                  className="inline-flex items-center justify-center gap-2 bg-[#c9a84c] hover:bg-[#b8973b] text-[#0a1628] font-bold px-8 py-4 rounded-xl transition-all text-sm w-full sm:w-auto min-h-[44px]"
                >
                  Join the Network <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href={createPageUrl("Registry")}
                  className="inline-flex items-center justify-center gap-2 border border-[#00c4cc] text-[#00c4cc] hover:bg-[#00c4cc]/10 font-semibold px-8 py-4 rounded-xl transition-all text-sm w-full sm:w-auto min-h-[44px]"
                >
                  Discover Businesses
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}