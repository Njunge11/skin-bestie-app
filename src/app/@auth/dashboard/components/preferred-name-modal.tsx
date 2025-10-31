"use client";

import { useState, useTransition } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface PreferredNameModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fullName: string;
  firstName: string;
  onSave: (preferredName: string) => Promise<void>;
  onCancel: () => Promise<void>;
}

export function PreferredNameModal({
  open,
  onOpenChange,
  fullName,
  firstName,
  onSave,
  onCancel,
}: PreferredNameModalProps) {
  const [selection, setSelection] = useState<
    "fullName" | "firstName" | "initials" | "custom"
  >("fullName");
  const [customName, setCustomName] = useState("");
  const [isPending, startTransition] = useTransition();

  // Generate initials from full name
  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("");

  const handleSave = async () => {
    let preferredName = "";

    if (selection === "fullName") {
      preferredName = fullName;
    } else if (selection === "firstName") {
      preferredName = firstName;
    } else if (selection === "initials") {
      preferredName = initials;
    } else if (selection === "custom") {
      preferredName = customName.trim();
    }

    if (preferredName) {
      startTransition(async () => {
        await onSave(preferredName);
        onOpenChange(false);
      });
    }
  };

  const handleCancel = async () => {
    startTransition(async () => {
      await onCancel();
      onOpenChange(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        {/* Close button */}
        <button
          onClick={handleCancel}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        {/* Icon */}
        <div className="flex justify-center">
          <div className="text-6xl">👋</div>
        </div>

        {/* Header */}
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl font-bold text-center">
            Hey Bestie, What should we call you?
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600 text-center">
            We have your name from onboarding, but feel free to let us know how
            you prefer to be addressed
          </DialogDescription>
        </DialogHeader>

        {/* Radio Options */}
        <RadioGroup
          value={selection}
          onValueChange={(value) =>
            setSelection(
              value as "fullName" | "firstName" | "initials" | "custom",
            )
          }
          className="space-y-3 mt-4"
        >
          <Label
            htmlFor="fullName"
            className={`flex items-center space-x-3 p-4 border-2 rounded-lg transition-colors cursor-pointer ${
              selection === "fullName"
                ? "border-skinbestie-primary bg-skinbestie-primary/5"
                : "border-gray-200 hover:border-skinbestie-primary"
            }`}
          >
            <RadioGroupItem value="fullName" id="fullName" />
            <span className="flex-1 font-semibold text-base">{fullName}</span>
          </Label>

          <Label
            htmlFor="firstName"
            className={`flex items-center space-x-3 p-4 border-2 rounded-lg transition-colors cursor-pointer ${
              selection === "firstName"
                ? "border-skinbestie-primary bg-skinbestie-primary/5"
                : "border-gray-200 hover:border-skinbestie-primary"
            }`}
          >
            <RadioGroupItem value="firstName" id="firstName" />
            <span className="flex-1 font-semibold text-base">{firstName}</span>
          </Label>

          <Label
            htmlFor="initials"
            className={`flex items-center space-x-3 p-4 border-2 rounded-lg transition-colors cursor-pointer ${
              selection === "initials"
                ? "border-skinbestie-primary bg-skinbestie-primary/5"
                : "border-gray-200 hover:border-skinbestie-primary"
            }`}
          >
            <RadioGroupItem value="initials" id="initials" />
            <span className="flex-1 font-semibold text-base">{initials}</span>
          </Label>
        </RadioGroup>

        {/* Custom Name Section */}
        <div className="mt-4">
          <div className="relative flex items-center justify-center mb-3">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-4 text-sm font-semibold text-gray-900">
              Or Use Something Else
            </span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <div>
            <Label
              htmlFor="customName"
              className="text-sm font-semibold text-gray-900"
            >
              Enter Custom Name
            </Label>
            <Input
              id="customName"
              placeholder="Enter Your Preferred Name"
              value={customName}
              onChange={(e) => {
                setCustomName(e.target.value);
                setSelection("custom");
              }}
              className="mt-2"
            />
          </div>
          <p className="text-xs text-gray-600 mt-2">
            This is how we will address you throughout your skin journey
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <Button
            onClick={handleCancel}
            variant="outline"
            className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 bg-skinbestie-primary hover:bg-skinbestie-primary/90 text-white"
            disabled={
              isPending || (selection === "custom" && !customName.trim())
            }
          >
            {isPending ? "Saving..." : "Save and Continue"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
