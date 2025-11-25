import "server-only";
import { cache } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

/**
 * Data Access Layer - Centralized authentication verification
 *
 * Uses React's cache() to memoize the auth check within a single render pass.
 * This prevents redundant JWT decoding when multiple Server Actions/Components
 * call verifySession() in the same request.
 *
 * Per Next.js 2025 Security Best Practices:
 * - Middleware is first layer (optimistic check)
 * - Server layout/pages are second layer (verified check)
 * - DAL is third layer (data access protection)
 */

export const verifySession = cache(async () => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return {
    userId: session.user.id,
    user: session.user,
  };
});

/**
 * Get authenticated session without redirect
 * Useful for optional auth checks or API routes that return 401
 */
export const getSession = cache(async () => {
  return await auth();
});
