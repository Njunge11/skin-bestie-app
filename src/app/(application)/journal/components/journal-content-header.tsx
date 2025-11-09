"use client";

import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ChevronDown, Trash2, ChevronLeft } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

interface JournalContentHeaderProps {
  title: string;
  lastModified: string;
  isPublic: boolean;
  onTitleChange: (title: string) => void;
  onPublicChange: (isPublic: boolean) => void;
  onDelete: () => void;
}

export function JournalContentHeader({
  title,
  lastModified,
  isPublic,
  onTitleChange,
  onPublicChange,
  onDelete,
}: JournalContentHeaderProps) {
  const [titleValue, setTitleValue] = useState(title);
  const [isPublicValue, setIsPublicValue] = useState(isPublic);
  const titleRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea as user types
  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = "auto";
      titleRef.current.style.height = titleRef.current.scrollHeight + "px";
    }
  }, [titleValue]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newTitle = e.target.value;
    setTitleValue(newTitle);
    onTitleChange(newTitle);
  };

  return (
    <div className="shrink-0 border-b border-gray-200 bg-white">
      <div className="w-full py-6 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-4xl">
          <div className="space-y-4">
            {/* Breadcrumb and Actions Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-500">
                {/* Back button - visible on mobile only */}
                <Link href="/journal" className="md:hidden mr-2">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                </Link>

                {/* Breadcrumb - hidden on mobile */}
                <div className="hidden md:flex items-center">
                  <span>My Journal</span>
                  <ChevronDown className="mx-1 h-4 w-4 rotate-[-90deg]" />
                  <span className="text-gray-900">{title || "Untitled"}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Public/Private Switch */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">
                    {isPublicValue ? "Shared with Coach" : "Private"}
                  </span>
                  <Switch
                    checked={isPublicValue}
                    onCheckedChange={(checked) => {
                      setIsPublicValue(checked);
                      onPublicChange(checked);
                    }}
                    className="data-[state=checked]:bg-skinbestie-primary"
                  />
                </div>

                {/* Delete Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onDelete}
                  className="text-gray-400 hover:text-red-600"
                  aria-label="Delete journal entry"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Title Row */}
            <div>
              <textarea
                ref={titleRef}
                value={titleValue}
                onChange={handleTitleChange}
                placeholder="Untitled Journal Entry"
                className="w-full text-2xl font-bold text-gray-900 leading-tight border-none outline-none resize-none overflow-hidden bg-transparent focus:ring-0 p-0 placeholder:text-gray-400"
                rows={1}
              />
            </div>

            {/* Metadata Row */}
            <div className="flex items-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Last Modified</span>
                <span className="font-medium text-gray-900">
                  {format(new Date(lastModified), "d MMMM yyyy, HH:mm a")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
