// components/marketing/cta-button.tsx
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

type Props = React.ComponentProps<typeof Button> & {
  label?: string;
  icon?: React.ElementType;
  iconClassName?: string;
  showIcon?: boolean;
};

export function MButton({
  type = "submit",
  label,
  icon: Icon = ArrowRight,
  iconClassName,
  className,
  children,
  showIcon,
  ...props
}: Props) {
  return (
    <Button
      type={type}
      className={cn(
        "w-full justify-center gap-2 rounded-[12px] bg-[#030303]",
        "py-3 px-4 text-[16px] leading-[1.5] tracking-[-0.01em] font-medium",
        "text-white hover:bg-[#030303]/90 focus-visible:ring-0 disabled:opacity-60",
        className
      )}
      {...props}
    >
      {label ?? children}
      {showIcon && Icon ? (
        <Icon className={cn("h-6 w-6", iconClassName)} />
      ) : null}
    </Button>
  );
}
