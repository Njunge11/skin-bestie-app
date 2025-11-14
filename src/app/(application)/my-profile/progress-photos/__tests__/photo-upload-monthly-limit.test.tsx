import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PhotoGrid } from "../photo-grid";
import { formatPhotoLabel } from "../progress-photos.helpers";
import type { Photo } from "../progress-photos.types";

/**
 * PHOTO UPLOAD - MONTHLY LIMIT TESTS
 *
 * Testing Strategy (per UI_TESTING.md):
 * - Test complete user workflows from user's perspective
 * - Focus on observable effects (UI state, disabled buttons, status text)
 * - Query like a user would (getByRole, getByText)
 * - Use userEvent for interactions
 *
 * Critical scenarios:
 * 1. Monthly upload status displays correctly
 * 2. Upload button disabled when limit reached
 * 3. Photo labels show formatted dates
 */

// Mock data factories
const createMockPhoto = (overrides: Partial<Photo> = {}): Photo => ({
  id: crypto.randomUUID(),
  name: "November 14th, 2025",
  size: 1.5,
  url: "https://example.com/photo.jpg",
  uploadStatus: "uploaded",
  uploadProgress: 100,
  apiData: {
    id: crypto.randomUUID(),
    userProfileId: "user-123",
    imageUrl: "https://example.com/photo.jpg",
    s3Key: "photos/user-123/photo.jpg",
    s3Bucket: "test-bucket",
    originalName: "photo.jpg",
    bytes: 1500000,
    mime: "image/jpeg",
    width: 800,
    height: 1200,
    weekNumber: null,
    uploadedAt: "2025-11-14T10:00:00.000Z",
    feedback: null,
    status: "uploaded",
    createdAt: "2025-11-14T10:00:00.000Z",
    updatedAt: "2025-11-14T10:00:00.000Z",
  },
  ...overrides,
});

