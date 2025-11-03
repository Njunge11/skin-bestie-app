"use server";

import { auth } from "@/auth";
import { api, ApiError } from "@/lib/api-client";

type Result<T> =
  | { success: true; data: T }
  | { success: false; error: { message: string; code?: string } };

/**
 * Stats response from API
 */
interface StatsResponse {
  todayProgress: {
    completed: number;
    total: number;
    percentage: number;
  };
  currentStreak: {
    days: number;
  };
  weeklyCompliance: {
    percentage: number;
    completed: number;
    total: number;
  };
}

/**
 * Fetch user stats (today's progress, streak, weekly compliance)
 */
export async function fetchStatsAction(): Promise<Result<StatsResponse>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: { message: "Unauthorized", code: "UNAUTHORIZED" },
      };
    }

    console.log(
      "🔵 [fetchStatsAction] Fetching stats for userId:",
      session.user.id,
    );

    const result = await api.get(
      `/api/consumer-app/stats?userId=${session.user.id}`,
    );

    console.log(
      "✅ [fetchStatsAction] Stats response:",
      JSON.stringify(result, null, 2),
    );

    return { success: true, data: result as StatsResponse };
  } catch (error) {
    console.error("❌ [fetchStatsAction] Error fetching stats:", error);

    if ((error as ApiError).status) {
      return {
        success: false,
        error: {
          message: (error as ApiError).message,
          code: (error as ApiError).status.toString(),
        },
      };
    }

    return {
      success: false,
      error: {
        message:
          error instanceof Error ? error.message : "Failed to fetch stats",
      },
    };
  }
}
