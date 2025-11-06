import type { Goal } from "./goal.types";

/**
 * Normalize goals array to ensure every goal has a valid ID.
 * Filters out null/undefined items and assigns fallback IDs to invalid goals.
 */
export function normalizeGoals(input: Goal[]): Goal[] {
  return (input ?? [])
    .filter((g): g is Goal => g != null) // drop null/undefined
    .map((g) => {
      if (typeof g.id !== "string" || !g.id.length) {
        console.error("normalizeGoals: goal with invalid id found:", g);
        return {
          ...g,
          id: `invalid-${crypto.randomUUID()}`,
        };
      }
      return g;
    });
}
