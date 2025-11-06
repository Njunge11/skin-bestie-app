"use server";

import { api } from "@/lib/api-client";
import type { ApiPhoto } from "../progress-photos.types";

interface PresignResponse {
  success: boolean;
  data: {
    uploadUrl: string;
    s3Key: string;
    photoId: string;
    expiresIn: number;
  };
}

interface ListPhotosResponse {
  success: boolean;
  data: ApiPhoto[];
}

/**
 * Server Action: Request presigned URL for upload
 */
export async function requestPresignedUrlAction(params: {
  userProfileId: string;
  mime: string;
  extension: string;
  bytes: number;
}) {
  try {
    const response: PresignResponse = await api.post(
      "/api/consumer-app/photos/presign",
      params,
    );
    return response.data;
  } catch (error) {
    console.error("Failed to request presigned URL:", error);
    throw new Error("Failed to request presigned URL");
  }
}

/**
 * Server Action: Confirm upload and create database record
 */
export async function confirmUploadAction(params: {
  userProfileId: string;
  s3Key: string;
  s3Bucket: string;
  bytes: number;
  mime: string;
  imageUrl: string;
  weekNumber?: number;
  originalName?: string;
  width?: number;
  height?: number;
}): Promise<ApiPhoto> {
  try {
    const response = await api.post("/api/consumer-app/photos/confirm", params);
    return response.data;
  } catch (error) {
    console.error("Failed to confirm photo upload:", error);
    throw new Error("Failed to confirm photo upload");
  }
}

/**
 * Server Action: Fetch all photos for a user
 */
export async function fetchPhotosAction(params: {
  userProfileId: string;
  limit?: number;
  offset?: number;
  weekNumber?: number;
}): Promise<ApiPhoto[]> {
  try {
    const searchParams = new URLSearchParams({
      userProfileId: params.userProfileId,
      ...(params.limit && { limit: params.limit.toString() }),
      ...(params.offset && { offset: params.offset.toString() }),
      ...(params.weekNumber && { weekNumber: params.weekNumber.toString() }),
    });

    const response: ListPhotosResponse = await api.get(
      `/api/consumer-app/photos?${searchParams}`,
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch photos:", error);
    throw new Error("Failed to fetch photos");
  }
}

/**
 * Server Action: Delete a photo
 */
export async function deletePhotoAction(params: {
  photoId: string;
  userProfileId: string;
}): Promise<void> {
  try {
    await api.delete(
      `/api/consumer-app/photos/${params.photoId}?userProfileId=${params.userProfileId}`,
    );
  } catch (error) {
    console.error("Failed to delete photo:", error);
    throw new Error("Failed to delete photo");
  }
}
