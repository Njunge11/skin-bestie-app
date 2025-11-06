import { z } from "zod";

export const statsSchema = z.object({
  todayProgress: z.object({
    completed: z.number(),
    total: z.number(),
    percentage: z.number(),
  }),
  currentStreak: z.object({
    days: z.number(),
  }),
  weeklyCompliance: z.object({
    percentage: z.number(),
    completed: z.number(),
    total: z.number(),
  }),
});

export type Stats = z.infer<typeof statsSchema>;
