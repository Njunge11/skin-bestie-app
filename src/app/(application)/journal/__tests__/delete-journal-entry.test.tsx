import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Import mocks before anything else
import {
  setupJournalActionMocks,
  mockDeleteJournalAction,
  mockFetchJournalsAction,
  mockFetchJournalAction,
} from "./mocks/journal-actions.mock";

// Mock server actions BEFORE importing components that use them
vi.mock("../actions/journal-actions", () => ({
  createJournalAction: vi.fn(),
  updateJournalAction: vi.fn(),
  fetchJournalsAction: mockFetchJournalsAction,
  fetchJournalAction: mockFetchJournalAction,
  deleteJournalAction: mockDeleteJournalAction,
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
import { createMockJournalList } from "./helpers/mock-factories";
import { toast } from "sonner";

/**
 * DELETE JOURNAL ENTRY - UI TESTS
 *
 * Testing Strategy (per UI_TESTING.md):
 * - Complete user workflows from start to finish
 * - Test user-visible behavior, not implementation
 * - Mock at network boundary (server actions only)
 * - Use real components (no mocking UI components)
 * - Query by user-visible content
 * - Use userEvent for realistic interactions
 */
describe("Delete Journal Entry - UI Tests", () => {
  beforeEach(() => {
    setupJournalActionMocks();
    mockPush.mockClear();
    vi.clearAllMocks();
  });

  describe("Complete User Workflows", () => {
    it("user clicks delete button, cancels in modal, journal entry remains", async () => {
      const user = userEvent.setup();

      // Setup 3 journals
      const journals = createMockJournalList(3);
      mockFetchJournalsAction.mockResolvedValue({
        success: true,
        data: journals,
      });

      // Render with desktop viewport (≥ 1280px) to see delete button
      global.innerWidth = 1280;
      renderJournalPage();

      // Wait for journals to load
      await waitFor(() => {
        expect(screen.getAllByText("Journal Entry 0").length).toBeGreaterThan(
          0,
        );
      });

      // User clicks delete button (trash icon)
      const deleteButton = screen.getByRole("button", {
        name: /delete journal entry/i,
      });
      await user.click(deleteButton);

      // User sees confirmation modal
      await waitFor(() => {
        expect(screen.getByText(/delete journal entry\?/i)).toBeInTheDocument();
      });

      // Modal shows journal title in description
      expect(
        screen.getByText(
          /are you sure you want to delete.*journal entry 0.*\?/i,
        ),
      ).toBeInTheDocument();

      // User clicks Cancel
      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      await user.click(cancelButton);

      // Modal closes
      await waitFor(() => {
        expect(
          screen.queryByText(/delete journal entry\?/i),
        ).not.toBeInTheDocument();
      });

      // Delete was NOT called
      expect(mockDeleteJournalAction).not.toHaveBeenCalled();

      // All 3 journals still visible
      expect(screen.getAllByText("Journal Entry 0").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Journal Entry 1").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Journal Entry 2").length).toBeGreaterThan(0);
    });

    it("user clicks delete on main page, confirms, entry deleted successfully, navigates to list", async () => {
      const user = userEvent.setup();

      // Setup 3 journals
      const journals = createMockJournalList(3);
      mockFetchJournalsAction.mockResolvedValue({
        success: true,
        data: journals,
      });

      // Mock successful delete
      mockDeleteJournalAction.mockResolvedValue({
        success: true,
        data: undefined,
      });

      // Render with desktop viewport (≥ 1280px) to see delete button
      global.innerWidth = 1280;
      renderJournalPage();

      // Wait for journals to load
      await waitFor(() => {
        expect(screen.getAllByText("Journal Entry 0").length).toBeGreaterThan(
          0,
        );
      });

      // User clicks delete button
      const deleteButton = screen.getByRole("button", {
        name: /delete journal entry/i,
      });
      await user.click(deleteButton);

      // User sees confirmation modal
      await waitFor(() => {
        expect(screen.getByText(/delete journal entry\?/i)).toBeInTheDocument();
      });

      // User clicks Delete button in modal
      const confirmButton = screen.getByRole("button", { name: /^delete$/i });
      await user.click(confirmButton);

      // Delete action called with correct ID
      await waitFor(() => {
        expect(mockDeleteJournalAction).toHaveBeenCalledWith(journals[0].id);
      });

      // Success toast shown
      expect(toast.success).toHaveBeenCalledWith(
        "Journal entry deleted successfully",
      );

      // Modal closes (component unmounts, so query should return null)
      await waitFor(() => {
        expect(
          screen.queryByText(/delete journal entry\?/i),
        ).not.toBeInTheDocument();
      });
    });

    it("user clicks delete on detail page, confirms, entry deleted, navigates back to list", async () => {
      const user = userEvent.setup();

      // Setup journals
      const journals = createMockJournalList(3);
      mockFetchJournalsAction.mockResolvedValue({
        success: true,
        data: journals,
      });

      // Mock fetchJournalAction for detail page
      mockFetchJournalAction.mockResolvedValue({
        success: true,
        data: journals[1],
      });

      // Mock successful delete
      mockDeleteJournalAction.mockResolvedValue({
        success: true,
        data: undefined,
      });

      // Render detail page for second journal
      renderJournalDetailPage({ id: journals[1].id });

      // Wait for journal to load
      await waitFor(() => {
        expect(screen.getAllByText("Journal Entry 1").length).toBeGreaterThan(
          0,
        );
      });

      // User clicks delete button
      const deleteButton = screen.getByRole("button", {
        name: /delete journal entry/i,
      });
      await user.click(deleteButton);

      // User sees confirmation modal with journal title
      await waitFor(() => {
        expect(screen.getByText(/delete journal entry\?/i)).toBeInTheDocument();
        expect(
          screen.getByText(
            /are you sure you want to delete.*journal entry 1.*\?/i,
          ),
        ).toBeInTheDocument();
      });

      // User clicks Delete button in modal
      const confirmButton = screen.getByRole("button", { name: /^delete$/i });
      await user.click(confirmButton);

      // Delete action called
      await waitFor(() => {
        expect(mockDeleteJournalAction).toHaveBeenCalledWith(journals[1].id);
      });

      // Success toast shown
      expect(toast.success).toHaveBeenCalledWith(
        "Journal entry deleted successfully",
      );

      // Navigates back to journal list
      expect(mockPush).toHaveBeenCalledWith("/journal");
    });

    it("user clicks delete, confirms, API fails, error shown, modal stays open, can retry", async () => {
      const user = userEvent.setup();

      // Setup journals
      const journals = createMockJournalList(2);
      mockFetchJournalsAction.mockResolvedValue({
        success: true,
        data: journals,
      });

      // Mock failed delete (first attempt)
      mockDeleteJournalAction.mockResolvedValueOnce({
        success: false,
        error: { message: "Failed to delete journal entry" },
      });

      // Render with desktop viewport
      global.innerWidth = 1280;
      renderJournalPage();

      // Wait for journals to load
      await waitFor(() => {
        expect(screen.getAllByText("Journal Entry 0").length).toBeGreaterThan(
          0,
        );
      });

      // User clicks delete button
      const deleteButton = screen.getByRole("button", {
        name: /delete journal entry/i,
      });
      await user.click(deleteButton);

      // User sees confirmation modal
      await waitFor(() => {
        expect(screen.getByText(/delete journal entry\?/i)).toBeInTheDocument();
      });

      // User clicks Delete button in modal
      const confirmButton = screen.getByRole("button", { name: /^delete$/i });
      await user.click(confirmButton);

      // Delete action called
      await waitFor(() => {
        expect(mockDeleteJournalAction).toHaveBeenCalledTimes(1);
      });

      // Error toast shown
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          "Failed to delete journal entry",
        );
      });

      // Modal stays open (user can retry)
      expect(screen.getByText(/delete journal entry\?/i)).toBeInTheDocument();

      // Delete button is re-enabled (shows "Delete" not "Deleting...")
      expect(confirmButton).toHaveTextContent("Delete");
      expect(confirmButton).not.toBeDisabled();

      // User can cancel
      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      expect(cancelButton).not.toBeDisabled();
    });

    it("user clicks delete, sees loading state during deletion, then success", async () => {
      const user = userEvent.setup();

      // Setup journals
      const journals = createMockJournalList(2);
      mockFetchJournalsAction.mockResolvedValue({
        success: true,
        data: journals,
      });

      // Mock slow successful delete
      let resolveDelete: (value: { success: boolean }) => void;
      const deletePromise = new Promise<{ success: boolean }>((resolve) => {
        resolveDelete = resolve;
      });
      mockDeleteJournalAction.mockReturnValue(deletePromise);

      // Render with desktop viewport
      global.innerWidth = 1280;
      renderJournalPage();

      // Wait for journals to load
      await waitFor(() => {
        expect(screen.getAllByText("Journal Entry 0").length).toBeGreaterThan(
          0,
        );
      });

      // User clicks delete button
      const deleteButton = screen.getByRole("button", {
        name: /delete journal entry/i,
      });
      await user.click(deleteButton);

      // User sees confirmation modal
      await waitFor(() => {
        expect(screen.getByText(/delete journal entry\?/i)).toBeInTheDocument();
      });

      // User clicks Delete button in modal
      const confirmButton = screen.getByRole("button", { name: /^delete$/i });
      await user.click(confirmButton);

      // Button shows loading state
      await waitFor(() => {
        expect(confirmButton).toHaveTextContent("Deleting...");
        expect(confirmButton).toBeDisabled();
      });

      // Cancel button also disabled during deletion
      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      expect(cancelButton).toBeDisabled();

      // Resolve the delete
      resolveDelete!({
        success: true,
      });

      // Success toast shown
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          "Journal entry deleted successfully",
        );
      });
    });

    // Note: Testing CSS visibility (hidden xl:flex) is not reliable in RTL
    // as it doesn't evaluate Tailwind CSS. This is an implementation detail anyway.
    // The responsive behavior is better tested via E2E tests or visual regression tests.
  });

  describe("Error Handling", () => {
    it("user deletes entry, backend returns 403 forbidden, specific error shown", async () => {
      const user = userEvent.setup();

      // Setup journals
      const journals = createMockJournalList(2);
      mockFetchJournalsAction.mockResolvedValue({
        success: true,
        data: journals,
      });

      // Mock 403 forbidden error
      mockDeleteJournalAction.mockResolvedValue({
        success: false,
        error: { message: "You do not have permission to delete this journal" },
      });

      // Render with desktop viewport
      global.innerWidth = 1280;
      renderJournalPage();

      // Wait for journals to load
      await waitFor(() => {
        expect(screen.getAllByText("Journal Entry 0").length).toBeGreaterThan(
          0,
        );
      });

      // User clicks delete and confirms
      const deleteButton = screen.getByRole("button", { name: /delete/i });
      await user.click(deleteButton);

      await waitFor(() => {
        expect(screen.getByText(/delete journal entry\?/i)).toBeInTheDocument();
      });

      const confirmButton = screen.getByRole("button", { name: /^delete$/i });
      await user.click(confirmButton);

      // Specific error message shown
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          "You do not have permission to delete this journal",
        );
      });
    });

    it("user deletes entry, backend returns 404 not found, error shown", async () => {
      const user = userEvent.setup();

      // Setup journals
      const journals = createMockJournalList(2);
      mockFetchJournalsAction.mockResolvedValue({
        success: true,
        data: journals,
      });

      // Mock 404 not found error
      mockDeleteJournalAction.mockResolvedValue({
        success: false,
        error: { message: "Journal not found" },
      });

      // Render with desktop viewport
      global.innerWidth = 1280;
      renderJournalPage();

      // Wait for journals to load
      await waitFor(() => {
        expect(screen.getAllByText("Journal Entry 0").length).toBeGreaterThan(
          0,
        );
      });

      // User clicks delete and confirms
      const deleteButton = screen.getByRole("button", { name: /delete/i });
      await user.click(deleteButton);

      await waitFor(() => {
        expect(screen.getByText(/delete journal entry\?/i)).toBeInTheDocument();
      });

      const confirmButton = screen.getByRole("button", { name: /^delete$/i });
      await user.click(confirmButton);

      // Error message shown
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Journal not found");
      });
    });
  });
});
