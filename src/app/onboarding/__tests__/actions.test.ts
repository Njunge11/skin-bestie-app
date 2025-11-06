// src/features/onboarding/__tests__/actions.test.ts
import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  createUserProfile,
  getUserProfile,
  updateUserProfile,
  checkUserExists,
  type OnboardingActionsDeps,
} from "../actions";

describe("Onboarding Actions - Unit Tests", () => {
  let deps: OnboardingActionsDeps;
  let apiGetStub: ReturnType<typeof vi.fn>;
  let apiPostStub: ReturnType<typeof vi.fn>;
  let apiPatchStub: ReturnType<typeof vi.fn>;

  // Test data
  const validProfileInput = {
    firstName: "Jane",
    lastName: "Doe",
    email: "jane@example.com",
    phoneNumber: "+1234567890",
    dateOfBirth: "1990-01-15",
  };

  const mockProfileResponse = {
    id: "550e8400-e29b-41d4-a716-446655440000",
    firstName: "Jane",
    lastName: "Doe",
    email: "jane@example.com",
    phoneNumber: "+1234567890",
    dateOfBirth: "1990-01-15",
    skinType: null,
    concerns: null,
    hasAllergies: null,
    allergyDetails: null,
    isSubscribed: null,
    hasCompletedBooking: null,
    completedSteps: ["PERSONAL"],
    isCompleted: false,
    completedAt: null,
    createdAt: "2025-01-15T10:00:00Z",
    updatedAt: "2025-01-15T10:00:00Z",
  };

  beforeEach(() => {
    apiGetStub = vi.fn(async () => mockProfileResponse);
    apiPostStub = vi.fn(async () => mockProfileResponse);
    apiPatchStub = vi.fn(async () => mockProfileResponse);

    deps = {
      api: {
        get: apiGetStub,
        post: apiPostStub,
        patch: apiPatchStub,
      },
    };
  });

  describe("createUserProfile", () => {
    it("create_withValidData_returnsSuccessWithProfile", async () => {
      const result = await createUserProfile(validProfileInput, deps);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBe(mockProfileResponse.id);
        expect(result.data.email).toBe(mockProfileResponse.email);
        expect(result.data.completedSteps).toEqual(["PERSONAL"]);
      }
    });

    it("create_withValidData_callsApiPostWithCorrectEndpoint", async () => {
      let capturedEndpoint = "";
      let capturedBody: unknown;

      deps.api.post = async (endpoint: string, body: unknown) => {
        capturedEndpoint = endpoint;
        capturedBody = body;
        return mockProfileResponse;
      };

      await createUserProfile(validProfileInput, deps);

      expect(capturedEndpoint).toBe("/api/user-profiles");
      expect(capturedBody).toEqual(validProfileInput);
    });

    it("create_withExistingProfile_returnsSuccessWithResumeData", async () => {
      const resumeProfile = {
        ...mockProfileResponse,
        completedSteps: ["PERSONAL", "SKIN_TYPE"],
        skinType: ["Oily", "Sensitive"],
      };

      deps.api.post = async () => resumeProfile;

      const result = await createUserProfile(validProfileInput, deps);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.completedSteps).toEqual(["PERSONAL", "SKIN_TYPE"]);
        expect(result.data.skinType).toEqual(["Oily", "Sensitive"]);
      }
    });

    it("create_withConflictError_returnsErrorWithMessage", async () => {
      deps.api.post = async () => {
        const error = new Error(
          "Email is already registered with different details",
        ) as Error & { status: number };
        error.status = 409;
        throw error;
      };

      const result = await createUserProfile(validProfileInput, deps);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(
          "Email is already registered with different details",
        );
      }
    });

    it("create_withValidationError_returnsErrorWithMessage", async () => {
      deps.api.post = async () => {
        const error = new Error("Invalid email format") as Error & {
          status: number;
        };
        error.status = 400;
        throw error;
      };

      const result = await createUserProfile(validProfileInput, deps);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Invalid email format");
      }
    });

    it("create_withNetworkError_returnsGenericError", async () => {
      deps.api.post = async () => {
        throw new Error("Network connection failed");
      };

      const result = await createUserProfile(validProfileInput, deps);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Failed to create profile");
      }
    });
  });

  describe("getUserProfile", () => {
    const userId = "550e8400-e29b-41d4-a716-446655440000";

    it("get_withValidId_returnsSuccessWithProfile", async () => {
      const result = await getUserProfile(userId, deps);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBe(userId);
        expect(result.data.email).toBe(mockProfileResponse.email);
      }
    });

    it("get_withValidId_callsApiGetWithCorrectEndpoint", async () => {
      let capturedEndpoint = "";

      deps.api.get = async (endpoint: string) => {
        capturedEndpoint = endpoint;
        return mockProfileResponse;
      };

      await getUserProfile(userId, deps);

      expect(capturedEndpoint).toBe(`/api/user-profiles/${userId}`);
    });

    it("get_withNotFoundError_returnsErrorWithMessage", async () => {
      deps.api.get = async () => {
        const error = new Error("Profile not found") as Error & {
          status: number;
        };
        error.status = 404;
        throw error;
      };

      const result = await getUserProfile(userId, deps);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Profile not found");
      }
    });

    it("get_withNetworkError_returnsGenericError", async () => {
      deps.api.get = async () => {
        throw new Error("Network timeout");
      };

      const result = await getUserProfile(userId, deps);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Failed to fetch profile");
      }
    });
  });

  describe("updateUserProfile", () => {
    const userId = "550e8400-e29b-41d4-a716-446655440000";

    it("update_withSkinType_returnsSuccessWithUpdatedProfile", async () => {
      const updates = {
        skinType: ["Oily", "Sensitive"],
        completedSteps: ["PERSONAL", "SKIN_TYPE"],
      };

      const updatedProfile = {
        ...mockProfileResponse,
        skinType: ["Oily", "Sensitive"],
        completedSteps: ["PERSONAL", "SKIN_TYPE"],
      };

      deps.api.patch = async () => updatedProfile;

      const result = await updateUserProfile(userId, updates, deps);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.skinType).toEqual(["Oily", "Sensitive"]);
        expect(result.data.completedSteps).toEqual(["PERSONAL", "SKIN_TYPE"]);
      }
    });

    it("update_withSkinType_callsApiPatchWithCorrectData", async () => {
      let capturedEndpoint = "";
      let capturedBody: unknown;

      deps.api.patch = async (endpoint: string, body: unknown) => {
        capturedEndpoint = endpoint;
        capturedBody = body;
        return mockProfileResponse;
      };

      const updates = {
        skinType: ["Dry"],
        completedSteps: ["PERSONAL", "SKIN_TYPE"],
      };

      await updateUserProfile(userId, updates, deps);

      expect(capturedEndpoint).toBe(`/api/user-profiles/${userId}`);
      expect(capturedBody).toEqual(updates);
    });

    it("update_withConcerns_returnsSuccessWithUpdatedProfile", async () => {
      const updates = {
        concerns: ["Acne", "Redness"],
        completedSteps: ["PERSONAL", "SKIN_TYPE", "SKIN_CONCERNS"],
      };

      const updatedProfile = {
        ...mockProfileResponse,
        concerns: ["Acne", "Redness"],
        completedSteps: ["PERSONAL", "SKIN_TYPE", "SKIN_CONCERNS"],
      };

      deps.api.patch = async () => updatedProfile;

      const result = await updateUserProfile(userId, updates, deps);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.concerns).toEqual(["Acne", "Redness"]);
      }
    });

    it("update_withAllergies_returnsSuccessWithUpdatedProfile", async () => {
      const updates = {
        hasAllergies: true,
        allergyDetails: "Fragrance sensitivity",
        completedSteps: ["PERSONAL", "SKIN_TYPE", "SKIN_CONCERNS", "ALLERGIES"],
      };

      const updatedProfile = {
        ...mockProfileResponse,
        hasAllergies: true,
        allergyDetails: "Fragrance sensitivity",
        completedSteps: ["PERSONAL", "SKIN_TYPE", "SKIN_CONCERNS", "ALLERGIES"],
      };

      deps.api.patch = async () => updatedProfile;

      const result = await updateUserProfile(userId, updates, deps);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.hasAllergies).toBe(true);
        expect(result.data.allergyDetails).toBe("Fragrance sensitivity");
      }
    });

    it("update_withSubscription_returnsSuccessWithUpdatedProfile", async () => {
      const updates = {
        isSubscribed: true,
        completedSteps: [
          "PERSONAL",
          "SKIN_TYPE",
          "SKIN_CONCERNS",
          "ALLERGIES",
          "SUBSCRIBE",
        ],
      };

      const updatedProfile = {
        ...mockProfileResponse,
        isSubscribed: true,
        completedSteps: [
          "PERSONAL",
          "SKIN_TYPE",
          "SKIN_CONCERNS",
          "ALLERGIES",
          "SUBSCRIBE",
        ],
      };

      deps.api.patch = async () => updatedProfile;

      const result = await updateUserProfile(userId, updates, deps);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isSubscribed).toBe(true);
      }
    });

    it("update_withBooking_returnsSuccessWithUpdatedProfile", async () => {
      const updates = {
        hasCompletedBooking: true,
        completedSteps: [
          "PERSONAL",
          "SKIN_TYPE",
          "SKIN_CONCERNS",
          "ALLERGIES",
          "SUBSCRIBE",
          "BOOKING",
        ],
      };

      const updatedProfile = {
        ...mockProfileResponse,
        hasCompletedBooking: true,
        completedSteps: [
          "PERSONAL",
          "SKIN_TYPE",
          "SKIN_CONCERNS",
          "ALLERGIES",
          "SUBSCRIBE",
          "BOOKING",
        ],
      };

      deps.api.patch = async () => updatedProfile;

      const result = await updateUserProfile(userId, updates, deps);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.hasCompletedBooking).toBe(true);
      }
    });

    it("update_withNotFoundError_returnsErrorWithMessage", async () => {
      deps.api.patch = async () => {
        const error = new Error("Profile not found") as Error & {
          status: number;
        };
        error.status = 404;
        throw error;
      };

      const result = await updateUserProfile(
        userId,
        { skinType: ["Dry"] },
        deps,
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Profile not found");
      }
    });

    it("update_withValidationError_returnsErrorWithMessage", async () => {
      deps.api.patch = async () => {
        const error = new Error("Invalid data") as Error & { status: number };
        error.status = 400;
        throw error;
      };

      const result = await updateUserProfile(userId, { skinType: [] }, deps);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Invalid data");
      }
    });

    it("update_withNetworkError_returnsGenericError", async () => {
      deps.api.patch = async () => {
        throw new Error("Connection timeout");
      };

      const result = await updateUserProfile(
        userId,
        { skinType: ["Dry"] },
        deps,
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Failed to update profile");
      }
    });
  });

  describe("checkUserExists", () => {
    it("check_withExistingEmail_returnsExistsTrue", async () => {
      deps.api.get = async () => ({
        exists: true,
        field: "email",
      });

      const result = await checkUserExists({ email: "jane@example.com" }, deps);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.exists).toBe(true);
        expect(result.data.field).toBe("email");
      }
    });

    it("check_withNonExistingEmail_returnsExistsFalse", async () => {
      deps.api.get = async () => ({
        exists: false,
      });

      const result = await checkUserExists({ email: "new@example.com" }, deps);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.exists).toBe(false);
      }
    });

    it("check_withEmail_callsApiGetWithCorrectParams", async () => {
      let capturedEndpoint = "";

      deps.api.get = async (endpoint: string) => {
        capturedEndpoint = endpoint;
        return { exists: false };
      };

      await checkUserExists({ email: "test@example.com" }, deps);

      expect(capturedEndpoint).toContain("/api/user-profiles/check");
      expect(capturedEndpoint).toContain("email=test%40example.com");
    });

    it("check_withPhoneNumber_callsApiGetWithCorrectParams", async () => {
      let capturedEndpoint = "";

      deps.api.get = async (endpoint: string) => {
        capturedEndpoint = endpoint;
        return { exists: false };
      };

      await checkUserExists({ phoneNumber: "+1234567890" }, deps);

      expect(capturedEndpoint).toContain("/api/user-profiles/check");
      expect(capturedEndpoint).toContain("phoneNumber=%2B1234567890");
    });

    it("check_withBothEmailAndPhone_callsApiGetWithBothParams", async () => {
      let capturedEndpoint = "";

      deps.api.get = async (endpoint: string) => {
        capturedEndpoint = endpoint;
        return { exists: false };
      };

      await checkUserExists(
        { email: "test@example.com", phoneNumber: "+1234567890" },
        deps,
      );

      expect(capturedEndpoint).toContain("email=test%40example.com");
      expect(capturedEndpoint).toContain("phoneNumber=%2B1234567890");
    });

    it("check_withNetworkError_returnsGenericError", async () => {
      deps.api.get = async () => {
        throw new Error("Network error");
      };

      const result = await checkUserExists({ email: "test@example.com" }, deps);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Failed to check user existence");
      }
    });
  });

  describe("Error Handling", () => {
    it("create_withApiError_preservesErrorMessage", async () => {
      deps.api.post = async () => {
        const error = new Error("Custom API error message") as Error & {
          status: number;
        };
        error.status = 500;
        throw error;
      };

      const result = await createUserProfile(validProfileInput, deps);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Custom API error message");
      }
    });

    it("update_withApiError_preservesErrorMessage", async () => {
      deps.api.patch = async () => {
        const error = new Error("Custom update error") as Error & {
          status: number;
        };
        error.status = 500;
        throw error;
      };

      const result = await updateUserProfile(
        "550e8400-e29b-41d4-a716-446655440000",
        { skinType: ["Dry"] },
        deps,
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Custom update error");
      }
    });
  });
});
