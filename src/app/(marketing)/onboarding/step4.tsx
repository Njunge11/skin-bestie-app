// app/(onboarding)/step4.tsx
"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { MButton } from "./components/button";
import { MRadioButton } from "./components/radio.button";
import type { OnboardingSchema } from "./onboarding.schema";
import { useWizard } from "./wizard.provider";
import { trpc } from "@/trpc/react";
import { mergeCompletedSteps } from "./onboarding.utils";

const OPTIONS = ["No", "Yes"] as const;
const FIELD = "hasAllergy" as const; // radio field
const DETAIL_FIELD = "allergy" as const; // textarea field

export default function Step4({ onNext }: { onNext?: () => void }) {
  const {
    watch,
    register,
    trigger,
    getValues,
    setError,
    formState: { errors },
  } = useFormContext<OnboardingSchema>();

  const { next } = useWizard();
  const [attempted, setAttempted] = useState(false);
  const selected = watch(FIELD);

  // Get current profile to preserve completedSteps
  const userProfileId = getValues("userProfileId");
  const { data: currentProfile } = trpc.userProfile.getById.useQuery(
    { id: userProfileId || "" },
    { enabled: !!userProfileId }
  );

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

  // tRPC mutation to update profile
  const updateProfile = trpc.userProfile.update.useMutation({
    onSuccess: () => {
      next();
    },
    onError: (error) => {
      setError(FIELD, {
        type: "manual",
        message: error.message || "Failed to save allergy information",
      });
    },
  });

  const handleContinue = async () => {
    setAttempted(true);
    // Only validate textarea when "Yes" is selected
    const fields = [FIELD, selected === "Yes" ? DETAIL_FIELD : null].filter(
      Boolean
    ) as (keyof OnboardingSchema)[];
    const ok = await trigger(fields, { shouldFocus: true });

    if (ok) {
      const userProfileId = getValues("userProfileId");
      const hasAllergy = getValues(FIELD);
      const allergyDetails = getValues(DETAIL_FIELD);

      if (!userProfileId) {
        setError(FIELD, {
          type: "manual",
          message: "Profile ID is missing. Please start from Step 1.",
        });
        return;
      }

      // Merge completed steps (preserve existing progress)
      const completedSteps = mergeCompletedSteps(
        currentProfile?.completedSteps,
        ["PERSONAL", "SKIN_TYPE", "SKIN_CONCERNS", "ALLERGIES"]
      );

      // Update profile with allergy info
      updateProfile.mutate({
        id: userProfileId,
        data: {
          hasAllergies: hasAllergy === "Yes",
          allergyDetails: hasAllergy === "Yes" ? allergyDetails?.trim() || null : null,
          completedSteps,
        },
      });
    }
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
          <MButton
            label={updateProfile.isPending ? "Saving..." : "Continue"}
            type="button"
            onClick={handleContinue}
            disabled={updateProfile.isPending}
          />
        </div>
      </div>
    </form>
  );
}
