"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { ZoomControls } from "./zoom-controls";
import { formatPhotoDate } from "./progress-photos.helpers";
import type { Photo } from "./progress-photos.types";

interface ComparePhotosModalProps {
  isOpen: boolean;
  onClose: () => void;
  photo1: Photo | null;
  photo2: Photo | null;
}

export function ComparePhotosModal({
  isOpen,
  onClose,
  photo1,
  photo2,
}: ComparePhotosModalProps) {
  if (!photo1 || !photo2) return null;

  const isBlob1 = photo1.url.startsWith("blob:");
  const isBlob2 = photo2.url.startsWith("blob:");

  const width1 = photo1.apiData?.width || 800;
  const height1 = photo1.apiData?.height || 1200;
  const width2 = photo2.apiData?.width || 800;
  const height2 = photo2.apiData?.height || 1200;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Compare Progress Photos
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-6">
          {/* Photo 1 */}
          <div className="space-y-2">
            <TransformWrapper
              initialScale={1}
              minScale={1}
              maxScale={4}
              centerOnInit
            >
              {({ zoomIn, zoomOut, resetTransform }) => (
                <>
                  <ZoomControls
                    onZoomIn={zoomIn}
                    onZoomOut={zoomOut}
                    onReset={resetTransform}
                    align="left"
                  />
                  <TransformComponent
                    wrapperClass="relative rounded-lg overflow-hidden aspect-[3/4] bg-gray-100"
                    contentClass="w-full h-full"
                  >
                    {isBlob1 ? (
                      <img
                        src={photo1.url}
                        alt={photo1.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Image
                        src={photo1.url}
                        alt={photo1.name}
                        width={width1}
                        height={height1}
                        className="w-full h-full object-cover"
                        sizes="(max-width: 768px) 50vw, 400px"
                      />
                    )}
                  </TransformComponent>
                </>
              )}
            </TransformWrapper>
            <p className="text-sm font-medium text-gray-900 text-center">
              {photo1.apiData?.uploadedAt
                ? formatPhotoDate(photo1.apiData.uploadedAt)
                : photo1.addedAt
                  ? formatPhotoDate(photo1.addedAt)
                  : photo1.name}
            </p>
          </div>

          {/* Photo 2 */}
          <div className="space-y-2">
            <TransformWrapper
              initialScale={1}
              minScale={1}
              maxScale={4}
              centerOnInit
            >
              {({ zoomIn, zoomOut, resetTransform }) => (
                <>
                  <ZoomControls
                    onZoomIn={zoomIn}
                    onZoomOut={zoomOut}
                    onReset={resetTransform}
                    align="left"
                  />
                  <TransformComponent
                    wrapperClass="relative rounded-lg overflow-hidden aspect-[3/4] bg-gray-100"
                    contentClass="w-full h-full"
                  >
                    {isBlob2 ? (
                      <img
                        src={photo2.url}
                        alt={photo2.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Image
                        src={photo2.url}
                        alt={photo2.name}
                        width={width2}
                        height={height2}
                        className="w-full h-full object-cover"
                        sizes="(max-width: 768px) 50vw, 400px"
                      />
                    )}
                  </TransformComponent>
                </>
              )}
            </TransformWrapper>
            <p className="text-sm font-medium text-gray-900 text-center">
              {photo2.apiData?.uploadedAt
                ? formatPhotoDate(photo2.apiData.uploadedAt)
                : photo2.addedAt
                  ? formatPhotoDate(photo2.addedAt)
                  : photo2.name}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
