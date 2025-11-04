"use client";

import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  align?: "left" | "right";
}

export function ZoomControls({
  onZoomIn,
  onZoomOut,
  onReset,
  align = "left",
}: ZoomControlsProps) {
  const justifyClass = align === "right" ? "justify-end" : "justify-start";

  const handleZoomIn = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onZoomIn();
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onZoomOut();
  };

  const handleReset = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onReset();
  };

  return (
    <div className={`flex items-center gap-2 mb-2 ${justifyClass}`}>
      <Button
        size="icon"
        variant="outline"
        onClick={handleZoomIn}
        className="h-8 w-8"
        type="button"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        variant="outline"
        onClick={handleZoomOut}
        className="h-8 w-8"
        type="button"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        variant="outline"
        onClick={handleReset}
        className="h-8 w-8"
        type="button"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
    </div>
  );
}
