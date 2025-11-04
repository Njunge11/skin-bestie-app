"use client";

import {
  ProfileHeader,
  ProfileDetails,
  ProfileGoals,
  CatchupTasks,
  ProfileTabs,
} from "./components";
import { useDashboard } from "../dashboard/hooks/use-dashboard";
import { DashboardSkeleton } from "../dashboard/components/dashboard-skeleton";
import { ErrorFeedback } from "../components";

export default function MyProfilePage() {
  const { data: dashboard, isLoading, error, refetch } = useDashboard();

  if (error) {
    return (
      <div className="mx-auto w-full max-w-3xl flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <ErrorFeedback
          message={
            error instanceof Error
              ? error.message
              : "Failed to load profile data"
          }
          onAction={() => refetch()}
        />
      </div>
    );
  }

  if (isLoading || !dashboard) {
    return (
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-lg text-gray-600">
          Manage your account information, track your skin journey, and share
          feedback.
        </p>
      </div>

      <ProfileHeader dashboard={dashboard} />

      {/* Catchup Tasks - Only show if there are catchup steps */}
      {dashboard.catchupSteps && dashboard.catchupSteps.length > 0 && (
        <CatchupTasks catchupSteps={dashboard.catchupSteps} />
      )}

      <ProfileDetails dashboard={dashboard} />
      <ProfileGoals goals={dashboard.goals || []} />
      <ProfileTabs dashboard={dashboard} />
    </div>
  );
}
