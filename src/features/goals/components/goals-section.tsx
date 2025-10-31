"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { GoalItem } from "./goal-item";
import type { Goal, GoalFormData } from "../types";

interface GoalsSectionProps {
  goals: Goal[];
  onAddGoal: (data: GoalFormData) => Promise<void>;
  onUpdateGoal: (id: string, data: GoalFormData) => Promise<void>;
  onToggleGoal: (id: string) => Promise<void>;
  onDeleteGoal: (id: string) => Promise<void>;
  onReorderGoals: (goals: Goal[]) => Promise<void>;
  showNumberBadges?: boolean;
  showCheckboxes?: boolean;
}

export function GoalsSection({
  goals,
  onAddGoal,
  onUpdateGoal,
  onToggleGoal,
  onDeleteGoal,
  onReorderGoals,
  showNumberBadges = false,
  showCheckboxes = false,
}: GoalsSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newGoalData, setNewGoalData] = useState<GoalFormData>({
    description: "",
    isPrimaryGoal: false,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = goals.findIndex((goal) => goal.id === active.id);
      const newIndex = goals.findIndex((goal) => goal.id === over.id);
      const reorderedGoals = arrayMove(goals, oldIndex, newIndex);

      onReorderGoals(reorderedGoals);
    }
  };

  const handleStartAdding = () => {
    setNewGoalData({ description: "", isPrimaryGoal: false });
    setIsAdding(true);
  };

  const handleSaveNew = () => {
    if (newGoalData.description?.trim()) {
      onAddGoal(newGoalData);
      setIsAdding(false);
      setNewGoalData({ description: "", isPrimaryGoal: false });
    }
  };

  const handleCancelNew = () => {
    setIsAdding(false);
    setNewGoalData({ description: "", isPrimaryGoal: false });
  };

  // Sanitize goals: filter out invalid items and dedupe by id
  const sanitizedGoals = (goals ?? []).filter((g): g is Goal =>
    Boolean(g && typeof g.id === "string" && g.id.length > 0),
  );

  // Dedupe by id (keep last occurrence)
  const uniqueGoals = (() => {
    const m = new Map<string, Goal>();
    for (const g of sanitizedGoals) m.set(g.id, g);
    return Array.from(m.values());
  })();

  // --- dev-only diagnostics ---
  if (process.env.NODE_ENV !== "production") {
    const ids = (goals ?? []).map((g) => g?.id);
    const missing = ids.filter(
      (id) => id === undefined || id === null || id === "",
    );
    const dups = ids.filter((id, i) => id != null && ids.indexOf(id) !== i);

    if (missing.length) {
      console.warn("GoalsSection: missing/empty ids found:", missing, {
        goals,
      });
    }
    if (dups.length) {
      console.warn(
        "GoalsSection: duplicate ids found:",
        Array.from(new Set(dups)),
        { goals },
      );
    }
  }

  return (
    <div className="space-y-4">
      {(!uniqueGoals || uniqueGoals.length === 0) && !isAdding ? (
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-sm text-gray-500 mb-1">No goals set yet</p>
          <p className="text-xs text-gray-400 mb-6">
            Add goals to track outcomes
          </p>
          <Button variant="outline" onClick={handleStartAdding}>
            <Plus className="w-4 h-4 mr-2" />
            Add Goal
          </Button>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={uniqueGoals.map((g) => g.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {uniqueGoals.map((goal, index) => (
                <GoalItem
                  key={goal.id}
                  goal={goal}
                  index={index}
                  onToggle={onToggleGoal}
                  onEdit={onUpdateGoal}
                  onDelete={onDeleteGoal}
                  showNumberBadge={showNumberBadges}
                  showCheckbox={showCheckboxes}
                />
              ))}

              {isAdding ? (
                <div
                  key="add-goal-form"
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <label htmlFor="new-goal" className="text-sm font-medium">
                        Goal Description
                      </label>
                      <Textarea
                        id="new-goal"
                        placeholder="Enter the clients goal"
                        value={newGoalData.description}
                        onChange={(e) =>
                          setNewGoalData({
                            ...newGoalData,
                            description: e.target.value,
                          })
                        }
                        rows={2}
                        className="resize-none mt-2"
                        autoFocus
                      />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3 mt-4">
                      <div className="space-y-0.5">
                        <Label
                          htmlFor="new-goal-primary"
                          className="text-sm font-medium"
                        >
                          Make this the main focus
                        </Label>
                        <p className="text-xs text-gray-500">
                          Mark this as the top priority goal to work on
                        </p>
                      </div>
                      <Switch
                        id="new-goal-primary"
                        checked={newGoalData.isPrimaryGoal ?? false}
                        onCheckedChange={(checked) =>
                          setNewGoalData({
                            ...newGoalData,
                            isPrimaryGoal: checked,
                          })
                        }
                        className="data-[state=checked]:bg-skinbestie-primary"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleSaveNew}
                        disabled={!newGoalData.description?.trim()}
                        className="bg-skinbestie-primary hover:bg-skinbestie-primary/90 text-white disabled:opacity-50"
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancelNew}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              ) : uniqueGoals.length > 0 ? (
                <Button
                  key="add-goal-button"
                  variant="outline"
                  className="w-full"
                  onClick={handleStartAdding}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Another Goal
                </Button>
              ) : null}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
