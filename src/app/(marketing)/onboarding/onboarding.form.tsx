"use client";

import { ArrowLeft } from "lucide-react";
import { anton } from "@/app/fonts";
import { useWizard } from "./wizard.provider";
import Step1 from "./step1";

const STEP_COMPONENTS = { personal: Step1 } as const;

export default function OnboardingForm() {
  const { stepIndex, total, next, back, current } = useWizard();
  const StepBody =
    STEP_COMPONENTS[current.component as keyof typeof STEP_COMPONENTS] ?? Step1;
  const alignLeft = current.align === "left";

  return (
    <div className="h-full flex flex-col pt-5 px-4 md:px-[30px] bg-[#F3F0DF]">
      <div className="flex justify-between items-baseline">
        <button
          type="button"
          onClick={back}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft size={24} className="text-[#222118]" />
          <span
            className={`${anton.className} text-2xl font-normal uppercase text-[#222118]`}
          >
            Back
          </span>
        </button>

        <div className="flex items-center gap-2">
          <span
            className={`${anton.className} text-2xl uppercase text-[#222118]`}
          >
            STEP
          </span>
          <span
            className={`${anton.className} text-xl uppercase text-[#F3ECC7] bg-[#222118] rounded-md px-3 py-1`}
          >
            {stepIndex + 1} OF {total}
          </span>
        </div>
      </div>

      <div className="mt-8 mx-auto w-full max-w-[440px] bg-[#F3ECC7] p-6">
        <h1
          className={`${anton.className} ${alignLeft ? "text-left" : "text-center"} text-[2rem] uppercase text-[#222118]`}
        >
          {current.formTitle}
        </h1>
        <p
          className={`${alignLeft ? "text-left" : "text-center"} text-lg font-medium text-[#3F4548] pt-2`}
        >
          {current.formSub}
        </p>
        <StepBody onNext={next} />
      </div>
    </div>
  );
}
