"use client";

import { useState, useOptimistic, startTransition } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { type DashboardResponse } from "../../dashboard/schemas";
import { RoutineTabs } from "../../dashboard/components/routine-tabs";
import { GoalsSection } from "../../dashboard/components/goals-section";
import { ProgressPhotos } from "./progress-photos";
import type { Goal, GoalFormData } from "@/features/goals/types";
import {
  createGoalAction,
  updateGoalAction,
  toggleGoalAction,
  deleteGoalAction,
  reorderGoalsAction,
} from "../../dashboard/goal-actions";
import {
  toggleRoutineStepAction,
  toggleMultipleStepsAction,
} from "../../dashboard/actions/routine-step-actions";

interface ProfileTabsProps {
  dashboard: DashboardResponse;
}

export function ProfileTabs({ dashboard }: ProfileTabsProps) {
  const queryClient = useQueryClient();
  const { todayRoutine, goals = [] } = dashboard;

  // Initialize checked steps from todayRoutine completion status
  const [checkedSteps, setCheckedSteps] = useState<Set<string>>(() => {
    const completed = new Set<string>();
    todayRoutine?.forEach((step) => {
      if (step.status === "completed" || step.completedAt) {
        completed.add(step.id);
      }
    });
    return completed;
  });

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

  // Routine step handlers
  const handleStepToggle = async (stepId: string, checked: boolean) => {
    setCheckedSteps((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(stepId);
      } else {
        newSet.delete(stepId);
      }
      return newSet;
    });

    const result = await toggleRoutineStepAction(stepId, checked);

    if (result.success) {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    } else {
      setCheckedSteps((prev) => {
        const newSet = new Set(prev);
        if (checked) {
          newSet.delete(stepId);
        } else {
          newSet.add(stepId);
        }
        return newSet;
      });
      toast.error(result.error.message);
    }
  };

  const handleAllStepsToggle = async (
    timeOfDay: "morning" | "evening",
    checked: boolean,
  ) => {
    const steps =
      todayRoutine?.filter((step) => step.timeOfDay === timeOfDay) || [];
    const stepIds = steps.map((s) => s.id);

    setCheckedSteps((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        stepIds.forEach((id) => newSet.add(id));
      } else {
        stepIds.forEach((id) => newSet.delete(id));
      }
      return newSet;
    });

    const result = await toggleMultipleStepsAction(stepIds, checked);

    if (result.success) {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    } else {
      setCheckedSteps((prev) => {
        const newSet = new Set(prev);
        if (checked) {
          stepIds.forEach((id) => newSet.delete(id));
        } else {
          stepIds.forEach((id) => newSet.add(id));
        }
        return newSet;
      });
      toast.error(result.error.message);
    }
  };
  return (
    <Card className="p-6">
      <Tabs defaultValue="routines" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100 h-auto p-1">
          <TabsTrigger
            value="routines"
            className={cn(
              "data-[state=active]:bg-skinbestie-primary data-[state=active]:text-white",
              "text-gray-700 font-medium",
            )}
          >
            Routines &amp; Goals
          </TabsTrigger>
          <TabsTrigger
            value="photos"
            className={cn(
              "data-[state=active]:bg-skinbestie-primary data-[state=active]:text-white",
              "text-gray-700 font-medium",
            )}
          >
            Progress Photos
          </TabsTrigger>
          <TabsTrigger
            value="support"
            className={cn(
              "data-[state=active]:bg-skinbestie-primary data-[state=active]:text-white",
              "text-gray-700 font-medium",
            )}
          >
            Support Feedback
          </TabsTrigger>
        </TabsList>

        <TabsContent value="routines" className="mt-6 space-y-6">
          {/* Routine Tabs */}
          <RoutineTabs
            todayRoutine={todayRoutine}
            checkedSteps={checkedSteps}
            onStepToggle={handleStepToggle}
            onAllStepsToggle={handleAllStepsToggle}
            noBorder={true}
            noPadding={true}
            useSwitch={true}
          />

          {/* Separator */}
          <div className="border-t border-gray-200"></div>

          {/* Goals Section */}
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
        </TabsContent>

        <TabsContent value="photos" className="mt-6">
          <ProgressPhotos />
        </TabsContent>

        <TabsContent value="support" className="mt-6">
          <div className="text-gray-600">
            Support Feedback content goes here
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
