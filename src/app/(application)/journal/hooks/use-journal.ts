import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { fetchJournalAction } from "../actions/journal-actions";

type JournalData = Awaited<ReturnType<typeof fetchJournalAction>>;

export function useJournal(
  journalId: string | undefined,
  options?: Omit<UseQueryOptions<JournalData>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: ["journal", journalId],
    queryFn: () => fetchJournalAction(journalId!),
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnReconnect: true, // Refetch when internet reconnects
    enabled: !!journalId, // Only fetch if journalId exists
    ...options,
  });
}
