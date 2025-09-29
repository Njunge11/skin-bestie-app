// // app/(marketing)/ScrollEffectWrapper.tsx
// "use client";

// import React, { useRef, Children, isValidElement } from "react";
// import { motion, useScroll, useTransform } from "framer-motion";

// /** One pinned base + one curtain (exact 200vh scene) */
// function SingleCurtainScene({
//   base,
//   curtain,
// }: {
//   base: React.ReactNode;
//   curtain: React.ReactNode;
// }) {
//   const ref = useRef<HTMLDivElement>(null);
//   const { scrollYProgress } = useScroll({
//     target: ref,
//     offset: ["start start", "end end"],
//   });

//   // Curtain slides fully up over the second viewport
//   const y = useTransform(scrollYProgress, [0.0, 1.0], ["100%", "0%"]);

//   return (
//     <section ref={ref} className="relative h-[200vh]">
//       {/* Pinned base */}
//       <div className="sticky top-0 h-screen overflow-hidden">{base}</div>

//       {/* Curtain: must be exactly 100vh and fully opaque */}
//       <motion.div
//         className="pointer-events-none absolute inset-x-0 bottom-0 z-[60] h-screen will-change-transform"
//         style={{ y }}
//       >
//         {curtain}
//       </motion.div>
//     </section>
//   );
// }

// /** One pinned base + two curtains (exact 300vh scene) */
// function DoubleCurtainScene({
//   base,
//   curtain1,
//   curtain2,
// }: {
//   base: React.ReactNode;
//   curtain1: React.ReactNode;
//   curtain2: React.ReactNode;
// }) {
//   const ref = useRef<HTMLDivElement>(null);
//   const { scrollYProgress } = useScroll({
//     target: ref,
//     offset: ["start start", "end end"],
//   });

//   // 0.00 → 0.50 : curtain1 wipes
//   // 0.50 → 1.00 : curtain2 wipes
//   const y1 = useTransform(scrollYProgress, [0.0, 0.5], ["100%", "0%"]);
//   const y2 = useTransform(scrollYProgress, [0.5, 1.0], ["100%", "0%"]);

//   return (
//     <section ref={ref} className="relative h-[300vh]">
//       {/* Pinned base (Journey). Must be exactly 100vh */}
//       <div className="sticky top-0 h-screen overflow-hidden">{base}</div>

//       {/* Community wipes first */}
//       <motion.div
//         className="pointer-events-none absolute inset-0 z-[60] h-screen will-change-transform"
//         style={{ y: y1 }}
//       >
//         {curtain1}
//       </motion.div>

//       {/* Values wipes above Community, fully covering everything */}
//       <motion.div
//         className="pointer-events-none absolute inset-0 z-[70] h-screen will-change-transform"
//         style={{ y: y2 }}
//       >
//         {curtain2}
//       </motion.div>
//     </section>
//   );
// }

// export default function ScrollEffectWrapper({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const arr = Children.toArray(children).filter(isValidElement);

//   // Expected order:
//   // 0: HeroWithHeader
//   // 1: Benefits
//   // 2: Journey (pinned base for scene 2)
//   // 3: Community (curtain1)
//   // 4: Values (curtain2)
//   // 5+: Normal
//   if (arr.length < 5) return <>{children}</>;

//   const heroWithHeader = arr[0];
//   const benefits = arr[1];
//   const journey = arr[2];
//   const community = arr[3];
//   const values = arr[4];
//   const rest = arr.slice(5);

//   return (
//     <div className="relative">
//       <SingleCurtainScene base={heroWithHeader} curtain={benefits} />
//       <DoubleCurtainScene
//         base={<div className="h-full w-full">{journey}</div>}
//         curtain1={<div className="h-full w-full">{community}</div>}
//         curtain2={<div className="h-full w-full">{values}</div>}
//       />
//       {/* Normal flow */}
//       <div className="relative">
//         {rest.map((c, i) => (
//           <div key={i} className="relative">
//             {c}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
// app/(marketing)/ScrollEffectWrapper.tsx
// app/(marketing)/ScrollEffectWrapper.tsx
// app/(marketing)/ScrollEffectWrapper.tsx
// "use client";

// import React, { useRef, Children, isValidElement } from "react";
// import { motion, useScroll, useTransform } from "framer-motion";

// /** Generic single-curtain scene:
//  * base (pinned, 100dvh) → curtain (100dvh), over a SHORT scene (140dvh)
//  */
// function SingleCurtainScene({
//   base,
//   curtain,
// }: {
//   base: React.ReactNode;
//   curtain: React.ReactNode;
// }) {
//   const ref = useRef<HTMLDivElement>(null);
//   const { scrollYProgress } = useScroll({
//     target: ref,
//     offset: ["start start", "end end"],
//   });

