// app/(onboarding)/onboarding.schema.ts
import { z } from "zod";
import {
  isValidPhoneNumber, // ← strict validation
  parsePhoneNumber,
  isSupportedCountry,
} from "libphonenumber-js/mobile"; // ← switch from /min to /mobile

export const onboardingSchema = z
  .object({
    firstName: z.string().min(2, "Enter at least 2 characters"),
    lastName: z.string().min(2, "Enter at least 2 characters"),
    email: z.string().email("Enter a valid email"),
    mobileLocal: z.string().min(1, "Phone number is required"),
    mobileCountryISO: z.string().min(2, "Select a country"),
    dateOfBirth: z
      .string()
      .min(1, "Date of birth is required")
      .refine((v) => !Number.isNaN(Date.parse(v)), "Select a valid date")
      .refine((v) => new Date(v) < new Date(), "Date must be in the past"),
    goal: z.string().optional(),
    routineNote: z.string().optional(),
    skinTypes: z.array(z.string()).optional(),
  })
  .superRefine((vals, ctx) => {
    const iso = vals.mobileCountryISO?.trim().toUpperCase();
    const raw = vals.mobileLocal?.trim();
    if (!iso || !isSupportedCountry(iso as any)) {
      ctx.addIssue({
        path: ["mobileCountryISO"],
        code: "custom",
        message: "Unsupported country",
      });
      return;
    }
    if (!raw) return;

    // Strict, country-aware validity (not just length)
    const valid = raw.startsWith("+")
      ? isValidPhoneNumber(raw) // already has +CC
      : isValidPhoneNumber(raw, iso as any); // national + ISO

    if (!valid) {
      ctx.addIssue({
        path: ["mobileLocal"],
        code: "custom",
        message: "That number isn’t valid for the selected country",
      });
    }
  });

export type OnboardingSchema = z.input<typeof onboardingSchema>;

export function normalizeToE164(values: OnboardingSchema): string | null {
  try {
    const pn = parsePhoneNumber(
      values.mobileLocal.trim(),
      values.mobileCountryISO as any
    );
    return pn?.number ?? null;
  } catch {
    return null;
  }
}
