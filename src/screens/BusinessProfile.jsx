import { useState, useEffect } from "react";
import Link from "next/link";
import { createPageUrl } from "@/utils";
import { getBusinessById } from "@/lib/supabase/queries/businesses";
import { 
  getBusinessWebsite, 
  getBusinessTier, 
  getBusinessTierDisplay,
  isVerifiedBusiness,
  getBusinessCountryDisplay,
  getBusinessIndustryDisplay,
  getBusinessSocialLinks,
  getBusinessFullAddress
} from "@/lib/business/helpers";
import {
  CheckCircle,
  Globe,
  MapPin,
  Instagram,
  Facebook,
  Star,
  ArrowLeft,
  ExternalLink,
  MessageCircle,
  Briefcase,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

import FlagIcon from "@/components/shared/FlagIcon";
import ContactModal from "@/components/profile/ContactModal";
import BusinessGallery from "@/components/profile/BusinessGallery";
import ProductsServices from "@/components/profile/ProductsServices";

export default function BusinessProfile() {
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [claimSubmitted, setClaimSubmitted] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [products, setProducts] = useState([]);

  const formatMarkdown = (text) =>
    text?.replace(/\s*•\s*/g, "\n- ").replace(/\n{3,}/g, "\n\n").trim() || "";

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const businessId = window.location.pathname.split('/').pop();
        const { data: businessData } = await getBusinessById(businessId);
        
        if (businessData) {
          setBusiness(businessData);
          await fetchExtras(businessData);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error loading profile data:", error);
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
      
      const tier = getBusinessTier(biz);

      if (tier === "mana" || tier === "moana") {
        const { data: imgs } = await supabase
          .from("business_images")
          .select("*")
          .eq("business_id", biz.id);
        setGalleryImages(imgs || []);
      }

      if (tier === "moana") {
        const { data: prods } = await supabase
          .from("product_services")
          .select("*")
          .eq("business_id", biz.id);
        setProducts(prods || []);
      }
    } catch (error) {
      console.error("Error fetching extras:", error);
    }
  };

  const handleClaim = () => {
    window.location.href = `${createPageUrl("BusinessLogin")}?business=${business.id}&name=${encodeURIComponent(business.name)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#0d4f4f] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Loading registry record...</p>
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
            This business record does not exist in the registry.
          </p>
          <Link
            href={createPageUrl("Registry")}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0a1628] px-5 py-3 text-sm font-semibold text-white hover:bg-[#122040] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Registry
          </Link>
        </div>
      </div>
    );
  }

  const countryLabel = getBusinessCountryDisplay(business);
  const industryLabel = getBusinessIndustryDisplay(business);
  const tier = getBusinessTier(business);

  const socials = [
    { icon: Globe, label: "Website", value: getBusinessWebsite(business), href: getBusinessWebsite(business) },
    {
      icon: Instagram,
      label: "Instagram",
      value: business.instagram,
      href: business.instagram
        ? `https://instagram.com/${business.instagram.replace("@", "")}`
        : "",
    },
    { icon: Facebook, label: "Facebook", value: business.facebook, href: business.facebook },
    { icon: Globe, label: "LinkedIn", value: business.linkedin, href: business.linkedin },
    { icon: Globe, label: "TikTok", value: business.tiktok, href: business.tiktok },
  ].filter((s) => s.value);

  const socialLinks = getBusinessSocialLinks(business) ? 
    Object.entries(getBusinessSocialLinks(business))
      .filter(([, value]) => value)
      .map(([label, value]) => ({
        icon: Globe,
        label: label.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        value,
        href: value,
      }))
    : [];

  const allSocials = [...socials, ...socialLinks];

  const shortText = business.short_description || business.tagline || "";
  const fullText = business.description || "";

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      {showContact && <ContactModal business={business} onClose={() => setShowContact(false)} />}

      {/* Banner */}
      <div className="relative h-[220px] sm:h-[280px] lg:h-[400px] overflow-hidden bg-gradient-to-br from-[#0a1628] to-[#0d4f4f]">
        {business.banner_url && (
          <img src={business.banner_url} alt="" className="w-full h-full object-cover" />
        )}

        {!business.banner_url && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#0d4f4f] to-[#0a1628]" />
        )}

        <div className="absolute inset-0 bg-black/10" />
      </div>

      <div className="relative flex justify-center px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-12 pb-16">
        <div className="w-full max-w-3xl">
          {/* Main profile card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 mb-6">
            {/* Header */}
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 border-white shadow-md flex-shrink-0 overflow-hidden bg-gradient-to-br from-[#0a1628] to-[#0d4f4f] flex items-center justify-center">
                {business.logo_url ? (
                  <img src={business.logo_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <img src="/pm_logo.png" alt="Pacific Market" className="w-full h-full object-cover" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start gap-2 mb-2">
                  <h1 className="text-lg sm:text-xl font-bold leading-tight text-[#0a1628] break-words">
                    {business.name}
                  </h1>

                  {(tier === "featured_plus" || tier === "moana") && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#c9a84c]/15 px-2.5 py-1 text-xs font-semibold text-[#9b7a1b] border border-[#c9a84c]/20">
                      <Star className="w-3 h-3" />
                      Moana
                    </span>
                  )}

                  {business.verified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#00c4cc]/10 px-2.5 py-1 text-xs font-semibold text-[#0d4f4f] border border-[#00c4cc]/20">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {(business.city || countryLabel) && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5 text-xs text-slate-600">
                      <MapPin className="w-3.5 h-3.5" />
                      {business.city ? `${business.city}, ` : ""}
                      {countryLabel}
                    </span>
                  )}

                  {industryLabel && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5 text-xs text-slate-600">
                      <Briefcase className="w-3.5 h-3.5" />
                      {industryLabel}
                    </span>
                  )}

                  {business.cultural_identity && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5 text-xs text-slate-600">
                      <FlagIcon identity={business.cultural_identity} size={14} />
                      {business.cultural_identity}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            {(business.contact_email || business.contact_phone) && (
              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowContact(true)}
                  className="inline-flex min-h-[44px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#0d4f4f] px-4 py-3 text-sm font-semibold text-white hover:bg-[#0a3d3d] transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Contact Us
                </button>
              </div>
            )}

            {/* Short description */}
            {shortText && (
              <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                <div className="text-[#0a1628] text-sm leading-7 font-medium prose prose-sm max-w-none prose-p:my-0 prose-strong:text-[#0a1628] prose-ul:pl-5 prose-li:my-1">
                  <ReactMarkdown>{formatMarkdown(shortText)}</ReactMarkdown>
                </div>
              </div>
            )}

            {/* Full description */}
            {fullText && (
              <div className="mt-5 pt-5 border-t border-gray-100">
                <h2 className="text-sm font-semibold text-[#0a1628] mb-3">About</h2>
                <div className="text-gray-600 text-sm leading-7 prose prose-sm max-w-none prose-headings:font-semibold prose-headings:text-[#0a1628] prose-strong:text-[#0a1628] prose-ul:pl-5 prose-ul:my-3 prose-li:my-2 prose-p:my-3">
                  <ReactMarkdown>{formatMarkdown(fullText)}</ReactMarkdown>
                </div>
              </div>
            )}

            {/* Languages */}
            {business.languages_spoken?.length > 0 && (
              <div className="mt-5 pt-5 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#0a1628] mb-3">
                  <img
                    src="/language_spoken.png"
                    alt="Languages spoken"
                    className="w-6 h-6 sm:w-7 sm:h-7"
                  />
                  Languages spoken
                </div>

                <div className="flex flex-wrap gap-2">
                  {business.languages_spoken.map((language) => (
                    <span
                      key={language}
                      className="bg-[#0a1628]/5 text-[#0a1628] text-xs px-3 py-1.5 rounded-full"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Socials */}
            {allSocials.length > 0 && (
              <div className="mt-5 pt-5 border-t border-gray-100">
                <h2 className="text-sm font-semibold text-[#0a1628] mb-3">Links</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {allSocials.map((social) => (
                    <a
                      key={`${social.label}-${social.href}`}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 hover:bg-gray-100 px-3 py-3 text-sm text-gray-600 transition-colors"
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
          {!business.claimed && (
            <div className="mt-6 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              {claimSubmitted ? (
                <div className="flex items-center gap-2 text-green-700 text-sm bg-green-50 px-3 py-3 rounded-xl">
                  <CheckCircle className="w-4 h-4" />
                  Claim submitted for review
                </div>
              ) : (
                <p className="text-sm text-gray-500">
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
            href={createPageUrl("Registry")}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#0d4f4f] transition-colors mt-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Registry
          </Link>
        </div>
      </div>
    </div>
  );
}