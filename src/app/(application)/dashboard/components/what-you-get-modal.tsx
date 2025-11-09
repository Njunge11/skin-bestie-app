"use client";

import {
  Package,
  Clock,
  Phone,
  MessageCircle,
  TrendingUp,
  BookOpen,
  Users,
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
    icon: Clock,
    title: "Personalised routine within 24 hours",
  },
  {
    icon: Phone,
    title: "Monthly coaching call",
  },
  {
    icon: MessageCircle,
    title: "Weekly WhatsApp check-ins",
  },
  {
    icon: TrendingUp,
    title: "Interactive progress tracker",
  },
  {
    icon: BookOpen,
    title: "Reflection journal",
  },
  {
    icon: Users,
    title: "Supportive community",
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
                  <h3 className="font-semibold text-base text-gray-900">
                    {feature.title}
                  </h3>
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
