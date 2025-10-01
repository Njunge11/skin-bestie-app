// src/features/userProfile/userProfile.router.ts
import { z } from "zod";
import { router, publicProcedure } from "@/server/trpc";
import { db, userProfiles } from "@/db";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import {
  UserProfileCreateSchema,
  UserProfileUpdateSchema,
  normalizeEmail,
  normalizePhone,
  parseDateOnlyToDate,
} from "./userProfile.schema";

// Create profile (Step 1 only)
async function createProfile(input: z.infer<typeof UserProfileCreateSchema>) {
  try {
    const email = normalizeEmail(input.email);
    const phone = normalizePhone(input.phoneNumber);

    // Check if profile exists with BOTH email AND phone
    const exactMatch = await db.query.userProfiles.findFirst({
      where: (acct, { and, eq }) =>
        and(eq(acct.email, email), eq(acct.phoneNumber, phone)),
    });

    // If exact match found, allow resume
    if (exactMatch) {
      const completedSteps = exactMatch.completedSteps || [];

      return {
        id: exactMatch.id,
        completedSteps: completedSteps,
        // Only return data for completed steps
        skinType: completedSteps.includes('SKIN_TYPE') ? exactMatch.skinType : null,
        concerns: completedSteps.includes('SKIN_CONCERNS') ? exactMatch.concerns : null,
        hasAllergies: completedSteps.includes('ALLERGIES') ? exactMatch.hasAllergies : null,
        allergyDetails: completedSteps.includes('ALLERGIES') ? exactMatch.allergyDetails : null,
        isSubscribed: completedSteps.includes('SUBSCRIBE') ? exactMatch.isSubscribed : null,
        hasCompletedBooking: completedSteps.includes('BOOKING') ? exactMatch.hasCompletedBooking : null,
        // Required fields - return empty/null for security
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        dateOfBirth: new Date(),
        isCompleted: exactMatch.isCompleted,
        completedAt: exactMatch.completedAt,
        createdAt: exactMatch.createdAt,
        updatedAt: exactMatch.updatedAt,
      };
    }

    // Check if email OR phone is already taken (partial match)
    const partialMatch = await db.query.userProfiles.findFirst({
      where: (acct, { or, eq }) =>
        or(eq(acct.email, email), eq(acct.phoneNumber, phone)),
    });

    if (partialMatch) {
      const field = partialMatch.email === email ? "Email" : "Phone number";
      throw new TRPCError({
        code: "CONFLICT",
        message: `${field} is already registered with different details`,
      });
    }

    // Insert Step 1 data only
    const values: typeof userProfiles.$inferInsert = {
      firstName: input.firstName,
      lastName: input.lastName,
      phoneNumber: phone,
      email,
      dateOfBirth: parseDateOnlyToDate(input.dateOfBirth),
      completedSteps: ["PERSONAL"],
    };

    const [row] = await db.insert(userProfiles).values(values).returning();

    if (!row) {
      throw new Error("Failed to create profile - no row returned");
    }

    return row;
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }

    console.error("Failed to create user profile:", error);

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to create profile",
    });
  }
}

// Get profile by ID
async function getProfileById(input: { id: string }) {
  try {
    const profile = await db.query.userProfiles.findFirst({
      where: (acct, { eq }) => eq(acct.id, input.id),
    });

    if (!profile) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Profile not found",
      });
    }

    return profile;
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }

    console.error("Failed to fetch profile by ID:", error);

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch profile",
    });
  }
}

// Get profile by email
async function getProfileByEmail(input: { email: string }) {
  try {
    const email = normalizeEmail(input.email);
    const profile = await db.query.userProfiles.findFirst({
      where: (acct, { eq }) => eq(acct.email, email),
    });

    if (!profile) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Profile not found",
      });
    }

    return profile;
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }

    console.error("Failed to fetch profile by email:", error);

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch profile",
    });
  }
}

// Check if email or phone exists
async function checkProfileExists(input: { email?: string; phoneNumber?: string }) {
  try {
    const email = input.email ? normalizeEmail(input.email) : null;
    const phone = input.phoneNumber ? normalizePhone(input.phoneNumber) : null;

    const profile = await db.query.userProfiles.findFirst({
      where: (acct, { or, eq }) => {
        const clauses = [];
        if (email) clauses.push(eq(acct.email, email));
        if (phone) clauses.push(eq(acct.phoneNumber, phone));
        return or(...clauses);
      },
    });

    return {
      exists: !!profile,
      profile: profile || null,
    };
  } catch (error) {
    console.error("Failed to check profile existence:", error);

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to check profile existence",
    });
  }
}

// Update profile (Steps 2-6)
async function updateProfile(input: { id: string; data: z.infer<typeof UserProfileUpdateSchema> }) {
  try {
    // Convert completedAt string to Date if provided
    const updateData: Partial<typeof userProfiles.$inferInsert> = {
      ...input.data,
      completedAt: input.data.completedAt ? new Date(input.data.completedAt) : undefined,
      updatedAt: new Date(),
    };

    const [updated] = await db
      .update(userProfiles)
      .set(updateData)
      .where(eq(userProfiles.id, input.id))
      .returning();

    if (!updated) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Profile not found",
      });
    }

    return updated;
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }

    console.error("Failed to update user profile:", error);

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to update profile",
    });
  }
}

// Export router
export const userProfileRouter = router({
  create: publicProcedure
    .input(UserProfileCreateSchema)
    .mutation(({ input }) => createProfile(input)),

  getById: publicProcedure
    .input(z.object({ id: z.uuid() }))
    .query(({ input }) => getProfileById(input)),

  getByEmail: publicProcedure
    .input(z.object({ email: z.string().trim().email() }))
    .query(({ input }) => getProfileByEmail(input)),

  checkExists: publicProcedure
    .input(
      z
        .object({
          email: z.string().trim().email().optional(),
          phoneNumber: z.string().optional(),
        })
        .refine((data) => data.email || data.phoneNumber, {
          message: "Either email or phoneNumber must be provided",
        })
    )
    .query(({ input }) => checkProfileExists(input)),

  update: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        data: UserProfileUpdateSchema,
      })
    )
    .mutation(({ input }) => updateProfile(input)),
});
