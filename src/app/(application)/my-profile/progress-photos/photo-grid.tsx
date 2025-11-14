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
  monthlyUploadStatus?: {
    uploaded: number;
    limit: number;
    remaining: number;
    monthName: string;
  };
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
  monthlyUploadStatus,
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
      <div className="space-y-4">
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
                  disabled={monthlyUploadStatus?.remaining === 0}
                >
                  Upload
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Monthly Upload Status */}
        {monthlyUploadStatus && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">
              {monthlyUploadStatus.monthName} uploads:
            </span>
            <span
              className={
                monthlyUploadStatus.remaining > 0
                  ? "font-medium text-gray-900"
                  : "font-medium text-orange-600"
              }
            >
              {monthlyUploadStatus.uploaded} of {monthlyUploadStatus.limit} used
            </span>
            {monthlyUploadStatus.remaining > 0 ? (
              <span className="text-gray-500">
                ({monthlyUploadStatus.remaining} remaining)
              </span>
            ) : (
              <span className="text-orange-600">(limit reached)</span>
            )}
          </div>
        )}
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
