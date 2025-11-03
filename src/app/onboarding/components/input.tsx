// components/marketing/inputs.tsx
"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const M_INPUT_BASE =
  "rounded py-[0.875rem] px-[1.3125rem] text-[#272B2D] placeholder:text-[#878481] h-auto";
const M_INPUT_SKIN = "bg-[#FFFBE5] border border-[#030303]";

export const MInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof Input>
>(function MInput({ className, ...props }, ref) {
  return (
    <Input
      ref={ref}
      {...props}
      className={cn(M_INPUT_BASE, M_INPUT_SKIN, className)}
    />
  );
});
