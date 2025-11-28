import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProductsPurchasedModal } from "../products-purchased-modal";
import type { Routine } from "../../schemas/dashboard.schema";

/**
 * PRODUCTS PURCHASED MODAL - FILTERING INTEGRATION TEST
 *
 * Tests that user only sees actual products (not instruction_only steps) in the modal.
 * Follows Kent C. Dodds principles: test complete user workflow from their perspective.
 */

describe("Products Purchased Modal - Product Filtering", () => {
  it("user views products modal and only sees actual products to purchase", () => {
    // Mock handlers
    const handleOpenChange = vi.fn();
    const handleConfirmProductsReceived = vi.fn();
    const handleConfirm = vi.fn();

    // Mock routine with mixed product and instruction_only steps
    const routine: Routine = {
      id: "routine-1",
      name: "Morning Routine",
      startDate: "2025-11-01T00:00:00.000Z",
      endDate: null,
      productPurchaseInstructions: "Buy from local pharmacy",
      morning: [
        // Product step - SHOULD appear in modal
        {
          id: "1",
          stepType: "product",
          stepName: null,
          routineStep: "Cleanse",
          productName: "Gentle Gel Cleanser",
          productUrl: "https://example.com/cleanser",
          instructions: "Apply to wet face",
          frequency: "daily",
          days: null,
          timeOfDay: "morning",
          order: 0,
        },
        // Instruction-only - should NOT appear in modal
        {
          id: "2",
          stepType: "instruction_only",
          stepName: "Pat Dry",
          routineStep: null,
          productName: "",
          productUrl: null,
          instructions: "Gently pat your face dry",
          frequency: "daily",
          days: null,
          timeOfDay: "morning",
          order: 1,
        },
        // Product step without URL - SHOULD appear in modal
        {
          id: "3",
          stepType: "product",
          stepName: null,
          routineStep: "Moisturise",
          productName: "Daily Moisturizer",
          productUrl: null,
          instructions: "Apply liberally",
          frequency: "daily",
          days: null,
          timeOfDay: "morning",
          order: 2,
        },
      ],
      evening: [
        // Product step - SHOULD appear in modal
        {
          id: "4",
          stepType: "product",
          stepName: null,
          routineStep: "Treat",
          productName: "Night Serum",
          productUrl: "https://example.com/serum",
          instructions: "Apply 2-3 drops",
          frequency: "daily",
          days: null,
          timeOfDay: "evening",
          order: 0,
        },
        // Instruction-only - should NOT appear in modal
        {
          id: "5",
          stepType: "instruction_only",
          stepName: null,
          routineStep: null,
          productName: "",
          productUrl: null,
          instructions: "Wait 60 seconds before next step",
          frequency: "daily",
          days: null,
          timeOfDay: "evening",
          order: 1,
        },
      ],
    };

    render(
      <ProductsPurchasedModal
        open={true}
        onOpenChange={handleOpenChange}
        onConfirmProductsReceived={handleConfirmProductsReceived}
        onConfirm={handleConfirm}
        routine={routine}
      />,
    );

    // ============================================
    // USER SEES MODAL HEADER
    // ============================================
    expect(
      screen.getByRole("heading", {
        name: /have you purchased your products/i,
      }),
    ).toBeInTheDocument();

    // ============================================
    // USER SEES ONLY PRODUCT STEPS (3 total)
    // ============================================

    // User sees first product (morning)
    expect(screen.getByText("Gentle Gel Cleanser")).toBeInTheDocument();
    expect(screen.getByText("Cleanse")).toBeInTheDocument();

    // User sees second product (morning, no URL)
    expect(screen.getByText("Daily Moisturizer")).toBeInTheDocument();
    expect(screen.getByText("Moisturise")).toBeInTheDocument();

    // User sees third product (evening)
    expect(screen.getByText("Night Serum")).toBeInTheDocument();
    expect(screen.getByText("Treat")).toBeInTheDocument();

    // ============================================
    // USER DOES NOT SEE INSTRUCTION-ONLY STEPS
    // ============================================

    // Instruction-only step titles should NOT appear
    expect(screen.queryByText("Pat Dry")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Wait 60 seconds before next step"),
    ).not.toBeInTheDocument();

    // Their instructions should also NOT appear
    expect(
      screen.queryByText("Gently pat your face dry"),
    ).not.toBeInTheDocument();

    // ============================================
    // USER SEES LINKS FOR PRODUCTS WITH URLs
    // ============================================

    // Products with URLs show "View/Purchase" links
    const purchaseLinks = screen.getAllByRole("link", {
      name: /view\/purchase/i,
    });

    // Should have 2 links (Cleanser and Serum have URLs, Moisturizer doesn't)
    expect(purchaseLinks).toHaveLength(2);

    // Verify correct URLs
    expect(purchaseLinks[0]).toHaveAttribute(
      "href",
      "https://example.com/cleanser",
    );
    expect(purchaseLinks[1]).toHaveAttribute(
      "href",
      "https://example.com/serum",
    );

    // ============================================
    // USER SEES PURCHASE INSTRUCTIONS
    // ============================================
    expect(
      screen.getByText(/once confirmed, you'll set your routine start date/i),
    ).toBeInTheDocument();

    // ============================================
    // USER SEES ACTION BUTTONS
    // ============================================
    expect(
      screen.getByRole("button", { name: /yes, i've received them/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /not yet/i }),
    ).toBeInTheDocument();
  });
});
