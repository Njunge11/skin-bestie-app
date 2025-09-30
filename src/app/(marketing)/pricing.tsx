// app/(marketing)/pricing.tsx
import React from "react";
import { anton } from "../fonts";
import { ArrowRight } from "lucide-react";

export default function Pricing({
  heading,
  subheading,
  priceHeadline,
  priceSub,
  benefits,
}: {
  heading: string;
  subheading: string;
  priceHeadline: string;
  priceSub: string;
  benefits: string[];
}) {
  return (
    <div className="bg-[#FFFDF2]">
      <div className="max-w-6xl mx-auto w-full pb-10 md:pb-20 lg:pb-28">
        <div className="grid lg:grid-cols-2 lg:gap-12 items-start">
          {/* Left Column */}
          <div className="space-y-6 flex lg:justify-center px-4 pt-10 md:pt-20 lg:pt-44">
            <div>
              <h1
                className={`${anton.className} text-center lg:text-left text-4xl sm:text-5xl font-normal text-[#222118] uppercase leading-[1.2] tracking-[-0.02em] w-full lg:max-w-[333px]`}
              >
                {heading}
              </h1>
              <p className="text-center mt-2 px-1 lg:text-left text-lg sm:text-xl text-gray-700 leading-relaxed w-full lg:max-w-[410px]">
                {subheading}
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-2 px-4 pt-6 md:pt-10 lg:pt-28">
            {/* Price Card */}
            <div className="bg-[#FAFAFA] border-[0.7px] border-[#000000] rounded-lg pt-[1.125rem] pb-[1.125rem]">
              <h2
                className={`${anton.className} font-normal text-[3.5rem] leading-[1.1] tracking-[-0.02em] text-center uppercase text-[#342F17]`}
              >
                {priceHeadline}
              </h2>
              <p className="font-medium text-xl leading-[1.5] tracking-[-0.01em] text-center text-[#2F2828]">
                {priceSub}
              </p>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-stretch">
              {benefits.map((b, i) => (
                <div
                  key={`${b}-${i}`}
                  className="box-border h-20 bg-[#F3ECC7] rounded-lg flex items-center border-[0.6px] border-[#C4BC8E] p-5"
                >
                  <span
                    className={`${anton.className} font-normal text-[1.375rem] leading-[1.2] tracking-[-0.01em] uppercase text-[#2A2E30]`}
                  >
                    {b}
                  </span>
                </div>
              ))}
            </div>
            <a
              href="#"
              className="flex w-full py-4.5 items-center justify-center gap-2.5
               rounded-xl border-2 border-white bg-black px-5"
            >
              <span className="font-medium text-white text-[18px] leading-[1.5] tracking-[-0.01em] whitespace-nowrap text-center">
                Begin My SkinBestie Journey
              </span>
              <ArrowRight className="w-6 h-6 text-white" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
