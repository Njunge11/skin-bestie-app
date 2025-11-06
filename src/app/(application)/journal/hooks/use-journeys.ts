import { useQuery } from "@tanstack/react-query";
import { fetchJourneysAction } from "../actions/journey-actions";

export function useJourneys() {
  return useQuery({
    queryKey: ["journeys"],
    queryFn: () => fetchJourneysAction(),
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnReconnect: true, // Refetch when internet reconnects
  });
}
