"use client";

import { useOptimistic } from "react";
import Link from "next/link";
import {
  ProgressTracker,
  ProgressTrackerSkeleton,
  StepCardSkeleton,
  WhatHappensNextCardSkeleton,
  DashboardContent,
} from "./dashboard/components";
import { useDashboard } from "./dashboard/hooks/use-dashboard";

export default function AuthenticatedHomePage() {
  const { data: dashboard, isLoading, error } = useDashboard();

  // Optimistic UI state for nickname
  const [optimisticNickname, setOptimisticNickname] = useOptimistic(
    (dashboard?.user as { nickname?: string | null; firstName?: string })
      ?.nickname ||
      dashboard?.user.firstName ||
      "",
    (state, newNickname: string) => newNickname,
  );

  // Optimistic UI state for skin test completion
  const [optimisticSkinTest, setOptimisticSkinTest] = useOptimistic(
    {
      completed: dashboard?.setupProgress.steps.hasCompletedSkinTest || false,
      skinType: (() => {
        const skinTypeArray = (dashboard?.user as { skinType?: string[] })
          ?.skinType;
        if (Array.isArray(skinTypeArray) && skinTypeArray.length > 0) {
          const skinType = skinTypeArray[0];
          return skinType.charAt(0).toUpperCase() + skinType.slice(1);
        }
        return null;
      })(),
    },
    (state, update: { completed: boolean; skinType: string | null }) => update,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="pt-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome to Skinbestie, {optimisticNickname || "there"}!
        </h1>
        <p className="text-gray-600 mt-2">
          Let&apos;s set up your personalized skin transformation journey
        </p>
      </header>

      {/* Error State */}
      {error ? (
        <div className="text-center p-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <p className="text-red-600 mb-4">
              {error instanceof Error
                ? error.message
                : "Failed to load dashboard data"}
            </p>
            {error instanceof Error &&
            error.message.includes("Unauthorized") ? (
              <>
                <p className="text-gray-600 mb-6">
                  Please log out and log back in to continue.
                </p>
                <Link
                  href="/logout"
                  className="inline-block bg-red-400 hover:bg-red-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Log Out
                </Link>
              </>
            ) : (
              <button
                onClick={() => window.location.reload()}
                className="inline-block bg-red-400 hover:bg-red-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      ) : isLoading ? (
        <>
          {/* Loading Skeleton */}
          <ProgressTrackerSkeleton />
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Essential Setup Steps
            </h2>
            <div className="space-y-4">
              <StepCardSkeleton />
              <StepCardSkeleton />
              <StepCardSkeleton />
              <StepCardSkeleton />
            </div>
          </section>
          <WhatHappensNextCardSkeleton />
        </>
      ) : dashboard ? (
        <>
          {/* Progress */}
          <ProgressTracker
            completed={dashboard.setupProgress.completed}
            total={dashboard.setupProgress.total}
          />

          {/* Dashboard Content with Interactive Elements */}
          <DashboardContent
            dashboard={dashboard}
            setOptimisticNickname={setOptimisticNickname}
            optimisticSkinTest={optimisticSkinTest}
            setOptimisticSkinTest={setOptimisticSkinTest}
          />
        </>
      ) : null}
    </div>
  );
}
