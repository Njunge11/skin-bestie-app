import { z } from "zod";

/**
 * Goal entity schema
 * Used across: Dashboard, Goals feature
 */
export const goalSchema = z.object({
  id: z.string().uuid(),
  description: z.string(),
  complete: z.boolean(),
  completedAt: z.string().datetime().nullable(),
  order: z.number(),
  isPrimaryGoal: z.boolean(),
  timeline: z
    .string()
    .nullable()
    .transform((val) => val ?? "3 months"),
  templateId: z.string().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

// Export inferred type
export type Goal = z.infer<typeof goalSchema>;
