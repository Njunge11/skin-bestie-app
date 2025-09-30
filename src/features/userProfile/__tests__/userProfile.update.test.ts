// src/server/routers/__tests__/userProfile.update.test.ts
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { appRouter } from "@/server/_app";
import { db, userProfiles } from "@/db";
import { eq } from "drizzle-orm";

describe("userProfile.update", () => {
  const caller = appRouter.createCaller({});
  let testProfileId: string;

  beforeEach(async () => {
    // Create a test profile before each test
    const profile = await caller.userProfile.create({
      firstName: "John",
      lastName: "Doe",
      email: "test@example.com",
      phoneNumber: "+254712345678",
      dateOfBirth: "1995-03-15",
    });
    testProfileId = profile.id;
  });

  afterEach(async () => {
    await db.delete(userProfiles).where(eq(userProfiles.email, "test@example.com"));
  });

  it("should successfully update skinType (Step 2)", async () => {
    const result = await caller.userProfile.update({
      id: testProfileId,
      data: {
        skinType: ["Dry", "Sensitive"],
        completedSteps: ["PERSONAL", "SKIN_TYPE"],
      },
    });

    expect(result.skinType).toEqual(["Dry", "Sensitive"]);
    expect(result.completedSteps).toEqual(["PERSONAL", "SKIN_TYPE"]);
  });

  it("should successfully update concerns (Step 3)", async () => {
    const result = await caller.userProfile.update({
      id: testProfileId,
      data: {
        concerns: ["acne", "hyperpigmentation"],
        completedSteps: ["PERSONAL", "SKIN_TYPE", "SKIN_CONCERNS"],
      },
    });

    expect(result.concerns).toEqual(["acne", "hyperpigmentation"]);
  });

  it("should successfully update hasAllergies + allergyDetails (Step 4)", async () => {
    const result = await caller.userProfile.update({
      id: testProfileId,
      data: {
        hasAllergies: true,
        allergyDetails: "Allergic to retinol",
        completedSteps: ["PERSONAL", "SKIN_TYPE", "SKIN_CONCERNS", "ALLERGIES"],
      },
    });

    expect(result.hasAllergies).toBe(true);
    expect(result.allergyDetails).toBe("Allergic to retinol");
  });

  it("should successfully update isSubscribed (Step 5)", async () => {
    const result = await caller.userProfile.update({
      id: testProfileId,
      data: {
        isSubscribed: true,
        completedSteps: ["PERSONAL", "SKIN_TYPE", "SKIN_CONCERNS", "ALLERGIES", "SUBSCRIBE"],
      },
    });

    expect(result.isSubscribed).toBe(true);
  });

  it("should successfully update hasCompletedBooking (Step 6)", async () => {
    const result = await caller.userProfile.update({
      id: testProfileId,
      data: {
        hasCompletedBooking: true,
        completedSteps: ["PERSONAL", "SKIN_TYPE", "SKIN_CONCERNS", "ALLERGIES", "SUBSCRIBE", "BOOKING"],
      },
    });

    expect(result.hasCompletedBooking).toBe(true);
  });

  it("should update completedSteps array", async () => {
    const result = await caller.userProfile.update({
      id: testProfileId,
      data: {
        completedSteps: ["PERSONAL", "SKIN_TYPE", "SKIN_CONCERNS"],
      },
    });

    expect(result.completedSteps).toEqual(["PERSONAL", "SKIN_TYPE", "SKIN_CONCERNS"]);
  });

  it("should update updatedAt timestamp", async () => {
    const original = await caller.userProfile.getById({ id: testProfileId });

    // Wait a bit to ensure timestamp difference
    await new Promise(resolve => setTimeout(resolve, 10));

    const result = await caller.userProfile.update({
      id: testProfileId,
      data: {
        skinType: ["Oily"],
      },
    });

    expect(result.updatedAt.getTime()).toBeGreaterThan(original.updatedAt.getTime());
  });

  it("should reject update with invalid UUID", async () => {
    await expect(
      caller.userProfile.update({
        id: "not-a-uuid",
        data: { skinType: ["Dry"] },
      })
    ).rejects.toThrow();
  });

  it("should return NOT_FOUND for non-existent profile", async () => {
    const fakeUuid = "550e8400-e29b-41d4-a716-446655440000";

    await expect(
      caller.userProfile.update({
        id: fakeUuid,
        data: { skinType: ["Dry"] },
      })
    ).rejects.toThrow(/not found/i);
  });

  it("should allow partial updates (only fields provided)", async () => {
    const result = await caller.userProfile.update({
      id: testProfileId,
      data: {
        skinType: ["Combination"],
      },
    });

    // Only skinType should be updated, others remain unchanged
    expect(result.skinType).toEqual(["Combination"]);
    expect(result.concerns).toBeNull();
    expect(result.hasAllergies).toBeNull();
  });

  it("should set isCompleted: true and completedAt when all steps done", async () => {
    const completedAt = new Date().toISOString();

    const result = await caller.userProfile.update({
      id: testProfileId,
      data: {
        isCompleted: true,
        completedAt,
        completedSteps: ["PERSONAL", "SKIN_TYPE", "SKIN_CONCERNS", "ALLERGIES", "SUBSCRIBE", "BOOKING"],
      },
    });

    expect(result.isCompleted).toBe(true);
    expect(result.completedAt).toBeDefined();
    expect(result.completedSteps).toHaveLength(6);
  });
});
