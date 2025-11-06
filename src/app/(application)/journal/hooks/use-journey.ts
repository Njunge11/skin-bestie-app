import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { fetchJourneyAction } from "../actions/journey-actions";

type JourneyData = Awaited<ReturnType<typeof fetchJourneyAction>>;

export function useJourney(
  journeyId: string | undefined,
  options?: Omit<UseQueryOptions<JourneyData>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: ["journey", journeyId],
    queryFn: () => fetchJourneyAction(journeyId!),
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnReconnect: true, // Refetch when internet reconnects
    enabled: !!journeyId, // Only fetch if journeyId exists
    ...options,
  });
}
