import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DashboardPage from "../page";

// Mock server actions
vi.mock("../setup-dashboard/setup-dashboard-actions", () => ({
  fetchDashboardAction: vi.fn(),
  updateNickname: vi.fn(),
  updateSkinTest: vi.fn(),
}));

import { fetchDashboardAction } from "../setup-dashboard/setup-dashboard-actions";

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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createMockDashboard = (overrides: any = {}) => {
  const steps = {
    hasCompletedBooking: true,
    hasCompletedSkinTest: true,
    hasPublishedGoals: true,
    hasPublishedRoutine: false,
    ...overrides.steps,
  };

  return {
    user: {
      id: "user-1",
      firstName: "John",
      lastName: "Doe",
      nickname: "Johnny",
      email: "john@example.com",
      phoneNumber: "+1234567890",
      skinType: ["oily"],
      dateOfBirth: "1990-01-01T00:00:00.000Z",
      concerns: ["acne"],
      hasAllergies: false,
      allergyDetails: null,
      isSubscribed: true,
      occupation: null,
      bio: null,
      timezone: "America/New_York",
      ...overrides.user,
    },
    setupProgress: {
      steps,
      completed: Object.values(steps).filter(Boolean).length,
      total: 4,
      percentage: (Object.values(steps).filter(Boolean).length / 4) * 100,
      ...overrides.setupProgress,
    },
    // Goals NOT acknowledged - this prevents setup from being complete
    goalsAcknowledgedByClient: false,
    goals: [],
    routine: null,
    todayRoutine: null,
    catchupSteps: null,
    ...overrides,
  };
};

/**
 * SETUP DASHBOARD - VIEW ROUTINE WORKFLOW TESTS
 *
 * Testing Strategy (per Kent C. Dodds & UI_TESTING.md):
 * - Complete user workflows from start to finish
 * - Test user-visible behavior, not implementation
 * - Mock at network boundary (server actions only)
 * - Use real components (no mocking UI components)
 * - Query by accessibility (getByRole, getByText)
 * - Use userEvent for realistic interactions
 */

