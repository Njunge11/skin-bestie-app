// app/(onboarding)/step3.tsx
"use client";

import { useId } from "react";
import { useFormContext, useController, useWatch } from "react-hook-form";
import { cn } from "@/lib/utils";
import { MButton } from "./components/button";
import type { OnboardingSchema } from "./onboarding.schema";
import { useWizard } from "./wizard.provider";
import { trpc } from "@/trpc/react";
import { mergeCompletedSteps } from "./onboarding.utils";

const ALL_CONCERNS = [
  "Acne",
  "Dryness",
  "Pigmentation",
  "Oiliness",
  "Skin Texture",
  "Fine Lines",
  "Wrinkles",
  "Redness",
  "Sensitivity",
  "Other",
] as const;

function ConcernTile({
  label,
  checked,
  onToggle,
  className,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
  className?: string;
}) {
  const id = useId();
  return (
    <div className="relative">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="peer sr-only"
        aria-label={label}
      />
      <label
        htmlFor={id}
        className={cn(
          // size to content
          "inline-flex items-center justify-center whitespace-nowrap",
          "cursor-pointer select-none transition-all duration-200",
          // consistent height & padding
          "py-[0.3125rem] px-3",
          // visual style
          "rounded-[0.25rem] border-[0.04375rem]",
          "text-[#272B2D] font-medium text-[1.0625rem] leading-[150%] tracking-[-0.01em]",
          // states
          "border-[#BCB8A6] bg-[#F3ECC7] hover:brightness-[0.98]",
          "peer-checked:border-[#030303] peer-checked:bg-[#FFFBE5]",
          // focus ring for keyboard
          "outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-[#222118]/30",
          className
        )}
      >
        {label}
      </label>
    </div>
  );
}

export default function Step3({ onNext }: { onNext?: () => void }) {
  const {
    control,
    register,
    setValue,
    getValues,
    setError,
    clearErrors,
    trigger,
    formState: { errors },
  } = useFormContext<OnboardingSchema>();

  const { next } = useWizard();

  // Get current profile to preserve completedSteps
  const userProfileId = getValues("userProfileId");
  const { data: currentProfile } = trpc.userProfile.getById.useQuery(
    { id: userProfileId || "" },
    { enabled: !!userProfileId }
  );

  // Own the array field; validate "at least one"
  const { field: concernsField } = useController<OnboardingSchema, "concerns">({
    name: "concerns",
    control,
    defaultValue: [] as string[],
    rules: {
      validate: (arr: unknown) =>
        (Array.isArray(arr) && arr.length > 0) || "Pick at least one concern",
    },
  });

  const concerns = useWatch({ control, name: "concerns" }) ?? [];
  const hasOther = concerns.includes("Other");

  // "Other" is required ANY time it's selected (rule depends on *current* form values)
  const { ref: otherRef, ...otherReg } = register("concernOther", {
    validate: (v?: string, formValues?: OnboardingSchema) => {
      const selected = formValues?.concerns ?? [];
      const otherPicked = selected.includes("Other");
      return (
        !otherPicked || !!(v && v.trim().length) || "Please describe “Other”"
      );
    },
  });

  const toggle = (label: string) => {
    const next = concerns.includes(label)
      ? concerns.filter((v) => v !== label)
      : [...concerns, label];

    concernsField.onChange(next);

    // Clear list error as soon as it becomes non-empty
    if (next.length > 0) clearErrors("concerns");

    // If "Other" was removed: clear text + its error
    if (!next.includes("Other")) {
      setValue("concernOther", "", {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: false,
      });
      clearErrors("concernOther");
      return;
    }

    // If "Other" is now selected, don't scream immediately; validate on Continue.
    // (If you want it immediately, uncomment next line)
    // void trigger("concernOther");
  };

  // tRPC mutation to update profile
  const updateProfile = trpc.userProfile.update.useMutation({
    onSuccess: () => {
      next();
    },
    onError: (error) => {
      setError("concerns", {
        type: "manual",
        message: error.message || "Failed to save concerns",
      });
    },
  });

  const handleContinue = async () => {
    // Validate only this step's fields
    const ok = await trigger(["concerns", "concernOther"], {
      shouldFocus: true,
    });

    if (ok) {
      const userProfileId = getValues("userProfileId");
      const concerns = getValues("concerns");
      const concernOther = getValues("concernOther");

      if (!userProfileId) {
        setError("concerns", {
          type: "manual",
          message: "Profile ID is missing. Please start from Step 1.",
        });
        return;
      }

      // Keep "Other" in array AND add custom text (Option B)
      let finalConcerns = [...concerns];
      if (concerns.includes("Other") && concernOther?.trim()) {
        finalConcerns.push(concernOther.trim());
      }

      // Merge completed steps (preserve existing progress)
      const completedSteps = mergeCompletedSteps(
        currentProfile?.completedSteps,
        ["PERSONAL", "SKIN_TYPE", "SKIN_CONCERNS"]
      );

      // Update profile with concerns
      updateProfile.mutate({
        id: userProfileId,
        data: {
          concerns: finalConcerns,
          completedSteps,
        },
      });
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} noValidate>
      <hr className="mt-6 border-t-[0.03125rem] border-[#030303]" />
      <p className="mt-6 font-medium text-base leading-[150%] tracking-[-0.01em] text-[#3F4548]">
        Select as many as you like. Choose “Other” to type your own.
      </p>

      <fieldset className="w-full">
        <div className="mt-4 flex flex-wrap gap-x-3 gap-y-2">
          {ALL_CONCERNS.map((c) => (
            <ConcernTile
              key={c}
              label={c}
              checked={concerns.includes(c)}
              onToggle={() => toggle(c)}
            />
          ))}
        </div>
      </fieldset>

      {errors.concerns && (
        <p className="mt-2 text-sm text-red-600">{errors.concerns.message}</p>
      )}

      {hasOther && (
        <div className="mt-4">
          <label
            htmlFor="concernOther"
            className="inline-flex items-center capitalize font-medium text-[1rem] leading-[150%] tracking-[-0.01em] text-[#272B2D]"
          >
            Other
          </label>

          <textarea
            id="concernOther"
            placeholder="Write something..."
            {...otherReg}
            ref={otherRef}
            className={[
              "mt-2 w-full max-w-[392px] min-h-[137px]",
              "px-3 py-2",
              "rounded-[0.25rem]",
              "border-[0.0375rem] border-[#BCB8A6]",
              "bg-[#FFFBE5]",
              "text-[#272B2D] text-base leading-[150%] tracking-[-0.01em]",
              "placeholder:text-[#313638]",
              "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#222118]/30",
              "resize-y",
            ].join(" ")}
            rows={3}
            aria-invalid={!!errors.concernOther || undefined}
          />

          {errors.concernOther && (
            <p className="mt-2 text-sm text-red-600">
              {errors.concernOther.message}
            </p>
          )}
        </div>
      )}

      <div className="mt-8 flex justify-end">
        <MButton
          type="button"
          label={updateProfile.isPending ? "Saving..." : "Continue"}
          onClick={handleContinue}
          disabled={updateProfile.isPending}
        />
      </div>
    </form>
  );
}
