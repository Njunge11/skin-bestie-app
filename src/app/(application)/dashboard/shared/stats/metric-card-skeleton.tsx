import { Card, CardHeader, CardContent } from "@/components/ui/card";

export function MetricCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 bg-gray-200 animate-pulse rounded-lg" />
          <div className="h-4 bg-gray-200 animate-pulse rounded w-24" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="h-10 bg-gray-200 animate-pulse rounded w-20" />
        <div className="h-4 bg-gray-200 animate-pulse rounded w-full" />
        <div className="h-2 bg-gray-200 animate-pulse rounded-full w-full" />
      </CardContent>
    </Card>
  );
}
