import { Check } from "lucide-react";

interface RoutineStep {
  name: string;
  completed: boolean;
}

interface RoutineCardProps {
  title: string;
  steps: RoutineStep[];
}

export function RoutineCard({ title, steps }: RoutineCardProps) {
  const completedCount = steps.filter((step) => step.completed).length;
  const completionPercentage = (completedCount / steps.length) * 100;

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <span className="text-sm text-gray-500">
          {completedCount}/{steps.length}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
        <div
          className="bg-[#D4AF37] h-2 rounded-full transition-all duration-300"
          style={{ width: `${completionPercentage}%` }}
        />
      </div>
      <div className="space-y-2">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                step.completed
                  ? "border-green-500 bg-green-500"
                  : "border-gray-300"
              }`}
            >
              {step.completed && <Check className="w-3 h-3 text-white" />}
            </div>
            <span
              className={`text-sm ${
                step.completed ? "text-gray-500 line-through" : "text-gray-700"
              }`}
            >
              {step.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
