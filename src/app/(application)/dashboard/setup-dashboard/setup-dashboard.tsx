"use client";

import { useState, startTransition } from "react";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StepCard } from "./step-card";
import { SkinTestModal } from "./skin-test-modal";
import { SelectSkinTypeModal } from "./select-skin-type-modal";
import { WhatHappensNextCard } from "./what-happens-next-card";
import { ViewRoutineModal } from "./view-routine-modal";
import { PreferredNameModal } from "./preferred-name-modal";
import { ProductsPurchasedModal } from "./products-purchased-modal";
import { ChangeStartDateModal } from "./change-start-date-modal";
import { ReviewGoalsModal } from "../shared/goals";
import {
  updateNickname,
  updateSkinTest,
  confirmProductsReceived,
  updateRoutineStartDate,
} from "./setup-dashboard-actions";
import { type DashboardResponse } from "../schemas";

interface SetupDashboardProps {
  dashboard: DashboardResponse;
  setOptimisticNickname: (nickname: string) => void;
  optimisticSkinTest: { completed: boolean; skinType: string | null };
  setOptimisticSkinTest: (update: {
    completed: boolean;
    skinType: string | null;
  }) => void;
}

// Helper functions for step status
function getBookingState(hasCompletedBooking: boolean) {
  if (hasCompletedBooking) {
    return { status: "completed" as const, variant: "success" as const };
  }
  return { status: "pending" as const, variant: "default" as const };
}

function getSkinTestState(skinTestCompleted: boolean) {
  if (skinTestCompleted) {
    return { status: "completed" as const, variant: "success" as const };
  }
  return { status: "pending" as const, variant: "muted" as const };
}

function getGoalsState(hasPublishedGoals: boolean, goalsAcknowledged: boolean) {
  if (hasPublishedGoals && goalsAcknowledged) {
    return { status: "completed" as const, variant: "success" as const };
  }
  if (hasPublishedGoals && !goalsAcknowledged) {
    return { status: "pending" as const, variant: "default" as const };
  }
  return { status: "waiting" as const, variant: "muted" as const };
}

function getRoutineState(hasPublishedRoutine: boolean) {
  if (hasPublishedRoutine) {
    return { status: "completed" as const, variant: "success" as const };
  }
  return { status: "waiting" as const, variant: "muted" as const };
}

function getProductsState(
  productsReceived: boolean,
  routineStartDateSet: boolean,
) {
  if (productsReceived && routineStartDateSet) {
    return { status: "completed" as const, variant: "success" as const };
  }
  return { status: "pending" as const, variant: "default" as const };
}

