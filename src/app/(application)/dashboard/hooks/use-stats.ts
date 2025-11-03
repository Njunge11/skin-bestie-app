import { useQuery } from "@tanstack/react-query";
import { fetchStatsAction } from "../actions/stats-actions";

export function useStats() {
  return useQuery({
    queryKey: ["stats"],
    queryFn: () => fetchStatsAction(),
    staleTime: 30 * 1000, // Consider data fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    refetchOnWindowFocus: true, // Refetch when user returns to tab
    refetchOnReconnect: true, // Refetch when internet reconnects
  });
}
