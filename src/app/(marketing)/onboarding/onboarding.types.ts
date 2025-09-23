// types.ts
import type { CountryCode } from "libphonenumber-js/min";

export type StepMeta = {
  id: number;
  slug: string;
  headline: string;
  subhead: string;
  bgImage: string;
  formTitle: string;
  formSub?: string;
  formInstruction?: string;
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

// one form shape
export type OnboardingSchema = {
  firstName: string;
  lastName: string;
  email: string;
  mobileLocal: string;
  mobileCountryISO: CountryCode;
  dateOfBirth: string; // yyyy-mm-dd
  goal?: string;
  routineNote?: string;
  skinTypes?: string[];
};

// derive the component key union from StepMeta
export type StepComponentKey = StepMeta["component"];

// and enforce the prop signature for each step component
export type StepComponent = React.ComponentType<{ onNext?: () => void }>;
