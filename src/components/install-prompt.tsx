"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// Helper to check if dismissed recently
function shouldShowPrompt(): boolean {
  if (typeof window === "undefined") return false;

  const dismissedDate = localStorage.getItem("pwa-prompt-dismissed");
  if (dismissedDate) {
    const daysSinceDismissed =
      (Date.now() - parseInt(dismissedDate)) / (1000 * 60 * 60 * 24);
    if (daysSinceDismissed < 7) {
      return false;
    }
  }
  return true;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  // ✅ Initialize state with lazy initializers
  const [isIOS] = useState(() => {
    if (typeof window === "undefined") return false;
    return (
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !(window as Window & { MSStream?: unknown }).MSStream
    );
  });

  const [isStandalone] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(display-mode: standalone)").matches;
  });

  const [showPrompt, setShowPrompt] = useState(() => {
    if (typeof window === "undefined") return false;
    const shouldShow = shouldShowPrompt();
    const iOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !(window as Window & { MSStream?: unknown }).MSStream;
    const standalone = window.matchMedia("(display-mode: standalone)").matches;
    return shouldShow && iOS && !standalone;
  });

  // ✅ useEffect only for external system synchronization (event listener)
  useEffect(() => {
    if (!shouldShowPrompt()) {
      return;
    }

    // Listen for beforeinstallprompt event (Chrome/Android)
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setShowPrompt(false);
    } else {
      // User dismissed the native prompt, save timestamp
      localStorage.setItem("pwa-prompt-dismissed", Date.now().toString());
    }

    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    // Save dismissal timestamp to localStorage
    localStorage.setItem("pwa-prompt-dismissed", Date.now().toString());
    setShowPrompt(false);
  };

  // Don't show if already installed
  if (isStandalone) {
    return null;
  }

  // Don't show if user dismissed (works for both iOS and Android)
  if (!showPrompt) {
    return null;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-6">
      <div className="bg-gradient-to-r from-[#235588] to-[#1a4066] rounded-lg p-4 shadow-md">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {isIOS ? (
              <>
                <h3 className="font-semibold text-base text-white mb-1">
                  Install for Quick Access
                </h3>
                <p className="text-sm text-white/90">
                  Tap{" "}
                  <span className="inline-flex items-center justify-center w-5 h-5 bg-white/20 rounded mx-1">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                    </svg>
                  </span>{" "}
                  then &quot;Add to Home Screen&quot; to access your routine
                  instantly
                </p>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-base text-white mb-1">
                    Get the App
                  </h3>
                  <p className="text-sm text-white/90">
                    Install for quick access to your skincare routine
                  </p>
                </div>
                <button
                  onClick={handleInstallClick}
                  className="bg-white text-[#235588] px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-50 transition-colors whitespace-nowrap"
                >
                  Install
                </button>
              </div>
            )}
          </div>
          <button
            onClick={handleDismiss}
            className="text-white/70 hover:text-white transition-colors flex-shrink-0"
            aria-label="Dismiss"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
