// app/(marketing)/components/CalendlyInline.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (opts: {
        url: string;
        parentElement: HTMLElement;
        prefill?: Record<string, unknown>;
        utm?: Record<string, unknown>;
      }) => void;
    };
  }
}

/* --- fuller, theme-matched skeleton (no logic changes) --- */
function CalendarSkeleton() {
  return (
    <div
      className="absolute inset-0 z-10 bg-[#F3ECC7] motion-safe:animate-pulse"
      role="status"
      aria-busy="true"
      aria-label="Loading calendar"
    >
      <div className="h-full w-full p-4 flex flex-col">
        {/* Header bits */}
        <div className="mx-auto mt-1 mb-4 h-4 w-44 rounded bg-[#FFF1C7]" />
        <div className="mx-auto -mt-2 mb-6 h-3 w-36 rounded bg-[#E9DFB0]" />

        {/* Body rows — fill most of the height */}
        <div className="flex-1 space-y-3">
          {/* Week rows (taller) */}
          <div className="h-7 rounded bg-[#FFF1C7]" />
          <div className="h-7 rounded bg-[#E9DFB0]" />
          <div className="h-7 rounded bg-[#FFF1C7]" />
          <div className="h-7 rounded bg-[#E9DFB0]" />
          <div className="h-7 rounded bg-[#FFF1C7]" />
          <div className="h-7 rounded bg-[#E9DFB0]" />

          {/* Extra lines to avoid empty space on tall screens */}
          <div className="h-5 rounded bg-[#FFF1C7]" />
          <div className="h-5 rounded bg-[#E9DFB0]" />
          <div className="h-5 rounded bg-[#FFF1C7]" />
        </div>

        {/* Footer hint bars */}
        <div className="mt-6 space-y-3">
          <div className="mx-auto h-3 w-56 rounded bg-[#FFF1C7]" />
          <div className="mx-auto h-3 w-44 rounded bg-[#E9DFB0]" />
        </div>
      </div>
    </div>
  );
}

export default function CalendlyInline() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const didInitRef = useRef(false);
  const mountedRef = useRef(false);

  const [ready, setReady] = useState(false);
  const skeletonShownAtRef = useRef<number>(Date.now());

  const MIN_SKELETON_MS = 400; // prevent blink
  const FALLBACK_READY_MS = 3000; // if no postMessage comes

  const base = process.env.NEXT_PUBLIC_CALENDLY_EVENT_URL || "";
  const url = useMemo(() => {
    if (!base) return "";
    const params = new URLSearchParams({
      hide_event_type_details: "1",
      hide_gdpr_banner: "1",
      background_color: "F3ECC7",
      text_color: "000000",
      primary_color: "000000",
      utm_source: "site",
      utm_medium: "onboarding",
    });
    return `${base}?${params.toString()}`;
  }, [base]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // hide skeleton only once Calendly paints
  useEffect(() => {
    function onMsg(e: MessageEvent) {
      if (typeof e.origin !== "string" || !e.origin.includes("calendly.com"))
        return;
      const evt = (e.data && (e.data.event as string)) || "";
      if (
        evt === "calendly.profile_page_viewed" ||
        evt === "calendly.event_type_viewed"
      ) {
        const elapsed = Date.now() - skeletonShownAtRef.current;
        const wait = Math.max(0, MIN_SKELETON_MS - elapsed);
        window.setTimeout(() => {
          if (mountedRef.current) setReady(true);
        }, wait);
      }
    }
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  // load calendly assets and init (StrictMode-safe)
  useEffect(() => {
    if (!url || !containerRef.current) return;

    if (!document.querySelector('link[data-calendly-style="true"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://assets.calendly.com/assets/external/widget.css";
      link.setAttribute("data-calendly-style", "true");
      document.head.appendChild(link);
    }

    const init = () => {
      if (didInitRef.current || !window.Calendly || !containerRef.current)
        return;
      didInitRef.current = true;

      containerRef.current.innerHTML = "";
      skeletonShownAtRef.current = Date.now();
      if (mountedRef.current) setReady(false);

      window.Calendly.initInlineWidget({
        url,
        parentElement: containerRef.current,
      });

      const t = window.setTimeout(() => {
        if (mountedRef.current) setReady(true);
      }, FALLBACK_READY_MS);
      return () => window.clearTimeout(t);
    };

    const id = "calendly-widget-js";
    const existing = document.getElementById(id) as HTMLScriptElement | null;
    let cleanupFallback: (() => void) | undefined;

    if (existing) {
      if (window.Calendly) cleanupFallback = init();
      else {
        const onLoad = () => (cleanupFallback = init());
        existing.addEventListener("load", onLoad, { once: true });
        return () => existing.removeEventListener("load", onLoad);
      }
    } else {
      const s = document.createElement("script");
      s.id = id;
      s.src = "https://assets.calendly.com/assets/external/widget.js";
      s.async = true;
      s.onload = () => (cleanupFallback = init());
      document.body.appendChild(s);
    }

    return () => {
      didInitRef.current = false;
      if (containerRef.current) containerRef.current.innerHTML = "";
      if (cleanupFallback) cleanupFallback();
    };
  }, [url]);

  if (!base) {
    return (
      <p className="text-sm text-red-600">
        Missing <code>NEXT_PUBLIC_CALENDLY_EVENT_URL</code>.
      </p>
    );
  }

  return (
    <div className="w-full">
      {/* keep your rule + spacing */}
      <hr className="mt-6 border-t-[0.03125rem] border-[#030303]" />

      {/* keep your top padding; the height is controlled inside */}
      <div>
        <div
          className="
            relative w-full
            h-[clamp(22rem,48vh,28rem)]  /* mobile */
            md:h-[32.0625rem]            /* ≈ 513px on md+ */
          "
          aria-busy={!ready}
        >
          {/* overlay skeleton until Calendly is ready */}
          <div
            className={[
              "pointer-events-none transition-opacity duration-150",
              ready ? "opacity-0" : "opacity-100",
            ].join(" ")}
          >
            <CalendarSkeleton />
          </div>

          {/* Calendly target */}
          <div ref={containerRef} className="absolute inset-0" />
        </div>
      </div>
    </div>
  );
}
