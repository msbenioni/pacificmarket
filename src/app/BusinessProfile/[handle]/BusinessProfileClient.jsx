"use client";

import ContactModal from "@/components/profile/ContactModal";
import BusinessBanner from "@/components/shared/BusinessBanner";
import { IdentityFlagRow } from "@/components/shared/FlagIcon";
import { COUNTRIES, INDUSTRIES } from "@/constants/unifiedConstants";
import { useBusinessCulturalData } from "@/hooks/useBusinessCulturalData";
import { createPageUrl } from "@/utils";
import { getLogoUrl } from "@/utils/bannerUtils";
import {
    ArrowLeft,
    Briefcase,
    Check,
    ExternalLink,
    Facebook,
    Globe,
    Instagram,
    Linkedin,
    MapPin,
    MessageCircle,
    Music2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function BusinessProfileClient({ business: initialBusiness }) {
  const router = useRouter();
  const [business, setBusiness] = useState(initialBusiness);
  const [showContact, setShowContact] = useState(false);

  const culturalData = useBusinessCulturalData(business);

  const formatMarkdown = (text) =>
    text?.replace(/\s*·\s*/g, "\n- ").replace(/\n{3,}/g, "\n\n").trim() || "";

  const handleClaim = () => {
    router.push(
      `${createPageUrl("BusinessLogin")}?business=${business.id}&name=${encodeURIComponent(
        business.business_name
      )}`
    );
  };

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

  const socials = [
    {
      icon: Globe,
      label: "Website",
      value: business.business_website,
      href: business.business_website?.startsWith("http")
        ? business.business_website
        : business.business_website
          ? `https://${business.business_website}`
          : "",
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
      href: business.social_links?.facebook
        ? `https://facebook.com/${business.social_links.facebook.replace("@", "")}`
        : "",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: business.social_links?.linkedin,
      href: business.social_links?.linkedin
        ? `https://linkedin.com/company/${business.social_links.linkedin}`
        : "",
    },
    {
      icon: Music2,
      label: "TikTok",
      value: business.social_links?.tiktok,
      href: business.social_links?.tiktok?.startsWith("http")
        ? business.social_links?.tiktok
        : business.social_links?.tiktok
          ? `https://${business.social_links.tiktok}`
          : "",
    },
  ].filter((s) => s.value && s.href);

  const shortText = business.tagline || "";
  const fullText = business.description || "";

  if (!business) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f9fc] px-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm sm:p-8">
          <h2 className="mb-2 text-xl font-bold text-[#0a1628]">Record Not Found</h2>
          <p className="mb-5 text-sm text-gray-500">
            This business record does not exist in Pacific Discovery Network.
          </p>
          <Link
            href={createPageUrl("PacificBusinesses")}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0a1628] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#122040]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Pacific Businesses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      {showContact && (
        <ContactModal business={business} onClose={() => setShowContact(false)} />
      )}

      {/* Hero Banner Section - Moved down for header space */}
      <div className="relative overflow-hidden bg-[#03131f] mt-16">
        <img 
          src="/pacific_logo_banner.png" 
          alt="Pacific Discovery Network"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        <div className="absolute inset-0 hidden items-center justify-center sm:flex">
          <div className="text-center text-white">
            <div className="mb-2 text-2xl font-bold">
              {business?.business_name || "Business Profile"}
            </div>
            <div className="text-sm opacity-80">Pacific Discovery Network</div>
          </div>
        </div>

        {business.is_verified && business.is_claimed && (
          <div className="absolute bottom-8 right-8 z-20 hidden sm:flex">
            <span
              aria-label="Verified"
              title="Verified"
              className="inline-flex items-center gap-2 rounded-full border border-[#00c4cc]/45 bg-[#00c4cc]/20 px-3 py-1.5 text-xs font-medium text-[#baf7f9] backdrop-blur-sm"
            >
              <Check className="h-3 w-3" />
              Verified
            </span>
          </div>
        )}

        <div className="relative z-10 mx-auto flex items-start justify-center px-3 pb-16 pt-[104px] sm:min-h-[420px] sm:px-6 sm:pb-20 sm:pt-8 lg:min-h-[520px] lg:px-8 lg:pb-24 lg:pt-12">
          <div className="mt-1 w-full max-w-3xl text-center sm:mt-6 lg:mt-8">
            <div className="rounded-[28px] border border-white/15 bg-white/10 p-3 shadow-[0_20px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-4 lg:p-5">
              <div className="flex flex-col items-center gap-3 sm:gap-5">
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-white/15 bg-white/10 backdrop-blur-md sm:h-16 sm:w-16 lg:h-20 lg:w-20">
                  <img
                    src={getLogoUrl(business)}
                    alt={`${business.business_name} logo`}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1 text-center">
                  <h1 className="mx-auto max-w-[270px] text-[1.5rem] font-bold leading-[1.02] tracking-[-0.03em] text-white sm:max-w-4xl sm:text-[3.2rem] lg:text-[4.75rem]">
                    {business.business_name}
                  </h1>

                  {/* Tagline */}
                  {shortText && (
                    <p className="mx-auto mt-2.5 max-w-[290px] text-[12px] leading-[1.5] text-[#f5df9a] sm:mt-4 sm:max-w-3xl sm:text-base sm:leading-7 lg:text-[1.05rem]">
                      {shortText}
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:mt-5 sm:gap-3">
                    {(business.city || countryLabel) && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2 py-1 text-[10px] text-white/90 backdrop-blur-md sm:gap-1.5 sm:px-3 sm:py-1 sm:text-xs">
                        <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        <span className="max-w-[120px] truncate sm:max-w-none">
                          {business.city ? `${business.city}, ` : ""}
                          {countryLabel}
                        </span>
                      </span>
                    )}

                    {industryLabel && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2 py-1 text-[10px] text-white/90 backdrop-blur-md sm:gap-1.5 sm:px-3 sm:py-1 sm:text-xs">
                        <Briefcase className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        <span className="max-w-[150px] truncate sm:max-w-none">
                          {industryLabel}
                        </span>
                      </span>
                    )}
                  </div>

                  {/* Cultural Identity */}
                  {culturalData.culturalIdentitiesDisplay.length > 0 && (
                    <div className="mt-3 flex justify-center sm:mt-4">
                      <IdentityFlagRow
                        identities={culturalData.culturalIdentitiesDisplay}
                        maxFlags={99}
                        className="flex flex-wrap justify-center gap-1.5 sm:gap-2"
                      />
                    </div>
                  )}

                  {business.is_verified && business.is_claimed && (
                    <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 sm:hidden">
                      <span
                        aria-label="Verified"
                        title="Verified"
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#00c4cc]/45 bg-[#00c4cc]/20 px-2.5 py-1 text-[10px] font-medium text-[#baf7f9] backdrop-blur-sm"
                      >
                        <Check className="h-2.5 w-2.5" />
                        Verified
                      </span>
                    </div>
                  )}

                  {(business.business_email || business.business_phone) && (
                    <div className="mt-5 flex justify-center sm:mt-6">
                      <button
                        onClick={() => setShowContact(true)}
                        className="inline-flex min-h-[40px] w-full max-w-[230px] items-center justify-center gap-2 rounded-xl bg-[#00c9cc] px-3 py-2 text-[11px] font-semibold text-white transition-colors hover:bg-[#00aab0] sm:min-h-[46px] sm:w-auto sm:max-w-none sm:px-5 sm:py-3 sm:text-sm"
                      >
                        <MessageCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
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

      {/* Main Content */}
      <div className="relative -mt-6 flex justify-center px-4 pb-16 sm:-mt-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-3xl">
          <div className="mb-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <BusinessBanner business={business} />

            <div className="p-4 sm:p-6">
              {/* Full Description */}
              {fullText && (
                <div className="pt-4 sm:pt-5">
                  <h2 className="mb-2.5 text-sm font-semibold text-[#0a1628] sm:mb-3 sm:text-base lg:text-lg">
                    About
                  </h2>
                  <div className="prose prose-sm max-w-none text-[13px] leading-[1.6] text-gray-600 prose-headings:font-semibold prose-headings:text-[#0a1628] prose-p:my-3 prose-strong:text-[#0a1628] prose-ul:my-3 prose-ul:pl-5 prose-li:my-2 sm:text-base sm:leading-7 lg:text-lg">
                    <ReactMarkdown>{formatMarkdown(fullText)}</ReactMarkdown>
                  </div>
                </div>
              )}

              {/* Languages Spoken */}
              {culturalData.languagesDisplay.length > 0 && (
                <div className="mt-4 border-t border-gray-100 pt-4 sm:mt-5 sm:pt-5">
                  <h3 className="mb-2.5 text-sm font-semibold text-[#0a1628] sm:mb-3">
                    Languages
                  </h3>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {culturalData.languagesDisplay.map((lang, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 rounded-full border border-[#00c4cc]/20 bg-[#00c4cc]/10 px-2 py-1 text-[11px] font-medium text-[#00c4cc] sm:px-3 sm:py-1.5 sm:text-xs"
                      >
                        <Globe className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Links */}
              {socials.length > 0 && (
                <div className="mt-4 border-t border-gray-100 pt-4 sm:mt-5 sm:pt-5">
                  <h2 className="mb-2.5 text-sm font-semibold text-[#0a1628] sm:mb-3 sm:text-base lg:text-lg">
                    Links
                  </h2>

                  <div className="flex flex-wrap gap-3 sm:hidden">
                    {socials.map((social) => (
                      <a
                        key={`${social.label}-${social.href}`}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        title={social.label}
                        className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-600 transition-colors hover:bg-gray-100 hover:text-[#0d4f4f]"
                      >
                        <social.icon className="h-4.5 w-4.5" />
                      </a>
                    ))}
                  </div>

                  <div className="hidden grid-cols-2 gap-2 sm:grid">
                    {socials.map((social) => (
                      <a
                        key={`${social.label}-${social.href}`}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 px-3 py-2.5 text-[13px] text-gray-600 transition-colors hover:bg-gray-100 sm:text-base lg:text-lg"
                      >
                        <span className="flex min-w-0 items-center gap-2">
                          <social.icon className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{social.label}</span>
                        </span>
                        <ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Claim Business Section */}
          {!business.is_claimed && (
            <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <p className="text-sm text-gray-500 sm:text-base lg:text-lg">
                This business listing hasn&apos;t been claimed yet.{" "}
                <button
                  onClick={handleClaim}
                  className="font-medium text-[#0d4f4f] underline decoration-2 underline-offset-4 transition-colors hover:text-[#0a3e3e]"
                >
                  Claim this business
                </button>
              </p>
            </div>
          )}

          {/* Back Navigation */}
          <Link
            href={createPageUrl("PacificBusinesses")}
            className="mt-6 inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-[#0d4f4f]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Pacific Businesses
          </Link>
        </div>
      </div>
    </div>
  );
}
