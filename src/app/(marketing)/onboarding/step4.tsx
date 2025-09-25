// app/(onboarding)/step4.tsx
"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { MButton } from "./components/button";
import { MRadioButton } from "./components/radio.button";
import type { OnboardingSchema } from "./onboarding.schema";

const OPTIONS = ["No", "Yes"] as const;
const FIELD = "hasAllergy" as const; // radio field
const DETAIL_FIELD = "allergy" as const; // textarea field

export default function Step4({ onNext }: { onNext?: () => void }) {
  const {
    watch,
    register,
    trigger,
    getValues,
    formState: { errors },
  } = useFormContext<OnboardingSchema>();

  const [attempted, setAttempted] = useState(false);
  const selected = watch(FIELD);

  //   function getConcerns(v: OnboardingSchema): string[] {
  //     const other = (v.concernOther ?? "").trim();
  //     const base = v.concerns ?? [];
  //     const replaced = base.map((c) => (c === "Other" && other ? other : c));
  //     return Array.from(new Set(replaced.filter(Boolean)));
  //   }

  //   function buildAccountPayload(v: OnboardingSchema) {
  //     return {
  //       firstName: v.firstName,
  //       lastName: v.lastName,
  //       phoneNumber: v.mobileLocal,
  //       email: v.email,
  //       dateOfBirth: v.dateOfBirth,
  //       skinType: [...(v.skinTypes ?? [])],
  //       concerns: getConcerns(v),
  //       hasAllergy: v.hasAllergy === "Yes",
  //       allergy: v.hasAllergy === "Yes" ? (v.allergy ?? "").trim() : "",
  //       subscription: "not_yet",
  //       initialBooking: false,
  //     } as const;
  //   }

  //   const handleError = async (response: Response) => {
  //     if (response.status === 409) {
  //       const result = await response.json();
  //       const { existing } = result;
  //       if (existing.subscription === "active" && existing.initialBooking) {
  //         console.log("go to login page ");
  //       }
  //       if (existing.subscription === "active" && !existing.initialBooking) {
  //         console.log("go to booking page");
  //       }
  //       if (existing.subscription !== "active") {
  //         console.log("go to next step");
  //         onNext?.();
  //       }
  //     } else {
  //       console.log("an error occured");
  //     }
  //   };

  const handleContinue = async () => {
    setAttempted(true);
    // Only validate textarea when "Yes" is selected
    const fields = [FIELD, selected === "Yes" ? DETAIL_FIELD : null].filter(
      Boolean
    ) as (keyof OnboardingSchema)[];
    const ok = await trigger(fields, { shouldFocus: true });
    if (ok) onNext?.();
  };

  const showRadioError = attempted && !!errors[FIELD];
  // If user flips to "No", ignore any stale textarea error (don’t block)
  const showTextError =
    attempted && selected === "Yes" && !!errors[DETAIL_FIELD];

  return (
    <form onSubmit={(e) => e.preventDefault()} noValidate>
      <div className="mx-auto w-full max-w-[392px] pt-4">
        {/* Radios: no onChange, let MRadioButton integrate with RHF as-is */}
        {OPTIONS.map((opt) => (
          <MRadioButton
            key={opt}
            name={FIELD}
            value={opt}
            label={opt}
            required
          />
        ))}

        {showRadioError ? (
          <p className="mt-2 text-sm text-red-600">
            {errors[FIELD]?.message as string}
          </p>
        ) : (
          ""
        )}

        {selected === "Yes" && (
          <div className="mt-4">
            <label
              htmlFor={DETAIL_FIELD}
              className="inline-flex items-center capitalize font-medium text-[1rem] leading-[150%] tracking-[-0.01em] text-[#272B2D]"
            >
              Allergy
            </label>

            <textarea
              id={DETAIL_FIELD}
              placeholder="Write something..."
              {...register(DETAIL_FIELD)}
              className={[
                "mt-2 w-full max-w-[392px] min-h-[137px]",
                "px-3 py-2",
                "rounded-[0.25rem]",
                "border-[0.0375rem] border-[#BCB8A6]",
                "bg-white opacity-100",
                "text-[#272B2D] text-base leading-[150%] tracking-[-0.01em]",
                "placeholder:text-[#313638]",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#222118]/30",
                "resize-y",
              ].join(" ")}
              rows={3}
              aria-invalid={showTextError || undefined}
            />

            {showTextError ? (
              <p className="mt-2 text-sm text-red-600">
                {errors[DETAIL_FIELD]?.message as string}
              </p>
            ) : (
              ""
            )}
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <MButton label="Continue" type="button" onClick={handleContinue} />
        </div>
      </div>
    </form>
  );
}
