"use client";

import { Button } from "@/components/ui/button";

interface PhotoEmptyStateProps {
  onUploadClick?: () => void;
}

export function PhotoEmptyState({ onUploadClick }: PhotoEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 bg-skinbestie-primary/10 rounded-full flex items-center justify-center mb-6">
        <svg
          className="w-10 h-10 text-skinbestie-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No photos yet
      </h3>
      <p className="text-gray-600 text-center mb-6 max-w-md">
        Track your skin journey by uploading progress photos. Compare photos
        over time to see your transformation.
      </p>
      <Button
        onClick={onUploadClick}
        className="bg-skinbestie-primary hover:bg-skinbestie-primary/90 text-white"
      >
        Upload Your First Photo
      </Button>
    </div>
  );
}
