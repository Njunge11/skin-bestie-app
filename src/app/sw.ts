import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

// Properly declare the service worker global scope
declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: WorkerGlobalScope;

// Create and configure Serwist instance
const serwist = new Serwist({
  // Precache entries injected by Serwist build process
  precacheEntries: self.__SW_MANIFEST,

  // Force immediate activation (no more waiting!)
  skipWaiting: true,

  // Take control of all open tabs immediately
  clientsClaim: true,

  // Enable navigation preload for better performance
  navigationPreload: true,

  // Use Serwist's default runtime caching strategies
  // This handles all the caching logic your manual SW was doing
  runtimeCaching: defaultCache,
});

// Register Serwist event listeners (handles install, activate, fetch, etc.)
serwist.addEventListeners();
