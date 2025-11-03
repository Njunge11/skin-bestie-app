import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProgressTrackerProps {
  completed: number;
  total: number;
}

export function ProgressTracker({ completed, total }: ProgressTrackerProps) {
  const percentage = (completed / total) * 100;

  return (
    <Card className="border-none">
      <CardContent>
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold text-gray-900">Setup Progress</h2>
          <span className="text-sm text-skinbestie-primary font-bold">
            {completed} of {total} Completed
          </span>
        </div>
        <Progress
          value={percentage}
          className="h-2 [&>*]:bg-skinbestie-primary"
        />
      </CardContent>
    </Card>
  );
}
