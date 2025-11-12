"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { type DashboardResponse } from "../../dashboard/schemas";
import {
  RoutineTabs,
  UpcomingRoutineTabs,
} from "../../dashboard/shared/routine";
import { ProgressPhotos } from "../progress-photos";
import { UploadProvider } from "../progress-photos/upload-context";
import { MyProducts } from "./my-products";
import { SupportFeedback } from "./support-feedback";
import {
  toggleRoutineStepAction,
  toggleMultipleStepsAction,
} from "../../dashboard/shared/routine/routine-step-actions";

interface ProfileTabsProps {
  dashboard: DashboardResponse;
}

export function ProfileTabs({ dashboard }: ProfileTabsProps) {
  const queryClient = useQueryClient();
  const { todayRoutine, routine } = dashboard;

  // Initialize checked steps from todayRoutine completion status
  const [checkedSteps, setCheckedSteps] = useState<Set<string>>(() => {
    const completed = new Set<string>();
    todayRoutine?.forEach((step) => {
      if (
        step.status === "on-time" ||
        step.status === "late" ||
        step.completedAt
      ) {
        completed.add(step.id);
      }
    });
    return completed;
  });

  // Routine step handlers
  const handleStepToggle = async (stepId: string, checked: boolean) => {
    setCheckedSteps((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(stepId);
      } else {
        newSet.delete(stepId);
      }
      return newSet;
    });

    const result = await toggleRoutineStepAction(stepId, checked);

    if (result.success) {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    } else {
      setCheckedSteps((prev) => {
        const newSet = new Set(prev);
        if (checked) {
          newSet.delete(stepId);
        } else {
          newSet.add(stepId);
        }
        return newSet;
      });
      toast.error(result.error.message);
    }
  };

  const handleAllStepsToggle = async (
    timeOfDay: "morning" | "evening",
    checked: boolean,
  ) => {
    const steps =
      todayRoutine?.filter((step) => step.timeOfDay === timeOfDay) || [];
    const stepIds = steps.map((s) => s.id);

    setCheckedSteps((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        stepIds.forEach((id) => newSet.add(id));
      } else {
        stepIds.forEach((id) => newSet.delete(id));
      }
      return newSet;
    });

    const result = await toggleMultipleStepsAction(stepIds, checked);

    if (result.success) {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    } else {
      setCheckedSteps((prev) => {
        const newSet = new Set(prev);
        if (checked) {
          stepIds.forEach((id) => newSet.delete(id));
        } else {
          stepIds.forEach((id) => newSet.add(id));
        }
        return newSet;
      });
      toast.error(result.error.message);
    }
  };
  const [activeTab, setActiveTab] = useState("routines");

  return (
    <UploadProvider>
      <Card className="p-6">
        <Tabs
          defaultValue="routines"
          className="w-full"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 h-auto p-1">
            <TabsTrigger
              value="routines"
              className={cn(
                "data-[state=active]:bg-skinbestie-primary data-[state=active]:text-white",
                "text-gray-700 font-medium",
              )}
            >
              My Routine
            </TabsTrigger>
            <TabsTrigger
              value="photos"
              className={cn(
                "data-[state=active]:bg-skinbestie-primary data-[state=active]:text-white",
                "text-gray-700 font-medium",
              )}
            >
              My Photos
            </TabsTrigger>
            <TabsTrigger
              value="support"
              className={cn(
                "data-[state=active]:bg-skinbestie-primary data-[state=active]:text-white",
                "text-gray-700 font-medium",
              )}
            >
              Feedback
            </TabsTrigger>
          </TabsList>

          <TabsContent value="routines" className="mt-6 space-y-6">
            {/* Routine Section */}
            {todayRoutine && todayRoutine.length > 0 ? (
              /* Active Routine - has today's steps */
              <RoutineTabs
                todayRoutine={todayRoutine}
                checkedSteps={checkedSteps}
                onStepToggle={handleStepToggle}
                onAllStepsToggle={handleAllStepsToggle}
                noBorder={true}
                noPadding={true}
                useSwitch={true}
              />
            ) : routine ? (
              /* Upcoming Routine - no today's steps but routine exists */
              <UpcomingRoutineTabs
                routine={routine}
                noBorder={true}
                noPadding={true}
                useSwitch={true}
              />
            ) : (
              /* No routine at all */
              <RoutineTabs
                todayRoutine={todayRoutine}
                checkedSteps={checkedSteps}
                onStepToggle={handleStepToggle}
                onAllStepsToggle={handleAllStepsToggle}
                noBorder={true}
                noPadding={true}
                useSwitch={true}
              />
            )}

            {/* Separator */}
            <div className="border-t border-gray-200"></div>

            {/* My Products Section */}
            <MyProducts dashboard={dashboard} />
          </TabsContent>

          <TabsContent value="photos" className="mt-6">
            <ProgressPhotos
              userProfileId={dashboard.user.userProfileId}
              isActive={activeTab === "photos"}
            />
          </TabsContent>

          <TabsContent value="support" className="mt-6">
            <SupportFeedback dashboard={dashboard} />
          </TabsContent>
        </Tabs>
      </Card>
    </UploadProvider>
  );
}
