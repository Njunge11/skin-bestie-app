"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if iOS
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
        !(window as Window & { MSStream?: unknown }).MSStream,
    );

    // Check if already installed
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);

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
    }

    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  // Don't show if already installed
  if (isStandalone) {
    return null;
  }

  // Don't show if user dismissed
  if (!showPrompt && !isIOS) {
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
