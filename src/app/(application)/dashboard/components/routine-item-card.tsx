"use client";

import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface RoutineItemCardProps {
  productName: string;
  description: string;
  category: string;
  productUrl?: string;
  showCheckbox?: boolean;
  isChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  showViewProduct?: boolean;
  productNameAsLink?: boolean;
}

export function RoutineItemCard({
  productName,
  description,
  category,
  productUrl,
  showCheckbox = false,
  isChecked = false,
  onCheckedChange,
  showViewProduct = true,
  productNameAsLink = false,
}: RoutineItemCardProps) {
  return (
    <div
      className={`border rounded-lg py-6 px-4 transition-all ${
        isChecked
          ? "border-none bg-skinbestie-success"
          : "border-gray-200 bg-skinbestie-neutral"
      }`}
    >
      <div className="flex items-center gap-4">
        {/* Checkbox (optional) */}
        {showCheckbox && (
          <button
            type="button"
            onClick={() => onCheckedChange?.(!isChecked)}
            className={`flex items-center justify-center h-5 w-5 rounded border-2 transition-all cursor-pointer ${
              isChecked
                ? "bg-skinbestie-success-dark border-skinbestie-success-dark"
                : "bg-white border-gray-300"
            }`}
          >
            {isChecked && <Check className="h-4 w-4 text-white" />}
          </button>
        )}

        {/* Content */}
        <div className="flex-1 space-y-3">
          {/* Category Badge and View Product / Completed Badge */}
          <div className="flex items-center justify-between">
            <Badge
              variant="secondary"
              className={
                isChecked
                  ? "bg-skinbestie-success-dark text-white hover:bg-skinbestie-success-dark"
                  : "bg-skinbestie-primary text-white hover:bg-skinbestie-primary"
              }
            >
              {category}
            </Badge>
            {isChecked ? (
              <Badge
                variant="secondary"
                className="bg-skinbestie-success-dark text-white hover:bg-skinbestie-success-dark"
              >
                COMPLETED
              </Badge>
            ) : (
              showViewProduct &&
              productUrl && (
                <a
                  href={productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-skinbestie-primary hover:opacity-90 transition-colors text-sm font-medium underline"
                >
                  View Product
                </a>
              )
            )}
          </div>

          {/* Product Name */}
          {productNameAsLink && productUrl ? (
            <a
              href={productUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-lg font-semibold transition-colors ${
                isChecked
                  ? "text-gray-900"
                  : "text-skinbestie-primary hover:text-skinbestie-primary/90"
              }`}
            >
              {productName}
            </a>
          ) : (
            <h3 className="text-lg font-semibold text-gray-900">
              {productName}
            </h3>
          )}

          {/* Description */}
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
}
