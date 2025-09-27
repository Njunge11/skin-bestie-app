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
    <section className="w-full flex items-center justify-center bg-[#FFFBE7] p-6 md:py-20">
      <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Left: Image */}
        <div>
          <Image src={imageSrc} alt={imageAlt} width={464} height={399} />
        </div>

        {/* Right: Values list */}
        <div className="flex flex-col justify-center">
          <h1
            className={`${anton.className} text-[#222118] text-[3.5rem] leading-[1.1] tracking-[-0.02em] uppercase font-normal`}
          >
            Our Values
          </h1>

          <div className="pt-10 space-y-10">
            {items.map((v, i) => (
              <div key={`${v.title}-${i}`} className="flex items-start">
                {/* icon */}
                <div className="shrink-0 overflow-hidden flex justify-center pr-4">
                  {v.iconSrc ? (
                    <img
                      src={v.iconSrc}
                      alt={v.iconAlt || v.title}
                      className="object-contain"
                    />
                  ) : null}
                </div>

                {/* text */}
                <div className="pl">
                  <h3
                    className={`${anton.className} text-[#2A2E30] text-[1.75rem] leading-[1.2] tracking-[-0.02em] uppercase font-normal`}
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
    </section>
  );
}