describe("Setup Dashboard - View Routine Workflow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("user views published routine with morning and evening steps", async () => {
    const user = userEvent.setup();

    // Mock dashboard with published routine
    vi.mocked(fetchDashboardAction).mockResolvedValue(
      createMockDashboard({
        steps: {
          hasCompletedBooking: true,
          hasCompletedSkinTest: true,
          hasPublishedGoals: true,
          hasPublishedRoutine: true,
        },
        routine: {
          id: "routine-1",
          name: "Custom Routine",
          startDate: "2025-11-01",
          endDate: null,
          productPurchaseInstructions: null,
          morning: [
            {
              id: "morning-1",
              routineStep: "Cleanser",
              productName: "CeraVe Hydrating Cleanser",
              productUrl: "https://example.com/cleanser",
              instructions:
                "Apply to wet face, massage gently, rinse with water",
              frequency: "daily",
              days: null,
              timeOfDay: "morning",
              order: 1,
            },
            {
              id: "morning-2",
              routineStep: "Moisturizer",
              productName: "CeraVe Daily Moisturizing Lotion",
              productUrl: "https://example.com/moisturizer",
              instructions: "Apply to clean skin, use generous amount",
              frequency: "daily",
              days: null,
              timeOfDay: "morning",
              order: 2,
            },
          ],
          evening: [
            {
              id: "evening-1",
              routineStep: "Cleanser",
              productName: "CeraVe Foaming Facial Cleanser",
              productUrl: "https://example.com/cleanser-evening",
              instructions: "Massage onto face, rinse thoroughly",
              frequency: "daily",
              days: null,
              timeOfDay: "evening",
              order: 1,
            },
          ],
        },
      }),
    );

    renderWithQueryClient(<DashboardPage />);

    // User sees setup steps page
    expect(
      await screen.findByText("Essential Setup Steps"),
    ).toBeInTheDocument();

    // User sees "View Routine" button
    const viewButton = screen.getByRole("button", { name: /view routine/i });
    expect(viewButton).toBeInTheDocument();

    // User clicks button
    await user.click(viewButton);

    // Modal opens with heading
    expect(
      await screen.findByRole("heading", { name: /your custom routine/i }),
    ).toBeInTheDocument();

    // User sees description
    expect(
      screen.getByText(
        /your personalised skincare routine tailored to your needs/i,
      ),
    ).toBeInTheDocument();

    // User sees switcher component
    expect(
      screen.getByText(/switch to view your morning or evening routine/i),
    ).toBeInTheDocument();

    // User sees morning routine by default
    expect(
      screen.getByText("Morning Routine", { selector: "span" }),
    ).toBeInTheDocument();

    // User sees morning products
    expect(
      screen.getAllByText("CeraVe Hydrating Cleanser")[0],
    ).toBeInTheDocument();
    expect(
      screen.getAllByText("CeraVe Daily Moisturizing Lotion")[0],
    ).toBeInTheDocument();

    // Evening product should NOT be visible yet (not active tab)
    expect(
      screen.queryByText("CeraVe Foaming Facial Cleanser"),
    ).not.toBeInTheDocument();

    // User clicks evening button to switch
    const eveningButton = screen.getByRole("button", { name: /🌙/i });
    await user.click(eveningButton);

    // User sees evening routine heading
    expect(
      screen.getByText("Evening Routine", { selector: "span" }),
    ).toBeInTheDocument();

    // User sees evening product
    expect(
      screen.getAllByText("CeraVe Foaming Facial Cleanser")[0],
    ).toBeInTheDocument();

    // Morning products should NOT be visible now
    expect(
      screen.queryByText("CeraVe Hydrating Cleanser"),
    ).not.toBeInTheDocument();

    // User clicks Close button (the main button, not the X)
    const closeButtons = screen.getAllByRole("button", { name: /close/i });
    // The last button is the main "Close" button at the bottom
    await user.click(closeButtons[closeButtons.length - 1]);

    // Modal closes
    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: /your custom routine/i }),
      ).not.toBeInTheDocument();
    });
  });

  it("user views routine with only morning steps", async () => {
    const user = userEvent.setup();

    vi.mocked(fetchDashboardAction).mockResolvedValue(
      createMockDashboard({
        steps: {
          hasCompletedBooking: true,
          hasCompletedSkinTest: true,
          hasPublishedGoals: true,
          hasPublishedRoutine: true,
        },
        routine: {
          id: "routine-1",
          name: "Morning Only Routine",
          startDate: "2025-11-01",
          endDate: null,
          productPurchaseInstructions: null,
          morning: [
            {
              id: "morning-1",
              routineStep: "Cleanser",
              productName: "Simple Morning Cleanser",
              productUrl: "https://example.com/cleanser",
              instructions: "Use in the morning",
              frequency: "daily",
              days: null,
              timeOfDay: "morning",
              order: 1,
            },
          ],
          evening: [],
        },
      }),
    );

    renderWithQueryClient(<DashboardPage />);

    // User opens modal
    const viewButton = await screen.findByRole("button", {
      name: /view routine/i,
    });
    await user.click(viewButton);

    // Modal opens
    expect(
      await screen.findByRole("heading", { name: /your custom routine/i }),
    ).toBeInTheDocument();

    // User sees switcher component
    expect(
      screen.getByText(/switch to view your morning or evening routine/i),
    ).toBeInTheDocument();

    // User sees morning routine by default
    expect(
      screen.getByText("Morning Routine", { selector: "span" }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText("Simple Morning Cleanser")[0],
    ).toBeInTheDocument();

    // User can switch to evening routine
    const eveningButton = screen.getByRole("button", { name: /🌙/i });
    await user.click(eveningButton);

    // User sees evening routine heading but no steps
    expect(
      screen.getByText("Evening Routine", { selector: "span" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/no evening routine steps yet/i),
    ).toBeInTheDocument();
  });

  it("user closes modal using X button", async () => {
    const user = userEvent.setup();

    vi.mocked(fetchDashboardAction).mockResolvedValue(
      createMockDashboard({
        steps: {
          hasCompletedBooking: true,
          hasCompletedSkinTest: true,
          hasPublishedGoals: true,
          hasPublishedRoutine: true,
        },
        routine: {
          id: "routine-1",
          name: "Test Routine",
          startDate: "2025-11-01",
          endDate: null,
          productPurchaseInstructions: null,
          morning: [
            {
              id: "morning-1",
              routineStep: "Cleanser",
              productName: "Test Cleanser",
              productUrl: "https://example.com/cleanser",
              instructions: "Test instructions",
              frequency: "daily",
              days: null,
              timeOfDay: "morning",
              order: 1,
            },
          ],
          evening: [],
        },
      }),
    );

    renderWithQueryClient(<DashboardPage />);

    // User opens modal
    const viewButton = await screen.findByRole("button", {
      name: /view routine/i,
    });
    await user.click(viewButton);

    // Modal opens
    expect(
      await screen.findByRole("heading", { name: /your custom routine/i }),
    ).toBeInTheDocument();

    // User clicks X button (there are two Close buttons - the X and the main button)
    const closeButtons = screen.getAllByRole("button", { name: /close/i });
    // The first one is the X button
    await user.click(closeButtons[0]);

    // Modal closes
    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: /your custom routine/i }),
      ).not.toBeInTheDocument();
    });
  });
});
