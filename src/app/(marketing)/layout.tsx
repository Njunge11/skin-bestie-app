// app/(marketing)/layout.tsx
import type { Metadata } from "next";

import Header from "./header";
import HeroSection from "./hero";
import Footer from "./footer";
// If you have app/fonts.ts exporting fonts, import them here
// import { anton } from "@/app/fonts";

export const metadata: Metadata = {
  title: "SkinBestie",
  description: "Personalized skincare, simplified.",
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      {/* <div className={anton.className}> // if you want a marketing-only font */}

      <main>{children}</main>
      <Footer />

      {/* </div> */}
    </div>
  );
}
