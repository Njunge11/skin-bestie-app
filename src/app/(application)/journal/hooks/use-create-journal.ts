import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createJournalAction, type Journal } from "../actions/journal-actions";

export function useCreateJournal() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: createJournalAction,
    onMutate: async (newJournal) => {
      // Cancel any outgoing refetches to prevent them from overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: ["journals"] });

      // Snapshot the previous value
      const previousJournals = queryClient.getQueryData(["journals"]);

      // Optimistically update the cache
      queryClient.setQueryData(
        ["journals"],
        (old: { success: boolean; data: Journal[] } | undefined) => {
          if (!old?.success) return old;

          // Create optimistic journal entry
          const optimisticJournal: Journal = {
            id: crypto.randomUUID(), // Temporary ID
            title: newJournal.title,
            content: newJournal.content,
            preview: "",
            public: newJournal.public ?? false,
            createdAt: new Date().toISOString(),
            lastModified: new Date().toISOString(),
            userProfileId: "",
          };

          return {
            ...old,
            data: [optimisticJournal, ...old.data],
          };
        },
      );

      // Return context with snapshot for rollback
      return { previousJournals };
    },
    onError: (err, newJournal, context) => {
      // Rollback to previous value on error
      if (context?.previousJournals) {
        queryClient.setQueryData(["journals"], context.previousJournals);
      }
    },
    onSuccess: (result) => {
      // Navigate to the newly created journal
      if (result.success) {
        router.push(`/journal/${result.data.id}`);
      }
    },
    onSettled: () => {
      // Always refetch after error or success to sync with server
      queryClient.invalidateQueries({ queryKey: ["journals"] });
    },
  });
}
