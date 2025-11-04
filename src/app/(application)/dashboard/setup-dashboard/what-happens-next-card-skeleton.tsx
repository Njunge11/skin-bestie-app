import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function WhatHappensNextCardSkeleton() {
  return (
    <Card className="bg-white border-none">
      <CardHeader>
        <Skeleton className="h-6 w-48 bg-gray-200" />
        <Skeleton className="h-4 w-full bg-gray-200" />
        <Skeleton className="h-4 w-3/4 bg-gray-200" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-10 w-full rounded bg-gray-200" />
        <Skeleton className="h-10 w-full rounded bg-gray-200" />
      </CardContent>
    </Card>
  );
}
