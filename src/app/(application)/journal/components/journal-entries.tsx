"use client";

import Link from "next/link";
import type { Journey } from "../actions/journey-actions";
import {
  JourneyListItem,
  type JourneyListItem as JourneyListItemData,
} from "./journey-list-item";

interface JournalEntriesProps {
  journeys: Journey[];
  activeJourneyId?: string;
}

export function JournalEntries({
  journeys,
  activeJourneyId,
}: JournalEntriesProps) {
  // Convert Journey to JourneyListItem format
  const journeyListItems: JourneyListItemData[] = journeys.map((journey) => ({
    id: journey.id,
    title: journey.title,
    preview: journey.content.substring(0, 100),
    date: journey.createdAt,
    tags: journey.tags,
  }));

  return (
    <>
      {journeyListItems.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-8">
          No journal entries yet
        </p>
      ) : (
        journeyListItems.map((journey) => (
          <Link key={journey.id} href={`/documents/${journey.id}`}>
            <JourneyListItem
              journey={journey}
              isActive={journey.id === activeJourneyId}
            />
          </Link>
        ))
      )}
    </>
  );
}
