"use client";

import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";

interface KeyHighlightsProps {
  profileTags: string[] | null;
}

export function KeyHighlights({ profileTags }: KeyHighlightsProps) {
  // Don't render if no tags exist
  if (!profileTags || profileTags.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-skinbestie-primary" />
            <h2 className="text-lg font-semibold text-gray-900">About You</h2>
          </div>
          <p className="text-sm text-gray-600">
            Details from your conversations with coach Benji.
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {profileTags.map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-skinbestie-primary/10 text-skinbestie-primary hover:bg-skinbestie-primary/20 px-3 py-1.5 text-sm font-medium"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Privacy Blurb */}
        <p className="text-xs text-gray-500 pt-2">
          Only you and your coach can see these details
        </p>
      </div>
    </div>
  );
}
