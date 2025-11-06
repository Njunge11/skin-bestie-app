"use server";

import { auth } from "@/auth";
import { api, ApiError } from "@/lib/api-client";
import type { Goal, GoalFormData } from "./goal.types";

type Result<T> =
  | { success: true; data: T }
  | { success: false; error: { message: string; code?: string } };

/**
 * Create a new goal
 */
export async function createGoalAction(
  data: GoalFormData,
): Promise<Result<Goal>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: { message: "Unauthorized", code: "UNAUTHORIZED" },
      };
    }

    const result = await api.post("/api/consumer-app/goals", {
      userId: session.user.id,
      description: data.description,
      isPrimaryGoal: data.isPrimaryGoal ?? false,
    });

    // api.post already returns { success, data }, so extract the actual data
    return { success: true, data: result.data };
  } catch (error) {
    console.error("Error creating goal:", error);

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
          error instanceof Error ? error.message : "Failed to create goal",
      },
    };
  }
}

/**
 * Update an existing goal
 */
export async function updateGoalAction(
  goalId: string,
  data: GoalFormData,
): Promise<Result<Goal>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: { message: "Unauthorized", code: "UNAUTHORIZED" },
      };
    }

    const result = await api.patch(`/api/consumer-app/goals/${goalId}`, data);

    // api.patch already returns { success, data }, so extract the actual data
    return { success: true, data: result.data };
  } catch (error) {
    console.error("Error updating goal:", error);

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
          error instanceof Error ? error.message : "Failed to update goal",
      },
    };
  }
}

/**
 * Toggle goal completion
 */
export async function toggleGoalAction(
  goalId: string,
  complete: boolean,
): Promise<Result<Goal>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: { message: "Unauthorized", code: "UNAUTHORIZED" },
      };
    }

    const result = await api.patch(`/api/consumer-app/goals/${goalId}`, {
      complete,
    });

    // api.patch already returns { success, data }, so extract the actual data
    return { success: true, data: result.data };
  } catch (error) {
    console.error("Error toggling goal:", error);

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
          error instanceof Error ? error.message : "Failed to toggle goal",
      },
    };
  }
}

/**
 * Delete a goal
 */
export async function deleteGoalAction(goalId: string): Promise<Result<void>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: { message: "Unauthorized", code: "UNAUTHORIZED" },
      };
    }

    await api.delete(`/api/consumer-app/goals/${goalId}`);

    return { success: true, data: undefined };
  } catch (error) {
    console.error("Error deleting goal:", error);

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
          error instanceof Error ? error.message : "Failed to delete goal",
      },
    };
  }
}

/**
 * Reorder goals
 */
export async function reorderGoalsAction(
  goalIds: string[],
): Promise<Result<void>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: { message: "Unauthorized", code: "UNAUTHORIZED" },
      };
    }

    await api.post("/api/consumer-app/goals/reorder", {
      userId: session.user.id,
      goalIds,
    });

    return { success: true, data: undefined };
  } catch (error) {
    console.error("Error reordering goals:", error);

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
          error instanceof Error ? error.message : "Failed to reorder goals",
      },
    };
  }
}

/**
 * Acknowledge goals (mark as seen by client)
 */
export async function acknowledgeGoalsAction(
  acknowledged: boolean,
): Promise<Result<void>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: { message: "Unauthorized", code: "UNAUTHORIZED" },
      };
    }

    await api.patch("/api/consumer-app/goals/acknowledge", {
      userId: session.user.id,
      goalsAcknowledgedByClient: acknowledged,
    });

    return { success: true, data: undefined };
  } catch (error) {
    console.error("Error acknowledging goals:", error);

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
            : "Failed to acknowledge goals",
      },
    };
  }
}
