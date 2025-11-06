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
  heading = "Our Values",
  imageSrc,
  imageAlt,
  items,
}: {
  heading?: string;
  imageSrc: string;
  imageAlt: string;
  items: ValuesItem[];
}) {
  return (
    <section className="w-full bg-skinbestie-landing-white border-b-[0.3px] border-[#959170]">
      <div className="w-full py-10 md:py-20 px-4 flex items-center justify-center">
        <div className="mx-auto max-w-3xl">
          {/* Values list */}
          <div className="flex flex-col items-center">
            <h1
              className={`${anton.className} text-center text-skinbestie-landing-green text-4xl sm:text-5xl leading-[1.1] tracking-[-0.02em] uppercase font-normal`}
            >
              {heading}
            </h1>

            <div className="pt-10 space-y-10">
              {items.map((v, i) => (
                <div key={`${v.title}-${i}`} className="flex items-start">
                  <div className="shrink-0 overflow-hidden flex justify-center pr-4">
                    {v.iconSrc ? (
                      <Image
                        src={v.iconSrc}
                        alt={v.iconAlt || v.title}
                        className="object-contain"
                        width={28}
                        height={28}
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
