// app/(marketing)/pricing.tsx
import React from "react";
import Link from "next/link";
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
    <section
      id="pricing"
      className="bg-skinbestie-landing-white border-b-[0.3px] border-[#959170]"
    >
      <div className="mx-auto w-full px-4 md:px-6 py-10 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(300px,413px)_minmax(400px,656px)] gap-8 lg:gap-32 max-w-[1280px] mx-auto">
          {/* Left Column */}
          <div className="w-full">
            <h1
              className={`${anton.className} text-3xl sm:text-4xl lg:text-5xl font-normal text-skinbestie-landing-pink mb-4 sm:mb-6 uppercase leading-[1.2] tracking-[-0.02em]`}
            >
              {heading}
            </h1>
            <p className="font-medium text-base sm:text-lg lg:text-xl text-[#1B1D1F] leading-relaxed">
              {subheading}
            </p>
          </div>

          {/* Right Column */}
          <div className="w-full space-y-2">
            {/* Price Card */}
            <div className="bg-skinbestie-landing-gray rounded-lg pt-[1.125rem] pb-[1.125rem]">
              <h2
                className={`${anton.className} font-normal text-[3.5rem] leading-[1.1] tracking-[-0.02em] text-center uppercase text-skinbestie-landing-blue`}
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
                  className="box-border h-20 bg-skinbestie-landing-gray rounded-lg flex items-center border-[0.6px] border-[#C4BC8E] p-5"
                >
                  <span
                    className={`${anton.className} font-normal text-xl leading-[1.2] tracking-[-0.01em] uppercase text-[#2A2E30]`}
                  >
                    {b}
                  </span>
                </div>
              ))}
            </div>
            <Link
              href="/onboarding"
              className="flex w-full py-4.5 items-center justify-center gap-2.5
               rounded-xl border-2 border-skinbestie-landing-blue bg-skinbestie-landing-blue px-5"
            >
              <span className="font-medium text-white text-[18px] leading-[1.5] tracking-[-0.01em] whitespace-nowrap text-center">
                Begin My Skin Journey
              </span>
              <ArrowRight className="w-6 h-6 text-white" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
