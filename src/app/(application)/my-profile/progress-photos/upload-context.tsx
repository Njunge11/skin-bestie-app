"use client";

import { createContext, useContext, useState, ReactNode } from "react";

/**
 * Represents a photo that is currently being uploaded
 */
interface UploadingPhoto {
  id: string; // Temporary UUID for tracking
  file: File; // Original file
  blobUrl: string; // blob: URL for immediate display
  progress: number; // 0-100
  status: "uploading" | "uploaded" | "failed";
}

interface UploadContextType {
  uploadingPhotos: UploadingPhoto[];
  addUploadingPhoto: (file: File) => string; // Returns the ID
  updateProgress: (id: string, progress: number) => void;
  markAsUploaded: (id: string) => void;
  markAsFailed: (id: string) => void;
  removeUploadingPhoto: (id: string) => void;
  clearAll: () => void;
}

const UploadContext = createContext<UploadContextType | undefined>(undefined);

export function UploadProvider({ children }: { children: ReactNode }) {
  const [uploadingPhotos, setUploadingPhotos] = useState<UploadingPhoto[]>([]);

  const addUploadingPhoto = (file: File): string => {
    const id = crypto.randomUUID();
    const blobUrl = URL.createObjectURL(file);

    setUploadingPhotos((prev) => [
      ...prev,
      {
        id,
        file,
        blobUrl,
        progress: 0,
        status: "uploading",
      },
    ]);

    return id;
  };

  const updateProgress = (id: string, progress: number) => {
    setUploadingPhotos((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, progress, status: progress === 100 ? "uploaded" : p.status }
          : p,
      ),
    );
  };

  const markAsUploaded = (id: string) => {
    setUploadingPhotos((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: "uploaded" as const, progress: 100 } : p,
      ),
    );
  };

  const markAsFailed = (id: string) => {
    setUploadingPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "failed" as const } : p)),
    );
  };

  const removeUploadingPhoto = (id: string) => {
    setUploadingPhotos((prev) => {
      const photo = prev.find((p) => p.id === id);
      if (photo) {
        URL.revokeObjectURL(photo.blobUrl); // Clean up blob URL
      }
      return prev.filter((p) => p.id !== id);
    });
  };

  const clearAll = () => {
    uploadingPhotos.forEach((p) => URL.revokeObjectURL(p.blobUrl));
    setUploadingPhotos([]);
  };

  return (
    <UploadContext.Provider
      value={{
        uploadingPhotos,
        addUploadingPhoto,
        updateProgress,
        markAsUploaded,
        markAsFailed,
        removeUploadingPhoto,
        clearAll,
      }}
    >
      {children}
    </UploadContext.Provider>
  );
}

export function useUpload() {
  const context = useContext(UploadContext);
  if (!context) {
    throw new Error("useUpload must be used within UploadProvider");
  }
  return context;
}

export type { UploadingPhoto };