//   // End a touch early + 1px overscan for a clean cover (no "push" feel)
//   const y = useTransform(scrollYProgress, [0, 0.98], ["100%", "0%"]);

//   return (
//     <section ref={ref} className="relative h-[140dvh]">
//       {/* Pinned base fills the viewport */}
//       <div className="sticky top-0 overflow-hidden h-[100dvh]">{base}</div>

//       {/* Curtain sits above, fills viewport, and slides up */}
//       <motion.div
//         className="absolute left-0 right-0 bottom-[-1px] z-[80] h-[100dvh] will-change-transform"
//         style={{ y }}
//       >
//         {curtain}
//       </motion.div>
//     </section>
//   );
// }

// /** Expected children order:
//  * 0: <HeroWithHeader/>        (pinned base for Scene A)
//  * 1: <OurStory/>              (curtain for Scene A)
//  * 2: <Benefits/>              (normal flow)
//  * 3: <Journey/>               (pinned base for Scene B)
//  * 4: <Testimonials/Community/>(curtain for Scene B)
//  * 5+: Values, Pricing, FAQs... (normal)
//  */
// export default function ScrollEffectWrapper({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const arr = Children.toArray(children).filter(isValidElement);

//   if (arr.length < 2) return <>{children}</>;

//   const heroWithHeader = arr[0];
//   const ourStory = arr[1];
//   const benefits = arr[2];
//   const journey = arr[3];
//   const community = arr[4];
//   const rest = arr.slice(5);

//   return (
//     <div className="relative">
//       {/* Scene A: Hero → OurStory */}
//       <SingleCurtainScene base={heroWithHeader} curtain={ourStory} />

//       {/* Normal flow: Benefits */}
//       {benefits && <div>{benefits}</div>}

//       {/* Scene B: Journey → Community */}
//       {journey && community ? (
//         <SingleCurtainScene base={journey} curtain={community} />
//       ) : journey ? (
//         <div>{journey}</div>
//       ) : null}

//       {/* Everything else normal */}
//       {rest.map((c, i) => (
//         <div key={i}>{c}</div>
//       ))}
//     </div>
//   );
// }
// app/(marketing)/ScrollEffectWrapper.tsx
// app/(marketing)/ScrollEffectWrapper.tsx
// app/(marketing)/ScrollEffectWrapper.tsx
// "use client";

// import React, { useRef, useEffect, Children, isValidElement } from "react";
// import { motion, useScroll, useTransform, useMotionValue } from "framer-motion";

// /* -------------------------
//    Tunables (feel controls)
//    ------------------------- */

// // Scene A: Hero → OurStory (snappy)
// const SCENE_A_DVH = 140;

// // Scene B1: Journey → Community (overlay slides in)
// const SCENE_B1_DVH = 140; // full single-scene window for Community

// // Scene B2: Community (held by overlay) → Values (curtain)
// const SCENE_B2_DVH = 140; // full single-scene window for Values

// /* -------------------------
//    Overlay that renders ONCE
//    ------------------------- */

// function CommunityOverlay({
//   y, // MotionValue<string> like "100%"→"0%"
//   children, // the actual Community JSX (rendered once)
// }: {
//   y: any;
//   children: React.ReactNode;
// }) {
//   return (
//     <motion.div
//       className="fixed inset-0 z-[80] pointer-events-none will-change-transform"
//       style={{ y }}
//     >
//       {/* pointer-events-auto lets internal links/carousels still work */}
//       <div className="h-screen w-screen overflow-hidden pointer-events-auto">
//         {children}
//       </div>
//     </motion.div>
//   );
// }

// /* -------------------------
//    Single-curtain (standard)
//    base (pinned 100dvh) → curtain (100dvh)
//    ------------------------- */

// function SingleCurtainScene({
//   base,
//   curtain,
//   sceneHeightDvh,
// }: {
//   base: React.ReactNode;
//   curtain: React.ReactNode;
//   sceneHeightDvh: number;
// }) {
//   const ref = useRef<HTMLDivElement>(null);
//   const { scrollYProgress } = useScroll({
//     target: ref,
//     offset: ["start start", "end end"],
//   });

//   // Full-length mapping (finish slightly early to avoid “push”)
//   const y = useTransform(scrollYProgress, [0.0, 0.98], ["100%", "0%"]);

//   return (
//     <section
//       ref={ref}
//       className="relative"
//       style={{ height: `${sceneHeightDvh}dvh` }}
//     >
//       <div className="sticky top-0 overflow-hidden h-[100dvh]">{base}</div>
//       <motion.div
//         className="absolute left-0 right-0 bottom-[-1px] z-[90] h-[100dvh] will-change-transform"
//         style={{ y }}
//       >
//         {curtain}
//       </motion.div>
//     </section>
//   );
// }

