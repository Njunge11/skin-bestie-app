import { vi } from "vitest";
import {
  createMockJournal,
  createMockJournalList,
} from "../helpers/mock-factories";

// Export mocked functions
export const mockCreateJournalAction = vi.fn();
export const mockUpdateJournalAction = vi.fn();
export const mockFetchJournalsAction = vi.fn();
export const mockFetchJournalAction = vi.fn();
export const mockDeleteJournalAction = vi.fn();

/**
 * Setup function for default successful mock behavior
 */
export function setupJournalActionMocks() {
  vi.clearAllMocks();

  // Default: successful creation with new ID each time
  mockCreateJournalAction.mockImplementation(async (data) => {
    return {
      success: true,
      data: createMockJournal({
        title: data.title,
        content: data.content,
        preview: "", // New entries have empty preview initially
        public: data.public ?? false,
      }),
    };
  });

  // Default: empty list
  mockFetchJournalsAction.mockResolvedValue({
    success: true,
    data: [],
  });

  // Default: successful fetch
  mockFetchJournalAction.mockImplementation(async (id) => {
    return {
      success: true,
      data: createMockJournal({ id }),
    };
  });

  // Default: successful update
  mockUpdateJournalAction.mockImplementation(async (id, data) => {
    return {
      success: true,
      data: createMockJournal({ id, ...data }),
    };
  });

  // Default: successful delete
  mockDeleteJournalAction.mockResolvedValue({
    success: true,
    data: undefined,
  });
}

/**
 * Mock a creation failure
 */
export function mockCreateFailure(errorMessage = "Failed to create journal") {
  mockCreateJournalAction.mockResolvedValue({
    success: false,
    error: { message: errorMessage, code: "CREATE_FAILED" },
  });
}

/**
 * Mock fetch with a specific number of entries
 */
export function mockFetchWithEntries(count: number) {
  const entries = createMockJournalList(count);

  mockFetchJournalsAction.mockResolvedValue({
    success: true,
    data: entries,
  });
}

/**
 * Mock update failure
 */
export function mockUpdateFailure(errorMessage = "Failed to update journal") {
  mockUpdateJournalAction.mockResolvedValue({
    success: false,
    error: { message: errorMessage, code: "UPDATE_FAILED" },
  });
}
