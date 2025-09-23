// app/(onboarding)/onboarding.client.tsx
"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import OnboardingForm from "./onboarding.form";
import OnboardingMarketing from "./onboarding.marketing";
import { WizardProvider } from "./wizard.provider";
import type { StepMeta } from "./onboarding.types";
import { onboardingSchema, type OnboardingSchema } from "./onboarding.schema";

export default function OnboardingClient({ steps }: { steps: StepMeta[] }) {
  const methods = useForm<OnboardingSchema>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      mobileLocal: "",
      mobileCountryISO: "KE",
      dateOfBirth: "",
      goal: "",
      routineNote: "",
      skinTypes: [],
    },
    mode: "onTouched", // validate on submit (official pattern)
    reValidateMode: "onChange", // then per-field after corrections
  });

  return (
    <WizardProvider steps={steps}>
      <FormProvider {...methods}>
        <div className="grid grid-cols-1 md:grid-cols-2 md:h-[784px]">
          <OnboardingMarketing />
          <OnboardingForm />
        </div>
      </FormProvider>
    </WizardProvider>
  );
}
