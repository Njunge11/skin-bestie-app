"use client";

import { anton } from "@/app/fonts";

interface LoginMarketingProps {
  backgroundCopy: string;
  backgroundImage: {
    sourceUrl: string;
    altText: string;
  };
}

export default function LoginMarketing({
  backgroundCopy,
}: LoginMarketingProps) {
  return (
    <div className="hidden md:flex flex-col bg-skinbestie-landing-blue pt-18 pl-20">
      <h1
        className={`max-w-[532px] ${anton.className} text-skinbestie-landing-pink text-[3.5rem] font-normal leading-[120%] tracking-[-0.02em] uppercase`}
      >
        {backgroundCopy}
      </h1>
    </div>
  );
}
