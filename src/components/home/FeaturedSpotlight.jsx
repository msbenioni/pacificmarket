'use client';

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { getBannerUrl, getLogoUrl } from '@/utils/bannerUtils';
import { createPageUrl } from "@/utils";
import { CheckCircle, MapPin, Star, ChevronRight, ChevronLeft, Mail, Globe, Instagram, Facebook, Linkedin, Twitter, Youtube, Video, MessageSquare } from "lucide-react";
import FlagIcon from "@/components/shared/FlagIcon";
import ContactModal from "@/components/profile/ContactModal";
import { COUNTRIES } from "@/constants/unifiedConstants";
import { getBusinessLanguagesSpoken } from "@/utils/businessCulturalHelpers";

const WINDOW_SIZE = 4;

function hourKeyUTC() {
  return Math.floor(Date.now() / (1000 * 60 * 60));
}

function clampText(s, max = 140) {
  if (!s) return "";
  const clean = String(s).replace(/\s+/g, " ").trim();
  return clean.length > max ? clean.slice(0, max - 1) + "…" : clean;
}

// Helper function to convert country slug to readable name
function getCountryDisplayName(countrySlug) {
  if (!countrySlug) return "";
  
  const country = COUNTRIES.find(c => c.value === countrySlug);
  return country ? country.label : countrySlug;
}

