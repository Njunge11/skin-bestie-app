"use client";

import { useWizard } from "./wizard.provider";
import { anton } from "@/app/fonts";

export default function OnboardingMarketing() {
  const { current } = useWizard();

  return (
    <div
      className="hidden md:flex flex-col bg-cover bg-center pt-[11.3125rem] p-[8.625rem]"
      style={{ backgroundImage: `url('${current.bgImage}')` }}
      aria-label={current.headline}
    >
      <h1
        className={`w-full max-w-[485px] ${anton.className} text-[#FFF7D4] text-[3.5rem] font-normal leading-[120%] tracking-[-0.02em] uppercase`}
      >
        {current.headline}
      </h1>

      <p className="w-full max-w-[376px] pt-4 text-[1.125rem] font-medium leading-[150%] tracking-[-0.01em] text-[#FFFDF5]">
        {current.subhead}
      </p>
    </div>
  );
}
