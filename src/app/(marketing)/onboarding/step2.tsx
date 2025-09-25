// app/(onboarding)/step2.tsx
"use client";

import { useState } from "react";
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
    formState: { errors },
  } = useFormContext<OnboardingSchema>();
  const { current } = useWizard();

  // Track if the user has tried to submit this step
  const [attempted, setAttempted] = useState(false);

  // Own the array field
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

    // Update value without triggering validation.
    // We only validate when pressing Continue.
    setValue("skinTypes", next, {
      shouldValidate: false,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const handleContinue = async () => {
    setAttempted(true);
    const ok = await trigger("skinTypes", { shouldFocus: true });
    if (ok) onNext?.();
  };

  const showError = attempted && !!errors.skinTypes;

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

        {showError ? (
          <p className="mt-2 text-sm text-red-600">
            {errors.skinTypes?.message as string}
          </p>
        ) : (
          // keep space to avoid layout-jump
          <p className="mt-2 min-h-[1.25rem] text-sm" />
        )}

        <div className="mt-8 flex justify-end">
          <MButton label="Continue" type="button" onClick={handleContinue} />
        </div>
      </div>
    </form>
  );
}
