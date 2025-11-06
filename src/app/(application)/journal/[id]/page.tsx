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
import { useJourneys } from "../hooks/use-journeys";
import { useJourney } from "../hooks/use-journey";
import {
  createJourneyAction,
  updateJourneyAction,
} from "../actions/journey-actions";
import { useDrafts } from "../stores/use-drafts";

export default function DocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = React.use(params);
  const { data: journeysData } = useJourneys();
  const { data: journeyData, error: journeyError } = useJourney(id);

  // Zustand drafts store
  const setDraft = useDrafts((state) => state.setDraft);
  const getDraft = useDrafts((state) => state.getDraft);

  // Debounced save callbacks
  const saveContent = useDebouncedCallback(
    async (journeyId: string, content: string) => {
      await updateJourneyAction(journeyId, { content });
      queryClient.invalidateQueries({ queryKey: ["journeys"] });
      // Don't clear draft - keep as backup since Map resets on dev reload
      // clearDraft(journeyId);
    },
    1000,
    { maxWait: 5000 },
  );

  const saveTitle = useDebouncedCallback(
    async (journeyId: string, title: string) => {
      await updateJourneyAction(journeyId, { title });
      queryClient.invalidateQueries({ queryKey: ["journeys"] });
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
    const result = await createJourneyAction({
      title: "Untitled Journal Entry",
      content: "",
      tags: [],
    });

    if (result.success) {
      // Invalidate journeys cache to refetch the list with new entry
      await queryClient.invalidateQueries({ queryKey: ["journeys"] });
      router.push(`/documents/${result.data.id}`);
    }
  };

  if (journeyError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Failed to load journal entry</p>
      </div>
    );
  }

  // Helper to extract plain text from Lexical JSON
  const extractPlainText = (content: string): string => {
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
    return content;
  };

  const journeys = journeysData?.success ? journeysData.data : [];
  const serverEntry = journeyData?.success ? journeyData.data : null;
  const localDraft = getDraft(id);

  // Use local draft if newer than server
  const selectedEntry = serverEntry
    ? {
        ...serverEntry,
        content:
          localDraft &&
          localDraft.timestamp > new Date(serverEntry.lastModified).getTime()
            ? localDraft.content
            : serverEntry.content,
        title:
          localDraft &&
          localDraft.timestamp > new Date(serverEntry.lastModified).getTime()
            ? localDraft.title
            : serverEntry.title,
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
            {journeys.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">
                No journal entries yet
              </p>
            ) : (
              journeys.map((journey) => (
                <Link key={journey.id} href={`/journal/${journey.id}`}>
                  <div
                    ref={
                      journey.id === selectedEntry?.id
                        ? scrollToActiveEntry
                        : null
                    }
                  >
                    <JourneyListItem
                      journey={{
                        id: journey.id,
                        title: journey.title,
                        preview: extractPlainText(journey.content).substring(
                          0,
                          100,
                        ),
                        date: journey.createdAt,
                        tags: journey.tags,
                      }}
                      isActive={journey.id === selectedEntry?.id}
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
            <JournalContentHeader
              title={selectedEntry.title}
              lastModified={selectedEntry.lastModified}
              isPublic={false}
              onTitleChange={(newTitle) => {
                // Save to local draft immediately
                setDraft(selectedEntry.id, selectedEntry.content, newTitle);
                // Save to server (debounced)
                saveTitle(selectedEntry.id, newTitle);
              }}
              onPublicChange={(isPublic) => {
                // TODO: Update public status via server action
                console.log("Public changed:", isPublic);
              }}
              onDelete={() => {
                // TODO: Delete entry via server action
                console.log("Delete clicked");
              }}
            />
          ) : (
            <div className="h-14 border-b bg-white px-4 md:px-6 flex items-center shrink-0">
              <h2 className="font-semibold">Entry Content</h2>
            </div>
          )}

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="mx-auto w-full max-w-4xl">
              {selectedEntry ? (
                <WYSIWYG
                  key={selectedEntry.id}
                  initialContent={selectedEntry.content}
                  onChange={(content) => {
                    // Save to local draft immediately
                    setDraft(selectedEntry.id, content, selectedEntry.title);
                    // Save to server (debounced)
                    saveContent(selectedEntry.id, content);
                  }}
                  placeholder="Start writing your journal entry..."
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <p>Select an entry to start editing</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
