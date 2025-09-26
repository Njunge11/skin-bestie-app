// app/(marketing)/layout.tsx
import type { Metadata } from "next";
import Navigation from "@/components/Globals/Navigation/Navigation";
import { PreviewNotice } from "@/components/Globals/PreviewNotice/PreviewNotice";
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
      <Navigation />
      {/* <div className={anton.className}> // if you want a marketing-only font */}
      <main>{children}</main>
      <PreviewNotice />
      {/* </div> */}
    </div>
  );
}