function formatLanguageName(languageCode) {
  if (!languageCode) return "";

  const languageMap = {
    english: "English",
    french: "French",
    spanish: "Spanish",
    chinese: "Chinese",
    japanese: "Japanese",
    korean: "Korean",
    german: "German",
    italian: "Italian",
    portuguese: "Portuguese",
    russian: "Russian",
    arabic: "Arabic",
    hindi: "Hindi",
    maori: "Māori",
    "te-reo-maori": "Te Reo Māori",
    samoan: "Samoan",
    tongan: "Tongan",
    fijian: "Fijian",
    tahitian: "Tahitian",
    uvean: "Uvean",
    rotuman: "Rotuman",
    "tok-pisin": "Tok Pisin",
    pidgin: "Pidgin",
    bislama: "Bislama",
    niuean: "Niuean",
    cookislandsmaori: "Cook Islands Māori",
    "cook-islands-maori": "Cook Islands Māori",
    rarotongan: "Rarotongan",
    paumotu: "Pa'umotu",
    marquesan: "Marquesan",
  };

  const normalized = String(languageCode).trim().toLowerCase();
  return (
    languageMap[normalized] ||
    normalized
      .replace(/[[\]"]/g, "")
      .split(/[-_, ]+/)
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  );
}

function normaliseLanguages(languages) {
  if (!languages) return [];

  if (Array.isArray(languages)) {
    return languages.filter(Boolean);
  }

  if (typeof languages === "string") {
    const trimmed = languages.trim();

    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
    } catch {
      // continue
    }

    return trimmed
      .replace(/^\[|\]$/g, "")
      .split(",")
      .map((lang) => lang.replace(/"/g, "").trim())
      .filter(Boolean);
  }

  return [];
}

function formatLanguages(languages) {
  const normalizedLanguages = normaliseLanguages(languages);
  
  if (normalizedLanguages.length === 0) return '';
  
  const formattedLanguages = normalizedLanguages.map(lang => formatLanguageName(lang));
  
  if (formattedLanguages.length <= 2) {
    return formattedLanguages.join(' & ');
  }
  
  return `${formattedLanguages.slice(0, 2).join(' & ')} +${formattedLanguages.length - 2} more`;
}

function getSocialLinks(business) {
  const socials = [
    { icon: Globe, label: "Website", value: business.website, href: business.website },
    { icon: Instagram, label: "Instagram", value: business.instagram, href: `https://instagram.com/${business.instagram?.replace("@", "")}` },
    { icon: Facebook, label: "Facebook", value: business.facebook, href: business.facebook },
    { icon: Linkedin, label: "LinkedIn", value: business.linkedin, href: business.linkedin },
    { icon: Video, label: "TikTok", value: business.tiktok, href: business.tiktok },
    { icon: Twitter, label: "Twitter", value: business.twitter, href: business.twitter },
    { icon: Youtube, label: "YouTube", value: business.youtube, href: business.youtube },
  ].filter(s => s.value);

  const socialLinks = business.social_links && typeof business.social_links === "object"
    ? Object.entries(business.social_links)
        .filter(([, value]) => value)
        .map(([platform, value]) => {
          let icon = Globe;
          const platformLower = platform.toLowerCase();
          
          if (platformLower.includes('instagram')) icon = Instagram;
          else if (platformLower.includes('facebook')) icon = Facebook;
          else if (platformLower.includes('linkedin') || platformLower.includes('linked-in')) icon = Linkedin;
          else if (platformLower.includes('twitter') || platformLower.includes('x')) icon = Twitter;
          else if (platformLower.includes('youtube') || platformLower.includes('you-tube')) icon = Youtube;
          else if (platformLower.includes('tiktok') || platformLower.includes('tic-toc')) icon = Video;
          else if (platformLower.includes('website') || platformLower.includes('web')) icon = Globe;
          
          return {
            icon,
            label: platform.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
            value,
            href: value,
          };
        })
    : [];

  return [...socials, ...socialLinks];
}

function FeaturedBadge({ tier }) {
  if (tier === "moana") {
    return (
      <div className="inline-flex items-center gap-1 rounded-full bg-[#c9a84c] text-[#0a1628] px-2.5 py-1 text-[11px] font-extrabold shadow-sm">
        <Star className="w-3.5 h-3.5" />
        Moana
      </div>
    );
  } else if (tier === "mana") {
    return (
      <div className="inline-flex items-center gap-1 rounded-full bg-[#00c4cc] text-white px-2.5 py-1 text-[11px] font-extrabold shadow-sm">
        <CheckCircle className="w-3.5 h-3.5" />
        Mana
      </div>
    );
  }
  return null;
}

function BusinessMiniCard({ b, active, onSelect }) {
  // Simplified language handling using helper
  const languages = formatLanguages(getBusinessLanguagesSpoken(b));
  
  return (
    <button
      type="button"
      onFocus={onSelect}
      onClick={onSelect}
      className={[
        "group w-full text-left rounded-2xl border bg-white transition-all",
        "hover:-translate-y-0.5 hover:shadow-xl",
        "h-full flex flex-col", // Ensure consistent height
        active
          ? "border-[#c9a84c]/70 shadow-lg ring-2 ring-[#c9a84c]/20"
          : "border-gray-200 shadow-sm",
      ].join(" ")}
    >
      {/* Banner */}
      <div className="relative h-[133px] rounded-t-2xl overflow-hidden bg-[#0d4f4f] flex-shrink-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d4f4f] to-[#1a6b6b]" />

        {getBannerUrl(b) && (
          <img
            src={getBannerUrl(b)}
            alt=""
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: "center top" }}
          />
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">
        {/* Logo positioned to overlap banner */}
        <div className="relative -mt-10 mb-4">
          <div className="w-20 h-20 rounded-2xl border-3 border-white shadow-xl overflow-hidden bg-gradient-to-br from-[#0a1628] to-[#0d4f4f] flex items-center justify-center">
            <img src={getLogoUrl(b)} alt="" className="w-full h-full object-cover" loading="lazy" />
          </div>
        </div>

        {/* Business name and verification */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-bold text-[#0a1628] text-lg leading-tight flex-1">
            {b.business_name}
          </h3>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            {(b.subscription_tier === "mana" || b.subscription_tier === "moana") && <CheckCircle className="w-5 h-5 text-[#00c4cc] shrink-0" />}
          </div>
        </div>

        {/* Tagline / short description */}
        {b.tagline && (
          <p className="text-[#475569] text-sm leading-relaxed font-medium mb-4 line-clamp-2">
            {b.tagline}
          </p>
        )}

        {/* Information stack */}
        <div className="space-y-3 mb-4">
          {/* Location */}
          {b.country && (
            <div className="flex items-center gap-2 text-sm text-[#64748b]">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">
                {b.city ? `${b.city}, ` : ""}{getCountryDisplayName(b.country)}
              </span>
            </div>
          )}

          {/* Cultural identity flags */}
          {b.cultural_identity && (
            <div className="flex items-center gap-2">
              <FlagIcon identity={b.cultural_identity} size={20} />
            </div>
          )}

          {/* Languages spoken */}
          {languages && (
            <div className="flex items-center gap-2 text-sm font-medium text-[#00c4cc]">
              <MessageSquare className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{languages}</span>
            </div>
          )}
        </div>

        {/* Footer - pinned to bottom */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-100 mt-auto">
          {/* Industry pill */}
          {b.industry && (
            <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600">
              {b.industry}
            </span>
          )}
          
          {/* View profile CTA */}
          <div className="flex items-center gap-1 text-xs font-medium text-[#0d4f4f] opacity-0 group-hover:opacity-100 transition-opacity">
            View profile
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </button>
  );
}

function SpotlightPanel({ b, index, total, onPrev, onNext }) {
  const [showContact, setShowContact] = useState(false);
  const socialLinks = getSocialLinks(b);

  // key forces clean fade/scale on change
  return (
    <>
      <div
        key={b?.id || b?.business_handle || index}
        className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#0a1628] h-full flex flex-col animate-fadeIn"
        style={{ transformOrigin: "center" }}
      >
        {/* Premium glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#00c4cc]/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-[#c9a84c]/15 blur-3xl" />

        {/* Banner */}
        <div className="relative h-[233px] overflow-hidden bg-[#0a1628]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0d4f4f] to-[#0a1628]" />

          {getBannerUrl(b) && (
            <img
              src={getBannerUrl(b)}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: "center top" }}
            />
          )}
        </div>

        {/* Spotlight chevrons */}
        <button
          type="button"
          onClick={onPrev}
          aria-label="Previous featured business"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20
                     w-11 h-11 rounded-full
                     bg-white/10 hover:bg-white/15
                     border border-white/15
                     backdrop-blur-md
                     flex items-center justify-center
                     text-white transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={onNext}
            aria-label="Next featured business"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20
                     w-11 h-11 rounded-full
                     bg-white/10 hover:bg-white/15
                     border border-white/15
                     backdrop-blur-md
                     flex items-center justify-center
                     text-white transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="absolute top-5 left-5 flex items-center gap-3">
            <FeaturedBadge tier={b?.subscription_tier || b?.tier} />
            <div className="text-[11px] text-white/70 font-semibold">
              {index + 1} / {total}
            </div>
          </div>

        {/* Body */}
        <div className="p-6 sm:p-7 flex-1 flex flex-col">
          {/* Logo positioned on top of banner */}
          <div className="relative -mt-12 mb-4">
            <div className="w-20 h-20 rounded-3xl border-3 border-white/80 shadow-2xl overflow-hidden bg-gradient-to-br from-[#0a1628] to-[#0d4f4f] flex items-center justify-center">
              <img src={getLogoUrl(b)} alt="" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-white font-black text-xl sm:text-2xl leading-tight">
                  {b?.name}
                </h3>
                {(b?.subscription_tier === "mana" || b?.subscription_tier === "moana") && (
                  <div className="inline-flex items-center gap-1 rounded-full bg-white/10 text-white px-3 py-1 text-xs font-bold border border-white/10">
                    <CheckCircle className="w-4 h-4 text-[#00c4cc]" />
                    {b?.subscription_tier === "mana" ? "Mana" : "Moana"}
                  </div>
                )}
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-white/75">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {b?.city ? `${b.city}, ` : ""}{getCountryDisplayName(b?.country)}
                </span>
                {b?.industry && (
                  <span className="text-xs bg-white/10 border border-white/10 px-2 py-1 rounded-lg">
                    {b.industry}
                  </span>
                )}
                {b?.cultural_identity && (
                  <div className="group relative inline-flex items-center justify-center rounded-full border border-[#00c4cc]/20 bg-gradient-to-r from-[#00c4cc]/5 to-[#0a9fa8]/5 p-1.5 text-[#00c4cc] shadow-sm cursor-help">
                    <FlagIcon identity={b.cultural_identity} size={14} />
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-[#0a1628] text-white text-[10px] font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                      {b.cultural_identity}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#0a1628] rotate-45 -mt-1"></div>
                    </div>
                  </div>
                )}
              </div>

              {(b?.tagline || b?.description) && (
              <div className="mt-4 space-y-3 flex-1">
                {b?.tagline && (
                  <p className="text-sm sm:text-[15px] leading-relaxed text-white/90 font-medium">
                    {b.tagline}
                  </p>
                )}
                {b?.description && b?.description !== b?.tagline && (
                  <p className="text-sm sm:text-[15px] leading-relaxed text-white/80">
                    {clampText(b.description, 300)}
                  </p>
                )}
              </div>
            )}

            {!b?.tagline && !b?.description && (
              <p className="mt-4 text-sm sm:text-[15px] leading-relaxed text-white/80 flex-1">
                Featured Pacific-owned business in the Pacific Discovery Network.
              </p>
            )}

              {/* Social Links */}
              {socialLinks.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs text-white/60 font-semibold uppercase tracking-wider mb-2">Connect</p>
                  <div className="flex flex-wrap gap-2">
                    {socialLinks.slice(0, 4).map((social, idx) => (
                      <a
                        key={idx}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/15 rounded-lg transition-colors"
                        title={social.label}
                      >
                        <social.icon className="w-3.5 h-3.5 text-white/80" />
                        <span className="text-xs text-white/80">{social.label}</span>
                      </a>
                    ))}
                    {socialLinks.length > 4 && (
                      <span className="inline-flex items-center px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg">
                        <span className="text-xs text-white/60">+{socialLinks.length - 4} more</span>
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <Link
                  href={createPageUrl("BusinessProfile") + `?handle=${b?.business_handle || b?.id}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#c9a84c] hover:bg-[#b8973b] text-[#0a1628] font-extrabold px-5 py-3 transition-all"
                >
                  View Profile <ChevronRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => setShowContact(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 text-white hover:bg-white/10 font-semibold px-8 py-3 transition-all"
                >
                  <Mail className="w-4 h-4" />
                  Contact
                </button>
              </div>
            </div>
          </div>

          {/* Subtle footer line */}
          <div className="mt-6 h-px w-full bg-gradient-to-r from-white/0 via-white/15 to-white/0" />
        </div>
      </div>

      {/* Contact Modal */}
      {showContact && (
        <ContactModal 
          business={b} 
          onClose={() => setShowContact(false)} 
        />
      )}
    </>
  );
}

export default function FeaturedSpotlight({ businesses = [] }) {
  const list = businesses.filter(Boolean);
  const total = list.length;
  const windows = Math.ceil(total / WINDOW_SIZE);

  // Defer hour calculation to client-side to avoid hydration mismatch
  const [hourlyWindowIndex, setHourlyWindowIndex] = useState(null);

  useEffect(() => {
    // Calculate hour only on client
    const hourKey = Math.floor(Date.now() / (1000 * 60 * 60));
    setHourlyWindowIndex(hourKey % windows);
  }, [windows]);

  const [windowIndex, setWindowIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // When hour changes → reset window & spotlight
  useEffect(() => {
    if (hourlyWindowIndex !== null) {
      setWindowIndex(hourlyWindowIndex);
      setSelectedIndex(0);
    }
  }, [hourlyWindowIndex]);

  // Build the current 6 window
  const ordered = useMemo(() => {
    return [...list].sort((a, b) => {
      const ad = a.created_date ? new Date(a.created_date).getTime() : 0;
      const bd = b.created_date ? new Date(b.created_date).getTime() : 0;
      return ad - bd;
    });
  }, [list]);

  const gridItems = useMemo(() => {
  if (!ordered.length) return [];

  const start = windowIndex * WINDOW_SIZE;
  const items = [];

  for (let i = 0; i < WINDOW_SIZE; i++) {
    const idx = (start + i) % ordered.length;
    items.push(ordered[idx]);
  }

  return items;
}, [ordered, windowIndex]);
  const currentActive = gridItems[selectedIndex] || gridItems[0];

  if (!total || hourlyWindowIndex === null) return null;

  return (
    <div className="space-y-5 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-6 lg:items-stretch">
      {/* Left: grid (desktop) */}
      <div className="hidden lg:block lg:col-span-7">
        <div className="grid sm:grid-cols-2 gap-4 h-full">
          {gridItems.map((b, i) => {
            const isActive = i === selectedIndex;
            return (
              <BusinessMiniCard
                key={b.id || b.business_handle}
                b={b}
                active={isActive}
                onSelect={() => {
                  setSelectedIndex(i);
                }}
              />
            );
          })}
        </div>

        {/* Window navigation */}
        {windows > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setWindowIndex((w) => (w - 1 + windows) % windows);
                setSelectedIndex(0);
              }}
              className="flex items-center gap-1 text-sm font-medium text-[#0d4f4f] hover:gap-2 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous 4
            </button>

            <button
              type="button"
              onClick={() => {
                setWindowIndex((w) => (w + 1) % windows);
                setSelectedIndex(0);
              }}
              className="flex items-center gap-1 text-sm font-medium text-[#0d4f4f] hover:gap-2 transition-all"
            >
              Next 4
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Spotlight */}
      <div className="lg:col-span-5">
        <div className="h-full flex flex-col">
          <div className="flex-1">
            <SpotlightPanel
              b={currentActive}
              index={selectedIndex}
              total={gridItems.length}
              onPrev={() => setSelectedIndex((i) => (i - 1 + gridItems.length) % gridItems.length)}
              onNext={() => setSelectedIndex((i) => (i + 1) % gridItems.length)}
            />
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 lg:hidden">
            {gridItems.map((item, i) => (
              <button
                key={item.id || item.business_handle || i}
                type="button"
                onClick={() => setSelectedIndex(i)}
                aria-label={`View spotlight ${i + 1} of ${gridItems.length}`}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full transition-all ${
                    i === selectedIndex ? "bg-[#c9a84c]" : "bg-[#0a1628]/20"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
