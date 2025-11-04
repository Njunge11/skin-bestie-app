"use server";

import { auth } from "@/auth";
import { api, ApiError } from "@/lib/api-client";
import { dashboardResponseSchema, type DashboardResponse } from "../schemas";

/**
 * Server Action to fetch dashboard data
 * Validates response against schema for runtime safety
 */
export async function fetchDashboardAction(): Promise<DashboardResponse> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized: No valid session");
  }

  try {
    const data = await api.get(
      `/api/consumer-app/dashboard?userId=${session.user.id}`,
    );

    // Runtime validation at API boundary
    const result = dashboardResponseSchema.safeParse(data);

    if (!result.success) {
      console.error("Dashboard API validation failed:", {
        errors: result.error.issues,
        receivedData: data,
      });
      throw new Error("Invalid dashboard data received from API");
    }

    return result.data;
  } catch (error) {
    console.error("Failed to fetch dashboard:", error);
    throw error;
  }
}

/**
 * Server Action to update user nickname
 */
export async function updateNickname(nickname: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false as const,
        error: {
          message: "Unauthorized",
          code: "UNAUTHORIZED",
        },
      };
    }

    const requestBody = {
      userId: session.user.id,
      nickname,
    };

    console.log(
      "🔵 [updateNickname] Request body:",
      JSON.stringify(requestBody, null, 2),
    );

    const result = await api.patch("/api/consumer-app/profile", requestBody);

    console.log(
      "✅ [updateNickname] Response:",
      JSON.stringify(result, null, 2),
    );

    return {
      success: true as const,
      data: result,
    };
  } catch (error) {
    console.error("Error updating nickname:", error);

    if ((error as ApiError).status) {
      return {
        success: false as const,
        error: {
          message: (error as ApiError).message,
          code: (error as ApiError).status.toString(),
        },
      };
    }

    return {
      success: false as const,
      error: {
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
    };
  }
}

/**
 * Server Action to update skin test completion with skin type
 */
export async function updateSkinTest(skinType: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false as const,
        error: {
          message: "Unauthorized",
          code: "UNAUTHORIZED",
        },
      };
    }

    const result = await api.patch("/api/consumer-app/profile", {
      userId: session.user.id,
      skinType: [skinType],
      hasCompletedSkinTest: true,
    });

    return {
      success: true as const,
      data: result,
    };
  } catch (error) {
    console.error("Error updating skin test:", error);

    if ((error as ApiError).status) {
      return {
        success: false as const,
        error: {
          message: (error as ApiError).message,
          code: (error as ApiError).status.toString(),
        },
      };
    }

    return {
      success: false as const,
      error: {
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
    };
  }
}
