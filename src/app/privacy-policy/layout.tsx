import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - SkinBestie",
  description:
    "Learn how SkinBestie collects, uses, and protects your personal data. Our commitment to your privacy and data security.",
};

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
