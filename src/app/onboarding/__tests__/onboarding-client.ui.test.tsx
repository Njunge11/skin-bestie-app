// UI tests for OnboardingClient - form population on payment return
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import OnboardingClient from "../onboarding.client";
import type { StepMeta } from "../onboarding.types";

// Mock next/navigation
import { useSearchParams } from "next/navigation";
vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(() => new URLSearchParams()),
  useRouter: vi.fn(() => ({ push: vi.fn() })),
}));

// Mock getUserProfile action
vi.mock("../actions", () => ({
  getUserProfile: vi.fn().mockResolvedValue({
    success: true,
    data: {
      id: "test-profile-123",
      email: "jane@example.com",
      firstName: "Jane",
      lastName: "Doe",
      phoneNumber: "+447123456789",
      dateOfBirth: "1990-05-15",
      skinType: ["Oily", "Combination"],
      concerns: ["Acne", "Pigmentation"],
      hasAllergies: true,
      allergyDetails: "Nuts, Shellfish",
      isSubscribed: false,
      hasCompletedBooking: null,
      completedSteps: ["PERSONAL", "SKIN_TYPE", "SKIN_CONCERNS", "ALLERGIES"],
      isCompleted: false,
      completedAt: null,
      createdAt: "2025-01-01",
      updatedAt: "2025-01-01",
    },
  }),
  updateUserProfile: vi.fn().mockResolvedValue({ success: true }),
  createUserProfile: vi.fn().mockResolvedValue({ success: true }),
  checkUserExists: vi.fn().mockResolvedValue({ exists: false }),
}));

// Mock OnboardingMarketing to simplify rendering
vi.mock("../onboarding.marketing", () => ({
  default: () => <div data-testid="marketing">Marketing</div>,
}));

// Mock Footer
vi.mock("../../(marketing)/footer", () => ({
  default: () => <div data-testid="footer">Footer</div>,
}));

const mockSteps: StepMeta[] = [
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
    align: "left",
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

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: 0, gcTime: 0 },
      mutations: { retry: 0 },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

describe("OnboardingClient - Form Population on Payment Return", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("NEXT_PUBLIC_PAYMENT_TYPE", "REDIRECT");
  });

  it("user returns from canceled payment, clicks Back, and sees allergy data populated", async () => {
    const user = userEvent.setup();

    // Simulate payment canceled return
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams(
        "payment_canceled=true&profile_id=test-profile-123",
      ) as unknown as ReturnType<typeof useSearchParams>,
    );

    renderWithProviders(<OnboardingClient steps={mockSteps} />);

    // User is on Step 5 (subscribe)
    expect(await screen.findByText(/step/i)).toBeInTheDocument();
    expect(screen.getByText(/5 of 5/i)).toBeInTheDocument();

    // User clicks Back
    await user.click(screen.getByRole("button", { name: /back/i }));

    // User is now on Step 4 (allergies) and sees their data
    expect(await screen.findByText(/4 of 5/i)).toBeInTheDocument();
    expect(screen.getByText(/allergy information/i)).toBeInTheDocument();

    // User sees "Yes" selected for allergies
    const yesRadio = screen.getByRole("radio", { name: /yes/i });
    expect(yesRadio).toBeChecked();

    // User sees allergy details populated
    const allergyInput = screen.getByRole("textbox");
    expect(allergyInput).toHaveValue("Nuts, Shellfish");
  });
});
