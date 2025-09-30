// src/server/routers/__tests__/userProfile.checkExists.test.ts
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { appRouter } from "@/server/_app";
import { db, userProfiles } from "@/db";
import { eq } from "drizzle-orm";

describe("userProfile.checkExists", () => {
  const caller = appRouter.createCaller({});

  beforeEach(async () => {
    // Create a test profile
    await caller.userProfile.create({
      firstName: "John",
      lastName: "Doe",
      email: "existing@example.com",
      phoneNumber: "+254712345678",
      dateOfBirth: "1995-03-15",
    });
  });

  afterEach(async () => {
    await db.delete(userProfiles).where(eq(userProfiles.email, "existing@example.com"));
  });

  it("should return exists: false when email doesn't exist", async () => {
    const result = await caller.userProfile.checkExists({
      email: "nonexistent@example.com",
    });

    expect(result.exists).toBe(false);
    expect(result.profile).toBeNull();
  });

  it("should return exists: false when phone doesn't exist", async () => {
    const result = await caller.userProfile.checkExists({
      phoneNumber: "+254799999999",
    });

    expect(result.exists).toBe(false);
    expect(result.profile).toBeNull();
  });

  it("should return exists: true + full profile when email exists", async () => {
    const result = await caller.userProfile.checkExists({
      email: "existing@example.com",
    });

    expect(result.exists).toBe(true);
    expect(result.profile).toBeDefined();
    expect(result.profile?.email).toBe("existing@example.com");
    expect(result.profile?.firstName).toBe("John");
    expect(result.profile?.lastName).toBe("Doe");
  });

  it("should return exists: true + full profile when phone exists", async () => {
    const result = await caller.userProfile.checkExists({
      phoneNumber: "+254712345678",
    });

    expect(result.exists).toBe(true);
    expect(result.profile).toBeDefined();
    expect(result.profile?.phoneNumber).toBe("+254712345678");
    expect(result.profile?.firstName).toBe("John");
  });

  it("should check both email AND phone (either match = exists)", async () => {
    // Check with existing email + non-existing phone
    const result1 = await caller.userProfile.checkExists({
      email: "existing@example.com",
      phoneNumber: "+254799999999",
    });

    expect(result1.exists).toBe(true); // email matches

    // Check with non-existing email + existing phone
    const result2 = await caller.userProfile.checkExists({
      email: "other@example.com",
      phoneNumber: "+254712345678",
    });

    expect(result2.exists).toBe(true); // phone matches
  });

  it("should reject when neither email nor phoneNumber provided", async () => {
    await expect(
      caller.userProfile.checkExists({})
    ).rejects.toThrow(/either email or phonenumber must be provided/i);
  });

  it("should normalize email before checking", async () => {
    // Email stored as "existing@example.com" (lowercase)
    const result = await caller.userProfile.checkExists({
      email: "  EXISTING@EXAMPLE.COM  ", // uppercase with spaces
    });

    expect(result.exists).toBe(true);
    expect(result.profile?.email).toBe("existing@example.com");
  });

  it("should normalize phone before checking", async () => {
    const result = await caller.userProfile.checkExists({
      phoneNumber: "  +254712345678  ", // with spaces
    });

    expect(result.exists).toBe(true);
    expect(result.profile?.phoneNumber).toBe("+254712345678");
  });

  it("should return all profile fields including tracking data", async () => {
    const result = await caller.userProfile.checkExists({
      email: "existing@example.com",
    });

    expect(result.profile).toHaveProperty("id");
    expect(result.profile).toHaveProperty("firstName");
    expect(result.profile).toHaveProperty("lastName");
    expect(result.profile).toHaveProperty("email");
    expect(result.profile).toHaveProperty("phoneNumber");
    expect(result.profile).toHaveProperty("dateOfBirth");
    expect(result.profile).toHaveProperty("skinType");
    expect(result.profile).toHaveProperty("concerns");
    expect(result.profile).toHaveProperty("hasAllergies");
    expect(result.profile).toHaveProperty("allergyDetails");
    expect(result.profile).toHaveProperty("isSubscribed");
    expect(result.profile).toHaveProperty("hasCompletedBooking");
    expect(result.profile).toHaveProperty("completedSteps");
    expect(result.profile).toHaveProperty("isCompleted");
    expect(result.profile).toHaveProperty("completedAt");
    expect(result.profile).toHaveProperty("createdAt");
    expect(result.profile).toHaveProperty("updatedAt");
  });
});
