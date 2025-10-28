"use client";

import { anton } from "@/app/fonts";

export default function LoginMarketing() {
  return (
    <div
      className="hidden md:flex flex-col bg-cover bg-center pt-[19] p-[8.625rem]"
      style={{ backgroundImage: `url('/onboarding.jpg')` }}
      aria-label="Welcome back to Skin Bestie"
    >
      <h1
        className={`w-full max-w-[532px] ${anton.className} text-[#FFF7D4] text-[3.5rem] font-normal leading-[120%] tracking-[-0.02em] uppercase`}
      >
        Ready to continue your skin journey? Let's get back in.
      </h1>
    </div>
  );
}
