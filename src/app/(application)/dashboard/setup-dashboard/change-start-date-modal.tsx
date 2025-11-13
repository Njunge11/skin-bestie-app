"use client";

import { useState } from "react";
import { format } from "date-fns";
import { X, Calendar as CalendarIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ChangeStartDateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (startDate: Date) => Promise<boolean>;
  currentStartDate?: Date;
}

export function ChangeStartDateModal({
  open,
  onOpenChange,
  onConfirm,
  currentStartDate,
}: ChangeStartDateModalProps) {
  const [selectedOption, setSelectedOption] = useState<
    "today" | "tomorrow" | "specify" | null
  >(null);
  const [customDate, setCustomDate] = useState<Date | undefined>(undefined);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = async () => {
    setIsConfirming(true);

    let startDate: Date;

    if (selectedOption === "today") {
      startDate = new Date();
    } else if (selectedOption === "tomorrow") {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      startDate = tomorrow;
    } else {
      // specify - use custom date
      startDate = customDate || new Date();
    }

    try {
      // Call onConfirm and wait for result
      const success = await onConfirm(startDate);

      // Only close modal if successful
      if (success) {
        onOpenChange(false);
      }
    } finally {
      setIsConfirming(false);
    }
  };

  // Get formatted dates
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const formatDate = (date: Date) => {
    return format(date, "EEEE, MMMM d");
  };

  // Check if confirm button should be disabled
  const isConfirmDisabled =
    !selectedOption ||
    (selectedOption === "specify" && !customDate) ||
    isConfirming;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        {/* Close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-full bg-skinbestie-primary flex items-center justify-center">
            <CalendarIcon className="h-6 w-6 text-white" />
          </div>
        </div>

        {/* Header */}
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl font-bold text-center">
            Change Your Start Date
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600 text-center">
            {currentStartDate
              ? `Your routine is currently set to start on ${formatDate(currentStartDate)}. Choose a new date below.`
              : "Choose when you'd like to begin your skincare routine"}
          </DialogDescription>
        </DialogHeader>

        {/* Date Selection */}
        <div className="mt-4 space-y-3">
          <button
            type="button"
            onClick={() => setSelectedOption("today")}
            className={`w-full flex items-center p-4 border-2 rounded-lg transition-colors ${
              selectedOption === "today"
                ? "border-skinbestie-primary bg-skinbestie-primary/5"
                : "border-gray-200 hover:border-skinbestie-primary"
            }`}
          >
            <div className="flex-1 text-left">
              <div className="font-semibold text-base">Start Today</div>
              <div className="text-sm text-gray-600">{formatDate(today)}</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedOption("tomorrow")}
            className={`w-full flex items-center p-4 border-2 rounded-lg transition-colors ${
              selectedOption === "tomorrow"
                ? "border-skinbestie-primary bg-skinbestie-primary/5"
                : "border-gray-200 hover:border-skinbestie-primary"
            }`}
          >
            <div className="flex-1 text-left">
              <div className="font-semibold text-base">Start Tomorrow</div>
              <div className="text-sm text-gray-600">
                {formatDate(tomorrow)}
              </div>
            </div>
          </button>

          <div
            className={`p-4 border-2 rounded-lg transition-colors ${
              selectedOption === "specify"
                ? "border-skinbestie-primary bg-skinbestie-primary/5"
                : "border-gray-200 hover:border-skinbestie-primary"
            }`}
          >
            <button
              type="button"
              onClick={() => setSelectedOption("specify")}
              className="w-full flex items-center text-left"
            >
              <div className="flex-1">
                <div className="font-semibold text-base">Specify a Date</div>
                <div className="text-sm text-gray-600">
                  Choose your own start date
                </div>
              </div>
            </button>

            {selectedOption === "specify" && (
              <div className="mt-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !customDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {customDate ? (
                        format(customDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <div className="[--color-primary:#f8817d] [--primary:#f8817d]">
                      <Calendar
                        mode="single"
                        selected={customDate}
                        onSelect={setCustomDate}
                        disabled={(date) => {
                          const dateOnly = new Date(
                            date.getFullYear(),
                            date.getMonth(),
                            date.getDate(),
                          );
                          const todayOnly = new Date(
                            today.getFullYear(),
                            today.getMonth(),
                            today.getDate(),
                          );
                          return dateOnly < todayOnly;
                        }}
                        initialFocus
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 space-y-3">
          <Button
            onClick={handleConfirm}
            disabled={isConfirmDisabled}
            className="w-full bg-skinbestie-primary hover:bg-skinbestie-primary/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isConfirming ? "Confirming..." : "Confirm New Date"}
          </Button>
          <Button
            onClick={() => onOpenChange(false)}
            variant="outline"
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
