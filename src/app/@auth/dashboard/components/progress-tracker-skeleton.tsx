import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProgressTrackerSkeleton() {
  return (
    <Card className="border-none bg-white">
      <CardContent>
        <div className="flex justify-between items-center mb-2">
          <Skeleton className="h-5 w-32 bg-gray-200" />
          <Skeleton className="h-4 w-28 bg-gray-200" />
        </div>
        <Skeleton className="h-2 w-full bg-gray-200" />
      </CardContent>
    </Card>
  );
}
