import {
  Card,
  CardHeader,
  CardContent,
  CardAction,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface StepCardSkeletonProps {
  showContent?: boolean;
  className?: string;
}

export function StepCardSkeleton({
  showContent = true,
  className,
}: StepCardSkeletonProps) {
  return (
    <Card className={cn("border-none bg-white", className)}>
      <CardHeader>
        {/* Avatar skeleton */}
        <Skeleton className="w-10 h-10 rounded-full bg-gray-200" />

        {/* Badge skeleton */}
        <CardAction>
          <Skeleton className="h-6 w-24 rounded-full bg-gray-200" />
        </CardAction>

        {/* Title skeleton */}
        <Skeleton className="h-6 w-3/4 bg-gray-200" />

        {/* Description skeleton */}
        <Skeleton className="h-4 w-full bg-gray-200" />
        <Skeleton className="h-4 w-5/6 bg-gray-200" />
      </CardHeader>

      {showContent && (
        <CardContent>
          <Skeleton className="h-4 w-2/3 mb-4 bg-gray-200" />
          <Skeleton className="h-10 w-40 rounded bg-gray-200" />
        </CardContent>
      )}
    </Card>
  );
}
