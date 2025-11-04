"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { NoteListItem } from "../shared/notes";
import { createNoteAction } from "../shared/notes/note-actions";
import type { Note, NoteListItemData } from "../shared/notes";

interface JournalSidebarProps {
  notes: Note[];
  activeNoteId?: string;
}

export function JournalSidebar({ notes, activeNoteId }: JournalSidebarProps) {
  const router = useRouter();

  // Convert Note to NoteListItem format
  const noteListItems: NoteListItemData[] = notes.map((note) => ({
    id: note.id,
    title: note.title,
    preview: note.content.substring(0, 100),
    date: note.createdAt,
    tags: note.tags,
  }));

  const handleCreateNote = async () => {
    const result = await createNoteAction({
      title: "Untitled Journal Entry",
      content: "",
      tags: [],
    });

    if (result.success) {
      toast.success("Journal entry created");
      router.push(`/journal/${result.data.id}`);
      router.refresh();
    } else {
      toast.error(result.error.message);
    }
  };

  return (
    <aside className="flex-shrink-0 w-full md:w-80 lg:w-96 border-r border-gray-200 bg-white flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-8 border-b border-gray-200">
        <Link href="/journal">
          <h1 className="text-xl font-bold text-gray-900 cursor-pointer hover:text-skinbestie-primary transition-colors">
            🪴 My Journal
          </h1>
        </Link>
      </div>

      {/* Add new note button */}
      <div className="px-6 py-4">
        <Button
          onClick={handleCreateNote}
          variant="ghost"
          className="w-full justify-start gap-3 h-auto py-3 bg-white text-skinbestie-primary hover:bg-gray-50 border border-gray-200 rounded-lg"
        >
          <Plus className="h-5 w-5" />
          <span className="font-medium">Add new journal entry</span>
        </Button>
      </div>

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto px-6 py-2 space-y-2">
        {noteListItems.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">
            No journal entries yet
          </p>
        ) : (
          noteListItems.map((note) => (
            <Link key={note.id} href={`/journal/${note.id}`}>
              <NoteListItem note={note} isActive={note.id === activeNoteId} />
            </Link>
          ))
        )}
      </div>
    </aside>
  );
}
