"use client";

import { Button } from "@/components/ui/button";
import { PhotoCard } from "./photo-card";
import { PhotoEmptyState } from "./photo-empty-state";
import type { Photo } from "./progress-photos.types";

interface PhotoGridProps {
  photos: Photo[];
  isCompareMode: boolean;
  selectedPhotos: string[];
  onPhotoClick: (photoId: string) => void;
  onCompareClick: () => void;
  onCancelCompare: () => void;
  onUploadClick?: () => void;
  onDelete?: (photoId: string) => void;
  onRetry?: (photoId: string) => void;
}

export function PhotoGrid({
  photos,
  isCompareMode,
  selectedPhotos,
  onPhotoClick,
  onCompareClick,
  onCancelCompare,
  onUploadClick,
  onDelete,
  onRetry,
}: PhotoGridProps) {
  // Count uploaded photos (from backend)
  const uploadedPhotos = photos.filter((p) => p.uploadStatus === "uploaded");
  const showCompareButton = uploadedPhotos.length > 1;

  // Empty state
  if (photos.length === 0) {
    return <PhotoEmptyState onUploadClick={onUploadClick} />;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">
          My Progress {photos.length === 1 ? "Photo" : "Photos"}
        </h3>
        <div className="flex items-center gap-2">
          {isCompareMode ? (
            <>
              <span className="text-sm text-gray-600">
                Select 2 photos to compare
              </span>
              <Button
                variant="outline"
                onClick={onCancelCompare}
                className="text-gray-700"
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              {showCompareButton && (
                <Button
                  variant="outline"
                  onClick={onCompareClick}
                  className="border-skinbestie-primary text-skinbestie-primary hover:bg-skinbestie-primary/10"
                >
                  Compare
                </Button>
              )}
              <Button
                onClick={onUploadClick}
                className="bg-skinbestie-primary hover:bg-skinbestie-primary/90 text-white"
              >
                Upload
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Photos Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            isSelected={selectedPhotos.includes(photo.id)}
            showCheckmark={isCompareMode}
            onClick={() => onPhotoClick(photo.id)}
            onDelete={onDelete}
            onRetry={onRetry}
          />
        ))}
      </div>
    </div>
  );
}
