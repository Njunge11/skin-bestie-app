"use client";

import { useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PhotoUploadArea, type PhotoUploadAreaRef } from "./photo-upload-area";
import { PhotoGrid } from "./photo-grid";
import { PhotoGridSkeleton } from "./photo-grid-skeleton";
import { PhotoViewModal } from "./photo-view-modal";
import { ComparePhotosModal } from "./compare-photos-modal";
import { usePhotos } from "./hooks/use-photos";
import { useUpload } from "./upload-context";
import type { Photo } from "./progress-photos.types";

interface ProgressPhotosProps {
  userProfileId: string;
  isActive: boolean;
}

export function ProgressPhotos({
  userProfileId,
  isActive,
}: ProgressPhotosProps) {
  const queryClient = useQueryClient();
  const uploadAreaRef = useRef<PhotoUploadAreaRef>(null);

  // Get uploading photos from context
  const {
    uploadingPhotos,
    addUploadingPhoto,
    updateProgress,
    markAsUploaded,
    markAsFailed,
    removeUploadingPhoto,
  } = useUpload();

  // Fetch uploaded photos from API
  const { data: apiPhotos = [], isLoading } = usePhotos(
    userProfileId,
    isActive,
  );

  // Convert uploading photos to Photo format
  const uploadingList: Photo[] = uploadingPhotos.map((up) => ({
    id: up.id,
    name: up.file.name.replace(/\.[^/.]+$/, ""),
    size: parseFloat((up.file.size / (1024 * 1024)).toFixed(1)),
    url: up.blobUrl,
    uploadStatus: up.status as "uploading" | "uploaded" | "failed",
    uploadProgress: up.progress,
    file: up.file,
    addedAt: new Date().toISOString(),
  }));

  // Convert API photos to Photo format
  const apiList: Photo[] = apiPhotos.map((apiPhoto) => ({
    id: apiPhoto.id,
    name:
      apiPhoto.originalName ||
      new Date(apiPhoto.uploadedAt).toLocaleDateString(),
    size: parseFloat((apiPhoto.bytes / (1024 * 1024)).toFixed(1)),
    url: apiPhoto.imageUrl,
    uploadStatus: "uploaded" as const,
    uploadProgress: 100,
    apiData: apiPhoto,
  }));

  // Filter out blob photos that now exist in API (prevents duplicates)
  const activeUploading = uploadingList.filter((up) => {
    // Keep uploading/failed photos
    if (up.uploadStatus !== "uploaded") return true;

    // For "uploaded" blobs, check if API has this photo
    const existsInApi = apiList.some((api) => {
      const apiNameWithoutExt =
        api.apiData?.originalName?.replace(/\.[^/.]+$/, "") || api.name;
      return apiNameWithoutExt.toLowerCase() === up.name.toLowerCase();
    });

    // Hide duplicates
    return !existsInApi;
  });

  // Combine: active blobs first, then API photos
  const photos: Photo[] = [...activeUploading, ...apiList];

  const [isCompareMode, setIsCompareMode] = useState(false);
  const [selectedPhotosForCompare, setSelectedPhotosForCompare] = useState<
    string[]
  >([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [selectedPhotoForView, setSelectedPhotoForView] = useState<
    string | null
  >(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const getPhotoById = (id: string) => photos.find((photo) => photo.id === id);

  const handleCompareClick = () => {
    setIsCompareMode(true);
    setSelectedPhotosForCompare([]);
  };

  const handleCancelCompare = () => {
    setIsCompareMode(false);
    setSelectedPhotosForCompare([]);
  };

  const handlePhotoSelect = (photoId: string) => {
    if (!isCompareMode) {
      setSelectedPhotoForView(photoId);
      setIsViewModalOpen(true);
      return;
    }

    const newSelection = selectedPhotosForCompare.includes(photoId)
      ? selectedPhotosForCompare.filter((id) => id !== photoId)
      : [...selectedPhotosForCompare, photoId];

    setSelectedPhotosForCompare(newSelection);

    if (newSelection.length === 2) {
      setIsCompareModalOpen(true);
    }
  };

  const handleCompareModalClose = () => {
    setIsCompareModalOpen(false);
    setIsCompareMode(false);
    setSelectedPhotosForCompare([]);
  };

  const handleFileSelect = async (files: File[]) => {
    const { uploadPhoto } = await import("./photo-api");

    // Add all files to uploading state immediately
    const uploadIds = files.map((file) => addUploadingPhoto(file));

    // Upload each file
    const uploadPromises = files.map(async (file, index) => {
      const uploadId = uploadIds[index];

      try {
        await uploadPhoto({
          file,
          userProfileId,
          onProgress: (progress) => {
            updateProgress(uploadId, progress);
          },
        });

        // Upload successful - mark as uploaded (keep blob visible)
        markAsUploaded(uploadId);
      } catch (error) {
        console.error("Upload failed:", error);
        markAsFailed(uploadId);
      }
    });

    // Wait for all uploads
    await Promise.allSettled(uploadPromises);

    // Refetch API photos - blob will be deduped when API photo arrives
    queryClient.invalidateQueries({ queryKey: ["photos", userProfileId] });

    toast.success(
      `${files.length} photo${files.length > 1 ? "s" : ""} uploaded!`,
    );
  };

  const handleDelete = async (photoId: string) => {
    const photo = photos.find((p) => p.id === photoId);
    if (!photo) return;

    // If it's a blob photo (no apiData), just remove from context
    if (!photo.apiData) {
      removeUploadingPhoto(photoId);
      toast.success("Photo removed");
      return;
    }

    // It's from API - delete from backend
    try {
      const { deletePhoto: deletePhotoAPI } = await import("./photo-api");
      await deletePhotoAPI({
        photoId,
        userProfileId,
      });

      // Also remove any blob versions with the same filename from context
      const photoNameWithoutExt =
        photo.apiData?.originalName?.replace(/\.[^/.]+$/, "") || photo.name;
      uploadingPhotos.forEach((up) => {
        const blobNameWithoutExt = up.file.name.replace(/\.[^/.]+$/, "");
        if (
          blobNameWithoutExt.toLowerCase() === photoNameWithoutExt.toLowerCase()
        ) {
          removeUploadingPhoto(up.id);
        }
      });

      toast.success("Photo deleted");
      queryClient.invalidateQueries({ queryKey: ["photos", userProfileId] });
    } catch (error) {
      console.error("Failed to delete photo:", error);
      toast.error("Failed to delete photo");
    }
  };

  const handleRetry = async (photoId: string) => {
    const photo = photos.find((p) => p.id === photoId);
    if (!photo || !photo.file) return;

    // Reset to uploading
    updateProgress(photoId, 0);

    try {
      const { uploadPhoto } = await import("./photo-api");
      await uploadPhoto({
        file: photo.file,
        userProfileId,
        onProgress: (progress) => {
          updateProgress(photoId, progress);
        },
      });

      // Upload successful - mark as uploaded (keep blob visible)
      markAsUploaded(photoId);
      queryClient.invalidateQueries({ queryKey: ["photos", userProfileId] });
      toast.success("Photo uploaded!");
    } catch (error) {
      console.error("Retry failed:", error);
      markAsFailed(photoId);
      toast.error("Upload failed");
    }
  };

  const handleUploadClick = () => {
    uploadAreaRef.current?.triggerUpload();
  };

  return (
    <>
      <PhotoUploadArea ref={uploadAreaRef} onFileSelect={handleFileSelect} />

      {isLoading ? (
        <PhotoGridSkeleton />
      ) : (
        <PhotoGrid
          photos={photos}
          isCompareMode={isCompareMode}
          selectedPhotos={selectedPhotosForCompare}
          onPhotoClick={handlePhotoSelect}
          onCompareClick={handleCompareClick}
          onCancelCompare={handleCancelCompare}
          onUploadClick={handleUploadClick}
          onDelete={handleDelete}
          onRetry={handleRetry}
        />
      )}

      <PhotoViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        photo={
          selectedPhotoForView
            ? getPhotoById(selectedPhotoForView) || null
            : null
        }
      />

      <ComparePhotosModal
        isOpen={isCompareModalOpen}
        onClose={handleCompareModalClose}
        photo1={getPhotoById(selectedPhotosForCompare[0]) || null}
        photo2={getPhotoById(selectedPhotosForCompare[1]) || null}
      />
    </>
  );
}
