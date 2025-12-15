// Test utilities for onboarding UI tests
import { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WizardProvider } from "../wizard.provider";
import { onboardingSchema, type OnboardingSchema } from "../onboarding.schema";
import type { StepMeta } from "../onboarding.types";

// Mock steps for testing
export const mockSteps: StepMeta[] = [
  {
    id: 1,
    slug: "step-1",
    headline: "Personal Details",
    subhead: "Tell us about yourself",
    bgImage: "/test.jpg",
    formTitle: "Your Information",
    formSub: "We need some basic information",
    component: "personal",
    align: "center",
  },
  {
    id: 2,
    slug: "step-2",
    headline: "Skin Type",
    subhead: "What is your skin type?",
    bgImage: "/test.jpg",
    formTitle: "Skin Type",
    formSub: "Select all that apply",
    component: "skinType",
    align: "center",
  },
  {
    id: 3,
    slug: "step-3",
    headline: "Skin Concerns",
    subhead: "What are your concerns?",
    bgImage: "/test.jpg",
    formTitle: "Concerns",
    formSub: "Select your main concerns",
    component: "concerns",
    align: "center",
  },
  {
    id: 4,
    slug: "step-4",
    headline: "Allergies",
    subhead: "Do you have any allergies?",
    bgImage: "/test.jpg",
    formTitle: "Allergy Information",
    formSub: "Let us know about any allergies",
    component: "allergies",
    align: "center",
  },
  {
    id: 5,
    slug: "step-5",
    headline: "Subscribe",
    subhead: "Complete your subscription",
    bgImage: "/test.jpg",
    formTitle: "Payment",
    formSub: "Subscribe to continue",
    component: "subscribe",
    align: "center",
  },
];

// Test wrapper component
function TestWrapper({ children }: { children: React.ReactNode }) {
  const methods = useForm<OnboardingSchema>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      userProfileId: undefined,
      firstName: "",
      lastName: "",
      email: "",
      mobileLocal: "",
      mobileCountryISO: "KE",
      dateOfBirth: "",
      goal: "",
      routineNote: "",
      skinTypes: [],
      concerns: [],
      concernOther: "",
      hasAllergy: "No",
      allergy: "",
    },
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  // Create a fresh QueryClient for each test
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 0,
        gcTime: 0,
      },
      mutations: {
        retry: 0,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <WizardProvider steps={mockSteps}>
        <FormProvider {...methods}>{children}</FormProvider>
      </WizardProvider>
    </QueryClientProvider>
  );
}

// Custom render function
function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) {
  return render(ui, { wrapper: TestWrapper, ...options });
}

// Re-export everything
export * from "@testing-library/react";
export { customRender as render };
