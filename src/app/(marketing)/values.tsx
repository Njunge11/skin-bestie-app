import React from "react";
import { anton } from "../fonts";
import Image from "next/image";

type ValuesItem = {
  iconSrc: string;
  iconAlt: string;
  title: string;
  description: string;
};

export default function Values({
  imageSrc,
  imageAlt,
  items,
}: {
  imageSrc: string;
  imageAlt: string;
  items: ValuesItem[];
}) {
  return (
    // OUTER fills the scene height (100dvh from the wrapper). Keep solid bg.
    <section className="h-full w-full bg-[#FFFBE7] overflow-hidden">
      {/* Center the desktop composition into a 558px inner frame */}
      <div className="w-full h-full p-4 md:py-20 xl:flex xl:items-center xl:justify-center">
        <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 xl:items-center">
          {/* Left: Image */}
          <div className="flex justify-center">
            <Image src={imageSrc} alt={imageAlt} width={464} height={399} />
          </div>

          {/* Right: Values list */}
          <div className="flex flex-col justify-center md:items-center lg:items-stretch">
            <h1
              className={`${anton.className} text-center sm:text-left text-[#222118] text-4xl sm:text-5xl leading-[1.1] tracking-[-0.02em] uppercase font-normal`}
            >
              Our Values
            </h1>

            <div className="pt-10 space-y-10">
              {items.map((v, i) => (
                <div key={`${v.title}-${i}`} className="flex items-start">
                  <div className="shrink-0 overflow-hidden flex justify-center pr-4">
                    {v.iconSrc ? (
                      <img
                        src={v.iconSrc}
                        alt={v.iconAlt || v.title}
                        className="object-contain"
                      />
                    ) : null}
                  </div>
                  <div>
                    <h3
                      className={`${anton.className} text-[#2A2E30] text-2xl sm:text-3xl leading-[1.2] tracking-[-0.02em] uppercase font-normal`}
                    >
                      {v.title}
                    </h3>
                    <p className="mt-2 text-[#222527] text-lg leading-[1.5] tracking-[-0.01em] font-medium">
                      {v.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
