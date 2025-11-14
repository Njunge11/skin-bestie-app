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
import type { Photo } from "./progress-photos.types";

interface PhotoViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  photo: Photo | null;
}

export function PhotoViewModal({
  isOpen,
  onClose,
  photo,
}: PhotoViewModalProps) {
  if (!photo) return null;

  const isBlobUrl = photo.url.startsWith("blob:");
  const width = photo.apiData?.width || 800;
  const height = photo.apiData?.height || 1200;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl flex justify-center">
        <div className="max-w-md space-y-4">
          <DialogHeader className="text-left">
            <DialogTitle className="text-xl font-bold">
              {photo.name}
            </DialogTitle>
          </DialogHeader>
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
                  wrapperClass="relative rounded-lg overflow-hidden aspect-[3/4] bg-gray-100 min-h-[500px]"
                  contentClass="w-full h-full"
                >
                  {isBlobUrl ? (
                    <img
                      src={photo.url}
                      alt={photo.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image
                      src={photo.url}
                      alt={photo.name}
                      width={width}
                      height={height}
                      placeholder="empty"
                      className="w-full h-full object-cover"
                      sizes="(max-width: 768px) 100vw, 600px"
                    />
                  )}
                </TransformComponent>
              </>
            )}
          </TransformWrapper>
        </div>
      </DialogContent>
    </Dialog>
  );
}
