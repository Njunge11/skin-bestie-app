import { z } from "zod";

/**
 * Common API error response schema
 */
export const apiErrorSchema = z.object({
  error: z.string(),
  message: z.string().optional(),
  statusCode: z.number().optional(),
});

export type ApiError = z.infer<typeof apiErrorSchema>;

/**
 * Pagination metadata schema
 */
export const paginationSchema = z.object({
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

export type Pagination = z.infer<typeof paginationSchema>;

/**
 * Helper to create paginated response schemas
 */
export function createPaginatedSchema<T extends z.ZodTypeAny>(itemSchema: T) {
  return z.object({
    data: z.array(itemSchema),
    pagination: paginationSchema,
  });
}
