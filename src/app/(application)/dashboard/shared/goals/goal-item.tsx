"use client";

import { useState } from "react";
import { Trash2, GripVertical, Star, Pencil, Check } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { Goal, GoalFormData } from "./goal.types";

interface GoalItemProps {
  goal: Goal;
  index: number;
  onToggle: (id: string) => Promise<void>;
  onEdit: (id: string, data: GoalFormData) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  showNumberBadge?: boolean;
  showCheckbox?: boolean;
  backgroundColor?: string;
}

export function GoalItem({
  goal,
  index,
  onToggle,
  onEdit,
  onDelete,
  showNumberBadge = false,
  showCheckbox = false,
  backgroundColor,
}: GoalItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<GoalFormData>({
    description: goal.description || "",
    isPrimaryGoal: goal.isPrimaryGoal || false,
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
        "flex flex-col gap-3 rounded-lg border border-gray-200 p-6 transition-all hover:border-gray-300 cursor-pointer bg-skinbestie-primary-light",
        isDragging && "opacity-50 cursor-grabbing",
        backgroundColor && backgroundColor,
      )}
    >
      {/* Mobile: Drag Handle and Checkbox at top */}
      <div className="flex items-center justify-between gap-3 sm:hidden">
        <div className="flex items-center gap-3">
          {/* Drag Handle - Visual indicator */}
          <div className="text-gray-400">
            <GripVertical className="w-5 h-5" />
          </div>

          {/* Priority Badge - Only show if enabled */}
          {showNumberBadge && (
            <Badge className="bg-skinbestie-primary text-white rounded-full w-7 h-7 p-0 flex items-center justify-center">
              {index + 1}
            </Badge>
          )}
        </div>

        {/* Checkbox - Only show if enabled */}
        {showCheckbox && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggle(goal.id);
            }}
            className={`flex items-center justify-center h-5 w-5 rounded border-2 transition-all cursor-pointer flex-shrink-0 ${
              goal.complete
                ? "bg-skinbestie-primary border-skinbestie-primary"
                : "bg-white border-gray-300"
            }`}
            aria-label={
              goal.complete ? "Mark as incomplete" : "Mark as complete"
            }
          >
            {goal.complete && <Check className="h-4 w-4 text-white" />}
          </button>
        )}
      </div>

      {/* Desktop and Content */}
      <div className="flex items-center gap-3 flex-1">
        {/* Desktop: Drag Handle - Visual indicator */}
        <div className="text-gray-400 hidden sm:block">
          <GripVertical className="w-5 h-5" />
        </div>

        {/* Desktop: Priority Badge - Only show if enabled */}
        {showNumberBadge && (
          <Badge className="bg-skinbestie-primary text-white rounded-full w-7 h-7 p-0 sm:flex items-center justify-center hidden">
            {index + 1}
          </Badge>
        )}

        {/* Desktop: Checkbox - Only show if enabled */}
        {showCheckbox && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggle(goal.id);
            }}
            className={`sm:flex items-center justify-center h-5 w-5 rounded border-2 transition-all cursor-pointer flex-shrink-0 hidden ${
              goal.complete
                ? "bg-skinbestie-primary border-skinbestie-primary"
                : "bg-white border-gray-300"
            }`}
            aria-label={
              goal.complete ? "Mark as incomplete" : "Mark as complete"
            }
          >
            {goal.complete && <Check className="h-4 w-4 text-white" />}
          </button>
        )}

        {/* Goal Content and Action Buttons wrapper */}
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Goal Content */}
          <div className="flex-1">
            <div key="description" className="flex items-center gap-3">
              <p
                className={cn(
                  "text-lg flex-1 text-gray-700",
                  goal.complete && "line-through text-gray-400",
                )}
              >
                {goal.description}
              </p>
            </div>

            {/* Main focus badge below description */}
            {goal.isPrimaryGoal && (
              <div
                key="primary-badge"
                className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-skinbestie-primary mt-2 w-fit"
              >
                <Star className="w-4 h-4 text-white fill-white" />
                <span className="text-xs font-medium text-white">
                  Main Focus
                </span>
              </div>
            )}

            {goal.completedAt && (
              <p key="completed-date" className="text-xs text-gray-400 mt-1">
                Completed {new Date(goal.completedAt).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-1">
            {/* Edit Button */}
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                handleStartEdit();
              }}
              className="flex-1 sm:flex-none sm:h-9 sm:w-7 sm:p-0 sm:border-0 sm:bg-transparent text-gray-700 sm:text-gray-400 hover:bg-gray-50 sm:hover:bg-transparent sm:hover:text-gray-700 rounded-lg transition-colors"
            >
              <Pencil className="w-4 h-4 sm:mr-0 mr-2" />
              <span className="sm:hidden">Edit</span>
            </Button>

            {/* Delete Button */}
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(goal.id);
              }}
              aria-label="Delete goal"
              className="flex-1 sm:flex-none sm:h-9 sm:w-7 sm:p-0 sm:border-0 sm:bg-transparent text-red-600 sm:text-gray-400 hover:bg-red-50 sm:hover:bg-transparent sm:hover:text-red-600 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4 sm:mr-0 mr-2" />
              <span className="sm:hidden">Delete</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
