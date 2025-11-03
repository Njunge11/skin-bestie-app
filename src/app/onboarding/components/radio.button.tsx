// components/marketing/radio.button.tsx
"use client";

import * as React from "react";
import { useFormContext, useController } from "react-hook-form";

type RadioTileProps = {
  name: string;
  value: string;
  label?: string;
  required?: boolean;
  className?: string;
};

export function MRadioButton({
  name,
  value,
  label,
  required = false,
  className = "",
}: RadioTileProps) {
  const { control, setValue, watch } = useFormContext();
  useController({
    name,
    control,
    rules: required ? { required: "Pick an option" } : undefined,
  });

  const selected = watch(name);
  const isSelected = selected === value;

  const choose = () =>
    setValue(name, value, {
      shouldValidate: false, // ← don’t validate on click; Step handles it
      shouldDirty: true,
      shouldTouch: true,
    });

  return (
    <label
      className={[
        "mt-2 flex w-full items-center justify-center cursor-pointer transition-all duration-200 select-none",
        "py-[0.438rem]",
        "border-[0.04375rem]",
        isSelected
          ? "border-[#030303] bg-[#FFFBE5]"
          : "border-[#BCB8A6] bg-[#F3ECC7] hover:brightness-[0.98]",
        "rounded-[0.25rem]",
        "text-[#272B2D]",
        className,
      ].join(" ")}
      onClick={(e) => {
        e.preventDefault();
        choose();
      }}
    >
      <input
        type="radio"
        name={name}
        value={value}
        className="sr-only"
        checked={isSelected}
        onChange={choose}
        aria-label={label ?? value}
      />
      <span className="text-base font-medium leading-[150%] tracking-[-0.01em]">
        {label ?? value}
      </span>
    </label>
  );
}
