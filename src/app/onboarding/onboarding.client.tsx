// app/(onboarding)/onboarding.client.tsx
"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import OnboardingForm from "./onboarding.form";
import OnboardingMarketing from "./onboarding.marketing";
import { WizardProvider } from "./wizard.provider";
import type { StepMeta } from "./onboarding.types";
import { onboardingSchema, type OnboardingSchema } from "./onboarding.schema";
import { getUserProfile, type UserProfile } from "./actions";
import { mapProfileToFormValues } from "./onboarding.utils";
import Footer from "../(marketing)/footer";

export default function OnboardingClient({ steps }: { steps: StepMeta[] }) {
  // Read URL params for payment return flow
  const searchParams = useSearchParams();
  const profileId = searchParams.get("profile_id");
  const paymentCanceled = searchParams.get("payment_canceled") === "true";
  const paymentSuccess = searchParams.get("payment_success") === "true";
  const isPaymentReturn = paymentCanceled || paymentSuccess;

  // Calculate initial step index for payment return (both success and canceled go to Step 5)
  const initialStepIndex = isPaymentReturn
    ? steps.findIndex((s) => s.component === "subscribe")
    : 0;

  // Fetch profile on payment return (success or canceled)
  // This populates the form so user can navigate back to previous steps
  const { data: profile } = useQuery({
    queryKey: ["profile-return", profileId],
    queryFn: async () => {
      if (!profileId) return null;
      const result = await getUserProfile(profileId);
      return result.success ? result.data : null;
    },
    enabled: isPaymentReturn && !!profileId,
  });

  // Map profile to form values when available
  const formValues = profile ? mapProfileToFormValues(profile) : undefined;

  const methods = useForm<OnboardingSchema>({
    resolver: zodResolver(onboardingSchema),
    // values prop syncs form with profile data automatically (no useEffect needed)
    values: formValues,
    defaultValues: {
      userProfileId: profileId ?? undefined,
      firstName: "",
      lastName: "",
      email: "",
      mobileLocal: "",
      mobileCountryISO: "GB",
      dateOfBirth: "",
      goal: "",
      routineNote: "",
      skinTypes: [],
      concerns: [],
      concernOther: "",
      hasAllergy: undefined,
      allergy: "",
    },
    mode: "onTouched", // validate on submit (official pattern)
    reValidateMode: "onChange", // then per-field after corrections
  });

  // Track identifying fields to detect "new account"
  const email = methods.watch("email");
  const mobileLocal = methods.watch("mobileLocal");
  const prevIdentityRef = useRef({ email: "", mobileLocal: "" });

  useEffect(() => {
    const prev = prevIdentityRef.current;
    const hasIdentityChanged =
      (prev.email && prev.email !== email) ||
      (prev.mobileLocal && prev.mobileLocal !== mobileLocal);

    // If user changed email or phone (indicating a different account),
    // reset all subsequent form fields
    if (hasIdentityChanged) {
      methods.setValue("skinTypes", []);
      methods.setValue("concerns", []);
      methods.setValue("concernOther", "");
      methods.setValue("hasAllergy", undefined);
      methods.setValue("allergy", "");
      methods.setValue("goal", "");
      methods.setValue("routineNote", "");
    }

    // Update tracked values
    prevIdentityRef.current = {
      email: email ?? "",
      mobileLocal: mobileLocal ?? "",
    };
  }, [email, mobileLocal, methods]);

  return (
    <WizardProvider steps={steps} initialStepIndex={initialStepIndex}>
      <FormProvider {...methods}>
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 md:h-[784px]">
            <OnboardingMarketing />
            <OnboardingForm />
          </div>
          <Footer />
        </>
      </FormProvider>
    </WizardProvider>
  );
}
