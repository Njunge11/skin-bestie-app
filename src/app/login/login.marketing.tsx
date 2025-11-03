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
  backgroundImage,
}: LoginMarketingProps) {
  return (
    <div
      className="hidden md:flex flex-col bg-cover bg-center pt-18 pl-20"
      style={{ backgroundImage: `url('${backgroundImage.sourceUrl}')` }}
      aria-label={backgroundImage.altText}
    >
      <h1
        className={`max-w-[532px] ${anton.className} text-[#FFF7D4] text-[3.5rem] font-normal leading-[120%] tracking-[-0.02em] uppercase`}
      >
        {backgroundCopy}
      </h1>
    </div>
  );
}
