// src/features/onboarding/actions.ts
"use server";

import { api, isApiError } from "@/lib/api-client";

// ============================================================================
// Types
// ============================================================================

export type UserProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string | Date;
  skinType: string[] | null;
  concerns: string[] | null;
  hasAllergies: boolean | null;
  allergyDetails: string | null;
  isSubscribed: boolean | null;
  hasCompletedBooking: boolean | null;
  completedSteps: string[];
  isCompleted: boolean;
  completedAt: string | Date | null;
  createdAt: string | Date;
  updatedAt: string | Date;
};

export type UserProfileCreateInput = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
};

export type UserProfileUpdateInput = {
  firstName?: string;
  lastName?: string;
  skinType?: string[];
  concerns?: string[];
  hasAllergies?: boolean;
  allergyDetails?: string | null;
  isSubscribed?: boolean;
  hasCompletedBooking?: boolean;
  completedSteps?: string[];
  isCompleted?: boolean;
  completedAt?: string | null;
};

export type CheckExistsInput = {
  email?: string;
  phoneNumber?: string;
};

export type CheckExistsResponse = {
  exists: boolean;
  field?: "email" | "phoneNumber";
};

// Result types
type SuccessResult<T> = { success: true; data: T };
type ErrorResult = { success: false; error: string };
type Result<T> = SuccessResult<T> | ErrorResult;

// ============================================================================
// Dependencies (for testing)
// ============================================================================

export type OnboardingActionsDeps = {
  api: {
    get: typeof api.get;
    post: typeof api.post;
    patch: typeof api.patch;
  };
};

const defaultDeps: OnboardingActionsDeps = {
  api: {
    get: api.get,
    post: api.post,
    patch: api.patch,
  },
};

// ============================================================================
// Server Actions
// ============================================================================

/**
 * Create a new user profile (Step 1)
 *
 * If a profile with the same email+phone exists, returns the existing profile
 * with resume data (completed steps only).
 */
export async function createUserProfile(
  input: UserProfileCreateInput,
  deps: OnboardingActionsDeps = defaultDeps
): Promise<Result<UserProfile>> {
  try {
    const profile = await deps.api.post<UserProfile>(
      "/api/user-profiles",
      input
    );

    return {
      success: true,
      data: profile,
    };
  } catch (error) {
    if (isApiError(error)) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Failed to create profile",
    };
  }
}

/**
 * Get user profile by ID
 */
export async function getUserProfile(
  id: string,
  deps: OnboardingActionsDeps = defaultDeps
): Promise<Result<UserProfile>> {
  try {
    const profile = await deps.api.get<UserProfile>(
      `/api/user-profiles/${id}`
    );

    return {
      success: true,
      data: profile,
    };
  } catch (error) {
    if (isApiError(error)) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Failed to fetch profile",
    };
  }
}

/**
 * Update user profile (Steps 2-6)
 *
 * Only include fields you want to update.
 */
export async function updateUserProfile(
  id: string,
  updates: UserProfileUpdateInput,
  deps: OnboardingActionsDeps = defaultDeps
): Promise<Result<UserProfile>> {
  try {
    const profile = await deps.api.patch<UserProfile>(
      `/api/user-profiles/${id}`,
      updates
    );

    return {
      success: true,
      data: profile,
    };
  } catch (error) {
    if (isApiError(error)) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Failed to update profile",
    };
  }
}

/**
 * Check if a user profile exists by email or phone
 */
export async function checkUserExists(
  params: CheckExistsInput,
  deps: OnboardingActionsDeps = defaultDeps
): Promise<Result<CheckExistsResponse>> {
  try {
    const query = new URLSearchParams();

    if (params.email) {
      query.set("email", params.email);
    }

    if (params.phoneNumber) {
      query.set("phoneNumber", params.phoneNumber);
    }

    const result = await deps.api.get<CheckExistsResponse>(
      `/api/user-profiles/check?${query.toString()}`
    );

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    if (isApiError(error)) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Failed to check user existence",
    };
  }
}
