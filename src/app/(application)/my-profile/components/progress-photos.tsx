"use client";

import { useState } from "react";
import { X, Upload, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UploadedPhoto {
  id: string;
  name: string;
  size: number;
  url: string;
  uploadProgress: number;
}

export function ProgressPhotos() {
  const [photos, setPhotos] = useState<UploadedPhoto[]>([
    {
      id: "1",
      name: "family_pic",
      size: 11.2,
      url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=300&fit=crop",
      uploadProgress: 100,
    },
    {
      id: "2",
      name: "chewy",
      size: 8.6,
      url: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop",
      uploadProgress: 80,
    },
    {
      id: "3",
      name: "house",
      size: 9.7,
      url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
      uploadProgress: 54,
    },
    {
      id: "4",
      name: "beach",
      size: 10.6,
      url: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400&h=300&fit=crop",
      uploadProgress: 25,
    },
  ]);

  const handleFileSelect = () => {
    // Handle file selection
    console.log("File selection triggered");
  };

  const handleRemovePhoto = (id: string) => {
    setPhotos(photos.filter((photo) => photo.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        onClick={handleFileSelect}
        className="border-2 border-dashed border-skinbestie-primary/60 rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer hover:border-skinbestie-primary transition-colors bg-white"
      >
        <div className="w-16 h-16 bg-skinbestie-primary rounded-full flex items-center justify-center mb-4">
          <Upload className="w-8 h-8 text-white" />
        </div>
        <p className="text-lg font-medium text-gray-900 mb-2">
          Choose photos or drag them here
        </p>
        <p className="text-sm text-gray-500">Maximum 20 photos</p>
      </div>

      {/* File Info */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>Supported formats: png, jpeg, heic</span>
        <span>Maximum file size: 20 MB</span>
      </div>

      {/* Uploaded Photos Section */}
      {photos.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">
            Uploaded photo(s)
          </h3>

          {/* Photos Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="space-y-2">
                {/* Photo Card */}
                <div className="relative rounded-lg overflow-hidden aspect-[4/3] bg-gray-100">
                  <img
                    src={photo.url}
                    alt={photo.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay with name and size */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <p className="text-white text-sm font-medium">
                      {photo.name}
                    </p>
                    <p className="text-white/80 text-xs">
                      {photo.size.toFixed(1)} MB
                    </p>
                  </div>
                </div>

                {/* Upload Progress */}
                <div className="space-y-1">
                  {photo.uploadProgress === 100 ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <div className="w-full bg-green-100 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full w-full" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={cn(
                          "h-2 rounded-full transition-all",
                          photo.uploadProgress >= 50
                            ? "bg-red-500"
                            : "bg-red-600",
                        )}
                        style={{ width: `${photo.uploadProgress}%` }}
                      />
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    {photo.uploadProgress === 100 ? (
                      <div className="flex items-center gap-1 text-sm text-green-600">
                        <Check className="w-4 h-4" />
                        <span className="font-medium">Complete!</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-700">
                        Uploading {photo.uploadProgress}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
              onClick={() => setPhotos([])}
            >
              Cancel
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Continue
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
