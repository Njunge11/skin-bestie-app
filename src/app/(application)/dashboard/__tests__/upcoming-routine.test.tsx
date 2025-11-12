import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SubscriberDashboard } from "../subscriber-dashboard";
import type { Routine, RoutineStep } from "../schemas/dashboard.schema";

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

import { useStats } from "../hooks/use-stats";

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
  overrides: Partial<RoutineStep> = {},
): RoutineStep => ({
  id: crypto.randomUUID(),
  routineStep: "Cleanse",
  productName: "CeraVe Hydrating Cleanser",
  productUrl: "https://example.com/cleanser",
  instructions: "Apply to wet face, massage gently, rinse",
  frequency: "daily",
  days: null,
  timeOfDay: "morning",
  order: 0,
  ...overrides,
});

const createMockRoutine = (overrides: Partial<Routine> = {}): Routine => ({
  id: crypto.randomUUID(),
  name: "Balanced Basics (AM/PM)",
  startDate: "2025-11-17T00:00:00.000Z",
  endDate: null,
  productPurchaseInstructions: null,
  morning: [],
  evening: [],
  ...overrides,
});

const createMockStats = () => ({
  success: true,
  data: {
    currentStreak: {
      days: 0,
      startDate: null,
    },
    todayProgress: {
      percentage: 0,
      completed: 0,
      total: 0,
    },
    weeklyCompliance: {
      percentage: 0,
      completed: 0,
      total: 0,
    },
  },
});

/**
 * UPCOMING ROUTINE - UI TESTS
 *
 * Testing Strategy (per Kent C. Dodds & UI_TESTING.md):
 * Core Scenarios:
 * 1. todayRoutine has steps → Show active routine
 * 2. todayRoutine empty BUT routine exists → Show upcoming routine (read-only with "Starts [date]")
 * 3. Both empty → Show empty state
 */

describe("Upcoming Routine - UI Tests", () => {
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

  describe("Scenario 1: Active Routine (todayRoutine has steps)", () => {
    it("shows active routine with interactive elements when todayRoutine has steps", () => {
      const todayStep = {
        id: crypto.randomUUID(),
        routineStep: "Cleanse",
        productName: "CeraVe Cleanser",
        productUrl: "https://example.com",
        instructions: "Use daily",
        timeOfDay: "morning" as const,
        order: 0,
        status: "pending" as const,
        completedAt: null,
      };

      renderWithQueryClient(
        <SubscriberDashboard
          userName="Alex"
          todayRoutine={[todayStep]}
          goals={[]}
          routine={null}
        />,
      );

      // Should NOT show "Starts" badge (this is active, not upcoming)
      expect(screen.queryByText(/starts/i)).not.toBeInTheDocument();

      // Should show the product (appears twice due to responsive layouts)
      expect(screen.getAllByText("CeraVe Cleanser")[0]).toBeInTheDocument();
    });
  });

  describe("Scenario 2: Upcoming Routine (todayRoutine empty, routine exists)", () => {
    it("shows upcoming routine with 'Starts [date]' badge when todayRoutine is empty", () => {
      const futureRoutine = createMockRoutine({
        name: "Balanced Basics (AM/PM)",
        startDate: "2025-11-17T00:00:00.000Z",
        morning: [
          createMockRoutineStep({
            routineStep: "Cleanse",
            productName: "CeraVe Cleanser",
            timeOfDay: "morning",
          }),
        ],
      });

      renderWithQueryClient(
        <SubscriberDashboard
          userName="Alex"
          todayRoutine={[]}
          goals={[]}
          routine={futureRoutine}
        />,
      );

      // Should show start date message
      expect(screen.getByText(/your routine starts on/i)).toBeInTheDocument();
      expect(screen.getByText(/november 17, 2025/i)).toBeInTheDocument();

      // Should show products (appears twice due to responsive layouts)
      expect(screen.getAllByText("CeraVe Cleanser")[0]).toBeInTheDocument();
    });

    it("does not show checkboxes in read-only upcoming routine", () => {
      const futureRoutine = createMockRoutine({
        morning: [createMockRoutineStep()],
      });

      renderWithQueryClient(
        <SubscriberDashboard
          userName="Alex"
          todayRoutine={[]}
          goals={[]}
          routine={futureRoutine}
        />,
      );

      // Should NOT have checkboxes (read-only)
      const checkboxes = screen.queryAllByRole("checkbox");
      expect(checkboxes).toHaveLength(0);
    });

    it("shows product view button in upcoming routine", () => {
      const futureRoutine = createMockRoutine({
        morning: [
          createMockRoutineStep({
            productName: "CeraVe Cleanser",
            productUrl: "https://example.com/products/cleanser",
          }),
        ],
      });

      renderWithQueryClient(
        <SubscriberDashboard
          userName="Alex"
          todayRoutine={[]}
          goals={[]}
          routine={futureRoutine}
        />,
      );

      // Should show product name
      expect(screen.getAllByText("CeraVe Cleanser")[0]).toBeInTheDocument();

      // Should have "View Product" button (appears twice due to responsive layouts)
      expect(
        screen.getAllByRole("link", { name: /view product/i })[0],
      ).toBeInTheDocument();
    });
  });

  describe("Scenario 3: Empty State (both todayRoutine and routine are empty)", () => {
    it("shows empty routine state when both todayRoutine and routine are null", () => {
      renderWithQueryClient(
        <SubscriberDashboard
          userName="Alex"
          todayRoutine={[]}
          goals={[]}
          routine={null}
        />,
      );

      // Should NOT show "Starts" badge
      expect(screen.queryByText(/starts/i)).not.toBeInTheDocument();

      // Should show routine interface (morning/evening switch) - appears twice due to responsive layouts
      expect(screen.getAllByText(/morning routine/i)[0]).toBeInTheDocument();
    });
  });
});
