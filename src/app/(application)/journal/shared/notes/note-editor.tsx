"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ChevronDown, MoreHorizontal, Trash2 } from "lucide-react";
import { format } from "date-fns";
import dynamic from "next/dynamic";
import type { Note } from "./note.types";

const LexicalEditor = dynamic(() => import("@/components/lexical-editor"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

interface NoteEditorProps {
  note: Note;
}

export function NoteEditor({ note }: NoteEditorProps) {
  const [isPublic, setIsPublic] = useState(false);

  const handleDelete = () => {
    // TODO: Implement delete functionality
    console.log("Delete note");
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-y-auto">
      <div className="mx-auto w-full max-w-4xl">
        {/* Header with metadata */}
        <div className="border-b border-gray-200 py-6 px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {/* Breadcrumb and Menu */}
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-500">
                <span>My Journal</span>
                <ChevronDown className="mx-1 h-4 w-4 rotate-[-90deg]" />
                <span className="text-gray-900">
                  {note.title || "Untitled"}
                </span>
              </div>
              <Button variant="ghost" size="icon" className="text-gray-400">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>

            {/* Title and Actions Row */}
            <div className="flex items-start justify-between gap-4">
              <h1 className="flex-1 text-2xl font-bold text-gray-900 leading-tight">
                {note.title}
              </h1>

              <div className="flex items-center gap-4">
                {/* Public/Private Switch */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">
                    {isPublic ? "Shared with Coach" : "Private"}
                  </span>
                  <Switch
                    checked={isPublic}
                    onCheckedChange={setIsPublic}
                    className="data-[state=checked]:bg-skinbestie-primary"
                  />
                </div>

                {/* Delete Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDelete}
                  className="text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Metadata Row */}
            <div className="flex items-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Last Modified</span>
                <span className="font-medium text-gray-900">
                  {format(new Date(note.lastModified), "d MMMM yyyy, HH:mm a")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content editor */}
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <LexicalEditor
            placeholder="Start writing your journal entry..."
            initialContent={note.content}
          />
        </div>
      </div>
    </div>
  );
}
