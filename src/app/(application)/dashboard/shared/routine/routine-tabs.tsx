"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RoutineItemCard } from "./routine-item-card";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TodayRoutineStep } from "@/app/(application)/dashboard/schemas/dashboard.schema";

interface RoutineTabsProps {
  todayRoutine: TodayRoutineStep[] | null;
  onStepToggle?: (stepId: string, checked: boolean) => void;
  onAllStepsToggle?: (
    timeOfDay: "morning" | "evening",
    checked: boolean,
  ) => void;
  checkedSteps?: Set<string>;
  noBorder?: boolean;
  defaultTabStyle?: boolean;
  noPadding?: boolean;
  useSwitch?: boolean;
}

export function RoutineTabs({
  todayRoutine,
  onStepToggle,
  onAllStepsToggle,
  checkedSteps: externalCheckedSteps,
  noBorder = false,
  defaultTabStyle = false,
  noPadding = false,
  useSwitch = false,
}: RoutineTabsProps) {
  // Filter today's routine by time of day
  const morningSteps =
    todayRoutine?.filter((step) => step.timeOfDay === "morning") || [];
  const eveningSteps =
    todayRoutine?.filter((step) => step.timeOfDay === "evening") || [];

  // Use internal state if no external state provided (for reusability)
  const [internalCheckedSteps, setInternalCheckedSteps] = useState<Set<string>>(
    new Set(),
  );
  const checkedSteps = externalCheckedSteps ?? internalCheckedSteps;
  const [activeTab, setActiveTab] = useState("morning");

  const handleCheckChange = (stepId: string, checked: boolean) => {
    // Call external handler if provided
    if (onStepToggle) {
      onStepToggle(stepId, checked);
    } else {
      // Otherwise use internal state
      setInternalCheckedSteps((prev) => {
        const newSet = new Set(prev);
        if (checked) {
          newSet.add(stepId);
        } else {
          newSet.delete(stepId);
        }
        return newSet;
      });
    }
  };

  const getCurrentSteps = () => {
    return activeTab === "morning" ? morningSteps : eveningSteps;
  };

  const getCurrentStepIds = () => {
    return getCurrentSteps().map((step) => step.id);
  };

  const getCompletedCount = () => {
    const currentStepIds = getCurrentStepIds();
    return currentStepIds.filter((id) => checkedSteps.has(id)).length;
  };

  const getTotalCount = () => {
    return getCurrentSteps().length;
  };

  const isAllSelected = () => {
    const currentStepIds = getCurrentStepIds();
    return (
      currentStepIds.length > 0 &&
      currentStepIds.every((id) => checkedSteps.has(id))
    );
  };

  const handleSelectAll = () => {
    const allSelected = isAllSelected();
    const timeOfDay = activeTab as "morning" | "evening";

    // Call external handler if provided
    if (onAllStepsToggle) {
      onAllStepsToggle(timeOfDay, !allSelected);
    } else {
      // Otherwise use internal state
      const currentStepIds = getCurrentStepIds();
      setInternalCheckedSteps((prev) => {
        const newSet = new Set(prev);
        if (allSelected) {
          // Unselect all current steps
          currentStepIds.forEach((id) => newSet.delete(id));
        } else {
          // Select all current steps
          currentStepIds.forEach((id) => newSet.add(id));
        }
        return newSet;
      });
    }
  };

  return (
    <Card
      className={cn(noBorder && "border-0 shadow-none", noPadding && "p-0")}
    >
      {useSwitch ? null : (
        <CardHeader className={cn(noPadding && "p-0")}>
          <CardTitle className="text-xl font-bold">Your Routine</CardTitle>
        </CardHeader>
      )}
      <CardContent className={cn(noPadding && "p-0")}>
        {useSwitch ? (
          <div className="space-y-4">
            {/* Helper Text */}
            <p className="text-sm text-gray-600">
              Switch to view your morning or evening routine
            </p>

            {/* Custom Switch Component */}
            <div className="space-y-4">
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

              {/* Routine Label */}
              <span className="text-xl font-semibold text-gray-900">
                {activeTab === "morning" ? "Morning" : "Evening"} Routine
              </span>

              {/* Mark All (Mobile only) - Only show if todayRoutine has steps */}
              {todayRoutine && todayRoutine.length > 0 && (
                <div className="flex items-center gap-3 md:hidden py-4">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    aria-label="Mark all as done"
                    className={`flex items-center justify-center h-5 w-5 rounded border-2 transition-all cursor-pointer ${
                      isAllSelected()
                        ? "bg-skinbestie-success-dark border-skinbestie-success-dark"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    {isAllSelected() && (
                      <Check className="h-4 w-4 text-white" />
                    )}
                  </button>
                  <span className="text-sm font-medium text-gray-700">
                    Mark all as done
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : null}

        {useSwitch ? null : (
          <Tabs
            defaultValue="morning"
            className="w-full"
            onValueChange={setActiveTab}
          >
            <TabsList className="w-full">
              <TabsTrigger
                value="morning"
                className={`flex-1 ${!defaultTabStyle ? "data-[state=active]:bg-skinbestie-primary data-[state=active]:text-white" : ""}`}
              >
                <span className="mr-2">☀️</span>
                Morning
              </TabsTrigger>
              <TabsTrigger
                value="evening"
                className={`flex-1 ${!defaultTabStyle ? "data-[state=active]:bg-skinbestie-primary data-[state=active]:text-white" : ""}`}
              >
                <span className="mr-2">🌙</span>
                Evening
              </TabsTrigger>
            </TabsList>

            {/* Select All and Progress - Between tabs and content */}
            <div className="flex items-center justify-between w-full py-4 border-b">
              {/* Select All Checkbox */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  aria-label="Mark all as done"
                  className={`flex items-center justify-center h-5 w-5 rounded border-2 transition-all cursor-pointer ${
                    isAllSelected()
                      ? "bg-skinbestie-success-dark border-skinbestie-success-dark"
                      : "bg-white border-gray-300"
                  }`}
                >
                  {isAllSelected() && <Check className="h-4 w-4 text-white" />}
                </button>
                <span className="text-sm font-medium text-gray-700">
                  Mark all as done
                </span>
              </div>

              {/* Progress Stepper with Bar */}
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-1 min-w-[120px]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Progress</span>
                    <span className="text-xs font-semibold text-gray-900">
                      {getCompletedCount()} / {getTotalCount()}
                    </span>
                  </div>
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full transition-all duration-300 bg-skinbestie-success-dark"
                      style={{
                        width: `${getTotalCount() > 0 ? (getCompletedCount() / getTotalCount()) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <TabsContent value="morning" className="mt-4">
              <div className="space-y-4">
                {morningSteps.length > 0 ? (
                  morningSteps.map((step) => (
                    <RoutineItemCard
                      key={step.id}
                      productName={step.productName}
                      description={step.instructions}
                      category={step.routineStep}
                      productUrl={step.productUrl ?? undefined}
                      showCheckbox={true}
                      showViewProduct={true}
                      productNameAsLink={false}
                      isChecked={checkedSteps.has(step.id)}
                      onCheckedChange={(checked) =>
                        handleCheckChange(step.id, checked)
                      }
                    />
                  ))
                ) : (
                  <p className="text-muted-foreground">
                    No morning routine steps yet.
                  </p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="evening" className="mt-4">
              <div className="space-y-4">
                {eveningSteps.length > 0 ? (
                  eveningSteps.map((step) => (
                    <RoutineItemCard
                      key={step.id}
                      productName={step.productName}
                      description={step.instructions}
                      category={step.routineStep}
                      productUrl={step.productUrl ?? undefined}
                      showCheckbox={true}
                      showViewProduct={true}
                      productNameAsLink={false}
                      isChecked={checkedSteps.has(step.id)}
                      onCheckedChange={(checked) =>
                        handleCheckChange(step.id, checked)
                      }
                    />
                  ))
                ) : (
                  <p className="text-muted-foreground">
                    No evening routine steps yet.
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* Render content for switch version */}
        {useSwitch && (
          <>
            {/* Select All and Progress - Only show if todayRoutine has steps */}
            {todayRoutine && todayRoutine.length > 0 && (
              <div className="flex flex-col md:flex-row items-center justify-between w-full py-4 gap-4">
                {/* Mark all as done - Desktop only */}
                <div className="hidden md:flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    aria-label="Mark all as done"
                    className={`flex items-center justify-center h-5 w-5 rounded border-2 transition-all cursor-pointer ${
                      isAllSelected()
                        ? "bg-skinbestie-success-dark border-skinbestie-success-dark"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    {isAllSelected() && (
                      <Check className="h-4 w-4 text-white" />
                    )}
                  </button>
                  <span className="text-sm font-medium text-gray-700">
                    Mark all as done
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="flex flex-col gap-1 w-full md:min-w-[120px]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Progress</span>
                      <span className="text-xs font-semibold text-gray-900">
                        {getCompletedCount()} / {getTotalCount()}
                      </span>
                    </div>
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full transition-all duration-300 bg-skinbestie-success-dark"
                        style={{
                          width: `${getTotalCount() > 0 ? (getCompletedCount() / getTotalCount()) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Routine steps based on active tab */}
            <div className="space-y-4 mt-4">
              {activeTab === "morning" ? (
                morningSteps.length > 0 ? (
                  morningSteps.map((step) => (
                    <RoutineItemCard
                      key={step.id}
                      productName={step.productName}
                      description={step.instructions}
                      category={step.routineStep}
                      productUrl={step.productUrl ?? undefined}
                      showCheckbox={true}
                      showViewProduct={true}
                      productNameAsLink={false}
                      isChecked={checkedSteps.has(step.id)}
                      onCheckedChange={(checked) =>
                        handleCheckChange(step.id, checked)
                      }
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
                    productName={step.productName}
                    description={step.instructions}
                    category={step.routineStep}
                    productUrl={step.productUrl ?? undefined}
                    showCheckbox={true}
                    showViewProduct={true}
                    productNameAsLink={false}
                    isChecked={checkedSteps.has(step.id)}
                    onCheckedChange={(checked) =>
                      handleCheckChange(step.id, checked)
                    }
                  />
                ))
              ) : (
                <p className="text-muted-foreground">
                  No evening routine steps yet.
                </p>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
