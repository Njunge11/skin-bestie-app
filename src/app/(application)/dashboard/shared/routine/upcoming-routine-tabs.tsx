"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { RoutineItemCard } from "./routine-item-card";
import type { Routine } from "../../schemas/dashboard.schema";

interface UpcomingRoutineTabsProps {
  routine: Routine;
  noBorder?: boolean;
  defaultTabStyle?: boolean;
  noPadding?: boolean;
  useSwitch?: boolean;
}

/**
 * UpcomingRoutineTabs - Displays a future routine in read-only mode
 *
 * Shows routine steps that haven't started yet with:
 * - "Starts [date]" badge
 * - No checkboxes or interactive elements
 * - Same visual layout as active routine
 */
export function UpcomingRoutineTabs({
  routine,
  noBorder = false,
  noPadding = false,
}: UpcomingRoutineTabsProps) {
  const [activeTab, setActiveTab] = useState("morning");

  const morningSteps = routine.morning || [];
  const eveningSteps = routine.evening || [];

  // Format start date
  const formatStartDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card
      className={cn(noBorder && "border-0 shadow-none", noPadding && "p-0")}
    >
      <CardContent className={cn(noPadding && "p-0")}>
        <div className="space-y-4">
          {/* Start Date Notice */}
          <div className="flex items-center gap-2 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <Calendar className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                Your routine starts on {formatStartDate(routine.startDate)}
              </p>
            </div>
          </div>

          {/* Custom Switch Component */}
          <div className="space-y-3">
            {/* Toggle Switch */}
            <div className="relative flex items-center bg-skinbestie-primary rounded-full p-0.5 gap-0.5 w-fit">
              {/* Sun Icon Button */}
              <button
                onClick={() => setActiveTab("morning")}
                className={cn(
                  "relative z-10 flex items-center justify-center w-10 h-8 rounded-full transition-all",
                  activeTab === "morning"
                    ? "bg-white text-gray-900"
                    : "bg-transparent text-white",
                )}
              >
                <span className="text-lg">☀️</span>
              </button>

              {/* Moon Icon Button */}
              <button
                onClick={() => setActiveTab("evening")}
                className={cn(
                  "relative z-10 flex items-center justify-center w-10 h-8 rounded-full transition-all",
                  activeTab === "evening"
                    ? "bg-white text-gray-900"
                    : "bg-transparent text-white",
                )}
              >
                <span className="text-lg">🌙</span>
              </button>
            </div>

            {/* Active Tab Label */}
            <span className="text-xl font-semibold text-gray-900">
              {activeTab === "morning" ? "Morning" : "Evening"} Routine
            </span>
          </div>

          {/* Routine Steps - Same cards as active routine, just no checkbox */}
          <div className="space-y-4 mt-4">
            {activeTab === "morning" ? (
              morningSteps.length > 0 ? (
                morningSteps.map((step) => (
                  <RoutineItemCard
                    key={step.id}
                    stepType={step.stepType}
                    stepName={step.stepName}
                    productName={step.productName}
                    description={step.instructions}
                    category={step.routineStep}
                    productUrl={step.productUrl ?? undefined}
                    showCheckbox={false}
                    showViewProduct={false}
                    productNameAsLink={false}
                  />
                ))
              ) : (
                <p className="text-muted-foreground">
                  No morning routine steps yet.
                </p>
              )
            ) : eveningSteps.length > 0 ? (
              eveningSteps.map((step) => (
                <RoutineItemCard
                  key={step.id}
                  stepType={step.stepType}
                  stepName={step.stepName}
                  productName={step.productName}
                  description={step.instructions}
                  category={step.routineStep}
                  productUrl={step.productUrl ?? undefined}
                  showCheckbox={false}
                  showViewProduct={false}
                  productNameAsLink={false}
                />
              ))
            ) : (
              <p className="text-muted-foreground">
                No evening routine steps yet.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
