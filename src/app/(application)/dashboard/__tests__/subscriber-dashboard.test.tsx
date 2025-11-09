import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SubscriberDashboard } from "../subscriber-dashboard";
import type { TodayRoutineStep } from "../schemas/dashboard.schema";
import type { Goal } from "../shared/goals";

// Mock server actions
vi.mock("../shared/goals", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../shared/goals")>();
  return {
    ...actual,
    createGoalAction: vi.fn(),
    updateGoalAction: vi.fn(),
    toggleGoalAction: vi.fn(),
    deleteGoalAction: vi.fn(),
    reorderGoalsAction: vi.fn(),
  };
});

vi.mock("../shared/routine", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../shared/routine")>();
  return {
    ...actual,
    toggleRoutineStepAction: vi.fn(),
    toggleMultipleStepsAction: vi.fn(),
  };
});

vi.mock("../hooks/use-stats", () => ({
  useStats: vi.fn(),
}));

// Mock toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import {
  createGoalAction,
  toggleGoalAction,
  deleteGoalAction,
} from "../shared/goals";
import {
  toggleRoutineStepAction,
  toggleMultipleStepsAction,
} from "../shared/routine";
import { useStats } from "../hooks/use-stats";
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

// Mock data factories
const createMockRoutineStep = (
  overrides: Partial<TodayRoutineStep> = {},
): TodayRoutineStep => ({
  id: crypto.randomUUID(),
  routineStep: "Cleanser",
  productName: "CeraVe Hydrating Cleanser",
  productUrl: "https://example.com/cleanser",
  instructions: "Apply to wet face, massage gently, rinse",
  timeOfDay: "morning",
  order: 1,
  status: "pending",
  completedAt: null,
  ...overrides,
});

const createMockGoal = (overrides: Partial<Goal> = {}): Goal => ({
  id: crypto.randomUUID(),
  description: "Clear acne within 3 months",
  isPrimaryGoal: false,
  complete: false,
  completedAt: null,
  order: 0,
  ...overrides,
});

const createMockStats = () => ({
  success: true,
  data: {
    currentStreak: {
      days: 7,
      startDate: "2025-10-27",
    },
    todayProgress: {
      percentage: 60,
      completed: 3,
      total: 5,
    },
    weeklyCompliance: {
      percentage: 75.5,
      completed: 21,
      total: 28,
    },
  },
});

/**
 * SUBSCRIBER DASHBOARD - UI TESTS
 *
 * Testing Strategy (per Kent C. Dodds & UI_TESTING.md):
 * - Complete user workflows from start to finish
 * - Test user-visible behavior, not implementation
 * - Mock at network boundary (server actions only)
 * - Use real components (no mocking UI components)
 * - Query by content/text that users see
 * - Use userEvent for realistic interactions
 */

