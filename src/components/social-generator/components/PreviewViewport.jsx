"use client";

import { useEffect, useRef, useState } from 'react';

/**
 * PreviewViewport — responsive scale-to-fit wrapper for slide previews.
 * 
 * Measures the available container width, calculates a uniform scale factor,
 * and creates a tight-fitting container that matches the scaled slide height.
 * Uses absolute positioning to prevent the unscaled slide from affecting layout.
 * 
 * The slide content is rendered at its true export dimensions (e.g. 1080×1080)
 * and only visually scaled via CSS transform for the in-app preview.
 * Export refs point at the unscaled content so exports remain pixel-perfect.
 * 
 * Props:
 *   slideWidth  — export width in px (default 1080)
 *   slideHeight — export height in px (1080 for square, 1350 for portrait)
 *   children    — the slide component rendered at export size
 *   className   — optional extra classes on the outer container
 */
export default function PreviewViewport({
  slideWidth = 1080,
  slideHeight = 1080,
  children,
  className = '',
}) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(0.4);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const computeScale = () => {
      const cw = container.getBoundingClientRect().width;
      if (cw === 0) return;

      // Scale based on available width with breathing room
      const padding = 24;
      const availW = cw - padding * 2;
      const newScale = Math.min(availW / slideWidth, 1);
      setScale(newScale);
    };

    computeScale();

    const observer = new ResizeObserver(computeScale);
    observer.observe(container);
    return () => observer.disconnect();
  }, [slideWidth, slideHeight]);

  // Container height = scaled slide height
  const scaledHeight = slideHeight * scale;

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-gray-100 rounded-lg border ${className}`}
      style={{
        width: '100%',
        height: scaledHeight,
      }}
    >
      {/* 
        Absolute positioned slide container:
        - Removed from document flow so it doesn't affect parent height
        - Centered with translate(-50%, -50%)
        - Scaled with transform for visual preview only
      */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: slideWidth,
          height: slideHeight,
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        {children}
      </div>
    </div>
  );
}
