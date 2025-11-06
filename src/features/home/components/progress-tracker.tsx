import { Check } from "lucide-react";

interface ProgressTrackerProps {
  currentStep: number;
  steps: string[];
}

export function ProgressTracker({ currentStep, steps }: ProgressTrackerProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                  index < currentStep
                    ? "bg-green-500 text-white"
                    : index === currentStep
                      ? "bg-[#D4AF37] text-white"
                      : "bg-gray-200 text-gray-500"
                }`}
              >
                {index < currentStep ? (
                  <Check className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </div>
              <span className="text-[10px] mt-1 text-gray-600 whitespace-nowrap">
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 w-12 mx-2 ${
                  index < currentStep ? "bg-green-500" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
