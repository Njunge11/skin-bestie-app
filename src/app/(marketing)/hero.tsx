"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { anton } from "../fonts";

const HeroSection = () => {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background Image */}
      <Image
        src="/hero.jpg"
        alt="Hero background"
        fill
        priority
        className="object-cover object-[center_25%] sm:object-[center_35%] lg:object-center"
        sizes="100vw"
        quality={90}
      />

      {/* Content */}
      <div className="relative z-10 flex items-center h-full px-4 sm:px-6 lg:px-8 xl:max-w-7xl xl:mx-auto w-full">
        <div className="w-full max-w-full lg:mt-32">
          {/* Heading */}
          <h1
            className={`${anton.className} font-normal uppercase text-[2.5rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[6rem] leading-[110%] sm:leading-[120%] tracking-[-0.02em] text-skinbestie-landing-yellow`}
          >
            YOUR HONEST BESTIE
            <br />
            FOR BETTER HEALTHIER SKIN
          </h1>

          {/* Subheading */}
          <p className="mt-4 sm:mt-6 font-medium text-lg sm:text-xl lg:text-[1.25rem] leading-[150%] tracking-[-0.01em] text-skinbestie-landing-off-white max-w-full sm:max-w-[594px]">
            We collaborate with you to curate a simple routine that&apos;s
            tailored to your lifestyle, your budget, and your skin goals.
          </p>

          {/* CTA Button */}
          <Link
            href="/onboarding"
            className="mt-6 sm:mt-8 lg:mt-10 inline-flex items-center gap-2 font-semibold text-lg sm:text-[1.125rem] leading-[150%] tracking-[-0.01em] text-skinbestie-landing-cream bg-skinbestie-landing-blue border border-skinbestie-landing-blue rounded-xl py-4 px-6 sm:py-4 sm:px-6 transition-all duration-300 hover:opacity-90 group"
          >
            <span>Begin My Skin Journey</span>
            <ArrowRight className="w-5 h-5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
