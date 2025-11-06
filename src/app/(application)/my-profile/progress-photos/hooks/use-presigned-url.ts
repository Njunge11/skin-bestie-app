import { useQuery } from "@tanstack/react-query";

interface PresignedUrlResponse {
  presignedUrl: string;
}

async function fetchPresignedUrl(s3Url: string): Promise<string> {
  const response = await fetch(
    `/api/photos/presigned-url?url=${encodeURIComponent(s3Url)}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch presigned URL");
  }

  const data: PresignedUrlResponse = await response.json();
  return data.presignedUrl;
}

export function usePresignedUrl(s3Url: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ["presigned-url", s3Url],
    queryFn: () => fetchPresignedUrl(s3Url!),
    enabled: enabled && !!s3Url,
    staleTime: 50 * 60 * 1000, // Consider fresh for 50 minutes (URLs expire in 60 minutes)
    gcTime: 60 * 60 * 1000, // Keep in cache for 1 hour
    retry: 2,
  });
}
