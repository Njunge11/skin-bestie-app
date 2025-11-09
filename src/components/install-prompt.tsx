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
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">Install SkinBestie</h3>
          {isIOS ? (
            <p className="text-sm text-gray-600">
              Tap the share button{" "}
              <span className="inline-block">
                <svg
                  className="w-4 h-4 inline"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
              </span>{" "}
              and select &quot;Add to Home Screen&quot;
            </p>
          ) : (
            <>
              <p className="text-sm text-gray-600 mb-3">
                Get quick access to your skincare routine anytime
              </p>
              <button
                onClick={handleInstallClick}
                className="bg-[#235588] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#1a4066] transition-colors"
              >
                Install App
              </button>
            </>
          )}
        </div>
        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-gray-600"
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
  );
}
