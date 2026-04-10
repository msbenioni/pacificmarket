"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createPageUrl } from "@/utils";
import {
  MapPin,
  Globe,
  MessageCircle,
  Check,
  Briefcase,
  Instagram,
  Facebook,
  ArrowLeft,
  ExternalLink,
  Linkedin,
  Music2,
} from "lucide-react";
import { getLogoUrl } from "@/utils/bannerUtils";
import ReactMarkdown from "react-markdown";
import BusinessBanner from "@/components/shared/BusinessBanner";
import { COUNTRIES, INDUSTRIES } from "@/constants/unifiedConstants";
import ContactModal from "@/components/profile/ContactModal";
import { useBusinessCulturalData } from "@/hooks/useBusinessCulturalData";
import { IdentityFlagRow } from "@/components/shared/FlagIcon";

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
  ].filter((social) => social.value);

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
      {/* Banner Section */}
      <BusinessBanner business={business} />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Business Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-[#0a1628]">
                  {business.business_name}
                </h1>
                {business.is_verified && (
                  <div className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                    <Check className="h-3 w-3" />
                    Verified
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                {business.industry && (
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    {getIndustryLabel(business.industry)}
                  </div>
                )}
                {business.country && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {getCountryLabel(business.country)}
                  </div>
                )}
                {business.city && <span>{business.city}</span>}
              </div>

              {/* Cultural Identity */}
              {culturalData?.culturalIdentity && (
                <div className="mb-4">
                  <IdentityFlagRow
                    culturalIdentity={culturalData.culturalIdentity}
                    compact
                  />
                </div>
              )}

              {/* Description */}
              {business.business_description && (
                <div className="prose prose-sm max-w-none text-gray-700">
                  <ReactMarkdown>{formatMarkdown(business.business_description)}</ReactMarkdown>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 ml-6">
              {!business.is_claimed && (
                <button
                  onClick={handleClaim}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0d4f4f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0a1628]"
                >
                  Claim This Business
                </button>
              )}
              <button
                onClick={() => setShowContact(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
              >
                <MessageCircle className="h-4 w-4" />
                Contact
              </button>
            </div>
          </div>
        </div>

        {/* Social Links */}
        {socials.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-[#0a1628] mb-4">Connect</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
                >
                  <social.icon className="h-4 w-4" />
                  <span>{social.label}</span>
                  <ExternalLink className="h-3 w-3 ml-auto" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Additional Info */}
        {(business.products_services || business.target_audience) && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-[#0a1628] mb-4">About</h2>
            <div className="space-y-4">
              {business.products_services && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Products & Services</h3>
                  <div className="prose prose-sm max-w-none text-gray-700">
                    <ReactMarkdown>{formatMarkdown(business.products_services)}</ReactMarkdown>
                  </div>
                </div>
              )}
              {business.target_audience && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Target Audience</h3>
                  <div className="prose prose-sm max-w-none text-gray-700">
                    <ReactMarkdown>{formatMarkdown(business.target_audience)}</ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link
            href={createPageUrl("PacificBusinesses")}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Pacific Businesses
          </Link>
        </div>
      </div>

      {/* Contact Modal */}
      {showContact && (
        <ContactModal
          isOpen={showContact}
          onClose={() => setShowContact(false)}
          business={business}
        />
      )}
    </div>
  );
}
