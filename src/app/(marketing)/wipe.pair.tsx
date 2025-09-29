"use client";

import React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

/**
 * WipePair
 * Pins the FIRST panel so it feels fixed, while the SECOND panel scrolls up
 * from below and temporarily overlays the fixed header, then settles into flow.
 *
 * This matches your spec:
 *   - Panel A (Hero) appears stationary (pinned).
 *   - Panel B (Benefits) slides up from bottom and COVERs the header during the wipe.
 *   - No snap; native scroll drives the motion.
 *
 * Key details:
 *   - We pin ONLY the first panel (Hero).
 *   - The second panel (Benefits) is a normal sibling with z-index ABOVE the header.
 *   - Each panel is forced to at least 100svh so the pin feels like “fixed”.
 */
export default function WipePair({
  first, // Hero (covered)
  second, // Benefits (covering)
  headerZ = 50, // your header has z-50
  distanceVH = 100, // scroll distance to complete wipe (100 = one viewport)
  scrub = true, // or number (e.g., 0.5) for light smoothing
}: {
  first: React.ReactNode;
  second: React.ReactNode;
  headerZ?: number;
  distanceVH?: number;
  scrub?: boolean | number;
}) {
  const firstRef = React.useRef<HTMLElement | null>(null);
  const secondRef = React.useRef<HTMLElement | null>(null);

  React.useLayoutEffect(() => {
    const a = firstRef.current; // Hero
    const b = secondRef.current; // Benefits
    if (!a || !b) return;

    // Clean old inline styles (Fast Refresh safety)
    [a, b].forEach((el) => el.removeAttribute("style"));

    // Respect reduced motion: skip fancy stuff
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduce) return;

    // Ensure panels are full viewport and layered correctly:
    // Hero BELOW header; Benefits ABOVE header (so it can cover it during the wipe)
    Object.assign(a.style, {
      minHeight: "100svh",
      position: "relative",
      zIndex: String(Math.max(0, headerZ - 1)),
    });
    Object.assign(b.style, {
      minHeight: "100svh",
      position: "relative",
      zIndex: String(headerZ + 1),
      willChange: "transform",
    });

    // Start Benefits off-screen below
    gsap.set(b, { yPercent: 100 });

    // 1) Pin the HERO (feels fixed)
    const pin = ScrollTrigger.create({
      trigger: a,
      start: "top top",
      end: `+=${distanceVH}vh`, // keeps hero pinned for one viewport of scroll
      pin: true,
      pinSpacing: true, // add spacer so when pin ends, flow continues naturally
      pinType: "fixed", // ensures it behaves like fixed even if ancestors have transforms
      anticipatePin: 1,
      // markers: true,
    });

    // 2) Drive Benefits upward over the same distance
    const wipe = gsap.to(b, {
      yPercent: 0,
      ease: "none",
      scrollTrigger: {
        trigger: a,
        start: "top top",
        end: `+=${distanceVH}vh`,
        scrub,
        // markers: true,
      },
    });

    // Refresh after load to account for fonts/images
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      wipe.scrollTrigger?.kill();
      pin.kill();
      [a, b].forEach((el) => el.removeAttribute("style"));
    };
  }, [headerZ, distanceVH, scrub]);

  return (
    <>
      <section ref={firstRef} aria-label="wipe-first">
        {first}
      </section>
      <section ref={secondRef} aria-label="wipe-second">
        {second}
      </section>
    </>
  );
}
