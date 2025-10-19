import React from "react";
import { anton } from "../fonts";
import Image from "next/image";

type BenefitItem = {
  iconSrc?: string;
  iconAlt?: string;
  description: string;
};

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
    "p-6 box-border bg-[#FFFBE7] border-[0.4px] border-[#959170] md:border-t-0 md:border-l-0 md:border-r-[0.4px] xl:border-r-0 rounded-lg md:rounded-none",
    // 1: top-right
    "p-6 box-border bg-[#FFFBE7] border-[0.4px] border-[#959170] md:border-t-0 xl:border-l-[0.4px] rounded-lg md:rounded-none",
    // 2: bottom-left
    "p-6 box-border bg-[#FFFBE7] border-[0.4px] border-[#959170] md:border-t-[0.4px] md:border-r-[0.4px] xl:border-r-0 rounded-lg md:rounded-none",
    // 3: bottom-right
    "p-6 box-border bg-[#FFFBE7] border-[0.4px] border-[#959170] md:border-t-[0.4px] xl:border-l-[0.4px] rounded-lg md:rounded-none",
  ] as const;

  return (
    // OUTER must match the curtain parent: 100dvh on mobile; 816px on xl
    <section className="w-full bg-[#FFFDF2] py-10 md:py-20 px-4 md:px-6">
      {/* keep padding inside, outer paints full-bleed */}
      <div className="h-full w-full flex items-center justify-center">
        {/* Content container with 1169px max-width as per Figma spec */}
        <div className="w-full max-w-[1169px]">
          <h1
            className={`${anton.className} font-normal text-4xl sm:text-5xl leading-[1.2] tracking-tighter uppercase text-[#222118]`}
          >
            {heading}
          </h1>

          <div className="mt-6 flex flex-col min-[1200px]:flex-row md:border-[0.4px] md:border-[#959170] md:rounded-lg md:overflow-hidden md:bg-[#FFFBE7] w-full">
            <div className="hidden md:block relative bg-gray-50 w-full min-[1200px]:w-[420px] min-[1200px]:flex-none">
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
              <div className="grid grid-cols-1 md:grid-cols-2 min-[1200px]:grid-rows-2 min-[1200px]:h-[395px] gap-3 md:gap-0">
                {cells.map((item, i) => (
                  <div key={i} className={`${borderByIndex[i]} min-w-0`}>
                    {item ? (
                      <div className="flex flex-row md:flex-col items-start gap-3 md:gap-0">
                        {item.iconSrc && (
                          <div className="md:mb-3 shrink-0">
                            <img
                              src={item.iconSrc}
                              alt={item.iconAlt || ""}
                              className="w-[23px] h-[23px] md:w-[33px] md:h-[33px] object-contain"
                            />
                          </div>
                        )}
                        <p className="font-medium text-base sm:text-lg leading-[1.5] tracking-tight text-[#1B1D1F]">
                          {item.description}
                        </p>
                      </div>
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
