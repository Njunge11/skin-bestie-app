"use server";

import { auth } from "@/auth";
import { api } from "@/lib/api-client";

// Lexical JSON structure type
export interface LexicalJSON {
  root: {
    children: unknown[];
    direction: string;
    format: string;
    indent: number;
    type: string;
    version: number;
  };
}

// Journal type matching backend API response
export interface Journal {
  id: string;
  userProfileId: string;
  title: string;
  content: LexicalJSON | string | null; // LexicalJSON object, empty string, or null
  preview: string; // 100-character text preview
  public: boolean;
  createdAt: string;
  lastModified: string;
}

// Form data for creating/updating journals
export interface JournalFormData {
  title: string;
  content: LexicalJSON | string; // Can be LexicalJSON object or empty string
  public?: boolean;
}

type Result<T> =
  | { success: true; data: T }
  | { success: false; error: { message: string; code?: string } };

// Helper to get empty Lexical JSON structure
function getEmptyLexicalJSON(): LexicalJSON {
  return {
    root: {
      children: [],
      direction: "ltr",
      format: "",
      indent: 0,
      type: "root",
      version: 1,
    },
  };
}

/**
 * Fetch all journals for the current user
 */
export async function fetchJournalsAction(): Promise<Result<Journal[]>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: { message: "Unauthorized", code: "UNAUTHORIZED" },
      };
    }

    // Call backend API to get all journals for this user
    const response = await api.get(
      `/api/consumer-app/journals?userId=${session.user.id}`,
    );

    // Extract journals array from response
    return { success: true, data: response.journals };
  } catch (error) {
    console.error("Error fetching journals:", error);
    return {
      success: false,
      error: {
        message:
          error instanceof Error ? error.message : "Failed to fetch journals",
      },
    };
  }
}

/**
 * Fetch a single journal by ID
 */
export async function fetchJournalAction(
  journalId: string,
): Promise<Result<Journal>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: { message: "Unauthorized", code: "UNAUTHORIZED" },
      };
    }

    // Call backend API to get specific journal with userId query param
    const response = await api.get(
      `/api/consumer-app/journals/${journalId}?userId=${session.user.id}`,
    );

    return { success: true, data: response };
  } catch (error) {
    console.error("Error fetching journal:", error);
    return {
      success: false,
      error: {
        message:
          error instanceof Error ? error.message : "Failed to fetch journal",
      },
    };
  }
}

/**
 * Create a new journal
 */
export async function createJournalAction(
  data: JournalFormData,
): Promise<Result<Journal>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: { message: "Unauthorized", code: "UNAUTHORIZED" },
      };
    }

    // Call backend API to create journal
    const response = await api.post("/api/consumer-app/journals", {
      userId: session.user.id,
      title: data.title || "Untitled Journal Entry",
      content: data.content || getEmptyLexicalJSON(),
      public: data.public ?? false,
    });

    return { success: true, data: response };
  } catch (error) {
    console.error("Error creating journal:", error);

    // Extract error message from API response
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create journal";

    return {
      success: false,
      error: { message: errorMessage },
    };
  }
}

/**
 * Update an existing journal
 */
export async function updateJournalAction(
  journalId: string,
  data: Partial<JournalFormData>,
): Promise<Result<Journal>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: { message: "Unauthorized", code: "UNAUTHORIZED" },
      };
    }

    // Call backend API to update journal
    const response = await api.patch(
      `/api/consumer-app/journals/${journalId}`,
      {
        userId: session.user.id,
        ...data,
      },
    );

    return { success: true, data: response };
  } catch (error) {
    console.error("Error updating journal:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Failed to update journal";

    return {
      success: false,
      error: { message: errorMessage },
    };
  }
}

/**
 * Delete a journal
 */
export async function deleteJournalAction(
  journalId: string,
): Promise<Result<void>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: { message: "Unauthorized", code: "UNAUTHORIZED" },
      };
    }

    // Call backend API to delete journal
    await api.delete(`/api/consumer-app/journals/${journalId}`, {
      userId: session.user.id,
    });

    return { success: true, data: undefined };
  } catch (error) {
    console.error("Error deleting journal:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete journal";

    return {
      success: false,
      error: { message: errorMessage },
    };
  }
}
