export interface Goal {
  id: string;
  templateId: string;
  description: string;
  isPrimaryGoal: boolean;
  complete: boolean;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  order: number;
}

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