describe("Photo Upload - Monthly Limit Tests", () => {
  const mockOnPhotoClick = vi.fn();
  const mockOnCompareClick = vi.fn();
  const mockOnCancelCompare = vi.fn();
  const mockOnUploadClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Monthly Upload Status Display", () => {
    it("shows 0 of 2 used with 2 remaining when no photos uploaded this month", () => {
      const monthlyStatus = {
        uploaded: 0,
        limit: 2,
        remaining: 2,
        monthName: "November",
      };

      render(
        <PhotoGrid
          photos={[]}
          isCompareMode={false}
          selectedPhotos={[]}
          onPhotoClick={mockOnPhotoClick}
          onCompareClick={mockOnCompareClick}
          onCancelCompare={mockOnCancelCompare}
          onUploadClick={mockOnUploadClick}
          monthlyUploadStatus={monthlyStatus}
        />,
      );

      // User sees empty state (no photos)
      expect(screen.getByText(/no photos yet/i)).toBeInTheDocument();
      expect(
        screen.getByText(
          /track your skin journey by uploading progress photos/i,
        ),
      ).toBeInTheDocument();
    });

    it("shows 1 of 2 used with 1 remaining when 1 photo uploaded this month", () => {
      const photo = createMockPhoto();
      const monthlyStatus = {
        uploaded: 1,
        limit: 2,
        remaining: 1,
        monthName: "November",
      };

      render(
        <PhotoGrid
          photos={[photo]}
          isCompareMode={false}
          selectedPhotos={[]}
          onPhotoClick={mockOnPhotoClick}
          onCompareClick={mockOnCompareClick}
          onCancelCompare={mockOnCancelCompare}
          onUploadClick={mockOnUploadClick}
          monthlyUploadStatus={monthlyStatus}
        />,
      );

      // User sees monthly status
      expect(screen.getByText(/November uploads:/i)).toBeInTheDocument();
      expect(screen.getByText(/1 of 2 used/i)).toBeInTheDocument();
      expect(screen.getByText(/\(1 remaining\)/i)).toBeInTheDocument();

      // Upload button should be enabled
      expect(
        screen.getByRole("button", { name: /upload/i }),
      ).not.toBeDisabled();
    });

    it("shows 2 of 2 used with limit reached when 2 photos uploaded this month", () => {
      const photos = [createMockPhoto(), createMockPhoto()];
      const monthlyStatus = {
        uploaded: 2,
        limit: 2,
        remaining: 0,
        monthName: "November",
      };

      render(
        <PhotoGrid
          photos={photos}
          isCompareMode={false}
          selectedPhotos={[]}
          onPhotoClick={mockOnPhotoClick}
          onCompareClick={mockOnCompareClick}
          onCancelCompare={mockOnCancelCompare}
          onUploadClick={mockOnUploadClick}
          monthlyUploadStatus={monthlyStatus}
        />,
      );

      // User sees monthly status
      expect(screen.getByText(/November uploads:/i)).toBeInTheDocument();
      expect(screen.getByText(/2 of 2 used/i)).toBeInTheDocument();
      expect(screen.getByText(/\(limit reached\)/i)).toBeInTheDocument();

      // Upload button should be disabled
      expect(screen.getByRole("button", { name: /upload/i })).toBeDisabled();
    });

    it("shows status in orange when limit is reached", () => {
      const photos = [createMockPhoto(), createMockPhoto()];
      const monthlyStatus = {
        uploaded: 2,
        limit: 2,
        remaining: 0,
        monthName: "November",
      };

      render(
        <PhotoGrid
          photos={photos}
          isCompareMode={false}
          selectedPhotos={[]}
          onPhotoClick={mockOnPhotoClick}
          onCompareClick={mockOnCompareClick}
          onCancelCompare={mockOnCancelCompare}
          onUploadClick={mockOnUploadClick}
          monthlyUploadStatus={monthlyStatus}
        />,
      );

      // The "2 of 2 used" text should have orange styling when limit reached
      const usedText = screen.getByText(/2 of 2 used/i);
      expect(usedText).toHaveClass("text-orange-600");

      // The limit reached text should also be orange
      const limitText = screen.getByText(/\(limit reached\)/i);
      expect(limitText).toHaveClass("text-orange-600");
    });
  });

  describe("Photo Date Label Formatting", () => {
    it("formats dates with correct ordinal suffixes", () => {
      const testCases = [
        { date: "2025-11-01T10:00:00.000Z", expected: "November 1st, 2025" },
        { date: "2025-11-02T10:00:00.000Z", expected: "November 2nd, 2025" },
        { date: "2025-11-03T10:00:00.000Z", expected: "November 3rd, 2025" },
        { date: "2025-11-04T10:00:00.000Z", expected: "November 4th, 2025" },
        { date: "2025-11-11T10:00:00.000Z", expected: "November 11th, 2025" },
        { date: "2025-11-21T10:00:00.000Z", expected: "November 21st, 2025" },
        { date: "2025-11-22T10:00:00.000Z", expected: "November 22nd, 2025" },
        { date: "2025-11-23T10:00:00.000Z", expected: "November 23rd, 2025" },
        { date: "2025-11-30T10:00:00.000Z", expected: "November 30th, 2025" },
      ];

      testCases.forEach(({ date, expected }) => {
        const formatted = formatPhotoLabel(date);
        expect(formatted).toBe(expected);
      });
    });

    it("photo card displays formatted date as label", () => {
      const photo = createMockPhoto({
        name: "November 14th, 2025",
      });

      render(
        <PhotoGrid
          photos={[photo]}
          isCompareMode={false}
          selectedPhotos={[]}
          onPhotoClick={mockOnPhotoClick}
          onCompareClick={mockOnCompareClick}
          onCancelCompare={mockOnCancelCompare}
          onUploadClick={mockOnUploadClick}
          monthlyUploadStatus={{
            uploaded: 1,
            limit: 2,
            remaining: 1,
            monthName: "November",
          }}
        />,
      );

      // User sees formatted date label on photo card
      expect(screen.getByText("November 14th, 2025")).toBeInTheDocument();
    });
  });

  describe("User Interactions", () => {
    it("user clicks upload button when slots available", async () => {
      const user = userEvent.setup();
      const photo = createMockPhoto();

      render(
        <PhotoGrid
          photos={[photo]}
          isCompareMode={false}
          selectedPhotos={[]}
          onPhotoClick={mockOnPhotoClick}
          onCompareClick={mockOnCompareClick}
          onCancelCompare={mockOnCancelCompare}
          onUploadClick={mockOnUploadClick}
          monthlyUploadStatus={{
            uploaded: 1,
            limit: 2,
            remaining: 1,
            monthName: "November",
          }}
        />,
      );

      // User clicks upload button
      await user.click(screen.getByRole("button", { name: /upload/i }));

      // Upload handler should be called
      expect(mockOnUploadClick).toHaveBeenCalledTimes(1);
    });

    it("upload button is disabled when limit reached", async () => {
      const photos = [createMockPhoto(), createMockPhoto()];

      render(
        <PhotoGrid
          photos={photos}
          isCompareMode={false}
          selectedPhotos={[]}
          onPhotoClick={mockOnPhotoClick}
          onCompareClick={mockOnCompareClick}
          onCancelCompare={mockOnCancelCompare}
          onUploadClick={mockOnUploadClick}
          monthlyUploadStatus={{
            uploaded: 2,
            limit: 2,
            remaining: 0,
            monthName: "November",
          }}
        />,
      );

      // Upload button should be disabled
      const uploadButton = screen.getByRole("button", { name: /upload/i });
      expect(uploadButton).toBeDisabled();
    });
  });
});
