"use client";

import { X, Droplet } from "lucide-react";
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
import { useState } from "react";

interface SelectSkinTypeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (skinType: string) => void;
  currentSkinType?: string;
}

const skinTypes = [
  { value: "dry", label: "Dry" },
  { value: "oily", label: "Oily" },
  { value: "combination", label: "Combination" },
  { value: "sensitive", label: "Sensitive" },
];

export function SelectSkinTypeModal({
  open,
  onOpenChange,
  onSave,
  currentSkinType,
}: SelectSkinTypeModalProps) {
  const [selectedType, setSelectedType] = useState(currentSkinType || "");

  const handleSave = () => {
    if (selectedType) {
      onSave(selectedType);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
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
            <Droplet className="h-6 w-6 text-white" />
          </div>
        </div>

        {/* Header */}
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl font-bold text-center">
            Select Your Skin Type
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600 text-center">
            Choose the skin type that best describes your skin
          </DialogDescription>
        </DialogHeader>

        {/* Radio Group */}
        <div className="mt-4">
          <RadioGroup value={selectedType} onValueChange={setSelectedType}>
            <div className="grid grid-cols-2 gap-4">
              {skinTypes.map((type) => (
                <div key={type.value} className="relative">
                  <RadioGroupItem
                    value={type.value}
                    id={type.value}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={type.value}
                    className="flex items-center justify-center rounded-lg border-2 border-gray-200 p-4 hover:border-skinbestie-primary peer-data-[state=checked]:border-skinbestie-primary peer-data-[state=checked]:bg-skinbestie-primary/10 cursor-pointer transition-all"
                  >
                    <span className="text-base font-semibold">
                      {type.label}
                    </span>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        {/* Save Button */}
        <div className="mt-6">
          <Button
            onClick={handleSave}
            disabled={!selectedType}
            className="w-full bg-skinbestie-primary hover:bg-skinbestie-primary/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
