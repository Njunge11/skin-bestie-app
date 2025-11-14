"use client";

import { useOptimistic } from "react";
import { DashboardSkeleton, ProgressTracker } from "./components";
import { SetupDashboard } from "./setup-dashboard";
import { SubscriberDashboard } from "./subscriber-dashboard";
import { ErrorFeedback } from "../components";
import { useDashboard } from "./hooks/use-dashboard";
import { type DashboardResponse, type User } from "./schemas";
import InstallPrompt from "@/components/install-prompt";

function getGreeting(nickname: string): string {
  if (nickname) {
    return `Welcome to SkinBestie, ${nickname}!`;
  }
  return "Welcome to SkinBestie!";
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "Failed to load dashboard data";
}

function getSkinType(user: User): string | null {
  const skinTypeArray = user.skinType;

  if (!skinTypeArray || skinTypeArray.length === 0) {
    return null;
  }

  const skinType = skinTypeArray[0];
  return skinType.charAt(0).toUpperCase() + skinType.slice(1);
}

function checkSetupComplete(dashboard: DashboardResponse): boolean {
  const steps = dashboard.setupProgress.steps;

  const allStepsComplete =
    steps.hasCompletedSkinTest &&
    steps.hasPublishedGoals &&
    steps.hasPublishedRoutine &&
    steps.hasCompletedBooking &&
    steps.productsReceived &&
    steps.routineStartDateSet &&
    dashboard.goalsAcknowledgedByClient;

  return allStepsComplete;
}

export default function DashboardPage() {
  const { data: dashboard, isLoading, error, refetch } = useDashboard();

  // Get nickname for optimistic updates
  const initialNickname =
    dashboard?.user?.nickname || dashboard?.user?.firstName || "";

  // Optimistic UI state for nickname
  const [optimisticNickname, setOptimisticNickname] = useOptimistic(
    initialNickname,
    (state, newNickname: string) => newNickname,
  );

  // Get initial skin test state
  const initialSkinTest = {
    completed: dashboard?.setupProgress?.steps?.hasCompletedSkinTest || false,
    skinType: dashboard?.user ? getSkinType(dashboard.user) : null,
  };

  // Optimistic UI state for skin test completion
  const [optimisticSkinTest, setOptimisticSkinTest] = useOptimistic(
    initialSkinTest,
    (state, update: { completed: boolean; skinType: string | null }) => update,
  );

  const isSetupComplete = dashboard ? checkSetupComplete(dashboard) : false;
  const greeting = getGreeting(optimisticNickname);
  const errorMessage = getErrorMessage(error);

  // Render different content based on state
  let content;

  if (error) {
    content = (
      <ErrorFeedback message={errorMessage} onAction={() => refetch()} />
    );
  } else if (isLoading) {
    content = <DashboardSkeleton />;
  } else if (dashboard) {
    if (isSetupComplete) {
      content = (
        <SubscriberDashboard
          userName={optimisticNickname}
          todayRoutine={dashboard.todayRoutine}
          catchupSteps={dashboard.catchupSteps}
          goals={dashboard.goals || []}
          routine={dashboard.routine}
        />
      );
    } else {
      content = (
        <>
          <ProgressTracker
            completed={dashboard.setupProgress.completed}
            total={dashboard.setupProgress.total}
          />
          <SetupDashboard
            dashboard={dashboard}
            setOptimisticNickname={setOptimisticNickname}
            optimisticSkinTest={optimisticSkinTest}
            setOptimisticSkinTest={setOptimisticSkinTest}
          />
        </>
      );
    }
  }

  return (
    <>
      {/* PWA Install Prompt - only show when not in error state */}
      {!error && dashboard && <InstallPrompt />}

      <div
        className={`mx-auto w-full max-w-3xl ${error ? "flex items-center justify-center min-h-[calc(100vh-8rem)]" : "space-y-6"}`}
      >
        {error ? (
          content
        ) : (
          <>
            {/* Header - only show for setup dashboard */}
            {!isSetupComplete && dashboard && (
              <header className="pt-4">
                <h1 className="text-2xl font-bold text-gray-900">{greeting}</h1>
                <p className="text-lg text-gray-600 mt-2">
                  Let&apos;s set up your personalised skin transformation
                  journey
                </p>
              </header>
            )}

            {/* Content */}
            {content}
          </>
        )}
      </div>
    </>
  );
}
