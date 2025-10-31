"use client";

import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  StepCard,
  SkinTestModal,
  SelectSkinTypeModal,
  WhatHappensNextCard,
  ViewRoutineModal,
} from "./";
import { PreferredNameModal } from "./preferred-name-modal";
import { ReviewGoalsModal } from "@/features/goals";
import {
  updateNickname,
  updateSkinTest,
  fetchDashboardAction,
} from "../actions";

// Extended dashboard type with additional properties
type DashboardData = Awaited<ReturnType<typeof fetchDashboardAction>> & {
  user: {
    nickname: string | null;
  };
  goalsAcknowledgedByClient?: boolean;
  goals?: Array<{
    id: string;
    goal: string;
    status: string;
  }>;
  todayRoutine?: {
    morning?: Array<{ name: string; order: number }>;
    evening?: Array<{ name: string; order: number }>;
  };
};

interface DashboardContentProps {
  dashboard: DashboardData;
  setOptimisticNickname: (nickname: string) => void;
  optimisticSkinTest: { completed: boolean; skinType: string | null };
  setOptimisticSkinTest: (update: {
    completed: boolean;
    skinType: string | null;
  }) => void;
}

export function DashboardContent({
  dashboard,
  setOptimisticNickname,
  optimisticSkinTest,
  setOptimisticSkinTest,
}: DashboardContentProps) {
  const queryClient = useQueryClient();
  const [showSkinTestModal, setShowSkinTestModal] = useState(false);
  const [showSelectSkinTypeModal, setShowSelectSkinTypeModal] = useState(false);
  const [showPreferredNameModal, setShowPreferredNameModal] = useState(false);
  const [showReviewGoalsModal, setShowReviewGoalsModal] = useState(false);
  const [showViewRoutineModal, setShowViewRoutineModal] = useState(false);

  // Show preferred name modal on mount if nickname is null
  useEffect(() => {
    if (dashboard.user.nickname === null) {
      setShowPreferredNameModal(true);
    }
  }, [dashboard.user]);

  const handleSaveSkinType = async (skinType: string) => {
    // Capitalize first letter for display
    const capitalizedSkinType =
      skinType.charAt(0).toUpperCase() + skinType.slice(1);

    // Optimistically update the UI
    setOptimisticSkinTest({ completed: true, skinType: capitalizedSkinType });

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
    // Optimistically update the UI
    setOptimisticNickname(preferredName);

    // Call the Server Action
    const result = await updateNickname(preferredName);

    if (!result.success) {
      toast.error("Failed to save preferred name", {
        description: result.error.message,
      });
    } else {
      // Invalidate dashboard query to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    }
  };

  const handleCancelPreferredName = async () => {
    // Use firstName as default nickname
    setOptimisticNickname(dashboard.user.firstName);

    // Call the Server Action with firstName
    const result = await updateNickname(dashboard.user.firstName);

    if (!result.success) {
      toast.error("Failed to set default name", {
        description: result.error.message,
      });
    } else {
      // Invalidate dashboard query to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    }
  };

  return (
    <section>
      <Card className="border-none gap-2">
        <CardHeader>
          <CardTitle className="text-xl">Essential Setup Steps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Booking */}
          <StepCard
            status={
              dashboard.setupProgress.steps.hasCompletedBooking
                ? "completed"
                : "pending"
            }
            stepNumber={1}
            title="Book Your Consultation"
            description="A calm, friendly 50-minute video chat where we get to know you: lifestyle, skin history, current routine, and goals. Together we'll map a simple, personalised routine that fits your life."
            variant={
              dashboard.setupProgress.steps.hasCompletedBooking
                ? "success"
                : "default"
            }
          >
            {dashboard.setupProgress.steps.hasCompletedBooking ? null : (
              <Button className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto mt-6">
                Schedule Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </StepCard>

          {/* Step 2: Skin Test */}
          <StepCard
            stepNumber={2}
            status={
              optimisticSkinTest.completed
                ? "completed"
                : dashboard.setupProgress.steps.hasCompletedBooking
                  ? "pending"
                  : "waiting"
            }
            title="Take a Skin Test"
            description="Complete our 3-step skin type assessment to identify your unique skin needs & characteristics."
            variant={optimisticSkinTest.completed ? "success" : "muted"}
          >
            {optimisticSkinTest.completed ? (
              <div className="space-y-6 mt-6">
                {/* Instructions CTA */}
                <button
                  onClick={() => setShowSkinTestModal(true)}
                  className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium transition-colors"
                >
                  <span className="text-sm">📋</span>
                  <span className="text-sm underline">
                    How to do a skin test
                  </span>
                </button>

                {/* Selected Skin Type Display */}
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
            ) : dashboard.setupProgress.steps.hasCompletedBooking ? (
              <div className="space-y-6 mt-6">
                {/* Instructions CTA */}
                <button
                  onClick={() => setShowSkinTestModal(true)}
                  className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium transition-colors"
                >
                  <span className="text-sm">📋</span>
                  <span className="text-sm underline">
                    How to do a skin test
                  </span>
                </button>

                {/* Skin Type Selection */}
                <Button
                  onClick={() => setShowSelectSkinTypeModal(true)}
                  className="bg-skinbestie-primary hover:bg-skinbestie-primary/90 text-white w-full sm:w-auto"
                >
                  Select Your Skin Type
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            ) : (
              <p className="text-sm text-gray-500 mt-6">
                Complete your booking first
              </p>
            )}
          </StepCard>

          {/* Step 3: Goals */}
          <StepCard
            stepNumber={3}
            status={
              dashboard.setupProgress.steps.hasPublishedGoals &&
              dashboard.goalsAcknowledgedByClient
                ? "completed"
                : dashboard.setupProgress.steps.hasPublishedGoals &&
                    !dashboard.goalsAcknowledgedByClient
                  ? "pending"
                  : "waiting"
            }
            title="Set Your Skin Goals"
            description="Create SMART goals based on your consultation to guide your skincare journey."
            variant={
              dashboard.setupProgress.steps.hasPublishedGoals &&
              dashboard.goalsAcknowledgedByClient
                ? "success"
                : dashboard.setupProgress.steps.hasPublishedGoals &&
                    !dashboard.goalsAcknowledgedByClient
                  ? "default"
                  : "muted"
            }
          >
            {dashboard.setupProgress.steps.hasPublishedGoals &&
            dashboard.goalsAcknowledgedByClient ? (
              <Button
                onClick={() => setShowReviewGoalsModal(true)}
                className="bg-skinbestie-primary hover:bg-skinbestie-primary/90 text-white w-full sm:w-auto mt-6"
              >
                Review Your Goals
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : dashboard.setupProgress.steps.hasPublishedGoals ? (
              <Button
                onClick={() => setShowReviewGoalsModal(true)}
                className="bg-skinbestie-primary hover:bg-skinbestie-primary/90 text-white w-full sm:w-auto mt-6"
              >
                Review Your Goals
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <p className="text-sm text-gray-600 flex items-center gap-2 mt-6">
                <span>⏳</span>
                <span>Your coach is setting up your personalized goals</span>
              </p>
            )}
          </StepCard>

          {/* Step 4: Routine */}
          <StepCard
            stepNumber={4}
            status={
              dashboard.setupProgress.steps.hasPublishedRoutine
                ? "completed"
                : "waiting"
            }
            title="Get Your Custom Routine"
            description="Receive your personalized morning and evening skincare routine with product recommendations."
            variant={
              dashboard.setupProgress.steps.hasPublishedRoutine
                ? "success"
                : "muted"
            }
          >
            {dashboard.setupProgress.steps.hasPublishedRoutine ? (
              <Button
                onClick={() => setShowViewRoutineModal(true)}
                className="bg-skinbestie-primary hover:bg-skinbestie-primary/90 text-white w-full sm:w-auto mt-6"
              >
                View Routine
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <p className="text-sm text-gray-600 flex items-center gap-2 mt-6">
                <span>⏳</span>
                <span>Your coach is preparing your custom routine</span>
              </p>
            )}
          </StepCard>

          {/* What Happens Next */}
          <div className="mt-2">
            <WhatHappensNextCard
              description="Your coach is reviewing your progress and will be in touch soon. Keep up the great work!"
              coachName="Coach"
            />
          </div>
        </CardContent>
      </Card>

      {/* Preferred Name Modal */}
      <PreferredNameModal
        open={showPreferredNameModal}
        onOpenChange={setShowPreferredNameModal}
        fullName={`${dashboard.user.firstName} ${dashboard.user.lastName}`}
        firstName={dashboard.user.firstName}
        onSave={handleSavePreferredName}
        onCancel={handleCancelPreferredName}
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
        todayRoutine={dashboard.todayRoutine}
      />
    </section>
  );
}
