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
    (_, i) => items[i] ?? null,
  );

  return (
    // OUTER must match the curtain parent: 100dvh on mobile; 816px on xl
    <section className="w-full bg-[#FFFDF4] py-10 md:py-20 px-4 md:px-6 border-b-[0.3px] border-[#959170]">
      {/* keep padding inside, outer paints full-bleed */}
      <div className="h-full w-full flex items-center justify-center">
        {/* Content container with 1169px max-width as per Figma spec */}
        <div className="w-full max-w-[1169px]">
          {/* <h1
            className={`${anton.className} font-normal text-4xl sm:text-5xl leading-[1.2] tracking-tighter uppercase text-[#222118]`}
          >
            {heading}
          </h1> */}

          <div className="mt-6 flex flex-col min-[1200px]:flex-row min-[1200px]:gap-[9px] w-full">
            <div className="hidden md:block relative bg-gray-50 w-full min-[1200px]:w-[440px] min-[1200px]:flex-none">
              <div className="relative w-full overflow-hidden h-[clamp(220px,60vw,506px)] min-[1200px]:h-[506px]">
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  sizes="(min-width:1200px) 440px, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="min-w-0 w-full flex flex-col min-[1200px]:flex-1">
              {/* Mobile: 1 column, md/lg: 2 columns, xl: 2x2 grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 min-[1200px]:grid-rows-2 min-[1200px]:h-[506px] gap-3 md:gap-[9px]">
                {cells.map((item, i) => (
                  <div
                    key={i}
                    className="px-[27px] py-[46px] bg-skinbestie-landing-gray rounded-tr-[0.6px] rounded-br-[0.6px] rounded-bl-[0.4px] rounded-tl-[0.4px] min-w-0"
                  >
                    {item ? (
                      <div className="flex flex-row md:flex-col items-start gap-3 md:gap-0">
                        {item.iconSrc && (
                          <div className="shrink-0 md:mb-6">
                            <Image
                              src={item.iconSrc}
                              alt={item.iconAlt || ""}
                              className="w-[23px] h-[23px] md:w-[30px] md:h-[30px] object-contain"
                              width={30}
                              height={30}
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
