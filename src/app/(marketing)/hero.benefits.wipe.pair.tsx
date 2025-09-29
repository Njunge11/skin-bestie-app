"use client";

import React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Pin the HERO while BENEFITS scrolls up from below and COVERS the fixed header.
 * This version:
 *  - Forces each panel to be 100svh tall
 *  - Uses TWO ScrollTriggers (pin + wipe) for reliability
 *  - Ensures Benefits sits above header via z-index
 *  - Works without any wrappers that could create stacking contexts
 */
export default function HeroBenefitsWipePair({
  hero,
  benefits,
  headerZ = 50, // your header is z-50
  distanceVH = 100, // scroll distance in vh for the wipe (100 = one viewport)
  scrub = true, // or a number like 0.5 for light smoothing
}: {
  hero: React.ReactNode;
  benefits: React.ReactNode;
  headerZ?: number;
  distanceVH?: number;
  scrub?: boolean | number;
}) {
  const heroRef = React.useRef<HTMLElement | null>(null);
  const beneRef = React.useRef<HTMLElement | null>(null);

  React.useLayoutEffect(() => {
    const heroEl = heroRef.current;
    const beneEl = beneRef.current;
    if (!heroEl || !beneEl) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    // Clean any old inline styles (Fast Refresh safety)
    [heroEl, beneEl].forEach((el) => el.removeAttribute("style"));

    // Ensure each panel is a full viewport tall (critical for pin to feel “fixed”)
    Object.assign(heroEl.style, {
      minHeight: "100svh",
      position: "relative",
      zIndex: String(Math.max(0, headerZ - 1)),
    });
    Object.assign(beneEl.style, {
      minHeight: "100svh",
      position: "relative",
      zIndex: String(headerZ + 1),
      willChange: "transform",
    });

    if (reduceMotion) return; // respect reduced motion: no pin/wipe, normal flow

    // Start Benefits below the viewport
    gsap.set(beneEl, { yPercent: 100 });

    // 1) Pin the HERO itself
    const pin = ScrollTrigger.create({
      id: "pin-hero",
      trigger: heroEl,
      start: "top top",
      end: `+=${distanceVH}vh`, // how long hero stays pinned
      pin: true,
      pinSpacing: true,
      pinType: "fixed", // keeps it truly fixed even if ancestors have transforms
      anticipatePin: 1, // reduces jump on start
      // markers: true,
    });

    // 2) Drive the BENEFITS wipe using the same scroll range
    const wipe = gsap.to(beneEl, {
      yPercent: 0,
      ease: "none",
      scrollTrigger: {
        id: "wipe-benefits",
        trigger: heroEl,
        start: "top top",
        end: `+=${distanceVH}vh`,
        scrub, // tie to scroll
        // markers: true,
      },
    });

    // Make sure ScrollTrigger recalculates after fonts/images load
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      wipe.scrollTrigger?.kill();
      pin.kill();
      [heroEl, beneEl].forEach((el) => el.removeAttribute("style"));
    };
  }, [headerZ, distanceVH, scrub]);

  return (
    <>
      <section ref={heroRef} aria-label="hero-panel">
        {hero}
      </section>
      <section ref={beneRef} aria-label="benefits-panel">
        {benefits}
      </section>
    </>
  );
}
