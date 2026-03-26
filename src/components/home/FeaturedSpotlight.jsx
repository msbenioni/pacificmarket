'use client';

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { getBannerUrl, getLogoUrl } from '@/utils/bannerUtils';
import { createPageUrl } from "@/utils";
import { CheckCircle, MapPin, Star, ChevronRight, ChevronLeft, Mail, Globe, Instagram, Facebook, Linkedin, Twitter, Youtube, Video, Speech } from "lucide-react";
import FlagIcon from "@/components/shared/FlagIcon";
import ContactModal from "@/components/profile/ContactModal";
import { getBusinessCulturalData } from "@/utils/businessCulturalHelpers";
import { getCountryDisplayName, getIndustryDisplayName, formatDisplayList } from "@/utils/displayHelpers";
import IdentityFlagRow from "@/components/shared/IdentityFlagRow";

const WINDOW_SIZE = 4;

function hourKeyUTC() {
  return Math.floor(Date.now() / (1000 * 60 * 60));
}

function clampText(s, max = 140) {
  if (!s) return "";
  const clean = String(s).replace(/\s+/g, " ").trim();
  return clean.length > max ? clean.slice(0, max - 1) + "…" : clean;
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
  // Temporarily disable flag system to isolate rendering issue
  // const culturalData = getBusinessCulturalData(b);
  
  console.log("[FeaturedSpotlight] business data", {
    business: b?.business_name,
    hasData: !!b,
    hasId: !!b?.id,
  });

  const languages = []; // formatDisplayList(culturalData.languagesDisplay, { max: 2 });
  const location = [b.city, getCountryDisplayName(b.country)].filter(Boolean).join(", ");
  const tagline = b.tagline || b.description || "";
  const industryLabel = getIndustryDisplayName(b.industry) || "Industry";
  const bannerUrl = getBannerUrl(b);

  return (
    <button
      type="button"
      onFocus={onSelect}
      onClick={onSelect}
      className={[
        "group w-full text-left rounded-[24px] border bg-white transition-all duration-300",
        "hover:-translate-y-0.5 hover:shadow-xl",
        "h-full flex flex-col",
        active
          ? "border-[#c9a84c]/70 shadow-lg ring-2 ring-[#c9a84c]/20"
          : "border-gray-200 shadow-sm",
      ].join(" ")}
    >
      {/* Banner */}
      <div className="relative w-full h-[160px] overflow-hidden rounded-t-[24px] bg-[#0d4f4f] flex-shrink-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d4f4f] to-[#1a6b6b]" />
        {bannerUrl && (
          <img
            src={bannerUrl}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: "center center" }}
          />
        )}
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5">
        {/* Logo overlap */}
        <div className="relative -mt-10 mb-4">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border-[3px] border-white bg-gradient-to-br from-[#0a1628] to-[#0d4f4f] shadow-xl">
            <img
              src={getLogoUrl(b)}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

        {/* Name + verification */}
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="flex-1 text-lg font-bold leading-tight text-[#0a1628]">
            {b.business_name}
          </h3>

          {(b.subscription_tier === "mana" || b.subscription_tier === "moana") && (
            <CheckCircle className="h-5 w-5 shrink-0 text-[#00c4cc]" />
          )}
        </div>

        {/* Tagline */}
        {tagline && (
          <p className="mb-4 line-clamp-2 text-sm font-medium leading-relaxed text-[#475569]">
            {tagline}
          </p>
        )}

        {/* Info stack */}
        <div className="mb-1 space-y-2">
          {location && (
            <div className="flex items-center gap-2 text-sm text-[#64748b]">
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="truncate">{location}</span>
            </div>
          )}

          {/* Temporarily disable flags */}
          {/*culturalData.culturalIdentitiesRaw.length > 0 && (
            <IdentityFlagRow
              identities={culturalData.culturalIdentitiesRaw}
              size={24}
              maxFlags={3}
              className="flex items-center gap-2"
            />
          )}*/}

          {languages && (
            <div className="flex items-center gap-2 text-sm font-medium text-[#00c4cc]">
              <Speech className="h-4 w-4 shrink-0" />
              <span className="truncate">{languages}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
          <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600">
            {industryLabel}
          </span>

          <div className="flex items-center gap-1 text-xs font-medium text-[#0d4f4f] opacity-0 transition-opacity group-hover:opacity-100">
            View profile
            <ChevronRight className="h-3 w-3" />
          </div>
        </div>
      </div>
    </button>
  );
}

function SpotlightPanel({ b, index, total, onPrev, onNext }) {
  const [showContact, setShowContact] = useState(false);
  const culturalData = getBusinessCulturalData(b);
  const socialLinks = getSocialLinks(b);
  const bannerUrl = getBannerUrl(b);

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
        <div className="relative w-full h-[160px] overflow-hidden bg-[#0a1628]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0d4f4f] to-[#0a1628]" />

          {bannerUrl ? (
            <img
              src={bannerUrl}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: "center center" }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-center px-4">
                <div className="font-bold text-lg mb-2">
                  {b?.business_name || "Business Name"}
                </div>
                <div className="text-sm opacity-80">
                  Pacific Discovery Network
                </div>
              </div>
            </div>
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
                  {b?.business_name}
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
                    {getIndustryDisplayName(b.industry)}
                  </span>
                )}
                {/* Temporarily disable flags */}
                {/*culturalData.culturalIdentitiesRaw.length > 0 && (
                  <IdentityFlagRow
                    identities={culturalData.culturalIdentitiesRaw}
                    size={24}
                    maxFlags={3}
                    className="inline-flex items-center gap-2"
                  />
                )}*/}
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
