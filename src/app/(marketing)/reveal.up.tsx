"use client";
import * as React from "react";

export default function RevealUp({
  children,
  once = true,
  rootMargin = "0px 0px -15% 0px", // start a bit before it fully enters
}: {
  children: React.ReactNode;
  once?: boolean;
  rootMargin?: string;
}) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.unobserve(el);
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold: 0.12, rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once, rootMargin]);

  return (
    <div ref={ref} className={`reveal-up ${inView ? "in" : ""}`}>
      {children}
    </div>
  );
}
