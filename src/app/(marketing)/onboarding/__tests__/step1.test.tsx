import { describe, it, expect, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { observable } from "@trpc/server/observable";
import Step1 from "../step1";
import { onboardingSchema, type OnboardingSchema } from "../onboarding.schema";
import { WizardProvider } from "../wizard.provider";
import type { StepMeta } from "../onboarding.types";
import { db, userProfiles } from "@/db";
import { eq } from "drizzle-orm";
import { appRouter } from "@/server/_app";
import { trpc } from "@/trpc/react";

// Create QueryClient ONCE - reuse across all tests
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

// Create tRPC client ONCE - reuse across all tests
const trpcClient = trpc.createClient({
  links: [
    () =>
      ({ op }) => {
        return observable((observer) => {
          (async () => {
            try {
              const caller = appRouter.createCaller({});

              // Get the nested procedure
              const pathParts = op.path.split('.');
              let procedure: any = caller;
              for (const part of pathParts) {
                procedure = procedure[part];
              }

              // Execute the procedure
              const data = await procedure(op.input);
              observer.next({ result: { type: 'data', data } });
              observer.complete();
            } catch (error: any) {
              observer.error({
                message: error.message,
                data: error.data,
                cause: error,
              });
            }
          })();
        });
      },
  ],
});

const mockSteps: StepMeta[] = [
  {
    id: 1,
    slug: "step-1",
    headline: "Test",
    subhead: "Test",
    bgImage: "/test.jpg",
    formTitle: "Test",
    formSub: "Test",
    component: "personal",
    align: "center",
  },
];

// Test wrapper component - simpler, no useState
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

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <WizardProvider steps={mockSteps}>
          <FormProvider {...methods}>{children}</FormProvider>
        </WizardProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

describe("Step1 - Email Validation", () => {
  afterEach(async () => {
    // Clean up test data
    await db.delete(userProfiles);
    // Clear React Query cache between tests
    queryClient.clear();
  });

  it("validates email format and shows error for invalid email", async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <Step1 />
      </TestWrapper>
    );

    // Fill form with valid data except invalid email
    await user.type(screen.getByPlaceholderText("First Name"), "John");
    await user.type(screen.getByPlaceholderText("Last Name"), "Doe");
    await user.type(screen.getByPlaceholderText("Email Address"), "notanemail");
    await user.type(screen.getByPlaceholderText("712 345 678"), "712345678");

    const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement;
    await user.type(dateInput!, "1990-01-01");

    // Submit form
    const continueButton = screen.getByRole("button", { name: /continue/i });
    await user.click(continueButton);

    // Verify email validation error appears
    await waitFor(() => {
      expect(screen.getByText("Enter a valid email")).toBeInTheDocument();
    });

    // Verify form did not submit (no profile created)
    const profile = await db.query.userProfiles.findFirst({
      where: (p, { eq }) => eq(p.email, "notanemail"),
    });
    expect(profile).toBeUndefined();
  });
});
