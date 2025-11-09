import { screen, waitFor } from "@testing-library/react";
import { expect } from "vitest";
import type { UserEvent } from "@testing-library/user-event";

/**
 * Waits for a journal entry to appear in the sidebar
 */
export async function waitForJournalToAppear(title: string) {
  return await screen.findByText(new RegExp(title, "i"));
}

/**
 * Waits for a toast message to appear
 */
export async function waitForToast(message: string) {
  return await screen.findByText(new RegExp(message, "i"));
}

/**
 * Gets the "Add new journal entry" button
 */
export function getAddEntryButton() {
  return screen.getByRole("button", { name: /add new journal entry/i });
}

/**
 * Creates a new journal entry by clicking the add button
 */
export async function createJournalEntry(user: UserEvent) {
  const button = getAddEntryButton();
  await user.click(button);

  // Wait for the default title to appear
  await waitFor(() => {
    expect(screen.getByText(/untitled journal entry/i)).toBeInTheDocument();
  });
}

/**
 * Checks if a journal entry exists in the sidebar
 */
export function journalExistsInSidebar(title: string): boolean {
  return screen.queryByText(new RegExp(title, "i")) !== null;
}
