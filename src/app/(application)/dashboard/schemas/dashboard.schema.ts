import { z } from "zod";
import { userSchema, goalSchema } from "@/lib/schemas";

/**
 * Dashboard-specific setup progress schema
 * Tracks user's onboarding progress through essential setup steps
 */
export const setupProgressSchema = z.object({
  percentage: z.number(),
  completed: z.number(),
  total: z.number(),
  steps: z.object({
    hasCompletedSkinTest: z.boolean(),
    hasPublishedGoals: z.boolean(),
    hasPublishedRoutine: z.boolean(),
    hasCompletedBooking: z.boolean(),
  }),
});

/**
 * Today's routine step schema - includes status and completion tracking
 */
export const todayRoutineStepSchema = z.object({
  id: z.string(),
  routineStep: z.string(),
  productName: z.string(),
  productUrl: z.string(),
  instructions: z.string(),
  timeOfDay: z.enum(["morning", "evening"]),
  order: z.number(),
  status: z.enum(["pending", "completed", "skipped"]),
  completedAt: z.string().nullable(),
});

/**
 * Routine template step schema - includes frequency and days
 */
export const routineTemplateStepSchema = z.object({
  id: z.string(),
  routineStep: z.string(),
  productName: z.string(),
  productUrl: z.string(),
  instructions: z.string(),
  frequency: z.enum(["daily", "specific_days"]),
  days: z.array(z.string()).nullable(),
  timeOfDay: z.enum(["morning", "evening"]),
  order: z.number(),
});

/**
 * Full routine schema with morning and evening templates
 */
export const routineSchema = z.object({
  id: z.string(),
  name: z.string(),
  startDate: z.string(),
  endDate: z.string().nullable(),
  productPurchaseInstructions: z.string().nullable(),
  morning: z.array(routineTemplateStepSchema),
  evening: z.array(routineTemplateStepSchema),
});

/**
 * Dashboard API response schema
 * Composes global schemas (user, goal) with dashboard-specific schemas
 */
export const dashboardResponseSchema = z.object({
  user: userSchema,
  setupProgress: setupProgressSchema,
  todayRoutine: z.array(todayRoutineStepSchema).nullable(),
  catchupSteps: z.array(todayRoutineStepSchema).nullable(),
  routine: routineSchema.nullable(),
  goals: z.array(goalSchema).nullable(),
  goalsAcknowledgedByClient: z.boolean(),
});

// Export inferred types
export type SetupProgress = z.infer<typeof setupProgressSchema>;
export type TodayRoutineStep = z.infer<typeof todayRoutineStepSchema>;
export type RoutineTemplateStep = z.infer<typeof routineTemplateStepSchema>;
export type Routine = z.infer<typeof routineSchema>;
export type DashboardResponse = z.infer<typeof dashboardResponseSchema>;
