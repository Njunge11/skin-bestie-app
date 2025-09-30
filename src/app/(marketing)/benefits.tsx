// import React from "react";
// import { anton } from "../fonts";
// import Image from "next/image";

// type BenefitItem = { description: string };

// type BenefitsProps = {
//   heading?: string;
//   imageSrc?: string;
//   imageAlt?: string;
//   items?: BenefitItem[];
// };

// export default function Benefits({
//   heading = "WITH SKINBESTIE, YOU GET",
//   imageSrc = "/why-skinbestie.jpg",
//   imageAlt = "Placeholder",
//   items = [],
// }: BenefitsProps) {
//   const cells: (BenefitItem | null)[] = Array.from(
//     { length: 4 },
//     (_, i) => items[i] ?? null
//   );

//   const borderByIndex = [
//     // 0: top-left
//     "p-6 box-border border-[#959170]",
//     // 1: top-right
//     "p-6 box-border border-[#959170] border-t-[0.4px] lg:border-t-0 lg:border-l-[0.4px]",
//     // 2: bottom-left
//     "p-6 box-border border-[#959170] border-t-[0.4px] lg:border-t-[0.4px]",
//     // 3: bottom-right
//     "p-6 box-border border-[#959170] border-t-[0.4px] lg:border-t-[0.4px] lg:border-l-[0.4px]",
//   ] as const;

//   return (
//     // OUTER must match the curtain parent: 100dvh on mobile; 816px on xl
//     <section className="w-full bg-[#FFFDF2] xl:pt-20 xl:pb-28">
//       {/* keep padding inside, outer paints full-bleed */}
//       <div className="h-full w-full flex items-center justify-center">
//         {/* Content container with 1169px max-width as per Figma spec */}
//         <div className="w-full max-w-[1169px] px-4 sm:px-0 md:px-4 pb-4 sm:pb-0 md:pb-4">
//           <h1
//             className={`py-4 sm:py-0 md:py-4 ${anton.className} font-normal text-4xl sm:text-5xl leading-[1.2] tracking-tighter uppercase text-[#222118]`}
//           >
//             {heading}
//           </h1>

//           <div className="flex flex-col min-[1200px]:flex-row border-[0.4px] border-[#959170] rounded-lg overflow-hidden bg-[#FFFBE7] mt-0 sm:mt-6 md:mt-0 w-full">
//             <div className="relative bg-gray-50 w-full min-[1200px]:w-[420px] min-[1200px]:flex-none">
//               <div className="relative w-full overflow-hidden h-[clamp(220px,60vw,395px)] min-[1200px]:h-[395px]">
//                 <Image
//                   src={imageSrc}
//                   alt={imageAlt}
//                   fill
//                   sizes="(min-width:1200px) 420px, 100vw"
//                   className="object-cover"
//                 />
//               </div>
//             </div>
//             <div className="min-w-0 w-full flex flex-col min-[1200px]:flex-1 min-[1200px]:grid min-[1200px]:grid-cols-2 min-[1200px]:grid-rows-2 min-[1200px]:h-[395px]">
//               {cells.map((item, i) => (
//                 <div key={i} className={`${borderByIndex[i]} min-w-0`}>
//                   {item ? (
//                     <p className="mt-3 sm:mt-4 font-medium text-base sm:text-lg leading-[1.5] tracking-tight text-[#1B1D1F]">
//                       {item.description}
//                     </p>
//                   ) : null}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
import React from "react";
import { anton } from "../fonts";
import Image from "next/image";

type BenefitItem = { description: string };

type BenefitsProps = {
  heading?: string;
  imageSrc?: string;
  imageAlt?: string;
  items?: BenefitItem[];
};

export default function Benefits({
  heading = "WITH SKINBESTIE, YOU GET",
  imageSrc = "/why-skinbestie.jpg",
  imageAlt = "Placeholder",
  items = [],
}: BenefitsProps) {
  const cells: (BenefitItem | null)[] = Array.from(
    { length: 4 },
    (_, i) => items[i] ?? null
  );

  const borderByIndex = [
    // 0: top-left
    "p-6 box-border border-[#959170] border-t-0 border-l-0 md:border-r-[0.4px] xl:border-r-0",
    // 1: top-right
    "p-6 box-border border-[#959170] border-t-[0.4px] md:border-t-0 xl:border-l-[0.4px]",
    // 2: bottom-left
    "p-6 box-border border-[#959170] border-t-[0.4px] md:border-r-[0.4px] xl:border-r-0",
    // 3: bottom-right
    "p-6 box-border border-[#959170] border-t-[0.4px] xl:border-l-[0.4px]",
  ] as const;

  return (
    // OUTER must match the curtain parent: 100dvh on mobile; 816px on xl
    <section className="w-full bg-[#FFFDF2] py-10 md:py-20 xl:py-40 px-4 md:px-6">
      {/* keep padding inside, outer paints full-bleed */}
      <div className="h-full w-full flex items-center justify-center">
        {/* Content container with 1169px max-width as per Figma spec */}
        <div className="w-full max-w-[1169px]">
          <h1
            className={`${anton.className} font-normal text-4xl sm:text-5xl leading-[1.2] tracking-tighter uppercase text-[#222118]`}
          >
            {heading}
          </h1>

          <div className="mt-6 flex flex-col min-[1200px]:flex-row border-[0.4px] border-[#959170] rounded-lg overflow-hidden bg-[#FFFBE7] w-full">
            <div className="relative bg-gray-50 w-full min-[1200px]:w-[420px] min-[1200px]:flex-none">
              <div className="relative w-full overflow-hidden h-[clamp(220px,60vw,395px)] min-[1200px]:h-[395px]">
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  sizes="(min-width:1200px) 420px, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="min-w-0 w-full flex flex-col min-[1200px]:flex-1">
              {/* Mobile: 1 column, md/lg: 2 columns, xl: 2x2 grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 min-[1200px]:grid-rows-2 min-[1200px]:h-[395px]">
                {cells.map((item, i) => (
                  <div key={i} className={`${borderByIndex[i]} min-w-0`}>
                    {item ? (
                      <p className="mt-3 sm:mt-4 font-medium text-base sm:text-lg leading-[1.5] tracking-tight text-[#1B1D1F]">
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
