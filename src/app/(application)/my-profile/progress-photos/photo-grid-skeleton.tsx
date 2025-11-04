"use client";

import { Skeleton } from "@/components/ui/skeleton";

interface PhotoGridSkeletonProps {
  count?: number;
}

export function PhotoGridSkeleton({ count = 8 }: PhotoGridSkeletonProps) {
  return (
    <div className="space-y-8">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-7 w-48" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="space-y-2">
            {/* Photo card skeleton */}
            <Skeleton className="aspect-[3/4] rounded-lg" />
            {/* Date label skeleton */}
            <Skeleton className="h-4 w-32 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