export function SetupDashboard({
  dashboard,
  setOptimisticNickname,
  optimisticSkinTest,
  setOptimisticSkinTest,
}: SetupDashboardProps) {
  const queryClient = useQueryClient();
  const [isRefreshingGoals, setIsRefreshingGoals] = useState(false);
  const [isRefreshingRoutine, setIsRefreshingRoutine] = useState(false);
  const [optimisticProductsReceived, setOptimisticProductsReceived] =
    useState(false);
  const [optimisticStartDate, setOptimisticStartDate] = useState<Date | null>(
    null,
  );

  const handleRefreshGoals = async () => {
    setIsRefreshingGoals(true);

    // Store previous state
    const previousGoalsStatus = dashboard.setupProgress.steps.hasPublishedGoals;

    // Invalidate and wait for refetch
    await queryClient.invalidateQueries({ queryKey: ["dashboard"] });

    // Small delay to allow refetch
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Check if anything changed
    const currentData = queryClient.getQueryData(["dashboard"]) as
      | DashboardResponse
      | undefined;

    if (currentData) {
      const goalsChanged =
        currentData.setupProgress.steps.hasPublishedGoals !==
        previousGoalsStatus;

      if (!goalsChanged) {
        toast.info("No updates yet, check back soon!");
      }
    }

    setIsRefreshingGoals(false);
  };

  const handleRefreshRoutine = async () => {
    setIsRefreshingRoutine(true);

    // Store previous state
    const previousRoutineStatus =
      dashboard.setupProgress.steps.hasPublishedRoutine;

    // Invalidate and wait for refetch
    await queryClient.invalidateQueries({ queryKey: ["dashboard"] });

    // Small delay to allow refetch
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Check if anything changed
    const currentData = queryClient.getQueryData(["dashboard"]) as
      | DashboardResponse
      | undefined;

    if (currentData) {
      const routineChanged =
        currentData.setupProgress.steps.hasPublishedRoutine !==
        previousRoutineStatus;

      if (!routineChanged) {
        toast.info("No updates yet, check back soon!");
      }
    }

    setIsRefreshingRoutine(false);
  };
  const [showSkinTestModal, setShowSkinTestModal] = useState(false);
  const [showSelectSkinTypeModal, setShowSelectSkinTypeModal] = useState(false);
  const [showReviewGoalsModal, setShowReviewGoalsModal] = useState(false);
  const [showViewRoutineModal, setShowViewRoutineModal] = useState(false);
  const [showProductsPurchasedModal, setShowProductsPurchasedModal] =
    useState(false);
  const [showChangeStartDateModal, setShowChangeStartDateModal] =
    useState(false);

  // Track if user has explicitly closed the modal during this session
  const [hasClosedNicknameModal, setHasClosedNicknameModal] = useState(false);

  // Derive modal state: show if nickname is null AND user hasn't closed it this session
  const showPreferredNameModal =
    dashboard.user.nickname === null && !hasClosedNicknameModal;

  const handleSaveSkinType = async (skinType: string) => {
    // Capitalize first letter for display
    const capitalizedSkinType =
      skinType.charAt(0).toUpperCase() + skinType.slice(1);

    // Optimistically update the UI wrapped in startTransition
    startTransition(() => {
      setOptimisticSkinTest({ completed: true, skinType: capitalizedSkinType });
    });

    // Call the Server Action
    const result = await updateSkinTest(skinType);

    if (!result.success) {
      toast.error("Failed to save skin type", {
        description: result.error.message,
      });
    } else {
      // Invalidate dashboard query to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    }
  };

  const handleSavePreferredName = async (preferredName: string) => {
    // Optimistically update the UI wrapped in startTransition
    startTransition(() => {
      setOptimisticNickname(preferredName);
    });

    // Call the Server Action
    const result = await updateNickname(preferredName);

    if (!result.success) {
      toast.error("Failed to save preferred name", {
        description: result.error.message,
      });
      // Revert optimistic update on error
      startTransition(() => {
        setOptimisticNickname(dashboard.user.firstName);
      });
      throw new Error(result.error.message); // Prevent modal from closing
    } else {
      // Invalidate and wait for dashboard query to refetch fresh data
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });

      // Modal will close automatically when nickname is set (derived state)
    }
  };

  const handleCancelPreferredName = async (): Promise<boolean> => {
    // Use firstName as default nickname wrapped in startTransition
    startTransition(() => {
      setOptimisticNickname(dashboard.user.firstName);
    });

    // Call the Server Action with firstName
    const result = await updateNickname(dashboard.user.firstName);

    if (!result.success) {
      toast.error("Failed to set default name", {
        description: result.error.message,
      });
      return false; // Indicate failure
    } else {
      // Invalidate dashboard query to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      return true; // Indicate success
    }
  };

  const handlePreferredNameModalChange = async (open: boolean) => {
    if (!open) {
      // If user is trying to close the modal (clicking outside, ESC, etc.)
      // Save firstName as default
      const success = await handleCancelPreferredName();

      // Mark that user has closed the modal (prevents it from reopening this session)
      if (success) {
        setHasClosedNicknameModal(true);
      }
    }
    // Modal visibility is derived, so we don't need to set it manually
  };

  // Calculate step statuses
  const steps = dashboard.setupProgress.steps;
  const { status: bookingStatus, variant: bookingVariant } = getBookingState(
    steps.hasCompletedBooking,
  );
  const { status: skinTestStatus, variant: skinTestVariant } = getSkinTestState(
    optimisticSkinTest.completed,
  );
  const { status: goalsStatus, variant: goalsVariant } = getGoalsState(
    steps.hasPublishedGoals,
    dashboard.goalsAcknowledgedByClient || false,
  );
  const { status: routineStatus, variant: routineVariant } = getRoutineState(
    steps.hasPublishedRoutine,
  );
  const { status: productsStatus, variant: productsVariant } = getProductsState(
    optimisticProductsReceived || steps.productsReceived || false,
    optimisticStartDate !== null || steps.routineStartDateSet || false,
  );

  // Render booking button
  let bookingButton = null;
  if (!steps.hasCompletedBooking) {
    bookingButton = (
      <Button className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto mt-6">
        Schedule Now
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    );
  }

  // Render skin test content (no dependencies - fully independent)
  const skinTestContent = (
    <>
      {optimisticSkinTest.completed ? (
        <div className="space-y-6 mt-6">
          <button
            onClick={() => setShowSkinTestModal(true)}
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium transition-colors"
          >
            <span className="text-sm">📋</span>
            <span className="text-sm underline">How to do a skin test</span>
          </button>
          <div className="p-4 bg-skinbestie-success border border-gray-300 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-600">Your skin type:</p>
              <p className="text-lg font-semibold text-gray-900 capitalize">
                {optimisticSkinTest.skinType}
              </p>
            </div>
            <Button
              onClick={() => setShowSelectSkinTypeModal(true)}
              className="bg-skinbestie-primary hover:bg-skinbestie-primary/90 text-white w-full sm:w-auto"
            >
              Change skin type
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6 mt-6">
          <button
            onClick={() => setShowSkinTestModal(true)}
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium transition-colors"
          >
            <span className="text-sm">📋</span>
            <span className="text-sm underline">How to do a skin test</span>
          </button>
          <Button
            onClick={() => setShowSelectSkinTypeModal(true)}
            className="bg-skinbestie-primary hover:bg-skinbestie-primary/90 text-white w-full sm:w-auto"
          >
            Select Your Skin Type
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </>
  );

  // Render goals content
  let goalsContent;
  const goalsPublishedAndAcknowledged =
    steps.hasPublishedGoals && dashboard.goalsAcknowledgedByClient;
  const goalsPublishedOnly =
    steps.hasPublishedGoals && !dashboard.goalsAcknowledgedByClient;

  if (goalsPublishedAndAcknowledged || goalsPublishedOnly) {
    goalsContent = (
      <Button
        onClick={() => setShowReviewGoalsModal(true)}
        className="bg-skinbestie-primary hover:bg-skinbestie-primary/90 text-white w-full sm:w-auto mt-6"
      >
        Review Your Goals
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    );
  } else {
    goalsContent = (
      <p className="text-sm text-gray-600 flex items-center gap-2 mt-6">
        <span>⏳</span>
        <span>Your coach is setting up your personalised goals</span>
      </p>
    );
  }

  // Render routine content
  let routineContent;
  if (steps.hasPublishedRoutine) {
    routineContent = (
      <Button
        onClick={() => setShowViewRoutineModal(true)}
        className="bg-skinbestie-primary hover:bg-skinbestie-primary/90 text-white w-full sm:w-auto mt-6"
      >
        View Routine
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    );
  } else {
    routineContent = (
      <p className="text-sm text-gray-600 flex items-center gap-2 mt-6">
        <span>⏳</span>
        <span>Your coach is preparing your custom routine</span>
      </p>
    );
  }

  return (
    <section>
      <Card className="border-none gap-2">
        <CardHeader>
          <CardTitle className="text-xl">Essential Setup Steps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Booking */}
          <StepCard
            status={bookingStatus}
            stepNumber={1}
            title="Book Your Coaching Call"
            description="A calm, friendly 50-minute video chat where we get to know you: lifestyle, skin history, current routine, and goals. Together we'll map a simple, personalised routine that fits your life."
            variant={bookingVariant}
          >
            {bookingButton}
          </StepCard>

          {/* Step 2: Skin Test */}
          <StepCard
            stepNumber={2}
            status={skinTestStatus}
            title="Take a Skin Test"
            description="Complete our 3-step skin type assessment to identify your unique skin needs & characteristics."
            variant={skinTestVariant}
          >
            {skinTestContent}
          </StepCard>

          {/* Step 3: Goals */}
          <StepCard
            stepNumber={3}
            status={goalsStatus}
            title="Set Your Skin Goals"
            description="Create SMART goals based on your coaching call to guide your skincare journey."
            variant={goalsVariant}
            onRefresh={
              goalsStatus === "waiting" ? handleRefreshGoals : undefined
            }
            isRefreshing={isRefreshingGoals}
          >
            {goalsContent}
          </StepCard>

          {/* Step 4: Routine */}
          <StepCard
            stepNumber={4}
            status={routineStatus}
            title="Get Your Custom Routine"
            description="Receive your personalised morning and evening skincare routine with product recommendations."
            variant={routineVariant}
            onRefresh={
              routineStatus === "waiting" ? handleRefreshRoutine : undefined
            }
            isRefreshing={isRefreshingRoutine}
          >
            {routineContent}
          </StepCard>

          {/* Step 5: Purchase Products - Only show if routine is published */}
          {steps.hasPublishedRoutine && (
            <StepCard
              stepNumber={5}
              status={productsStatus}
              title="Purchase Your Products"
              description="Get the recommended products from your routine and confirm when they arrive to start your skincare journey."
              variant={productsVariant}
            >
              {optimisticProductsReceived || steps.productsReceived ? (
                <div className="space-y-4 mt-6">
                  {optimisticStartDate || steps.routineStartDateSet ? (
                    <>
                      <Button
                        onClick={() => setShowChangeStartDateModal(true)}
                        className="bg-skinbestie-primary hover:bg-skinbestie-primary/90 text-white w-full sm:w-auto"
                      >
                        Change Start Date
                      </Button>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🎉</span>
                        <p className="text-sm text-gray-700">
                          Your routine starts on{" "}
                          <span className="font-semibold">
                            {optimisticStartDate
                              ? optimisticStartDate.toLocaleDateString(
                                  "en-US",
                                  {
                                    weekday: "long",
                                    month: "long",
                                    day: "numeric",
                                  },
                                )
                              : dashboard.routine?.startDate
                                ? new Date(
                                    dashboard.routine.startDate,
                                  ).toLocaleDateString("en-US", {
                                    weekday: "long",
                                    month: "long",
                                    day: "numeric",
                                  })
                                : "Soon"}
                          </span>
                        </p>
                      </div>
                    </>
                  ) : (
                    <Button
                      onClick={() => setShowChangeStartDateModal(true)}
                      className="bg-skinbestie-primary hover:bg-skinbestie-primary/90 text-white w-full sm:w-auto"
                    >
                      Set Your Start Date
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              ) : (
                <Button
                  onClick={() => setShowProductsPurchasedModal(true)}
                  className="bg-skinbestie-primary hover:bg-skinbestie-primary/90 text-white w-full sm:w-auto mt-6"
                >
                  Confirm Products Received
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </StepCard>
          )}

          {/* What Happens Next */}
          <div className="mt-2">
            <WhatHappensNextCard
              description="Your coach is reviewing your progress and will be in touch soon. Keep up the great work!"
              coachName="Benji"
            />
          </div>
        </CardContent>
      </Card>

      {/* Preferred Name Modal */}
      <PreferredNameModal
        open={showPreferredNameModal}
        onOpenChange={handlePreferredNameModalChange}
        fullName={`${dashboard.user.firstName} ${dashboard.user.lastName}`}
        firstName={dashboard.user.firstName}
        onSave={handleSavePreferredName}
      />

      {/* Skin Test Instructions Modal */}
      <SkinTestModal
        open={showSkinTestModal}
        onOpenChange={setShowSkinTestModal}
      />

      {/* Select Skin Type Modal */}
      <SelectSkinTypeModal
        open={showSelectSkinTypeModal}
        onOpenChange={setShowSelectSkinTypeModal}
        onSave={handleSaveSkinType}
        currentSkinType={optimisticSkinTest.skinType || undefined}
      />

      {/* Review Goals Modal */}
      <ReviewGoalsModal
        open={showReviewGoalsModal}
        onOpenChange={setShowReviewGoalsModal}
        initialGoals={dashboard.goals || []}
      />

      {/* View Routine Modal */}
      <ViewRoutineModal
        open={showViewRoutineModal}
        onOpenChange={setShowViewRoutineModal}
        routine={dashboard.routine || undefined}
      />

      {/* Products Purchased Modal */}
      <ProductsPurchasedModal
        key={showProductsPurchasedModal ? "open" : "closed"}
        open={showProductsPurchasedModal}
        onOpenChange={setShowProductsPurchasedModal}
        onConfirmProductsReceived={async () => {
          const result = await confirmProductsReceived();

          if (!result.success) {
            toast.error("Failed to confirm products received", {
              description: result.error.message + ". Please try again.",
            });
            throw new Error(result.error.message);
          }

          toast.success("Products confirmed!");

          // Invalidate dashboard query to refetch fresh data from backend
          queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        }}
        onConfirm={async (startDate: Date) => {
          // Check if routine exists
          if (!dashboard.routine?.id) {
            toast.error("Unable to set start date", {
              description: "No routine found. Please contact support.",
            });
            return false;
          }

          // Optimistically update start date
          setOptimisticStartDate(startDate);

          const result = await updateRoutineStartDate(
            dashboard.routine.id,
            startDate,
          );

          if (!result.success) {
            // Revert optimistic update on error
            setOptimisticStartDate(null);

            toast.error("Failed to set start date", {
              description: result.error.message + ". Please try again.",
            });
            return false;
          }

          toast.success("Start date set!", {
            description:
              "Your routine will start on " +
              startDate.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              }),
          });

          // Invalidate dashboard query to refetch fresh data in background
          queryClient.invalidateQueries({ queryKey: ["dashboard"] });
          return true;
        }}
      />

      {/* Change Start Date Modal */}
      <ChangeStartDateModal
        open={showChangeStartDateModal}
        onOpenChange={setShowChangeStartDateModal}
        currentStartDate={
          optimisticStartDate ||
          (dashboard.routine?.startDate
            ? new Date(dashboard.routine.startDate)
            : undefined)
        }
        onConfirm={async (startDate: Date) => {
          // Check if routine exists
          if (!dashboard.routine?.id) {
            toast.error("Unable to update start date", {
              description: "No routine found. Please contact support.",
            });
            return false;
          }

          // Optimistically update UI immediately
          setOptimisticStartDate(startDate);

          const result = await updateRoutineStartDate(
            dashboard.routine.id,
            startDate,
          );

          if (!result.success) {
            // Revert optimistic update on error
            setOptimisticStartDate(
              dashboard.routine?.startDate
                ? new Date(dashboard.routine.startDate)
                : null,
            );

            toast.error("Failed to update start date", {
              description: result.error.message + ". Please try again.",
            });
            return false;
          }

          toast.success("Start date updated!", {
            description:
              "Your routine will now start on " +
              startDate.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              }),
          });

          // Invalidate dashboard query to refetch fresh data in background
          queryClient.invalidateQueries({ queryKey: ["dashboard"] });
          return true;
        }}
      />
    </section>
  );
}
