import { Card } from "@/components/ui/card";

interface WeeklySummaryProps {
  message: string;
}

export function WeeklySummary({ message }: WeeklySummaryProps) {
  return (
    <Card className="p-6 bg-skinbestie-neutral border-[0.5px] border-skinbestie-neutral-border">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Weekly Summary
          </h2>
          <p className="text-lg text-gray-700">{message}</p>
        </div>
        <div className="text-6xl flex-shrink-0">🎉</div>
      </div>
    </Card>
  );
}
