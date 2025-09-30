// src/server/routers/__tests__/userProfile.create.test.ts
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { appRouter } from "@/server/_app";
import { db, userProfiles } from "@/db";
import { eq } from "drizzle-orm";

describe("userProfile.create", () => {
  const caller = appRouter.createCaller({});

  // Clean up test data after each test
  afterEach(async () => {
    await db
      .delete(userProfiles)
      .where(eq(userProfiles.email, "test@example.com"));
    await db
      .delete(userProfiles)
      .where(eq(userProfiles.email, "another@example.com"));
    await db
      .delete(userProfiles)
      .where(eq(userProfiles.phoneNumber, "+254712345678"));
  });

  it("should successfully create profile with valid Step 1 data", async () => {
    const input = {
      firstName: "John",
      lastName: "Doe",
      email: "test@example.com",
      phoneNumber: "+254712345678",
      dateOfBirth: "1995-03-15",
    };

    const result = await caller.userProfile.create(input);

    expect(result).toMatchObject({
      firstName: "John",
      lastName: "Doe",
      email: "test@example.com",
      phoneNumber: "+254712345678",
    });
    expect(result.id).toBeDefined();
    expect(result.createdAt).toBeInstanceOf(Date);
  });

  it("should return profile with completedSteps: ['PERSONAL']", async () => {
    const input = {
      firstName: "John",
      lastName: "Doe",
      email: "test@example.com",
      phoneNumber: "+254712345678",
      dateOfBirth: "1995-03-15",
    };

    const result = await caller.userProfile.create(input);

    expect(result.completedSteps).toEqual(["PERSONAL"]);
  });

  it("should set all optional fields as NULL", async () => {
    const input = {
      firstName: "John",
      lastName: "Doe",
      email: "test@example.com",
      phoneNumber: "+254712345678",
      dateOfBirth: "1995-03-15",
    };

    const result = await caller.userProfile.create(input);

    expect(result.skinType).toBeNull();
    expect(result.concerns).toBeNull();
    expect(result.hasAllergies).toBeNull();
    expect(result.allergyDetails).toBeNull();
    expect(result.isSubscribed).toBeNull();
    expect(result.hasCompletedBooking).toBeNull();
  });

  it("should set tracking fields correctly", async () => {
    const input = {
      firstName: "John",
      lastName: "Doe",
      email: "test@example.com",
      phoneNumber: "+254712345678",
      dateOfBirth: "1995-03-15",
    };

    const result = await caller.userProfile.create(input);

    expect(result.isCompleted).toBe(false);
    expect(result.completedAt).toBeNull();
    expect(result.completedSteps).toEqual(["PERSONAL"]);
  });

  it("should reject invalid email format", async () => {
    const input = {
      firstName: "John",
      lastName: "Doe",
      email: "invalid-email",
      phoneNumber: "+254712345678",
      dateOfBirth: "1995-03-15",
    };

    await expect(caller.userProfile.create(input)).rejects.toThrow();
  });

  it("should reject missing required fields - firstName", async () => {
    const input = {
      lastName: "Doe",
      email: "test@example.com",
      phoneNumber: "+254712345678",
      dateOfBirth: "1995-03-15",
    } as any;

    await expect(caller.userProfile.create(input)).rejects.toThrow();
  });

  it("should reject missing required fields - email", async () => {
    const input = {
      firstName: "John",
      lastName: "Doe",
      phoneNumber: "+254712345678",
      dateOfBirth: "1995-03-15",
    } as any;

    await expect(caller.userProfile.create(input)).rejects.toThrow();
  });

  it("should reject duplicate email", async () => {
    const input = {
      firstName: "John",
      lastName: "Doe",
      email: "test@example.com",
      phoneNumber: "+254712345678",
      dateOfBirth: "1995-03-15",
    };

    // Create first profile
    await caller.userProfile.create(input);

    // Try to create duplicate with same email
    const duplicateInput = {
      ...input,
      phoneNumber: "+254712345679", // different phone
    };

    await expect(caller.userProfile.create(duplicateInput)).rejects.toThrow(
      /email/i
    );
  });

  it("should reject duplicate phone number", async () => {
    const input = {
      firstName: "John",
      lastName: "Doe",
      email: "test@example.com",
      phoneNumber: "+254712345678",
      dateOfBirth: "1995-03-15",
    };

    // Create first profile
    await caller.userProfile.create(input);

    // Try to create duplicate with same phone
    const duplicateInput = {
      ...input,
      email: "another@example.com", // different email
    };

    await expect(caller.userProfile.create(duplicateInput)).rejects.toThrow(
      /phone/i
    );
  });

  it("should return existing profile data in error when duplicate found", async () => {
    const input = {
      firstName: "John",
      lastName: "Doe",
      email: "test@example.com",
      phoneNumber: "+254712345678",
      dateOfBirth: "1995-03-15",
    };

    // Create first profile
    const created = await caller.userProfile.create(input);

    // Try to create duplicate
    try {
      await caller.userProfile.create(input);
      expect.fail("Should have thrown error");
    } catch (error: any) {
      expect(error.cause?.existingProfile).toBeDefined();
      expect(error.cause.existingProfile.id).toBe(created.id);
      expect(error.cause.existingProfile.email).toBe("test@example.com");
    }
  });
});
