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
    resolver: zodResolver(onboardingSchema), // no generic here
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      mobileLocal: "",
      mobileCountryISO: "KE", // just a string
      dateOfBirth: "",
      goal: "",
      routineNote: "",
      skinTypes: [],
    },
    mode: "onTouched",
    reValidateMode: "onChange",
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
