"use client";

import { useOptimistic, startTransition } from "react";
import { Card } from "@/components/ui/card";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { GoalsSection } from "../../dashboard/subscriber-dashboard/goals-section";
import type { Goal, GoalFormData } from "../../dashboard/shared/goals";
import {
  createGoalAction,
  updateGoalAction,
  toggleGoalAction,
  deleteGoalAction,
  reorderGoalsAction,
} from "../../dashboard/shared/goals/goal-actions";

interface ProfileGoalsProps {
  goals: Goal[];
}

export function ProfileGoals({ goals }: ProfileGoalsProps) {
  const queryClient = useQueryClient();

  // Optimistic state for goals
  const [optimisticGoals, addOptimisticGoal] = useOptimistic(
    goals || [],
    (
      currentGoals,
      optimisticValue: {
        action: "add" | "update" | "delete" | "toggle" | "reorder";
        payload: {
          goal?: Goal;
          id?: string;
          data?: Partial<Goal>;
          reorderedGoals?: Goal[];
        };
      },
    ) => {
      switch (optimisticValue.action) {
        case "add": {
          const { goal } = optimisticValue.payload;
          if (!goal) return currentGoals;
          return [...currentGoals, goal];
        }
        case "update": {
          const { id, data } = optimisticValue.payload;
          if (!id || !data) return currentGoals;
          return currentGoals.map((g) =>
            g.id === id
              ? { ...g, ...data }
              : (data.isPrimaryGoal ?? false)
                ? { ...g, isPrimaryGoal: false }
                : g,
          );
        }
        case "delete": {
          const { id } = optimisticValue.payload;
          if (!id) return currentGoals;
          return currentGoals.filter((g) => g.id !== id);
        }
        case "toggle": {
          const { id } = optimisticValue.payload;
          if (!id) return currentGoals;
          return currentGoals.map((g) =>
            g.id === id
              ? {
                  ...g,
                  complete: !g.complete,
                  completedAt: !g.complete ? new Date().toISOString() : null,
                }
              : g,
          );
        }
        case "reorder": {
          const { reorderedGoals } = optimisticValue.payload;
          return reorderedGoals || currentGoals;
        }
        default:
          return currentGoals;
      }
    },
  );

  // Goal handlers
  const handleAddGoal = async (data: GoalFormData) => {
    const optimisticGoal = {
      id: crypto.randomUUID(),
      description: data.description || "",
      isPrimaryGoal: data.isPrimaryGoal ?? false,
      complete: false,
      completedAt: null,
      order: goals?.length || 0,
    } as Goal;

    startTransition(async () => {
      addOptimisticGoal({ action: "add", payload: { goal: optimisticGoal } });

      const result = await createGoalAction(data);

      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        toast.success("Goal added successfully");
      } else {
        toast.error(result.error.message);
        queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      }
    });
  };

  const handleUpdateGoal = async (id: string, data: GoalFormData) => {
    startTransition(async () => {
      addOptimisticGoal({ action: "update", payload: { id, data } });

      const result = await updateGoalAction(id, data);

      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      } else {
        toast.error(result.error.message);
        queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      }
    });
  };

  const handleToggleGoal = async (id: string) => {
    const goal = goals?.find((g) => g.id === id);
    if (!goal) return;

    startTransition(async () => {
      addOptimisticGoal({ action: "toggle", payload: { id } });

      const result = await toggleGoalAction(id, !goal.complete);

      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      } else {
        toast.error(result.error.message);
        queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      }
    });
  };

  const handleDeleteGoal = async (id: string) => {
    startTransition(async () => {
      addOptimisticGoal({ action: "delete", payload: { id } });

      const result = await deleteGoalAction(id);

      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      } else {
        toast.error(result.error.message);
        queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      }
    });
  };

  const handleReorderGoals = async (reorderedGoals: Goal[]) => {
    startTransition(async () => {
      addOptimisticGoal({ action: "reorder", payload: { reorderedGoals } });

      const goalIds = reorderedGoals.map((g) => g.id);
      const result = await reorderGoalsAction(goalIds);

      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      } else {
        toast.error(result.error.message);
        queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      }
    });
  };

  return (
    <Card className="p-6">
      <GoalsSection
        goals={optimisticGoals}
        onAddGoal={handleAddGoal}
        onUpdateGoal={handleUpdateGoal}
        onToggleGoal={handleToggleGoal}
        onDeleteGoal={handleDeleteGoal}
        onReorderGoals={handleReorderGoals}
        noBorder={true}
        noPadding={true}
      />
    </Card>
  );
}
