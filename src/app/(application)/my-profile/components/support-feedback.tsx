"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { DashboardResponse } from "../../dashboard/schemas";
import { ShareFeedback } from "./share-feedback";

interface SupportFeedbackProps {
  dashboard: DashboardResponse;
}

export function SupportFeedback({}: SupportFeedbackProps) {
  // Mock coach data
  const coach = {
    name: "Benji",
    title: "Certified Skincare Specialist",
    profilePicture:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces",
    clientCount: 150,
    yearsExperience: 5,
    specialties: ["Acne Treatment", "Skin Rehabilitation"],
    bio: "Certified level 3 skin care coach",
  };

  return (
    <div className="space-y-8">
      {/* Coach Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-900">
          Your Skinbestie Coach
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
                  Coach {coach.name}
                </h3>
                <p className="text-gray-600">{coach.title}</p>
              </div>
            </div>

            {/* Message Button - Hidden on mobile, shown on desktop */}
            <Button className="hidden md:flex bg-skinbestie-primary hover:bg-skinbestie-primary/90 text-white flex-shrink-0">
              Message Benji
            </Button>
          </div>

          {/* About */}
          <div className="mt-6">
            <p className="text-gray-700 leading-relaxed">
              Your dedicated skincare coach who will guide you through your
              personalized routine, answer your questions, and help you achieve
              your skincare goals.
            </p>
          </div>

          {/* Message Button - Full width on mobile, hidden on desktop */}
          <Button className="md:hidden w-full mt-4 bg-skinbestie-primary hover:bg-skinbestie-primary/90 text-white">
            Message Benji
          </Button>
        </div>
      </div>

      {/* Share Feedback Section */}
      <ShareFeedback />
    </div>
  );
}
