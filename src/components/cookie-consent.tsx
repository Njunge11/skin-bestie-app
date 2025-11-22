"use client";

import { useEffect } from "react";
import * as CookieConsent from "vanilla-cookieconsent";
import "vanilla-cookieconsent/dist/cookieconsent.css";
import { cookieConsentConfig } from "@/lib/cookie-consent-config";

export default function CookieConsentBanner() {
  useEffect(() => {
    CookieConsent.run(cookieConsentConfig);

    // Brand styling only - colors for buttons, links, and toggles
    const style = document.createElement("style");
    style.textContent = `
      /* Accept All button - Brand blue */
      button[data-role="all"] {
        background-color: #235588 !important;
        border-color: #235588 !important;
        color: white !important;
      }

      button[data-role="all"]:hover {
        background-color: #1a4066 !important;
      }

      /* Reject All & Manage Preferences - Neutral gray */
      button[data-role="necessary"],
      button[data-role="show-preferencesModal"] {
        background-color: #f9f9fb !important;
        border: 1px solid #e5e7eb !important;
        color: #374151 !important;
      }

      button[data-role="necessary"]:hover,
      button[data-role="show-preferencesModal"]:hover {
        background-color: #f3f4f6 !important;
      }

      /* Links - Brand primary */
      #cc-main a {
        color: #f8817d !important;
      }

      /* Toggles - Brand primary */
      #cc-main .section__toggle input[type="checkbox"]:checked ~ .toggle__icon {
        background-color: #f8817d !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return null;
}

export const showCookiePreferences = () => {
  CookieConsent.show(true);
};

export const acceptCookieCategory = (category: string) => {
  CookieConsent.acceptCategory(category);
};

export const getCookieConsent = () => {
  return CookieConsent.getUserPreferences();
};
