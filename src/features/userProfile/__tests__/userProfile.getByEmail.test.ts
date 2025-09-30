// src/server/routers/__tests__/userProfile.getByEmail.test.ts
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { appRouter } from "@/server/_app";
import { db, userProfiles } from "@/db";
import { eq } from "drizzle-orm";

describe("userProfile.getByEmail", () => {
  const caller = appRouter.createCaller({});

  beforeEach(async () => {
    await caller.userProfile.create({
      firstName: "John",
      lastName: "Doe",
      email: "test@example.com",
      phoneNumber: "+254712345678",
      dateOfBirth: "1995-03-15",
    });
  });

  afterEach(async () => {
    await db.delete(userProfiles).where(eq(userProfiles.email, "test@example.com"));
  });

  it("should return profile for existing email", async () => {
    const result = await caller.userProfile.getByEmail({ email: "test@example.com" });

    expect(result).toBeDefined();
    expect(result.email).toBe("test@example.com");
    expect(result.firstName).toBe("John");
    expect(result.lastName).toBe("Doe");
  });

  it("should return NOT_FOUND for non-existent email", async () => {
    await expect(
      caller.userProfile.getByEmail({ email: "nonexistent@example.com" })
    ).rejects.toThrow(/not found/i);
  });

  it("should reject invalid email format", async () => {
    await expect(
      caller.userProfile.getByEmail({ email: "invalid-email" })
    ).rejects.toThrow();
  });

  it("should normalize email before lookup", async () => {
    // Profile stored with "test@example.com"
    const result = await caller.userProfile.getByEmail({
      email: "  TEST@EXAMPLE.COM  ", // uppercase with spaces
    });

    expect(result.email).toBe("test@example.com");
  });

  it("should return all profile fields", async () => {
    const result = await caller.userProfile.getByEmail({ email: "test@example.com" });

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
