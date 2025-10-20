// app/(onboarding)/step2.tsx
"use client";

import { useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { MButton } from "./components/button";
import { MCheckbox } from "./components/checkbox";
import type { OnboardingSchema } from "./onboarding.schema";
import { useWizard } from "./wizard.provider";
import { getUserProfile, updateUserProfile } from "./actions";
import { mergeCompletedSteps } from "./onboarding.utils";

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
    getValues,
    trigger,
    setError,
    formState: { errors },
  } = useFormContext<OnboardingSchema>();
  const { current, next } = useWizard();

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

    // If user already attempted submit, revalidate on selection to clear errors.
    // Otherwise, don't validate until they click Continue.
    setValue("skinTypes", next, {
      shouldValidate: attempted,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  // Get current profile to preserve completedSteps
  const userProfileId = getValues("userProfileId");
  const [isUpdating, setIsUpdating] = useState(false);
  // Server error state
  const [serverError, setServerError] = useState<string | null>(null);

  // Fetch profile using TanStack Query
  const { data: currentProfile } = useQuery({
    queryKey: ["userProfile", userProfileId],
    queryFn: async () => {
      if (!userProfileId) return null;
      const result = await getUserProfile(userProfileId);
      return result.success ? result.data : null;
    },
    enabled: !!userProfileId,
  });

  const handleContinue = async () => {
    setAttempted(true);
    setServerError(null);

    const ok = await trigger("skinTypes", { shouldFocus: true });

    if (ok) {
      const userProfileId = getValues("userProfileId");
      const skinTypes = getValues("skinTypes");

      if (!userProfileId) {
        setServerError("Profile ID is missing. Please start from Step 1.");
        return;
      }

      // Merge completed steps (preserve existing progress)
      const completedSteps = mergeCompletedSteps(
        currentProfile?.completedSteps,
        ["PERSONAL", "SKIN_TYPE"]
      );

      // Update profile with skin types
      setIsUpdating(true);
      const result = await updateUserProfile(userProfileId, {
        skinType: skinTypes,
        completedSteps,
      });
      setIsUpdating(false);

      if (!result.success) {
        setServerError(result.error);
        return;
      }

      // Navigate to next step on success
      next();
    }
  };

  const showError = attempted && !!errors.skinTypes;

  return (
    <form onSubmit={(e) => e.preventDefault()} noValidate>
      {/* Server error message */}
      {serverError && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md" role="alert">
          <p className="text-sm text-red-800">{serverError}</p>
        </div>
      )}

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
          <MButton
            label={isUpdating ? "Saving..." : "Continue"}
            type="button"
            onClick={handleContinue}
            disabled={isUpdating}
          />
        </div>
      </div>
    </form>
  );
}
