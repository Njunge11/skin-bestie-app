"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { Photo } from "./progress-photos.types";

interface ProgressPhotosContextType {
  photos: Photo[];
  addPhotos: (files: File[]) => Photo[];
  removePhoto: (id: string) => void;
  clearPhotos: () => void;
  uploadPhotos: (
    photosToUpload: Photo[],
    userProfileId: string,
    weekNumber?: number,
  ) => Promise<void>;
  deletePhoto: (photoId: string) => Promise<void>;
  retryUpload: (
    photoId: string,
    userProfileId: string,
    weekNumber?: number,
  ) => Promise<void>;
}

const ProgressPhotosContext = createContext<
  ProgressPhotosContextType | undefined
>(undefined);

export function ProgressPhotosProvider({ children }: { children: ReactNode }) {
  const [photos, setPhotos] = useState<Photo[]>([]);

  const addPhotos = (files: File[]): Photo[] => {
    // Convert files to Photo objects with preview URLs
    const newPhotos: Photo[] = files.map((file) => ({
      id: crypto.randomUUID(),
      name: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
      size: parseFloat((file.size / (1024 * 1024)).toFixed(1)), // Convert to MB
      url: URL.createObjectURL(file), // Create preview URL
      uploadStatus: "pending",
      uploadProgress: 0,
      file, // Store original file
      addedAt: new Date().toISOString(), // Timestamp when file was added
    }));

    // Add new photos to the existing photos array
    setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);

    // Return the newly added photos so they can be uploaded immediately
    return newPhotos;
  };

  const removePhoto = (id: string) => {
    setPhotos((prevPhotos) => {
      const photoToRemove = prevPhotos.find((photo) => photo.id === id);
      // Revoke the object URL to free memory
      if (photoToRemove) {
        URL.revokeObjectURL(photoToRemove.url);
      }
      return prevPhotos.filter((photo) => photo.id !== id);
    });
  };

  const clearPhotos = () => {
    // Revoke all object URLs to free memory
    photos.forEach((photo) => {
      URL.revokeObjectURL(photo.url);
    });
    setPhotos([]);
  };

  const uploadPhotos = async (
    photosToUpload: Photo[],
    userProfileId: string,
    weekNumber?: number,
  ) => {
    const { uploadPhoto: uploadPhotoAPI } = await import("./photo-api");

    if (photosToUpload.length === 0) return;

    // Upload all photos in parallel using Promise.allSettled
    const uploadPromises = photosToUpload.map(async (photo) => {
      if (!photo.file) return;

      try {
        // Update status to uploading
        setPhotos((prev) =>
          prev.map((p) =>
            p.id === photo.id
              ? { ...p, uploadStatus: "uploading" as const, uploadProgress: 0 }
              : p,
          ),
        );

        // Upload photo with progress tracking
        const apiPhoto = await uploadPhotoAPI({
          file: photo.file,
          userProfileId,
          weekNumber,
          onProgress: (progress) => {
            setPhotos((prev) =>
              prev.map((p) =>
                p.id === photo.id ? { ...p, uploadProgress: progress } : p,
              ),
            );
          },
        });

        // Mark as uploaded and keep local blob URL for smooth display
        setPhotos((prev) =>
          prev.map((p) =>
            p.id === photo.id
              ? {
                  ...p,
                  uploadStatus: "uploaded" as const,
                  uploadProgress: 100,
                  apiData: apiPhoto,
                  // Keep using local blob URL instead of switching to S3
                  // This prevents image flicker during upload
                }
              : p,
          ),
        );
      } catch (error) {
        console.error(`Failed to upload photo ${photo.id}:`, error);
        setPhotos((prev) =>
          prev.map((p) =>
            p.id === photo.id
              ? { ...p, uploadStatus: "failed" as const, uploadProgress: 0 }
              : p,
          ),
        );
      }
    });

    await Promise.allSettled(uploadPromises);
  };

  const deletePhoto = async (photoId: string) => {
    // This only handles deletion of local photos (pending/uploading)
    // API photos are deleted directly in progress-photos.tsx
    removePhoto(photoId);
  };

  const retryUpload = async (
    photoId: string,
    userProfileId: string,
    weekNumber?: number,
  ) => {
    // Use callback form to get current photo
    let photoToRetry: Photo | undefined;
    setPhotos((prev) => {
      photoToRetry = prev.find((p) => p.id === photoId);
      return prev;
    });

    if (!photoToRetry || !photoToRetry.file) return;

    try {
      const { uploadPhoto: uploadPhotoAPI } = await import("./photo-api");

      // Reset status
      setPhotos((prev) =>
        prev.map((p) =>
          p.id === photoId
            ? { ...p, uploadStatus: "uploading" as const, uploadProgress: 0 }
            : p,
        ),
      );

      // Upload photo
      const apiPhoto = await uploadPhotoAPI({
        file: photoToRetry.file,
        userProfileId,
        weekNumber,
        onProgress: (progress) => {
          setPhotos((prev) =>
            prev.map((p) =>
              p.id === photoId ? { ...p, uploadProgress: progress } : p,
            ),
          );
        },
      });

      // Update with API data and keep local blob URL
      setPhotos((prev) =>
        prev.map((p) =>
          p.id === photoId
            ? {
                ...p,
                uploadStatus: "uploaded" as const,
                uploadProgress: 100,
                apiData: apiPhoto,
                // Keep using local blob URL instead of switching to S3
              }
            : p,
        ),
      );
    } catch (error) {
      console.error(`Failed to retry upload for photo ${photoId}:`, error);
      setPhotos((prev) =>
        prev.map((p) =>
          p.id === photoId
            ? { ...p, uploadStatus: "failed" as const, uploadProgress: 0 }
            : p,
        ),
      );
      throw error;
    }
  };

  return (
    <ProgressPhotosContext.Provider
      value={{
        photos,
        addPhotos,
        removePhoto,
        clearPhotos,
        uploadPhotos,
        deletePhoto,
        retryUpload,
      }}
    >
      {children}
    </ProgressPhotosContext.Provider>
  );
}

export function useProgressPhotos() {
  const context = useContext(ProgressPhotosContext);
  if (!context) {
    throw new Error(
      "useProgressPhotos must be used within ProgressPhotosProvider",
    );
  }
  return context;
}
