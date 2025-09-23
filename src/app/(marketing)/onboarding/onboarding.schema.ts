// app/(onboarding)/onboarding.schema.ts
import { z } from "zod";
import {
  parsePhoneNumber,
  isSupportedCountry,
  type CountryCode,
} from "libphonenumber-js/mobile";

// Accept string in form state; narrow to CountryCode only where we call the lib.
const countryCodeSchema = z
  .string()
  .transform((s) => s.toUpperCase())
  .refine(
    (iso): iso is CountryCode => isSupportedCountry(iso as any),
    "Unsupported country"
  );

export const onboardingSchema = z
  .object({
    // --- Step 1 ---
    firstName: z.string().min(2, "Enter at least 2 characters"),
    lastName: z.string().min(2, "Enter at least 2 characters"),
    email: z.string().email("Enter a valid email"),

    // Let the browser/autofill provide any format; we validate with libphonenumber in superRefine.
    mobileLocal: z.string().min(1, "Phone number is required"),
    mobileCountryISO: countryCodeSchema,

    dateOfBirth: z
      .string()
      .min(1, "Date of birth is required")
      .refine((v) => !Number.isNaN(Date.parse(v)), "Select a valid date"),

    // --- Optional free text ---
    goal: z.string().optional(),
    routineNote: z.string().optional(),

    // --- Step 2 ---
    skinTypes: z.array(z.string()).min(1, "Select at least one option"),

    // --- Step 3 ---
    concerns: z.array(z.string()).min(1, "Pick at least one concern"),
    concernOther: z.string().optional(),
    hasAllergy: z.enum(["Yes", "No"], { message: "Pick at least one allergy" }),
    allergy: z.string().optional(),
  })
  .superRefine((vals, ctx) => {
    // Phone number validation (strict)
    const raw = (vals.mobileLocal ?? "").trim();
    if (raw) {
      try {
        const pn = parsePhoneNumber(raw, {
          defaultCountry: vals.mobileCountryISO as CountryCode,
          extract: false, // whole input must be a phone number
        });

        if (!pn?.isValid()) {
          ctx.addIssue({
            code: "custom",
            path: ["mobileLocal"],
            message: "That number isn’t valid",
          });
        } else if (raw.startsWith("+")) {
          // If user typed international, its parsed country must match the selected ISO.
          if (
            !pn.country ||
            pn.country !== (vals.mobileCountryISO as CountryCode)
          ) {
            ctx.addIssue({
              code: "custom",
              path: ["mobileLocal"],
              message: "Invalid number for the selected country",
            });
          }
        }
      } catch {
        ctx.addIssue({
          code: "custom",
          path: ["mobileLocal"],
          message: "That number isn’t valid",
        });
      }
    }

    // Step 3 “Other” rule: whenever "Other" is selected at all, concernOther is required.
    if ((vals.concerns ?? []).includes("Other") && !vals.concernOther?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["concernOther"],
        message: "Please describe “Other”",
      });
    }
    if (vals.hasAllergy === "Yes" && !vals.allergy?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["allergy"],
        message: "Please describe your allergy",
      });
    }
  });

// Use the input type so RHF matches what users actually type (strings).
export type OnboardingSchema = z.input<typeof onboardingSchema>;

// Helper: normalize phone to E.164 (or null if invalid).
export function normalizeToE164(values: OnboardingSchema): string | null {
  try {
    const pn = parsePhoneNumber(values.mobileLocal.trim(), {
      defaultCountry: values.mobileCountryISO as CountryCode,
      extract: false,
    });
    return pn?.number ?? null;
  } catch {
    return null;
  }
}
