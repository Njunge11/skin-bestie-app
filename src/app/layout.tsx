// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { neueHaasDisplay } from "./fonts";
import CookieConsent from "@/components/cookie-consent";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://skinbestie.com",
  ),
  title: {
    default: "SkinBestie - Your Honest Bestie for Better Healthier Skin",
    template: "%s | SkinBestie",
  },
  description:
    "We collaborate with you to curate a simple routine that's tailored to your lifestyle, your budget, and your skin goals.",
  keywords: [
    "skincare",
    "skin coaching",
    "personalized skincare",
    "skin routine",
    "skin health",
    "online skincare coach",
  ],
  authors: [{ name: "SkinBestie" }],
  creator: "SkinBestie",
  publisher: "SkinBestie",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "SkinBestie - Your Honest Bestie for Better Healthier Skin",
    description:
      "We collaborate with you to curate a simple routine that's tailored to your lifestyle, your budget, and your skin goals.",
    siteName: "SkinBestie",
    images: [
      {
        url: "/hero.jpg",
        width: 1200,
        height: 630,
        alt: "SkinBestie - Your Honest Bestie for Better Healthier Skin",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SkinBestie - Your Honest Bestie for Better Healthier Skin",
    description:
      "We collaborate with you to curate a simple routine that's tailored to your lifestyle, your budget, and your skin goals.",
    images: ["/hero.jpg"],
  },
  icons: {
    icon: "/Favicon.png",
    shortcut: "/Favicon.png",
    apple: "/Favicon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-black scroll-smooth scroll-pt-20">
      <body className={`${neueHaasDisplay.className} antialiased`}>
        <Providers>{children}</Providers>
        <CookieConsent />
      </body>
    </html>
  );
}
