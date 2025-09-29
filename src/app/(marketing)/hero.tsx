// "use client";

// import React from "react";
// import { ArrowRight } from "lucide-react";
// import { anton } from "../fonts";

// const HeroSection = () => {
//   return (
//     <div className="relative w-full h-screen min-h-[600px] max-h-[1080px] overflow-hidden">
//       {/* Background Image */}
//       <div
//         className="absolute inset-0 bg-cover bg-center bg-no-repeat"
//         style={{
//           backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/hero.jpg')`,
//         }}
//       >
//         {/* Optional: Add a subtle animation */}
//         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20"></div>
//       </div>

//       {/* Content Container */}
//       <div className="relative z-10 flex items-center h-full px-4 sm:px-6 lg:px-0 lg:pr-8 ">
//         <div className="text-left max-w-3xl w-full lg:w-auto lg:ml-[50%] lg:pr-8 xl:pr-12">
//           {/* Heading 1 */}
//           <h1
//             className={`${anton.className} font-normal uppercase text-[2.5rem] sm:text-[3.125rem] md:text-[3.75rem] leading-[120%] tracking-[-0.02em] text-[#F2EDC7]`}
//           >
//             YOUR HONEST <span className="text-[#FDE148]">BESTIE</span>
//           </h1>

//           {/* Heading 2 */}
//           <h2 className="font-['Anton'] font-normal uppercase text-[2.5rem] sm:text-[3.125rem] md:text-[3.75rem] leading-[120%] tracking-[-0.02em] text-[#F2EDC7]">
//             FOR BETTER HEALTHIER <span className="text-[#FDE148]">SKIN</span>
//           </h2>

//           {/* Subheading */}
//           <p className="mt-5 font-medium text-[1.125rem] sm:text-[1.25rem] leading-[150%] tracking-[-0.01em] text-[#FAFAFA] w-full max-w-[594px]">
//             We collaborate with you to curate a simple routine that's tailored
//             to your lifestyle, your budget, and your skin goals.
//           </p>

//           {/* CTA Button */}
//           <button className="mt-10 group inline-flex items-center gap-2 font-semibold text-[1rem] sm:text-[1.125rem] leading-[150%] tracking-[-0.01em] text-[#FDFAEB] border-[1.5px] border-[#FDFAEB] rounded-[0.75rem] pt-4 pr-6 pb-4 pl-6 bg-transparent transition-all duration-300 hover:opacity-90">
//             <span>Step Into Skin Bestie</span>
//             <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HeroSection;
"use client";
import React from "react";
import { ArrowRight } from "lucide-react";
import { anton } from "../fonts";

const HeroSection = () => {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/hero.jpg')",
        }}
      ></div>

      <div className="relative z-10 flex items-center h-full px-4 sm:px-6 lg:px-0 lg:pr-8">
        <div className="w-full max-w-3xl lg:ml-[50%] lg:pr-8 xl:pr-12">
          <h1
            className={`${anton.className} text-[#F2EDC7] uppercase font-normal
                          text-[2.5rem] sm:text-[3.125rem] md:text-[3.75rem] leading-[120%]`}
          >
            YOUR HONEST <span className="text-[#FDE148]">BESTIE</span>
          </h1>
          <h2
            className="font-['Anton'] text-[#F2EDC7] uppercase font-normal
                         text-[2.5rem] sm:text-[3.125rem] md:text-[3.75rem] leading-[120%]"
          >
            FOR BETTER HEALTHIER <span className="text-[#FDE148]">SKIN</span>
          </h2>
          <p className="mt-5 text-[#FAFAFA] font-medium text-[1.125rem] sm:text-[1.25rem] leading-[150%] max-w-[594px]">
            We collaborate with you to curate a simple routine that's tailored
            to your lifestyle, your budget, and your skin goals.
          </p>
          <button
            className="mt-10 w-auto self-start inline-flex shrink-0 items-center gap-2
                             font-semibold text-[1rem] sm:text-[1.125rem] leading-[150%]
                             text-[#FDFAEB] border-[1.5px] border-[#FDFAEB] rounded-[0.75rem]
                             py-4 px-6 bg-transparent transition-all hover:opacity-90"
          >
            <span>Step Into Skin Bestie</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default HeroSection;
