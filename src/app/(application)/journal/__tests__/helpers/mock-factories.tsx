import type { Journal, LexicalJSON } from "../../actions/journal-actions";

/**
 * Helper to create empty Lexical JSON with one empty paragraph
 * (Lexical requires at least one child node in root)
 */
function getEmptyLexicalJSON(): LexicalJSON {
  return {
    root: {
      children: [
        {
          children: [],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "paragraph",
          version: 1,
        },
      ],
      direction: "ltr",
      format: "",
      indent: 0,
      type: "root",
      version: 1,
    },
  };
}

/**
 * Creates a mock journal entry with sensible defaults
 */
export const createMockJournal = (overrides?: Partial<Journal>): Journal => ({
  id: crypto.randomUUID(),
  userProfileId: "user-1",
  title: "Untitled Journal Entry",
  content: getEmptyLexicalJSON(),
  preview: "",
  public: false,
  createdAt: new Date().toISOString(),
  lastModified: new Date().toISOString(),
  ...overrides,
});

/**
 * Creates a list of mock journal entries
 */
export const createMockJournalList = (count: number): Journal[] => {
  return Array.from({ length: count }, (_, i) =>
    createMockJournal({
      id: `journal-${i}`,
      title: `Journal Entry ${i}`,
      preview: `This is a preview of journal entry ${i}`,
      createdAt: new Date(Date.now() - i * 86400000).toISOString(), // Each day older
      lastModified: new Date(Date.now() - i * 86400000).toISOString(),
    }),
  );
};

/**
 * Creates Lexical JSON content from plain text
 */
export const createMockLexicalContent = (text: string): LexicalJSON => {
  // Split by newlines to create paragraphs
  const paragraphs = text.split("\n").filter((line) => line.trim());

  const children = paragraphs.map((paragraph) => ({
    children: [
      {
        detail: 0,
        format: 0,
        mode: "normal",
        style: "",
        text: paragraph,
        type: "text",
        version: 1,
      },
    ],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "paragraph",
    version: 1,
  }));

  return {
    root: {
      children,
      direction: "ltr",
      format: "",
      indent: 0,
      type: "root",
      version: 1,
    },
  };
};
