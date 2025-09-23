// app/(onboarding)/step2.tsx
"use client";

import * as React from "react";
import { useController, useFormContext } from "react-hook-form";
import { MButton } from "./components/button";
import { MCheckbox } from "./components/checkbox";
import type { OnboardingSchema } from "./onboarding.schema";
import { useWizard } from "./wizard.provider";

const SKIN_TYPES = [
  "Dry",
  "Oily",
  "Combination",
  "Sensitive",
  "I'm Not Sure",
] as const;

export default function Step2({ onNext }: { onNext?: () => void }) {
  const {
    control,
    setValue,
    trigger,
    clearErrors,
    formState: { errors },
  } = useFormContext<OnboardingSchema>();
  const { current } = useWizard();

  // one controller for the whole array field
  const { field } = useController({
    name: "skinTypes",
    control,
    defaultValue: [], // always an array
  });

  const selected: string[] = field.value ?? [];

  const toggle = (val: string) => {
    const next = selected.includes(val)
      ? selected.filter((v) => v !== val)
      : [...selected, val];

    // ✅ update with validation so errors clear immediately
    setValue("skinTypes", next, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });

    // Optional immediate UX cleanup (no flicker)
    if (next.length > 0) {
      clearErrors("skinTypes");
    }
  };

  const handleContinue = async () => {
    const ok = await trigger("skinTypes", { shouldFocus: true });
    if (ok) onNext?.();
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} noValidate>
      {current?.formInstruction ? (
        <p className="font-medium text-base leading-[150%] tracking-[-0.01em] text-[#3F4548]">
          {current.formInstruction}
        </p>
      ) : null}

      <div className="mx-auto w-full max-w-[392px] pt-4">
        {SKIN_TYPES.map((type) => (
          <MCheckbox
            key={type}
            label={type}
            checked={selected.includes(type)}
            onToggle={() => toggle(type)}
          />
        ))}

        <p className="min-h-[1.25rem] mt-2 text-sm text-red-600">
          {errors.skinTypes?.message as string | undefined}
        </p>

        <div className="mt-8 flex justify-end">
          <MButton label="Continue" type="button" onClick={handleContinue} />
        </div>
      </div>
    </form>
  );
}
