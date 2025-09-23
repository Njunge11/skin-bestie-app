// Single source of truth types
import type { CountryCode } from "libphonenumber-js/min";

export type StepMeta = {
  id: number;
  slug: string;
  headline: string;
  subhead: string;
  bgImage: string;
  formTitle: string;
  formSub: string;
  component: "personal" | "skinType" | "concerns" | "allergies" | "checkout";
  align?: "left" | "center";
};

export type WizardCtx = {
  stepIndex: number;
  setStepIndex: (i: number) => void;
  next: () => void;
  back: () => void;
  steps: StepMeta[];
  current: StepMeta;
  total: number;
};

// ONE form shape used everywhere
export type OnboardingSchema = {
  firstName: string;
  lastName: string;
  email: string;
  mobileLocal: string; // user-typed digits
  mobileCountryISO: CountryCode; // full union from the lib
  dateOfBirth: string; // yyyy-mm-dd
  goal?: string;
  routineNote?: string;
  skinTypes?: string[];
};