describe("Subscriber Dashboard - UI Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default stats mock
    vi.mocked(useStats).mockReturnValue({
      data: createMockStats(),
      isLoading: false,
      error: null,
      refetch: vi.fn(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
  });

  describe("Header and Welcome Section", () => {
    it("displays personalized greeting with user's nickname", () => {
      renderWithQueryClient(
        <SubscriberDashboard userName="Alex" todayRoutine={[]} goals={[]} />,
      );

      expect(screen.getByText(/hi alex 👋/i)).toBeInTheDocument();
      expect(
        screen.getByText(
          /track your progress, stay on top of your routine, and achieve your skincare goals/i,
        ),
      ).toBeInTheDocument();
    });

    it("displays default greeting when no username provided", () => {
      renderWithQueryClient(
        <SubscriberDashboard todayRoutine={[]} goals={[]} />,
      );

      expect(screen.getByText(/hi there 👋/i)).toBeInTheDocument();
    });
  });

  describe("Metrics Section", () => {
    it("displays loading skeletons while stats are loading", () => {
      vi.mocked(useStats).mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
        refetch: vi.fn(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      renderWithQueryClient(
        <SubscriberDashboard userName="Alex" todayRoutine={[]} goals={[]} />,
      );

      // Should have animated skeleton elements
      const pulsingElements = document.querySelectorAll(".animate-pulse");
      expect(pulsingElements.length).toBeGreaterThan(0);
    });

    it("displays current streak metric correctly", () => {
      renderWithQueryClient(
        <SubscriberDashboard userName="Alex" todayRoutine={[]} goals={[]} />,
      );

      expect(screen.getByText("Current Streak")).toBeInTheDocument();
      expect(screen.getByText("7 days")).toBeInTheDocument();
      expect(screen.getByText("Consecutive days active")).toBeInTheDocument();
    });

    it("displays today's progress metric with percentage", () => {
      renderWithQueryClient(
        <SubscriberDashboard userName="Alex" todayRoutine={[]} goals={[]} />,
      );

      expect(screen.getByText("Today's Progress")).toBeInTheDocument();
      expect(screen.getByText("60%")).toBeInTheDocument();
      expect(screen.getByText("3 of 5 steps completed")).toBeInTheDocument();
    });

    it("displays weekly compliance metric", () => {
      renderWithQueryClient(
        <SubscriberDashboard userName="Alex" todayRoutine={[]} goals={[]} />,
      );

      expect(screen.getByText("This Week")).toBeInTheDocument();
      expect(screen.getByText("75.5%")).toBeInTheDocument();
      expect(screen.getByText("21 of 28 steps completed")).toBeInTheDocument();
    });

    it("displays error state when stats fail to load", () => {
      vi.mocked(useStats).mockReturnValue({
        data: null,
        isLoading: false,
        error: new Error("Failed to load"),
        refetch: vi.fn(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      renderWithQueryClient(
        <SubscriberDashboard userName="Alex" todayRoutine={[]} goals={[]} />,
      );

      const errorMessages = screen.getAllByText(/unable to load stats/i);
      expect(errorMessages).toHaveLength(3);
    });
  });

  describe("Routine Steps - Checking Individual Steps", () => {
    it("user checks a morning routine step and sees it marked complete", async () => {
      const user = userEvent.setup();
      const morningSteps = [
        createMockRoutineStep({
          id: "step-1",
          routineStep: "Cleanser",
          productName: "CeraVe Hydrating Cleanser",
          timeOfDay: "morning",
          status: "pending",
        }),
      ];

      vi.mocked(toggleRoutineStepAction).mockResolvedValue({
        success: true,
        data: {
          id: "completion-1",
          routineProductId: "step-1",
          userProfileId: "user-1",
          scheduledDate: new Date().toISOString(),
          scheduledTimeOfDay: "morning",
          onTimeDeadline: new Date().toISOString(),
          gracePeriodEnd: new Date().toISOString(),
          completedAt: new Date().toISOString(),
          status: "on-time" as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });

      renderWithQueryClient(
        <SubscriberDashboard
          userName="Alex"
          todayRoutine={morningSteps}
          goals={[]}
        />,
      );

      // Find the product name
      expect(
        screen.getAllByText("CeraVe Hydrating Cleanser")[0],
      ).toBeInTheDocument();

      // User clicks the checkbox button (using accessible label)
      const checkboxButtons = screen.getAllByRole("button", {
        name: /mark cerave hydrating cleanser as complete/i,
      });
      await user.click(checkboxButtons[0]);

      // Server action should be called
      await waitFor(() => {
        expect(toggleRoutineStepAction).toHaveBeenCalledWith("step-1", true);
      });

      // Check completed badge appears
      await waitFor(() => {
        expect(screen.getAllByText("COMPLETED")[0]).toBeInTheDocument();
      });
    });

    it("step toggle fails, error toast shown", async () => {
      const user = userEvent.setup();
      const morningSteps = [
        createMockRoutineStep({
          id: "step-1",
          routineStep: "Serum",
          productName: "Vitamin C Serum",
          timeOfDay: "morning",
          status: "pending",
        }),
      ];

      vi.mocked(toggleRoutineStepAction).mockResolvedValue({
        success: false,
        error: { message: "Network error", code: "NETWORK_ERROR" },
      });

      renderWithQueryClient(
        <SubscriberDashboard
          userName="Alex"
          todayRoutine={morningSteps}
          goals={[]}
        />,
      );

      expect(screen.getAllByText("Vitamin C Serum")[0]).toBeInTheDocument();

      // User clicks the checkbox
      const checkboxButtons = screen.getAllByRole("button", {
        name: /mark vitamin c serum as complete/i,
      });
      await user.click(checkboxButtons[0]);

      // Wait for error toast
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Network error");
      });
    });
  });

  describe("Routine Steps - Checking All Steps at Once", () => {
    it("user checks 'mark all as complete' for morning routine", async () => {
      const user = userEvent.setup();
      const morningSteps = [
        createMockRoutineStep({
          id: "step-1",
          routineStep: "Cleanser",
          productName: "Morning Cleanser",
          timeOfDay: "morning",
          order: 1,
        }),
        createMockRoutineStep({
          id: "step-2",
          routineStep: "Toner",
          productName: "Morning Toner",
          timeOfDay: "morning",
          order: 2,
        }),
      ];

      vi.mocked(toggleMultipleStepsAction).mockResolvedValue({
        success: true,
        data: [
          {
            id: "completion-1",
            routineProductId: "step-1",
            userProfileId: "user-1",
            scheduledDate: new Date().toISOString(),
            scheduledTimeOfDay: "morning",
            onTimeDeadline: new Date().toISOString(),
            gracePeriodEnd: new Date().toISOString(),
            completedAt: new Date().toISOString(),
            status: "on-time" as const,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      });

      renderWithQueryClient(
        <SubscriberDashboard
          userName="Alex"
          todayRoutine={morningSteps}
          goals={[]}
        />,
      );

      // Click "Mark all as done" button
      const markAllButtons = screen.getAllByRole("button", {
        name: /mark all as done/i,
      });
      await user.click(markAllButtons[0]);

      // Server action should be called with both step IDs
      await waitFor(() => {
        expect(toggleMultipleStepsAction).toHaveBeenCalledWith(
          expect.arrayContaining(["step-1", "step-2"]),
          true,
        );
      });
    });

    it("mark all steps fails, error toast shown", async () => {
      const user = userEvent.setup();
      const morningSteps = [
        createMockRoutineStep({
          id: "step-1",
          routineStep: "Cleanser",
          productName: "Cleanser Product",
          timeOfDay: "morning",
        }),
      ];

      vi.mocked(toggleMultipleStepsAction).mockResolvedValue({
        success: false,
        error: { message: "Server error", code: "SERVER_ERROR" },
      });

      renderWithQueryClient(
        <SubscriberDashboard
          userName="Alex"
          todayRoutine={morningSteps}
          goals={[]}
        />,
      );

      // Click "Mark all as done" button
      const markAllButtons = screen.getAllByRole("button", {
        name: /mark all as done/i,
      });
      await user.click(markAllButtons[0]);

      // Wait for error
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Server error");
      });
    });
  });

  describe("Routine Steps - Morning and Evening Switch", () => {
    it("displays morning routine by default and can switch to evening", async () => {
      const user = userEvent.setup();
      const mixedRoutine = [
        createMockRoutineStep({
          id: "morning-1",
          routineStep: "Cleanser",
          productName: "Morning Cleanser Product",
          timeOfDay: "morning",
        }),
        createMockRoutineStep({
          id: "evening-1",
          routineStep: "Cleanser",
          productName: "Evening Cleanser Product",
          timeOfDay: "evening",
        }),
      ];

      renderWithQueryClient(
        <SubscriberDashboard
          userName="Alex"
          todayRoutine={mixedRoutine}
          goals={[]}
        />,
      );

      // Should see morning product by default
      expect(
        screen.getAllByText("Morning Cleanser Product")[0],
      ).toBeInTheDocument();
      expect(screen.getAllByText("Morning Routine")[0]).toBeInTheDocument();

      // Evening product should not be visible yet
      expect(
        screen.queryByText("Evening Cleanser Product"),
      ).not.toBeInTheDocument();

      // Click evening button (moon icon button 🌙)
      // Find all buttons and locate the one with moon emoji
      const buttons = screen.getAllByRole("button");
      const eveningButton = buttons.find((btn) =>
        btn.textContent?.includes("🌙"),
      );
      expect(eveningButton).toBeInTheDocument();

      if (eveningButton) {
        await user.click(eveningButton);
      }

      // Now evening product should be visible
      await waitFor(() => {
        expect(
          screen.getAllByText("Evening Cleanser Product")[0],
        ).toBeInTheDocument();
        expect(screen.getAllByText("Evening Routine")[0]).toBeInTheDocument();
      });

      // Morning product should not be visible
      expect(
        screen.queryByText("Morning Cleanser Product"),
      ).not.toBeInTheDocument();
    });
  });

  describe("Routine Steps - Progress Bar Updates", () => {
    it("progress bar updates as user checks individual steps", async () => {
      const user = userEvent.setup();
      const morningRoutine = [
        createMockRoutineStep({
          id: "step-1",
          routineStep: "Cleanser",
          productName: "Step 1",
          timeOfDay: "morning",
        }),
        createMockRoutineStep({
          id: "step-2",
          routineStep: "Moisturizer",
          productName: "Step 2",
          timeOfDay: "morning",
        }),
        createMockRoutineStep({
          id: "step-3",
          routineStep: "Sunscreen",
          productName: "Step 3",
          timeOfDay: "morning",
        }),
      ];

      vi.mocked(toggleRoutineStepAction).mockResolvedValue({
        success: true,
        data: {
          id: "completion-1",
          routineProductId: "step-1",
          userProfileId: "user-1",
          scheduledDate: new Date().toISOString(),
          scheduledTimeOfDay: "morning",
          onTimeDeadline: new Date().toISOString(),
          gracePeriodEnd: new Date().toISOString(),
          completedAt: new Date().toISOString(),
          status: "on-time",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });

      renderWithQueryClient(
        <SubscriberDashboard
          userName="Alex"
          todayRoutine={morningRoutine}
          goals={[]}
        />,
      );

      // User sees initial progress 0/3
      expect(screen.getByText("0 / 3")).toBeInTheDocument();

      // Check first step
      const step1Checkboxes = screen.getAllByRole("button", {
        name: /mark step 1 as complete/i,
      });
      await user.click(step1Checkboxes[0]);

      // Progress updates to 1/3
      await waitFor(() => {
        expect(screen.getByText("1 / 3")).toBeInTheDocument();
      });

      // Check second step
      const step2Checkboxes = screen.getAllByRole("button", {
        name: /mark step 2 as complete/i,
      });
      await user.click(step2Checkboxes[0]);

      // Progress updates to 2/3
      await waitFor(() => {
        expect(screen.getByText("2 / 3")).toBeInTheDocument();
      });

      // Check third step
      const step3Checkboxes = screen.getAllByRole("button", {
        name: /mark step 3 as complete/i,
      });
      await user.click(step3Checkboxes[0]);

      // Progress updates to 3/3 (complete)
      await waitFor(() => {
        expect(screen.getByText("3 / 3")).toBeInTheDocument();
      });
    });

    it("progress bar correctly shows counts when switching between morning and evening", async () => {
      const user = userEvent.setup();
      const mixedRoutine = [
        createMockRoutineStep({
          id: "morning-1",
          routineStep: "Cleanser",
          productName: "Morning Step 1",
          timeOfDay: "morning",
        }),
        createMockRoutineStep({
          id: "morning-2",
          routineStep: "Moisturizer",
          productName: "Morning Step 2",
          timeOfDay: "morning",
        }),
        createMockRoutineStep({
          id: "evening-1",
          routineStep: "Cleanser",
          productName: "Evening Step 1",
          timeOfDay: "evening",
        }),
      ];

      vi.mocked(toggleRoutineStepAction).mockResolvedValue({
        success: true,
        data: {
          id: "completion-1",
          routineProductId: "morning-1",
          userProfileId: "user-1",
          scheduledDate: new Date().toISOString(),
          scheduledTimeOfDay: "morning",
          onTimeDeadline: new Date().toISOString(),
          gracePeriodEnd: new Date().toISOString(),
          completedAt: new Date().toISOString(),
          status: "on-time",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });

      renderWithQueryClient(
        <SubscriberDashboard
          userName="Alex"
          todayRoutine={mixedRoutine}
          goals={[]}
        />,
      );

      // Morning tab shows 0/2 initially
      expect(screen.getByText("0 / 2")).toBeInTheDocument();

      // Check one morning step
      const morningCheckboxes = screen.getAllByRole("button", {
        name: /mark morning step 1 as complete/i,
      });
      await user.click(morningCheckboxes[0]);

      // Progress shows 1/2 for morning
      await waitFor(() => {
        expect(screen.getByText("1 / 2")).toBeInTheDocument();
      });

      // Switch to evening tab
      const buttons = screen.getAllByRole("button");
      const eveningButton = buttons.find((btn) =>
        btn.textContent?.includes("🌙"),
      );

      if (eveningButton) {
        await user.click(eveningButton);
      }

      // Evening tab shows 0/1 (different count)
      await waitFor(() => {
        expect(screen.getByText("0 / 1")).toBeInTheDocument();
      });
    });
  });

  describe("Routine Steps - Empty States", () => {
    it("displays empty state message when no morning routine steps", () => {
      const eveningOnlyRoutine = [
        createMockRoutineStep({
          id: "evening-1",
          routineStep: "Cleanser",
          productName: "Evening Cleanser",
          timeOfDay: "evening",
        }),
      ];

      renderWithQueryClient(
        <SubscriberDashboard
          userName="Alex"
          todayRoutine={eveningOnlyRoutine}
          goals={[]}
        />,
      );

      // Morning tab is active by default, shows empty state
      expect(
        screen.getByText(/no morning routine steps yet/i),
      ).toBeInTheDocument();
    });

    it("displays empty state message when no evening routine steps", async () => {
      const user = userEvent.setup();
      const morningOnlyRoutine = [
        createMockRoutineStep({
          id: "morning-1",
          routineStep: "Cleanser",
          productName: "Morning Cleanser",
          timeOfDay: "morning",
        }),
      ];

      renderWithQueryClient(
        <SubscriberDashboard
          userName="Alex"
          todayRoutine={morningOnlyRoutine}
          goals={[]}
        />,
      );

      // Switch to evening tab
      const buttons = screen.getAllByRole("button");
      const eveningButton = buttons.find((btn) =>
        btn.textContent?.includes("🌙"),
      );

      if (eveningButton) {
        await user.click(eveningButton);
      }

      // Evening tab shows empty state
      await waitFor(() => {
        expect(
          screen.getByText(/no evening routine steps yet/i),
        ).toBeInTheDocument();
      });
    });

    it("displays empty state when no routine steps at all", () => {
      renderWithQueryClient(
        <SubscriberDashboard userName="Alex" todayRoutine={[]} goals={[]} />,
      );

      // Morning tab shows empty state by default
      expect(
        screen.getByText(/no morning routine steps yet/i),
      ).toBeInTheDocument();
    });
  });

  describe("Routine Steps - Uncheck All Workflow", () => {
    it("user marks all as done, then unchecks all by clicking mark all again", async () => {
      const user = userEvent.setup();
      const morningRoutine = [
        createMockRoutineStep({
          id: "step-1",
          routineStep: "Cleanser",
          productName: "Step 1",
          timeOfDay: "morning",
        }),
        createMockRoutineStep({
          id: "step-2",
          routineStep: "Moisturizer",
          productName: "Step 2",
          timeOfDay: "morning",
        }),
      ];

      vi.mocked(toggleMultipleStepsAction).mockResolvedValue({
        success: true,
        data: [],
      });

      renderWithQueryClient(
        <SubscriberDashboard
          userName="Alex"
          todayRoutine={morningRoutine}
          goals={[]}
        />,
      );

      // Mark all as done
      const markAllButtons = screen.getAllByRole("button", {
        name: /mark all as done/i,
      });
      await user.click(markAllButtons[0]);

      // All steps should be checked
      await waitFor(() => {
        expect(toggleMultipleStepsAction).toHaveBeenCalledWith(
          expect.arrayContaining(["step-1", "step-2"]),
          true,
        );
      });

      // Progress shows 2/2
      await waitFor(() => {
        expect(screen.getByText("2 / 2")).toBeInTheDocument();
      });

      // Click mark all again to uncheck all
      await user.click(markAllButtons[0]);

      // Should uncheck all
      await waitFor(() => {
        expect(toggleMultipleStepsAction).toHaveBeenCalledWith(
          expect.arrayContaining(["step-1", "step-2"]),
          false,
        );
      });
    });
  });

  describe("Routine Steps - Switch UI Elements", () => {
    it("displays custom switch with sun and moon icons for morning/evening", async () => {
      const user = userEvent.setup();
      const mixedRoutine = [
        createMockRoutineStep({
          id: "morning-1",
          routineStep: "Cleanser",
          productName: "Morning Product",
          timeOfDay: "morning",
        }),
        createMockRoutineStep({
          id: "evening-1",
          routineStep: "Cleanser",
          productName: "Evening Product",
          timeOfDay: "evening",
        }),
      ];

      renderWithQueryClient(
        <SubscriberDashboard
          userName="Alex"
          todayRoutine={mixedRoutine}
          goals={[]}
        />,
      );

      // User sees helper text explaining the switch
      expect(
        screen.getByText(/switch to view your morning or evening routine/i),
      ).toBeInTheDocument();

      // User sees "Morning Routine" label (default active state)
      expect(screen.getAllByText("Morning Routine")[0]).toBeInTheDocument();

      // Find sun button (☀️) and moon button (🌙)
      const buttons = screen.getAllByRole("button");
      const sunButton = buttons.find((btn) => btn.textContent?.includes("☀️"));
      const moonButton = buttons.find((btn) => btn.textContent?.includes("🌙"));

      expect(sunButton).toBeInTheDocument();
      expect(moonButton).toBeInTheDocument();

      // Click moon button to switch to evening
      if (moonButton) {
        await user.click(moonButton);
      }

      // Label changes to "Evening Routine"
      await waitFor(() => {
        expect(screen.getAllByText("Evening Routine")[0]).toBeInTheDocument();
      });

      // Evening product is now visible
      expect(screen.getAllByText("Evening Product")[0]).toBeInTheDocument();

      // Click sun button to switch back to morning
      if (sunButton) {
        await user.click(sunButton);
      }

      // Label changes back to "Morning Routine"
      await waitFor(() => {
        expect(screen.getAllByText("Morning Routine")[0]).toBeInTheDocument();
      });

      // Morning product is now visible
      expect(screen.getAllByText("Morning Product")[0]).toBeInTheDocument();
    });

    it("switch UI does not show tabs component", () => {
      const morningRoutine = [
        createMockRoutineStep({
          id: "morning-1",
          routineStep: "Cleanser",
          productName: "Morning Product",
          timeOfDay: "morning",
        }),
      ];

      renderWithQueryClient(
        <SubscriberDashboard
          userName="Alex"
          todayRoutine={morningRoutine}
          goals={[]}
        />,
      );

      // In switch mode, there should be no "Your Routine" card title
      // (because useSwitch hides the CardHeader)
      expect(screen.queryByText("Your Routine")).not.toBeInTheDocument();

      // Switch UI elements are present instead
      expect(
        screen.getByText(/switch to view your morning or evening routine/i),
      ).toBeInTheDocument();
    });
  });

  describe("Goals - Adding Goals", () => {
    it("user adds a new goal successfully", async () => {
      const user = userEvent.setup();

      vi.mocked(createGoalAction).mockResolvedValue({
        success: true,
        data: {
          id: "new-goal-1",
          description: "Reduce dark spots within 2 months",
          complete: false,
          completedAt: null,
          order: 0,
          isPrimaryGoal: false,
        },
      });

      renderWithQueryClient(
        <SubscriberDashboard userName="Alex" todayRoutine={[]} goals={[]} />,
      );

      // Click "Add Goal" button (look for button with Plus icon or text)
      const addButton = screen.getByRole("button", { name: /add goal/i });
      await user.click(addButton);

      // Should see textarea for goal description
      const textarea = await screen.findByPlaceholderText(/enter goal/i);
      await user.type(textarea, "Reduce dark spots within 2 months");

      // Find and click the save button
      const saveButton = screen.getByRole("button", { name: /save$/i });
      await user.click(saveButton);

      // Goal should appear in the list
      await waitFor(() => {
        expect(
          screen.getByText(/reduce dark spots within 2 months/i),
        ).toBeInTheDocument();
      });

      // Success toast shown
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith("Goal added successfully");
      });

      // Server action called
      expect(createGoalAction).toHaveBeenCalledWith({
        description: "Reduce dark spots within 2 months",
        isPrimaryGoal: false,
      });
    });

    it("add goal fails, error toast shown", async () => {
      const user = userEvent.setup();

      vi.mocked(createGoalAction).mockResolvedValue({
        success: false,
        error: { message: "Failed to save goal", code: "DB_ERROR" },
      });

      renderWithQueryClient(
        <SubscriberDashboard userName="Alex" todayRoutine={[]} goals={[]} />,
      );

      // Click "Add Goal" button
      const addButton = screen.getByRole("button", { name: /add goal/i });
      await user.click(addButton);

      // Type goal description
      const textarea = await screen.findByPlaceholderText(/enter goal/i);
      await user.type(textarea, "Clear acne");

      // Click save
      const saveButton = screen.getByRole("button", { name: /save$/i });
      await user.click(saveButton);

      // Wait for error
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Failed to save goal");
      });
    });
  });

  describe("Goals - Toggling Goal Completion", () => {
    it("user marks goal as complete by clicking checkbox", async () => {
      const user = userEvent.setup();
      const goals = [
        createMockGoal({
          id: "goal-1",
          description: "Reduce dark circles",
          complete: false,
        }),
      ];

      vi.mocked(toggleGoalAction).mockResolvedValue({
        success: true,
        data: {
          id: "goal-1",
          description: "Reduce dark circles",
          complete: true,
          completedAt: new Date().toISOString(),
          order: 0,
          isPrimaryGoal: false,
        },
      });

      renderWithQueryClient(
        <SubscriberDashboard userName="Alex" todayRoutine={[]} goals={goals} />,
      );

      // Find goal text
      const goalText = screen.getByText(/reduce dark circles/i);
      expect(goalText).toBeInTheDocument();

      // Find the checkbox buttons (there are 2: mobile and desktop)
      const checkboxButtons = screen.getAllByLabelText(/mark as complete/i);
      expect(checkboxButtons.length).toBeGreaterThan(0);

      // Click the first one (mobile or desktop doesn't matter for functionality)
      await user.click(checkboxButtons[0]);

      // Server action called
      await waitFor(() => {
        expect(toggleGoalAction).toHaveBeenCalledWith("goal-1", true);
      });
    });
  });

  describe("Goals - Deleting Goals", () => {
    it("user deletes a goal", async () => {
      const user = userEvent.setup();
      const goals = [
        createMockGoal({
          id: "goal-1",
          description: "Reduce wrinkles",
        }),
      ];

      vi.mocked(deleteGoalAction).mockResolvedValue({
        success: true,
        data: undefined,
      });

      renderWithQueryClient(
        <SubscriberDashboard userName="Alex" todayRoutine={[]} goals={goals} />,
      );

      // Goal should be visible
      expect(screen.getByText(/reduce wrinkles/i)).toBeInTheDocument();

      // Click delete button
      const deleteButton = screen.getByRole("button", { name: /delete goal/i });
      await user.click(deleteButton);

      // Server action called
      await waitFor(() => {
        expect(deleteGoalAction).toHaveBeenCalledWith("goal-1");
      });
    });
  });

  describe("Complete User Workflow", () => {
    it("user completes morning routine and adds a new goal", async () => {
      const user = userEvent.setup();
      const morningRoutine = [
        createMockRoutineStep({
          id: "step-1",
          routineStep: "Cleanser",
          productName: "CeraVe Cleanser",
          timeOfDay: "morning",
          order: 1,
        }),
      ];

      vi.mocked(toggleRoutineStepAction).mockResolvedValue({
        success: true,
        data: {
          id: "completion-1",
          routineProductId: "step-1",
          userProfileId: "user-1",
          scheduledDate: new Date().toISOString(),
          scheduledTimeOfDay: "morning",
          onTimeDeadline: new Date().toISOString(),
          gracePeriodEnd: new Date().toISOString(),
          completedAt: new Date().toISOString(),
          status: "on-time" as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });

      vi.mocked(createGoalAction).mockResolvedValue({
        success: true,
        data: {
          id: "new-goal",
          description: "Maintain clear skin for 6 months",
          complete: false,
          completedAt: null,
          order: 0,
          isPrimaryGoal: false,
        },
      });

      renderWithQueryClient(
        <SubscriberDashboard
          userName="Sarah"
          todayRoutine={morningRoutine}
          goals={[]}
        />,
      );

      // User sees personalized greeting
      expect(screen.getByText(/hi sarah 👋/i)).toBeInTheDocument();

      // User completes routine step
      const checkboxButtons = screen.getAllByRole("button", {
        name: /mark cerave cleanser as complete/i,
      });
      await user.click(checkboxButtons[0]);

      // Wait for server action
      await waitFor(() => {
        expect(toggleRoutineStepAction).toHaveBeenCalledWith("step-1", true);
      });

      // User adds a new goal
      const addGoalButton = screen.getByRole("button", { name: /add goal/i });
      await user.click(addGoalButton);

      const textarea = await screen.findByPlaceholderText(/enter goal/i);
      await user.type(textarea, "Maintain clear skin for 6 months");

      const saveButton = screen.getByRole("button", { name: /save$/i });
      await user.click(saveButton);

      // Goal appears
      await waitFor(() => {
        expect(
          screen.getByText(/maintain clear skin for 6 months/i),
        ).toBeInTheDocument();
      });

      // Success toast
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith("Goal added successfully");
      });
    });
  });
});
