"use client";

import { ArrowLeft } from "lucide-react";
import { anton } from "@/app/fonts";
import { useWizard } from "./wizard.provider";
import { useFormContext } from "react-hook-form";
import type { OnboardingSchema } from "./onboarding.schema";

import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";
import Step4 from "./step4";

const STEP_COMPONENTS = {
  personal: Step1,
  skinType: Step2,
  concerns: Step3,
  allergies: Step4,
  // checkout: Step5,
} as const;

// fields that belong to each step — used to clear that step's errors on Back
const FIELDS_BY_STEP: Record<
  keyof typeof STEP_COMPONENTS,
  readonly (keyof OnboardingSchema)[]
> = {
  personal: [
    "firstName",
    "lastName",
    "email",
    "mobileLocal",
    "mobileCountryISO",
    "dateOfBirth",
  ],
  skinType: ["skinTypes"],
  concerns: ["concerns", "concernOther"] as const,
  allergies: ["hasAllergy", "allergy"] as const,
};

export default function OnboardingForm() {
  const { stepIndex, total, next, back, current } = useWizard();
  const { clearErrors, resetField, getValues } =
    useFormContext<OnboardingSchema>();

  const StepBody =
    STEP_COMPONENTS[current.component as keyof typeof STEP_COMPONENTS] ?? Step1;

  const alignLeft = current.align === "left";

  // ✅ When user presses Back, clear errors for the step we're LEAVING
  const handleBack = () => {
    const currentKey = current.component as keyof typeof STEP_COMPONENTS;
    const fields = FIELDS_BY_STEP[currentKey] ?? [];

    clearErrors(fields as any);

    // Optional UX: mark fields untouched so errors don't flash immediately next time
    fields.forEach((name) => {
      resetField(name as any, {
        keepDirty: true,
        keepError: false,
        keepTouched: false,
        defaultValue: getValues(name as any),
      });
    });

    back();
  };

  return (
    <div className="h-full flex flex-col pt-5 px-4 md:px-[30px] bg-[#F3F0DF]">
      {/* Top bar */}
      <div className="flex justify-between items-baseline">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft size={24} className="text-[#222118]" />
          <span
            className={`${anton.className} text-2xl font-normal leading-none tracking-tight uppercase text-[#222118]`}
          >
            Back
          </span>
        </button>

        <div className="flex items-center gap-2">
          <span
            className={`${anton.className} text-2xl leading-none tracking-tight uppercase text-[#222118]`}
          >
            STEP
          </span>
          <span
            className={`${anton.className} text-xl leading-none tracking-tight uppercase text-[#F3ECC7] bg-[#222118] rounded-md px-3 py-1`}
          >
            {stepIndex + 1} OF {total}
          </span>
        </div>
      </div>

      {/* Card */}
      <div className="mt-8 mx-auto w-full max-w-[440px] bg-[#F3ECC7] p-6">
        <h1
          className={`${anton.className} ${
            alignLeft ? "text-left" : "text-center"
          } text-[2rem] uppercase text-[#222118]`}
        >
          {current.formTitle}
        </h1>
        <p
          className={`${alignLeft ? "text-left" : "text-center"} text-lg font-medium text-[#3F4548] pt-2`}
        >
          {current.formSub}
        </p>

        {/* Each step validates only its own fields */}
        <StepBody onNext={next} />
      </div>
    </div>
  );
}
