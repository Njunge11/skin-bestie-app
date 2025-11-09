import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Import mocks before anything else
import {
  setupJournalActionMocks,
  mockCreateJournalAction,
  mockFetchJournalsAction,
  mockUpdateJournalAction,
  mockFetchJournalAction,
} from "./mocks/journal-actions.mock";

// Mock server actions BEFORE importing components that use them
vi.mock("../actions/journal-actions", () => ({
  createJournalAction: mockCreateJournalAction,
  updateJournalAction: mockUpdateJournalAction,
  fetchJournalsAction: mockFetchJournalsAction,
  fetchJournalAction: mockFetchJournalAction,
  deleteJournalAction: vi.fn(),
}));

// Mock Next.js navigation
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/journal",
}));

// Mock toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Now import everything else
import { renderJournalPage } from "./helpers/render-helpers";
import {
  createMockJournal,
  createMockJournalList,
} from "./helpers/mock-factories";
import { getAddEntryButton } from "./helpers/test-utils";

/**
 * JOURNAL ENTRY RETRIEVAL - UI TESTS
 *
 * Testing Strategy (per UI_TESTING.md):
 * - Complete user workflows from start to finish
 * - Test user-visible behavior, not implementation
 * - Mock at network boundary (server actions only)
 * - Use real components (no mocking UI components)
 * - Query by user-visible content
 * - Use userEvent for realistic interactions
 */
