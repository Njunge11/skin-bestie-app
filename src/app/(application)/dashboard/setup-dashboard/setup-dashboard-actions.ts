"use server";

import { verifySession } from "@/lib/dal";
import { api, ApiError } from "@/lib/api-client";
import { dashboardResponseSchema, type DashboardResponse } from "../schemas";
import { revalidatePath } from "next/cache";

/**
 * Server Action to fetch dashboard data
 * Validates response against schema for runtime safety
 */
export async function fetchDashboardAction(): Promise<DashboardResponse> {
  const { userId } = await verifySession();

  try {
    const data = await api.get(`/api/consumer-app/dashboard?userId=${userId}`);

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
    const { userId } = await verifySession();

    const requestBody = {
      userId,
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
    const { userId } = await verifySession();

    const result = await api.patch("/api/consumer-app/profile", {
      userId,
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

/**
 * Server Action to confirm products received
 */
export async function confirmProductsReceived() {
  try {
    const { userId } = await verifySession();

    const result = await api.patch("/api/consumer-app/profile", {
      userId,
      productsReceived: true,
    });

    // Revalidate dashboard to fetch fresh data
    revalidatePath("/dashboard");

    return {
      success: true as const,
      data: result,
    };
  } catch (error) {
    console.error("Error confirming products received:", error);

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
 * Server Action to update routine start date
 */
export async function updateRoutineStartDate(
  routineId: string,
  startDate: Date,
) {
  try {
    const { userId } = await verifySession();

    // Format date as YYYY-MM-DD in local timezone (not UTC)
    const year = startDate.getFullYear();
    const month = String(startDate.getMonth() + 1).padStart(2, "0");
    const day = String(startDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    const result = await api.patch(`/api/consumer-app/routines/${routineId}`, {
      userId,
      startDate: formattedDate,
    });

    // Revalidate dashboard to fetch fresh data
    revalidatePath("/dashboard");

    return {
      success: true as const,
      data: result,
    };
  } catch (error) {
    console.error("Error updating routine start date:", error);

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
