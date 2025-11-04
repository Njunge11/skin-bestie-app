"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ListChecks } from "lucide-react";
import {
  RoutineItemCard,
  toggleRoutineStepAction,
} from "../../dashboard/shared/routine";
import type { TodayRoutineStep } from "../../dashboard/schemas/dashboard.schema";

interface CatchupTasksProps {
  catchupSteps: TodayRoutineStep[];
}

export function CatchupTasks({ catchupSteps }: CatchupTasksProps) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  // Track checked steps for optimistic UI updates
  const [checkedSteps, setCheckedSteps] = useState<Set<string>>(() => {
    const completed = new Set<string>();
    catchupSteps.forEach((step) => {
      if (step.status === "completed" || step.completedAt) {
        completed.add(step.id);
      }
    });
    return completed;
  });

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

    // Sync with backend
    const result = await toggleRoutineStepAction(stepId, checked);

    if (result.success) {
      // Silently sync - invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
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

  // Count pending tasks
  const pendingCount = catchupSteps.filter(
    (step) => !checkedSteps.has(step.id),
  ).length;

  return (
    <Card className="bg-white">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left">
          <div className="flex items-center gap-3">
            <ListChecks className="h-6 w-6 text-skinbestie-primary" />
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-gray-900">
                Catch Up on Previous Tasks
              </span>
              {pendingCount > 0 && (
                <Badge className="bg-skinbestie-primary text-white hover:bg-skinbestie-primary/90 rounded-full h-6 w-6 flex items-center justify-center p-0">
                  {pendingCount}
                </Badge>
              )}
            </div>
          </div>
          <ChevronDown
            className={`h-5 w-5 text-gray-600 transition-transform duration-200 flex-shrink-0 ${
              isOpen ? "transform rotate-180" : ""
            }`}
          />
        </CollapsibleTrigger>

        <CollapsibleContent className="px-6 pb-6 space-y-4">
          {/* Friendly message */}
          <p className="text-sm text-gray-600">
            You&apos;re doing great! Here are a few tasks from previous days
            that you can still complete. Check them off as you go!
          </p>

          {/* Catchup tasks list */}
          <div className="space-y-3">
            {catchupSteps.map((step) => (
              <RoutineItemCard
                key={step.id}
                productName={step.productName}
                description={step.instructions}
                category={step.routineStep}
                productUrl={step.productUrl}
                showCheckbox={true}
                isChecked={checkedSteps.has(step.id)}
                onCheckedChange={(checked) =>
                  handleStepToggle(step.id, checked)
                }
                showViewProduct={true}
                productNameAsLink={false}
              />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
