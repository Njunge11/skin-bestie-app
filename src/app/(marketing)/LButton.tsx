import React from "react";

type LButtonProps = {
  children?: React.ReactNode;
  href?: string;
  className?: string;

  /** Tailwind utility shorthands (optional) */
  widthClass?: string; // e.g. "w-auto" (defaults to "w-full")
  bgClass?: string; // e.g. "bg-[#F3ECC7]"
  borderClass?: string; // e.g. "border-[#C4BC8E]"
  textClass?: string; // e.g. "text-black"

  icon?: React.ReactNode; // left icon
} & Omit<React.ComponentPropsWithoutRef<"button">, "className"> &
  Omit<React.ComponentPropsWithoutRef<"a">, "className">;

export default function LButton({
  children = "Begin My SkinBestie Journey",
  href,
  className = "",
  widthClass = "w-full",
  bgClass = "bg-black",
  borderClass = "border-white",
  textClass = "text-white",
  icon,
  ...rest
}: LButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-xl border-2 gap-[10px] py-4 px-6";

  const composed = [
    base,
    widthClass,
    bgClass,
    borderClass,
    textClass,
    className, // appended last so user overrides win
  ].join(" ");

  const Content = (
    <>
      {icon ? <span className="inline-flex shrink-0">{icon}</span> : null}
      <span>{children}</span>
    </>
  );

  return href ? (
    <a href={href} className={composed} {...(rest as any)}>
      {Content}
    </a>
  ) : (
    <button className={composed} {...(rest as any)}>
      {Content}
    </button>
  );
}
