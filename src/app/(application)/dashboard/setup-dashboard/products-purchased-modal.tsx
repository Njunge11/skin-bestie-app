"use client";

import { useState } from "react";
import { format } from "date-fns";
import { X, ShoppingBag, Calendar as CalendarIcon } from "lucide-react";
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

interface ProductsPurchasedModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmProductsReceived: () => Promise<void>;
  onConfirm: (startDate: Date) => Promise<boolean>;
}

export function ProductsPurchasedModal({
  open,
  onOpenChange,
  onConfirmProductsReceived,
  onConfirm,
}: ProductsPurchasedModalProps) {
  const [step, setStep] = useState<"confirm" | "selectDate" | "notYet">(
    "confirm",
  );
  const [selectedOption, setSelectedOption] = useState<
    "today" | "tomorrow" | "specify" | null
  >(null);
  const [customDate, setCustomDate] = useState<Date | undefined>(undefined);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isConfirmingDate, setIsConfirmingDate] = useState(false);

  const handleConfirmPurchase = async () => {
    setIsConfirming(true);
    try {
      // Call API to mark products as received
      await onConfirmProductsReceived();
      // Move to date selection step only if API call succeeds
      setStep("selectDate");
    } catch (error) {
      // Error is already handled by parent (toast shown), just don't move to next step
      console.error("Failed to confirm products:", error);
    } finally {
      setIsConfirming(false);
    }
  };

  const handleFinalConfirm = async () => {
    setIsConfirmingDate(true);

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
      setIsConfirmingDate(false);
    }
  };

  const handleNotYet = () => {
    setStep("notYet");
  };

  const handleGotIt = () => {
    onOpenChange(false);
  };

  const handleBackToConfirm = () => {
    setStep("confirm");
  };

  const handleBack = () => {
    setStep("confirm");
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
    isConfirmingDate;

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

        {step === "confirm" && (
          <>
            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-12 h-12 rounded-full bg-skinbestie-primary flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
            </div>

            {/* Header */}
            <DialogHeader className="text-center">
              <DialogTitle className="text-xl font-bold text-center">
                Have You Purchased Your Products?
              </DialogTitle>
              <DialogDescription className="text-base text-gray-600 text-center">
                Confirm that you&apos;ve purchased and received the recommended
                skincare products from your routine
              </DialogDescription>
            </DialogHeader>

            {/* Content */}
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-4 p-4 bg-skinbestie-neutral border border-gray-200 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-skinbestie-primary flex items-center justify-center">
                  <CalendarIcon className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm text-gray-700 flex-1 self-center">
                  Once confirmed, you&apos;ll set your routine start date and
                  begin tracking your progress
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-6 space-y-3">
              <Button
                onClick={handleConfirmPurchase}
                disabled={isConfirming}
                className="w-full bg-skinbestie-primary hover:bg-skinbestie-primary/90 text-white disabled:opacity-50"
              >
                {isConfirming ? "Confirming..." : "Yes, I've Received Them"}
              </Button>
              <Button
                onClick={handleNotYet}
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Not Yet
              </Button>
            </div>
          </>
        )}

        {step === "selectDate" && (
          <>
            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-12 h-12 rounded-full bg-skinbestie-primary flex items-center justify-center">
                <CalendarIcon className="h-6 w-6 text-white" />
              </div>
            </div>

            {/* Header */}
            <DialogHeader className="text-center">
              <DialogTitle className="text-xl font-bold text-center">
                When Would You Like to Start?
              </DialogTitle>
              <DialogDescription className="text-base text-gray-600 text-center">
                Choose when you&apos;d like to begin your skincare routine
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
                  <div className="text-sm text-gray-600">
                    {formatDate(today)}
                  </div>
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
                    <div className="font-semibold text-base">
                      Specify a Date
                    </div>
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
                onClick={handleFinalConfirm}
                disabled={isConfirmDisabled}
                className="w-full bg-skinbestie-primary hover:bg-skinbestie-primary/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isConfirmingDate
                  ? "Confirming..."
                  : "Confirm and Start Routine"}
              </Button>
              <Button
                onClick={handleBack}
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Back
              </Button>
            </div>
          </>
        )}

        {step === "notYet" && (
          <>
            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-12 h-12 rounded-full bg-skinbestie-primary flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
            </div>

            {/* Header */}
            <DialogHeader className="text-center">
              <DialogTitle className="text-xl font-bold text-center">
                No Problem!
              </DialogTitle>
              <DialogDescription className="text-base text-gray-600 text-center">
                Once your products arrive, come back here to confirm and set
                your routine start date
              </DialogDescription>
            </DialogHeader>

            {/* Content */}
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-4 p-4 bg-skinbestie-neutral border border-gray-200 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-skinbestie-primary flex items-center justify-center">
                  <CalendarIcon className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm text-gray-700 flex-1 self-center">
                  We&apos;ll be here waiting when you&apos;re ready to begin
                  your skincare journey
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-6 space-y-3">
              <Button
                onClick={handleGotIt}
                className="w-full bg-skinbestie-primary hover:bg-skinbestie-primary/90 text-white"
              >
                Got It
              </Button>
              <Button
                onClick={handleBackToConfirm}
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Back
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
