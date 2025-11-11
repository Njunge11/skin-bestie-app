// app/(marketing)/components/CalendlyInline.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import type { OnboardingSchema } from "./onboarding.schema";
import { getUserProfile, updateUserProfile } from "./actions";
import { mergeCompletedSteps } from "./onboarding.utils";

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (opts: {
        url: string;
        parentElement: HTMLElement;
        prefill?: {
          name?: string;
          firstName?: string;
          lastName?: string;
          email?: string;
          customAnswers?: Record<string, string>;
        };
        utm?: Record<string, unknown>;
      }) => void;
    };
  }
}

/* --- fuller, theme-matched skeleton (no logic changes) --- */
function CalendarSkeleton() {
  return (
    <div
      className="absolute inset-0 z-10 bg-[#F4F2EB] motion-safe:animate-pulse"
      role="status"
      aria-busy="true"
      aria-label="Loading calendar"
    >
      <div className="h-full w-full p-4 flex flex-col">
        {/* Header bits */}
        <div className="mx-auto mt-1 mb-4 h-4 w-44 rounded bg-gray-200" />
        <div className="mx-auto -mt-2 mb-6 h-3 w-36 rounded bg-gray-300" />

        {/* Body rows — fill most of the height */}
        <div className="flex-1 space-y-3">
          {/* Week rows (taller) */}
          <div className="h-7 rounded bg-gray-200" />
          <div className="h-7 rounded bg-gray-300" />
          <div className="h-7 rounded bg-gray-200" />
          <div className="h-7 rounded bg-gray-300" />
          <div className="h-7 rounded bg-gray-200" />
          <div className="h-7 rounded bg-gray-300" />

          {/* Extra lines to avoid empty space on tall screens */}
          <div className="h-5 rounded bg-gray-200" />
          <div className="h-5 rounded bg-gray-300" />
          <div className="h-5 rounded bg-gray-200" />
        </div>

        {/* Footer hint bars */}
        <div className="mt-6 space-y-3">
          <div className="mx-auto h-3 w-56 rounded bg-gray-200" />
          <div className="mx-auto h-3 w-44 rounded bg-gray-300" />
        </div>
      </div>
    </div>
  );
}

export default function CalendlyInline({
  onShowingSuccess,
}: {
  onShowingSuccess?: (showing: boolean) => void;
}) {
  const { getValues } = useFormContext<OnboardingSchema>();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const didInitRef = useRef(false);
  const mountedRef = useRef(false);

  const [ready, setReady] = useState(false);
  const [bookingCompleted, setBookingCompleted] = useState(false);
  const skeletonShownAtRef = useRef<number>(Date.now());

  const MIN_SKELETON_MS = 400; // prevent blink
  const FALLBACK_READY_MS = 3000; // if no postMessage comes

  // Notify parent when booking is completed (to hide heading)
  useEffect(() => {
    onShowingSuccess?.(bookingCompleted);
  }, [bookingCompleted, onShowingSuccess]);

  // Get user profile ID
  const userProfileId = getValues("userProfileId");

  // Get current profile data
  const { data: currentProfile } = useQuery({
    queryKey: ["userProfile", userProfileId],
    queryFn: async () => {
      if (!userProfileId) return null;
      const result = await getUserProfile(userProfileId);
      return result.success ? result.data : null;
    },
    enabled: !!userProfileId,
  });

  const base = process.env.NEXT_PUBLIC_CALENDLY_EVENT_URL || "";
  const url = useMemo(() => {
    if (!base) return "";
    const params = new URLSearchParams({
      hide_event_type_details: "1",
      hide_gdpr_banner: "1",
      background_color: "F4F2EB",
      primary_color: "195284",
      utm_source: "site",
      utm_medium: "onboarding",
    });
    return `${base}?${params.toString()}`;
  }, [base]);

  // Get user info for prefilling
  const prefillData = useMemo(() => {
    const firstName = getValues("firstName");
    const lastName = getValues("lastName");
    const email = getValues("email");

    return {
      name: [firstName, lastName].filter(Boolean).join(" "),
      email: email || undefined,
    };
  }, [getValues]);

  useEffect(() => {
    mountedRef.current = true;

    // Inject custom CSS to override Calendly's white backgrounds
    if (!document.getElementById("calendly-custom-styles")) {
      const style = document.createElement("style");
      style.id = "calendly-custom-styles";
      style.textContent = `
        .calendly-inline-widget iframe {
          background-color: #F4F2EB !important;
        }
        /* Override any white backgrounds inside Calendly iframe content */
        .calendly-inline-widget [style*="background"] {
          background-color: #F4F2EB !important;
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      mountedRef.current = false;
    };
  }, []);

  // hide skeleton only once Calendly paints + listen for booking completion
  useEffect(() => {
    async function onMsg(e: MessageEvent) {
      if (typeof e.origin !== "string" || !e.origin.includes("calendly.com"))
        return;
      const evt = (e.data && (e.data.event as string)) || "";

      // Show calendar when it's ready
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

      // Handle successful booking
      if (evt === "calendly.event_scheduled") {
        if (!userProfileId || !currentProfile) return;

        try {
          // Extract Calendly event details from payload (if needed for future use)
          const payload = e.data?.payload;
          const calendlyEventUri = payload?.event?.uri;
          const calendlyInviteeUri = payload?.invitee?.uri;

          console.log("Calendly booking completed:", {
            eventUri: calendlyEventUri,
            inviteeUri: calendlyInviteeUri,
          });

          const completedSteps = mergeCompletedSteps(
            currentProfile.completedSteps,
            [
              "PERSONAL",
              "SKIN_TYPE",
              "SKIN_CONCERNS",
              "ALLERGIES",
              "SUBSCRIBE",
              "BOOKING",
            ],
          );

          await updateUserProfile(userProfileId, {
            hasCompletedBooking: true,
            completedSteps,
            isCompleted: true,
            completedAt: new Date().toISOString(),
          });

          console.log("Booking completed and saved to database");

          // Mark booking as completed (will show login button)
          setBookingCompleted(true);
        } catch (error) {
          console.error("Failed to save booking completion:", error);
        }
      }
    }
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [userProfileId, currentProfile, onShowingSuccess]);

  // load calendly assets and init (StrictMode-safe)
  useEffect(() => {
    // Copy ref value at the start of the effect for cleanup
    const container = containerRef.current;
    if (!url || !container) return;

    if (!document.querySelector('link[data-calendly-style="true"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://assets.calendly.com/assets/external/widget.css";
      link.setAttribute("data-calendly-style", "true");
      document.head.appendChild(link);
    }

    const init = () => {
      if (didInitRef.current || !window.Calendly || !container) return;
      didInitRef.current = true;

      container.innerHTML = "";
      skeletonShownAtRef.current = Date.now();
      if (mountedRef.current) setReady(false);

      window.Calendly.initInlineWidget({
        url,
        parentElement: container,
        prefill: prefillData,
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
      if (container) container.innerHTML = "";
      if (cleanupFallback) cleanupFallback();
    };
  }, [url, prefillData]);

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
            md:h-[29rem]            /* ≈ 513px on md+ */
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

      {/* Login button after booking completion */}
      {bookingCompleted && (
        <Link
          href="/login"
          className="flex items-center justify-center w-full px-6 py-3 bg-[#195284] text-white text-base font-semibold rounded hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#195284]"
        >
          Login to your SkinBestie Account
        </Link>
      )}
    </div>
  );
}
