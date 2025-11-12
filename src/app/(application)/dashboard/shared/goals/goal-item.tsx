"use client";

import { useState } from "react";
import { Trash2, GripVertical, Star, Check } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Goal, GoalFormData } from "./goal.types";

interface GoalItemProps {
  goal: Goal;
  index: number;
  onToggle: (id: string) => Promise<void>;
  onEdit: (id: string, data: GoalFormData) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  showCheckbox?: boolean;
  showMainFocus?: boolean;
}

export function GoalItem({
  goal,
  index,
  onToggle,
  onEdit,
  onDelete,
  showCheckbox = false,
  showMainFocus = false,
}: GoalItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<GoalFormData>({
    description: goal.description || "",
    isPrimaryGoal: goal.isPrimaryGoal || false,
    timeline: goal.timeline || "3 months",
  });

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: goal.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleStartEdit = () => {
    setEditData({
      description: goal.description || "",
      isPrimaryGoal: goal.isPrimaryGoal || false,
      timeline: goal.timeline || "3 months",
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editData.description?.trim()) {
      onEdit(goal.id, editData);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="rounded-lg border border-gray-200 p-4">
        <div className="space-y-3">
          <div className="space-y-2">
            <label
              htmlFor={`edit-goal-${goal.id}`}
              className="text-sm font-medium"
            >
              Goal Description
            </label>
            <Textarea
              id={`edit-goal-${goal.id}`}
              placeholder="Enter what you want to achieve"
              value={editData.description}
              onChange={(e) =>
                setEditData({ ...editData, description: e.target.value })
              }
              rows={2}
              className="resize-none mt-2"
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor={`edit-goal-timeline-${goal.id}`}
              className="text-sm font-medium"
            >
              Timeline
            </label>
            <Select
              value={editData.timeline || "3 months"}
              onValueChange={(value) =>
                setEditData({ ...editData, timeline: value })
              }
            >
              <SelectTrigger
                id={`edit-goal-timeline-${goal.id}`}
                className="border-gray-300"
              >
                <SelectValue placeholder="3 months" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
                  const value = `${month} ${month === 1 ? "month" : "months"}`;
                  return (
                    <SelectItem key={month} value={value}>
                      {value}
                      {month === 3 && " (Recommended)"}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          {showMainFocus && (
            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3 mt-4">
              <div className="space-y-0.5">
                <Label
                  htmlFor={`edit-goal-primary-${goal.id}`}
                  className="text-sm font-medium"
                >
                  Make this the main focus
                </Label>
                <p className="text-xs text-gray-500">
                  Mark this as the top priority goal to work on
                </p>
              </div>
              <Switch
                id={`edit-goal-primary-${goal.id}`}
                checked={editData.isPrimaryGoal ?? false}
                onCheckedChange={(checked) =>
                  setEditData({ ...editData, isPrimaryGoal: checked })
                }
                className="data-[state=checked]:bg-skinbestie-primary"
              />
            </div>
          )}
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!editData.description?.trim()}
              className="bg-skinbestie-primary hover:bg-skinbestie-primary/90 text-white"
            >
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleStartEdit}
      className={cn(
        "flex flex-col md:flex-row md:items-center gap-3 rounded-lg border border-gray-200 px-3 py-6 transition-all hover:border-gray-300 cursor-pointer",
        isDragging && "opacity-50 cursor-grabbing",
      )}
    >
      {/* Desktop Layout - Horizontal */}
      <div className="hidden md:flex md:gap-3 md:flex-1">
        {/* Far left column: Number (top) and Dragger (center) */}
        <div className="relative flex flex-col w-7 flex-shrink-0">
          {/* Priority Badge - top */}
          <Badge className="bg-skinbestie-primary text-white rounded-full w-7 h-7 p-0 flex items-center justify-center flex-shrink-0">
            {index + 1}
          </Badge>

          {/* Drag Handle - centered vertically in the card */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400">
            <GripVertical className="w-5 h-5" />
          </div>
        </div>

        {/* Right side content - aligned to start */}
        <div className="flex items-start gap-3 flex-1">
          {/* Checkbox */}
          {showCheckbox && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggle(goal.id);
              }}
              className={cn(
                "w-5 h-5 rounded border-2 transition-colors flex-shrink-0 mt-0.5",
                goal.complete
                  ? "bg-skinbestie-primary border-skinbestie-primary"
                  : "border-gray-300 hover:border-gray-400",
              )}
              aria-label={
                goal.complete ? "Mark as incomplete" : "Mark as complete"
              }
            >
              {goal.complete && <Check className="w-3 h-3 text-white" />}
            </button>
          )}

          {/* Goal Content */}
          <div className="flex-1 space-y-4">
            <p
              className={cn(
                "text-sm",
                goal.complete && "line-through text-gray-400",
              )}
            >
              {goal.description}
            </p>
            {showMainFocus && (
              <div className="space-y-3 -ml-8">
                <div
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg w-fit transition-colors",
                    goal.isPrimaryGoal
                      ? "bg-skinbestie-primary/10"
                      : "bg-gray-100",
                  )}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Switch
                    id={`goal-primary-desktop-${goal.id}`}
                    checked={goal.isPrimaryGoal ?? false}
                    onCheckedChange={(checked) => {
                      onEdit(goal.id, {
                        description: goal.description,
                        isPrimaryGoal: checked,
                        timeline: goal.timeline,
                      });
                    }}
                    className="data-[state=checked]:bg-skinbestie-primary data-[state=unchecked]:bg-gray-200"
                  />
                  {goal.isPrimaryGoal && (
                    <Star className="w-4 h-4 text-skinbestie-primary fill-skinbestie-primary" />
                  )}
                  <Label
                    htmlFor={`goal-primary-desktop-${goal.id}`}
                    className={cn(
                      "text-sm font-medium cursor-pointer",
                      goal.isPrimaryGoal
                        ? "text-skinbestie-primary"
                        : "text-gray-700",
                    )}
                  >
                    Main focus
                  </Label>
                </div>
                <div
                  className="flex items-center gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Label
                    htmlFor={`goal-timeline-desktop-${goal.id}`}
                    className="text-sm font-medium text-gray-700 min-w-[72px]"
                  >
                    Timeline:
                  </Label>
                  <Select
                    value={goal.timeline || "3 months"}
                    onValueChange={(value) => {
                      onEdit(goal.id, {
                        description: goal.description,
                        isPrimaryGoal: goal.isPrimaryGoal,
                        timeline: value,
                      });
                    }}
                  >
                    <SelectTrigger
                      id={`goal-timeline-desktop-${goal.id}`}
                      className="h-9 w-[180px] text-sm border-gray-300"
                    >
                      <SelectValue placeholder="3 months" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(
                        (month) => {
                          const value = `${month} ${month === 1 ? "month" : "months"}`;
                          return (
                            <SelectItem key={month} value={value}>
                              {value}
                              {month === 3 && " (Recommended)"}
                            </SelectItem>
                          );
                        },
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            {goal.completedAt && (
              <p className="text-xs text-gray-400 mt-1">
                Completed {new Date(goal.completedAt).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Edit Button */}
          <div className="self-center">
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                handleStartEdit();
              }}
            >
              Edit
            </Button>
          </div>

          {/* Delete Button */}
          <div className="self-center">
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(goal.id);
              }}
              className="text-gray-400 hover:text-red-600"
              aria-label="Delete goal"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Layout - Vertical */}
      <div className="flex md:hidden flex-col gap-3 w-full">
        {/* Top row: Drag handle and delete button */}
        <div className="flex items-center justify-between">
          <div className="text-gray-400">
            <GripVertical className="w-5 h-5" />
          </div>

          {/* Delete Button - Top right */}
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(goal.id);
            }}
            className="text-gray-400 hover:text-red-600 -mr-2"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Goal Content with checkbox */}
        <div className="flex-1 space-y-3">
          <div className="flex items-start gap-3">
            {showCheckbox && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle(goal.id);
                }}
                className={cn(
                  "w-5 h-5 rounded border-2 transition-colors flex-shrink-0 mt-0.5",
                  goal.complete
                    ? "bg-skinbestie-primary border-skinbestie-primary"
                    : "border-gray-300 hover:border-gray-400",
                )}
                aria-label={
                  goal.complete ? "Mark as incomplete" : "Mark as complete"
                }
              >
                {goal.complete && <Check className="w-3 h-3 text-white" />}
              </button>
            )}
            <p
              className={cn(
                "text-sm flex-1",
                goal.complete && "line-through text-gray-400",
              )}
            >
              {goal.description}
            </p>
          </div>
          {showMainFocus && (
            <div className="space-y-3">
              <div
                className={cn(
                  "flex items-center gap-2 px-2 py-1 rounded-md w-fit transition-colors",
                  goal.isPrimaryGoal
                    ? "bg-skinbestie-primary/10"
                    : "bg-gray-100",
                )}
                onClick={(e) => e.stopPropagation()}
              >
                <Switch
                  id={`goal-primary-mobile-${goal.id}`}
                  checked={goal.isPrimaryGoal ?? false}
                  onCheckedChange={(checked) => {
                    onEdit(goal.id, {
                      description: goal.description,
                      isPrimaryGoal: checked,
                      timeline: goal.timeline,
                    });
                  }}
                  className="data-[state=checked]:bg-skinbestie-primary data-[state=unchecked]:bg-gray-200"
                />
                {goal.isPrimaryGoal && (
                  <Star className="w-4 h-4 text-skinbestie-primary fill-skinbestie-primary" />
                )}
                <Label
                  htmlFor={`goal-primary-mobile-${goal.id}`}
                  className={cn(
                    "text-sm font-medium cursor-pointer",
                    goal.isPrimaryGoal
                      ? "text-skinbestie-primary"
                      : "text-gray-700",
                  )}
                >
                  Main focus
                </Label>
              </div>
              <div className="space-y-1" onClick={(e) => e.stopPropagation()}>
                <Label
                  htmlFor={`goal-timeline-mobile-${goal.id}`}
                  className="text-xs text-gray-500"
                >
                  Timeline
                </Label>
                <Select
                  value={goal.timeline || "3 months"}
                  onValueChange={(value) => {
                    onEdit(goal.id, {
                      description: goal.description,
                      isPrimaryGoal: goal.isPrimaryGoal,
                      timeline: value,
                    });
                  }}
                >
                  <SelectTrigger
                    id={`goal-timeline-mobile-${goal.id}`}
                    className="h-9 w-full text-sm border-gray-300 mt-2"
                  >
                    <SelectValue placeholder="3 months" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(
                      (month) => {
                        const value = `${month} ${month === 1 ? "month" : "months"}`;
                        return (
                          <SelectItem key={month} value={value}>
                            {value}
                            {month === 3 && " (Recommended)"}
                          </SelectItem>
                        );
                      },
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          {goal.completedAt && (
            <p className="text-xs text-gray-400 mt-1">
              Completed {new Date(goal.completedAt).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Edit Button - Full width below description */}
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            handleStartEdit();
          }}
          className="w-full"
        >
          Edit
        </Button>
      </div>
    </div>
  );
}
