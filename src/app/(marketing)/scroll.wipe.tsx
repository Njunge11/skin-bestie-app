"use client";

import React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type ScrollWipeProps = {
  /** Ordered panels to wipe through. For Benefits test: [<HeroSection/>, <Benefits/>] */
  panels: React.ReactNode[];
  /** The z-index of your fixed Header component (e.g., 50 for `z-50`). */
  headerZ?: number;
  /** How many viewport-heights of scroll should drive **each** wipe. Default: 1 (100%). */
  viewportPerPanel?: number;
  /** Scrub behavior; true to bind exactly to scroll, or a number for smoothing (e.g., 0.5). */
  scrub?: boolean | number;
  /** Keep spacing after pin so flow continues naturally. Usually true. */
  pinSpacing?: boolean;
  /** Optional className for the wrapper (doesn't affect the effect). */
  className?: string;
};

export default function ScrollWipe({
  panels,
  headerZ = 50, // match your <Header /> z-index; you can override per usage
  viewportPerPanel = 1,
  scrub = true,
  pinSpacing = true,
  className = "",
}: ScrollWipeProps) {
  const wrapRef = React.useRef<HTMLDivElement | null>(null);
  const panelRefs = React.useRef<HTMLElement[]>([]);

  React.useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const els = panelRefs.current.filter(Boolean);
    if (!wrap || els.length < 2) return; // need at least 2 panels to wipe

    // Respect reduced motion: if user prefers less motion, skip all pinning/anim.
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    // Clean stale inline styles (Fast Refresh safety)
    wrap.removeAttribute("style");
    els.forEach((el) => el.removeAttribute("style"));

    if (reduceMotion) return;

    // 1) Prepare wrapper: one viewport tall while pinned
    wrap.style.position = "relative";
    wrap.style.height = "100svh"; // small viewport height for mobile address bar quirks

    // 2) Stack panels in the same viewport, control z-index explicitly:
    //    - First panel (index 0) should be UNDER the header (so header is visible initially)
    //    - Next panel(s) should be ABOVE the header so they can wipe over it.
    els.forEach((el, i) => {
      el.style.position = "absolute";
      el.style.inset = "0";
      el.style.willChange = "transform";
      el.style.zIndex = String(
        i === 0 ? Math.max(0, headerZ - 1) : headerZ + 1
      );
    });

    // 3) Start every panel after the first below the viewport (ready to slide up)
    gsap.set(els.slice(1), { yPercent: 100 });

    // 4) Build timeline: each wipe consumes ~viewportPerPanel of scroll
    const totalDistance = (els.length - 1) * viewportPerPanel * 100; // percentage of viewport
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrap,
        start: "top top",
        end: `+=${totalDistance}%`,
        scrub, // standard GSAP pattern for scroll-driven animation
        pin: true, // pin the wrapper during the sequence
        pinSpacing, // keep space so flow resumes correctly after pin
        pinType: "fixed", // prefer fixed pinning so panels overlay the fixed header reliably
        // markers: true,      // uncomment for debugging
      },
      defaults: { ease: "none" },
    });

    // 5) For each subsequent panel, wipe it up to 0% (fully covering previous)
    for (let i = 1; i < els.length; i++) {
      tl.to(els[i], { yPercent: 0 }, "+=0");
    }

    // Cleanup on unmount / Fast Refresh
    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      els.forEach((el) => el.removeAttribute("style"));
      wrap.removeAttribute("style");
    };
  }, [headerZ, viewportPerPanel, scrub, pinSpacing, panels.length]);

  return (
    <div ref={wrapRef} className={className}>
      {panels.map((node, i) => (
        <section
          key={i}
          ref={(el) => {
            if (el) panelRefs.current[i] = el;
          }}
          aria-label={`wipe-panel-${i + 1}`}
        >
          {node}
        </section>
      ))}
    </div>
  );
}
