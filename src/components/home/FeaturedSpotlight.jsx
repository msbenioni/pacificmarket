'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { createPageUrl } from "@/utils";
import { CheckCircle, MapPin, Star, ChevronRight, ChevronLeft } from "lucide-react";
import FlagIcon from "@/components/shared/FlagIcon";

const WINDOW_SIZE = 6;

function hourKeyUTC() {
  return Math.floor(Date.now() / (1000 * 60 * 60));
}

function clampText(s, max = 140) {
  if (!s) return "";
  const clean = String(s).replace(/\s+/g, " ").trim();
  return clean.length > max ? clean.slice(0, max - 1) + "…" : clean;
}

function FeaturedBadge({ tier }) {
  if (tier === "featured_plus") {
    return (
      <div className="inline-flex items-center gap-1 rounded-full bg-[#c9a84c] text-[#0a1628] px-2.5 py-1 text-[11px] font-extrabold shadow-sm">
        <Star className="w-3.5 h-3.5" />
        Featured+
      </div>
    );
  } else if (tier === "verified") {
    return (
      <div className="inline-flex items-center gap-1 rounded-full bg-[#00c4cc] text-white px-2.5 py-1 text-[11px] font-extrabold shadow-sm">
        <CheckCircle className="w-3.5 h-3.5" />
        Verified
      </div>
    );
  }
  return null;
}

