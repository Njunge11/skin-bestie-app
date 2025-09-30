// src/server/_app.ts
import { router } from "./trpc";
import { userProfileRouter } from "@/features/userProfile/userProfile.router";

export const appRouter = router({
  userProfile: userProfileRouter,
});

// Export type definition of API
export type AppRouter = typeof appRouter;
