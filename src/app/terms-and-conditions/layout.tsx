import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions - SkinBestie",
  description:
    "Read our terms and conditions for using SkinBestie's online skincare coaching services. Understand your rights and our commitments.",
};

export default function TermsAndConditionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
