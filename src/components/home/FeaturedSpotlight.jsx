import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { createPageUrl } from "@/utils";
import { ChevronLeft, ChevronRight, CheckCircle, MapPin, Star } from "lucide-react";

const CARD_WIDTH = 240;
const CARD_GAP = 80;
const STEP = CARD_WIDTH + CARD_GAP;
const CENTER_SCALE = 1.18;
const SIDE_SCALE = 0.82;
const AUTO_SPEED = 0.4; // px per frame

function SpotlightCard({ business, distFromCenter }) {
  const abs = Math.abs(distFromCenter);
  const scale = abs < 0.5 ? CENTER_SCALE : abs < 1.5 ? CENTER_SCALE - (CENTER_SCALE - SIDE_SCALE) * abs : SIDE_SCALE;
  const opacity = abs > 2 ? 0 : abs > 1.5 ? 0.5 : abs < 0.5 ? 1 : 0.72;
  const isCenter = abs < 0.6;

  return (
    <div
      className="absolute top-1/2 transition-none"
      style={{
        width: `${CARD_WIDTH}px`,
        transform: `translateX(${distFromCenter * STEP}px) translateY(-50%) scale(${scale})`,
        opacity,
        zIndex: isCenter ? 10 : 1,
        pointerEvents: abs > 2.5 ? "none" : "auto",
        transition: "opacity 0.3s",
      }}
    >
      <Link
        href={createPageUrl("BusinessProfile") + `?handle=${business.handle || business.id}`}
        className="block"
      >
        <div className={`bg-white rounded-2xl overflow-hidden ${isCenter ? "shadow-2xl border-2 border-[#c9a84c]/60" : "shadow-md border border-gray-200"}`}>
          {/* Banner */}
          <div className="relative overflow-hidden" style={{ height: isCenter ? "120px" : "88px", transition: "height 0.4s" }}>
            <div className="absolute inset-0 bg-gradient-to-br from-[#0d4f4f] to-[#1a6b6b]" />
            {business.banner_url && (
              <img src={business.banner_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60" />
            )}
            {isCenter && (
              <div className="absolute top-3 left-3 flex items-center gap-1 bg-[#c9a84c]/90 text-[#0a1628] text-xs font-bold px-2 py-1 rounded-full">
                <Star className="w-3 h-3" /> Featured+
              </div>
            )}
          </div>

          <div className="px-4 pb-4">
            {/* Logo */}
            <div
              className="rounded-xl border-2 border-white shadow-md bg-gradient-to-br from-[#0a1628] to-[#0d4f4f] -mt-5 mb-3 overflow-hidden flex items-center justify-center relative z-10"
              style={{ width: "44px", height: "44px" }}
            >
              {business.logo_url
                ? <img src={business.logo_url} alt="" className="w-full h-full object-cover" />
                : <span className="text-white font-bold text-base">{business.name?.[0]}</span>}
            </div>

            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-bold text-[#0a1628] text-sm leading-tight">{business.name}</h3>
              {business.verified && <CheckCircle className="w-4 h-4 text-[#00c4cc] flex-shrink-0 mt-0.5" />}
            </div>

            <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
              <MapPin className="w-3 h-3" />
              <span>{business.city ? `${business.city}, ` : ""}{business.country}</span>
            </div>

            {isCenter && (
              <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">
                {business.short_description || business.description || "Pacific-owned enterprise in the Pacific Market Registry."}
              </p>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md">{business.category}</span>
              {business.cultural_identity && (
                <span className="text-xs text-[#0d4f4f] font-medium">{business.cultural_identity}</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function FeaturedSpotlight({ businesses }) {
  // offset in "card units" — 0 means first card is centered
  const offsetRef = useRef(0);
  const [offset, setOffset] = useState(0);
  const rafRef = useRef(null);
  const pausedRef = useRef(false);
  const n = businesses.length;

  const animate = useCallback(() => {
    if (!pausedRef.current) {
      offsetRef.current = (offsetRef.current + AUTO_SPEED / STEP) % n;
      setOffset(offsetRef.current);
    }
    rafRef.current = requestAnimationFrame(animate);
  }, [n]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate]);

  const skip = (dir) => {
    // snap to nearest whole card then jump
    const current = Math.round(offsetRef.current);
    offsetRef.current = ((current + dir) % n + n) % n;
    setOffset(offsetRef.current);
  };

  if (!businesses.length) return null;

  // How many cards to render: enough to fill container (-3 to +3)
  const slots = [-3, -2, -1, 0, 1, 2, 3];

  return (
    <div
      className="relative select-none"
      style={{ height: "400px" }}
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
    >
      {/* Cards container */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="relative w-full h-full" style={{ overflow: "visible" }}>
          {slots.map((slot) => {
            const fractional = offsetRef.current % 1;
            const base = Math.floor(offsetRef.current);
            const dist = slot - fractional;
            const idx = ((base + slot) % n + n) % n;
            const absDist = Math.abs(dist);
            // smooth cosine scale across full range from -3 to +3
            const scaleT = Math.max(0, Math.cos(Math.min(absDist, Math.PI / 2) / (Math.PI / 2) * (Math.PI / 2)));
            const scale = SIDE_SCALE + (CENTER_SCALE - SIDE_SCALE) * scaleT * scaleT;
            return (
              <div
                key={slot}
                className="absolute top-1/2"
                style={{
                  left: "50%",
                  width: `${CARD_WIDTH}px`,
                  marginLeft: `-${CARD_WIDTH / 2}px`,
                  transform: `translateX(${dist * STEP}px) translateY(-50%) scale(${scale})`,
                  opacity: absDist > 2.5 ? 0 : absDist > 2 ? (2.5 - absDist) / 0.5 : 1,
                  zIndex: absDist < 0.6 ? 10 : 1,
                  pointerEvents: absDist > 2.5 ? "none" : "auto",
                }}
              >
                <Link
                  href={createPageUrl("BusinessProfile") + `?handle=${businesses[idx].handle || businesses[idx].id}`}
                  className="block"
                >
                  {(() => {
                    const b = businesses[idx];
                    const isCenter = Math.abs(dist) < 0.6;
                    return (
                      <div className={`bg-white rounded-2xl overflow-hidden ${isCenter ? "shadow-2xl border-2 border-[#c9a84c]/60" : "shadow-md border border-gray-200"}`}>
                        <div className="relative overflow-hidden" style={{ height: isCenter ? "120px" : "88px" }}>
                          <div className="absolute inset-0 bg-gradient-to-br from-[#0d4f4f] to-[#1a6b6b]" />
                          {b.banner_url && <img src={b.banner_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60" />}
                          {isCenter && (
                            <div className="absolute top-3 left-3 flex items-center gap-1 bg-[#c9a84c]/90 text-[#0a1628] text-xs font-bold px-2 py-1 rounded-full">
                              <Star className="w-3 h-3" /> Featured+
                            </div>
                          )}
                        </div>
                        <div className="px-4 pb-4">
                          <div className="w-11 h-11 rounded-xl border-2 border-white shadow-md bg-gradient-to-br from-[#0a1628] to-[#0d4f4f] -mt-5 mb-3 overflow-hidden flex items-center justify-center relative z-10">
                            {b.logo_url ? <img src={b.logo_url} alt="" className="w-full h-full object-cover" /> : <span className="text-white font-bold text-base">{b.name?.[0]}</span>}
                          </div>
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-bold text-[#0a1628] text-sm leading-tight">{b.name}</h3>
                            {b.verified && <CheckCircle className="w-4 h-4 text-[#00c4cc] flex-shrink-0 mt-0.5" />}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
                            <MapPin className="w-3 h-3" />
                            <span>{b.city ? `${b.city}, ` : ""}{b.country}</span>
                          </div>
                          {isCenter && (
                            <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">
                              {b.short_description || b.description || "Pacific-owned enterprise in the Pacific Market Registry."}
                            </p>
                          )}
                          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md">{b.category}</span>
                            {b.cultural_identity && <span className="text-xs text-[#0d4f4f] font-medium">{b.cultural_identity}</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Left/Right fade masks */}
      <div className="absolute left-0 top-0 h-full w-32 pointer-events-none z-20" style={{ background: "linear-gradient(to right, #eef0f5 40%, transparent)" }} />
      <div className="absolute right-0 top-0 h-full w-32 pointer-events-none z-20" style={{ background: "linear-gradient(to left, #eef0f5 40%, transparent)" }} />

      {/* Chevrons */}
      <button
        onClick={() => skip(-1)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-[#0a1628] hover:bg-[#0a1628] hover:text-white transition-all"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => skip(1)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-[#0a1628] hover:bg-[#0a1628] hover:text-white transition-all"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-30">
        {businesses.map((_, i) => {
          const active = Math.round(offsetRef.current) % n === i;
          return (
            <button
              key={i}
              onClick={() => { offsetRef.current = i; setOffset(i); }}
              className={`rounded-full transition-all ${active ? "w-5 h-2 bg-[#c9a84c]" : "w-2 h-2 bg-gray-300"}`}
            />
          );
        })}
      </div>
    </div>
  );
}