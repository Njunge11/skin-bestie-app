import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DashboardPage from "../../page";

// Mock server actions
vi.mock("../setup-dashboard-actions", () => ({
  fetchDashboardAction: vi.fn(),
  updateNickname: vi.fn(),
  updateSkinTest: vi.fn(),
  confirmProductsReceived: vi.fn(),
  updateRoutineStartDate: vi.fn(),
}));

// Mock toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

import {
  fetchDashboardAction,
  confirmProductsReceived,
  updateRoutineStartDate,
} from "../setup-dashboard-actions";
import { toast } from "sonner";
import type { DashboardResponse } from "../../schemas";

// Helper to render with QueryClient
function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

// Mock dashboard data factory
const createMockDashboard = (
  overrides: Record<string, unknown> = {},
): DashboardResponse => {
  const steps = {
    hasCompletedSkinTest: true,
    hasPublishedGoals: true,
    hasPublishedRoutine: true,
    hasCompletedBooking: true,
    productsReceived: false,
    routineStartDateSet: false,
    ...(overrides.steps as Record<string, boolean>),
  };

  return {
    user: {
      userId: "user-1",
      userProfileId: "profile-1",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phoneNumber: "+1234567890",
      dateOfBirth: "1990-01-01T00:00:00.000Z",
      nickname: "John",
      skinType: ["normal"],
      concerns: ["acne"],
      hasAllergies: false,
      allergyDetails: null,
      isSubscribed: true,
      occupation: null,
      bio: null,
      timezone: "America/New_York",
      profileTags: [],
    },
    setupProgress: {
      steps,
      completed: Object.values(steps).filter(Boolean).length,
      total: 6,
      percentage: Math.round(
        (Object.values(steps).filter(Boolean).length / 6) * 100,
      ),
    },
    goalsAcknowledgedByClient: false,
    goals: [
      {
        id: "goal-1",
        description: "Achieve clear, healthy skin",
        complete: false,
        completedAt: null,
        order: 1,
        isPrimaryGoal: true,
        timeline: "3 months",
      },
    ],
    routine: {
      id: "routine-1",
      name: "Daily Routine",
      startDate:
        ((overrides.routine as Record<string, unknown>)?.startDate as string) ||
        "2025-01-01",
      endDate: null,
      productPurchaseInstructions: "Buy from pharmacy",
      morning: [],
      evening: [],
      ...(overrides.routine as Record<string, unknown>),
    },
    todayRoutine: null,
    catchupSteps: null,
    ...overrides,
  };
};

/**
 * Products Purchased Workflow - Integration Tests
 *
 * Testing philosophy (Kent C. Dodds):
 * - Complete user workflows from start to finish
 * - Test user-visible behavior, not implementation
 * - Mock at network boundary (server actions only)
 * - Use real components (no mocking UI components)
 * - Query by accessibility (getByRole, getByLabelText)
 * - Use userEvent for realistic interactions
 */

