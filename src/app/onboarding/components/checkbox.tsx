// app/(onboarding)/components/checkbox.tsx
"use client";

type Props = {
  label: string;
  checked: boolean;
  onToggle: () => void;
  className?: string;
};

export function MCheckbox({ label, checked, onToggle, className = "" }: Props) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={onToggle}
      className={[
        "mt-2 flex w-full items-center justify-center cursor-pointer transition-all duration-200 select-none",
        "py-[0.438rem] border-[0.04375rem] rounded-[0.25rem]",
        checked
          ? "border-[#030303] bg-[#FFFBE5]"
          : "border-[#BCB8A6] bg-[#F3ECC7] hover:brightness-[0.98]",
        "text-[#272B2D]",
        className,
      ].join(" ")}
    >
      {/* keep an invisible checkbox for a11y semantics */}
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        readOnly
        aria-hidden="true"
        tabIndex={-1}
      />
      <span className="text-base font-medium leading-[150%] tracking-[-0.01em]">
        {label}
      </span>
    </button>
  );
}
