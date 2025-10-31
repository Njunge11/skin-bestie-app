"use client";

import {
  Package,
  ClipboardList,
  TrendingUp,
  Camera,
  MessageSquare,
  BookOpen,
  Award,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface WhatYouGetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const features = [
  {
    icon: ClipboardList,
    title: "Personalized Routines",
    description:
      "Custom morning and evening skincare routines tailored to your unique skin type, concerns and goals.",
  },
  {
    icon: TrendingUp,
    title: "Daily Progress Tracking",
    description:
      "Custom morning and evening skincare routines tailored to your unique skin type, concerns and goals.",
  },
  {
    icon: Camera,
    title: "Before/After Photos",
    description:
      "Custom morning and evening skincare routines tailored to your unique skin type, concerns and goals.",
  },
  {
    icon: MessageSquare,
    title: "Expert Coach Support",
    description:
      "Custom morning and evening skincare routines tailored to your unique skin type, concerns and goals.",
  },
  {
    icon: BookOpen,
    title: "Skin Journey Journal",
    description:
      "Custom morning and evening skincare routines tailored to your unique skin type, concerns and goals.",
  },
  {
    icon: Award,
    title: "Achievement Tracking",
    description:
      "Custom morning and evening skincare routines tailored to your unique skin type, concerns and goals.",
  },
];

export function WhatYouGetModal({ open, onOpenChange }: WhatYouGetModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-full bg-skinbestie-primary flex items-center justify-center">
            <Package className="h-6 w-6 text-white" />
          </div>
        </div>

        {/* Header */}
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl font-bold text-center">
            What You Get With SkinBestie
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600 text-center">
            Everything you need for your skin transformation journey
          </DialogDescription>
        </DialogHeader>

        {/* Features */}
        <div className="space-y-3 mt-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-skinbestie-primary flex items-center justify-center">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 self-center">
                  <h3 className="font-bold text-sm text-gray-700 mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-700">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Close Button */}
        <div className="mt-6">
          <Button
            onClick={() => onOpenChange(false)}
            className="w-full bg-skinbestie-primary hover:bg-skinbestie-primary/90 text-white"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
