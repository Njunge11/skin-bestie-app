// app/(marketing)/pricing.tsx
import React from "react";
import { anton } from "../fonts";
import LButton from "./LButton";

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
      <div className="max-w-6xl mx-auto w-full sm:pb-28">
        <div className="grid lg:grid-cols-2 lg:gap-12 items-start">
          {/* Left Column */}
          <div className="space-y-6 p-6 sm:pt-[10.438rem]">
            <div>
              <h1
                className={`${anton.className} text-5xl font-normal text-[#222118] mb-6 uppercase leading-[1.2] tracking-[-0.02em] w-full max-w-[333px]`}
              >
                {heading}
              </h1>
              <p className="text-lg sm:text-xl text-gray-700 leading-relaxed w-full max-w-[410px]">
                {subheading}
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-2 p-2 sm:pt-28">
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
                  className="box-border h-20  bg-[#F3ECC7] rounded-lg flex items-center border-[0.6px] border-[#C4BC8E] p-5"
                >
                  <span
                    className={`${anton.className} font-normal text-[1.375rem] leading-[1.2] tracking-[-0.01em] uppercase text-[#2A2E30]`}
                  >
                    {b}
                  </span>
                </div>
              ))}
            </div>

            <LButton className="mt-5" />
          </div>
        </div>
      </div>
    </div>
  );
}
