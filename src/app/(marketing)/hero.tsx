"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { anton } from "../fonts";

const HeroSection = () => {
  return (
    <div className="relative w-full h-[600px] xl:h-screen overflow-hidden pt-6">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/hero.jpg')`,
        }}
      ></div>

      {/* Gradient Overlay - Mobile */}
      <div
        className="absolute inset-0 lg:hidden"
        style={{
          background: 'linear-gradient(18.93deg, rgba(245, 67, 61, 0.15) 16.65%, rgba(0, 0, 0, 0.5) 38.77%, rgba(0, 0, 0, 0.5) 50.4%, rgba(0, 0, 0, 0.5) 65.39%, rgba(245, 67, 61, 0.05) 80.55%)',
        }}
      ></div>

      {/* Gradient Overlay - Desktop */}
      <div
        className="absolute inset-0 hidden lg:block"
        style={{
          background: 'linear-gradient(264.19deg, rgba(0, 0, 0, 0.6) 38.02%, rgba(245, 67, 61, 0.12) 96.07%)',
        }}
      ></div>

      {/* Content Container */}
      <div className="relative z-10 flex items-center h-full px-4 sm:px-6 lg:px-0 lg:pr-8 ">
        <div className="text-left max-w-3xl w-full lg:w-auto lg:ml-[50%] lg:pr-8 xl:pr-12">
          {/* Heading 1 */}
          <h1
            className={`${anton.className} font-normal uppercase text-[2.5rem] sm:text-[3.125rem] md:text-[3.75rem] leading-[120%] tracking-[-0.02em] text-[#F2EDC7]`}
          >
            YOUR HONEST <span className="text-[#FDE148]">BESTIE</span>
          </h1>

          {/* Heading 2 */}
          <h2 className="font-['Anton'] font-normal uppercase text-[2.5rem] sm:text-[3.125rem] md:text-[3.75rem] leading-[120%] tracking-[-0.02em] text-[#F2EDC7]">
            FOR BETTER HEALTHIER <span className="text-[#FDE148]">SKIN</span>
          </h2>

          {/* Subheading */}
          <p className="mt-5 font-medium text-[1.125rem] sm:text-[1.25rem] leading-[150%] tracking-[-0.01em] text-[#FAFAFA] w-full max-w-[594px]">
            We collaborate with you to curate a simple routine that's tailored
            to your lifestyle, your budget, and your skin goals.
          </p>

          {/* CTA Button */}
          <Link
            href="/onboarding"
            className="mt-10 w-full sm:w-auto group inline-flex items-center justify-center gap-2 font-semibold text-[1rem] sm:text-[1.125rem] leading-[150%] tracking-[-0.01em] text-[#FDFAEB] border-[0.8px] border-[#FDFAEB] rounded-xl py-4 px-6 bg-transparent transition-all duration-300 hover:opacity-90"
          >
            <span>Begin My Skin Journey</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
