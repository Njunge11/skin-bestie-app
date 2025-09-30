// src/server/routers/__tests__/userProfile.getById.test.ts
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { appRouter } from "@/server/_app";
import { db, userProfiles } from "@/db";
import { eq } from "drizzle-orm";

describe("userProfile.getById", () => {
  const caller = appRouter.createCaller({});
  let testProfileId: string;

  beforeEach(async () => {
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

  it("should return profile for valid UUID", async () => {
    const result = await caller.userProfile.getById({ id: testProfileId });

    expect(result).toBeDefined();
    expect(result.id).toBe(testProfileId);
    expect(result.firstName).toBe("John");
    expect(result.lastName).toBe("Doe");
    expect(result.email).toBe("test@example.com");
  });

  it("should return NOT_FOUND for invalid/non-existent UUID", async () => {
    const fakeUuid = "550e8400-e29b-41d4-a716-446655440000";

    await expect(
      caller.userProfile.getById({ id: fakeUuid })
    ).rejects.toThrow(/not found/i);
  });

  it("should reject non-UUID format", async () => {
    await expect(
      caller.userProfile.getById({ id: "not-a-uuid" })
    ).rejects.toThrow();
  });

  it("should return all profile fields", async () => {
    const result = await caller.userProfile.getById({ id: testProfileId });

    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("firstName");
    expect(result).toHaveProperty("lastName");
    expect(result).toHaveProperty("email");
    expect(result).toHaveProperty("phoneNumber");
    expect(result).toHaveProperty("dateOfBirth");
    expect(result).toHaveProperty("skinType");
    expect(result).toHaveProperty("concerns");
    expect(result).toHaveProperty("hasAllergies");
    expect(result).toHaveProperty("allergyDetails");
    expect(result).toHaveProperty("isSubscribed");
    expect(result).toHaveProperty("hasCompletedBooking");
    expect(result).toHaveProperty("completedSteps");
    expect(result).toHaveProperty("isCompleted");
    expect(result).toHaveProperty("completedAt");
    expect(result).toHaveProperty("createdAt");
    expect(result).toHaveProperty("updatedAt");
  });
});