// /* -------------------------
//    Drive the overlay (no curtain render here):
//    - Pin the base (Journey)
//    - Map progress 0→0.98 to "100%"→"0%"
//    - Subscribe in useEffect and forward values to the shared overlay MotionValue
//    ------------------------- */
// function SingleCurtainDriveOverlay({
//   base,
//   sceneHeightDvh,
//   overlayY, // MotionValue<string> provided by parent
// }: {
//   base: React.ReactNode;
//   sceneHeightDvh: number;
//   overlayY: any;
// }) {
//   const ref = useRef<HTMLDivElement>(null);
//   const { scrollYProgress } = useScroll({
//     target: ref,
//     offset: ["start start", "end end"],
//   });

//   // Derive "100%" → "0%" like a normal curtain
//   const yDerived = useTransform(scrollYProgress, [0.0, 0.98], ["100%", "0%"]);

//   // IMPORTANT: subscribe in an effect; guard API for FM version differences
//   useEffect(() => {
//     let unsub: (() => void) | void;

//     // Prefer v10+: mv.on("change", cb)
//     if (typeof (yDerived as any).on === "function") {
//       unsub = (yDerived as any).on("change", (v: string) => overlayY.set(v));
//     } else if (typeof (yDerived as any).onChange === "function") {
//       // Legacy: mv.onChange(cb)
//       unsub = (yDerived as any).onChange((v: string) => overlayY.set(v));
//     }

//     return () => {
//       if (typeof unsub === "function") unsub();
//     };
//   }, [yDerived, overlayY]);

//   return (
//     <section
//       ref={ref}
//       className="relative"
//       style={{ height: `${sceneHeightDvh}dvh` }}
//     >
//       <div className="sticky top-0 overflow-hidden h-[100dvh]">{base}</div>
//       {/* No curtain element here; the overlay is our curtain */}
//     </section>
//   );
// }

// /* -------------------------
//    Orchestration (no Community duplication)
//    Children order:
//    0: HeroWithHeader
//    1: OurStory
//    2: Benefits
//    3: Journey
//    4: Community      (rendered ONCE in the overlay)
//    5: Values
//    6+: Pricing/FAQs...
//    ------------------------- */

// export default function ScrollEffectWrapper({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const arr = Children.toArray(children).filter(isValidElement);
//   if (arr.length < 2) return <>{children}</>;

//   const heroWithHeader = arr[0];
//   const ourStory = arr[1];
//   const benefits = arr[2];
//   const journey = arr[3];
//   const community = arr[4];
//   const values = arr[5];
//   const rest = arr.slice(6);

//   // Shared MotionValue: string percentages (Framer supports unit strings for transforms)
//   const communityY = useMotionValue<string>("100%");

//   return (
//     <div className="relative">
//       {/* One Community instance, living in a fixed overlay across both scenes */}
//       {community ? (
//         <CommunityOverlay y={communityY}>{community}</CommunityOverlay>
//       ) : null}

//       {/* Scene A: Hero → OurStory */}
//       <SingleCurtainScene
//         base={heroWithHeader}
//         curtain={ourStory}
//         sceneHeightDvh={SCENE_A_DVH}
//       />

//       {/* Normal flow: Benefits */}
//       {benefits && <div>{benefits}</div>}

//       {/* Scene B1: Journey → (overlay drives Community in) */}
//       {journey && community ? (
//         <SingleCurtainDriveOverlay
//           base={journey}
//           sceneHeightDvh={SCENE_B1_DVH}
//           overlayY={communityY}
//         />
//       ) : journey ? (
//         <div>{journey}</div>
//       ) : null}

//       {/* Scene B2: (overlay holds Community) → Values (curtain) */}
//       {values ? (
//         <SingleCurtainScene
//           // Base proxy with same solid bg as Community so there’s never a transparent gap
//           base={<div className="h-full w-full bg-[#13110F]" />}
//           curtain={values}
//           sceneHeightDvh={SCENE_B2_DVH}
//         />
//       ) : null}

//       {/* Everything else normal */}
//       {rest.map((c, i) => (
//         <div key={i}>{c}</div>
//       ))}
//     </div>
//   );
// }

"use client";

import React, { useRef, Children, isValidElement } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* Tunables: make scenes short so each wipe feels snappy and consistent */
const SCENE_A_HEIGHT_DVH = 140; // Hero → OurStory
const SCENE_B_HEIGHT_DVH = 280; // Journey → Community → Values (combined)