describe("Products Purchased Workflow - Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mocks
    vi.mocked(confirmProductsReceived).mockResolvedValue({
      success: true,
      data: {},
    });

    vi.mocked(updateRoutineStartDate).mockResolvedValue({
      success: true,
      data: {},
    });
  });

  describe("Flow 1: Complete workflow (both false → both true)", () => {
    it("user confirms products and sets start date in one flow", async () => {
      const user = userEvent.setup();

      // Initial state: both false
      vi.mocked(fetchDashboardAction).mockResolvedValue(
        createMockDashboard({
          steps: { productsReceived: false, routineStartDateSet: false },
        }),
      );

      renderWithQueryClient(<DashboardPage />);

      // User sees Step 5 with "Confirm Products Received" button
      expect(
        await screen.findByText(/purchase your products/i),
      ).toBeInTheDocument();
      const confirmButton = screen.getByRole("button", {
        name: /confirm products received/i,
      });
      expect(confirmButton).toBeInTheDocument();

      // User clicks button → ProductsPurchasedModal opens
      await user.click(confirmButton);

      // User sees "Have You Purchased Your Products?" screen
      expect(
        await screen.findByRole("heading", {
          name: /have you purchased your products/i,
        }),
      ).toBeInTheDocument();

      // User clicks "Yes, I've Received Them"
      await user.click(
        screen.getByRole("button", { name: /yes, i've received them/i }),
      );

      // API call happens
      await waitFor(() => {
        expect(confirmProductsReceived).toHaveBeenCalled();
      });

      // Toast confirms products received
      expect(toast.success).toHaveBeenCalledWith("Products confirmed!");

      // Modal moves to date selection screen
      expect(
        await screen.findByRole("heading", {
          name: /when would you like to start/i,
        }),
      ).toBeInTheDocument();

      // User selects "Start Today"
      await user.click(screen.getByRole("button", { name: /start today/i }));

      // User confirms
      await user.click(
        screen.getByRole("button", { name: /confirm and start routine/i }),
      );

      // API call happens
      await waitFor(() => {
        expect(updateRoutineStartDate).toHaveBeenCalled();
      });

      // Toast confirms date set
      expect(toast.success).toHaveBeenCalledWith(
        "Start date set!",
        expect.objectContaining({
          description: expect.stringContaining("Your routine will start on"),
        }),
      );

      // Modal closes
      await waitFor(() => {
        expect(
          screen.queryByRole("heading", {
            name: /when would you like to start/i,
          }),
        ).not.toBeInTheDocument();
      });
    });

    it("user selects tomorrow as start date", async () => {
      const user = userEvent.setup();

      vi.mocked(fetchDashboardAction).mockResolvedValue(
        createMockDashboard({
          steps: { productsReceived: false, routineStartDateSet: false },
        }),
      );

      renderWithQueryClient(<DashboardPage />);

      // Open modal
      await user.click(
        await screen.findByRole("button", {
          name: /confirm products received/i,
        }),
      );

      // Confirm products
      await user.click(
        await screen.findByRole("button", { name: /yes, i've received them/i }),
      );

      // Wait for date selection screen
      await screen.findByRole("heading", {
        name: /when would you like to start/i,
      });

      // Select tomorrow
      await user.click(screen.getByRole("button", { name: /start tomorrow/i }));

      // Confirm
      await user.click(
        screen.getByRole("button", { name: /confirm and start routine/i }),
      );

      // Verify API called with tomorrow's date
      await waitFor(() => {
        expect(updateRoutineStartDate).toHaveBeenCalledWith(
          "routine-1",
          expect.any(Date),
        );
      });
    });

    it("user selects custom date from calendar", async () => {
      const user = userEvent.setup();

      vi.mocked(fetchDashboardAction).mockResolvedValue(
        createMockDashboard({
          steps: { productsReceived: false, routineStartDateSet: false },
        }),
      );

      renderWithQueryClient(<DashboardPage />);

      // Open modal and confirm products
      await user.click(
        await screen.findByRole("button", {
          name: /confirm products received/i,
        }),
      );
      await user.click(
        await screen.findByRole("button", { name: /yes, i've received them/i }),
      );

      // Wait for date selection
      await screen.findByRole("heading", {
        name: /when would you like to start/i,
      });

      // Click "Specify a Date"
      await user.click(screen.getByRole("button", { name: /specify a date/i }));

      // Open calendar
      await user.click(screen.getByRole("button", { name: /pick a date/i }));

      // Select a future date (5 days from now)
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 5);
      const futureDateButton = screen.getByRole("button", {
        name: new RegExp(futureDate.getDate().toString()),
      });
      await user.click(futureDateButton);

      // Confirm
      await user.click(
        screen.getByRole("button", { name: /confirm and start routine/i }),
      );

      // Verify API called
      await waitFor(() => {
        expect(updateRoutineStartDate).toHaveBeenCalled();
      });
    });
  });

  describe("Flow 2: Products confirmed, no date set", () => {
    it("user sees 'Set Your Start Date' button and can set date directly", async () => {
      const user = userEvent.setup();

      // Products confirmed but no date
      vi.mocked(fetchDashboardAction).mockResolvedValue(
        createMockDashboard({
          steps: { productsReceived: true, routineStartDateSet: false },
        }),
      );

      renderWithQueryClient(<DashboardPage />);

      // User sees "Set Your Start Date" button (NOT "Confirm Products Received")
      const setDateButton = await screen.findByRole("button", {
        name: /set your start date/i,
      });
      expect(setDateButton).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: /confirm products received/i }),
      ).not.toBeInTheDocument();

      // User clicks button → Opens ChangeStartDateModal directly
      await user.click(setDateButton);

      // Modal opens at date selection (NOT products confirmation)
      expect(
        await screen.findByRole("heading", {
          name: /change your start date/i,
        }),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("heading", {
          name: /have you purchased your products/i,
        }),
      ).not.toBeInTheDocument();

      // User selects today
      await user.click(screen.getByRole("button", { name: /start today/i }));

      // User confirms
      await user.click(
        screen.getByRole("button", { name: /confirm new date/i }),
      );

      // API call happens
      await waitFor(() => {
        expect(updateRoutineStartDate).toHaveBeenCalled();
      });

      // confirmProductsReceived should NOT be called
      expect(confirmProductsReceived).not.toHaveBeenCalled();
    });
  });

  describe("Flow 3: Both true → Change date", () => {
    it("user changes existing start date", async () => {
      const user = userEvent.setup();

      const originalDate = new Date();
      originalDate.setDate(originalDate.getDate() + 5);

      // Both true, with existing start date
      vi.mocked(fetchDashboardAction).mockResolvedValue(
        createMockDashboard({
          steps: { productsReceived: true, routineStartDateSet: true },
          routine: { id: "routine-1", startDate: originalDate.toISOString() },
        }),
      );

      renderWithQueryClient(<DashboardPage />);

      // User sees "Change Start Date" button and date display
      const changeButton = await screen.findByRole("button", {
        name: /change start date/i,
      });
      expect(changeButton).toBeInTheDocument();
      expect(screen.getByText(/your routine starts on/i)).toBeInTheDocument();

      // User clicks "Change Start Date"
      await user.click(changeButton);

      // ChangeStartDateModal opens
      expect(
        await screen.findByRole("heading", {
          name: /change your start date/i,
        }),
      ).toBeInTheDocument();

      // User selects tomorrow
      await user.click(screen.getByRole("button", { name: /start tomorrow/i }));

      // User confirms
      await user.click(
        screen.getByRole("button", { name: /confirm new date/i }),
      );

      // API call happens
      await waitFor(() => {
        expect(updateRoutineStartDate).toHaveBeenCalled();
      });

      // Toast shows success
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          "Start date updated!",
          expect.objectContaining({
            description: expect.stringContaining(
              "Your routine will now start on",
            ),
          }),
        );
      });
    });
  });

  describe("Flow 4: Error recovery", () => {
    it("user encounters error confirming products and retries successfully", async () => {
      const user = userEvent.setup();

      vi.mocked(fetchDashboardAction).mockResolvedValue(
        createMockDashboard({
          steps: { productsReceived: false, routineStartDateSet: false },
        }),
      );

      // First call fails, second succeeds
      vi.mocked(confirmProductsReceived)
        .mockResolvedValueOnce({
          success: false,
          error: { message: "Network error", code: "NETWORK_ERROR" },
        })
        .mockResolvedValueOnce({
          success: true,
          data: {},
        });

      renderWithQueryClient(<DashboardPage />);

      // Open modal
      await user.click(
        await screen.findByRole("button", {
          name: /confirm products received/i,
        }),
      );

      // Confirm products (this will fail)
      await user.click(
        await screen.findByRole("button", { name: /yes, i've received them/i }),
      );

      // Error toast shown
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          "Failed to confirm products received",
          expect.objectContaining({
            description: expect.stringContaining("Network error"),
          }),
        );
      });

      // User still on products confirmation screen (not moved to date selection)
      expect(
        screen.getByRole("heading", {
          name: /have you purchased your products/i,
        }),
      ).toBeInTheDocument();

      // User retries
      await user.click(
        screen.getByRole("button", { name: /yes, i've received them/i }),
      );

      // Success this time
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith("Products confirmed!");
      });

      // Now moved to date selection
      expect(
        await screen.findByRole("heading", {
          name: /when would you like to start/i,
        }),
      ).toBeInTheDocument();
    });

    it("user encounters error setting start date and retries successfully", async () => {
      const user = userEvent.setup();

      vi.mocked(fetchDashboardAction).mockResolvedValue(
        createMockDashboard({
          steps: { productsReceived: true, routineStartDateSet: false },
        }),
      );

      // First call fails, second succeeds
      vi.mocked(updateRoutineStartDate)
        .mockResolvedValueOnce({
          success: false,
          error: { message: "Timeout", code: "TIMEOUT" },
        })
        .mockResolvedValueOnce({
          success: true,
          data: {},
        });

      renderWithQueryClient(<DashboardPage />);

      // Open date modal
      await user.click(
        await screen.findByRole("button", { name: /set your start date/i }),
      );

      // Select date
      await user.click(
        await screen.findByRole("button", { name: /start today/i }),
      );

      // Confirm (this will fail)
      await user.click(
        screen.getByRole("button", { name: /confirm new date/i }),
      );

      // Error toast shown
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          "Failed to update start date",
          expect.objectContaining({
            description: expect.stringContaining("Timeout"),
          }),
        );
      });

      // Modal stays open on error so user can retry
      expect(
        screen.getByRole("heading", { name: /change your start date/i }),
      ).toBeInTheDocument();

      // User retries (date still selected from before)
      await user.click(
        screen.getByRole("button", { name: /confirm new date/i }),
      );

      // Success this time
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          "Start date updated!",
          expect.objectContaining({
            description: expect.stringContaining(
              "Your routine will now start on",
            ),
          }),
        );
      });
    });
  });

  describe("Flow 5: User clicks 'Not Yet'", () => {
    it("user clicks 'Not Yet' and sees friendly message", async () => {
      const user = userEvent.setup();

      vi.mocked(fetchDashboardAction).mockResolvedValue(
        createMockDashboard({
          steps: { productsReceived: false, routineStartDateSet: false },
        }),
      );

      renderWithQueryClient(<DashboardPage />);

      // Open modal
      await user.click(
        await screen.findByRole("button", {
          name: /confirm products received/i,
        }),
      );

      // Click "Not Yet"
      await user.click(await screen.findByRole("button", { name: /not yet/i }));

      // User sees friendly message
      expect(
        await screen.findByRole("heading", { name: /no problem/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/once your products arrive/i),
      ).toBeInTheDocument();

      // User clicks "Got It"
      await user.click(screen.getByRole("button", { name: /got it/i }));

      // Modal closes
      await waitFor(() => {
        expect(
          screen.queryByRole("heading", { name: /no problem/i }),
        ).not.toBeInTheDocument();
      });

      // No API calls made
      expect(confirmProductsReceived).not.toHaveBeenCalled();
      expect(updateRoutineStartDate).not.toHaveBeenCalled();
    });

    it("user clicks 'Not Yet', then changes mind via 'Back' button", async () => {
      const user = userEvent.setup();

      vi.mocked(fetchDashboardAction).mockResolvedValue(
        createMockDashboard({
          steps: { productsReceived: false, routineStartDateSet: false },
        }),
      );

      renderWithQueryClient(<DashboardPage />);

      // Open modal
      await user.click(
        await screen.findByRole("button", {
          name: /confirm products received/i,
        }),
      );

      // Click "Not Yet"
      await user.click(await screen.findByRole("button", { name: /not yet/i }));

      // On "Not Yet" screen
      expect(
        await screen.findByRole("heading", { name: /no problem/i }),
      ).toBeInTheDocument();

      // User clicks "Back"
      await user.click(screen.getByRole("button", { name: /back/i }));

      // Back to products confirmation screen
      expect(
        await screen.findByRole("heading", {
          name: /have you purchased your products/i,
        }),
      ).toBeInTheDocument();

      // User can now confirm products
      await user.click(
        screen.getByRole("button", { name: /yes, i've received them/i }),
      );

      // Success
      await waitFor(() => {
        expect(confirmProductsReceived).toHaveBeenCalled();
      });
    });
  });

  describe("Validation", () => {
    it("confirm button disabled until date option is selected", async () => {
      const user = userEvent.setup();

      vi.mocked(fetchDashboardAction).mockResolvedValue(
        createMockDashboard({
          steps: { productsReceived: false, routineStartDateSet: false },
        }),
      );

      renderWithQueryClient(<DashboardPage />);

      // Open modal and confirm products
      await user.click(
        await screen.findByRole("button", {
          name: /confirm products received/i,
        }),
      );
      await user.click(
        await screen.findByRole("button", { name: /yes, i've received them/i }),
      );

      // On date selection screen
      await screen.findByRole("heading", {
        name: /when would you like to start/i,
      });

      // Confirm button should be disabled
      const confirmButton = screen.getByRole("button", {
        name: /confirm and start routine/i,
      });
      expect(confirmButton).toBeDisabled();

      // Select an option
      await user.click(screen.getByRole("button", { name: /start today/i }));

      // Now enabled
      expect(confirmButton).not.toBeDisabled();
    });

    it("custom date requires picking from calendar", async () => {
      const user = userEvent.setup();

      vi.mocked(fetchDashboardAction).mockResolvedValue(
        createMockDashboard({
          steps: { productsReceived: false, routineStartDateSet: false },
        }),
      );

      renderWithQueryClient(<DashboardPage />);

      // Navigate to date selection
      await user.click(
        await screen.findByRole("button", {
          name: /confirm products received/i,
        }),
      );
      await user.click(
        await screen.findByRole("button", { name: /yes, i've received them/i }),
      );
      await screen.findByRole("heading", {
        name: /when would you like to start/i,
      });

      // Select "Specify a Date"
      await user.click(screen.getByRole("button", { name: /specify a date/i }));

      // Confirm button still disabled (no date picked)
      expect(
        screen.getByRole("button", { name: /confirm and start routine/i }),
      ).toBeDisabled();

      // Open calendar and pick a date
      await user.click(screen.getByRole("button", { name: /pick a date/i }));
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 3);
      await user.click(
        screen.getByRole("button", {
          name: new RegExp(futureDate.getDate().toString()),
        }),
      );

      // Now enabled
      expect(
        screen.getByRole("button", { name: /confirm and start routine/i }),
      ).not.toBeDisabled();
    });

    it("Step 5 (Purchase Products) only shows when routine is published", async () => {
      // Scenario 1: Routine NOT published - Step 5 should not be visible
      vi.mocked(fetchDashboardAction).mockResolvedValue(
        createMockDashboard({
          steps: {
            hasCompletedSkinTest: true,
            hasPublishedGoals: true,
            hasPublishedRoutine: false, // Routine not published yet
            hasCompletedBooking: true,
            productsReceived: false,
            routineStartDateSet: false,
          },
        }),
      );

      const { unmount } = renderWithQueryClient(<DashboardPage />);

      // Wait for dashboard to load
      await screen.findByText(/welcome to skinbestie/i);

      // Step 5 should NOT be visible
      expect(
        screen.queryByText(/purchase your products/i),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: /confirm products received/i }),
      ).not.toBeInTheDocument();

      unmount();

      // Scenario 2: Routine IS published - Step 5 should be visible
      vi.mocked(fetchDashboardAction).mockResolvedValue(
        createMockDashboard({
          steps: {
            hasCompletedSkinTest: true,
            hasPublishedGoals: true,
            hasPublishedRoutine: true, // Routine published
            hasCompletedBooking: true,
            productsReceived: false,
            routineStartDateSet: false,
          },
        }),
      );

      renderWithQueryClient(<DashboardPage />);

      // Wait for dashboard to load
      await screen.findByText(/welcome to skinbestie/i);

      // Step 5 SHOULD be visible
      expect(
        await screen.findByText(/purchase your products/i),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /confirm products received/i }),
      ).toBeInTheDocument();
    });
  });
});
