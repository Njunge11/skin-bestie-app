import { useQuery } from "@tanstack/react-query";
import { fetchJournalsAction } from "../actions/journal-actions";

export function useJournals() {
  return useQuery({
    queryKey: ["journals"],
    queryFn: () => fetchJournalsAction(),
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnReconnect: true, // Refetch when internet reconnects
  });
}
