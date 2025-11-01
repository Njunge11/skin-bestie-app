"use client";

import { Badge } from "@/components/ui/badge";

interface RoutineItemCardProps {
  productName: string;
  description: string;
  category: string;
  productUrl?: string;
  showCheckbox?: boolean;
  isChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export function RoutineItemCard({
  productName,
  description,
  category,
  productUrl,
  showCheckbox = false,
  isChecked = false,
  onCheckedChange,
}: RoutineItemCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-skinbestie-neutral">
      <div className="flex items-start gap-4">
        {/* Checkbox (optional) */}
        {showCheckbox && (
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(e) => onCheckedChange?.(e.target.checked)}
            className="mt-1 h-5 w-5 rounded border-gray-300 text-skinbestie-primary focus:ring-skinbestie-primary"
          />
        )}

        {/* Content */}
        <div className="flex-1 space-y-3">
          {/* Category Badge and View Product Link */}
          <div className="flex items-center justify-between">
            <Badge
              variant="secondary"
              className="bg-skinbestie-primary text-white hover:bg-skinbestie-primary"
            >
              {category}
            </Badge>
            {productUrl && (
              <a
                href={productUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-skinbestie-primary hover:text-skinbestie-primary/90 transition-colors text-sm font-medium underline"
              >
                View Product
              </a>
            )}
          </div>

          {/* Product Name */}
          <h3 className="text-lg font-semibold text-gray-900">{productName}</h3>

          {/* Description */}
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
}
