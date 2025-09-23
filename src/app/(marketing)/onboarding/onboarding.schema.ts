import { z } from "zod";
import {
  parsePhoneNumber,
  isSupportedCountry,
  type CountryCode,
} from "libphonenumber-js/mobile";

// Accept string in form state; narrow to CountryCode only where we call the lib
const countryCodeSchema = z
  .string()
  .transform((s) => s.toUpperCase())
  .refine(
    (iso): iso is CountryCode => isSupportedCountry(iso as any),
    "Unsupported country"
  );

export const onboardingSchema = z
  .object({
    firstName: z.string().min(2, "Enter at least 2 characters"),
    lastName: z.string().min(2, "Enter at least 2 characters"),
    email: z.string().email("Enter a valid email"),

    // Allow anything the browser/autofill provides; validate with libphonenumber only.
    mobileLocal: z.string().min(1, "Phone number is required"),

    mobileCountryISO: countryCodeSchema,

    dateOfBirth: z
      .string()
      .min(1, "Date of birth is required")
      .refine((v) => !Number.isNaN(Date.parse(v)), "Select a valid date"),

    goal: z.string().optional(),
    routineNote: z.string().optional(),
    skinTypes: z.array(z.string()).min(1, "Select at least one option"),
  })
  .superRefine((vals, ctx) => {
    const raw = (vals.mobileLocal ?? "").trim();
    if (!raw) return;

    const selectedISO = vals.mobileCountryISO as CountryCode;

    try {
      // strict: whole string must be a phone number
      const pn = parsePhoneNumber(raw, {
        defaultCountry: selectedISO,
        extract: false,
      });

      // must be valid
      if (!pn?.isValid()) {
        ctx.addIssue({
          code: "custom",
          path: ["mobileLocal"],
          message: "That number isn’t valid",
        });
        return;
      }

      // if user typed international (+...), ensure the parsed country matches the selected ISO
      if (raw.startsWith("+")) {
        if (!pn.country || pn.country !== selectedISO) {
          ctx.addIssue({
            code: "custom",
            path: ["mobileLocal"],
            message: "Number’s country doesn’t match the country you selected",
          });
        }
        return;
      }

      // if national (no +), it was validated against selected country via defaultCountry above
    } catch {
      ctx.addIssue({
        code: "custom",
        path: ["mobileLocal"],
        message: "That number isn’t valid",
      });
    }
  });

export type OnboardingSchema = z.input<typeof onboardingSchema>;

// Normalize to E.164 safely (null if invalid)
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
