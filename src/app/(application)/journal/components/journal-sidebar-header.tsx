"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface JournalSidebarHeaderProps {
  title: string;
  titleEmoji?: string;
  titleHref?: string;
  buttonText: string;
  onButtonClick: () => void;
}

export function JournalSidebarHeader({
  title,
  titleEmoji,
  titleHref = "#",
  buttonText,
  onButtonClick,
}: JournalSidebarHeaderProps) {
  return (
    <div className="shrink-0 bg-white border-b border-gray-200">
      {/* Header */}
      <div className="px-6 py-8">
        <Link href={titleHref}>
          <h1 className="text-xl font-bold text-gray-900 cursor-pointer hover:text-skinbestie-primary transition-colors">
            {titleEmoji && <span>{titleEmoji} </span>}
            {title}
          </h1>
        </Link>
      </div>

      {/* Add new button */}
      <div className="px-6 pb-4">
        <Button
          onClick={onButtonClick}
          variant="ghost"
          className="w-full justify-start gap-3 h-auto py-3 bg-white text-skinbestie-primary hover:bg-gray-50 border border-gray-200 rounded-lg"
        >
          <Plus className="h-5 w-5" />
          <span className="font-medium">{buttonText}</span>
        </Button>
      </div>
    </div>
  );
}
