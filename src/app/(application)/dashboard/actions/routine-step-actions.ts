"use server";

import { auth } from "@/auth";
import { api, ApiError } from "@/lib/api-client";

type Result<T> =
  | { success: true; data: T }
  | { success: false; error: { message: string; code?: string } };

/**
 * Routine step completion response from API
 */
interface RoutineStepCompletion {
  id: string;
  routineProductId: string;
  userProfileId: string;
  scheduledDate: string;
  scheduledTimeOfDay: string;
  onTimeDeadline: string;
  gracePeriodEnd: string;
  completedAt: string | null;
  status: "pending" | "on-time" | "grace-period" | "missed";
  createdAt: string;
  updatedAt: string;
}

/**
 * Toggle completion for a single routine step
 */
export async function toggleRoutineStepAction(
  stepId: string,
  completed: boolean,
): Promise<Result<RoutineStepCompletion>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: { message: "Unauthorized", code: "UNAUTHORIZED" },
      };
    }

    const requestBody = {
      userId: session.user.id,
      stepId,
      completed,
    };

    console.log(
      "🔵 [toggleRoutineStepAction] Request body:",
      JSON.stringify(requestBody, null, 2),
    );

    const result = await api.patch(
      "/api/consumer-app/dashboard/routine-steps",
      requestBody,
    );

    console.log(
      "✅ [toggleRoutineStepAction] Response:",
      JSON.stringify(result, null, 2),
    );

    return { success: true, data: result as RoutineStepCompletion };
  } catch (error) {
    console.error("Error toggling routine step:", error);

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
          error instanceof Error
            ? error.message
            : "Failed to toggle routine step",
      },
    };
  }
}

/**
 * Mark multiple routine steps as complete/incomplete using stepIds array
 */
export async function toggleMultipleStepsAction(
  stepIds: string[],
  completed: boolean,
): Promise<Result<RoutineStepCompletion[]>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: { message: "Unauthorized", code: "UNAUTHORIZED" },
      };
    }

    const requestBody = {
      userId: session.user.id,
      stepIds,
      completed,
    };

    console.log(
      "🔵 [toggleMultipleStepsAction] Request body:",
      JSON.stringify(requestBody, null, 2),
    );

    const result = await api.patch(
      "/api/consumer-app/dashboard/routine-steps",
      requestBody,
    );

    console.log(
      "✅ [toggleMultipleStepsAction] Response:",
      JSON.stringify(result, null, 2),
    );

    return { success: true, data: result as RoutineStepCompletion[] };
  } catch (error) {
    console.error("Error toggling multiple steps:", error);

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
          error instanceof Error
            ? error.message
            : "Failed to toggle multiple steps",
      },
    };
  }
}
