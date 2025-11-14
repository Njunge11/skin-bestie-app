"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { DashboardResponse } from "../../dashboard/schemas";
import { ShareFeedback } from "../feedback/";
import { getCoachWhatsAppUrl } from "../../actions/whatsapp-actions";
import { toast } from "sonner";

interface SupportFeedbackProps {
  dashboard: DashboardResponse;
}

export function SupportFeedback({ dashboard }: SupportFeedbackProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Mock coach data
  const coach = {
    name: "Benji",
    title: "Certified Skincare Coach",
    profilePicture:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces",
    clientCount: 150,
    yearsExperience: 5,
    specialties: ["Acne Treatment", "Skin Rehabilitation"],
    bio: "I'm your skincare-obsessed, evidence-led skin bestie. I'm here to make skincare feel simple so you can stop guessing, feel good about the products you're using, and feel genuinely confident in your skin.",
  };

  const handleMessageCoach = async () => {
    setIsLoading(true);

    try {
      const result = await getCoachWhatsAppUrl();

      if (result.success) {
        // Use window.location.href for better iOS PWA compatibility
        window.location.href = result.url;
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Failed to open WhatsApp. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Coach Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-900">
          Your SkinBestie Coach
        </h2>

        {/* Coach Card */}
        <div className="rounded-lg p-6 bg-skinbestie-primary-light">
          <div className="flex flex-col md:flex-row items-start gap-4">
            <div className="flex items-start gap-4 flex-1 w-full">
              {/* Avatar */}
              <Avatar className="w-16 h-16 flex-shrink-0">
                <AvatarImage
                  src={coach.profilePicture || undefined}
                  alt={coach.name}
                />
                <AvatarFallback className="bg-skinbestie-primary text-white text-xl">
                  {coach.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              {/* Coach Info */}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">
                  {coach.name}
                </h3>
                <p className="text-gray-600">{coach.title}</p>
              </div>
            </div>

            {/* Message Button - Hidden on mobile, shown on desktop */}
            <Button
              onClick={handleMessageCoach}
              disabled={isLoading}
              className="hidden md:flex bg-skinbestie-primary hover:bg-skinbestie-primary/90 text-white flex-shrink-0"
            >
              {isLoading ? "Opening..." : "Message Benji"}
            </Button>
          </div>

          {/* About */}
          <div className="mt-6">
            <p className="text-gray-700 leading-relaxed">{coach.bio}</p>
          </div>

          {/* Message Button - Full width on mobile, hidden on desktop */}
          <Button
            onClick={handleMessageCoach}
            disabled={isLoading}
            className="md:hidden w-full mt-4 bg-skinbestie-primary hover:bg-skinbestie-primary/90 text-white"
          >
            {isLoading ? "Opening..." : "Message Benji"}
          </Button>
        </div>
      </div>

      {/* Share Feedback Section - Only show if enabled */}
      {dashboard.user.feedbackSurveyVisible && (
        <ShareFeedback userProfileId={dashboard.user.userProfileId} />
      )}
    </div>
  );
}
