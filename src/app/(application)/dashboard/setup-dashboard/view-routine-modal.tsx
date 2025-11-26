"use client";

import { useState } from "react";
import { Sparkles, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RoutineItemCard } from "../shared/routine";
import { cn } from "@/lib/utils";

interface ViewRoutineModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  routine?: {
    morning?: Array<{
      id?: string;
      name?: string;
      productName?: string;
      instructions?: string | null;
      description?: string;
      routineStep?: string;
      productUrl?: string | null;
      order?: number;
    }>;
    evening?: Array<{
      id?: string;
      name?: string;
      productName?: string;
      instructions?: string | null;
      description?: string;
      routineStep?: string;
      productUrl?: string | null;
      order?: number;
    }>;
  };
}

export function ViewRoutineModal({
  open,
  onOpenChange,
  routine,
}: ViewRoutineModalProps) {
  const [activeTab, setActiveTab] = useState("morning");

  // Get routines from the object structure and sort by order
  const morningRoutine = (routine?.morning || []).sort(
    (a, b) => (a.order || 0) - (b.order || 0),
  );
  const eveningRoutine = (routine?.evening || []).sort(
    (a, b) => (a.order || 0) - (b.order || 0),
  );

  const hasRoutines = morningRoutine.length > 0 || eveningRoutine.length > 0;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-full bg-skinbestie-primary flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
        </div>

        {/* Header */}
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl font-bold text-center">
            Your Custom Routine
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600 text-center">
            Your personalised skincare routine tailored to your needs
          </DialogDescription>
        </DialogHeader>

        {hasRoutines ? (
          <div className="mt-4 space-y-4">
            {/* Helper Text */}
            <p className="text-sm text-gray-600">
              Switch to view your morning or evening routine
            </p>

            {/* Custom Switch Component */}
            <div className="space-y-4">
              {/* Toggle Switch */}
              <div className="relative flex items-center bg-skinbestie-primary rounded-full p-0.5 gap-0.5 w-fit">
                {/* Sun Icon Button */}
                <button
                  onClick={() => setActiveTab("morning")}
                  className={cn(
                    "relative z-10 flex items-center justify-center w-10 h-8 rounded-full transition-all",
                    activeTab === "morning"
                      ? "bg-white text-gray-900"
                      : "bg-transparent text-white",
                  )}
                >
                  <span className="text-lg">☀️</span>
                </button>

                {/* Moon Icon Button */}
                <button
                  onClick={() => setActiveTab("evening")}
                  className={cn(
                    "relative z-10 flex items-center justify-center w-10 h-8 rounded-full transition-all",
                    activeTab === "evening"
                      ? "bg-white text-gray-900"
                      : "bg-transparent text-white",
                  )}
                >
                  <span className="text-lg">🌙</span>
                </button>
              </div>

              {/* Routine Label */}
              <span className="text-xl font-semibold text-gray-900">
                {activeTab === "morning" ? "Morning" : "Evening"} Routine
              </span>
            </div>

            {/* Routine steps based on active tab */}
            <div className="space-y-3">
              {activeTab === "morning" ? (
                morningRoutine.length > 0 ? (
                  morningRoutine.map((item, index) => (
                    <RoutineItemCard
                      key={item.id || `morning-${index}`}
                      productName={item.productName || item.name || ""}
                      description={item.instructions || item.description || ""}
                      category={item.routineStep || ""}
                      productUrl={item.productUrl || ""}
                      showCheckbox={false}
                      showViewProduct={false}
                      productNameAsLink={false}
                    />
                  ))
                ) : (
                  <p className="text-gray-600">No morning routine steps yet.</p>
                )
              ) : eveningRoutine.length > 0 ? (
                eveningRoutine.map((item, index) => (
                  <RoutineItemCard
                    key={item.id || `evening-${index}`}
                    productName={item.productName || item.name || ""}
                    description={item.instructions || item.description || ""}
                    category={item.routineStep || ""}
                    productUrl={item.productUrl || ""}
                    showCheckbox={false}
                    showViewProduct={false}
                    productNameAsLink={false}
                  />
                ))
              ) : (
                <p className="text-gray-600">No evening routine steps yet.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-4 text-center py-8">
            <p className="text-gray-600">
              Your custom routine is being prepared. Check back soon!
            </p>
          </div>
        )}

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
