"use client";

import { Droplet, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SkinTestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const steps = [
  {
    number: 1,
    text: "Wash your face with lukewarm water (or if you have any makeup, use a very gentle cleanser to get any makeup off",
  },
  {
    number: 2,
    text: "Get your face cloth and pat face dry.",
  },
  {
    number: 3,
    text: "Do nothing and see how your skin responds after 30 minutes to 1hour.",
  },
];

const skinTypes = [
  {
    condition: "If you feel tight or stripped, you have",
    type: "DRY SKIN",
  },
  {
    condition: "If you feel refreshed or some shininess,",
    type: "OILY SKIN",
  },
  {
    condition: "If you feel some shininess on t-zone and tight on cheeks,",
    type: "COMBINATION SKIN",
  },
  {
    condition:
      "If you feel some mild redness or symptoms of sensitivity might be heightened",
    type: "SENSITIVE SKIN.",
  },
];

export function SkinTestModal({ open, onOpenChange }: SkinTestModalProps) {
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

        {/* Method Steps */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Steps</h3>
          <div className="space-y-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-skinbestie-primary flex items-center justify-center text-white font-semibold">
                  {step.number}
                </div>
                <p className="text-sm text-gray-700 flex-1 self-center">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Skin Types Results */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Results & What They Mean</h3>
          <div className="space-y-3">
            {skinTypes.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-skinbestie-success border border-skinbestie-success rounded-lg"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-skinbestie-success-dark flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <p className="text-sm text-gray-700 flex-1 self-center">
                  {item.condition}{" "}
                  <span className="font-bold">{item.type}</span>
                </p>
              </div>
            ))}
          </div>
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
