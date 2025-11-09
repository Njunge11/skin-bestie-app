"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import { JournalSidebarHeader } from "../components/journal-sidebar-header";
import { JournalContentHeader } from "../components/journal-content-header";
import { JourneyListItem } from "../components/journey-list-item";
import { WYSIWYG } from "../components/wysiwyg";
import { useJournals } from "../hooks/use-journals";
import { useJournal } from "../hooks/use-journal";
import {
  createJournalAction,
  updateJournalAction,
  deleteJournalAction,
} from "../actions/journal-actions";
import { useDrafts } from "../stores/use-drafts";
import { DeleteJournalModal } from "../components/delete-journal-modal";
import { toast } from "sonner";

export default function DocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = React.use(params);
  const { data: journalsData, isLoading: isLoadingJournals } = useJournals();
  const {
    data: journalData,
    error: journalError,
    isLoading: isLoadingJournal,
  } = useJournal(id);

  // Zustand drafts store
  const setDraft = useDrafts((state) => state.setDraft);
  const getDraft = useDrafts((state) => state.getDraft);
  const clearDraft = useDrafts((state) => state.clearDraft);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);

  // Show full skeleton if both queries are loading and no data yet (fresh page load)
  const showFullSkeleton =
    isLoadingJournals && !journalsData && isLoadingJournal && !journalData;

  // Debounced save callbacks
  const saveContent = useDebouncedCallback(
    async (journalId: string, content: string) => {
      await updateJournalAction(journalId, { content });
      queryClient.invalidateQueries({ queryKey: ["journals"] });
      // Don't clear draft - keep as backup since Map resets on dev reload
      // clearDraft(journalId);
    },
    1000,
    { maxWait: 5000 },
  );

  const saveTitle = useDebouncedCallback(
    async (journalId: string, title: string) => {
      await updateJournalAction(journalId, { title });
      queryClient.invalidateQueries({ queryKey: ["journals"] });
    },
    1000,
    { maxWait: 5000 },
  );

  // Callback ref that scrolls to element when it mounts
  const scrollToActiveEntry = React.useCallback(
    (node: HTMLDivElement | null) => {
      if (node) {
        node.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    },
    [],
  );

  const handleAddEntry = async () => {
    const result = await createJournalAction({
      title: "Untitled Journal Entry",
      content: "",
      public: false,
    });

    if (result.success) {
      await queryClient.invalidateQueries({ queryKey: ["journals"] });
      router.push(`/journal/${result.data.id}`);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedEntry) return;

    const result = await deleteJournalAction(selectedEntry.id);

    if (result.success) {
      // Clear the draft for the deleted entry
      clearDraft(selectedEntry.id);
      toast.success("Journal entry deleted successfully");
      setDeleteModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["journals"] });
      // Navigate back to journal list after delete
      router.push("/journal");
    } else {
      toast.error(result.error.message);
    }
  };

  if (journalError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Failed to load journal entry</p>
      </div>
    );
  }

  if (showFullSkeleton) {
    return (
      <div className="h-screen flex overflow-hidden">
        {/* Main Content - Journal UI */}
        <main className="flex-1 flex overflow-hidden">
          {/* Left Panel - Entries */}
          <div className="w-full md:w-96 border-r flex-col overflow-hidden bg-white flex">
            {/* Header with title and add button */}
            <div className="shrink-0 bg-white border-b border-gray-200">
              {/* Header */}
              <div className="px-6 py-8">
                <div className="w-36 h-7 bg-gray-100 rounded animate-pulse" />
              </div>

              {/* Add new button */}
              <div className="px-6 pb-4">
                <div className="w-full h-12 bg-gray-100 rounded-lg animate-pulse" />
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="cursor-pointer p-4 rounded-lg bg-white">
                  <div className="space-y-2.5">
                    {/* Date */}
                    <div className="w-20 h-3 bg-gray-100 rounded animate-pulse" />

                    {/* Title */}
                    <div className="w-3/4 h-6 bg-gray-100 rounded animate-pulse" />

                    {/* Preview */}
                    <div className="space-y-1">
                      <div className="w-full h-3.5 bg-gray-100 rounded animate-pulse" />
                      <div className="w-5/6 h-3.5 bg-gray-100 rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel - Entry Content */}
          <div className="hidden md:flex flex-1 flex-col overflow-hidden bg-white">
            {/* Breadcrumb & Actions Skeleton */}
            <div className="border-b bg-white px-4 md:px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-20 h-4 bg-gray-100 rounded animate-pulse" />
                  <div className="w-4 h-4 bg-gray-100 rounded animate-pulse" />
                  <div className="w-32 h-4 bg-gray-100 rounded animate-pulse" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-4 bg-gray-100 rounded animate-pulse" />
                  <div className="w-10 h-6 bg-gray-100 rounded-full animate-pulse" />
                  <div className="w-8 h-8 bg-gray-100 rounded animate-pulse" />
                </div>
              </div>
            </div>

            {/* Title Skeleton */}
            <div className="px-4 md:px-6 pt-8 pb-4">
              <div className="w-2/3 h-10 bg-gray-100 rounded animate-pulse" />
            </div>

            {/* Last Modified Skeleton */}
            <div className="px-4 md:px-6 pb-4">
              <div className="w-48 h-4 bg-gray-100 rounded animate-pulse" />
            </div>

            {/* Toolbar Skeleton */}
            <div className="border-y bg-white px-4 md:px-6 py-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-100 rounded animate-pulse" />
                <div className="w-8 h-8 bg-gray-100 rounded animate-pulse" />
                <div className="w-8 h-8 bg-gray-100 rounded animate-pulse" />
                <div className="w-8 h-8 bg-gray-100 rounded animate-pulse" />
                <div className="w-8 h-8 bg-gray-100 rounded animate-pulse" />
                <div className="w-px h-6 bg-gray-200 mx-2" />
                <div className="w-10 h-8 bg-gray-100 rounded animate-pulse" />
                <div className="w-10 h-8 bg-gray-100 rounded animate-pulse" />
                <div className="w-10 h-8 bg-gray-100 rounded animate-pulse" />
                <div className="w-px h-6 bg-gray-200 mx-2" />
                <div className="w-8 h-8 bg-gray-100 rounded animate-pulse" />
                <div className="w-8 h-8 bg-gray-100 rounded animate-pulse" />
                <div className="w-8 h-8 bg-gray-100 rounded animate-pulse" />
                <div className="w-8 h-8 bg-gray-100 rounded animate-pulse" />
                <div className="w-8 h-8 bg-gray-100 rounded animate-pulse" />
              </div>
            </div>

            {/* Editor Content Skeleton */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              <div className="mx-auto w-full max-w-4xl">
                <div className="space-y-3 py-4">
                  <div className="w-full h-4 bg-gray-100 rounded animate-pulse" />
                  <div className="w-11/12 h-4 bg-gray-100 rounded animate-pulse" />
                  <div className="w-10/12 h-4 bg-gray-100 rounded animate-pulse" />
                  <div className="w-full h-4 bg-gray-100 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Helper to extract plain text from Lexical JSON
  // Utility function for extracting plain text from Lexical content
  // Currently unused but kept for future use
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const extractPlainText = (content: unknown): string => {
    if (!content) return "";

    // If content is already an object (LexicalJSON)
    if (typeof content === "object" && content !== null) {
      const lexical = content as {
        root?: { children?: { children?: { text?: string }[] }[] };
      };
      if (lexical.root && lexical.root.children) {
        return lexical.root.children
          .map((node) => {
            if (node.children) {
              return node.children.map((child) => child.text || "").join("");
            }
            return "";
          })
          .join(" ")
          .trim();
      }
      return "";
    }

    // If content is a string, try to parse it
    if (typeof content === "string") {
      try {
        const parsed = JSON.parse(content);
        if (parsed.root && parsed.root.children) {
          return parsed.root.children
            .map((node: { children?: { text?: string }[] }) => {
              if (node.children) {
                return node.children.map((child) => child.text || "").join("");
              }
              return "";
            })
            .join(" ")
            .trim();
        }
      } catch {
        // If not JSON, return as-is
        return content;
      }
    }

    return "";
  };

  const journals = journalsData?.success ? journalsData.data : [];

  // Get basic info from list first (for immediate header display)
  const journalFromList = journals.find((j) => j.id === id);

  // Get full content from individual fetch
  const serverEntry = journalData?.success ? journalData.data : null;
  const localDraft = getDraft(id);

  // Use journal from list for header, full data for content
  const selectedEntry =
    serverEntry || journalFromList
      ? {
          ...(serverEntry || journalFromList!),
          content:
            localDraft &&
            localDraft.timestamp >
              new Date((serverEntry || journalFromList!).lastModified).getTime()
              ? localDraft.content
              : serverEntry?.content || journalFromList?.content,
          title:
            localDraft &&
            localDraft.timestamp >
              new Date((serverEntry || journalFromList!).lastModified).getTime()
              ? localDraft.title
              : serverEntry?.title || journalFromList?.title,
        }
      : null;

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Main Content - Journal UI */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Panel - Entries (hidden on mobile when entry selected, always visible on desktop) */}
        <div
          className={`${selectedEntry ? "hidden md:flex" : "flex"} w-full md:w-96 border-r flex-col overflow-hidden bg-white`}
        >
          {/* Header with title and add button */}
          <JournalSidebarHeader
            title="My Journal"
            titleEmoji="🪴"
            titleHref="/journal"
            buttonText="Add new journal entry"
            onButtonClick={handleAddEntry}
          />

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
            {journals.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">
                No journal entries yet
              </p>
            ) : (
              journals.map((journal) => (
                <Link key={journal.id} href={`/journal/${journal.id}`}>
                  <div
                    ref={
                      journal.id === selectedEntry?.id
                        ? scrollToActiveEntry
                        : null
                    }
                  >
                    <JourneyListItem
                      journey={{
                        id: journal.id,
                        title: journal.title,
                        preview: journal.preview,
                        date: journal.createdAt,
                      }}
                      isActive={journal.id === selectedEntry?.id}
                    />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Right Panel - Content (hidden on mobile unless entry selected) */}
        <div
          className={`${selectedEntry ? "flex" : "hidden md:flex"} flex-1 flex-col overflow-hidden bg-white`}
        >
          {selectedEntry ? (
            <>
              <JournalContentHeader
                title={selectedEntry.title || ""}
                lastModified={selectedEntry.lastModified}
                isPublic={false}
                onTitleChange={(newTitle) => {
                  // Save to local draft immediately
                  const contentStr =
                    typeof selectedEntry.content === "object"
                      ? JSON.stringify(selectedEntry.content)
                      : selectedEntry.content || "";
                  setDraft(selectedEntry.id, contentStr, newTitle);
                  // Save to server (debounced)
                  saveTitle(selectedEntry.id, newTitle);
                }}
                onPublicChange={async (isPublic) => {
                  await updateJournalAction(selectedEntry.id, {
                    public: isPublic,
                  });
                  queryClient.invalidateQueries({ queryKey: ["journals"] });
                }}
                onDelete={() => setDeleteModalOpen(true)}
              />

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6">
                <div className="mx-auto w-full max-w-4xl">
                  {isLoadingJournal ? (
                    // Skeleton for content only
                    <div className="space-y-3 py-4">
                      <div className="w-full h-4 bg-gray-100 rounded animate-pulse" />
                      <div className="w-11/12 h-4 bg-gray-100 rounded animate-pulse" />
                      <div className="w-10/12 h-4 bg-gray-100 rounded animate-pulse" />
                      <div className="w-full h-4 bg-gray-100 rounded animate-pulse" />
                    </div>
                  ) : (
                    <WYSIWYG
                      key={selectedEntry.id}
                      initialContent={
                        typeof selectedEntry.content === "string"
                          ? selectedEntry.content
                          : selectedEntry.content
                            ? JSON.stringify(selectedEntry.content)
                            : undefined
                      }
                      onChange={(content) => {
                        // Save to local draft immediately
                        setDraft(
                          selectedEntry.id,
                          content,
                          selectedEntry.title || "",
                        );
                        // Save to server (debounced)
                        saveContent(selectedEntry.id, content);
                      }}
                      placeholder="Start writing your journal entry..."
                    />
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="h-14 border-b bg-white px-4 md:px-6 flex items-center shrink-0">
                <h2 className="font-semibold">Entry Content</h2>
              </div>
              <div className="flex-1 overflow-y-auto p-4 md:p-6">
                <div className="mx-auto w-full max-w-4xl">
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <p>Select an entry to start editing</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Delete Modal */}
      {selectedEntry && (
        <DeleteJournalModal
          open={deleteModalOpen}
          onOpenChange={setDeleteModalOpen}
          journalTitle={selectedEntry.title || ""}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}
