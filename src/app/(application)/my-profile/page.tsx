"use client";

import { ProfileHeader, ProfileTabs } from "./components";
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
      <ProfileHeader dashboard={dashboard} />
      <ProfileTabs dashboard={dashboard} />
    </div>
  );
}
