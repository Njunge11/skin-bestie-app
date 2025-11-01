"use server";

import { auth } from "@/auth";
import { api, ApiError } from "@/lib/api-client";

/**
 * Server Action to fetch dashboard data
 */
export async function fetchDashboardAction() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized: No valid session");
  }

  const result = await api.get(
    `/api/consumer-app/dashboard?userId=${session.user.id}`,
  );
  console.log("Dashboard API Response:", JSON.stringify(result, null, 2));
  return result;
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

    const result = await api.patch("/api/consumer-app/profile", {
      userId: session.user.id,
      nickname,
    });

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
