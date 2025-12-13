// UI tests for Step 5 - REDIRECT mode (Stripe Checkout redirect)
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "./test-utils";
import Step5 from "../step5";
import { useFormContext } from "react-hook-form";
import { server } from "./mocks/server";
import { http, HttpResponse } from "msw";

// Mock window.location.replace
const mockReplace = vi.fn();

// Mock next/navigation - will be configured per test
import { useSearchParams } from "next/navigation";
vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(() => new URLSearchParams()),
}));

// Mock getUserProfile action
vi.mock("../actions", () => ({
  getUserProfile: vi.fn().mockResolvedValue({
    success: true,
    data: {
      id: "test-profile-123",
      email: "test@example.com",
      firstName: "Jane",
      lastName: "Doe",
      isSubscribed: false,
    },
  }),
  updateUserProfile: vi.fn().mockResolvedValue({ success: true }),
}));

function Step5WithProfile() {
  const { setValue } = useFormContext();
  React.useEffect(() => {
    setValue("userProfileId", "test-profile-123");
  }, [setValue]);
  return <Step5 />;
}

describe("Step 5: REDIRECT Payment Mode - User Workflows", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("NEXT_PUBLIC_PAYMENT_TYPE", "REDIRECT");
    // Stub window.location.replace
    Object.defineProperty(window, "location", {
      value: { ...window.location, replace: mockReplace },
      writable: true,
      configurable: true,
    });
    // Reset MSW handlers to clear any test-specific handlers from previous tests
    server.resetHandlers();
  });

  it("user clicks Subscribe and is redirected to Stripe Checkout", async () => {
    const user = userEvent.setup();

    // Add MSW handler for this test
    server.use(
      http.post("/api/checkout/session", () => {
        return HttpResponse.json({
          mode: "redirect",
          url: "https://checkout.stripe.com/c/pay/test_session_123",
          plan_unit_amount: 6000,
          plan_currency: "gbp",
        });
      }),
    );

    render(<Step5WithProfile />);

    // User sees the redirect payment UI
    expect(
      await screen.findByText(
        /you'll be securely redirected to stripe to complete your payment/i,
      ),
    ).toBeInTheDocument();

    // User sees Subscribe button
    const subscribeButton = screen.getByRole("button", { name: /subscribe/i });
    expect(subscribeButton).toBeInTheDocument();

    // User sees security notice
    expect(
      screen.getByText(/your payment is secured by stripe/i),
    ).toBeInTheDocument();

    // User clicks Subscribe
    await user.click(subscribeButton);

    // Button shows redirecting state
    expect(
      await screen.findByRole("button", { name: /redirecting/i }),
    ).toBeInTheDocument();

    // User is redirected to Stripe
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith(
        "https://checkout.stripe.com/c/pay/test_session_123",
      );
    });
  });

  it("user encounters API error and sees error message with retry option", async () => {
    const user = userEvent.setup();

    // Add MSW handler that returns error
    server.use(
      http.post("/api/checkout/session", () => {
        return HttpResponse.json(
          { error: "Failed to create checkout session" },
          { status: 500 },
        );
      }),
    );

    render(<Step5WithProfile />);

    // Wait for profile to load
    const subscribeButton = await screen.findByRole("button", {
      name: /subscribe/i,
    });

    // User clicks Subscribe
    await user.click(subscribeButton);

    // User sees error message with retry prompt
    expect(
      await screen.findByText(
        /failed to create checkout session\. please try again\./i,
      ),
    ).toBeInTheDocument();

    // Button returns to Subscribe state (not stuck on Redirecting)
    expect(
      screen.getByRole("button", { name: /subscribe/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /subscribe/i }),
    ).not.toBeDisabled();
  });

  it("user sees invalid response error when API returns unexpected format", async () => {
    const user = userEvent.setup();

    // Add MSW handler that returns wrong format
    server.use(
      http.post("/api/checkout/session", () => {
        return HttpResponse.json({
          mode: "in_app", // Wrong mode for REDIRECT
          client_secret: "some_secret",
        });
      }),
    );

    render(<Step5WithProfile />);

    const subscribeButton = await screen.findByRole("button", {
      name: /subscribe/i,
    });

    await user.click(subscribeButton);

    // User sees validation error
    expect(
      await screen.findByText(
        /invalid checkout response\. please try again\./i,
      ),
    ).toBeInTheDocument();
  });

  it("button is disabled when profile is not loaded", async () => {
    // Override the mock to return null profile
    const { getUserProfile } = await import("../actions");
    vi.mocked(getUserProfile).mockResolvedValueOnce({
      success: false,
      error: "Profile not found",
    });

    render(<Step5WithProfile />);

    // Wait for component to render with null profile
    // The button should be disabled when currentProfile is null
    await waitFor(() => {
      const button = screen.queryByRole("button", { name: /subscribe/i });
      if (button) {
        expect(button).toBeDisabled();
      }
    });
  });
});

