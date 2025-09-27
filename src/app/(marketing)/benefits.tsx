// app/(marketing)/components/OurValues.tsx  (you can keep the file name or rename to BenefitsSection)
import React from "react";
import { anton } from "../fonts";

type BenefitItem = { title: string; description: string };

type BenefitsProps = {
  heading?: string; // ← NEW
  imageSrc?: string;
  imageAlt?: string;
  items?: BenefitItem[]; // up to 4
};

export default function Benefits({
  heading = "WITH SKINBESTIE, YOU GET", // ← default fallback
  imageSrc = "/why-skinbestie.jpg",
  imageAlt = "Placeholder",
  items = [],
}: BenefitsProps) {
  const cells: (BenefitItem | null)[] = Array.from(
    { length: 4 },
    (_, i) => items[i] ?? null
  );

  const borderByIndex = [
    "border-b lg:border-r lg:border-b border-[#959170] p-6",
    "border-b border-[#959170] p-6",
    "border-b lg:border-b-0 lg:border-r border-[#959170] p-6",
    "p-6",
  ] as const;

  return (
    <section className="min-h-screen bg-[#FFFDF2] flex items-center justify-center p-2">
      <div className="w-full max-w-7xl">
        <h1
          className={`${anton.className} font-normal text-5xl leading-[1.2] tracking-tighter uppercase text-[#222118]`}
        >
          {heading}
        </h1>

        <div className="mt-2 sm:mt-6 flex flex-col lg:flex-row border-[0.4px] border-[#959170] rounded-lg overflow-hidden">
          {/* Image */}
          <div className="relative bg-gray-50 w-full lg:w-[416px] lg:h-[395px] flex-shrink-0">
            <div className="aspect-[416/395] lg:aspect-auto lg:h-full">
              <img
                src={imageSrc}
                alt={imageAlt}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* 2×2 grid */}
          <div className="flex-1 flex flex-col lg:grid lg:grid-cols-2 lg:grid-rows-2 lg:h-[395px] bg-[#FFFBE7]">
            {cells.map((item, i) => (
              <div key={i} className={borderByIndex[i]}>
                {item ? (
                  <>
                    <h2
                      className={`${anton.className} font-normal text-[2rem] leading-[1.1] tracking-tighter uppercase text-[#222118]`}
                    >
                      {item.title}
                    </h2>
                    <p className="mt-4 font-medium text-lg leading-[1.5] tracking-tight text-[#1B1D1F]">
                      {item.description}
                    </p>
                  </>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
