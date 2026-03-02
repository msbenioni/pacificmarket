"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useAnimationFrame,
  useReducedMotion,
} from "framer-motion";
import { ChevronLeft, ChevronRight, CheckCircle, MapPin, Star } from "lucide-react";
import { createPageUrl } from "@/utils";

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function mod(n, m) {
  return ((n % m) + m) % m;
}

export default function FeaturedSpotlight({ businesses }) {
  const n = businesses?.length || 0;
  const reduceMotion = useReducedMotion();
  const CARD_W = 480;
  const GAP = 56;
  const STEP = CARD_W + GAP;
  const SPEED = 48;
  const [containerW, setContainerW] = useState(1200);
  const wrapRef = useRef(null);
  const x = useMotionValue(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    if (!wrapRef.current) return;

    const el = wrapRef.current;
    const ro = new ResizeObserver(() => {
      setContainerW(el.clientWidth || 1200);
    });
    ro.observe(el);
    setContainerW(el.clientWidth || 1200);

    return () => ro.disconnect();
  }, []);

  const loopItems = useMemo(() => {
    if (!n) return [];
    const copies = n < 6 ? 4 : 3;
    const out = [];
    for (let c = 0; c < copies; c++) {
      for (let i = 0; i < n; i++) {
        out.push({ ...businesses[i], __k: `${c}-${businesses[i].id || i}` });
      }
    }
    return out;
  }, [businesses, n]);

  const total = loopItems.length;
  const trackLen = total * STEP;

  useAnimationFrame((t, delta) => {
    if (!n || reduceMotion) return;
    if (pausedRef.current) return;

    const dt = delta / 1000;
    const next = x.get() - SPEED * dt;
    const wrapped = -mod(-next, trackLen);
    x.set(wrapped);
  });

  if (!n) return null;

  const centerX = containerW / 2;

  const focusStyle = (cardLeftPx) => {
    const cardCenter = cardLeftPx + CARD_W / 2;
    const dist = Math.abs(cardCenter - centerX);
    const maxDist = STEP * 2.2;
    const t = clamp(dist / maxDist, 0, 1);
    const ease = 1 - (1 - t) * (1 - t);

    const scale = 1.08 - 0.22 * ease;
    const opacity = 1 - 0.45 * ease;
    // No blur
    const y = -10 + 18 * ease;

    return { scale, opacity, y };
  };

  const nudge = (dir) => {
    const next = x.get() + dir * STEP;
    const wrapped = -mod(-next, trackLen);
    x.set(wrapped);
  };

  return (
    <div className="relative select-none">
      <div
        ref={wrapRef}
        className="relative min-h-[400px] overflow-hidden"
        onMouseEnter={() => (pausedRef.current = true)}
        onMouseLeave={() => (pausedRef.current = false)}
      >

        <motion.div
          className="absolute left-1/2 top-1/2"
          style={{
            x,
            y: "-50%",
            translateX: "-50%",
            display: "flex",
            gap: `${GAP}px`,
            willChange: "transform",
            transformOrigin: "center",
          }}
        >
          {loopItems.map((business, i) => {
            const cardLeft = i * STEP + x.get();
            const { scale, opacity, y } = focusStyle(cardLeft);
            const isCenter = scale > 1.01;
            const key = business.__k || `${i}`;

            return (
              <motion.div
                key={key}
                style={{
                  width: `${CARD_W}px`,
                  opacity,
                  transform: `translate3d(0, ${y}px, 0) scale(${scale})`,
                  willChange: "transform, opacity",
                }}
              >
                <SpotlightCard business={business} isCenter={isCenter} />
              </motion.div>
            );
          })}
        </motion.div>

        <button
          onClick={() => nudge(1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-[#0a1628] hover:bg-[#0a1628] hover:text-white transition-all"
          aria-label="Previous"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => nudge(-1)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-[#0a1628] hover:bg-[#0a1628] hover:text-white transition-all"
          aria-label="Next"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function SpotlightCard({ business, isCenter }) {
  return (
    <Link
      href={createPageUrl("BusinessProfile") + `?handle=${business.handle || business.id}`}
      className="block"
    >
      <div
        className={[
          "bg-white rounded-3xl overflow-hidden border",
          isCenter
            ? "shadow-[0_28px_70px_rgba(10,22,40,0.18)] border-[#c9a84c]/60"
            : "shadow-[0_12px_34px_rgba(10,22,40,0.10)] border-gray-200",
        ].join(" ")}
      >
        <div className="relative overflow-hidden">
          {business.banner_url && (
            <img
              src={business.banner_url}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          <div className="relative">
            <div className={isCenter ? "h-[160px]" : "h-[120px]"} />
            {isCenter && (
              <div className="absolute top-4 left-4 inline-flex items-center gap-1 bg-[#c9a84c]/95 text-[#0a1628] text-xs font-bold px-3 py-1.5 rounded-full">
                <Star className="w-3.5 h-3.5" /> Featured+
              </div>
            )}
          </div>
        </div>

        <div className="px-6 pb-6">
          <div className="-mt-6 mb-4 w-14 h-14 rounded-2xl border-2 border-white shadow-md bg-gradient-to-br from-[#0a1628] to-[#0d4f4f] overflow-hidden flex items-center justify-center">
            {business.logo_url ? (
              <img src={business.logo_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white font-bold text-lg">{business.name?.[0]}</span>
            )}
          </div>

          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-extrabold text-[#0a1628] leading-tight text-base">
              {business.name}
            </h3>
            {business.verified && (
              <CheckCircle className="w-5 h-5 text-[#00c4cc] flex-shrink-0 mt-0.5" />
            )}
          </div>

          <div className="flex items-center gap-1 text-sm text-slate-500 mb-3">
            <MapPin className="w-4 h-4" />
            <span>{business.city ? `${business.city}, ` : ""}{business.country}</span>
          </div>

          {isCenter && (
            <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 mb-4">
              {business.short_description || business.description || "Pacific-owned enterprise in the Pacific Market Registry."}
            </p>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <span className="text-xs text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md">
              {business.category}
            </span>
            {business.cultural_identity && (
              <span className="text-xs text-[#0d4f4f] font-semibold">
                {business.cultural_identity}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}