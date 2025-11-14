// app/(marketing)/layout.tsx
import type { Metadata } from "next";

import Footer from "./footer";
import { ServerActionErrorBoundary } from "@/components/server-action-error-boundary";
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
    <ServerActionErrorBoundary>
      <div className="min-h-dvh bg-background text-foreground">
        {/* <div className={anton.className}> // if you want a marketing-only font */}

        <main>{children}</main>
        <Footer />

        {/* </div> */}
      </div>
    </ServerActionErrorBoundary>
  );
}
