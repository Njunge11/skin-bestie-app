"use client";

import { useRef, forwardRef, useImperativeHandle } from "react";
import { toast } from "sonner";

interface PhotoUploadAreaProps {
  onFileSelect: (files: File[]) => void;
}

export interface PhotoUploadAreaRef {
  triggerUpload: () => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes (API limit)
const ACCEPTED_FORMATS = ["image/png", "image/jpeg", "image/jpg", "image/heic"];
const MAX_PHOTOS = 5;

export const PhotoUploadArea = forwardRef<
  PhotoUploadAreaRef,
  PhotoUploadAreaProps
>(({ onFileSelect }, ref) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Expose triggerUpload method to parent
  useImperativeHandle(ref, () => ({
    triggerUpload: () => {
      fileInputRef.current?.click();
    },
  }));

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!ACCEPTED_FORMATS.includes(file.type)) {
      return `${file.name}: Invalid format. Only PNG, JPEG, and HEIC are supported.`;
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return `${file.name}: File size exceeds 10MB limit.`;
    }

    return null;
  };

  const processFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    const errors: string[] = [];

    // Validate each file
    fileArray.forEach((file) => {
      const error = validateFile(file);
      if (error) {
        errors.push(error);
      } else {
        validFiles.push(file);
      }
    });

    // Show validation errors
    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
    }

    // Check total count
    if (validFiles.length > MAX_PHOTOS) {
      toast.error(`You can only upload up to ${MAX_PHOTOS} photos at a time`);
      return;
    }

    // Process valid files
    if (validFiles.length > 0) {
      onFileSelect(validFiles);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    // Reset input so same file can be selected again
    e.target.value = "";
  };

  return (
    <div className="space-y-6">
      {/* Upload Area - Commented out for now */}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_FORMATS.join(",")}
        multiple
        className="hidden"
        onChange={handleFileInputChange}
      />
    </div>
  );
});

PhotoUploadArea.displayName = "PhotoUploadArea";
