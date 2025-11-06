"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, Droplets } from "lucide-react";
import { type DashboardResponse } from "../../dashboard/schemas";

interface ProfileDetailsProps {
  dashboard: DashboardResponse;
}

export function ProfileDetails({ dashboard }: ProfileDetailsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = dashboard;

  // Calculate age from dateOfBirth
  const calculateAge = (dateOfBirth: string): number => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const age = user.dateOfBirth ? calculateAge(user.dateOfBirth) : null;

  // Get skin type
  const skinType =
    user.skinType && user.skinType.length > 0
      ? user.skinType[0].charAt(0).toUpperCase() + user.skinType[0].slice(1)
      : "Not set";

  // Get skin concerns as array
  const skinConcerns =
    user.concerns && user.concerns.length > 0 ? user.concerns : [];

  return (
    <Card className="bg-white">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left">
          <div className="flex items-center gap-3">
            <Droplets className="h-6 w-6 text-skinbestie-primary" />
            <span className="text-lg font-semibold text-gray-900">
              Skin Profile
            </span>
          </div>
          <ChevronDown
            className={`h-5 w-5 text-gray-600 transition-transform duration-200 flex-shrink-0 ${
              isOpen ? "transform rotate-180" : ""
            }`}
          />
        </CollapsibleTrigger>

        <CollapsibleContent className="px-6 pb-6 space-y-3">
          {/* Age */}
          {age !== null && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Age</span>
              <span className="text-sm text-gray-600 font-bold">{age}</span>
            </div>
          )}

          {/* Skin Type */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Skin Type</span>
            <span className="text-sm text-gray-600 font-bold">{skinType}</span>
          </div>

          {/* Skin Concerns */}
          <div className="flex items-start justify-between">
            <span className="text-sm text-gray-600">Skin Concerns</span>
            {skinConcerns.length > 0 ? (
              <span className="text-sm text-gray-600 font-bold text-right">
                {skinConcerns.join(", ")}
              </span>
            ) : (
              <span className="text-sm text-gray-600 font-bold">Not set</span>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
