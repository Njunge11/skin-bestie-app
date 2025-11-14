"use client";

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

interface ViewRoutineModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  routine?: {
    morning?: Array<{
      id?: string;
      name?: string;
      productName?: string;
      instructions?: string;
      description?: string;
      routineStep?: string;
      productUrl?: string | null;
      order?: number;
    }>;
    evening?: Array<{
      id?: string;
      name?: string;
      productName?: string;
      instructions?: string;
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
          <>
            {/* Morning Routine */}
            {morningRoutine.length > 0 && (
              <div className="mt-4 space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <span>☀️</span>
                  <span>Morning Routine</span>
                </h3>
                <div className="space-y-3">
                  {morningRoutine.map((item, index) => (
                    <RoutineItemCard
                      key={item.id || `morning-${index}`}
                      productName={item.productName || item.name || ""}
                      description={item.instructions || item.description || ""}
                      category={item.routineStep || ""}
                      productUrl={item.productUrl || ""}
                      showCheckbox={false}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Evening Routine */}
            {eveningRoutine.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <span>🌙</span>
                  <span>Evening Routine</span>
                </h3>
                <div className="space-y-3">
                  {eveningRoutine.map((item, index) => (
                    <RoutineItemCard
                      key={item.id || `evening-${index}`}
                      productName={item.productName || item.name || ""}
                      description={item.instructions || item.description || ""}
                      category={item.routineStep || ""}
                      productUrl={item.productUrl || ""}
                      showCheckbox={false}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
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
