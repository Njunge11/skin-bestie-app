"use client";

import { useOptimistic, startTransition } from "react";
import { X, Target } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GoalsSection } from "./goals-section";
import type { Goal, GoalFormData } from "../types";
import { normalizeGoals } from "../helpers";
import {
  createGoalAction,
  updateGoalAction,
  toggleGoalAction,
  deleteGoalAction,
  reorderGoalsAction,
  acknowledgeGoalsAction,
} from "@/app/@auth/dashboard/goal-actions";

interface ReviewGoalsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialGoals: Goal[];
}

export function ReviewGoalsModal({
  open,
  onOpenChange,
  initialGoals,
}: ReviewGoalsModalProps) {
  const queryClient = useQueryClient();

  console.log("📥 ReviewGoalsModal received initialGoals:", initialGoals);

  // Normalize prop once - no syncing with useEffect!
  const normalizedInitialGoals = normalizeGoals(initialGoals);
  console.log("📥 Normalized initialGoals:", normalizedInitialGoals);

  // Optimistic state for immediate UI updates
  const [optimisticGoals, addOptimisticGoal] = useOptimistic(
    normalizedInitialGoals,
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
          // Add new goal optimistically
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
                  completedAt: !g.complete ? new Date() : null,
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
    // Create optimistic goal
    const optimisticGoal = {
      id: crypto.randomUUID(),
      description: data.description || "",
      isPrimaryGoal: data.isPrimaryGoal ?? false,
      complete: false,
      completedAt: null,
      order: normalizedInitialGoals.length,
    } as Goal;

    // Wrap optimistic update AND server action in startTransition
    startTransition(async () => {
      // Add optimistic goal immediately
      addOptimisticGoal({ action: "add", payload: { goal: optimisticGoal } });

      // Call server action in background
      const result = await createGoalAction(data);

      if (result.success && result.data?.id) {
        // Invalidate to refetch with real data from server
        queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        toast.success("Goal added successfully");
      } else {
        const errorMessage = !result.success
          ? result.error?.message || "Failed to add goal"
          : "No ID returned";
        console.error("createGoalAction failed:", errorMessage);
        toast.error(errorMessage);
        queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      }
    });
  };

  const handleUpdateGoal = async (id: string, data: GoalFormData) => {
    startTransition(async () => {
      // Optimistic update
      addOptimisticGoal({ action: "update", payload: { id, data } });

      // Call server action
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
    const goalToToggle = normalizedInitialGoals.find((g) => g.id === id);
    if (!goalToToggle) return;

    startTransition(async () => {
      // Optimistic update
      addOptimisticGoal({ action: "toggle", payload: { id } });

      // Call server action
      const result = await toggleGoalAction(id, !goalToToggle.complete);

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
      // Optimistic update
      addOptimisticGoal({ action: "delete", payload: { id } });

      // Call server action
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
      // Optimistic update
      addOptimisticGoal({ action: "reorder", payload: { reorderedGoals } });

      // Call server action
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

  const handleSave = async () => {
    // Acknowledge goals when saving
    const result = await acknowledgeGoalsAction(true);

    if (result.success) {
      // Invalidate dashboard query to refresh the step card
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Goals saved successfully");
      onOpenChange(false);
    } else {
      toast.error(result.error.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-full bg-skinbestie-primary flex items-center justify-center">
            <Target className="h-6 w-6 text-white" />
          </div>
        </div>

        {/* Header */}
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl font-bold text-center">
            Your Skin Goals
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600 text-center">
            Track your progress and manage your personalized skincare goals.
            Drag to reorder by priority.
          </DialogDescription>
        </DialogHeader>

        {/* Goals Section */}
        <div className="mt-4">
          <GoalsSection
            goals={optimisticGoals}
            onAddGoal={handleAddGoal}
            onUpdateGoal={handleUpdateGoal}
            onToggleGoal={handleToggleGoal}
            onDeleteGoal={handleDeleteGoal}
            onReorderGoals={handleReorderGoals}
          />
        </div>

        {/* Save Button */}
        <div className="mt-6">
          <Button
            onClick={handleSave}
            className="w-full bg-skinbestie-primary hover:bg-skinbestie-primary/90 text-white"
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
