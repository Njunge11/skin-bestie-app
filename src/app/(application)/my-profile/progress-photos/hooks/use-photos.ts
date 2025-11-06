import { useQuery } from "@tanstack/react-query";
import { fetchPhotosAction } from "../actions/photo-actions";

export function usePhotos(userProfileId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ["photos", userProfileId],
    queryFn: () => fetchPhotosAction({ userProfileId }),
    enabled, // Only fetch when this is true (when Photos tab is active)
    staleTime: 30 * 1000, // Consider data fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    refetchOnWindowFocus: true, // Refetch when user returns to tab
    refetchOnReconnect: true, // Refetch when internet reconnects
  });
}
