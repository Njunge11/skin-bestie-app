"use client";

import { useState, useOptimistic, startTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Target, Flame, CalendarCheck } from "lucide-react";
import { MetricCard } from "./components/metric-card";
import { MetricCardSkeleton } from "./components/metric-card-skeleton";
import { WeeklySummary } from "./components/weekly-summary";
import { RoutineTabs } from "./components/routine-tabs";
import { GoalsSection } from "./components/goals-section";
import {
  createGoalAction,
  updateGoalAction,
  toggleGoalAction,
  deleteGoalAction,
  reorderGoalsAction,
} from "./goal-actions";
import {
  toggleRoutineStepAction,
  toggleMultipleStepsAction,
} from "./actions/routine-step-actions";
import { useStats } from "./hooks/use-stats";
import type { TodayRoutineStep } from "./schemas/dashboard.schema";
import type { Goal, GoalFormData } from "@/features/goals/types";

interface SubscriberDashboardProps {
  userName?: string;
  todayRoutine?: TodayRoutineStep[] | null;
  goals?: Goal[];
}

export function SubscriberDashboard({
  userName = "there",
  todayRoutine = null,
  goals = [],
}: SubscriberDashboardProps) {
  const queryClient = useQueryClient();

  // Fetch stats using TanStack Query
  const { data: statsResult, isLoading: statsLoading } = useStats();
  const stats = statsResult?.success ? statsResult.data : null;

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

  // Optimistic state for immediate UI updates (goals)
  const [optimisticGoals, addOptimisticGoal] = useOptimistic(
    goals,
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

  const handleAddGoal = async (data: GoalFormData) => {
    const optimisticGoal = {
      id: crypto.randomUUID(),
      description: data.description || "",
      isPrimaryGoal: data.isPrimaryGoal ?? false,
      complete: false,
      completedAt: null,
      order: goals.length,
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
    const goal = goals.find((g) => g.id === id);
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
    // Optimistically update UI
    setCheckedSteps((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(stepId);
      } else {
        newSet.delete(stepId);
      }
      return newSet;
    });

    // Sync with backend in background
    const result = await toggleRoutineStepAction(stepId, checked);

    if (result.success) {
      // Silently sync - no toast needed
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    } else {
      // Revert on error
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

    // Optimistically update UI
    setCheckedSteps((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        stepIds.forEach((id) => newSet.add(id));
      } else {
        stepIds.forEach((id) => newSet.delete(id));
      }
      return newSet;
    });

    // Sync with backend in background - send array of step IDs
    const result = await toggleMultipleStepsAction(stepIds, checked);

    if (result.success) {
      // Silently sync - no toast needed
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    } else {
      // Revert on error
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
    <div className="space-y-6">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">Hi {userName} 👋</h1>
        <p className="text-lg text-gray-600">
          Track your progress, stay on top of your routine, and achieve your
          skincare goals.
        </p>
      </div>

      {/* Metrics Grid */}
      {statsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCardSkeleton />
          <MetricCardSkeleton />
          <MetricCardSkeleton />
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            label="Current Streak"
            value={`${stats.currentStreak.days} days`}
            subtitle="Consecutive days active"
            icon={Flame}
            iconColor="red"
            iconBgColor="bg-red-50"
          />
          <MetricCard
            label="Today's Progress"
            value={`${stats.todayProgress.percentage}%`}
            subtitle={`${stats.todayProgress.completed} of ${stats.todayProgress.total} steps completed`}
            icon={Target}
            iconColor="purple"
            iconBgColor="bg-purple-50"
            showProgressBar={true}
            progressPercentage={stats.todayProgress.percentage}
            progressBarColor="bg-purple-500"
          />
          <MetricCard
            label="This Week"
            value={`${stats.weeklyCompliance.percentage.toFixed(1)}%`}
            subtitle={`${stats.weeklyCompliance.completed} of ${stats.weeklyCompliance.total} steps completed`}
            icon={CalendarCheck}
            iconColor="cyan"
            iconBgColor="bg-cyan-50"
            showProgressBar={true}
            progressPercentage={stats.weeklyCompliance.percentage}
            progressBarColor="bg-cyan-500"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-40 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
            Unable to load stats
          </div>
          <div className="h-40 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
            Unable to load stats
          </div>
          <div className="h-40 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
            Unable to load stats
          </div>
        </div>
      )}

      {/* Weekly Summary */}
      <WeeklySummary message="Excellent progress! You're ahead of your goals this week with consistent daily activity." />

      {/* Routine Tabs */}
      <RoutineTabs
        todayRoutine={todayRoutine}
        checkedSteps={checkedSteps}
        onStepToggle={handleStepToggle}
        onAllStepsToggle={handleAllStepsToggle}
        useSwitch={true}
      />

      {/* Goals Section */}
      <GoalsSection
        goals={optimisticGoals}
        onAddGoal={handleAddGoal}
        onUpdateGoal={handleUpdateGoal}
        onToggleGoal={handleToggleGoal}
        onDeleteGoal={handleDeleteGoal}
        onReorderGoals={handleReorderGoals}
      />
    </div>
  );
}
