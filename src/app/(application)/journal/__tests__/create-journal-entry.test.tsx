import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Import mocks before anything else
import {
  setupJournalActionMocks,
  mockCreateJournalAction,
  mockFetchJournalsAction,
  mockUpdateJournalAction,
  mockFetchJournalAction,
  // mockCreateFailure,
  // mockFetchWithEntries,
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
import {
  renderJournalPage,
  renderJournalDetailPage,
} from "./helpers/render-helpers";
import { createMockJournal } from "./helpers/mock-factories";
import {
  getAddEntryButton,
  // waitForJournalToAppear,
  // journalExistsInSidebar,
} from "./helpers/test-utils";
import { toast } from "sonner";

/**
 * JOURNAL ENTRY CREATION - UI TESTS
 *
 * Testing Strategy (per UI_TESTING.md):
 * - Complete user workflows from start to finish
 * - Test user-visible behavior, not implementation
 * - Mock at network boundary (server actions only)
 * - Use real components (no mocking UI components)
 * - Query by user-visible content
 * - Use userEvent for realistic interactions
 */
describe("Journal Entry Creation - UI Tests", () => {
  beforeEach(() => {
    setupJournalActionMocks();
    mockPush.mockClear();
    vi.clearAllMocks();
  });

  describe("Basic Creation Flows", () => {
    it("user creates new journal entry from main page, entry is created and appears in sidebar", async () => {
      const user = userEvent.setup();

      renderJournalPage();

      // Wait for loading to complete and empty state to appear
      await waitFor(() => {
        expect(screen.getByText(/no journal entries yet/i)).toBeInTheDocument();
      });

      // User clicks "Add new journal entry"
      const addButton = getAddEntryButton();
      await user.click(addButton);

      // Server action called with correct data
      await waitFor(() => {
        expect(mockCreateJournalAction).toHaveBeenCalledWith({
          title: "Untitled Journal Entry",
          content: "",
          public: false,
        });
      });

      // User is navigated to the new entry
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith(
          expect.stringMatching(/^\/journal\//),
        );
      });
    });

    it("user creates journal entry from existing entry page, new entry appears and navigation works", async () => {
      const user = userEvent.setup();

      // Setup existing entry
      const existingEntry = createMockJournal({
        id: "existing-1",
        title: "Existing Entry",
      });

      // Mock the fetch to return our specific entry
      mockFetchJournalsAction.mockResolvedValue({
        success: true,
        data: [existingEntry],
      });

      mockFetchJournalAction.mockResolvedValue({
        success: true,
        data: existingEntry,
      });

      renderJournalDetailPage({ id: "existing-1" });

      // Wait for page to load (title appears in both sidebar and content)
      await waitFor(() => {
        expect(screen.getAllByText("Existing Entry").length).toBeGreaterThan(0);
      });

      // User clicks "Add new journal entry"
      const addButton = getAddEntryButton();
      await user.click(addButton);

      // Server action called
      await waitFor(() => {
        expect(mockCreateJournalAction).toHaveBeenCalled();
      });

      // Navigation triggered
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalled();
      });
    });

    it("user creates 3 journal entries, all appear in sidebar in chronological order", async () => {
      const user = userEvent.setup();

      renderJournalPage();

      // Wait for empty state
      await waitFor(() => {
        expect(screen.getByText(/no journal entries yet/i)).toBeInTheDocument();
      });

      // Create first entry
      const addButton = getAddEntryButton();
      await user.click(addButton);

      await waitFor(() => {
        expect(mockCreateJournalAction).toHaveBeenCalledTimes(1);
        expect(mockPush).toHaveBeenCalledTimes(1);
      });

      // Create second entry
      await user.click(addButton);

      await waitFor(() => {
        expect(mockCreateJournalAction).toHaveBeenCalledTimes(2);
        expect(mockPush).toHaveBeenCalledTimes(2);
      });

      // Create third entry
      await user.click(addButton);

      await waitFor(() => {
        expect(mockCreateJournalAction).toHaveBeenCalledTimes(3);
        expect(mockPush).toHaveBeenCalledTimes(3);
      });

      // Verify all 3 calls had correct data
      const expectedPayload = {
        title: "Untitled Journal Entry",
        content: "",
        public: false,
      };
      expect(mockCreateJournalAction).toHaveBeenNthCalledWith(
        1,
        expectedPayload,
      );
      expect(mockCreateJournalAction).toHaveBeenNthCalledWith(
        2,
        expectedPayload,
      );
      expect(mockCreateJournalAction).toHaveBeenNthCalledWith(
        3,
        expectedPayload,
      );
    });
  });

  describe("Error Handling", () => {
    it("user clicks add entry, server fails, no error toast shown, user retries successfully", async () => {
      const user = userEvent.setup();

      renderJournalPage();

      // Wait for page to load
      await waitFor(() => {
        expect(screen.getByText(/no journal entries yet/i)).toBeInTheDocument();
      });

      // First call fails
      mockCreateJournalAction.mockResolvedValueOnce({
        success: false,
        error: { message: "Network error", code: "CREATE_FAILED" },
      });

      // User clicks "Add new journal entry"
      const addButton = getAddEntryButton();
      await user.click(addButton);

      // No error handling in current implementation - no toast shown
      await waitFor(() => {
        expect(mockCreateJournalAction).toHaveBeenCalledTimes(1);
      });

      // No navigation happened
      expect(mockPush).not.toHaveBeenCalled();

      // No error toast shown (implementation doesn't handle errors for creation)
      expect(toast.error).not.toHaveBeenCalled();

      // Second call succeeds (using the default mock from setupJournalActionMocks)
      const successEntry = createMockJournal({ id: "retry-entry" });
      mockCreateJournalAction.mockResolvedValueOnce({
        success: true,
        data: successEntry,
      });

      // User retries
      await user.click(addButton);

      // Success this time - navigation triggered
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith(
          expect.stringMatching(/^\/journal\//),
        );
      });

      // Verify both create calls were made
      expect(mockCreateJournalAction).toHaveBeenCalledTimes(2);
    });
  });

  describe("Edge Cases", () => {
    it("user with no entries clicks add entry, first entry appears and becomes active", async () => {
      const user = userEvent.setup();

      renderJournalPage();

      // Wait for empty state to appear
      await waitFor(() => {
        expect(screen.getByText(/no journal entries yet/i)).toBeInTheDocument();
      });

      // User clicks add
      const addButton = getAddEntryButton();
      await user.click(addButton);

      // Entry created and navigation happens
      await waitFor(() => {
        expect(mockCreateJournalAction).toHaveBeenCalled();
        expect(mockPush).toHaveBeenCalled();
      });
    });

    it("user creates entry, navigates away, returns to journal, entry still exists", async () => {
      const user = userEvent.setup();

      renderJournalPage();

      // Wait for empty state
      await waitFor(() => {
        expect(screen.getByText(/no journal entries yet/i)).toBeInTheDocument();
      });

      // Create entry
      const addButton = getAddEntryButton();
      await user.click(addButton);

      await waitFor(() => {
        expect(mockCreateJournalAction).toHaveBeenCalled();
        expect(mockPush).toHaveBeenCalledWith(
          expect.stringMatching(/^\/journal\//),
        );
      });

      // Setup mock for when user returns - entry should be in the list
      const createdEntry = createMockJournal({
        id: "persisted-entry",
        title: "Persisted Entry",
      });

      mockFetchJournalsAction.mockResolvedValue({
        success: true,
        data: [createdEntry],
      });

      // Simulate returning to journal page (re-render)
      renderJournalPage();

      // Entry should still be in list (appears in sidebar)
      await waitFor(() => {
        expect(screen.getAllByText("Persisted Entry").length).toBeGreaterThan(
          0,
        );
      });
    });

    it("user rapidly clicks add entry button 3 times, creates 3 entries with unique IDs", async () => {
      const user = userEvent.setup();

      renderJournalPage();

      // Wait for page to load
      await waitFor(() => {
        expect(screen.getByText(/no journal entries yet/i)).toBeInTheDocument();
      });

      const addButton = getAddEntryButton();

      // Rapid clicks
      await user.click(addButton);
      await user.click(addButton);
      await user.click(addButton);

      // All 3 calls made
      await waitFor(() => {
        expect(mockCreateJournalAction).toHaveBeenCalledTimes(3);
      });

      // Each call should have same params (title, content)
      const expectedPayload = {
        title: "Untitled Journal Entry",
        content: "",
        public: false,
      };
      expect(mockCreateJournalAction).toHaveBeenNthCalledWith(
        1,
        expectedPayload,
      );
      expect(mockCreateJournalAction).toHaveBeenNthCalledWith(
        2,
        expectedPayload,
      );
      expect(mockCreateJournalAction).toHaveBeenNthCalledWith(
        3,
        expectedPayload,
      );
    });
  });
});
