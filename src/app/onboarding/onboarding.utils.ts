// Onboarding utility functions

import type { UseFormSetValue } from "react-hook-form";
import type { OnboardingSchema } from "./onboarding.schema";
import type { UserProfile } from "./actions";

const STEP_ORDER = [
  "PERSONAL",
  "SKIN_TYPE",
  "SKIN_CONCERNS",
  "ALLERGIES",
  "SUBSCRIBE",
  "BOOKING",
];

/**
 * Get the index of the first incomplete step
 */
export function getIncompleteStepIndex(completedSteps: string[]): number {
  // Find first step not in completedSteps
  const firstIncomplete = STEP_ORDER.findIndex(
    (step) => !completedSteps.includes(step),
  );

  // If all steps completed, return last step (login redirect will be handled later)
  return firstIncomplete === -1 ? STEP_ORDER.length - 1 : firstIncomplete;
}

/**
 * Merge new completed steps with existing ones (preserving progress)
 */
export function mergeCompletedSteps(
  currentSteps: string[] | null | undefined,
  newSteps: string[],
): string[] {
  const existing = currentSteps || [];
  const merged = Array.from(new Set([...existing, ...newSteps]));

  // Sort by step order to maintain consistency
  return merged.sort((a, b) => {
    const indexA = STEP_ORDER.indexOf(a);
    const indexB = STEP_ORDER.indexOf(b);
    return indexA - indexB;
  });
}

// List of predefined concerns
const PREDEFINED_CONCERNS = [
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
];

/**
 * Populate form fields with existing profile data
 */
export function populateFormFromProfile(
  profile: {
    id: string;
    skinType?: string[] | null;
    concerns?: string[] | null;
    hasAllergies?: boolean | null;
    allergyDetails?: string | null;
  },
  setValue: UseFormSetValue<OnboardingSchema>,
) {
  // Store profile ID
  setValue("userProfileId", profile.id);

  // Populate completed step data
  if (profile.skinType) {
    setValue("skinTypes", profile.skinType);
  }

  if (profile.concerns && Array.isArray(profile.concerns)) {
    // Separate predefined concerns from custom ones
    const predefinedSelected = profile.concerns.filter(
      (c: string) => PREDEFINED_CONCERNS.includes(c) && c !== "Other",
    );
    const customConcerns = profile.concerns.filter(
      (c: string) => !PREDEFINED_CONCERNS.includes(c),
    );

    // If there are custom concerns, auto-select "Other" and populate the text field
    if (customConcerns.length > 0) {
      setValue("concerns", [...predefinedSelected, "Other"]);
      setValue("concernOther", customConcerns.join(", "));
    } else {
      // No custom concerns - just set predefined ones (may include "Other" if it was saved that way)
      setValue(
        "concerns",
        profile.concerns.filter((c: string) => PREDEFINED_CONCERNS.includes(c)),
      );
    }
  }

  if (profile.hasAllergies !== null && profile.hasAllergies !== undefined) {
    setValue("hasAllergy", profile.hasAllergies ? "Yes" : "No");
  }
  if (profile.allergyDetails) {
    setValue("allergy", profile.allergyDetails);
  }
}

/**
 * Map profile data to form values for React Hook Form's `values` prop
 * Used when returning from Stripe payment (success or canceled)
 */
export function mapProfileToFormValues(profile: UserProfile): OnboardingSchema {
  // Separate predefined concerns from custom ones
  let concerns: string[] = [];
  let concernOther = "";

  if (profile.concerns && Array.isArray(profile.concerns)) {
    const predefinedSelected = profile.concerns.filter(
      (c: string) => PREDEFINED_CONCERNS.includes(c) && c !== "Other",
    );
    const customConcerns = profile.concerns.filter(
      (c: string) => !PREDEFINED_CONCERNS.includes(c),
    );

    if (customConcerns.length > 0) {
      concerns = [...predefinedSelected, "Other"];
      concernOther = customConcerns.join(", ");
    } else {
      concerns = profile.concerns.filter((c: string) =>
        PREDEFINED_CONCERNS.includes(c),
      );
    }
  }

  // Parse phone number to extract local part (remove country code)
  // Assumes UK format: +44XXXXXXXXXX -> 0XXXXXXXXXX
  let mobileLocal = "";
  if (profile.phoneNumber) {
    if (profile.phoneNumber.startsWith("+44")) {
      mobileLocal = "0" + profile.phoneNumber.slice(3);
    } else {
      mobileLocal = profile.phoneNumber;
    }
  }

  // Format date of birth to YYYY-MM-DD string
  let dateOfBirth = "";
  if (profile.dateOfBirth) {
    const date =
      profile.dateOfBirth instanceof Date
        ? profile.dateOfBirth
        : new Date(profile.dateOfBirth);
    dateOfBirth = date.toISOString().split("T")[0];
  }

  return {
    userProfileId: profile.id,
    firstName: profile.firstName || "",
    lastName: profile.lastName || "",
    email: profile.email || "",
    mobileLocal,
    mobileCountryISO: "GB", // Default to GB
    dateOfBirth,
    goal: "", // Not stored in profile
    routineNote: "", // Not stored in profile
    skinTypes: profile.skinType || [],
    concerns,
    concernOther,
    hasAllergy:
      profile.hasAllergies === null || profile.hasAllergies === undefined
        ? undefined
        : profile.hasAllergies
          ? "Yes"
          : "No",
    allergy: profile.allergyDetails || "",
  };
}