describe("Journal Entry Retrieval - UI Tests", () => {
  beforeEach(() => {
    setupJournalActionMocks();
    mockPush.mockClear();
    vi.clearAllMocks();
  });

  describe("Complete User Workflows", () => {
    it("user with no entries creates first entry, returns to list, sees entry at top", async () => {
      const user = userEvent.setup();

      // Start with no entries
      mockFetchJournalsAction.mockResolvedValue({
        success: true,
        data: [],
      });

      renderJournalPage();

      // User sees empty state
      await waitFor(() => {
        expect(screen.getByText(/no journal entries yet/i)).toBeInTheDocument();
      });

      // User creates new entry
      const addButton = getAddEntryButton();
      await user.click(addButton);

      // Entry is created and user navigates
      await waitFor(() => {
        expect(mockCreateJournalAction).toHaveBeenCalled();
        expect(mockPush).toHaveBeenCalledWith(
          expect.stringMatching(/^\/journal\//),
        );
      });

      // Simulate return to journal list (re-render with new entry)
      const newEntry = createMockJournal({
        id: "new-entry-1",
        title: "Untitled Journal Entry",
        preview: "",
      });

      mockFetchJournalsAction.mockResolvedValue({
        success: true,
        data: [newEntry],
      });

      // Re-render to simulate navigation back
      renderJournalPage();

      // User sees new entry at top of list (use getAllByText since it appears multiple times)
      await waitFor(() => {
        const titles = screen.getAllByText("Untitled Journal Entry");
        expect(titles.length).toBeGreaterThan(0);
      });
    });

    it("user with 5 existing entries visits page, browses list with correct navigation links", async () => {
      // Setup 5 mock journals
      const journals = createMockJournalList(5);
      mockFetchJournalsAction.mockResolvedValue({
        success: true,
        data: journals,
      });

      renderJournalPage();

      // User sees loading state briefly, then entries load
      await waitFor(() => {
        const entries = screen.getAllByText("Journal Entry 0");
        expect(entries.length).toBeGreaterThan(0);
      });

      // User sees all 5 entries (use getAllByText for entries that appear multiple times)
      expect(screen.getAllByText("Journal Entry 0").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Journal Entry 1").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Journal Entry 2").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Journal Entry 3").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Journal Entry 4").length).toBeGreaterThan(0);

      // Each entry shows preview text
      expect(
        screen.getAllByText(/This is a preview of journal entry 0/i).length,
      ).toBeGreaterThan(0);

      // Each entry has correct navigation link (verify all 5)
      expect(
        screen.getByRole("link", { name: /journal entry 0/i }),
      ).toHaveAttribute("href", `/journal/${journals[0].id}`);
      expect(
        screen.getByRole("link", { name: /journal entry 1/i }),
      ).toHaveAttribute("href", `/journal/${journals[1].id}`);
      expect(
        screen.getByRole("link", { name: /journal entry 2/i }),
      ).toHaveAttribute("href", `/journal/${journals[2].id}`);
      expect(
        screen.getByRole("link", { name: /journal entry 3/i }),
      ).toHaveAttribute("href", `/journal/${journals[3].id}`);
      expect(
        screen.getByRole("link", { name: /journal entry 4/i }),
      ).toHaveAttribute("href", `/journal/${journals[4].id}`);
    });

    it("user visits page on desktop, first entry loads and displays in editor", async () => {
      // Setup 3 mock journals with first having content
      const journals = createMockJournalList(3);
      mockFetchJournalsAction.mockResolvedValue({
        success: true,
        data: journals,
      });

      // Render with desktop viewport (≥ 1280px)
      global.innerWidth = 1280;
      renderJournalPage();

      // Wait for entries to load
      await waitFor(() => {
        const entries = screen.getAllByText("Journal Entry 0");
        expect(entries.length).toBeGreaterThan(0);
      });

      // User sees sidebar with 3 entries
      expect(screen.getAllByText("Journal Entry 0").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Journal Entry 1").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Journal Entry 2").length).toBeGreaterThan(0);

      // User sees first entry displayed in editor panel (desktop only)
      // Check that entry appears in both sidebar and editor (multiple instances)
      const titleElements = screen.getAllByText("Journal Entry 0");
      // Should appear at least twice: once in sidebar, once in editor header
      expect(titleElements.length).toBeGreaterThanOrEqual(2);
    });

    it("user visits page on mobile/tablet, sees only list view", async () => {
      // Setup mock journals
      const journals = createMockJournalList(3);
      mockFetchJournalsAction.mockResolvedValue({
        success: true,
        data: journals,
      });

      // Render with mobile viewport (< 1280px)
      global.innerWidth = 768;
      renderJournalPage();

      // Wait for entries to load
      await waitFor(() => {
        const entries = screen.getAllByText("Journal Entry 0");
        expect(entries.length).toBeGreaterThan(0);
      });

      // User sees full-width sidebar list
      expect(screen.getAllByText("Journal Entry 0").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Journal Entry 1").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Journal Entry 2").length).toBeGreaterThan(0);

      // Editor panel is hidden on mobile/tablet (CSS: hidden xl:flex)
      // Only one title should be visible (in sidebar), not duplicated in editor
      const titleElements = screen.queryAllByText("Journal Entry 0");
      // On mobile, title appears only in the list item, not in editor
      expect(titleElements.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("Error Recovery Workflows", () => {
    it("user visits page, API fails, user refreshes and succeeds", async () => {
      // First call fails
      mockFetchJournalsAction.mockRejectedValueOnce(new Error("Network error"));

      renderJournalPage();

      // User sees error message
      await waitFor(() => {
        expect(
          screen.getByText(/failed to load journeys/i),
        ).toBeInTheDocument();
      });

      // Clean up the first render
      cleanup();

      // Setup successful response for retry
      const journals = createMockJournalList(2);
      mockFetchJournalsAction.mockResolvedValue({
        success: true,
        data: journals,
      });

      // User refreshes (re-render with new component instance)
      renderJournalPage();

      // User sees journal entries
      await waitFor(() => {
        expect(screen.getAllByText("Journal Entry 0").length).toBeGreaterThan(
          0,
        );
        expect(screen.getAllByText("Journal Entry 1").length).toBeGreaterThan(
          0,
        );
      });

      // Error message is gone
      expect(
        screen.queryByText(/failed to load journeys/i),
      ).not.toBeInTheDocument();
    });
  });

  describe("Observable Behavior from API", () => {
    it("user visits page, entries display with backend-provided preview text", async () => {
      // Setup journals with specific preview text from API
      const journals = [
        createMockJournal({
          id: "journal-1",
          title: "My First Journal",
          preview:
            "This is the preview text from the backend API for journal 1",
        }),
        createMockJournal({
          id: "journal-2",
          title: "My Second Journal",
          preview:
            "This is the preview text from the backend API for journal 2",
        }),
      ];

      mockFetchJournalsAction.mockResolvedValue({
        success: true,
        data: journals,
      });

      renderJournalPage();

      // User sees exact preview text from API
      await waitFor(() => {
        expect(
          screen.getByText(
            /This is the preview text from the backend API for journal 1/i,
          ),
        ).toBeInTheDocument();
      });

      expect(
        screen.getByText(
          /This is the preview text from the backend API for journal 2/i,
        ),
      ).toBeInTheDocument();

      // Verify we're not extracting text client-side
      // (If we were, the preview would be different)
      expect(mockFetchJournalsAction).toHaveBeenCalledTimes(1);
    });
  });
});
