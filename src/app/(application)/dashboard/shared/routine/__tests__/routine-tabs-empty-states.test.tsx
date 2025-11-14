import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RoutineTabs } from "../routine-tabs";
import { UpcomingRoutineTabs } from "../upcoming-routine-tabs";
import type {
  TodayRoutineStep,
  Routine,
} from "../../../schemas/dashboard.schema";

/**
 * ROUTINE EMPTY STATES - UI TESTS
 *
 * Testing Strategy:
 * This test suite prevents regressions of the bug where switching to an empty
 * time of day (morning/evening) would render nothing instead of showing an empty state message.
 *
 * Critical scenarios:
 * 1. RoutineTabs with only morning steps → switch to evening → should show "No evening routine steps yet."
 * 2. RoutineTabs with only evening steps → switch to morning → should show "No morning routine steps yet."
 * 3. RoutineTabs with no steps → should show empty state for both morning and evening
 * 4. UpcomingRoutineTabs with only morning steps → switch to evening → should show "No evening routine steps yet."
 * 5. UpcomingRoutineTabs with only evening steps → switch to morning → should show "No morning routine steps yet."
 * 6. UpcomingRoutineTabs with no steps → should show empty state for both morning and evening
 */

// Mock data factories
const createMockTodayRoutineStep = (
  overrides: Partial<TodayRoutineStep> = {},
): TodayRoutineStep => ({
  id: crypto.randomUUID(),
  routineStep: "Cleanse",
  productName: "CeraVe Hydrating Cleanser",
  productUrl: "https://example.com/cleanser",
  instructions: "Apply to wet face, massage gently, rinse",
  timeOfDay: "morning",
  order: 0,
  status: "pending",
  completedAt: null,
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

describe("RoutineTabs - Empty State Tests", () => {
  describe("Switch UI Mode (useSwitch=true)", () => {
    it("shows empty state when switching from morning with steps to evening with no steps", async () => {
      const user = userEvent.setup();
      const morningStep = createMockTodayRoutineStep({
        timeOfDay: "morning",
        productName: "Morning Cleanser",
      });

      render(
        <RoutineTabs
          todayRoutine={[morningStep]}
          useSwitch={true}
          noBorder={true}
          noPadding={true}
        />,
      );

      // Initially should show morning routine with the product (appears twice due to responsive layouts)
      expect(screen.getAllByText("Morning Cleanser")[0]).toBeInTheDocument();

      // Click evening button (moon emoji)
      const eveningButton = screen.getByRole("button", { name: /🌙/ });
      await user.click(eveningButton);

      // Should show empty state message
      expect(
        screen.getByText("No evening routine steps yet."),
      ).toBeInTheDocument();

      // Should NOT show morning product anymore
      expect(screen.queryByText("Morning Cleanser")).not.toBeInTheDocument();
    });

    it("shows empty state when switching from evening with steps to morning with no steps", async () => {
      const user = userEvent.setup();
      const eveningStep = createMockTodayRoutineStep({
        timeOfDay: "evening",
        productName: "Evening Moisturizer",
      });

      render(
        <RoutineTabs
          todayRoutine={[eveningStep]}
          useSwitch={true}
          noBorder={true}
          noPadding={true}
        />,
      );

      // Initially defaults to morning (empty)
      expect(
        screen.getByText("No morning routine steps yet."),
      ).toBeInTheDocument();

      // Click evening button
      const eveningButton = screen.getByRole("button", { name: /🌙/ });
      await user.click(eveningButton);

      // Should show evening product (appears twice due to responsive layouts)
      expect(screen.getAllByText("Evening Moisturizer")[0]).toBeInTheDocument();

      // Click morning button
      const morningButton = screen.getByRole("button", { name: /☀️/ });
      await user.click(morningButton);

      // Should show empty state message
      expect(
        screen.getByText("No morning routine steps yet."),
      ).toBeInTheDocument();
    });

    it("shows empty state for both morning and evening when no steps exist", async () => {
      const user = userEvent.setup();

      render(
        <RoutineTabs
          todayRoutine={[]}
          useSwitch={true}
          noBorder={true}
          noPadding={true}
        />,
      );

      // Morning (default) should show empty state
      expect(
        screen.getByText("No morning routine steps yet."),
      ).toBeInTheDocument();

      // Click evening button
      const eveningButton = screen.getByRole("button", { name: /🌙/ });
      await user.click(eveningButton);

      // Evening should also show empty state
      expect(
        screen.getByText("No evening routine steps yet."),
      ).toBeInTheDocument();
    });

    it("shows empty state when todayRoutine is null", async () => {
      const user = userEvent.setup();

      render(
        <RoutineTabs
          todayRoutine={null}
          useSwitch={true}
          noBorder={true}
          noPadding={true}
        />,
      );

      // Morning should show empty state
      expect(
        screen.getByText("No morning routine steps yet."),
      ).toBeInTheDocument();

      // Switch to evening
      const eveningButton = screen.getByRole("button", { name: /🌙/ });
      await user.click(eveningButton);

      // Evening should show empty state
      expect(
        screen.getByText("No evening routine steps yet."),
      ).toBeInTheDocument();
    });
  });

  describe("Tab UI Mode (useSwitch=false)", () => {
    it("shows empty state when switching from morning with steps to evening with no steps", async () => {
      const user = userEvent.setup();
      const morningStep = createMockTodayRoutineStep({
        timeOfDay: "morning",
        productName: "Morning Cleanser",
      });

      render(<RoutineTabs todayRoutine={[morningStep]} useSwitch={false} />);

      // Initially should show morning routine (appears twice due to responsive layouts)
      expect(screen.getAllByText("Morning Cleanser")[0]).toBeInTheDocument();

      // Click evening tab
      const eveningTab = screen.getByRole("tab", { name: /🌙Evening/i });
      await user.click(eveningTab);

      // Should show empty state message
      expect(
        screen.getByText("No evening routine steps yet."),
      ).toBeInTheDocument();
    });

    it("shows empty state when switching from evening with steps to morning with no steps", async () => {
      const user = userEvent.setup();
      const eveningStep = createMockTodayRoutineStep({
        timeOfDay: "evening",
        productName: "Evening Moisturizer",
      });

      render(<RoutineTabs todayRoutine={[eveningStep]} useSwitch={false} />);

      // Initially defaults to morning (empty)
      expect(
        screen.getByText("No morning routine steps yet."),
      ).toBeInTheDocument();

      // Click evening tab
      const eveningTab = screen.getByRole("tab", { name: /🌙Evening/i });
      await user.click(eveningTab);

      // Should show evening product (appears twice due to responsive layouts)
      expect(screen.getAllByText("Evening Moisturizer")[0]).toBeInTheDocument();

      // Click morning tab
      const morningTab = screen.getByRole("tab", { name: /☀️Morning/i });
      await user.click(morningTab);

      // Should show empty state message
      expect(
        screen.getByText("No morning routine steps yet."),
      ).toBeInTheDocument();
    });
  });
});

describe("UpcomingRoutineTabs - Empty State Tests", () => {
  it("shows empty state when switching from morning with steps to evening with no steps", async () => {
    const user = userEvent.setup();
    const routine = createMockRoutine({
      morning: [
        {
          id: crypto.randomUUID(),
          routineStep: "Cleanse",
          productName: "Morning Cleanser",
          productUrl: "https://example.com",
          instructions: "Use daily",
          frequency: "daily" as const,
          days: null,
          timeOfDay: "morning" as const,
          order: 0,
        },
      ],
      evening: [],
    });

    render(<UpcomingRoutineTabs routine={routine} useSwitch={true} />);

    // Should show morning product (appears twice due to responsive layouts)
    expect(screen.getAllByText("Morning Cleanser")[0]).toBeInTheDocument();

    // Click evening button
    const eveningButton = screen.getByRole("button", { name: /🌙/ });
    await user.click(eveningButton);

    // Should show empty state message
    expect(
      screen.getByText("No evening routine steps yet."),
    ).toBeInTheDocument();

    // Should NOT show morning product anymore
    expect(screen.queryByText("Morning Cleanser")).not.toBeInTheDocument();
  });

  it("shows empty state when switching from evening with steps to morning with no steps", async () => {
    const user = userEvent.setup();
    const routine = createMockRoutine({
      morning: [],
      evening: [
        {
          id: crypto.randomUUID(),
          routineStep: "Moisturize",
          productName: "Evening Moisturizer",
          productUrl: "https://example.com",
          instructions: "Apply before bed",
          frequency: "daily" as const,
          days: null,
          timeOfDay: "evening" as const,
          order: 0,
        },
      ],
    });

    render(<UpcomingRoutineTabs routine={routine} useSwitch={true} />);

    // Initially defaults to morning (empty)
    expect(
      screen.getByText("No morning routine steps yet."),
    ).toBeInTheDocument();

    // Click evening button
    const eveningButton = screen.getByRole("button", { name: /🌙/ });
    await user.click(eveningButton);

    // Should show evening product (appears twice due to responsive layouts)
    expect(screen.getAllByText("Evening Moisturizer")[0]).toBeInTheDocument();

    // Click morning button
    const morningButton = screen.getByRole("button", { name: /☀️/ });
    await user.click(morningButton);

    // Should show empty state message
    expect(
      screen.getByText("No morning routine steps yet."),
    ).toBeInTheDocument();
  });

  it("shows empty state for both morning and evening when no steps exist", async () => {
    const user = userEvent.setup();
    const routine = createMockRoutine({
      morning: [],
      evening: [],
    });

    render(<UpcomingRoutineTabs routine={routine} useSwitch={true} />);

    // Morning (default) should show empty state
    expect(
      screen.getByText("No morning routine steps yet."),
    ).toBeInTheDocument();

    // Click evening button
    const eveningButton = screen.getByRole("button", { name: /🌙/ });
    await user.click(eveningButton);

    // Evening should also show empty state
    expect(
      screen.getByText("No evening routine steps yet."),
    ).toBeInTheDocument();
  });

  it("does not show checkboxes in empty state (read-only)", async () => {
    const user = userEvent.setup();
    const routine = createMockRoutine({
      morning: [],
      evening: [],
    });

    render(<UpcomingRoutineTabs routine={routine} useSwitch={true} />);

    // Should NOT have any checkboxes (upcoming routine is read-only)
    const checkboxes = screen.queryAllByRole("checkbox");
    expect(checkboxes).toHaveLength(0);

    // Switch to evening
    const eveningButton = screen.getByRole("button", { name: /🌙/ });
    await user.click(eveningButton);

    // Still should NOT have checkboxes
    const checkboxesAfter = screen.queryAllByRole("checkbox");
    expect(checkboxesAfter).toHaveLength(0);
  });

  it("shows start date notice even when routine is empty", () => {
    const routine = createMockRoutine({
      startDate: "2025-11-17T00:00:00.000Z",
      morning: [],
      evening: [],
    });

    render(<UpcomingRoutineTabs routine={routine} useSwitch={true} />);

    // Should show start date
    expect(screen.getByText(/your routine starts on/i)).toBeInTheDocument();
    expect(screen.getByText(/november 17, 2025/i)).toBeInTheDocument();

    // And should show empty state
    expect(
      screen.getByText("No morning routine steps yet."),
    ).toBeInTheDocument();
  });
});
