import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { NoteListItem } from "./note.types";

interface NoteListItemProps {
  note: NoteListItem;
  isActive?: boolean;
}

export function NoteListItemComponent({
  note,
  isActive = false,
}: NoteListItemProps) {
  return (
    <div
      className={cn(
        "cursor-pointer p-4 rounded-lg transition-all",
        isActive ? "bg-skinbestie-primary-light" : "bg-white hover:bg-gray-50",
      )}
    >
      <div className="space-y-2.5">
        {/* Date */}
        <p className="text-xs text-gray-500 uppercase font-medium tracking-wide">
          {format(new Date(note.date), "d MMM").toUpperCase()}
        </p>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 text-lg line-clamp-1">
          {note.title}
        </h3>

        {/* Preview */}
        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
          {note.preview}
        </p>
      </div>
    </div>
  );
}