function BusinessMiniCard({ b, active, onSelect }) {
  const languages = b.languages_spoken?.length > 0
    ? b.languages_spoken.join(", ")
    : null;

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
      <div className="relative h-[84px] rounded-t-2xl overflow-hidden bg-[#0d4f4f] flex-shrink-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d4f4f] to-[#1a6b6b]" />

        {b.banner_url && (
          <img
            src={b.banner_url}
            alt=""
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: "center top" }}
          />
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        {/* Logo positioned to overlap banner without pushing content */}
        <div className="relative -mt-8 mb-3">
          <div className="w-16 h-16 rounded-2xl border-3 border-white shadow-lg overflow-hidden bg-gradient-to-br from-[#0a1628] to-[#0d4f4f] flex items-center justify-center">
            {b.logo_url ? (
              <img src={b.logo_url} alt="" className="w-full h-full object-cover" loading="lazy" />
            ) : (
              <img src="/pm_logo.png" alt="Pacific Market" className="w-full h-full object-cover" loading="lazy" />
            )}
          </div>
        </div>

        {/* Name and verification - moved below logo */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-extrabold text-[#0a1628] text-sm leading-tight">
            {b.name}
          </h3>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            {b.cultural_identity && <FlagIcon identity={b.cultural_identity} size={16} />}
            {b.verified && <CheckCircle className="w-4 h-4 text-[#00c4cc] shrink-0" />}
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-xs text-slate-500 mb-2">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">
            {b.city ? `${b.city}, ` : ""}{b.country}
          </span>
        </div>

        {/* Languages */}
        {languages && (
          <div className="text-xs text-slate-400 mb-2 flex items-center gap-1">
            <img src="/language_spoken.png" alt="Languages spoken" className="w-[36px] h-[36px]" /> {languages}
          </div>
        )}

        {/* Tagline - flex-grow to push footer down */}
        {b.short_description && (
          <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-3 flex-1">
            {b.short_description}
          </p>
        )}

        {/* Footer - always at bottom */}
        <div className="flex items-center justify-between gap-2 pt-3 border-t border-gray-100 mt-auto">
          <span className="text-[11px] text-slate-500 bg-slate-50 px-2 py-1 rounded-md truncate">
            {b.industry || "Industry"}
          </span>
        </div>
      </div>
    </button>
  );
}

function SpotlightPanel({ b, index, total, onPrev, onNext }) {
  // key forces clean fade/scale on change
  return (
    <div
      key={b?.id || b?.business_handle || index}
      className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#0a1628] h-full flex flex-col animate-fadeIn"
      style={{ transformOrigin: "center" }}
    >
      {/* Premium glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#00c4cc]/20 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-[#c9a84c]/15 blur-3xl" />

      {/* Banner */}
      <div className="relative h-[220px] sm:h-[260px] overflow-hidden bg-[#0a1628]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d4f4f] to-[#0a1628]" />

        {b?.banner_url && (
          <img
            src={b.banner_url}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: "center top" }}
          />
        )}

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
      </div>

      {/* Body */}
      <div className="p-6 sm:p-7 flex-1 flex flex-col">
        {/* Logo positioned on top of banner */}
        <div className="relative -mt-12 mb-4">
          <div className="w-20 h-20 rounded-3xl border-3 border-white/80 shadow-2xl overflow-hidden bg-gradient-to-br from-[#0a1628] to-[#0d4f4f] flex items-center justify-center">
            {b?.logo_url ? (
              <img src={b.logo_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <img src="/pm_logo.png" alt="Pacific Market" className="w-full h-full object-cover" />
            )}
          </div>
        </div>

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-white font-black text-xl sm:text-2xl leading-tight">
                {b?.name}
              </h3>
              {b?.verified && (
                <div className="inline-flex items-center gap-1 rounded-full bg-white/10 text-white px-3 py-1 text-xs font-bold border border-white/10">
                  <CheckCircle className="w-4 h-4 text-[#00c4cc]" />
                  Verified
                </div>
              )}
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-white/75">
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {b?.city ? `${b.city}, ` : ""}{b?.country}
              </span>
              {b?.industry && (
                <span className="text-xs bg-white/10 border border-white/10 px-2 py-1 rounded-lg">
                  {b.industry}
                </span>
              )}
              {b?.cultural_identity && (
                <span className="text-xs bg-[#00c4cc]/10 border border-[#00c4cc]/20 text-white px-2 py-1 rounded-lg">
                  {b.cultural_identity}
                </span>
              )}
            </div>

            {(b?.short_description || b?.description) && (
            <div className="mt-4 space-y-3 flex-1">
              {b?.short_description && (
                <p className="text-sm sm:text-[15px] leading-relaxed text-white/90 font-medium">
                  {b.short_description}
                </p>
              )}
              {b?.description && b?.description !== b?.short_description && (
                <p className="text-sm sm:text-[15px] leading-relaxed text-white/80">
                  {clampText(b.description, 300)}
                </p>
              )}
            </div>
          )}

          {!b?.short_description && !b?.description && (
            <p className="mt-4 text-sm sm:text-[15px] leading-relaxed text-white/80 flex-1">
              Featured Pacific-owned business in the Pacific Market Registry.
            </p>
          )}

            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <Link
                href={createPageUrl("BusinessProfile") + `?handle=${b?.business_handle || b?.id}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#c9a84c] hover:bg-[#b8973b] text-[#0a1628] font-extrabold px-5 py-3 transition-all"
              >
                View Profile <ChevronRight className="w-4 h-4" />
              </Link>

              <Link
                href={createPageUrl("Registry")}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 text-white hover:bg-white/10 font-semibold px-5 py-3 transition-all"
              >
                Explore Registry
              </Link>
            </div>
          </div>
        </div>

        {/* Subtle footer line */}
        <div className="mt-6 h-px w-full bg-gradient-to-r from-white/0 via-white/15 to-white/0" />
      </div>
    </div>
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
    <div className="grid lg:grid-cols-12 gap-6 items-stretch">
      {/* Left: grid */}
      <div className="lg:col-span-7">
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
              Previous 6
            </button>

            <button
              type="button"
              onClick={() => {
                setWindowIndex((w) => (w + 1) % windows);
                setSelectedIndex(0);
              }}
              className="flex items-center gap-1 text-sm font-medium text-[#0d4f4f] hover:gap-2 transition-all"
            >
              Next 6
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Mobile hint */}
        <div className="mt-3 text-xs text-slate-500 lg:hidden">
          Tap a card to preview the Featured+ spotlight.
        </div>
      </div>

      {/* Right: spotlight */}
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
        </div>
      </div>
    </div>
  );
}
