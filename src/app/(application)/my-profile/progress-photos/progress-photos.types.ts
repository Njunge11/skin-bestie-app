// API Photo from backend
export interface ApiPhoto {
  id: string;
  userProfileId: string;
  s3Key: string;
  s3Bucket: string;
  bytes: number;
  mime: string;
  imageUrl: string;
  status: "uploaded";
  weekNumber: number | null;
  originalName: string | null;
  width: number | null;
  height: number | null;
  feedback: string | null;
  uploadedAt: string;
  createdAt: string;
  updatedAt: string;
}

// Local photo state (includes upload progress)
export interface Photo {
  id: string;
  name: string;
  size: number; // in MB for display
  url: string;
  uploadStatus?: "pending" | "uploading" | "uploaded" | "failed";
  uploadProgress?: number; // 0-100
  file?: File; // Original file for upload
  addedAt?: string; // Local timestamp when file was added
  apiData?: ApiPhoto; // Data from API after upload
}
