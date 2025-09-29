// // app/(marketing)/HeroWithHeader.tsx
// "use client";
// import Header from "./header";
// import HeroSection from "./hero";

// export default function HeroWithHeader() {
//   return (
//     <div className="relative h-screen w-full overflow-hidden">
//       {/* Header is inside the scene so it can be covered by Benefits */}
//       <div className="absolute inset-x-0 top-0 z-10">
//         <Header />
//       </div>

//       {/* Hero sits below header */}
//       <div className="relative z-0 h-full">
//         <HeroSection />
//       </div>
//     </div>
//   );
// }
"use client";
import Header from "./header";
import HeroSection from "./hero";

export default function HeroWithHeader() {
  return (
    // Base is a full viewport canvas for the wipe
    <div className="relative h-[100dvh] w-full overflow-hidden">
      {/* Header is INSIDE the scene so the curtain can cover it */}
      <div className="absolute inset-x-0 top-0 z-10">
        <Header />
      </div>

      {/* Hero fills the base */}
      <div className="relative z-0 h-full">
        <HeroSection />
      </div>
    </div>
  );
}
