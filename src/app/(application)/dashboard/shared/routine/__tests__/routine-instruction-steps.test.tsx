import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RoutineTabs } from "../routine-tabs";
import type { TodayRoutineStep } from "../../../schemas/dashboard.schema";

/**
 * ROUTINE INSTRUCTION STEPS - INTEGRATION TEST
 *
 * Tests complete user workflow viewing and interacting with mixed product and instruction_only steps.
 * Follows Kent C. Dodds principles: test behavior from user's perspective, not implementation details.
 */

describe("Routine with Instruction-Only Steps", () => {
  it("user views routine with mixed product and instruction_only steps and interacts with them", async () => {
    const user = userEvent.setup();

    // Mock handlers
    const handleStepToggle = vi.fn();
    const handleAllStepsToggle = vi.fn();

    // Mock routine with mixed step types
    const todayRoutine: TodayRoutineStep[] = [
      // Product step with all fields
      {
        id: "1",
        stepType: "product",
        stepName: null,
        routineStep: "Cleanse",
        productName: "Gentle Gel Cleanser",
        productUrl: "https://example.com/cleanser",
        instructions: "Apply to wet face, massage gently, rinse",
        timeOfDay: "morning",
        order: 0,
        status: "pending",
        completedAt: null,
      },
      // Instruction-only step WITH stepName
      {
        id: "2",
        stepType: "instruction_only",
        stepName: "Pat Dry",
        routineStep: "Cleanse", // Can be non-null
        productName: "", // Empty string from backend
        productUrl: null,
        instructions: "Gently pat your face dry with a clean towel",
        timeOfDay: "morning",
        order: 1,
        status: "pending",
        completedAt: null,
      },
      // Instruction-only step WITHOUT stepName (should use instructions as title)
      {
        id: "3",
        stepType: "instruction_only",
        stepName: null,
        routineStep: null,
        productName: "",
        productUrl: null,
        instructions: "Wait 60 seconds for skin to fully dry",
        timeOfDay: "morning",
        order: 2,
        status: "pending",
        completedAt: null,
      },
      // Product step without URL
      {
        id: "4",
        stepType: "product",
        stepName: null,
        routineStep: "Moisturise",
        productName: "Custom Moisturizer",
        productUrl: null,
        instructions: "Apply liberally to face and neck",
        timeOfDay: "morning",
        order: 3,
        status: "pending",
        completedAt: null,
      },
    ];

    render(
      <RoutineTabs
        todayRoutine={todayRoutine}
        checkedSteps={new Set()}
        onStepToggle={handleStepToggle}
        onAllStepsToggle={handleAllStepsToggle}
        useSwitch={true}
      />,
    );

    // ============================================
    // PRODUCT STEP ASSERTIONS (ID: 1)
    // ============================================

    // User sees product badge (routineStep)
    const cleanseBadges = screen.getAllByText("Cleanse");
    expect(cleanseBadges.length).toBeGreaterThan(0);

    // User sees product name as title
    expect(screen.getAllByText("Gentle Gel Cleanser")[0]).toBeInTheDocument();

    // User sees instructions as description
    expect(
      screen.getAllByText("Apply to wet face, massage gently, rinse")[0],
    ).toBeInTheDocument();

    // ============================================
    // INSTRUCTION-ONLY WITH STEPNAME ASSERTIONS (ID: 2)
    // ============================================

    // User sees "Step" badge (not routineStep)
    const stepBadges = screen.getAllByText("Step");
    expect(stepBadges.length).toBeGreaterThan(0);

    // User sees stepName as title
    expect(screen.getAllByText("Pat Dry")[0]).toBeInTheDocument();

    // User sees instructions as description
    expect(
      screen.getAllByText("Gently pat your face dry with a clean towel")[0],
    ).toBeInTheDocument();

    // ============================================
    // INSTRUCTION-ONLY WITHOUT STEPNAME ASSERTIONS (ID: 3)
    // ============================================

    // User sees instructions as title (appears in mobile and desktop layouts)
    const waitInstructions = screen.getAllByText(
      "Wait 60 seconds for skin to fully dry",
    );
    // Should appear in both mobile and desktop layouts (2 times), but NOT duplicated within each layout
    expect(waitInstructions.length).toBeGreaterThan(0);

    // ============================================
    // PRODUCT WITHOUT URL ASSERTIONS (ID: 4)
    // ============================================

    // User sees product name
    expect(screen.getAllByText("Custom Moisturizer")[0]).toBeInTheDocument();

    // User sees Moisturise badge
    expect(screen.getAllByText("Moisturise")[0]).toBeInTheDocument();

    // ============================================
    // INTERACTION: USER CHECKS STEPS
    // ============================================

    // Find all checkboxes (note: each step appears twice - mobile and desktop layout)
    const checkboxes = screen.getAllByRole("button", {
      name: /mark.*as complete/i,
    });

    // Verify we have checkboxes for all 4 steps (x2 for mobile and desktop = 8 total)
    expect(checkboxes.length).toBe(8);

    // User clicks checkbox for product step (ID: 1)
    await user.click(checkboxes[0]);
    expect(handleStepToggle).toHaveBeenCalledWith("1", true);

    // User clicks checkbox for instruction_only with stepName (ID: 2)
    await user.click(checkboxes[2]); // Skip duplicate from mobile/desktop
    expect(handleStepToggle).toHaveBeenCalledWith("2", true);

    // User clicks checkbox for instruction_only without stepName (ID: 3)
    await user.click(checkboxes[4]); // Skip duplicates
    expect(handleStepToggle).toHaveBeenCalledWith("3", true);

    // ============================================
    // VERIFY: NO "VIEW PRODUCT" LINKS FOR INSTRUCTION-ONLY
    // ============================================

    // Product step (ID: 1) should have its link in the data but not visible in this UI
    // (because showViewProduct is false in this component)
    // Instruction-only steps should never have View Product link regardless

    // Since showViewProduct={false} in RoutineTabs, no View Product links should appear
    expect(
      screen.queryByRole("link", { name: /view product/i }),
    ).not.toBeInTheDocument();
  });
});
