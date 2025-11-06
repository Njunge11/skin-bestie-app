export interface RoutineItem {
  id: string;
  routineStep: string;
  productName: string;
  productUrl: string;
  instructions: string;
  timeOfDay: "morning" | "evening";
  order: number;
  status: "pending" | "completed";
  completedAt: string | null;
}

export type TodayRoutine = RoutineItem[];
