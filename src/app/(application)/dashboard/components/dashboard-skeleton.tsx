import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { MetricCardSkeleton } from "./metric-card-skeleton";

export function DashboardSkeleton() {
  return (
    <div data-testid="dashboard-skeleton" className="space-y-6">
      {/* Header Section Skeleton */}
      <div className="space-y-2">
        <div className="h-8 bg-gray-200 animate-pulse rounded-md w-48" />
        <div className="h-6 bg-gray-200 animate-pulse rounded-md w-full max-w-lg" />
      </div>

      {/* Metrics Grid Skeleton - 3 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCardSkeleton />
        <MetricCardSkeleton />
        <MetricCardSkeleton />
      </div>

      {/* Weekly Summary Skeleton - Card */}
      <Card className="bg-gray-50 border-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="h-6 bg-gray-200 animate-pulse rounded w-40" />
              <div className="h-5 bg-gray-200 animate-pulse rounded w-full" />
            </div>
            <div className="h-16 w-16 bg-gray-200 animate-pulse rounded-full flex-shrink-0" />
          </div>
        </div>
      </Card>

      {/* Routine Tabs Skeleton - Card */}
      <Card>
        <CardHeader>
          <div className="h-6 bg-gray-200 animate-pulse rounded w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Tabs */}
          <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
            <div className="h-9 bg-gray-200 animate-pulse rounded flex-1" />
            <div className="h-9 bg-gray-200 animate-pulse rounded flex-1" />
          </div>

          {/* Select all and progress bar */}
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 bg-gray-200 animate-pulse rounded" />
              <div className="h-4 bg-gray-200 animate-pulse rounded w-28" />
            </div>
            <div className="h-4 bg-gray-200 animate-pulse rounded w-20" />
          </div>

          {/* Routine items */}
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-4 border rounded-lg"
              >
                <div className="h-5 w-5 bg-gray-200 animate-pulse rounded" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4" />
                  <div className="h-3 bg-gray-200 animate-pulse rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Goals Section Skeleton - Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="h-6 bg-gray-200 animate-pulse rounded w-28" />
            <div className="h-9 bg-gray-200 animate-pulse rounded w-24" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-4 border rounded-lg"
            >
              <div className="h-5 w-5 bg-gray-200 animate-pulse rounded" />
              <div className="h-5 w-5 bg-gray-200 animate-pulse rounded" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 animate-pulse rounded w-full" />
              </div>
              <div className="flex gap-2">
                <div className="h-7 w-7 bg-gray-200 animate-pulse rounded" />
                <div className="h-7 w-7 bg-gray-200 animate-pulse rounded" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
