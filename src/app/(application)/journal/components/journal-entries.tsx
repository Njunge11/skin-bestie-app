"use client";

import Link from "next/link";
import type { Journal } from "../actions/journal-actions";
import {
  JourneyListItem,
  type JourneyListItem as JourneyListItemData,
} from "./journey-list-item";

interface JournalEntriesProps {
  journals: Journal[];
  activeJournalId?: string;
}

// Helper to extract plain text from Lexical JSON
function extractPlainText(content: unknown): string {
  try {
    // Type guard to check if content has the expected structure
    if (
      typeof content === "object" &&
      content !== null &&
      "root" in content &&
      typeof content.root === "object" &&
      content.root !== null &&
      "children" in content.root
    ) {
      return (
        content.root.children as Array<{ children?: Array<{ text?: string }> }>
      )
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
    return "";
  }
  return "";
}

export function JournalEntries({
  journals,
  activeJournalId,
}: JournalEntriesProps) {
  // Convert Journal to JourneyListItem format
  const journeyListItems: JourneyListItemData[] = journals.map((journal) => ({
    id: journal.id,
    title: journal.title,
    preview: extractPlainText(journal.content).substring(0, 100),
    date: journal.createdAt,
  }));

  return (
    <>
      {journeyListItems.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-8">
          No journal entries yet
        </p>
      ) : (
        journeyListItems.map((journal) => (
          <Link key={journal.id} href={`/journal/${journal.id}`}>
            <JourneyListItem
              journey={journal}
              isActive={journal.id === activeJournalId}
            />
          </Link>
        ))
      )}
    </>
  );
}
