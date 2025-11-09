"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  GoalsSection as FeatureGoalsSection,
  type Goal,
  type GoalFormData,
} from "../shared/goals";
import { cn } from "@/lib/utils";

interface GoalsSectionProps {
  goals: Goal[];
  onAddGoal: (data: GoalFormData) => Promise<void>;
  onUpdateGoal: (id: string, data: GoalFormData) => Promise<void>;
  onToggleGoal: (id: string) => Promise<void>;
  onDeleteGoal: (id: string) => Promise<void>;
  onReorderGoals: (goals: Goal[]) => Promise<void>;
  backgroundColor?: string;
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
  backgroundColor,
  noBorder = false,
  noPadding = false,
}: GoalsSectionProps) {
  return (
    <Card
      className={cn(
        "gap-2",
        noBorder && "border-0 shadow-none",
        noPadding && "p-0",
      )}
    >
      <CardHeader className={cn(noPadding && "p-0")}>
        <CardTitle className="text-xl font-bold">My Goals</CardTitle>
        <p className="text-sm text-gray-600 mt-2">
          Track your skincare goals. Click any goal to edit or delete it, drag
          to reorder, and set one as your primary focus to prioritise your
          efforts.
        </p>
      </CardHeader>
      <CardContent className={cn(noPadding && "p-0")}>
        <FeatureGoalsSection
          goals={goals}
          onAddGoal={onAddGoal}
          onUpdateGoal={onUpdateGoal}
          onToggleGoal={onToggleGoal}
          onDeleteGoal={onDeleteGoal}
          onReorderGoals={onReorderGoals}
          showCheckboxes={true}
          showNumberBadges={false}
          backgroundColor={backgroundColor}
        />
      </CardContent>
    </Card>
  );
}