/* Single-curtain scene: base (pinned 100dvh) → curtain (100dvh) over a short scene */
function SingleCurtainScene({
  base,
  curtain,
  sceneHeightDvh,
}: {
  base: React.ReactNode;
  curtain: React.ReactNode;
  sceneHeightDvh: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Full-length mapping like your Hero→OurStory: finishes a touch early to avoid "push"
  const y = useTransform(scrollYProgress, [0.0, 0.98], ["100%", "0%"]);

  return (
    <section
      ref={ref}
      className="relative"
      style={{ height: `${sceneHeightDvh}dvh` }}
    >
      {/* Pinned base fills viewport */}
      <div className="sticky top-0 overflow-hidden h-[100dvh]">{base}</div>

      {/* Curtain slides up and fully covers base */}
      <motion.div
        className="absolute left-0 right-0 bottom-[-1px] z-[80] h-[100dvh] will-change-transform"
        style={{ y }}
      >
        {curtain}
      </motion.div>
    </section>
  );
}

/* Triple panel scene with sticky positioning */
/* Triple panel scene: Journey pinned, Community/Values as absolute curtains */
/* Triple panel scene: Journey pinned, Community/Values slide up over it */
function TriplePanelScene({
  panel1, // Journey (base)
  panel2, // Community (curtain 1)
  panel3, // Values (curtain 2)
  totalHeightDvh,
}: {
  panel1: React.ReactNode;
  panel2: React.ReactNode;
  panel3: React.ReactNode;
  totalHeightDvh: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  /** Community: arrive early, then HOLD */
  const COMMUNITY_START = 0.0;
  const COMMUNITY_END = 0.35; // finishes fully by 35%
  const communityY = useTransform(
    scrollYProgress,
    [COMMUNITY_START, COMMUNITY_END],
    ["100%", "0%"] // clamps outside range → holds at "0%"
  );

  /** Hard gap where nothing happens (Community fully on screen) */
  const GAP_AFTER_COMMUNITY_END = 0.75; // Values will not start before this

  /** Values: start late, long runway, with fade-in right at start */
  const VALUES_START = GAP_AFTER_COMMUNITY_END; // 0.75
  const VALUES_FINISH = 0.98;

  const valuesY = useTransform(
    scrollYProgress,
    [VALUES_START, VALUES_FINISH],
    ["100%", "0%"]
  );

  // Fade-in so Values doesn’t appear until the actual start window
  const valuesOpacity = useTransform(
    scrollYProgress,
    [VALUES_START - 0.02, VALUES_START], // small pre-roll → at-start
    [0, 1]
  );

  return (
    <section
      ref={ref}
      className="relative"
      style={{ height: `${totalHeightDvh}dvh` }}
    >
      {/* ONLY the base is sticky */}
      <div className="sticky top-0 h-[100dvh] overflow-hidden z-0">
        {panel1}
      </div>

      {/* Community: absolute curtain layer; finishes EARLY and holds */}
      <motion.div
        className="absolute left-0 right-0 bottom-[-1px] h-[100dvh] z-10 will-change-transform"
        style={{ y: communityY }}
      >
        {panel2}
      </motion.div>

      {/* Values: absolute curtain; starts LATE, long runway, fades in */}
      <motion.div
        className="absolute left-0 right-0 bottom-[-1px] h-[100dvh] z-20 will-change-transform"
        style={{ y: valuesY, opacity: valuesOpacity }}
      >
        {panel3}
      </motion.div>
    </section>
  );
}

/**
 * Children order:
 * 0: <HeroWithHeader/>          (Scene A base)
 * 1: <OurStory/>                (Scene A curtain)
 * 2: <Benefits/>                (normal)
 * 3: <Journey/>                 (Scene B panel 1)
 * 4: <Community/>               (Scene B panel 2)
 * 5: <Values/>                  (Scene B panel 3)
 * 6+: <Pricing/FAQs/...>        (normal)
 */
export default function ScrollEffectWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const arr = Children.toArray(children).filter(isValidElement);

  if (arr.length < 2) return <>{children}</>;

  const heroWithHeader = arr[0];
  const ourStory = arr[1];

  const benefits = arr[2];
  const journey = arr[3];
  const community = arr[4];
  const values = arr[5];

  const rest = arr.slice(6);

  return (
    <div className="relative">
      {/* Scene A: Hero → OurStory */}
      <SingleCurtainScene
        base={heroWithHeader}
        curtain={ourStory}
        sceneHeightDvh={SCENE_A_HEIGHT_DVH}
      />

      {/* Normal flow: Benefits */}
      {benefits && <div>{benefits}</div>}

      {/* Scene B: Journey → Community → Values */}
      {journey && community && values ? (
        <TriplePanelScene
          panel1={journey}
          panel2={community}
          panel3={values}
          totalHeightDvh={SCENE_B_HEIGHT_DVH}
        />
      ) : journey && community ? (
        // Fallback: just Journey → Community if no Values
        <SingleCurtainScene
          base={journey}
          curtain={community}
          sceneHeightDvh={140}
        />
      ) : journey ? (
        // Fallback: just Journey if no Community
        <div>{journey}</div>
      ) : null}

      {/* Everything else normal */}
      {rest.map((c, i) => (
        <div key={i}>{c}</div>
      ))}
    </div>
  );
}
