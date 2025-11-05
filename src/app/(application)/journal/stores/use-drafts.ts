import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface Draft {
  content: string; // Lexical JSON
  title: string;
  timestamp: number;
}

interface DraftsState {
  drafts: Record<string, Draft>;
  setDraft: (id: string, content: string, title: string) => void;
  getDraft: (id: string) => Draft | undefined;
  clearDraft: (id: string) => void;
}

export const useDrafts = create<DraftsState>()(
  persist(
    (set, get) => ({
      drafts: {},

      setDraft: (id, content, title) =>
        set((state) => ({
          drafts: {
            ...state.drafts,
            [id]: { content, title, timestamp: Date.now() },
          },
        })),

      getDraft: (id) => get().drafts[id],

      clearDraft: (id) =>
        set((state) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [id]: _, ...rest } = state.drafts;
          return { drafts: rest };
        }),
    }),
    {
      name: "journal-drafts", // localStorage key
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
