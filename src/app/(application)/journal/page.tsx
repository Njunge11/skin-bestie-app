import { fetchNotesAction } from "./shared/notes/note-actions";
import { JournalSidebar } from "./components/journal-sidebar";

export default async function JournalPage() {
  const result = await fetchNotesAction();
  const notes = result.success ? result.data : [];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <JournalSidebar notes={notes} />

      <main className="flex-1 overflow-hidden bg-white">
        <div className="flex h-full items-center justify-center text-gray-400">
          <div className="text-center">
            <p className="text-lg">Select a journal entry to view</p>
            <p className="text-sm mt-2">
              Click any entry on the left to read more
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
