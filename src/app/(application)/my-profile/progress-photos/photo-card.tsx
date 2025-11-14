"use client";

import { useState } from "react";
import Image from "next/image";
import { X, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Photo } from "./progress-photos.types";

interface PhotoCardProps {
  photo: Photo;
  isSelected?: boolean;
  showCheckmark?: boolean;
  onClick?: () => void;
  onDelete?: (photoId: string) => void;
  onRetry?: (photoId: string) => void;
}

export function PhotoCard({
  photo,
  isSelected = false,
  onClick,
  onDelete,
  onRetry,
}: PhotoCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const isUploading = photo.uploadStatus === "uploading";
  const isFailed = photo.uploadStatus === "failed";

  // Use photo URL directly
  const displayUrl = photo.url;
  // Check if it's a blob URL (local) or remote URL
  const isBlobUrl = displayUrl.startsWith("blob:");

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    onDelete?.(photo.id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <div className="space-y-2">
        <div
          className={cn(
            "relative rounded-lg overflow-hidden aspect-[3/4] bg-gray-100 group",
            !isUploading && "cursor-pointer",
            isSelected && "ring-4 ring-skinbestie-primary",
          )}
          onClick={!isUploading ? onClick : undefined}
        >
          {/* Delete button - top right corner */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10 h-8 w-8 rounded-full bg-black/50 hover:bg-black/70 text-white hover:text-skinbestie-primary"
            onClick={handleDeleteClick}
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Image */}
          {isBlobUrl ? (
            <img
              src={displayUrl}
              alt={photo.name}
              className={cn(
                "w-full h-full object-cover",
                (isUploading || isFailed) && "opacity-50",
              )}
            />
          ) : (
            <Image
              src={displayUrl}
              alt={photo.name}
              fill
              className={cn(
                "object-cover",
                (isUploading || isFailed) && "opacity-50",
              )}
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          )}

          {/* Uploading overlay */}
          {isUploading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
              <div className="w-3/4">
                <Progress
                  value={photo.uploadProgress || 0}
                  className="h-2 bg-white/20"
                />
                <p className="text-white text-xs text-center mt-2 font-medium">
                  {photo.uploadProgress || 0}%
                </p>
              </div>
            </div>
          )}

          {/* Failed overlay with retry */}
          {isFailed && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60">
              <p className="text-white text-sm mb-3">Upload failed</p>
              {onRetry && (
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRetry(photo.id);
                  }}
                  className="bg-skinbestie-primary hover:bg-skinbestie-primary/90"
                >
                  <RotateCw className="w-4 h-4 mr-2" />
                  Retry
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Photo label with date */}
        <p className="text-sm text-gray-600">{photo.name}</p>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Photo</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this photo? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-skinbestie-primary hover:bg-skinbestie-primary/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
