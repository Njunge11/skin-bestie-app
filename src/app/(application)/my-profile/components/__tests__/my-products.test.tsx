import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MyProducts } from "../my-products";
import type { DashboardResponse } from "../../../dashboard/schemas/dashboard.schema";

/**
 * MY PRODUCTS TABLE - FILTERING INTEGRATION TEST
 *
 * Tests that user only sees actual products (not instruction_only steps) in the table
 * and sees appropriate fallbacks for missing data.
 * Follows Kent C. Dodds principles: test complete user workflow from their perspective.
 */

describe("My Products Table - Product Filtering", () => {
  it("user views My Products table with correct filtering and fallbacks", () => {
    // Mock dashboard data with mixed product and instruction_only steps
    const dashboard: DashboardResponse = {
      user: {
        userId: "user-1",
        userProfileId: "profile-1",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phoneNumber: "+1234567890",
        dateOfBirth: "1990-01-01",
        nickname: null,
        skinType: ["combination"],
        concerns: ["acne", "dryness"],
        hasAllergies: false,
        allergyDetails: null,
        isSubscribed: true,
        occupation: null,
        bio: null,
        timezone: "America/New_York",
        feedbackSurveyVisible: false,
        profileTags: [],
      },
      setupProgress: {
        percentage: 100,
        completed: 6,
        total: 6,
        steps: {
          hasCompletedSkinTest: true,
          hasPublishedGoals: true,
          hasPublishedRoutine: true,
          hasCompletedBooking: true,
          productsReceived: true,
          routineStartDateSet: true,
        },
      },
      todayRoutine: null,
      catchupSteps: null,
      routine: {
        id: "routine-1",
        name: "Daily Routine",
        startDate: "2025-11-01T00:00:00.000Z",
        endDate: null,
        productPurchaseInstructions: "Available at local pharmacy",
        morning: [
          // Product with URL and routineStep - SHOULD appear
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
          // Instruction-only - should NOT appear
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
          // Product WITHOUT URL - SHOULD appear with "No Link"
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
          // Product with NULL routineStep - SHOULD appear with "N/A"
          {
            id: "4",
            stepType: "product",
            stepName: null,
            routineStep: null,
            productName: "Custom Product",
            productUrl: "https://example.com/custom",
            instructions: "Use as directed",
            frequency: "daily",
            days: null,
            timeOfDay: "morning",
            order: 3,
          },
        ],
        evening: [
          // Product with URL - SHOULD appear
          {
            id: "5",
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
          // Instruction-only - should NOT appear
          {
            id: "6",
            stepType: "instruction_only",
            stepName: null,
            routineStep: null,
            productName: "",
            productUrl: null,
            instructions: "Wait before sleeping",
            frequency: "daily",
            days: null,
            timeOfDay: "evening",
            order: 1,
          },
          // Duplicate product (same name as ID 1) - should NOT duplicate
          {
            id: "7",
            stepType: "product",
            stepName: null,
            routineStep: "Cleanse",
            productName: "Gentle Gel Cleanser", // Same as morning
            productUrl: "https://example.com/cleanser",
            instructions: "Apply to wet face",
            frequency: "daily",
            days: null,
            timeOfDay: "evening",
            order: 2,
          },
        ],
      },
      goals: null,
      goalsAcknowledgedByClient: false,
    };

    render(<MyProducts dashboard={dashboard} />);

    // ============================================
    // USER SEES TABLE HEADER
    // ============================================
    expect(
      screen.getByRole("heading", { name: /my products/i }),
    ).toBeInTheDocument();

    // Table headers
    expect(screen.getByText("Product")).toBeInTheDocument();
    expect(screen.getByText("Category")).toBeInTheDocument();
    expect(screen.getByText("Store Link")).toBeInTheDocument();
    expect(screen.getByText("Purchase Instructions")).toBeInTheDocument();

    // ============================================
    // USER SEES ONLY PRODUCT STEPS (4 unique products)
    // ============================================

    // Product 1: Gentle Gel Cleanser (appears in both morning and evening, but deduplicated)
    expect(screen.getByText("Gentle Gel Cleanser")).toBeInTheDocument();

    // Product 2: Daily Moisturizer
    expect(screen.getByText("Daily Moisturizer")).toBeInTheDocument();

    // Product 3: Custom Product
    expect(screen.getByText("Custom Product")).toBeInTheDocument();

    // Product 4: Night Serum
    expect(screen.getByText("Night Serum")).toBeInTheDocument();

    // Should have exactly 4 product rows (not 5, because Gentle Gel Cleanser is deduplicated)
    const productNames = [
      "Gentle Gel Cleanser",
      "Daily Moisturizer",
      "Custom Product",
      "Night Serum",
    ];
    productNames.forEach((name) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });

    // ============================================
    // USER DOES NOT SEE INSTRUCTION-ONLY STEPS
    // ============================================

    // Instruction-only titles/names should NOT appear
    expect(screen.queryByText("Pat Dry")).not.toBeInTheDocument();
    expect(screen.queryByText("Wait before sleeping")).not.toBeInTheDocument();

    // ============================================
    // USER SEES "VIEW PRODUCT" LINKS WHERE URL EXISTS
    // ============================================

    const viewProductLinks = screen.getAllByRole("link", {
      name: /view product/i,
    });

    // Should have 3 "View Product" links:
    // - Gentle Gel Cleanser (has URL)
    // - Custom Product (has URL)
    // - Night Serum (has URL)
    // Daily Moisturizer has no URL, so should show "No Link"
    expect(viewProductLinks).toHaveLength(3);

    // ============================================
    // USER SEES "NO LINK" FOR PRODUCTS WITHOUT URL
    // ============================================

    // Daily Moisturizer has no URL
    const noLinkText = screen.getByText("No Link");
    expect(noLinkText).toBeInTheDocument();
    expect(noLinkText).toHaveClass("text-gray-400");

    // ============================================
    // USER SEES "N/A" FOR NULL ROUTINE STEP
    // ============================================

    // Custom Product has null routineStep
    const naCells = screen.getAllByText("N/A");
    expect(naCells.length).toBeGreaterThan(0);

    // ============================================
    // USER SEES PURCHASE INSTRUCTIONS
    // ============================================

    const purchaseInstructions = screen.getAllByText(
      "Available at local pharmacy",
    );
    expect(purchaseInstructions.length).toBeGreaterThan(0);

    // ============================================
    // USER SEES ROUTINE STEP CATEGORIES
    // ============================================

    // Cleanse category
    expect(screen.getByText("Cleanse")).toBeInTheDocument();

    // Moisturise category
    expect(screen.getByText("Moisturise")).toBeInTheDocument();

    // Treat category
    expect(screen.getByText("Treat")).toBeInTheDocument();
  });
});