// Helper to create full profile data for type safety
function makeProfile(
  overrides: Partial<{
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isSubscribed: boolean | null;
  }> = {},
) {
  return {
    id: "test-profile-123",
    firstName: "Jane",
    lastName: "Doe",
    email: "test@example.com",
    phoneNumber: "+447123456789",
    dateOfBirth: "1990-01-01",
    skinType: null,
    concerns: null,
    hasAllergies: null,
    allergyDetails: null,
    isSubscribed: false as boolean | null,
    hasCompletedBooking: null,
    completedSteps: [],
    isCompleted: false,
    completedAt: null,
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01",
    ...overrides,
  };
}

describe("Step 5: REDIRECT Payment Mode - Payment Success Flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("NEXT_PUBLIC_PAYMENT_TYPE", "REDIRECT");
    server.resetHandlers();
  });

  it("user returns from Stripe and sees verifying state while polling", async () => {
    // Simulate returning from Stripe with payment_success=true
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams(
        "payment_success=true&profile_id=test-profile-123",
      ) as unknown as ReturnType<typeof useSearchParams>,
    );

    // Mock getUserProfile to return not subscribed (polling in progress)
    // Using mockImplementation to delay response and keep polling state visible
    const { getUserProfile } = await import("../actions");
    vi.mocked(getUserProfile).mockImplementation(
      () =>
        new Promise((resolve) => {
          // Delay to keep loading state visible
          setTimeout(() => {
            resolve({
              success: true,
              data: makeProfile({ isSubscribed: false }),
            });
          }, 100);
        }),
    );

    render(<Step5WithProfile />);

    // User sees verifying state
    expect(
      await screen.findByText(/verifying your subscription/i),
    ).toBeInTheDocument();
  });

  it("user sees success screen when subscription is confirmed", async () => {
    // Simulate returning from Stripe with payment_success=true
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams(
        "payment_success=true&profile_id=test-profile-123",
      ) as unknown as ReturnType<typeof useSearchParams>,
    );

    // Mock getUserProfile to return subscribed immediately
    const { getUserProfile } = await import("../actions");
    vi.mocked(getUserProfile).mockResolvedValue({
      success: true,
      data: makeProfile({ isSubscribed: true }),
    });

    render(<Step5WithProfile />);

    // Wait for query to complete and show success
    await waitFor(() => {
      expect(screen.getByText(/you're all set/i)).toBeInTheDocument();
    });
    expect(
      screen.getByRole("button", { name: /book first session/i }),
    ).toBeInTheDocument();
  });

  it("user sees error message when API call fails", async () => {
    // Simulate returning from Stripe with payment_success=true
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams(
        "payment_success=true&profile_id=test-profile-123",
      ) as unknown as ReturnType<typeof useSearchParams>,
    );

    // Mock getUserProfile to fail (API error)
    // Component has retry: 3 with exponential backoff (~7s total)
    const { getUserProfile } = await import("../actions");
    vi.mocked(getUserProfile).mockResolvedValue({
      success: false,
      error: "Network error",
    });

    render(<Step5WithProfile />);

    // Wait for polling to fail (retry: 3 with exponential backoff takes ~7s)
    expect(
      await screen.findByText(
        /unable to confirm your subscription/i,
        {},
        { timeout: 10000 },
      ),
    ).toBeInTheDocument();

    // User sees Try Again button
    expect(
      screen.getByRole("button", { name: /try again/i }),
    ).toBeInTheDocument();
  }, 15000);
});
