import { notFound } from "next/navigation";
import {
  fetchNoteAction,
  fetchNotesAction,
} from "../shared/notes/note-actions";
import { NoteEditor } from "../shared/notes/note-editor";
import { JournalSidebar } from "../components/journal-sidebar";

interface JournalEntryPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function JournalEntryPage({
  params,
}: JournalEntryPageProps) {
  const { id } = await params;

  const [noteResult, notesResult] = await Promise.all([
    fetchNoteAction(id),
    fetchNotesAction(),
  ]);

  if (!noteResult.success) {
    notFound();
  }

  const notes = notesResult.success ? notesResult.data : [];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <JournalSidebar notes={notes} activeNoteId={id} />

      <main className="flex-1 overflow-hidden bg-white">
        <NoteEditor note={noteResult.data} />
      </main>
    </div>
  );
}
