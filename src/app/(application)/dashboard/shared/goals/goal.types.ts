// Re-export Goal from global schemas
export type { Goal } from "@/lib/schemas";

export interface GoalFormData {
  description: string;
  isPrimaryGoal?: boolean;
}

export interface GoalsTemplate {
  id: string;
  userId: string;
  status: "published" | "unpublished";
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}
