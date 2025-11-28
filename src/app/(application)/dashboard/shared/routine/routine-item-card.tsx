"use client";

import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface RoutineItemCardProps {
  stepType?: "product" | "instruction_only";
  stepName?: string | null;
  productName: string | null;
  description: string | null;
  category: string | null; // routineStep
  productUrl?: string;
  showCheckbox?: boolean;
  isChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  showViewProduct?: boolean;
  productNameAsLink?: boolean;
}

export function RoutineItemCard({
  stepType,
  stepName,
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
  // Determine display values based on step type
  const isInstructionOnly = stepType === "instruction_only";

  // Badge text: "Step" for instruction_only, category (routineStep) for products
  const badgeText = isInstructionOnly ? "Step" : category || "Step";

  // Title text: stepName for instruction_only, productName for products
  // If no stepName, use instructions as title for instruction_only
  const titleText = isInstructionOnly
    ? stepName || description || "Step"
    : productName || "Product";

  // For accessibility labels
  const itemLabel = titleText;
  return (
    <div
      className={`border rounded-lg py-6 px-4 transition-all ${
        isChecked
          ? "border-none bg-skinbestie-success"
          : "border-gray-200 bg-skinbestie-neutral"
      }`}
    >
      {/* Mobile Layout */}
      <div className="md:hidden space-y-3">
        {/* Row 1: Checkbox, Badge, Link */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Checkbox */}
            {showCheckbox && (
              <button
                type="button"
                onClick={() => onCheckedChange?.(!isChecked)}
                aria-label={
                  isChecked
                    ? `Unmark ${itemLabel} as complete`
                    : `Mark ${itemLabel} as complete`
                }
                className={`flex items-center justify-center h-5 w-5 rounded border-2 transition-all cursor-pointer flex-shrink-0 ${
                  isChecked
                    ? "bg-skinbestie-success-dark border-skinbestie-success-dark"
                    : "bg-white border-gray-300"
                }`}
              >
                {isChecked && <Check className="h-4 w-4 text-white" />}
              </button>
            )}

            {/* Badge */}
            <Badge
              variant="secondary"
              className={
                isChecked
                  ? "bg-skinbestie-success-dark text-white hover:bg-skinbestie-success-dark"
                  : "bg-skinbestie-primary text-white hover:bg-skinbestie-primary"
              }
            >
              {badgeText}
            </Badge>
          </div>

          {/* Link/Completed Badge */}
          {isChecked ? (
            <Badge
              variant="secondary"
              className="bg-skinbestie-success-dark text-white hover:bg-skinbestie-success-dark"
            >
              COMPLETED
            </Badge>
          ) : (
            showViewProduct &&
            !isInstructionOnly &&
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

        {/* Row 2: Title and Description */}
        <div className="space-y-2 mt-4">
          {/* Title (Product Name or Step Name) */}
          {productNameAsLink && !isInstructionOnly && productUrl ? (
            <a
              href={productUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-lg font-semibold transition-colors block ${
                isChecked
                  ? "text-gray-900"
                  : "text-skinbestie-primary hover:text-skinbestie-primary/90"
              }`}
            >
              {titleText}
            </a>
          ) : (
            <h3 className="text-lg font-semibold text-gray-900">{titleText}</h3>
          )}

          {/* Description - Don't show if instruction_only and no stepName (already showing as title) */}
          {description && !(isInstructionOnly && !stepName) && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex items-center gap-4">
        {/* Checkbox (optional) */}
        {showCheckbox && (
          <button
            type="button"
            onClick={() => onCheckedChange?.(!isChecked)}
            aria-label={
              isChecked
                ? `Unmark ${itemLabel} as complete`
                : `Mark ${itemLabel} as complete`
            }
            className={`flex items-center justify-center h-5 w-5 rounded border-2 transition-all cursor-pointer flex-shrink-0 ${
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
          {/* Badge and View Product / Completed Badge */}
          <div className="flex items-center justify-between">
            <Badge
              variant="secondary"
              className={
                isChecked
                  ? "bg-skinbestie-success-dark text-white hover:bg-skinbestie-success-dark"
                  : "bg-skinbestie-primary text-white hover:bg-skinbestie-primary"
              }
            >
              {badgeText}
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
              !isInstructionOnly &&
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

          {/* Title (Product Name or Step Name) */}
          {productNameAsLink && !isInstructionOnly && productUrl ? (
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
              {titleText}
            </a>
          ) : (
            <h3 className="text-lg font-semibold text-gray-900">{titleText}</h3>
          )}

          {/* Description - Don't show if instruction_only and no stepName (already showing as title) */}
          {description && !(isInstructionOnly && !stepName) && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
