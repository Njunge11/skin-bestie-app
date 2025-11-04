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

vi.mock("../shared/goals/goal-actions", () => ({
  createGoalAction: vi.fn(),
  updateGoalAction: vi.fn(),
  toggleGoalAction: vi.fn(),
  deleteGoalAction: vi.fn(),
  reorderGoalsAction: vi.fn(),
  acknowledgeGoalsAction: vi.fn(),
}));

// Mock toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import { fetchDashboardAction } from "../setup-dashboard/setup-dashboard-actions";
import { acknowledgeGoalsAction } from "../shared/goals/goal-actions";
import { toast } from "sonner";

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
    hasPublishedGoals: false,
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
    goalsAcknowledgedByClient: false,
    goals: null,
    routine: null,
    todayRoutine: null,
    catchupSteps: null,
    ...overrides,
  };
};

/**
 * SETUP DASHBOARD - GOALS REVIEW WORKFLOW TESTS
 *
 * Testing Strategy (per Kent C. Dodds & UI_TESTING.md):
 * - Complete user workflows from start to finish
 * - Test user-visible behavior, not implementation
 * - Mock at network boundary (server actions only)
 * - Use real components (no mocking UI components)
 * - Query by accessibility (getByRole, getByText)
 * - Use userEvent for realistic interactions
 */

describe("Setup Dashboard - Goals Review Workflow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("user reviews and acknowledges coach-published goals successfully", async () => {
    const user = userEvent.setup();

    // Mock dashboard with published goals (not yet acknowledged)
    vi.mocked(fetchDashboardAction).mockResolvedValue(
      createMockDashboard({
        steps: {
          hasCompletedBooking: true,
          hasCompletedSkinTest: true,
          hasPublishedGoals: true,
          hasPublishedRoutine: false,
        },
        goalsAcknowledgedByClient: false,
        goals: [
          {
            id: "goal-1",
            description: "Clear acne within 3 months",
            isPrimaryGoal: true,
            complete: false,
            completedAt: null,
            order: 0,
          },
          {
            id: "goal-2",
            description: "Reduce dark spots",
            isPrimaryGoal: false,
            complete: false,
            completedAt: null,
            order: 1,
          },
        ],
      }),
    );

    vi.mocked(acknowledgeGoalsAction).mockResolvedValue({
      success: true,
      data: undefined,
    });

    renderWithQueryClient(<DashboardPage />);

    // User sees setup steps page
    expect(
      await screen.findByText("Essential Setup Steps"),
    ).toBeInTheDocument();

    // User sees "Review Your Goals" button
    const reviewButton = screen.getByRole("button", {
      name: /review your goals/i,
    });
    expect(reviewButton).toBeInTheDocument();

    // User clicks button
    await user.click(reviewButton);

    // Modal opens with heading
    expect(
      await screen.findByRole("heading", { name: /your skin goals/i }),
    ).toBeInTheDocument();

    // User sees both goals from coach
    expect(screen.getByText(/clear acne within 3 months/i)).toBeInTheDocument();
    expect(screen.getByText(/reduce dark spots/i)).toBeInTheDocument();

    // User sees description text
    expect(
      screen.getByText(
        /track your progress and manage your personalized skincare goals/i,
      ),
    ).toBeInTheDocument();

    // User clicks Save button
    const saveButton = screen.getByRole("button", { name: /^save$/i });
    await user.click(saveButton);

    // Server action called
    await waitFor(() => {
      expect(acknowledgeGoalsAction).toHaveBeenCalledWith(true);
    });

    // Success toast shown
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Goals saved successfully");
    });

    // Modal closes
    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: /your skin goals/i }),
      ).not.toBeInTheDocument();
    });
  });

  it("acknowledge goals fails, error toast shown, modal stays open", async () => {
    const user = userEvent.setup();

    vi.mocked(fetchDashboardAction).mockResolvedValue(
      createMockDashboard({
        steps: {
          hasCompletedBooking: true,
          hasCompletedSkinTest: true,
          hasPublishedGoals: true,
          hasPublishedRoutine: false,
        },
        goalsAcknowledgedByClient: false,
        goals: [
          {
            id: "goal-1",
            description: "Clear acne",
            isPrimaryGoal: false,
            complete: false,
            completedAt: null,
            order: 0,
          },
        ],
      }),
    );

    vi.mocked(acknowledgeGoalsAction).mockResolvedValue({
      success: false,
      error: { message: "Network error", code: "NETWORK_ERROR" },
    });

    renderWithQueryClient(<DashboardPage />);

    // User opens modal
    const reviewButton = await screen.findByRole("button", {
      name: /review your goals/i,
    });
    await user.click(reviewButton);

    // Modal opens
    expect(
      await screen.findByRole("heading", { name: /your skin goals/i }),
    ).toBeInTheDocument();

    // User clicks Save
    const saveButton = screen.getByRole("button", { name: /^save$/i });
    await user.click(saveButton);

    // Error toast shown
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Network error");
    });

    // Modal stays open (doesn't close on error)
    expect(
      screen.getByRole("heading", { name: /your skin goals/i }),
    ).toBeInTheDocument();
  });

  it("user closes modal without saving using close button", async () => {
    const user = userEvent.setup();

    vi.mocked(fetchDashboardAction).mockResolvedValue(
      createMockDashboard({
        steps: {
          hasCompletedBooking: true,
          hasCompletedSkinTest: true,
          hasPublishedGoals: true,
          hasPublishedRoutine: false,
        },
        goalsAcknowledgedByClient: false,
        goals: [
          {
            id: "goal-1",
            description: "Clear acne",
            isPrimaryGoal: false,
            complete: false,
            completedAt: null,
            order: 0,
          },
        ],
      }),
    );

    renderWithQueryClient(<DashboardPage />);

    // User opens modal
    const reviewButton = await screen.findByRole("button", {
      name: /review your goals/i,
    });
    await user.click(reviewButton);

    // Modal opens
    expect(
      await screen.findByRole("heading", { name: /your skin goals/i }),
    ).toBeInTheDocument();

    // User clicks X button (Close)
    const closeButtons = screen.getAllByRole("button", { name: /close/i });
    await user.click(closeButtons[0]);

    // Modal closes
    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: /your skin goals/i }),
      ).not.toBeInTheDocument();
    });

    // Acknowledge action NOT called (user didn't save)
    expect(acknowledgeGoalsAction).not.toHaveBeenCalled();
  });
});
