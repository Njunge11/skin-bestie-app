import type { ApiPhoto } from "./progress-photos.types";
import {
  requestPresignedUrlAction,
  confirmUploadAction,
  deletePhotoAction,
} from "./actions/photo-actions";
import { getImageDimensions } from "./progress-photos.helpers";

/**
 * Step 2: Upload file to S3 using presigned URL with progress tracking
 */
export async function uploadToS3(
  uploadUrl: string,
  file: File,
  onProgress?: (progress: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // Track upload progress
    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable && onProgress) {
        const progress = Math.round((event.loaded / event.total) * 100);
        onProgress(progress);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status === 200) {
        resolve();
      } else {
        reject(new Error(`S3 upload failed with status ${xhr.status}`));
      }
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Network error during S3 upload"));
    });

    xhr.addEventListener("abort", () => {
      reject(new Error("Upload aborted"));
    });

    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.send(file);
  });
}

/**
 * Complete photo upload flow (3 steps)
 */
export async function uploadPhoto(params: {
  file: File;
  userProfileId: string;
  weekNumber?: number;
  onProgress?: (progress: number) => void;
}): Promise<ApiPhoto> {
  const { file, userProfileId, weekNumber, onProgress } = params;

  // Extract file metadata
  const bytes = file.size;
  const mime = file.type;
  const extension = file.name.split(".").pop() || "jpg";
  const originalName = file.name;

  // Get image dimensions if possible
  let width: number | undefined;
  let height: number | undefined;

  if (file.type.startsWith("image/")) {
    try {
      const dimensions = await getImageDimensions(file);
      width = dimensions.width;
      height = dimensions.height;
    } catch (error) {
      console.warn("Could not get image dimensions:", error);
    }
  }

  // Step 1: Request presigned URL
  const presignData = await requestPresignedUrlAction({
    userProfileId,
    mime,
    extension,
    bytes,
  });

  // Step 2: Upload to S3
  await uploadToS3(presignData.uploadUrl, file, onProgress);

  // Step 3: Confirm upload
  const bucketName =
    process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME || "skinbestie-photos";
  const cloudFrontDomain = process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_DOMAIN;
  const imageUrl = cloudFrontDomain
    ? `https://${cloudFrontDomain}/${presignData.s3Key}`
    : `https://${bucketName}.s3.amazonaws.com/${presignData.s3Key}`;

  const photo = await confirmUploadAction({
    userProfileId,
    s3Key: presignData.s3Key,
    s3Bucket: bucketName,
    bytes,
    mime,
    imageUrl,
    weekNumber,
    originalName,
    width,
    height,
  });

  return photo;
}

/**
 * Delete a photo
 */
export async function deletePhoto(params: {
  photoId: string;
  userProfileId: string;
}): Promise<void> {
  return deletePhotoAction(params);
}
