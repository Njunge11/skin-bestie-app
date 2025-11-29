"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  GoalsSection as FeatureGoalsSection,
  type Goal,
  type GoalFormData,
} from "../shared/goals";
import { cn } from "@/lib/utils";
import { Target, ChevronDown } from "lucide-react";

interface GoalsSectionProps {
  goals: Goal[];
  onAddGoal: (data: GoalFormData) => Promise<void>;
  onUpdateGoal: (id: string, data: GoalFormData) => Promise<void>;
  onToggleGoal: (id: string) => Promise<void>;
  onDeleteGoal: (id: string) => Promise<void>;
  onReorderGoals: (goals: Goal[]) => Promise<void>;
  noBorder?: boolean;
  noPadding?: boolean;
}

export function GoalsSection({
  goals,
  onAddGoal,
  onUpdateGoal,
  onToggleGoal,
  onDeleteGoal,
  onReorderGoals,
  noBorder = false,
  noPadding = false,
}: GoalsSectionProps) {
  // Only use collapsible when there's more than 1 goal
  const hasMultipleGoals = goals && goals.length > 1;
  // Default to collapsed when there are multiple goals
  const [isExpanded, setIsExpanded] = useState(false);

  // Split goals: primary goal vs. rest
  const primaryGoal = goals?.find((g) => g.isPrimaryGoal);
  const nonPrimaryGoals = goals?.filter((g) => !g.isPrimaryGoal) || [];

  // If there's a primary goal, show it; otherwise show first goal
  const visibleGoal = primaryGoal
    ? [primaryGoal]
    : goals && goals.length > 0
      ? [goals[0]]
      : [];
  const remainingGoals = primaryGoal
    ? nonPrimaryGoals
    : goals && goals.length > 1
      ? goals.slice(1)
      : [];

  return (
    <Card
      className={cn(
        "gap-2",
        noBorder && "border-0 shadow-none",
        noPadding && "p-0",
      )}
    >
      <CardHeader className={cn(noPadding && "p-0")}>
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-skinbestie-primary" />
          <CardTitle className="text-xl font-bold">My Goals</CardTitle>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Track your skincare goals. Click any goal to edit or delete it, drag
          to reorder, and set one as your primary focus to prioritise your
          efforts.
        </p>
      </CardHeader>
      <CardContent className={cn(noPadding && "p-0")}>
        {hasMultipleGoals ? (
          <div className="space-y-4">
            {/* Always show primary goal (or first goal if no primary) - hide "Add Another Goal" button */}
            <FeatureGoalsSection
              goals={visibleGoal}
              onAddGoal={onAddGoal}
              onUpdateGoal={onUpdateGoal}
              onToggleGoal={onToggleGoal}
              onDeleteGoal={onDeleteGoal}
              onReorderGoals={onReorderGoals}
              showCheckboxes={true}
              showMainFocus={true}
              showAddButton={false}
            />

            {/* Collapsible for remaining goals */}
            <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
              <CollapsibleTrigger className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
                <span>
                  {isExpanded
                    ? "Show Less"
                    : `Show ${remainingGoals.length} More ${remainingGoals.length === 1 ? "Goal" : "Goals"}`}
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    isExpanded && "transform rotate-180",
                  )}
                />
              </CollapsibleTrigger>

              <CollapsibleContent className="mt-4">
                {/* Remaining goals - show "Add Another Goal" button here */}
                <FeatureGoalsSection
                  goals={remainingGoals}
                  onAddGoal={onAddGoal}
                  onUpdateGoal={onUpdateGoal}
                  onToggleGoal={onToggleGoal}
                  onDeleteGoal={onDeleteGoal}
                  onReorderGoals={onReorderGoals}
                  showCheckboxes={true}
                  showMainFocus={true}
                  showAddButton={true}
                />
              </CollapsibleContent>
            </Collapsible>
          </div>
        ) : (
          // When there's 0 or 1 goal, show normally without collapsible
          <FeatureGoalsSection
            goals={goals}
            onAddGoal={onAddGoal}
            onUpdateGoal={onUpdateGoal}
            onToggleGoal={onToggleGoal}
            onDeleteGoal={onDeleteGoal}
            onReorderGoals={onReorderGoals}
            showCheckboxes={true}
            showMainFocus={true}
          />
        )}
      </CardContent>
    </Card>
  );
}
