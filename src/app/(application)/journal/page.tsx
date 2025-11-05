"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { useQueryClient } from "@tanstack/react-query";
import { JournalSidebarHeader } from "./components/journal-sidebar-header";
import { JournalContentHeader } from "./components/journal-content-header";
import { JourneyListItem } from "./components/journey-list-item";
import { WYSIWYG } from "./components/wysiwyg";
import { useJourneys } from "./hooks/use-journeys";
import { useJourney } from "./hooks/use-journey";
import {
  createJourneyAction,
  updateJourneyAction,
} from "./actions/journey-actions";
import { useDrafts } from "./stores/use-drafts";

export default function DocumentsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useJourneys();
  const { setDraft, getDraft } = useDrafts();

  const journeys = data?.success ? data.data : [];
  const firstEntry = journeys[0];

  // Fetch first entry data
  const { data: firstEntryData } = useJourney(firstEntry?.id, {
    enabled: !!firstEntry?.id,
  });

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

  // Debounced save callbacks for first entry
  const saveTitle = useDebouncedCallback(
    async (journeyId: string, title: string) => {
      await updateJourneyAction(journeyId, { title });
      queryClient.invalidateQueries({ queryKey: ["journeys"] });
    },
    1000,
    { maxWait: 5000 },
  );

  const saveContent = useDebouncedCallback(
    async (journeyId: string, content: string) => {
      await updateJourneyAction(journeyId, { content });
      queryClient.invalidateQueries({ queryKey: ["journeys"] });
    },
    1000,
    { maxWait: 5000 },
  );

  const handleAddEntry = async () => {
    const result = await createJourneyAction({
      title: "Untitled Journal Entry",
      content: "",
      tags: [],
    });

    if (result.success) {
      router.push(`/journal/${result.data.id}`);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Failed to load journeys</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  // Prepare first entry with draft recovery
  const serverEntry = firstEntryData?.success ? firstEntryData.data : null;
  const localDraft = serverEntry ? getDraft(serverEntry.id) : undefined;

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
        {/* Left Panel - Entries */}
        <div className="w-full md:w-96 border-r flex-col overflow-hidden bg-white flex">
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
                    isActive={selectedEntry?.id === journey.id}
                  />
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Right Panel - First Entry (hidden on mobile) */}
        <div className="hidden md:flex flex-1 flex-col overflow-hidden bg-white">
          {selectedEntry ? (
            <>
              {/* Header */}
              <JournalContentHeader
                title={selectedEntry.title}
                lastModified={selectedEntry.lastModified}
                isPublic={false}
                onTitleChange={(newTitle) => {
                  setDraft(selectedEntry.id, selectedEntry.content, newTitle);
                  saveTitle(selectedEntry.id, newTitle);
                }}
                onPublicChange={() => {
                  // TODO: Implement isPublic feature in Journey type
                  console.log("Toggle public/private");
                }}
                onDelete={() => {
                  // TODO: Implement delete
                  console.log("Delete entry");
                }}
              />

              {/* Editor */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6">
                <div className="mx-auto w-full max-w-4xl">
                  <WYSIWYG
                    key={selectedEntry.id}
                    initialContent={selectedEntry.content}
                    onChange={(content) => {
                      setDraft(selectedEntry.id, content, selectedEntry.title);
                      saveContent(selectedEntry.id, content);
                    }}
                    placeholder="Start writing your journal entry..."
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400">No entries yet</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
