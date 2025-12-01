import { useQuery } from "@tanstack/react-query";
import { fetchDashboardAction } from "../setup-dashboard/setup-dashboard-actions";

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: () => fetchDashboardAction(),
    staleTime: 2 * 1000, // Consider data fresh for 2 seconds
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    refetchInterval: 2 * 1000, // Poll every 2 seconds for near real-time updates
    refetchOnWindowFocus: true, // Refetch when user returns to tab
    refetchOnReconnect: true, // Refetch when internet reconnects
  });
}
