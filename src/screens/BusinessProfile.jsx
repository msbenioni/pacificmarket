"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createPageUrl } from "@/utils";
import { getBusinessById } from "@/lib/supabase/queries/businesses";
import { 
  MapPin, 
  Mail, 
  Phone, 
  Globe, 
  Clock, 
  MessageCircle,
  CheckCircle,
  Star,
  Shield,
  Users,
  Calendar,
  Briefcase,
  Instagram,
  Facebook,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import { getLogoUrl } from '@/utils/bannerUtils';
import ReactMarkdown from "react-markdown";
import FlagIcon from "@/components/shared/FlagIcon";
import BusinessBanner from "@/components/shared/BusinessBanner";
import { BUSINESS_STATUS, SUBSCRIPTION_TIER, COUNTRIES, INDUSTRIES } from "@/constants/unifiedConstants";
import ContactModal from "@/components/profile/ContactModal";
import BusinessGallery from "@/components/profile/BusinessGallery";
import ProductsServices from "@/components/profile/ProductsServices";
import { getBusinessCulturalData } from "@/utils/businessCulturalHelpers";

export default function BusinessProfile() {
  const router = useRouter();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claimSubmitted, setClaimSubmitted] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [products, setProducts] = useState([]);

  const formatMarkdown = (text) =>
    text?.replace(/\s*•\s*/g, "\n- ").replace(/\n{3,}/g, "\n\n").trim() || "";

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        // Get business ID from URL parameters, not pathname
        const urlParams = new URLSearchParams(window.location.search);
        const businessId = urlParams.get('id');
        const businessHandle = urlParams.get('handle');
        
        // Use handle as fallback if no ID provided
        const identifier = businessId || businessHandle;
        
        if (!identifier) {
          setLoading(false);
          return;
        }
        
        const businessData = await getBusinessById(identifier);
        
        if (businessData) {
          setBusiness(businessData);
          await fetchExtras(businessData);
        }
        
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    loadProfileData();
  }, []);

  const fetchExtras = async (biz) => {
    try {
      // Import here to avoid circular dependencies
      const { getSupabase } = await import("@/lib/supabase/client");
      const supabase = getSupabase();
      
      const tier = biz.subscription_tier || 'vaka';

      if (tier === "mana" || tier === "moana") {
        try {
          const { data: imgs } = await supabase
            .from("business_images")
            .select("*")
            .eq("business_id", biz.id);
          setGalleryImages(imgs || []);
        } catch (error) {
          console.log("Gallery images not available:", error.message);
          setGalleryImages([]);
        }
      }

      if (tier === "moana") {
        try {
          const { data: prods } = await supabase
            .from("product_services")
            .select("*")
            .eq("business_id", biz.id);
          setProducts(prods || []);
        } catch (error) {
          console.log("Products/services not available:", error.message);
          setProducts([]);
        }
      }
    } catch (error) {
      console.error("Error fetching extras:", error);
    }
  };

  const handleClaim = () => {
    router.push(`${createPageUrl("BusinessLogin")}?business=${business.id}&name=${encodeURIComponent(business.business_name)}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#0d4f4f] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Loading Pacific Discovery Network record...</p>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center px-4">
        <div className="text-center bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-sm">
          <h2 className="text-xl font-bold text-[#0a1628] mb-2">Record Not Found</h2>
          <p className="text-gray-500 text-sm mb-5">
            This business record does not exist in Pacific Discovery Network.
          </p>
          <Link
            href={createPageUrl("PacificBusinesses")}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0a1628] px-5 py-3 text-sm font-semibold text-white hover:bg-[#122040] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Pacific Businesses
          </Link>
        </div>
      </div>
    );
  }

  const getCountryLabel = (value) => {
    const match = COUNTRIES.find((item) => item.value === value);
    return match?.label || value || "";
  };

  const getIndustryLabel = (value) => {
    const match = INDUSTRIES.find((item) => item.value === value);
    return match?.label || value || "";
  };

  const countryLabel = getCountryLabel(business.country);
  const industryLabel = getIndustryLabel(business.industry);
  const tier = business.subscription_tier || 'vaka';

  const socials = [
    { 
      icon: Globe, 
      label: "Website", 
      value: business.business_website, 
      href: business.business_website?.startsWith("http")
        ? business.business_website
        : `https://${business.business_website}`
    },
    {
      icon: Instagram,
      label: "Instagram",
      value: business.social_links?.instagram,
      href: business.social_links?.instagram
        ? `https://instagram.com/${business.social_links.instagram.replace("@", "")}`
        : "",
    },
    { 
      icon: Facebook, 
      label: "Facebook", 
      value: business.social_links?.facebook, 
      href: business.social_links?.facebook?.startsWith("http")
        ? business.social_links?.facebook
        : `https://${business.social_links?.facebook}`
    },
    { 
      icon: Globe, 
      label: "LinkedIn", 
      value: business.social_links?.linkedin, 
      href: business.social_links?.linkedin?.startsWith("http")
        ? business.social_links?.linkedin
        : `https://${business.social_links?.linkedin}`
    },
    { 
      icon: Globe, 
      label: "TikTok", 
      value: business.social_links?.tiktok, 
      href: business.social_links?.tiktok?.startsWith("http")
        ? business.social_links?.tiktok
        : `https://${business.social_links?.tiktok}`
    },
  ].filter((s) => s.value);

  const allSocials = socials.filter(s => s.value);

  const shortText = business.tagline || "";
  const fullText = business.description || "";

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      {showContact && <ContactModal business={business} onClose={() => setShowContact(false)} />}

      {/* Premium Hero */}
      <div className="relative min-h-[320px] overflow-hidden bg-[#03131f] sm:min-h-[420px] lg:min-h-[520px]">
        <img
          src="/pacific_logo_banner.png"
          alt="Pacific Discovery Network banner"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        {/* Tier and Verified badges on hero background bottom right */}
        <div className="absolute bottom-8 right-8 flex flex-wrap items-center gap-2 z-20">
          {(tier === "featured_plus" || tier === "moana") && (
            <span className="inline-flex items-center gap-1 rounded-full border border-[#c9a84c]/50 bg-[#c9a84c]/30 px-3 py-1 text-xs font-semibold text-[#f5df9a] backdrop-blur-sm">
              <Star className="h-3.5 w-3.5" />
              Moana
            </span>
          )}

          {business.is_verified && (
            <span className="inline-flex items-center gap-1 rounded-full border border-[#00c4cc]/50 bg-[#00c4cc]/30 px-3 py-1 text-xs font-semibold text-[#baf7f9] backdrop-blur-sm">
              <CheckCircle className="h-3.5 w-3.5" />
              Verified
            </span>
          )}
        </div>

        <div className="relative z-10 mx-auto flex min-h-[280px] items-start justify-center px-3 pb-6 pt-16 sm:min-h-[420px] sm:px-6 sm:pb-10 sm:pt-8 lg:min-h-[520px] lg:px-8 lg:pb-14 lg:pt-12">
          <div className="w-full max-w-3xl text-center mt-2 sm:mt-6 lg:mt-8">
            <div className="rounded-[28px] border border-white/15 bg-white/10 p-2 shadow-[0_20px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-4 lg:p-5">
            <div className="flex flex-col items-center gap-3 sm:gap-5">
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md sm:h-16 sm:w-16 lg:h-20 lg:w-20">
                <img
                  src={getLogoUrl(business)}
                  alt={`${business.business_name} logo`}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="min-w-0 flex-1 text-center">
                <h1 className="max-w-4xl text-[2.2rem] font-bold leading-[0.95] tracking-[-0.04em] text-white sm:text-[3.2rem] lg:text-[4.75rem]">
                  {business.business_name}
                </h1>

                {shortText && (
                  <p className="mt-4 max-w-3xl text-sm leading-7 text-[#f5df9a] sm:text-base lg:text-[1.05rem]">
                    {shortText}
                  </p>
                )}

                <div className="mt-3 flex flex-wrap items-center justify-center gap-3 sm:mt-5 sm:gap-2">
                  <div className="flex items-center justify-center gap-2 sm:flex-wrap sm:gap-2">
                    {(business.city || countryLabel) && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2 py-1 text-[10px] text-white/90 backdrop-blur-md sm:gap-1.5 sm:px-3 sm:py-2 sm:text-xs">
                        <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        <span className="truncate max-w-[120px] sm:max-w-none">
                          {business.city ? `${business.city}, ` : ""}{countryLabel}
                        </span>
                      </span>
                    )}

                    {industryLabel && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2 py-1 text-[10px] text-white/90 backdrop-blur-md sm:gap-1.5 sm:px-3 sm:py-2 sm:text-xs">
                        <Briefcase className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        <span className="truncate max-w-[100px] sm:max-w-none">
                          {industryLabel}
                        </span>
                      </span>
                    )}
                  </div>

                  {(() => {
                    const culturalData = getBusinessCulturalData(business);
                    return culturalData.culturalIdentitiesDisplay.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {culturalData.culturalIdentitiesDisplay.map((identity, index) => (
                          <span key={index} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs text-white/90 backdrop-blur-md">
                            <FlagIcon identity={identity} size={14} />
                            {identity}
                          </span>
                        ))}
                      </div>
                    );
                  })()}
                </div>

                {(business.business_email || business.business_phone) && (
                <div className="mt-4 flex justify-center sm:mt-6">
                  <button
                    onClick={() => setShowContact(true)}
                    className="inline-flex min-h-[40px] items-center justify-center gap-2 rounded-xl bg-[#00c9cc] hover:bg-[#00aab0] px-4 py-2.5 text-xs font-semibold text-white transition-colors sm:min-h-[46px] sm:px-5 sm:py-3 sm:text-sm"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Contact Business
                  </button>
                </div>
              )}  
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>

      <div className="relative flex justify-center px-4 sm:px-6 lg:px-8 -mt-4 sm:-mt-6 pb-16">
        <div className="w-full max-w-3xl">
          {/* Main profile card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
            {/* Business banner at top - always show */}
            <BusinessBanner business={business} />

            <div className="p-5 sm:p-6">
            {/* Full description */}
            {fullText && (
              <div className="pt-5 border-t border-gray-100">
                <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-[#0a1628] mb-3">About</h2>
                <div className="text-gray-600 text-sm sm:text-base lg:text-lg leading-7 prose prose-sm max-w-none prose-headings:font-semibold prose-headings:text-[#0a1628] prose-strong:text-[#0a1628] prose-ul:pl-5 prose-ul:my-3 prose-li:my-2 prose-p:my-3">
                  <ReactMarkdown>{formatMarkdown(fullText)}</ReactMarkdown>
                </div>
              </div>
            )}

            {/* Languages */}
            {(() => {
              const culturalData = getBusinessCulturalData(business);
              return culturalData.languagesDisplay.length > 0 && (
                <div className="mt-5 pt-5 border-t border-gray-100">
                  <h3 className="text-sm font-semibold text-[#0a1628] mb-3">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {culturalData.languagesDisplay.map((lang, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 rounded-full border border-[#00c4cc]/20 bg-[#00c4cc]/10 px-3 py-1.5 text-xs font-medium text-[#00c4cc]"
                      >
                        <Globe className="h-3 w-3" />
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Socials */}
            {allSocials.length > 0 && (
              <div className="mt-5 pt-5 border-t border-gray-100">
                <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-[#0a1628] mb-3">Links</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {allSocials.map((social) => (
                    <a
                      key={`${social.label}-${social.href}`}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 hover:bg-gray-100 px-3 py-3 text-sm sm:text-base lg:text-lg text-gray-600 transition-colors"
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        <social.icon className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{social.label}</span>
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Gallery */}
          <div className="mt-6">
            <BusinessGallery images={galleryImages} />
          </div>

          {/* Products / Services */}
          <div className="mt-6">
            <ProductsServices products={products} onContact={() => setShowContact(true)} />
          </div>

          {/* Claim */}
          {!business.is_claimed && (
            <div className="mt-6 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              {claimSubmitted ? (
                <div className="flex items-center gap-2 text-green-700 text-sm sm:text-base lg:text-lg bg-green-50 px-3 py-3 rounded-xl">
                  <CheckCircle className="w-4 h-4" />
                  Claim submitted for review
                </div>
              ) : (
                <p className="text-sm sm:text-base lg:text-lg text-gray-500">
                  Is this your business?{" "}
                  <button
                    onClick={handleClaim}
                    className="text-[#0d4f4f] font-semibold hover:underline"
                  >
                    Claim this listing
                  </button>
                </p>
              )}
            </div>
          )}

          {/* Back */}
          <Link
            href={createPageUrl("PacificBusinesses")}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#0d4f4f] transition-colors mt-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Pacific Businesses
          </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
